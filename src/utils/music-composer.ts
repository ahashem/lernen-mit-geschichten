/**
 * Music Composer System
 * Allows children to compose simple melodies and background music for their stories
 * Uses Tone.js for audio synthesis and Web Audio API
 */

import * as Tone from 'tone';

export type InstrumentType = 'piano' | 'guitar' | 'flute' | 'drums' | 'xylophone' | 'trumpet' | 'violin' | 'bells';
export type TimeSignature = '4/4' | '3/4' | '6/8';
export type ScaleType = 'major' | 'minor' | 'pentatonic' | 'chromatic';
export type NoteLength = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface Note {
  id: string;
  pitch: string; // e.g., "C4", "D#5"
  start: number; // Beat position (0-512 for 32 measures of 16 beats)
  length: number; // Duration in beats
  velocity: number; // 0-1
}

export interface InstrumentTrack {
  id: string;
  name: string;
  instrument: InstrumentType;
  notes: Note[];
  volume: number; // 0-100
  pan: number; // -1 to 1 (left to right)
  reverb: number; // 0-100
  solo: boolean;
  muted: boolean;
}

export interface Composition {
  id: string;
  title: string;
  bpm: number; // 60-180
  timeSignature: TimeSignature;
  measures: number; // 1-32
  tracks: InstrumentTrack[];
  createdAt: number;
  updatedAt: number;
  template?: string;
}

export interface ChordDefinition {
  name: string;
  intervals: number[];
}

export interface RhythmPattern {
  name: string;
  pattern: number[]; // Beat positions
}

// Chord progressions
export const CHORDS: Record<string, ChordDefinition> = {
  'C': { name: 'C Major', intervals: [0, 4, 7] },
  'Cm': { name: 'C Minor', intervals: [0, 3, 7] },
  'G': { name: 'G Major', intervals: [7, 11, 14] },
  'Gm': { name: 'G Minor', intervals: [7, 10, 14] },
  'F': { name: 'F Major', intervals: [5, 9, 12] },
  'Fm': { name: 'F Minor', intervals: [5, 8, 12] },
  'Am': { name: 'A Minor', intervals: [9, 12, 16] },
  'Em': { name: 'E Minor', intervals: [4, 7, 11] },
  'D': { name: 'D Major', intervals: [2, 6, 9] },
  'Dm': { name: 'D Minor', intervals: [2, 5, 9] },
};

// Rhythm patterns for drums
export const RHYTHM_PATTERNS: RhythmPattern[] = [
  { name: 'Basic Rock', pattern: [0, 4, 8, 12] },
  { name: 'Waltz', pattern: [0, 4, 8] },
  { name: 'Swing', pattern: [0, 3, 6, 9, 12, 15] },
  { name: 'March', pattern: [0, 2, 4, 6, 8, 10, 12, 14] },
  { name: 'Syncopated', pattern: [0, 3, 6, 10, 13] },
  { name: 'Disco', pattern: [0, 4, 8, 12, 2, 6, 10, 14] },
  { name: 'Shuffle', pattern: [0, 4, 8, 12, 1, 5, 9, 13] },
  { name: 'Reggae', pattern: [2, 6, 10, 14] },
  { name: 'Bossa Nova', pattern: [0, 3, 6, 9, 12, 14] },
  { name: 'Samba', pattern: [0, 2, 4, 6, 8, 10, 12, 14] },
  { name: 'House', pattern: [0, 4, 8, 12] },
  { name: 'Hip Hop', pattern: [0, 4, 8, 12, 14] },
  { name: 'Jazz', pattern: [0, 3, 7, 10, 13] },
  { name: 'Country', pattern: [0, 4, 8, 10, 12] },
  { name: 'Latin', pattern: [0, 3, 5, 8, 11, 13] },
  { name: 'Funk', pattern: [0, 2, 6, 8, 10, 14] },
];

