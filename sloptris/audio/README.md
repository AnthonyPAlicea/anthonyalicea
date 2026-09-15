# sloptris audio assets

Files in this folder are read by the cue manifest at the top of `../audio.js`. Every cue
has a synthesized fallback: when a file is missing or fails to decode, the fallback plays
and the game stays fully playable. The one exception is `loop.mp3`: music has no fallback,
and a missing `loop.mp3` simply means no music.

A page opened straight from disk with `file://` cannot usually read these files, so serve
the folder over http to hear real assets. The synthesized fallbacks work either way.

## Credits

All shipped assets are CC0 (public domain dedication). Credit is not required by the
license; it is given here because it is the decent thing to do.

- Sound effects: [Kenney](https://kenney.nl), from the *Interface Sounds* and *Digital
  Audio* packs. CC0. https://kenney.nl/assets/interface-sounds and
  https://kenney.nl/assets/digital-audio
- Music: *Level 1* from *5 Chiptunes (Action)* by Juhani Junkala (SubspaceAudio). CC0.
  https://opengameart.org/content/5-chiptunes-action. Downmixed to mono and encoded to
  MP3 at 96 kbps from the author's WAV; nothing else changed.

## Files

| file | cue | source clip |
|---|---|---|
| wb_toggle.ogg | wb_toggle | Kenney Interface Sounds, tick_001 |
| wb_reject.ogg | wb_reject | Kenney Interface Sounds, error_004 |
| build.ogg | build | Kenney Interface Sounds, confirmation_001 |
| generate.ogg | generate | Kenney Digital Audio, phaserUp5 |
| move.ogg | move | Kenney Interface Sounds, click_003 |
| rotate.ogg | rotate | Kenney Interface Sounds, tick_002 |
| soft_drop.ogg | soft_drop | Kenney Interface Sounds, click_002 |
| hard_drop.ogg | hard_drop | Kenney Interface Sounds, drop_001 |
| lock.ogg | lock | Kenney Interface Sounds, back_001 |
| clear.ogg | clear | Kenney Digital Audio, powerUp2 |
| mutate_beat.ogg | mutate_beat | Kenney Digital Audio, lowDown |
| pulse_stable.ogg | pulse_stable | Kenney Interface Sounds, confirmation_003 |
| pulse_mutate.ogg | pulse_mutate | Kenney Interface Sounds, question_002 |
| sprint.ogg | sprint | Kenney Digital Audio, threeTone1 |
| deadline_warn.ogg | deadline_warn | Kenney Interface Sounds, error_007 |
| topout.ogg | topout | Kenney Digital Audio, lowThreeTone |
| loop.mp3 | music (looped) | Juhani Junkala, Level 1 |
| mutate.wav | mutate | generated: 150 to 240 Hz soft square, 27 Hz warble, 0.30 s |
| refactor.wav | refactor | generated: 120 to 70 Hz soft square, 16 Hz warble, 0.62 s |
| review_charge.wav | review_charge (looped) | generated: 110 Hz triangle, 4 Hz tremolo, 1.00 s seamless loop; the game pitches it up to 3x |
| typing.wav | typing | generated: 320 Hz tick, 12 ms |

The four generated WAVs were written by a small Node script (16-bit mono, 44.1 kHz) and
kept deliberately low in pitch. Every cue still has a synthesized fallback in the manifest
for a file that is missing or fails to decode. To replace any file, drop one at the path
named in the manifest.
