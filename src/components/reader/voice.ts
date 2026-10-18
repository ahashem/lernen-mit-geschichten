import { fmt } from '@utils/i18n';
import { read, write } from './prefs';
import {
  canStore,
  loadRecordings,
  removeRecording,
  removeStoryRecordings,
  saveRecording,
} from './voice-store';

const MAX_SECONDS = 180;
const INTRO_KEY = 'reader-voice-intro';

const $ = <T extends HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector)!;

/**
 * "Read it in my voice": a grown-up records the story page by page on this device (ux/04). The reader plays the
 * object URLs this hands back; a page with no matching recording keeps the device voice.
 */
export function startVoice(
  app: HTMLElement,
  ctx: { storyId: string; locale: string; strings: Record<string, string>; texts: string[] },
  onChange: (urls: (string | undefined)[]) => void
) {
  const dialog = document.querySelector<HTMLDialogElement>('[data-voice]');
  const open = app.querySelector<HTMLButtonElement>('[data-action="record-voice"]');
  const supported =
    !!dialog &&
    !!open &&
    canStore() &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';
  if (!supported) return;
  open.hidden = false;
  const t = ctx.strings;
  const { storyId, locale, texts } = ctx;

  let saved: (Blob | undefined)[] = texts.map(() => undefined);
  let urls: (string | undefined)[] = [];
  let page = 0;
  let pending: Blob | null = null;
  let recorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let timer = 0;
  let started = 0;
  let denied = false;
  const player = new Audio();

  const intro = $(dialog, '[data-voice-intro]');
  const main = $(dialog, '[data-voice-main]');
  const live = $(dialog, '[data-voice-live]');
  const state = $(dialog, '[data-voice-state]');
  const btn = (name: string) => $<HTMLButtonElement>(dialog, `[data-voice-${name}]`);
  const say = (message: string) => (live.textContent = message);

  function publish() {
    for (const u of urls) if (u) URL.revokeObjectURL(u);
    urls = saved.map(b => (b ? URL.createObjectURL(b) : undefined));
    onChange(urls);
    render();
  }

  loadRecordings(storyId, locale, texts)
    .then(found => {
      saved = found;
      publish();
    })
    .catch(() => {
      /* storage refused: the device voice reads */
    });

  const blobOfPage = () => pending ?? saved[page];

  function render() {
    $(dialog, '[data-voice-page]').textContent = fmt(t.pageOf, {
      n: page + 1,
      total: texts.length,
    });
    $(dialog, '[data-voice-text]').textContent = texts[page];
    const recording = !!recorder;
    const has = !!saved[page];
    // After a take, "Record again" stays beside Keep; Keep is then the one primary action.
    btn('record').hidden = recording;
    btn('record').disabled = denied;
    btn('record').classList.toggle('btn--primary', !pending);
    btn('record').textContent = has || pending ? t.voiceAgain : t.voiceRecord;
    btn('stop').hidden = !recording;
    btn('play').hidden = recording || !blobOfPage();
    btn('keep').hidden = !pending;
    btn('delete').hidden = recording || !!pending || !has;
    btn('prev').disabled = recording || !!pending || page === 0;
    btn('next').disabled = recording || !!pending || page === texts.length - 1;
    if (!recording) state.textContent = pending ? '' : has ? t.voiceRecorded : t.voiceNone;
    btn('delete-all').hidden = !saved.some(Boolean);
    // The cover's "no recorded voice" note is about bundled narration; it must not outlive a parent's own.
    document
      .querySelectorAll<HTMLElement>('[data-no-voice]')
      .forEach(el => (el.hidden = saved.some(Boolean)));
  }

  function stopTracks() {
    window.clearInterval(timer);
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
  }

  async function record() {
    if (denied) return;
    pending = null;
    player.pause();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      denied = true;
      state.textContent = t.voiceDenied;
      say(t.voiceDenied);
      return render();
    }
    const chunks: Blob[] = [];
    const type = ['audio/webm;codecs=opus', 'audio/mp4'].find(x =>
      MediaRecorder.isTypeSupported(x)
    );
    recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      stopTracks();
      pending = new Blob(chunks, { type: recorder?.mimeType || type || 'audio/webm' });
      recorder = null;
      say(t.voiceStopped);
      render();
      btn('play').focus();
    };
    recorder.start();
    started = Date.now();
    const tick = () => {
      const s = Math.floor((Date.now() - started) / 1000);
      state.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (s >= MAX_SECONDS) recorder?.stop();
    };
    tick();
    timer = window.setInterval(tick, 500);
    say(t.voiceRecording);
    render();
    btn('stop').focus();
  }

  function discardPending() {
    if (recorder) {
      recorder.onstop = null;
      recorder.stop();
      recorder = null;
      stopTracks();
    }
    pending = null;
    player.pause();
  }

  const go = (to: number) => {
    page = to;
    render();
  };

  open.addEventListener('click', () => {
    const seen = read(INTRO_KEY) === '1';
    intro.hidden = seen;
    main.hidden = !seen;
    page = 0;
    render();
    dialog.showModal();
  });
  btn('continue').addEventListener('click', () => {
    write(INTRO_KEY, '1');
    intro.hidden = true;
    main.hidden = false;
    btn('record').focus();
  });
  btn('record').addEventListener('click', record);
  btn('stop').addEventListener('click', () => recorder?.stop());
  btn('play').addEventListener('click', () => {
    const blob = blobOfPage();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    player.src = url;
    player.onended = () => URL.revokeObjectURL(url);
    player.play().catch(() => say(t.noSoundNow));
  });
  btn('keep').addEventListener('click', async () => {
    if (!pending) return;
    try {
      await saveRecording(storyId, locale, page, pending, texts[page]);
      saved[page] = pending;
      pending = null;
      publish();
      say(t.voiceSaved);
    } catch {
      say(t.voiceFailed);
    }
    render();
    btn('record').focus();
  });
  btn('delete').addEventListener('click', async () => {
    await removeRecording(storyId, locale, page).catch(() => {});
    saved[page] = undefined;
    publish();
    say(t.voiceDeleted);
    render();
    btn('record').focus();
  });
  btn('prev').addEventListener('click', () => go(page - 1));
  btn('next').addEventListener('click', () => go(page + 1));

  const confirm = $(dialog, '[data-voice-confirm]');
  btn('delete-all').addEventListener('click', () => {
    confirm.hidden = false;
    btn('confirm-no').focus();
  });
  btn('confirm-no').addEventListener('click', () => {
    confirm.hidden = true;
    btn('delete-all').focus();
  });
  btn('confirm-yes').addEventListener('click', async () => {
    await removeStoryRecordings(storyId, locale, texts.length).catch(() => {});
    saved = texts.map(() => undefined);
    publish();
    confirm.hidden = true;
    say(t.voiceDeleted);
    render();
    btn('record').focus();
  });

  btn('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    discardPending();
    confirm.hidden = true;
    open.focus();
  });
}