// Pre-made templates
export const TEMPLATES: Record<string, Partial<Composition>> = {
  'happy-adventure': {
    title: 'Happy Adventure',
    bpm: 120,
    timeSignature: '4/4',
    measures: 16,
    template: 'happy-adventure',
  },
  'calm-bedtime': {
    title: 'Calm Bedtime',
    bpm: 70,
    timeSignature: '4/4',
    measures: 16,
    template: 'calm-bedtime',
  },
  'exciting-chase': {
    title: 'Exciting Chase',
    bpm: 140,
    timeSignature: '4/4',
    measures: 16,
    template: 'exciting-chase',
  },
  'magical-wonder': {
    title: 'Magical Wonder',
    bpm: 90,
    timeSignature: '3/4',
    measures: 16,
    template: 'magical-wonder',
  },
  'silly-fun': {
    title: 'Silly Fun',
    bpm: 130,
    timeSignature: '4/4',
    measures: 16,
    template: 'silly-fun',
  },
  'sad-moment': {
    title: 'Sad Moment',
    bpm: 60,
    timeSignature: '4/4',
    measures: 16,
    template: 'sad-moment',
  },
  'victory-celebration': {
    title: 'Victory Celebration',
    bpm: 140,
    timeSignature: '4/4',
    measures: 16,
    template: 'victory-celebration',
  },
  'forest-sounds': {
    title: 'Forest Sounds',
    bpm: 80,
    timeSignature: '6/8',
    measures: 16,
    template: 'forest-sounds',
  },
  'space-journey': {
    title: 'Space Journey',
    bpm: 100,
    timeSignature: '4/4',
    measures: 16,
    template: 'space-journey',
  },
  'birthday-party': {
    title: 'Birthday Party',
    bpm: 120,
    timeSignature: '4/4',
    measures: 16,
    template: 'birthday-party',
  },
};

// Scale definitions
export const SCALES: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

// Note length to beats mapping
export const NOTE_LENGTH_BEATS: Record<NoteLength, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
};

export class MusicComposer {
  private composition: Composition;
  private synths: Map<string, Tone.PolySynth | Tone.Sampler | Tone.NoiseSynth>;
  private effects: Map<string, { reverb: Tone.Reverb; panner: Tone.Panner }>;
  private isPlaying: boolean = false;
  private currentBeat: number = 0;
  private loopStart: number = 0;
  private loopEnd: number = 16;
  private metronomeEnabled: boolean = false;
  private metronomeClick?: Tone.Sampler;
  private recorder?: Tone.Recorder;
  private isRecording: boolean = false;

  constructor(composition?: Composition) {
    this.composition = composition || this.createEmptyComposition();
    this.synths = new Map();
    this.effects = new Map();
    this.initializeInstruments();
  }

