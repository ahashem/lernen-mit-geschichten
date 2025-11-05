/**
 * Voice Recorder Utility
 * MediaRecorder API wrapper for recording custom story narrations
 * Supports audio processing, effects, compression, and IndexedDB storage
 */

export interface RecordingOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  maxDuration?: number; // in seconds
}

export interface AudioEffect {
  type: 'pitch' | 'speed' | 'echo' | 'reverb';
  value: number;
}

export interface RecordingMetadata {
  id: string;
  storyId: string;
  storyTitle: string;
  locale: string;
  duration: number;
  createdAt: number;
  pageIndex?: number;
  effects?: AudioEffect[];
  size: number;
  format: string;
}

export interface Recording {
  metadata: RecordingMetadata;
  blob: Blob;
}

// IndexedDB management
class RecordingDatabase {
  private dbName = 'story-recordings';
  private storeName = 'recordings';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'metadata.id' });
          store.createIndex('storyId', 'metadata.storyId', { unique: false });
          store.createIndex('createdAt', 'metadata.createdAt', { unique: false });
        }
      };
    });
  }

  async saveRecording(recording: Recording): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(recording);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getRecording(id: string): Promise<Recording | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getRecordingsByStory(storyId: string): Promise<Recording[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('storyId');
      const request = index.getAll(storyId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllRecordings(): Promise<Recording[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRecording(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getRecordingCount(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async enforceStorageLimit(maxRecordings: number = 20): Promise<void> {
    const count = await this.getRecordingCount();

    if (count > maxRecordings) {
      const allRecordings = await this.getAllRecordings();
      // Sort by creation date (oldest first)
      allRecordings.sort((a, b) => a.metadata.createdAt - b.metadata.createdAt);

      // Delete oldest recordings
      const toDelete = count - maxRecordings;
      for (let i = 0; i < toDelete; i++) {
        await this.deleteRecording(allRecordings[i].metadata.id);
      }
    }
  }
}

export const recordingDB = new RecordingDatabase();

// Voice Recorder class
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private maxDuration: number;
  private timerInterval: number | null = null;

  public onDataAvailable?: (data: Blob) => void;
  public onStop?: (blob: Blob) => void;
  public onPause?: () => void;
  public onResume?: () => void;
  public onError?: (error: Error) => void;
  public onTimeUpdate?: (seconds: number) => void;

  constructor(options: RecordingOptions = {}) {
    this.maxDuration = options.maxDuration || 300; // 5 minutes default
  }

  // Request microphone permission and initialize
  async init(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Setup audio context for visualization
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Determine best supported MIME type
      const mimeType = this.getSupportedMimeType();

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        audioBitsPerSecond: 128000, // Good quality with compression
      });

      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.onDataAvailable?.(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: mimeType });
        this.onStop?.(blob);
        this.stopTimer();
      };

      this.mediaRecorder.onpause = () => {
        this.pauseStartTime = Date.now();
        this.onPause?.();
      };

      this.mediaRecorder.onresume = () => {
        this.pausedDuration += Date.now() - this.pauseStartTime;
        this.onResume?.();
      };

      this.mediaRecorder.onerror = event => {
        this.onError?.(new Error('Recording error'));
      };
    } catch (error) {
      this.onError?.(error as Error);
      throw error;
    }
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/ogg',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  }

  start(): void {
    if (!this.mediaRecorder) {
      throw new Error('Recorder not initialized. Call init() first.');
    }

    if (this.mediaRecorder.state === 'recording') {
      return;
    }

    this.audioChunks = [];
    this.startTime = Date.now();
    this.pausedDuration = 0;
    this.mediaRecorder.start(100); // Collect data every 100ms for smooth visualization
    this.startTimer();
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private startTimer(): void {
    this.timerInterval = window.setInterval(() => {
      const elapsed = this.getElapsedTime();
      this.onTimeUpdate?.(elapsed);

      // Auto-stop at max duration
      if (elapsed >= this.maxDuration) {
        this.stop();
      }
    }, 100);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getElapsedTime(): number {
    if (!this.startTime) return 0;

    const now = Date.now();
    const elapsed = now - this.startTime - this.pausedDuration;
    return Math.floor(elapsed / 1000);
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused';
  }

  // Get waveform data for visualization
  getWaveformData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }

  // Get frequency data for visualization
  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  // Cleanup resources
  dispose(): void {
    this.stop();
    this.stopTimer();

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.analyser = null;
    this.dataArray = null;
  }
}

// Audio Effects Processing
export class AudioEffectsProcessor {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async applyEffects(blob: Blob, effects: AudioEffect[]): Promise<Blob> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      let processedBuffer = audioBuffer;

      for (const effect of effects) {
        switch (effect.type) {
          case 'pitch':
            processedBuffer = await this.applyPitchShift(processedBuffer, effect.value);
            break;
          case 'speed':
            processedBuffer = await this.applySpeedChange(processedBuffer, effect.value);
            break;
          case 'echo':
            processedBuffer = await this.applyEcho(processedBuffer, effect.value);
            break;
        }
      }

      return this.audioBufferToBlob(processedBuffer);
    } catch (error) {
      console.error('Failed to apply effects:', error);
      return blob; // Return original if processing fails
    }
  }

  private async applyPitchShift(
    buffer: AudioBuffer,
    semitones: number
  ): Promise<AudioBuffer> {
    const rate = Math.pow(2, semitones / 12);
    const newBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length / rate,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = newBuffer.getChannelData(channel);

      for (let i = 0; i < outputData.length; i++) {
        const position = i * rate;
        const index = Math.floor(position);
        const fraction = position - index;

        if (index + 1 < inputData.length) {
          outputData[i] = inputData[index] * (1 - fraction) + inputData[index + 1] * fraction;
        }
      }
    }

    return newBuffer;
  }

  private async applySpeedChange(buffer: AudioBuffer, rate: number): Promise<AudioBuffer> {
    const newLength = Math.floor(buffer.length / rate);
    const newBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      newLength,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = newBuffer.getChannelData(channel);

      for (let i = 0; i < outputData.length; i++) {
        const position = i * rate;
        const index = Math.floor(position);
        if (index < inputData.length) {
          outputData[i] = inputData[index];
        }
      }
    }

    return newBuffer;
  }

  private async applyEcho(buffer: AudioBuffer, delayTime: number): Promise<AudioBuffer> {
    const sampleRate = buffer.sampleRate;
    const delayInSamples = Math.floor(delayTime * sampleRate);
    const newBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      buffer.length + delayInSamples,
      sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = newBuffer.getChannelData(channel);

      // Copy original
      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i];
      }

      // Add echo
      for (let i = 0; i < inputData.length; i++) {
        const echoIndex = i + delayInSamples;
        if (echoIndex < outputData.length) {
          outputData[echoIndex] += inputData[i] * 0.5; // 50% volume echo
        }
      }
    }

    return newBuffer;
  }

  private audioBufferToBlob(buffer: AudioBuffer): Blob {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 4, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Audio data
    const channels = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

// Utility functions
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function generateRecordingId(): string {
  return `recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function exportRecording(recording: Recording, filename?: string): Promise<void> {
  const url = URL.createObjectURL(recording.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${recording.metadata.storyTitle}-narration.${recording.metadata.format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateQRCode(recording: Recording): Promise<string> {
  // For sharing, we'd create a shareable link
  // This is a placeholder - actual implementation would require a backend
  const shareData = {
    storyId: recording.metadata.storyId,
    recordingId: recording.metadata.id,
  };

  return `https://lernen-mit-geschichten.de/shared/${btoa(JSON.stringify(shareData))}`;
}
