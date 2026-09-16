/*
 * sloptris - audio.js
 *
 * Web Audio wrapper. No dependencies, no modules, no build step: one IIFE that
 * exposes window.SloptrisAudio. Touches nothing but localStorage (the sound
 * setting) and the Web Audio API.
 *
 * Every cue in the manifest below has a synthesized fallback, so the game is
 * fully playable with an empty audio/ folder. Drop a real file into audio/ with
 * the name in the manifest and it plays instead, with no code change.
 *
 * Shipped assets (see audio/README.md for the mapping and credits): sixteen
 * cues use CC0 Ogg Vorbis clips from Kenney's Interface Sounds and Digital
 * Audio packs, the music is a CC0 chiptune loop by Juhani Junkala, and four
 * cues (mutate, refactor, review_charge, typing) are low-pitched WAVs
 * generated for this game. The synthesized fallbacks below still cover any
 * file that is missing or fails to decode.
 *
 * The AudioContext is never created at load time - only inside unlock(), which
 * the game calls from the start / resume / again gesture (SPEC 9.1).
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ *
   * CUE MANIFEST
   *
   * One object, every cue from SPEC 9.2 plus 'music'. Entry shape:
   *
   *   file     path of the optional real asset, relative to the page
   *   wave     oscillator type for the fallback ('square' | 'triangle' | ...)
   *   freq     fallback start frequency in Hz
   *   freqEnd  optional end frequency (exponential sweep across dur)
   *   dur      fallback length in seconds
   *   gain     fallback peak gain (pre-master; master sits at 0.5)
   *   fileGain gain for the decoded file when one loaded (defaults to gain).
   *            Real clips are much softer per unit gain than the square-wave
   *            fallbacks, so most are set well above gain.
   *   notes    optional [{ freq, at, dur, freqEnd, gain, wave }] for multi-note
   *            fallbacks; "at" is an offset in seconds from the cue start
   *   warble   optional { rate, depth } frequency LFO, for the glitch cues
   *   enabled  optional; false means play() ignores the cue entirely
   *   loop     optional; a decoded buffer loops (music, review_charge)
   *   sustain  optional; the cue is held (review_charge), not fire-and-forget
   *
   * Fallbacks are terminal noises, not synth patches: short, square or
   * triangle, low volume, quick attack and an exponential-ish release.
   * ------------------------------------------------------------------ */
  var CUES = {
    /* a workbench cell is toggled - short tick */
    wb_toggle: { file: 'audio/wb_toggle.ogg', fileGain: 0.9, wave: 'square', freq: 1180, dur: 0.022, gain: 0.10 },

    /* four cells filled that do not match the ticket - low two-tone buzz */
    wb_reject: {
      file: 'audio/wb_reject.ogg', fileGain: 0.8, wave: 'square', freq: 118, dur: 0.10, gain: 0.18,
      notes: [
        { freq: 118, at: 0, dur: 0.09 },
        { freq: 88, at: 0.10, dur: 0.14 }
      ]
    },

    /* a hand-built piece is accepted and spawns - rising two-note */
    build: {
      file: 'audio/build.ogg', fileGain: 0.5, wave: 'triangle', freq: 440, dur: 0.08, gain: 0.17,
      notes: [
        { freq: 440, at: 0, dur: 0.07 },
        { freq: 660, at: 0.075, dur: 0.11 }
      ]
    },

    /* a piece is generated - quick descending blip */
    generate: { file: 'audio/generate.ogg', fileGain: 0.9, wave: 'square', freq: 900, freqEnd: 420, dur: 0.09, gain: 0.15 },

    /* the falling piece moves one cell - very short tick */
    move: { file: 'audio/move.ogg', fileGain: 0.5, wave: 'square', freq: 620, dur: 0.015, gain: 0.08 },

    /* the falling piece rotates - the same tick, slightly higher */
    rotate: { file: 'audio/rotate.ogg', fileGain: 0.7, wave: 'square', freq: 790, dur: 0.018, gain: 0.09 },

    /* each cell of soft drop - faint tick */
    soft_drop: { file: 'audio/soft_drop.ogg', fileGain: 0.3, wave: 'triangle', freq: 330, dur: 0.014, gain: 0.05 },

    /* a hard drop lands - low thud */
    hard_drop: { file: 'audio/hard_drop.ogg', fileGain: 1, wave: 'triangle', freq: 96, freqEnd: 54, dur: 0.13, gain: 0.30 },

    /* any piece locks - short low click */
    lock: { file: 'audio/lock.ogg', fileGain: 0.9, wave: 'square', freq: 200, freqEnd: 150, dur: 0.038, gain: 0.20 },

    /* one or more lines clear - rising chirp */
    clear: { file: 'audio/clear.ogg', fileGain: 0.9, wave: 'triangle', freq: 520, freqEnd: 1320, dur: 0.22, gain: 0.22 },

    /* the ... beat before a mutation - low muted tone */
    mutate_beat: { file: 'audio/mutate_beat.ogg', fileGain: 0.4, wave: 'triangle', freq: 158, dur: 0.18, gain: 0.12 },

    /* the cells swap - warbling glitch */
    mutate: {
      file: 'audio/mutate.wav', fileGain: 0.45, wave: 'square', freq: 300, freqEnd: 520, dur: 0.30, gain: 0.17,
      warble: { rate: 27, depth: 85 }
    },

    /* a board refactor applies - the same glitch, longer and lower */
    refactor: {
      file: 'audio/refactor.wav', fileGain: 0.45, wave: 'square', freq: 230, freqEnd: 138, dur: 0.62, gain: 0.18,
      warble: { rate: 16, depth: 140 }
    },

    /* sustained while a review hold is active (startCharge / setCharge /
       stopCharge). freq..freqEnd is the range the charge sweeps through. A
       decoded review_charge file is looped and pitched with playbackRate
       instead. dur is used only when the cue is auditioned from the dev panel. */
    review_charge: {
      file: 'audio/review_charge.wav', fileGain: 0.3, wave: 'triangle', freq: 110, freqEnd: 330,
      dur: 0.30, gain: 0.12, sustain: true, loop: true
    },

    /* the pulse fires on a stable piece - warm soft tone */
    pulse_stable: { file: 'audio/pulse_stable.ogg', fileGain: 0.7, wave: 'triangle', freq: 528, dur: 0.34, gain: 0.18 },

    /* the pulse fires on a mutating piece - dissonant two-tone */
    pulse_mutate: {
      file: 'audio/pulse_mutate.ogg', fileGain: 0.45, wave: 'square', freq: 466, dur: 0.30, gain: 0.13,
      notes: [
        { freq: 466, at: 0, dur: 0.30 },
        { freq: 330, at: 0.02, dur: 0.30 }
      ]
    },

    /* a sprint transition - two-note fanfare, kept flat and quiet */
    sprint: {
      file: 'audio/sprint.ogg', fileGain: 0.6, wave: 'square', freq: 392, dur: 0.12, gain: 0.13,
      notes: [
        { freq: 392, at: 0, dur: 0.10 },
        { freq: 523, at: 0.11, dur: 0.16 }
      ]
    },

    /* the clock reaches 0:10 - short alarm beep, twice */
    deadline_warn: {
      file: 'audio/deadline_warn.ogg', fileGain: 0.7, wave: 'square', freq: 1046, dur: 0.08, gain: 0.16,
      notes: [
        { freq: 1046, at: 0, dur: 0.075 },
        { freq: 1046, at: 0.12, dur: 0.075 }
      ]
    },

    /* each character the assistant types - extremely quiet. Set enabled: false
       here to silence the typewriter without touching game.js. */
    typing: { file: 'audio/typing.wav', fileGain: 0.12, wave: 'square', freq: 1500, dur: 0.008, gain: 0.03, enabled: true },

    /* game over - descending three-note */
    topout: {
      file: 'audio/topout.ogg', fileGain: 0.5, wave: 'triangle', freq: 440, dur: 0.16, gain: 0.22,
      notes: [
        { freq: 440, at: 0, dur: 0.14 },
        { freq: 330, at: 0.16, dur: 0.14 },
        { freq: 220, at: 0.32, dur: 0.34 }
      ]
    },

    /* music: file only. No synthesized fallback - missing means silence. */
    music: { file: 'audio/loop.mp3', gain: 0.35, loop: true }
  };

  /* ------------------------------------------------------------------ *
   * INTERNAL STATE
   * ------------------------------------------------------------------ */
  var SOUND_KEY = 'sloptris.sound';   /* no longer read or written; cleared on load below */
  var MASTER_GAIN = 0.5;
  var MIN_GAIN = 0.0001;          /* exponential ramps cannot reach zero */
  var CHARGE_SMOOTH = 0.05;       /* setTargetAtTime time constant, seconds */

  var ctx = null;                 /* created only in unlock() */
  var master = null;
  var buffers = Object.create(null);

  var enabledCache = null;        /* false on first read: sound starts off every load */
  try { global.localStorage.removeItem(SOUND_KEY); } catch (err) { /* private mode */ }
  var loadStarted = false;
  var loadLogged = false;
  var fetchBlocked = false;       /* a file:// page refused one fetch: skip the rest */
  var isFileProtocol = false;
  try {
    isFileProtocol = !!(global.location && global.location.protocol === 'file:');
  } catch (e) {
    isFileProtocol = false;
  }

  var musicWanted = false;        /* the game wants music, independent of the toggle */
  var musicNodes = null;          /* { src, gain } */
  var charge = null;              /* { node, gain, isBuffer } */

  function noop() {}

  function clamp01(n) {
    n = Number(n);
    if (!isFinite(n)) return 0;
    return n < 0 ? 0 : (n > 1 ? 1 : n);
  }

  /* ------------------------------------------------------------------ *
   * SYNTHESIZED FALLBACKS
   * ------------------------------------------------------------------ */

  /* One oscillator with a quick-attack, exponential-release envelope. */
  function tone(wave, freq, freqEnd, dur, peak, at, warble) {
    var t0 = at;
    var d = dur > 0.005 ? dur : 0.005;
    var g = ctx.createGain();
    var attack = Math.max(0.0012, Math.min(0.008, d * 0.3));
    var top = Math.max(MIN_GAIN * 2, peak || 0.1);

    g.gain.setValueAtTime(MIN_GAIN, t0);
    g.gain.exponentialRampToValueAtTime(top, t0 + attack);
    g.gain.exponentialRampToValueAtTime(MIN_GAIN, t0 + d);
    g.gain.setValueAtTime(0, t0 + d + 0.004);

    var osc = ctx.createOscillator();
    osc.type = wave || 'square';
    osc.frequency.setValueAtTime(Math.max(1, freq), t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + d);

    var lfo = null;
    var lfoGain = null;
    if (warble && warble.rate) {
      lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.setValueAtTime(warble.rate, t0);
      lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(warble.depth || 60, t0);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + d + 0.02);
    }

    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + d + 0.02);
    osc.onended = function () {
      try {
        osc.disconnect();
        g.disconnect();
        if (lfo) lfo.disconnect();
        if (lfoGain) lfoGain.disconnect();
      } catch (err) { /* already gone */ }
    };
  }

  function synth(cue) {
    var t0 = ctx.currentTime + 0.002;
    var i, n;
    if (cue.notes && cue.notes.length) {
      for (i = 0; i < cue.notes.length; i++) {
        n = cue.notes[i];
        tone(
          n.wave || cue.wave,
          n.freq,
          n.freqEnd,
          n.dur == null ? cue.dur : n.dur,
          n.gain == null ? cue.gain : n.gain,
          t0 + (n.at || 0),
          cue.warble
        );
      }
      return;
    }
    tone(cue.wave, cue.freq, cue.freqEnd, cue.dur, cue.gain, t0, cue.warble);
  }

  function fileGainOf(cue) {
    return cue.fileGain == null ? cue.gain : cue.fileGain;
  }

  function playBuffer(buf, peak) {
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var g = ctx.createGain();
    g.gain.value = peak == null ? 0.25 : peak;
    src.connect(g);
    g.connect(master);
    src.start();
    src.onended = function () {
      try { src.disconnect(); g.disconnect(); } catch (err) { /* already gone */ }
    };
  }

  /* ------------------------------------------------------------------ *
   * ASSET LOADING (starts inside unlock(), after the context exists)
   * ------------------------------------------------------------------ */

  function fetchArrayBuffer(url) {
    return new Promise(function (resolve, reject) {
      if (fetchBlocked || typeof global.fetch !== 'function') { reject(); return; }
      var p;
      try {
        p = global.fetch(url, { cache: 'no-cache' });
      } catch (err) {
        if (isFileProtocol) fetchBlocked = true;
        reject(err);
        return;
      }
      p.then(function (res) {
        if (!res || !res.ok) { reject(); return; }   /* 404: fall back, quietly */
        resolve(res.arrayBuffer());
      }, function (err) {
        /* A file:// page cannot fetch at all in most browsers. One refusal means
           every other cue would be refused the same way, so stop asking and keep
           the console quiet. Serve the folder over http to load real assets. */
        if (isFileProtocol) fetchBlocked = true;
        reject(err);
      });
    });
  }

  function decode(arrayBuffer) {
    return new Promise(function (resolve, reject) {
      var p;
      try {
        p = ctx.decodeAudioData(arrayBuffer, resolve, reject);
      } catch (err) {
        reject(err);
        return;
      }
      if (p && typeof p.then === 'function') p.then(resolve, reject);
    });
  }

  function loadOne(name, url) {
    return fetchArrayBuffer(url).then(decode).then(function (buf) {
      if (!buf) return false;
      buffers[name] = buf;
      if (name === 'music') maybeStartMusic();
      return true;
    });
  }

  function loadAll() {
    if (loadStarted || !ctx) return;
    loadStarted = true;

    var names = cueNames();
    var pending = names.length;
    var missing = 0;

    function done(ok) {
      if (!ok) missing++;
      pending--;
      if (pending > 0) return;
      if (missing > 0 && !loadLogged) {
        loadLogged = true;
        /* At most one line, ever. Missing files are the expected state. */
        if (global.console && global.console.info) {
          global.console.info('sloptris audio: ' + missing + ' of ' + names.length +
            ' files not loaded from audio/, using synthesized fallbacks.');
        }
      }
    }

    names.forEach(function (name) {
      var cue = CUES[name];
      if (!cue || !cue.file) { done(false); return; }
      loadOne(name, cue.file).then(function (ok) { done(ok); }, function () { done(false); });
    });
  }

  /* ------------------------------------------------------------------ *
   * MUSIC HELPERS
   * ------------------------------------------------------------------ */

  function stopMusicNodes() {
    if (!musicNodes) return;
    var nodes = musicNodes;
    musicNodes = null;
    try { nodes.src.onended = null; nodes.src.stop(); } catch (err) { /* not started */ }
    try { nodes.src.disconnect(); nodes.gain.disconnect(); } catch (err) { /* already gone */ }
  }

  /* Called when loop.mp3 finishes decoding, in case music was asked for first. */
  function maybeStartMusic() {
    if (musicWanted && !musicNodes && ctx && isEnabled()) startMusic();
  }

  /* ------------------------------------------------------------------ *
   * PUBLIC API
   * ------------------------------------------------------------------ */

  /**
   * Cue names in manifest order, including 'music'.
   * @returns {string[]} every key of the cue manifest
   */
  function cueNames() {
    return Object.keys(CUES);
  }

  /**
   * Create the AudioContext (once), resume it, kick off asset loading, and ask
   * for music. The ask is recorded even while sound is off (the default on
   * every page load, NOTES item 27) so that turning sound on later starts the
   * loop; startMusic() itself plays nothing until sound is on and the file has
   * decoded. Call from the start / resume / again gesture. Safe to call
   * repeatedly, and safe where Web Audio does not exist.
   * @returns {void}
   */
  function unlock() {
    try {
      if (!ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = MASTER_GAIN;
        master.connect(ctx.destination);
      }
    } catch (err) {
      ctx = null;
      master = null;
      return;
    }
    resume();
    try { loadAll(); } catch (err) { /* assets are optional */ }
    startMusic();   /* records the want; audible only once sound is on */
  }

  /**
   * Resume a suspended context (the tab was backgrounded on mobile). Cheap no-op
   * when there is no context or it is already running. Call on any user gesture.
   * @returns {void}
   */
  function resume() {
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        var p = ctx.resume();
        if (p && typeof p.then === 'function') p.then(noop, noop);
      }
    } catch (err) { /* nothing to do */ }
  }

  /**
   * Is sound on? Every page load starts with sound OFF, whatever was chosen last
   * time, so nobody is ambushed by music (NOTES item 27). The setting lives only
   * in memory for this page. Old doc: reads localStorage 'sloptris.sound', defaults to
   * on, and caches after the first read.
   * @returns {boolean} true when sound is on
   */
  function isEnabled() {
    if (enabledCache === null) enabledCache = false;
    return enabledCache;
  }

  /**
   * Turn sound on or off for this page load (not persisted). Off schedules nothing at all: music and
   * the charge tone stop immediately and play() becomes a no-op. On restarts
   * music from the top when a context exists and music was running when it was
   * switched off (music stopped with stopMusic(), as on the retro, stays off).
   * @param {boolean} on true for sound on
   * @returns {void}
   */
  function setEnabled(on) {
    on = !!on;
    enabledCache = on;
    if (!on) {
      stopCharge();
      stopMusicNodes();   /* musicWanted is kept, so 'on' can restore it */
      return;
    }
    if (ctx && musicWanted) startMusic();
  }

  /**
   * Fire-and-forget one-shot cue: the decoded file when one loaded, the
   * synthesized fallback otherwise. No-op when sound is off, before unlock(),
   * for an unknown name, for a cue marked enabled: false, and for 'music'
   * (use startMusic).
   * @param {string} name a cue name from the manifest
   * @returns {void}
   */
  function play(name) {
    var cue = CUES[name];
    if (!cue || name === 'music') return;
    if (cue.enabled === false) return;
    if (!ctx || !master || !isEnabled()) return;
    try {
      var buf = buffers[name];
      if (buf) playBuffer(buf, fileGainOf(cue));
      else synth(cue);
    } catch (err) { /* a dropped cue is never worth an error */ }
  }

  /**
   * Start the sustained review_charge tone with a gentle gain ramp. No-op when
   * it is already running, when sound is off, or before unlock(). A decoded
   * review_charge file is looped and pitched with playbackRate; otherwise an
   * oscillator is used.
   * @returns {void}
   */
  function startCharge() {
    if (charge || !ctx || !master || !isEnabled()) return;
    var cue = CUES.review_charge;
    try {
      var t0 = ctx.currentTime;
      var g = ctx.createGain();
      g.gain.setValueAtTime(MIN_GAIN, t0);
      var peak = buffers.review_charge ? fileGainOf(cue) : cue.gain;
      g.gain.exponentialRampToValueAtTime(Math.max(MIN_GAIN * 2, peak), t0 + 0.09);
      g.connect(master);

      var node;
      var isBuffer = false;
      if (buffers.review_charge) {
        node = ctx.createBufferSource();
        node.buffer = buffers.review_charge;
        node.loop = true;
        node.playbackRate.setValueAtTime(1, t0);
        isBuffer = true;
      } else {
        node = ctx.createOscillator();
        node.type = cue.wave || 'triangle';
        node.frequency.setValueAtTime(cue.freq, t0);
      }
      node.connect(g);
      node.start(t0);
      charge = { node: node, gain: g, isBuffer: isBuffer };
    } catch (err) {
      charge = null;
    }
  }

  /**
   * Track the review charge: t is reviewCharge / threshold, clamped to [0, 1].
   * Ramps the pitch from the manifest's freq up to freqEnd (110 Hz to 330 Hz by
   * default), or the playback rate when a file is looping. Safe if not started.
   * @param {number} t charge fraction, 0 to 1
   * @returns {void}
   */
  function setCharge(t) {
    if (!charge || !ctx) return;
    var cue = CUES.review_charge;
    var lo = cue.freq;
    var hi = cue.freqEnd || cue.freq * 4;
    var target = lo * Math.pow(hi / lo, clamp01(t));
    try {
      var now = ctx.currentTime;
      if (charge.isBuffer) charge.node.playbackRate.setTargetAtTime(target / lo, now, CHARGE_SMOOTH);
      else charge.node.frequency.setTargetAtTime(target, now, CHARGE_SMOOTH);
    } catch (err) { /* nothing to do */ }
  }

  /**
   * Release the review_charge tone with a short fade. Safe when it was never
   * started and safe to call more than once.
   * @returns {void}
   */
  function stopCharge() {
    if (!charge) return;
    var c = charge;
    charge = null;
    try {
      var now = ctx.currentTime;
      var current = Math.max(MIN_GAIN, c.gain.gain.value || MIN_GAIN);
      c.gain.gain.cancelScheduledValues(now);
      c.gain.gain.setValueAtTime(current, now);
      c.gain.gain.exponentialRampToValueAtTime(MIN_GAIN, now + 0.10);
      c.node.onended = function () {
        try { c.node.disconnect(); c.gain.disconnect(); } catch (err) { /* already gone */ }
      };
      c.node.stop(now + 0.12);
    } catch (err) {
      try { c.node.disconnect(); c.gain.disconnect(); } catch (err2) { /* already gone */ }
    }
  }

  /**
   * Loop audio/loop.mp3 from the top, when it decoded and sound is on. There is
   * no synthesized music: a missing file is silence. If the buffer is still
   * decoding, music starts as soon as it lands, provided it is still wanted and
   * sound is still on.
   * @returns {void}
   */
  function startMusic() {
    musicWanted = true;
    if (!ctx || !master || !isEnabled()) return;
    var buf = buffers.music;
    if (!buf) return;               /* silence, or still decoding */
    stopMusicNodes();
    try {
      var src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      var g = ctx.createGain();
      g.gain.value = CUES.music.gain == null ? 0.3 : CUES.music.gain;
      src.connect(g);
      g.connect(master);
      src.start(0, 0);              /* from the top */
      musicNodes = { src: src, gain: g };
    } catch (err) {
      musicNodes = null;
    }
  }

  /**
   * Stop music. Nothing is scheduled afterwards, and a later startMusic() begins
   * again from the top.
   * @returns {void}
   */
  function stopMusic() {
    musicWanted = false;
    stopMusicNodes();
  }

  global.SloptrisAudio = {
    CUES: CUES,
    cueNames: cueNames,
    unlock: unlock,
    resume: resume,
    isEnabled: isEnabled,
    setEnabled: setEnabled,
    play: play,
    startCharge: startCharge,
    setCharge: setCharge,
    stopCharge: stopCharge,
    startMusic: startMusic,
    stopMusic: stopMusic
  };
})(typeof window !== 'undefined' ? window : this);