  private createEmptyComposition(): Composition {
    return {
      id: this.generateId(),
      title: 'New Composition',
      bpm: 120,
      timeSignature: '4/4',
      measures: 16,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  private generateId(): string {
    return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeInstruments(): void {
    // Initialize Tone.js audio context
    if (Tone.context.state !== 'running') {
      Tone.start();
    }

    // Create metronome click
    this.metronomeClick = new Tone.Sampler({
      C4: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    }).toDestination();
  }

  private getOrCreateSynth(trackId: string, instrument: InstrumentType): Tone.PolySynth | Tone.Sampler | Tone.NoiseSynth {
    if (this.synths.has(trackId)) {
      return this.synths.get(trackId)!;
    }

    let synth: Tone.PolySynth | Tone.Sampler | Tone.NoiseSynth;

    switch (instrument) {
      case 'piano':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 0.8 },
        });
        break;

      case 'guitar':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 1.2 },
        });
        break;

      case 'flute':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 },
        });
        break;

      case 'xylophone':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'square' },
          envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.2 },
        });
        break;

      case 'trumpet':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.4 },
        });
        break;

      case 'violin':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 },
        });
        break;

      case 'bells':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.5, sustain: 0.2, release: 1.5 },
        });
        break;

      case 'drums':
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
        });
        break;

      default:
        synth = new Tone.PolySynth(Tone.Synth);
    }

    // Create effects chain
    const reverb = new Tone.Reverb({ decay: 1.5, wet: 0 });
    const panner = new Tone.Panner(0);

    reverb.toDestination();
    panner.connect(reverb);
    synth.connect(panner);

    this.effects.set(trackId, { reverb, panner });
    this.synths.set(trackId, synth);

    return synth;
  }

  /**
   * Add a new track
   */
  addTrack(instrument: InstrumentType, name?: string): string {
    const track: InstrumentTrack = {
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || `${instrument} ${this.composition.tracks.length + 1}`,
      instrument,
      notes: [],
      volume: 80,
      pan: 0,
      reverb: 20,
      solo: false,
      muted: false,
    };

    this.composition.tracks.push(track);
    this.composition.updatedAt = Date.now();
    this.getOrCreateSynth(track.id, instrument);

    return track.id;
  }

  /**
   * Remove a track
   */
  removeTrack(trackId: string): void {
    const index = this.composition.tracks.findIndex(t => t.id === trackId);
    if (index !== -1) {
      this.composition.tracks.splice(index, 1);
      this.composition.updatedAt = Date.now();

      // Clean up synth
      const synth = this.synths.get(trackId);
      if (synth) {
        synth.dispose();
        this.synths.delete(trackId);
      }

      // Clean up effects
      const effects = this.effects.get(trackId);
      if (effects) {
        effects.reverb.dispose();
        effects.panner.dispose();
        this.effects.delete(trackId);
      }
    }
  }

  /**
   * Add a note to a track
   */
  addNote(trackId: string, pitch: string, start: number, length: number = 1, velocity: number = 0.8): string {
    const track = this.composition.tracks.find(t => t.id === trackId);
    if (!track) {
      throw new Error(`Track ${trackId} not found`);
    }

    const note: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pitch,
      start,
      length,
      velocity,
    };

    track.notes.push(note);
    this.composition.updatedAt = Date.now();

    return note.id;
  }

  /**
   * Remove a note
   */
  removeNote(trackId: string, noteId: string): void {
    const track = this.composition.tracks.find(t => t.id === trackId);
    if (track) {
      const index = track.notes.findIndex(n => n.id === noteId);
      if (index !== -1) {
        track.notes.splice(index, 1);
        this.composition.updatedAt = Date.now();
      }
    }
  }

  /**
   * Update a note
   */
  updateNote(trackId: string, noteId: string, updates: Partial<Note>): void {
    const track = this.composition.tracks.find(t => t.id === trackId);
    if (track) {
      const note = track.notes.find(n => n.id === noteId);
      if (note) {
        Object.assign(note, updates);
        this.composition.updatedAt = Date.now();
      }
    }
  }

  /**
   * Add a chord to a track
   */
  addChord(trackId: string, chordName: string, start: number, length: number = 2): string[] {
    const chord = CHORDS[chordName];
    if (!chord) {
      throw new Error(`Chord ${chordName} not found`);
    }

    const noteIds: string[] = [];
    const baseNote = 60; // C4 in MIDI

    chord.intervals.forEach(interval => {
      const midiNote = baseNote + interval;
      const pitch = Tone.Frequency(midiNote, 'midi').toNote();
      const noteId = this.addNote(trackId, pitch, start, length);
      noteIds.push(noteId);
    });

    return noteIds;
  }

  /**
   * Apply rhythm pattern to drum track
   */
  applyRhythmPattern(trackId: string, patternName: string, startMeasure: number = 0, measures: number = 4): void {
    const pattern = RHYTHM_PATTERNS.find(p => p.name === patternName);
    if (!pattern) {
      throw new Error(`Rhythm pattern ${patternName} not found`);
    }

    const track = this.composition.tracks.find(t => t.id === trackId);
    if (!track || track.instrument !== 'drums') {
      return;
    }

    const beatsPerMeasure = parseInt(this.composition.timeSignature.split('/')[0]);

    for (let m = 0; m < measures; m++) {
      const measureStart = (startMeasure + m) * beatsPerMeasure;
      pattern.pattern.forEach(beat => {
        this.addNote(trackId, 'C4', measureStart + beat, 0.25, 0.8);
      });
    }
  }

  /**
   * Update track settings
   */
  updateTrack(trackId: string, updates: Partial<InstrumentTrack>): void {
    const track = this.composition.tracks.find(t => t.id === trackId);
    if (!track) return;

    Object.assign(track, updates);

    // Update effects
    const effects = this.effects.get(trackId);
    if (effects) {
      if (updates.volume !== undefined) {
        const synth = this.synths.get(trackId);
        if (synth) {
          synth.volume.value = Tone.gainToDb(updates.volume / 100);
        }
      }

      if (updates.pan !== undefined) {
        effects.panner.pan.value = updates.pan;
      }

      if (updates.reverb !== undefined) {
        effects.reverb.wet.value = updates.reverb / 100;
      }
    }

    this.composition.updatedAt = Date.now();
  }

  /**
   * Play composition
   */
  async play(): Promise<void> {
    if (this.isPlaying) return;

    await Tone.start();
    this.isPlaying = true;

    Tone.Transport.bpm.value = this.composition.bpm;

    // Schedule all notes
    this.composition.tracks.forEach(track => {
      if (track.muted) return;

      // Check if any track is solo
      const hasSolo = this.composition.tracks.some(t => t.solo);
      if (hasSolo && !track.solo) return;

      const synth = this.getOrCreateSynth(track.id, track.instrument);

      track.notes.forEach(note => {
        const time = (note.start / 4) * Tone.Time('1m').toSeconds();
        const duration = (note.length / 4) * Tone.Time('1m').toSeconds();

        Tone.Transport.schedule(() => {
          if (track.instrument === 'drums') {
            (synth as Tone.NoiseSynth).triggerAttackRelease(duration);
          } else {
            (synth as Tone.PolySynth).triggerAttackRelease(note.pitch, duration, undefined, note.velocity);
          }
        }, time);
      });
    });

    // Schedule metronome
    if (this.metronomeEnabled && this.metronomeClick) {
      const beatsPerMeasure = parseInt(this.composition.timeSignature.split('/')[0]);
      const totalBeats = this.composition.measures * beatsPerMeasure;

      for (let beat = 0; beat < totalBeats; beat++) {
        const time = (beat / 4) * Tone.Time('1m').toSeconds();
        Tone.Transport.schedule(() => {
          this.metronomeClick?.triggerAttackRelease('C5', '0.1');
        }, time);
      }
    }

    Tone.Transport.start();
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.isPlaying = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.currentBeat = 0;
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.isPlaying = false;
    Tone.Transport.pause();
  }

  /**
   * Toggle metronome
   */
  toggleMetronome(): void {
    this.metronomeEnabled = !this.metronomeEnabled;
  }

  /**
   * Set loop points
   */
  setLoop(start: number, end: number): void {
    this.loopStart = start;
    this.loopEnd = end;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = (start / 4) * Tone.Time('1m').toSeconds();
    Tone.Transport.loopEnd = (end / 4) * Tone.Time('1m').toSeconds();
  }

  /**
   * Export as audio file
   */
  async exportAudio(format: 'wav' | 'mp3' = 'wav'): Promise<Blob> {
    // Create recorder
    const recorder = new Tone.Recorder();

    // Connect all synths to recorder
    this.synths.forEach(synth => {
      synth.connect(recorder);
    });

    // Start recording
    recorder.start();

    // Play composition
    await this.play();

    // Wait for composition to finish
    const duration = (this.composition.measures * 4 / 4) * Tone.Time('1m').toSeconds();
    await new Promise(resolve => setTimeout(resolve, duration * 1000 + 1000));

    // Stop recording
    const recording = await recorder.stop();

    return recording;
  }

  /**
   * Export as MIDI file
   */
  exportMIDI(): Blob {
    // Simple MIDI file generation
    const midiData: number[] = [
      0x4d, 0x54, 0x68, 0x64, // "MThd" header
      0x00, 0x00, 0x00, 0x06, // Header length
      0x00, 0x01, // Format 1
      0x00, this.composition.tracks.length + 1, // Number of tracks
      0x00, 0x60, // Ticks per quarter note
    ];

    // Add tracks
    this.composition.tracks.forEach(track => {
      // Track header
      midiData.push(0x4d, 0x54, 0x72, 0x6b); // "MTrk"

      const trackData: number[] = [];

      // Add notes
      track.notes.forEach(note => {
        const midiNote = Tone.Frequency(note.pitch).toMidi();
        const startTicks = Math.round(note.start * 96);
        const durationTicks = Math.round(note.length * 96);

        // Note on
        trackData.push(
          ...this.encodeVariableLength(startTicks),
          0x90, // Note on
          midiNote,
          Math.round(note.velocity * 127)
        );

        // Note off
        trackData.push(
          ...this.encodeVariableLength(durationTicks),
          0x80, // Note off
          midiNote,
          0
        );
      });

      // End of track
      trackData.push(0x00, 0xff, 0x2f, 0x00);

      // Add track length
      const length = trackData.length;
      midiData.push(
        (length >> 24) & 0xff,
        (length >> 16) & 0xff,
        (length >> 8) & 0xff,
        length & 0xff
      );

      midiData.push(...trackData);
    });

    return new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
  }

  private encodeVariableLength(value: number): number[] {
    const bytes: number[] = [];
    bytes.unshift(value & 0x7f);

    while (value >>= 7) {
      bytes.unshift((value & 0x7f) | 0x80);
    }

    return bytes;
  }

  /**
   * Get scale notes
   */
  getScaleNotes(scaleType: ScaleType, rootNote: string = 'C4'): string[] {
    const scale = SCALES[scaleType];
    const rootMidi = Tone.Frequency(rootNote).toMidi();

    return scale.map(interval => {
      return Tone.Frequency(rootMidi + interval, 'midi').toNote();
    });
  }

  /**
   * Quantize notes (snap to grid)
   */
  quantize(trackId: string, gridSize: number = 0.25): void {
    const track = this.composition.tracks.find(t => t.id === trackId);
    if (!track) return;

    track.notes.forEach(note => {
      note.start = Math.round(note.start / gridSize) * gridSize;
      note.length = Math.round(note.length / gridSize) * gridSize;
    });

    this.composition.updatedAt = Date.now();
  }

  /**
   * Get composition
   */
  getComposition(): Composition {
    return this.composition;
  }

  /**
   * Load composition
   */
  loadComposition(composition: Composition): void {
    this.stop();
    this.composition = composition;

    // Clean up old synths
    this.synths.forEach(synth => synth.dispose());
    this.effects.forEach(effects => {
      effects.reverb.dispose();
      effects.panner.dispose();
    });

    this.synths.clear();
    this.effects.clear();

    // Initialize new instruments
    this.composition.tracks.forEach(track => {
      this.getOrCreateSynth(track.id, track.instrument);
    });
  }

  /**
   * Save composition to localStorage
   */
  save(): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('music-compositions');
    const compositions: Composition[] = saved ? JSON.parse(saved) : [];

    const index = compositions.findIndex(c => c.id === this.composition.id);
    if (index !== -1) {
      compositions[index] = this.composition;
    } else {
      compositions.push(this.composition);
    }

    localStorage.setItem('music-compositions', JSON.stringify(compositions));
  }

  /**
   * Load composition from localStorage
   */
  static load(id: string): Composition | null {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem('music-compositions');
    if (!saved) return null;

    const compositions: Composition[] = JSON.parse(saved);
    return compositions.find(c => c.id === id) || null;
  }

  /**
   * Get all saved compositions
   */
  static getAllCompositions(): Composition[] {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem('music-compositions');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Delete composition
   */
  static deleteComposition(id: string): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('music-compositions');
    if (!saved) return;

    const compositions: Composition[] = JSON.parse(saved);
    const filtered = compositions.filter(c => c.id !== id);
    localStorage.setItem('music-compositions', JSON.stringify(filtered));
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stop();
    this.synths.forEach(synth => synth.dispose());
    this.effects.forEach(effects => {
      effects.reverb.dispose();
      effects.panner.dispose();
    });
    this.metronomeClick?.dispose();
  }
}
