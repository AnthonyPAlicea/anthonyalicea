/* sloptris - game logic, rendering and input.
 * Plain ES2020, one IIFE, no modules, no dependencies. Runs from file://.
 * Companion files: index.html (DOM ids), style.css, audio.js (window.SloptrisAudio).
 */
(function () {
  'use strict';

  /* =====================================================================
   * 1. CONFIG
   * ===================================================================== */

  var CONFIG = {
    // Mutation odds per sprint, index = min(sprint, 5) - 1. A flat roll on
    // every generate within a sprint; how often the player generates versus
    // builds has no effect on it. Values kept from the streak-era tuning
    // (see NOTES.md, Tuning).
    MUTATION_TABLE: [45, 55, 60, 65, 70],
    REFACTOR_CHANCE: 1,
    // How many times a board-aware target box may widen (CONTRACT res. 1, 12).
    TARGET_WIDEN_MAX: 2,
    // Rows a review must fall before it answers. Spec said 6; 3, then 2 after
    // playtesting. The charge display ramps continuously between rows
    // (reviewProgress), so any threshold reads as one smooth build.
    REVIEW_THRESHOLD: 2,
    REVIEW_GRAVITY_MS: 1200,
    GRAVITY_MS: 700,
    SOFT_DROP_MS: 50,
    LOCK_DELAY_MS: 300,
    // Deadlines from the balance model in NOTES item 21; goals set by the
    // owner in play (NOTES item 22). Missing the deadline ends the run (15).
    DEADLINES_S: [180, 150, 130, 95, 65],
    // Lines to ship per sprint, index = min(sprint, 5) - 1.
    GOALS_LINES: [3, 3, 3, 2, 2],
    // A hand-built piece takes this long to build after the fourth cell
    // matches. Without it, building is nearly as fast per line as generating
    // and far cleaner, and no clock can make generating necessary (NOTES 21).
    BUILD_MS: 1600,
    LINE_FLASH_MS: 150,
    MUTATE_BEAT_MS: 400,
    REFACTOR_BEAT_MS: 700,
    TYPE_CPS: 30,
    STATUS_EVENT_MS: 2000,
    // How long a first press of N (or tap of [new]) waits for the second.
    NEW_CONFIRM_MS: 3000,
    COLS: 10,
    ROWS: 20,
    SAVE_KEY: 'sloptris.save',
    BEST_KEY: 'sloptris.best',
    HOWTO_KEY: 'sloptris.howto',
    SCHEMA_VERSION: 1,
    // Touch thresholds (SPEC 8.2).
    TAP_MAX_MS: 200,
    TAP_MAX_PX: 8,
    HOLD_MS: 250,
    FLICK_VEL: 1.2,
    FLICK_MIN_CELLS: 2,
    FLICK_WINDOW_MS: 100,
    TITLE_LONGPRESS_MS: 2000,
    // Presentation.
    CELL_MIN: 14,
    CELL_MAX: 24,
    GUTTERS_PX: 32,
    GLOW_BLUR: 6,
    GLOW_ALPHA: 0.35,
    WB_FLASH_MS: 300,
    PULSE_GROW_MS: 300,
    PULSE_FADE_MS: 500,
    OUTLINE_TRAVEL_MS: 600,
    // The whole-well flash and ring when a review completes.
    REVIEW_FLASH_MS: 600,
    // Crossfade when cells change after lock (mutation or refactor).
    MUTATE_FLASH_MS: 700,
    // A changed piece then drops into place: this long after the change it
    // starts, and it falls one cell per SETTLE_MS until it rests (NOTES 24).
    SETTLE_DELAY_MS: 700,
    SETTLE_MS: 45,
    // The in-well banner when a sprint ends, either way.
    SPRINT_BANNER_MS: 3000
  };

  // Live copy the dev panel edits. `reset to defaults` copies CONFIG back in.
  var cfg = cloneConfig(CONFIG);

  function cloneConfig(src) {
    var out = {};
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      out[k] = Array.isArray(src[k]) ? src[k].slice() : src[k];
    }
    return out;
  }

  var COLS = CONFIG.COLS;
  var ROWS = CONFIG.ROWS;

  var COLORS = {
    bg: '#0b0d0e',
    bgRGB: [11, 13, 14],
    accent: '#e6b450',
    accentRGB: [230, 180, 80],
    hi: '#fff3d6',
    hiRGB: [255, 243, 214],
    // The accent pushed toward black, for the mutation flash. Same hue.
    darkRGB: [118, 76, 16],
    muted: '#6b7075',
    danger: '#d9534f'
  };

  /* =====================================================================
   * 2. COPY  (SPEC 11, verbatim; title and how-to rewritten, NOTES item 16)
   * ===================================================================== */

  var COPY = {
    // 11.1 Title screen
    TITLE_NAME: 'sloptris',
    TITLE_BODY: 'Either build your pieces manually or have the AI generate them. Reviewing the generated pieces takes time, but not reviewing may have consequences...',
    TITLE_CONTROLS: '[enter] start    [?] how to play',
    TITLE_BEST: 'best {n} shipped',

    // 11.2 How to play
    HOWTO_P1: 'Build the next shape on the workbench (use the spacebar to build on keyboard) or have the AI generate it.',
    HOWTO_P2: 'Move and rotate shapes with arrow keys on keyboard or swipe and tap on mobile. Generated pieces can change shape after they land!',
    HOWTO_P3: "You can review a falling generated piece to see what it will become (hold R on keyboard, tap and hold on grid in mobile).",
    HOWTO_P4: "Complete the required number of lines before the clock hits zero to successfully complete a sprint.",
    HOWTO_CONTROLS_FINE: 'move: arrows or hjkl    rotate: up / x / z    hard drop: space\ngenerate: g    review: r (hold)    clear workbench: esc    sound: m',
    HOWTO_CONTROLS_COARSE: 'move: drag sideways    rotate: tap    drop: drag down    slam: flick down\nreview: press and hold    generate and clear: buttons below',

    // 11.3 Ticket lines
    TICKET: {
      I: ["Line piece by EOD.", 'Straight one spec.'],
      O: ['Stakeholder says square.', 'Square only.'],
      T: ['Ticket says T.', 'Customer wants T.'],
      S: ['S needed this quarter.', 'S by EOD.'],
      Z: ['Competitor has a Z.', 'Z will close that ticket.'],
      J: ['J aligns us.', 'Meeting notes say J.'],
      L: ['L is standard.', 'L is a must-have.']
    },

    // 11.4 Assistant lines (the only voice that sounds upbeat)
    GEN: [
      "That closes the gap. Here's your {shape}-piece.",
      "That's quietly brilliant. Here's a {shape}.",
      'Great idea! One {shape} piece, coming right up.',
      "Perfect! I've generated the {shape}-piece."
    ],
    MUTATED: [
      "You're absolutely right, that should have been a {new}. Fixed!",
      "I noticed the {old} wasn't optimal, so I've gone ahead and adjusted it.",
      'Quick improvement: I restructured the piece for better fit.',
      'I refined the {old} into a {new} for consistency.'
    ],
    REFACTORED: "I took the liberty of refactoring the whole board for consistency. Let me know if you'd like any other changes!",
    DEADLINE_CHAT: "Looks like we missed the deadline. I've scheduled a retro!",
    BEAT: '…',

    // 11.5 Status bar
    STATUS_DEFAULT: 'shipped {lines}   generated {generated}   debt {debt}',
    STATUS_STREAK: '   streak {n}',
    STATUS_SHIPPED: 'shipped.',
    STATUS_SHIPPED_SLOP: 'shipped. {n} slop cells in that row.',
    STATUS_SHIPPED_SLOP_MANY: 'shipped. {n} slop cells in those rows.',
    STATUS_MUTATED: 'piece changed after lock.',
    STATUS_REFACTOR: 'board changed.',
    STATUS_SPRINT_DONE: 'Sprint {n} done. Sprint {next}: ship {goal} lines by {time}.',
    // In-well banners: a sprint transition, and the held one over a missed deadline.
    BANNER_DONE: 'SPRINT {n} DONE',
    BANNER_NEXT: 'SPRINT {next}',
    BANNER_OVER: 'DEADLINE MISSED',
    BANNER_OVER_SPRINT: 'sprint {n}',
    BANNER_OVER_LINES: '{k} of {goal} lines',
    BANNER_GOAL: 'ship {goal} lines',
    BANNER_GOAL_ONE: 'ship 1 line',
    BANNER_BY: 'by {time}',
    STATUS_REVIEWING: 'reviewing.',
    STATUS_BUILDING: 'building…',

    // 11.6 Retro
    RETRO_HEAD: 'Board is full with {time} left in sprint {n}.',
    RETRO_HEAD_DEADLINE: 'Sprint {n} deadline missed with {k} of {goal} lines shipped.',
    RETRO_SPRINT: '{k} of {goal} lines shipped this sprint',
    RETRO_LINES: '{n} shipped',
    RETRO_GENERATED: '{n} generated',
    RETRO_REVIEWED: '{n} reviewed before they landed',
    RETRO_MUTATED: '{n} changed after lock',
    RETRO_REFACTORS: '{n} board refactors',
    RETRO_SLOP: '{n} slop cells still on the board',
    RETRO_BUILT: '{n} built by hand',
    RETRO_CONTROLS: '[enter] again',
    RETRO_SEED: 'seed {n} ({mode})',

    // 11.8 Resume screen
    RESUME_LINE: 'Reloaded. The clock is stopped at {time}, sprint {n}.',
    RESUME_LINE_RETRO: 'Reloaded.',
    RESUME_CONTROLS: '[enter] resume    [n] new game',
    RESUME_CONTROLS_RETRO: '[enter] see retro    [n] new game',
    RESUME_CONFIRM: 'Press n again to start a new game.',
    NEW_CONFIRM_KEYS: 'Press n again to start a new game.',
    NEW_CONFIRM_TOUCH: 'Tap again to start a new game.',
    BTN_NEW: '[new]',
    BTN_RESUME: '[resume]',
    BTN_NEWGAME: '[new game]',
    BTN_THROW: '[new game (confirm)]',

    // Header / hints
    SOUND_ON_KEY: '[m] sound on',
    SOUND_OFF_KEY: '[m] sound off',
    SOUND_ON_TOUCH: '[sound: on]',
    SOUND_OFF_TOUCH: '[sound: off]',
    HINT_KEYS: '[G] generate   [R] review (hold)   [N] new   [?] help',
    SPRINT_LABEL: 'sprint {n}',
    GOAL_LABEL: '{k}/{goal}',
    TICKET_TITLE: 'TICKET #{n}'
  };

  function fill(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  }

  /* =====================================================================
   * 3. PRNG  (mulberry32, seeded, save/restore-able)
   * ===================================================================== */

  function mulberry32(seed) {
    var s = seed >>> 0;
    function rng() {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    rng.getState = function () { return s >>> 0; };
    rng.setState = function (v) { s = v >>> 0; };
    return rng;
  }

  function hashString(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function todayKey() {
    var d = new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function queryParams() {
    var out = {};
    var q = '';
    try { q = String(window.location.search || ''); } catch (e) { q = ''; }
    if (q.charAt(0) === '?') q = q.slice(1);
    if (!q) return out;
    var parts = q.split('&');
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var kv = parts[i].split('=');
      out[decodeURIComponent(kv[0])] = kv.length > 1 ? decodeURIComponent(kv[1]) : '';
    }
    return out;
  }

  // Resolve the seed for a fresh run under the current mode.
  function resolveSeed(mode, fixedSeed) {
    if (mode === 'daily') return hashString(todayKey());
    if (mode === 'fixed') return (fixedSeed >>> 0);
    return (Date.now() >>> 0);
  }

  function shuffleInPlace(arr, rng) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      if (j > i) j = i;
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function pickIndex(len, rng) {
    var i = Math.floor(rng() * len);
    if (i >= len) i = len - 1;
    if (i < 0) i = 0;
    return i;
  }

  /* =====================================================================
   * 4. SHAPES
   * ===================================================================== */

  var SHAPE_LETTERS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  // Spawn cells in the 4x4 local frame, (x, y) with y down (CONTRACT res. 4).
  var SPAWN = {
    I: [[0, 1], [1, 1], [2, 1], [3, 1]],
    O: [[1, 0], [2, 0], [1, 1], [2, 1]],
    T: [[1, 0], [0, 1], [1, 1], [2, 1]],
    S: [[1, 0], [2, 0], [0, 1], [1, 1]],
    Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
    J: [[0, 0], [0, 1], [1, 1], [2, 1]],
    L: [[2, 0], [0, 1], [1, 1], [2, 1]]
  };

  // Wall kicks, tried in order (CONTRACT res. 5).
  var KICKS = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1]];

  function rotateCellCW(c) { return [3 - c[1], c[0]]; }
  function rotateVertexCW(v) { return [4 - v[1], v[0]]; }

  function rotateCells(cells, times) {
    var out = cells.map(function (c) { return [c[0], c[1]]; });
    var n = ((times % 4) + 4) % 4;
    for (var i = 0; i < n; i++) out = out.map(rotateCellCW);
    return out;
  }

  function rotateVertices(verts, times) {
    var out = verts.map(function (v) { return [v[0], v[1]]; });
    var n = ((times % 4) + 4) % 4;
    for (var i = 0; i < n; i++) out = out.map(rotateVertexCW);
    return out;
  }

  // Cells in a that are not in b.
  function cellsMinus(a, b) {
    var set = {};
    for (var i = 0; i < b.length; i++) set[b[i][0] + ',' + b[i][1]] = true;
    var out = [];
    for (var j = 0; j < a.length; j++) {
      if (!set[a[j][0] + ',' + a[j][1]]) out.push([a[j][0], a[j][1]]);
    }
    return out;
  }

  function boundingBox(cells) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (var i = 0; i < cells.length; i++) {
      if (cells[i][0] < x0) x0 = cells[i][0];
      if (cells[i][0] > x1) x1 = cells[i][0];
      if (cells[i][1] < y0) y0 = cells[i][1];
      if (cells[i][1] > y1) y1 = cells[i][1];
    }
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
  }

  function normalize(cells) {
    var bb = boundingBox(cells);
    var out = cells.map(function (c) { return [c[0] - bb.x0, c[1] - bb.y0]; });
    out.sort(function (a, b) { return (a[1] - b[1]) || (a[0] - b[0]); });
    return out;
  }

  function cellsKey(cells) {
    return normalize(cells).map(function (c) { return c[0] + ',' + c[1]; }).join(' ');
  }

  function rawKey(cells) {
    var copy = cells.map(function (c) { return [c[0], c[1]]; });
    copy.sort(function (a, b) { return (a[1] - b[1]) || (a[0] - b[0]); });
    return copy.map(function (c) { return c[0] + ',' + c[1]; }).join(' ');
  }

  function sameCells(a, b) { return rawKey(a) === rawKey(b); }

  // The 19 distinct normalized orientations, each tagged with its shape letter.
  var ORIENTATIONS = (function () {
    var list = [];
    var seen = {};
    for (var s = 0; s < SHAPE_LETTERS.length; s++) {
      var letter = SHAPE_LETTERS[s];
      for (var r = 0; r < 4; r++) {
        var cells = normalize(rotateCells(SPAWN[letter], r));
        var key = cells.map(function (c) { return c[0] + ',' + c[1]; }).join(' ');
        if (seen[key]) continue;
        seen[key] = true;
        var bb = boundingBox(cells);
        list.push({
          shape: letter,
          cells: cells,
          key: key,
          w: bb.x1 - bb.x0 + 1,
          h: bb.y1 - bb.y0 + 1
        });
      }
    }
    return list;
  })();

  console.assert(ORIENTATIONS.length === 19, 'sloptris: expected 19 orientations, got ' + ORIENTATIONS.length);

  function shapeOfCells(cells) {
    var key = cellsKey(cells);
    for (var i = 0; i < ORIENTATIONS.length; i++) {
      if (ORIENTATIONS[i].key === key) return ORIENTATIONS[i].shape;
    }
    return null;
  }

  // Workbench matching (SPEC 5.1): normalized comparison against every
  // orientation of the ticket shape.
  function matchesShape(cells, shape) {
    if (!cells || cells.length !== 4) return false;
    var key = cellsKey(cells);
    for (var i = 0; i < ORIENTATIONS.length; i++) {
      if (ORIENTATIONS[i].shape === shape && ORIENTATIONS[i].key === key) return true;
    }
    return false;
  }

  /* Boundary of the union of `cells`, as one ordered closed loop of vertices.
   * Every tetromino is simply connected with no holes, so exactly one loop
   * exists. Vertices are in the same frame as the cells (corner coordinates).
   */
  function outlineEdges(cells) {
    var set = {};
    var i;
    for (i = 0; i < cells.length; i++) set[cells[i][0] + ',' + cells[i][1]] = true;
    function has(x, y) { return set[x + ',' + y] === true; }

    var edges = [];
    for (i = 0; i < cells.length; i++) {
      var x = cells[i][0], y = cells[i][1];
      // Directed consistently so head-to-tail chaining yields one loop.
      if (!has(x, y - 1)) edges.push([[x, y], [x + 1, y]]);
      if (!has(x + 1, y)) edges.push([[x + 1, y], [x + 1, y + 1]]);
      if (!has(x, y + 1)) edges.push([[x + 1, y + 1], [x, y + 1]]);
      if (!has(x - 1, y)) edges.push([[x, y + 1], [x, y]]);
    }
    if (!edges.length) return [];

    var byStart = {};
    for (i = 0; i < edges.length; i++) {
      byStart[edges[i][0][0] + ',' + edges[i][0][1]] = edges[i];
    }

    var loop = [];
    var start = edges[0][0];
    var cur = start;
    var guard = edges.length + 2;
    while (guard-- > 0) {
      loop.push([cur[0], cur[1]]);
      var e = byStart[cur[0] + ',' + cur[1]];
      if (!e) break;
      cur = e[1];
      if (cur[0] === start[0] && cur[1] === start[1]) break;
    }
    return loop;
  }

  /* =====================================================================
   * 5. BOARD
   * ===================================================================== */

  function emptyCell() {
    return { filled: false, pieceId: null, slop: false, mutated: false };
  }

  function newBoard() {
    var rows = [];
    for (var y = 0; y < ROWS; y++) {
      var row = [];
      for (var x = 0; x < COLS; x++) row.push(emptyCell());
      rows.push(row);
    }
    return rows;
  }

  function cellAt(x, y) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return G.board[y][x];
  }

  // A cell list fits when every cell is inside the columns, above the floor,
  // and not on top of a filled cell. Rows above the well (y < 0) are allowed
  // so a piece can spawn partly off-screen.
  function fits(cells) {
    for (var i = 0; i < cells.length; i++) {
      var x = cells[i][0], y = cells[i][1];
      if (x < 0 || x >= COLS) return false;
      if (y >= ROWS) return false;
      if (y >= 0 && G.board[y][x].filled) return false;
    }
    return true;
  }

  function writeCells(cells, pieceId, slop, mutated) {
    for (var i = 0; i < cells.length; i++) {
      var x = cells[i][0], y = cells[i][1];
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      G.board[y][x] = { filled: true, pieceId: pieceId, slop: !!slop, mutated: !!mutated };
    }
  }

  function eraseCells(cells) {
    for (var i = 0; i < cells.length; i++) {
      var x = cells[i][0], y = cells[i][1];
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      G.board[y][x] = emptyCell();
    }
  }

  function registerPiece(id, slop, cells) {
    G.pieces[id] = {
      id: id,
      slop: !!slop,
      cells: cells.filter(function (c) {
        return c[0] >= 0 && c[0] < COLS && c[1] >= 0 && c[1] < ROWS;
      }).map(function (c) { return [c[0], c[1]]; })
    };
  }

  function fullRows() {
    var rows = [];
    for (var y = 0; y < ROWS; y++) {
      var full = true;
      for (var x = 0; x < COLS; x++) {
        if (!G.board[y][x].filled) { full = false; break; }
      }
      if (full) rows.push(y);
    }
    return rows;
  }

  function countSlopInRows(rows) {
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
      for (var x = 0; x < COLS; x++) {
        var c = G.board[rows[i]][x];
        if (c.filled && c.slop) n++;
      }
    }
    return n;
  }

  function clearRows(rows) {
    var drop = {};
    var x;
    for (var i = 0; i < rows.length; i++) drop[rows[i]] = true;
    var kept = [];
    for (var y = 0; y < ROWS; y++) if (!drop[y]) kept.push(G.board[y]);
    while (kept.length < ROWS) {
      var row = [];
      for (x = 0; x < COLS; x++) row.push(emptyCell());
      kept.unshift(row);
    }
    G.board = kept;
    rebuildPieceCells();
  }

  // Rebuild every piece's cell list from the board. Pieces with nothing left
  // are dropped from the map; pieces with fewer than 4 cells are no longer
  // "intact" and stop taking part in refactors.
  function rebuildPieceCells() {
    var id;
    for (id in G.pieces) {
      if (Object.prototype.hasOwnProperty.call(G.pieces, id)) G.pieces[id].cells = [];
    }
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var c = G.board[y][x];
        if (!c.filled || c.pieceId === null) continue;
        var p = G.pieces[c.pieceId];
        if (!p) continue;
        p.cells.push([x, y]);
      }
    }
    for (id in G.pieces) {
      if (!Object.prototype.hasOwnProperty.call(G.pieces, id)) continue;
      if (G.pieces[id].cells.length === 0) delete G.pieces[id];
    }
  }

  function slopCellsOnBoard() {
    var n = 0;
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (G.board[y][x].filled && G.board[y][x].slop) n++;
      }
    }
    return n;
  }

  // Current well cells of a falling piece.
  function pieceCells(p) {
    return rotateCells(SPAWN[p.shape], p.orientation).map(function (c) {
      return [c[0] + p.x, c[1] + p.y];
    });
  }

  function pieceCellsAt(p, dx, dy, orientation) {
    var o = (orientation === undefined || orientation === null) ? p.orientation : orientation;
    return rotateCells(SPAWN[p.shape], o).map(function (c) {
      return [c[0] + p.x + dx, c[1] + p.y + dy];
    });
  }

  function canMove(p, dx, dy) {
    return fits(pieceCellsAt(p, dx, dy, p.orientation));
  }

  /* =====================================================================
   * 6. MUTATION
   * ===================================================================== */

  /* Pick a mutation target for a set of cells.
   * opts.bounds  hard limits the box may grow into: {minX,minY,maxX,maxY}
   * opts.valid   optional predicate on a candidate cell list
   * opts.rng     random source (defaults to the run PRNG)
   * opts.maxWiden how many times the box may widen (default: until bounds stop it)
   * Returns { shape, cells } or null.
   * CONTRACT resolution 1: when the tight bounding box admits no candidate,
   * widen it by one along the shorter axis and retry.
   */
  function chooseTarget(cells, opts) {
    opts = opts || {};
    var bounds = opts.bounds || { minX: 0, minY: 0, maxX: 3, maxY: 3 };
    var valid = opts.valid || function () { return true; };
    var rng = opts.rng || G.rng;
    var bb = boundingBox(cells);
    var box = { x0: bb.x0, y0: bb.y0, x1: bb.x1, y1: bb.y1 };
    var current = rawKey(cells);
    var maxWiden = (opts.maxWiden === undefined || opts.maxWiden === null) ? 64 : opts.maxWiden;

    for (var widened = 0; widened <= maxWiden; widened++) {
      var cands = [];
      for (var i = 0; i < ORIENTATIONS.length; i++) {
        var o = ORIENTATIONS[i];
        for (var oy = box.y0; oy + o.h - 1 <= box.y1; oy++) {
          for (var ox = box.x0; ox + o.w - 1 <= box.x1; ox++) {
            var cand = [];
            for (var c = 0; c < o.cells.length; c++) {
              cand.push([o.cells[c][0] + ox, o.cells[c][1] + oy]);
            }
            if (rawKey(cand) === current) continue;
            if (!valid(cand)) continue;
            cands.push({ shape: o.shape, cells: cand });
          }
        }
      }
      if (cands.length) return cands[pickIndex(cands.length, rng)];
      if (!widenBox(box, bounds)) return null;
    }
    return null;
  }

  function widenBox(box, bounds) {
    var w = box.x1 - box.x0 + 1;
    var h = box.y1 - box.y0 + 1;
    var order = (w <= h) ? ['x', 'y'] : ['y', 'x'];
    for (var i = 0; i < order.length; i++) {
      if (order[i] === 'x') {
        if (box.x1 + 1 <= bounds.maxX) { box.x1 += 1; return true; }
        if (box.x0 - 1 >= bounds.minX) { box.x0 -= 1; return true; }
      } else {
        if (box.y1 + 1 <= bounds.maxY) { box.y1 += 1; return true; }
        if (box.y0 - 1 >= bounds.minY) { box.y0 -= 1; return true; }
      }
    }
    return false;
  }

  // Generate-time target: board independent, inside the 4x4 local frame.
  function chooseTargetLocal(spawnCells, rng) {
    return chooseTarget(spawnCells, {
      bounds: { minX: 0, minY: 0, maxX: 3, maxY: 3 },
      rng: rng || G.rng
    });
  }

  // Where the stored target lands in well coordinates right now.
  function targetWellCells(p) {
    if (!p || !p.targetLocal) return null;
    return rotateCells(p.targetLocal, p.orientation).map(function (c) {
      return [c[0] + p.x, c[1] + p.y];
    });
  }

  function targetWellOutline(p) {
    if (!p || !p.targetOutline || !p.targetOutline.length) return null;
    return rotateVertices(p.targetOutline, p.orientation).map(function (v) {
      return [v[0] + p.x, v[1] + p.y];
    });
  }

  /* Plan the lock-time mutation (SPEC 6.2). The piece's own four cells are
   * treated as free space. Returns the target cell list, or null when the
   * mutation fizzles, which is silent in both voices.
   */
  function planMutation(p, ownCells) {
    var target = targetWellCells(p);
    if (!target) return null;
    var own = {};
    for (var i = 0; i < ownCells.length; i++) own[ownCells[i][0] + ',' + ownCells[i][1]] = true;
    for (var j = 0; j < target.length; j++) {
      var x = target[j][0], y = target[j][1];
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
      if (G.board[y][x].filled && !own[x + ',' + y]) return null;
    }
    return target;
  }

  // Apply a planned mutation in one frame. No gravity on anything.
  function commitMutation(p, ownCells, target) {
    eraseCells(ownCells);
    writeCells(target, p.pieceId, true, true);
    registerPiece(p.pieceId, true, target);
  }

  function applyMutation(p, ownCells) {
    var plan = planMutation(p, ownCells);
    if (!plan) return false;
    commitMutation(p, ownCells, plan);
    return true;
  }

  /* CONTRACT resolution 12. When the pre-rolled target does not fit and the
   * player never saw it, pick a target against the live board instead, the
   * way a refactor does. A reviewed piece keeps the fizzle: the outline the
   * player paid for is a promise. Returns the target cell list or null.
   */
  function fallbackTarget(ownCells) {
    var own = {};
    for (var i = 0; i < ownCells.length; i++) own[ownCells[i][0] + ',' + ownCells[i][1]] = true;
    var pick = chooseTarget(ownCells, {
      bounds: { minX: 0, minY: 0, maxX: COLS - 1, maxY: ROWS - 1 },
      rng: G.rng,
      valid: makeFreeCheck(own),
      maxWiden: cfg.TARGET_WIDEN_MAX
    });
    return pick ? pick.cells : null;
  }

  /* Board refactor (SPEC 6.3). Every other intact slop piece, in seeded
   * random order, chooses a target against the live board at that moment.
   * Earlier changes affect later ones.
   */
  function boardRefactor(excludePieceId) {
    var ids = [];
    for (var k in G.pieces) {
      if (!Object.prototype.hasOwnProperty.call(G.pieces, k)) continue;
      var pc = G.pieces[k];
      if (pc.id === excludePieceId) continue;
      if (!pc.slop) continue;
      if (pc.cells.length !== 4) continue;
      ids.push(pc.id);
    }
    ids.sort(function (a, b) { return a - b; });
    shuffleInPlace(ids, G.rng);

    var changed = 0;
    var from = [];
    var to = [];
    var movedIds = [];
    for (var i = 0; i < ids.length; i++) {
      var piece = G.pieces[ids[i]];
      if (!piece || piece.cells.length !== 4) continue;
      var cells = piece.cells.map(function (c) { return [c[0], c[1]]; });
      var own = {};
      for (var c2 = 0; c2 < cells.length; c2++) own[cells[c2][0] + ',' + cells[c2][1]] = true;
      var pick = chooseTarget(cells, {
        bounds: { minX: 0, minY: 0, maxX: COLS - 1, maxY: ROWS - 1 },
        rng: G.rng,
        valid: makeFreeCheck(own),
        maxWiden: cfg.TARGET_WIDEN_MAX
      });
      if (!pick) continue;
      eraseCells(cells);
      writeCells(pick.cells, piece.id, true, true);
      piece.cells = pick.cells.map(function (c) { return [c[0], c[1]]; });
      for (var m = 0; m < 4; m++) {
        from.push([cells[m][0], cells[m][1]]);
        to.push([pick.cells[m][0], pick.cells[m][1]]);
      }
      movedIds.push(piece.id);
      changed++;
    }
    return { gone: cellsMinus(from, to), came: cellsMinus(to, from), ids: movedIds };
  }

  /* After a mutation or refactor, each changed piece falls as a unit until it
   * rests on the floor, on other cells, or on the falling piece. It runs in
   * the frame loop, so it happens while the next ticket is already in play,
   * and a full row it completes ships through shipFullRows like any other.
   */
  function startSettling(ids) {
    for (var i = 0; i < ids.length; i++) {
      var dup = false;
      for (var j = 0; j < G.settling.length; j++) if (G.settling[j].id === ids[i]) dup = true;
      if (!dup) G.settling.push({ id: ids[i], wait: cfg.SETTLE_DELAY_MS, acc: 0, fell: false });
    }
    requestDraw();
  }

  function pieceMaxY(piece) {
    var m = -1;
    for (var i = 0; i < piece.cells.length; i++) if (piece.cells[i][1] > m) m = piece.cells[i][1];
    return m;
  }

  function canSettleDown(piece, blocked) {
    for (var i = 0; i < piece.cells.length; i++) {
      var x = piece.cells[i][0], ny = piece.cells[i][1] + 1;
      if (ny >= ROWS) return false;
      var c = G.board[ny][x];
      if (c.filled && c.pieceId !== piece.id) return false;
      if (blocked[x + ',' + ny]) return false;
    }
    return true;
  }

  function shiftPieceDown(piece) {
    var first = G.board[piece.cells[0][1]][piece.cells[0][0]];
    var slop = first.slop, mutated = first.mutated;
    var next = piece.cells.map(function (c) { return [c[0], c[1] + 1]; });
    eraseCells(piece.cells);
    writeCells(next, piece.id, slop, mutated);
    piece.cells = next;
  }

  function updateSettling(dt) {
    if (!G.settling.length) return;
    var blocked = {};
    if (G.state === 'falling' && G.falling) {
      var fc = pieceCells(G.falling);
      for (var k = 0; k < fc.length; k++) blocked[fc[k][0] + ',' + fc[k][1]] = true;
    }
    // Lowest first, so a stack of changed pieces settles from the bottom up.
    G.settling.sort(function (a, b) {
      var pa = G.pieces[a.id], pb = G.pieces[b.id];
      return (pb ? pieceMaxY(pb) : -1) - (pa ? pieceMaxY(pa) : -1);
    });
    var moved = false, rested = false;
    for (var i = G.settling.length - 1; i >= 0; i--) {
      var s = G.settling[i];
      var piece = G.pieces[s.id];
      if (!piece || !piece.cells.length) { G.settling.splice(i, 1); continue; }
      if (s.wait > 0) { s.wait -= dt; continue; }
      s.acc += dt;
      var guard = ROWS;
      while (s.acc >= cfg.SETTLE_MS && guard-- > 0) {
        s.acc -= cfg.SETTLE_MS;
        if (canSettleDown(piece, blocked)) {
          shiftPieceDown(piece);
          s.fell = true;
          moved = true;
        } else {
          G.settling.splice(i, 1);
          if (s.fell) { SFX('lock'); rested = true; }
          break;
        }
      }
    }
    if (moved || rested) requestDraw();
    if (rested) shipFullRows();
  }

  /* Row clears are serialized so a settling piece and the lock pipeline can
   * both ask for one without double-clearing the same rows.
   */
  var shipChain = Promise.resolve();
  function shipFullRows() {
    var p = shipChain.then(function () { return shipOnce(G.runId); });
    shipChain = p.then(null, function () { /* keep the chain alive */ });
    return p;
  }

  async function shipOnce(run) {
    if (G.runId !== run || G.screen !== 'play') return false;
    var rows = fullRows();
    if (!rows.length) return false;
    SFX('clear');
    var slopN = countSlopInRows(rows);
    G.lineFlash = { rows: rows, start: nowMs() };
    requestDraw();
    await wait(cfg.LINE_FLASH_MS);
    if (G.runId !== run) return false;
    G.lineFlash = null;
    clearRows(rows);
    G.counters.lines += rows.length;
    G.sprintLines += rows.length;
    updateGoalLabel();
    if (slopN > 0) {
      setStatusEvent(fill(
        rows.length > 1 ? COPY.STATUS_SHIPPED_SLOP_MANY : COPY.STATUS_SHIPPED_SLOP,
        { n: slopN }
      ));
    } else {
      setStatusEvent(COPY.STATUS_SHIPPED);
    }
    // Cells that dropped into a falling piece's rows lift it clear.
    if (G.state === 'falling' && G.falling) {
      var lift = ROWS;
      while (lift-- > 0 && !fits(pieceCells(G.falling))) G.falling.y -= 1;
    }
    requestDraw();
    if (G.screen === 'play' && G.sprintLines >= G.sprintGoal) advanceSprint();
    return true;
  }

  function makeFreeCheck(own) {
    return function (cand) {
      for (var n = 0; n < cand.length; n++) {
        var x = cand[n][0], y = cand[n][1];
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
        if (G.board[y][x].filled && !own[x + ',' + y]) return false;
      }
      return true;
    };
  }

  /* =====================================================================
   * 7. STATE
   * ===================================================================== */

  function newCounters() {
    return { lines: 0, generated: 0, built: 0, mutated: 0, refactors: 0, reviewed: 0 };
  }

  function newWorkbench() {
    var wb = [];
    for (var i = 0; i < 16; i++) wb.push(false);
    return wb;
  }

  var G = {
    // screens and states
    screen: 'title',          // 'title' | 'play' | 'retro'
    state: 'spec',            // 'spec' | 'falling' | 'locking' | 'retro'
    howtoOpen: false,
    howtoReturn: 'title',
    paused: false,            // true only while the resume overlay is up
    coarse: false,

    // run
    seed: 0,
    seedMode: 'random',
    seedModePref: 'random',
    fixedSeed: 1,
    seedForced: false,
    rng: mulberry32(1),

    sprint: 1,
    clockMs: CONFIG.DEADLINES_S[0] * 1000,
    sprintLines: 0,           // lines shipped in this sprint
    sprintGoal: CONFIG.GOALS_LINES[0],
    warned: false,

    bag: [],
    ticket: { shape: 'L', copyIndex: 0 },

    board: newBoard(),
    pieces: {},
    nextPieceId: 1,
    falling: null,

    workbench: newWorkbench(),
    wbCursor: { x: 0, y: 0 },
    wbFlashUntil: 0,

    streak: 0,
    counters: newCounters(),

    chatLines: [],            // [{ el, text }]
    chat: [],                 // completed texts, max 3
    typeJob: null,
    typeQueue: [],

    // status bar
    statusEvent: '',
    statusEventUntil: 0,

    // input
    softDropHeld: false,
    ptr: null,                // the one tracked pointer on the well

    // review
    reviewHeld: false,
    chargeTone: false,
    pulse: null,              // { kind: 'stable'|'mutate', start }
    reviewFlash: null,        // { start } well-wide flash when the pulse fires
    mutateFlash: null,        // { start, gone, came } crossfade when cells change after lock
    settling: [],             // [{ id, wait, acc, fell }] changed pieces dropping into place
    sprintBanner: null,       // { kind, start, hold, lines: [[text, bright]] } sprint transition
    overReason: '',           // '' while playing; 'topout' or 'deadline' on the retro
    runId: 0,                 // bumped by newRun so a lock pipeline mid-await can bail out
    building: null,           // { until, timer } while a hand-built piece is being built
    newConfirmUntil: 0,       // nowMs() deadline for the second N press, 0 when idle

    // animation
    lineFlash: null,          // { rows, start }
    gravityAcc: 0,
    lastFrame: 0,
    rafId: 0,
    lastSaveAt: 0,
    lastTickAt: 0,

    // dev
    devOpen: false,
    forceMutation: false,
    forceRefactor: false,
    showTargets: false,
    showStreak: false,

    // render
    cell: 20,
    dpr: 1,
    dither: null,
    resumeConfirm: false,
    saveWarned: false,
    best: 0
  };

  function nowMs() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  function deadlineFor(sprint) {
    var idx = Math.min(sprint, cfg.DEADLINES_S.length) - 1;
    if (idx < 0) idx = 0;
    return cfg.DEADLINES_S[idx];
  }

  // Mutation chance (percent) for a piece generated during this sprint.
  function mutationChanceFor(sprint) {
    var idx = Math.min(sprint, cfg.MUTATION_TABLE.length) - 1;
    if (idx < 0) idx = 0;
    return cfg.MUTATION_TABLE[idx];
  }

  function goalFor(sprint) {
    var idx = Math.min(sprint, cfg.GOALS_LINES.length) - 1;
    if (idx < 0) idx = 0;
    return Math.max(1, cfg.GOALS_LINES[idx] | 0);
  }

  function fmtMSS(ms) {
    var t = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(t / 60);
    var s = t % 60;
    return m + ':' + (s < 10 ? '0' + s : String(s));
  }

  function fmtMMSS(ms) {
    var t = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(t / 60);
    var s = t % 60;
    return (m < 10 ? '0' + m : String(m)) + ':' + (s < 10 ? '0' + s : String(s));
  }

  /* =====================================================================
   * 8. SAVE / RESTORE  (SPEC 7A)
   * ===================================================================== */

  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function lsSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }

  function lsRemove(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
  }

  function serializeBoard() {
    var out = [];
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var c = G.board[y][x];
        if (!c.filled) { out.push(0); continue; }
        out.push([c.pieceId === null ? -1 : c.pieceId, c.slop ? 1 : 0, c.mutated ? 1 : 0]);
      }
    }
    return out;
  }

  function deserializeBoard(flat) {
    var board = newBoard();
    if (!flat || flat.length !== ROWS * COLS) return board;
    for (var i = 0; i < flat.length; i++) {
      var v = flat[i];
      if (!v) continue;
      var y = Math.floor(i / COLS);
      var x = i % COLS;
      board[y][x] = {
        filled: true,
        pieceId: v[0] === -1 ? null : v[0],
        slop: v[1] === 1,
        mutated: v[2] === 1
      };
    }
    return board;
  }

  function sortedCells(cells) {
    var copy = cells.map(function (c) { return [c[0], c[1]]; });
    copy.sort(function (a, b) { return (a[1] - b[1]) || (a[0] - b[0]); });
    return copy;
  }

  function serializePieces() {
    var ids = [];
    for (var k in G.pieces) {
      if (Object.prototype.hasOwnProperty.call(G.pieces, k)) ids.push(G.pieces[k].id);
    }
    ids.sort(function (a, b) { return a - b; });
    return ids.map(function (id) {
      var p = G.pieces[id];
      return { id: p.id, slop: !!p.slop, cells: sortedCells(p.cells) };
    });
  }

  function serializeFalling() {
    var p = G.falling;
    if (!p) return null;
    return {
      shape: p.shape,
      orientation: p.orientation,
      x: p.x,
      y: p.y,
      slop: !!p.slop,
      willMutate: !!p.willMutate,
      willRefactor: !!p.willRefactor,
      targetLocal: p.targetLocal ? p.targetLocal.map(function (c) { return [c[0], c[1]]; }) : null,
      targetOutline: p.targetOutline ? p.targetOutline.map(function (v) { return [v[0], v[1]]; }) : null,
      reviewCharge: p.reviewCharge,
      reviewed: !!p.reviewed,
      landed: !!p.landed,
      pieceId: p.pieceId
    };
  }

  function serialize() {
    return {
      schemaVersion: CONFIG.SCHEMA_VERSION,
      screen: G.screen === 'retro' ? 'retro' : 'play',
      state: (G.state === 'falling') ? 'falling' : ((G.state === 'retro') ? 'retro' : 'spec'),
      sprint: G.sprint,
      clockMs: Math.max(0, Math.round(G.clockMs)),
      sprintLines: G.sprintLines,
      sprintGoal: G.sprintGoal,
      over: G.overReason,
      warned: !!G.warned,
      seed: G.seed >>> 0,
      seedMode: G.seedMode,
      rngState: G.rng.getState(),
      bag: G.bag.slice(),
      ticket: { shape: G.ticket.shape, copyIndex: G.ticket.copyIndex },
      board: serializeBoard(),
      pieces: serializePieces(),
      nextPieceId: G.nextPieceId,
      falling: serializeFalling(),
      workbench: G.workbench.slice(),
      wbCursor: { x: G.wbCursor.x, y: G.wbCursor.y },
      streak: G.streak,
      counters: {
        lines: G.counters.lines,
        generated: G.counters.generated,
        built: G.counters.built,
        mutated: G.counters.mutated,
        refactors: G.counters.refactors,
        reviewed: G.counters.reviewed
      },
      chat: G.chat.slice()
    };
  }

  // Pure state restoration. Touches no DOM, so it is safe to call headless.
  function restoreState(obj) {
    G.screen = obj.screen === 'retro' ? 'retro' : 'play';
    G.state = (obj.state === 'falling') ? 'falling' : ((obj.state === 'retro') ? 'retro' : 'spec');
    if (G.screen === 'retro') G.state = 'retro';
    G.sprint = obj.sprint || 1;
    G.clockMs = Math.max(0, obj.clockMs || 0);
    G.sprintLines = obj.sprintLines | 0;
    G.sprintGoal = obj.sprintGoal > 0 ? (obj.sprintGoal | 0) : goalFor(G.sprint);
    G.overReason = (obj.over === 'deadline' || obj.over === 'topout') ? obj.over : '';
    G.warned = !!obj.warned;
    G.seed = (obj.seed || 0) >>> 0;
    G.seedMode = obj.seedMode || 'random';
    G.rng = mulberry32(G.seed);
    G.rng.setState(obj.rngState >>> 0);
    G.bag = (obj.bag || []).slice();
    G.ticket = {
      shape: (obj.ticket && obj.ticket.shape) || 'L',
      copyIndex: (obj.ticket && obj.ticket.copyIndex) || 0
    };
    G.board = deserializeBoard(obj.board);
    G.pieces = {};
    var list = obj.pieces || [];
    for (var i = 0; i < list.length; i++) {
      G.pieces[list[i].id] = {
        id: list[i].id,
        slop: !!list[i].slop,
        cells: (list[i].cells || []).map(function (c) { return [c[0], c[1]]; })
      };
    }
    G.nextPieceId = obj.nextPieceId || 1;

    if (obj.falling) {
      var f = obj.falling;
      G.falling = {
        shape: f.shape,
        orientation: f.orientation | 0,
        x: f.x | 0,
        y: f.y | 0,
        slop: !!f.slop,
        willMutate: !!f.willMutate,
        willRefactor: !!f.willRefactor,
        targetLocal: f.targetLocal ? f.targetLocal.map(function (c) { return [c[0], c[1]]; }) : null,
        targetOutline: f.targetOutline ? f.targetOutline.map(function (v) { return [v[0], v[1]]; }) : null,
        reviewCharge: f.reviewCharge || 0,
        reviewed: !!f.reviewed,
        landed: !!f.landed,
        lockResetUsed: false,
        lockTimerMs: 0,
        pieceId: f.pieceId
      };
    } else {
      G.falling = null;
    }

    G.workbench = (obj.workbench || newWorkbench()).slice();
    while (G.workbench.length < 16) G.workbench.push(false);
    G.wbCursor = {
      x: (obj.wbCursor && obj.wbCursor.x) || 0,
      y: (obj.wbCursor && obj.wbCursor.y) || 0
    };
    G.streak = obj.streak || 0;
    var c = obj.counters || {};
    G.counters = {
      lines: c.lines || 0,
      generated: c.generated || 0,
      built: c.built || 0,
      mutated: c.mutated || 0,
      refactors: c.refactors || 0,
      reviewed: c.reviewed || 0
    };
    G.chat = (obj.chat || []).slice(-3);

    // Not saved, and never restored mid-animation.
    G.pulse = null;
    G.reviewFlash = null;
    G.mutateFlash = null;
    G.settling = [];
    G.sprintBanner = null;
    G.lineFlash = null;
    G.reviewHeld = false;
    G.typeJob = null;
    G.typeQueue = [];
    G.gravityAcc = 0;
    G.statusEvent = '';
    G.statusEventUntil = 0;
    // The held banner over a missed deadline is rebuilt, not saved.
    if (G.screen === 'retro' && G.overReason === 'deadline') G.sprintBanner = deadlineBanner();
    return G;
  }

  function saveNow() {
    if (G.state === 'locking') return;
    if (G.screen === 'title') return;
    if (G.pulse || G.lineFlash || G.settling.length) return;
    var ok = lsSet(CONFIG.SAVE_KEY, JSON.stringify(serialize()));
    if (!ok && !G.saveWarned) {
      G.saveWarned = true;
      if (window.console && console.warn) console.warn('sloptris: could not write the save, continuing without it');
    }
    G.lastSaveAt = nowMs();
  }

  function deleteSave() {
    lsRemove(CONFIG.SAVE_KEY);
  }

  function loadSave() {
    var raw = lsGet(CONFIG.SAVE_KEY);
    if (!raw) return null;
    var obj = null;
    try { obj = JSON.parse(raw); } catch (e) { obj = null; }
    if (!obj || obj.schemaVersion !== CONFIG.SCHEMA_VERSION) {
      deleteSave();
      return null;
    }
    return obj;
  }

  function readBest() {
    var raw = lsGet(CONFIG.BEST_KEY);
    var n = parseInt(raw, 10);
    return isFinite(n) && n > 0 ? n : 0;
  }

  function writeBest(n) {
    if (n > G.best) {
      G.best = n;
      lsSet(CONFIG.BEST_KEY, String(n));
    }
  }

  function howtoSeen() { return lsGet(CONFIG.HOWTO_KEY) === '1'; }
  function markHowtoSeen() { lsSet(CONFIG.HOWTO_KEY, '1'); }

  /* =====================================================================
   * 9. RENDER
   * ===================================================================== */

  var D = {};       // cached DOM nodes, filled in BOOT
  var ctx = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function rgba(rgb, a) {
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')';
  }

  function lerpRGB(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function clamp(lo, v, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function heightOf(el) {
    if (!el) return 0;
    var r = el.getBoundingClientRect();
    return r.height || 0;
  }

  // SPEC 2, Responsive layout.
  function pxOf(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  // Vertical and horizontal space taken by everything that is not the well
  // canvas, measured from the live layout so CSS changes never desync it.
  function measureChrome() {
    var wellPanel = byId('well-panel');
    var appCS = D.app ? getComputedStyle(D.app) : null;
    var playCS = byId('play') ? getComputedStyle(byId('play')) : null;
    var asstCS = D.assistantPanel ? getComputedStyle(D.assistantPanel) : null;
    var rowGap = appCS ? pxOf(appCS.rowGap || appCS.gap) : 8;
    var colGap = playCS ? pxOf(playCS.columnGap || playCS.gap) : 8;
    var panelV = wellPanel && D.canvas
      ? Math.max(0, heightOf(wellPanel) - heightOf(D.canvas)) : 18;
    var panelH = wellPanel && D.canvas
      ? Math.max(0, wellPanel.getBoundingClientRect().width - D.canvas.getBoundingClientRect().width) : 14;
    var v = heightOf(D.header) + heightOf(D.assistantPanel) + heightOf(D.hintRow) + heightOf(D.statusBar);
    if (!v) v = 128;
    v += rowGap * 4 + panelV;
    if (appCS) v += pxOf(appCS.paddingTop) + pxOf(appCS.paddingBottom);
    if (asstCS) v += pxOf(asstCS.marginTop) + pxOf(asstCS.marginBottom);
    var h = panelH + colGap;
    if (appCS) h += pxOf(appCS.paddingLeft) + pxOf(appCS.paddingRight);
    return { v: v + 2, h: h + 2 };
  }

  function computeCell() {
    var vw = window.innerWidth || 390;
    var vh = window.innerHeight || 700;
    var rightW = D.rightCol ? D.rightCol.getBoundingClientRect().width : 0;
    if (!rightW) rightW = 152;
    var chrome = measureChrome();
    var byW = Math.floor((vw - rightW - chrome.h) / COLS);
    var byH = Math.floor((vh - chrome.v) / ROWS);
    var cell = Math.min(byW, byH);
    if (!isFinite(cell) || cell <= 0) cell = cfg.CELL_MIN;
    return clamp(cfg.CELL_MIN, cell, cfg.CELL_MAX);
  }

  var resizing = false;

  function resize() {
    if (!D.canvas || !ctx || resizing) return;
    resizing = true;
    var cell = computeCell();
    G.cell = cell;
    if (D.app && D.app.style.setProperty) D.app.style.setProperty('--cell', cell + 'px');
    var dpr = window.devicePixelRatio || 1;
    G.dpr = dpr;
    var cssW = COLS * cell;
    var cssH = ROWS * cell;
    D.canvas.style.width = cssW + 'px';
    D.canvas.style.height = cssH + 'px';
    D.canvas.width = Math.round(cssW * dpr);
    D.canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    G.dither = buildDither(dpr);
    resizing = false;
    requestDraw();
  }

  // A small checkerboard tile, rebuilt whenever the device pixel ratio moves,
  // so slop cells read as "not solid" even at thumbnail size.
  function buildDither(dpr) {
    if (!ctx || !document.createElement) return null;
    var canTransform = (typeof DOMMatrix !== 'undefined');
    var unit = 2;
    var px = canTransform ? Math.max(1, Math.round(unit * dpr)) : unit;
    var tile = document.createElement('canvas');
    tile.width = px * 2;
    tile.height = px * 2;
    var t = tile.getContext('2d');
    if (!t) return null;
    t.fillStyle = rgba(COLORS.accentRGB, 0.62);
    t.fillRect(0, 0, px, px);
    t.fillRect(px, px, px, px);
    var pat = ctx.createPattern(tile, 'repeat');
    if (pat && canTransform && pat.setTransform) {
      try { pat.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0])); } catch (e) { /* older engine */ }
    }
    return pat;
  }

  function cellRect(x, y, inset) {
    var cell = G.cell;
    return [x * cell + inset, y * cell + inset, cell - inset * 2, cell - inset * 2];
  }

  function fillCell(x, y, inset) {
    if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return;
    var r = cellRect(x, y, inset);
    ctx.fillRect(r[0], r[1], r[2], r[3]);
  }

  function paintSolid(cells) {
    ctx.fillStyle = COLORS.accent;
    for (var i = 0; i < cells.length; i++) fillCell(cells[i][0], cells[i][1], 0.5);
  }

  function paintSlop(cells) {
    var i;
    // The glow pass painted these cells to cast their shadow; reset the
    // interior to the background so the dither reads as "not solid".
    ctx.fillStyle = COLORS.bg;
    for (i = 0; i < cells.length; i++) fillCell(cells[i][0], cells[i][1], 0.5);
    ctx.fillStyle = rgba(COLORS.accentRGB, 0.14);
    for (i = 0; i < cells.length; i++) fillCell(cells[i][0], cells[i][1], 0.5);
    if (G.dither) {
      ctx.fillStyle = G.dither;
      for (i = 0; i < cells.length; i++) fillCell(cells[i][0], cells[i][1], 0.5);
    } else {
      ctx.fillStyle = rgba(COLORS.accentRGB, 0.45);
      for (i = 0; i < cells.length; i++) fillCell(cells[i][0], cells[i][1], 0.5);
    }
  }

  function collectBoardCells() {
    var solid = [], slop = [];
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var c = G.board[y][x];
        if (!c.filled) continue;
        if (c.slop) slop.push([x, y]); else solid.push([x, y]);
      }
    }
    return { solid: solid, slop: slop };
  }

  function draw(now) {
    if (!ctx || !D.canvas) return;
    var cell = G.cell;
    var W = COLS * cell;
    var H = ROWS * cell;
    var i;

    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    // Faint centre dots for empty cells.
    var dot = Math.max(1, Math.round(cell * 0.1));
    ctx.fillStyle = 'rgba(107,112,117,0.55)';
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (G.board[y][x].filled) continue;
        ctx.fillRect(
          x * cell + (cell - dot) / 2,
          y * cell + (cell - dot) / 2,
          dot, dot
        );
      }
    }

    var groups = collectBoardCells();
    var fp = (G.falling && G.state === 'falling') ? G.falling : null;
    var fpCells = fp ? pieceCells(fp) : [];
    var charge = reviewProgress(fp);

    // One glow pass for every filled cell, falling piece included, so the
    // phosphor never stacks on neighbours.
    ctx.save();
    ctx.shadowBlur = cfg.GLOW_BLUR;
    ctx.shadowColor = rgba(COLORS.accentRGB, cfg.GLOW_ALPHA);
    ctx.fillStyle = COLORS.accent;
    for (i = 0; i < groups.solid.length; i++) fillCell(groups.solid[i][0], groups.solid[i][1], 0.5);
    ctx.shadowColor = rgba(COLORS.accentRGB, cfg.GLOW_ALPHA / 2);
    ctx.fillStyle = rgba(COLORS.accentRGB, 0.45);
    for (i = 0; i < groups.slop.length; i++) fillCell(groups.slop[i][0], groups.slop[i][1], 0.5);
    if (fp) {
      var blur = cfg.GLOW_BLUR * (1 + 2.5 * charge);
      var alpha = (fp.slop ? cfg.GLOW_ALPHA / 2 : cfg.GLOW_ALPHA) + 0.5 * charge;
      ctx.shadowBlur = blur;
      ctx.shadowColor = rgba(lerpRGB(COLORS.accentRGB, COLORS.hiRGB, charge), Math.min(0.95, alpha));
      ctx.fillStyle = COLORS.accent;
      for (i = 0; i < fpCells.length; i++) fillCell(fpCells[i][0], fpCells[i][1], 0.5);
    }
    ctx.restore();

    // The cells themselves, shadows off. Mutated cells look like any slop cell.
    ctx.shadowBlur = 0;
    paintSolid(groups.solid);
    paintSlop(groups.slop);

    // The falling piece, tinted toward the highlight as review charge builds.
    if (fp) {
      if (fp.slop) {
        paintSlop(fpCells);
        if (charge > 0) {
          ctx.fillStyle = rgba(COLORS.hiRGB, 0.55 * charge);
          for (i = 0; i < fpCells.length; i++) fillCell(fpCells[i][0], fpCells[i][1], 0.5);
        }
      } else {
        ctx.fillStyle = 'rgb(' + lerpRGB(COLORS.accentRGB, COLORS.hiRGB, charge).join(',') + ')';
        for (i = 0; i < fpCells.length; i++) fillCell(fpCells[i][0], fpCells[i][1], 0.5);
      }
    }

    // Line flash.
    if (G.lineFlash) {
      var el = now - G.lineFlash.start;
      var a = 0.85 * (1 - clamp(0, el / cfg.LINE_FLASH_MS, 1) * 0.35);
      ctx.fillStyle = rgba(COLORS.hiRGB, a);
      for (i = 0; i < G.lineFlash.rows.length; i++) {
        ctx.fillRect(0, G.lineFlash.rows[i] * cell, W, cell);
      }
    }

    // Review: the well-wide flash and pulse when the answer lands, then the
    // reviewed piece wears its answer for the rest of the fall.
    if (fp && G.reviewFlash) drawReviewFlash(fpCells, now);
    if (fp && G.pulse) drawPulse(fp, fpCells, now);
    if (fp && fp.reviewed && !G.pulse) drawReviewed(fp, fpCells);
    if (G.mutateFlash) drawMutateFlash(now);

    // Dev: show hidden targets.
    if (G.showTargets && fp && fp.targetOutline) {
      strokeOutline(targetWellOutline(fp), rgba(COLORS.accentRGB, 0.3), 1, [3, 3], 0);
    }

    if (G.sprintBanner) drawSprintBanner(now);

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  var MONO = 'ui-monospace, Menlo, Consolas, "Courier New", monospace';

  /* Sprint transition: the well flashes, then a band across the upper well
   * names the sprint that ended and what the next one wants. The piece keeps
   * falling underneath; the band covers only the upper third. A held banner
   * (missed deadline) skips the flash and fades and stays until a new run.
   */
  function drawSprintBanner(now) {
    var b = G.sprintBanner;
    var el = now - b.start;
    var total = cfg.SPRINT_BANNER_MS;
    if (!b.hold && el >= total) { G.sprintBanner = null; return; }
    var cell = G.cell;
    var W = COLS * cell, H = ROWS * cell;
    var i;

    var a = 1;
    if (!b.hold) {
      if (el < 500) {
        var f = 1 - el / 500;
        ctx.fillStyle = rgba(COLORS.hiRGB, 0.5 * f * f);
        ctx.fillRect(0, 0, W, H);
      }
      if (el < 150) a = el / 150;
      else if (el > total - 400) a = (total - el) / 400;
    }

    var fs = Math.max(11, Math.round(cell * 0.82));
    var lh = Math.round(fs * 1.45);
    var pad = Math.round(fs * 0.9);
    var bandH = lh * b.lines.length + pad * 2;
    var y0 = Math.round(H * 0.36 - bandH / 2);

    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = rgba(COLORS.bgRGB, 0.94);
    ctx.fillRect(0, y0, W, bandH);
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, y0 + 0.5, W - 1, bandH - 1);
    ctx.font = fs + 'px ' + MONO;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = cfg.GLOW_BLUR;
    ctx.shadowColor = rgba(COLORS.accentRGB, cfg.GLOW_ALPHA);
    for (i = 0; i < b.lines.length; i++) {
      var text = b.lines[i][0];
      if (!text) continue;
      ctx.fillStyle = b.lines[i][1] ? COLORS.hi : COLORS.accent;
      ctx.fillText(text, W / 2, y0 + pad + lh * i + lh / 2);
    }
    ctx.restore();
  }

  function drawPulse(fp, fpCells, now) {
    var cell = G.cell;
    var el = now - G.pulse.start;
    var i;
    if (G.pulse.kind === 'stable') {
      var total = cfg.PULSE_GROW_MS + cfg.PULSE_FADE_MS;
      if (el >= total) { G.pulse = null; return; }
      var bb = boundingBox(fpCells);
      var x0 = bb.x0 * cell, y0 = bb.y0 * cell;
      var w = (bb.x1 - bb.x0 + 1) * cell, h = (bb.y1 - bb.y0 + 1) * cell;
      var cx = x0 + w / 2, cy = y0 + h / 2;
      var maxR = Math.sqrt(w * w + h * h) / 2;
      var r = Math.max(0.01, maxR * clamp(0, el / cfg.PULSE_GROW_MS, 1));
      var alpha = el <= cfg.PULSE_GROW_MS ? 1 : Math.max(0, 1 - (el - cfg.PULSE_GROW_MS) / cfg.PULSE_FADE_MS);
      ctx.save();
      ctx.beginPath();
      for (i = 0; i < fpCells.length; i++) {
        if (fpCells[i][1] < 0) continue;
        var rc = cellRect(fpCells[i][0], fpCells[i][1], 0.5);
        ctx.rect(rc[0], rc[1], rc[2], rc[3]);
      }
      ctx.clip();
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, rgba(COLORS.hiRGB, alpha));
      grad.addColorStop(1, rgba(COLORS.hiRGB, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(x0 - cell, y0 - cell, w + cell * 2, h + cell * 2);
      ctx.restore();
      return;
    }

    // Mutating piece: a short bright head travels once around the target.
    var verts = targetWellOutline(fp);
    if (!verts || verts.length < 2) { G.pulse = null; return; }
    if (el >= cfg.OUTLINE_TRAVEL_MS) { G.pulse = null; return; }
    var perimeter = verts.length * cell;
    var head = Math.max(cell * 1.2, perimeter * 0.12);
    var progress = clamp(0, el / cfg.OUTLINE_TRAVEL_MS, 1);
    strokeOutline(verts, rgba(COLORS.accentRGB, 0.4), 1.5, null, 0);
    strokeOutline(verts, COLORS.hi, 2, [head, perimeter - head], -progress * perimeter);
  }

  /* The answer arriving: the whole well lights up and drains, and a ring
   * runs out from the piece. Same highlight as the pulse, just bigger.
   */
  function drawReviewFlash(fpCells, now) {
    var el = now - G.reviewFlash.start;
    var total = cfg.REVIEW_FLASH_MS;
    if (el >= total) { G.reviewFlash = null; return; }
    var cell = G.cell;
    var t = clamp(0, el / total, 1);
    var fade = (1 - t) * (1 - t);
    ctx.save();
    ctx.fillStyle = rgba(COLORS.hiRGB, 0.5 * fade);
    ctx.fillRect(0, 0, COLS * cell, ROWS * cell);
    var bb = boundingBox(fpCells);
    var cx = (bb.x0 + bb.x1 + 1) / 2 * cell;
    var cy = (bb.y0 + bb.y1 + 1) / 2 * cell;
    var r = cell * (1.5 + 6 * t);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = rgba(COLORS.hiRGB, 0.9 * (1 - t));
    ctx.shadowBlur = cfg.GLOW_BLUR * 2;
    ctx.shadowColor = rgba(COLORS.hiRGB, 0.6 * (1 - t));
    ctx.stroke();
    ctx.restore();
  }

  /* When cells change after lock, the change crossfades so the eye can read
   * it: cells that left fade out (their slop look painted over the now-empty
   * cells), cells that arrived fade in (the background lifts off them), and a
   * dark-amber halo sits around the arriving cells while it lasts. Cells the
   * old and new shapes share never flicker. The board itself already holds
   * the new shape; this is drawn over it.
   */
  function drawMutateFlash(now) {
    var m = G.mutateFlash;
    var el = now - m.start;
    var total = cfg.MUTATE_FLASH_MS;
    if (el >= total) { G.mutateFlash = null; return; }
    var cell = G.cell;
    var t = clamp(0, el / total, 1);
    var fade = (1 - t) * (1 - t);
    var i, r;

    if (m.gone.length) {
      ctx.save();
      ctx.globalAlpha = 1 - t;
      paintSlop(m.gone);
      ctx.restore();
    }

    if (m.came.length) {
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = COLORS.bg;
      for (i = 0; i < m.came.length; i++) fillCell(m.came[i][0], m.came[i][1], 0.5);
      ctx.restore();

      // The halo only, outside the cells: clip the cells out, then let the
      // shadow of a dark fill spill around them.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, COLS * cell, ROWS * cell);
      for (i = 0; i < m.came.length; i++) {
        r = cellRect(m.came[i][0], m.came[i][1], 0.5);
        ctx.rect(r[0], r[1], r[2], r[3]);
      }
      ctx.clip('evenodd');
      ctx.shadowBlur = cfg.GLOW_BLUR * 3;
      ctx.shadowColor = rgba(COLORS.darkRGB, 0.95 * fade);
      ctx.fillStyle = rgba(COLORS.darkRGB, 0.95 * fade);
      for (i = 0; i < m.came.length; i++) fillCell(m.came[i][0], m.came[i][1], 0.5);
      for (i = 0; i < m.came.length; i++) fillCell(m.came[i][0], m.came[i][1], 0.5);
      ctx.restore();
    }
  }

  /* A reviewed piece reads as one tetromino, not four cells: the seams close,
   * the fill brightens, and its final shape is stroked in the highlight. For a
   * stable piece that is its own silhouette; for a mutating piece it is the
   * target. Cells outside the target are the ones that will vanish.
   */
  function drawReviewed(fp, fpCells) {
    var i;
    ctx.save();
    ctx.fillStyle = rgba(COLORS.hiRGB, fp.slop ? 0.4 : 0.6);
    for (i = 0; i < fpCells.length; i++) fillCell(fpCells[i][0], fpCells[i][1], 0);
    ctx.restore();
    var verts = fp.willMutate ? targetWellOutline(fp) : outlineEdges(fpCells);
    strokeOutline(verts, rgba(COLORS.hiRGB, 0.35), 5, null, 0);
    strokeOutline(verts, COLORS.hi, 2, null, 0);
  }

  function strokeOutline(verts, color, width, dash, dashOffset) {
    if (!verts || verts.length < 2) return;
    var cell = G.cell;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(verts[0][0] * cell, verts[0][1] * cell);
    for (var i = 1; i < verts.length; i++) {
      ctx.lineTo(verts[i][0] * cell, verts[i][1] * cell);
    }
    ctx.closePath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineJoin = 'miter';
    if (ctx.setLineDash) ctx.setLineDash(dash || []);
    ctx.lineDashOffset = dashOffset || 0;
    if (color === COLORS.hi) {
      ctx.shadowBlur = cfg.GLOW_BLUR;
      ctx.shadowColor = rgba(COLORS.hiRGB, 0.6);
    }
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.restore();
  }

  /* --- DOM rendering ------------------------------------------------- */

  function applyScreenClass() {
    if (!document.body) return;
    var names = ['screen-title', 'screen-howto', 'screen-resume', 'screen-play', 'screen-retro'];
    var want;
    if (G.howtoOpen) want = 'screen-howto';
    else if (G.paused) want = 'screen-resume';
    else if (G.screen === 'title') want = 'screen-title';
    else if (G.screen === 'retro') want = 'screen-retro';
    else want = 'screen-play';
    for (var i = 0; i < names.length; i++) {
      if (names[i] === want) document.body.classList.add(names[i]);
      else document.body.classList.remove(names[i]);
    }
    if (D.titleScreen) D.titleScreen.hidden = (G.screen !== 'title') || G.howtoOpen;
    if (D.howtoScreen) D.howtoScreen.hidden = !G.howtoOpen;
    var hideHdr = (G.screen === 'title');
    if (D.clock) D.clock.classList.toggle('hidden', hideHdr);
    if (D.goal) D.goal.classList.toggle('hidden', hideHdr);
  }

  function updateClock() {
    if (!D.clock) return;
    D.clock.textContent = fmtMMSS(G.clockMs);
    D.clock.classList.toggle('warn', G.clockMs <= 30000);
    D.clock.classList.toggle('danger', G.clockMs <= 10000);
  }

  function updateSprintLabel() {
    if (D.sprintLabel) D.sprintLabel.textContent = fill(COPY.SPRINT_LABEL, { n: G.sprint });
  }

  function updateGoalLabel() {
    if (!D.goalN) return;
    var text = fill(COPY.GOAL_LABEL, { k: G.sprintLines, goal: G.sprintGoal });
    if (D.goalN.textContent !== text) D.goalN.textContent = text;
    if (D.goal) D.goal.classList.toggle('met', G.sprintLines >= G.sprintGoal);
  }

  // Restart the header's reset animation on the clock and goal.
  function flashHeader() {
    var els = [D.clock, D.goal];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el) continue;
      el.classList.remove('reset');
      void el.offsetWidth;
      el.classList.add('reset');
    }
  }

  function updateTicketDOM() {
    if (D.ticketTitle) D.ticketTitle.textContent = fill(COPY.TICKET_TITLE, { n: G.nextPieceId });
    if (D.ticketCells && D.ticketCells.length === 16) {
      var on = {};
      var cells = SPAWN[G.ticket.shape] || [];
      for (var i = 0; i < cells.length; i++) on[cells[i][1] * 4 + cells[i][0]] = true;
      for (var j = 0; j < 16; j++) D.ticketCells[j].classList.toggle('filled', !!on[j]);
    }
    if (D.ticketCopy) {
      var lines = COPY.TICKET[G.ticket.shape] || [''];
      D.ticketCopy.textContent = lines[G.ticket.copyIndex % lines.length];
    }
  }

  function updateWorkbenchDOM() {
    if (!D.wbCells || D.wbCells.length !== 16) return;
    var cursorIdx = G.wbCursor.y * 4 + G.wbCursor.x;
    for (var i = 0; i < 16; i++) {
      D.wbCells[i].classList.toggle('filled', !!G.workbench[i]);
      D.wbCells[i].classList.toggle('cursor', i === cursorIdx && G.state === 'spec');
    }
  }

  function updateSoundLabel() {
    if (!D.soundToggle) return;
    var on = audioEnabled();
    if (G.coarse) D.soundToggle.textContent = on ? COPY.SOUND_ON_TOUCH : COPY.SOUND_OFF_TOUCH;
    else D.soundToggle.textContent = on ? COPY.SOUND_ON_KEY : COPY.SOUND_OFF_KEY;
  }

  function updateHintRow() {
    var retro = (G.screen === 'retro');
    if (D.hintKeys) D.hintKeys.textContent = COPY.HINT_KEYS;
    if (D.btnGenerate) D.btnGenerate.hidden = retro;
    if (D.btnClear) D.btnClear.hidden = retro;
    if (D.btnAgain) D.btnAgain.hidden = !retro;
    if (D.btnNew) {
      D.btnNew.hidden = retro;
      D.btnNew.textContent = newConfirmPending() ? COPY.BTN_THROW : COPY.BTN_NEW;
    }
  }

  function newConfirmPending() {
    return G.newConfirmUntil > 0 && nowMs() < G.newConfirmUntil;
  }

  /* N (or [new]) during play. The first press asks, the second within
   * NEW_CONFIRM_MS throws the run away. The lock pipeline is guarded by
   * G.runId, so a new run can start in any state, mid-lock included.
   */
  function newGamePressed() {
    if (G.screen !== 'play' || G.paused || G.howtoOpen) return;
    if (newConfirmPending()) {
      G.newConfirmUntil = 0;
      stopReviewHold();
      audioUnlock();
      newRun();
      return;
    }
    G.newConfirmUntil = nowMs() + cfg.NEW_CONFIRM_MS;
    setStatusEvent(G.coarse ? COPY.NEW_CONFIRM_TOUCH : COPY.NEW_CONFIRM_KEYS);
    G.statusEventUntil = G.newConfirmUntil;
    updateHintRow();
    setTimeout(function () {
      if (!newConfirmPending()) { G.newConfirmUntil = 0; updateHintRow(); }
    }, cfg.NEW_CONFIRM_MS + 20);
  }

  function updatePanelsForScreen() {
    var retro = (G.screen === 'retro');
    if (D.ticketPanel) D.ticketPanel.hidden = retro;
    if (D.workbenchPanel) D.workbenchPanel.hidden = retro;
    if (D.retroPanel) D.retroPanel.hidden = !retro;
    updateHintRow();
  }

  function updateTitleBest() {
    if (!D.titleBest) return;
    if (G.best > 0) {
      D.titleBest.hidden = false;
      D.titleBest.textContent = fill(COPY.TITLE_BEST, { n: G.best });
    } else {
      D.titleBest.hidden = true;
    }
  }

  function renderAll() {
    updateClock();
    updateSprintLabel();
    updateGoalLabel();
    updateTicketDOM();
    updateWorkbenchDOM();
    updateStatusBar();
    updatePanelsForScreen();
    if (G.screen === 'retro') renderRetro();
    applyScreenClass();
    requestDraw();
  }

  /* =====================================================================
   * 10. CHAT / STATUS
   * ===================================================================== */

  function AUD() { return window.SloptrisAudio || null; }

  function SFX(name) {
    var a = AUD();
    if (a && a.play) { try { a.play(name); } catch (e) { /* audio is optional */ } }
  }

  function audioEnabled() {
    var a = AUD();
    if (a && a.isEnabled) { try { return !!a.isEnabled(); } catch (e) { return true; } }
    return true;
  }

  function audioSetEnabled(on) {
    var a = AUD();
    if (a && a.setEnabled) { try { a.setEnabled(on); } catch (e) { /* ignore */ } }
  }

  function audioUnlock() {
    var a = AUD();
    if (a && a.unlock) { try { a.unlock(); } catch (e) { /* ignore */ } }
  }

  function audioResume() {
    var a = AUD();
    if (a && a.resume) { try { a.resume(); } catch (e) { /* ignore */ } }
  }

  function audioStartCharge() {
    var a = AUD();
    if (a && a.startCharge) { try { a.startCharge(); } catch (e) { /* ignore */ } }
  }

  function audioSetCharge(t) {
    var a = AUD();
    if (a && a.setCharge) { try { a.setCharge(t); } catch (e) { /* ignore */ } }
  }

  function audioStopCharge() {
    var a = AUD();
    if (a && a.stopCharge) { try { a.stopCharge(); } catch (e) { /* ignore */ } }
  }

  function audioStartMusic() {
    var a = AUD();
    if (a && a.startMusic) { try { a.startMusic(); } catch (e) { /* ignore */ } }
  }

  function audioStopMusic() {
    var a = AUD();
    if (a && a.stopMusic) { try { a.stopMusic(); } catch (e) { /* ignore */ } }
  }

  /* --- chat pane ------------------------------------------------------ */

  function syncChatArray() {
    G.chat = G.chatLines.map(function (e) { return e.text; });
  }

  function rebuildChatDOM() {
    if (!D.chat) return;
    while (D.chat.firstChild) D.chat.removeChild(D.chat.firstChild);
    G.chatLines = [];
    G.typeJob = null;
    G.typeQueue = [];
    for (var i = 0; i < G.chat.length; i++) {
      var el = document.createElement('div');
      el.className = 'chat-line';
      el.textContent = G.chat[i];
      D.chat.appendChild(el);
      G.chatLines.push({ el: el, text: G.chat[i] });
    }
  }

  function trimChat() {
    while (G.chatLines.length > 3) {
      var gone = G.chatLines.shift();
      if (gone.el && gone.el.parentNode) gone.el.parentNode.removeChild(gone.el);
      if (G.typeJob && G.typeJob.entry === gone) G.typeJob = null;
      G.typeQueue = G.typeQueue.filter(function (j) { return j.entry !== gone; });
    }
  }

  /* Push a line into the assistant pane. Instant lines (the `…` beat) appear
   * whole; everything else types in at TYPE_CPS.
   */
  function chatPush(text, instant) {
    if (!D.chat || !document.createElement) {
      G.chat.push(text);
      while (G.chat.length > 3) G.chat.shift();
      return null;
    }
    var el = document.createElement('div');
    el.className = 'chat-line';
    D.chat.appendChild(el);
    var entry = { el: el, text: text };
    G.chatLines.push(entry);
    trimChat();
    syncChatArray();
    if (instant) {
      el.textContent = text;
    } else {
      el.classList.add('typing');
      G.typeQueue.push({ entry: entry, text: text, start: 0, shown: 0 });
      requestDraw();
    }
    return entry;
  }

  // Replace the text of an existing line (CONTRACT resolution 10).
  function chatReplace(entry, text) {
    if (!entry || !entry.el) { chatPush(text, false); return; }
    entry.text = text;
    syncChatArray();
    entry.el.textContent = '';
    entry.el.classList.add('typing');
    G.typeQueue = G.typeQueue.filter(function (j) { return j.entry !== entry; });
    if (G.typeJob && G.typeJob.entry === entry) G.typeJob = null;
    G.typeQueue.push({ entry: entry, text: text, start: 0, shown: 0 });
    requestDraw();
  }

  function stepTyping(now) {
    if (!G.typeJob && G.typeQueue.length) {
      G.typeJob = G.typeQueue.shift();
      G.typeJob.start = now;
      G.typeJob.shown = 0;
    }
    var job = G.typeJob;
    if (!job) return;
    var n = Math.floor((now - job.start) * cfg.TYPE_CPS / 1000);
    if (n > job.text.length) n = job.text.length;
    if (n > job.shown) {
      job.shown = n;
      if (job.entry.el) job.entry.el.textContent = job.text.slice(0, n);
      SFX('typing');
    }
    if (job.shown >= job.text.length) {
      if (job.entry.el) job.entry.el.classList.remove('typing');
      G.typeJob = null;
    }
  }

  function typingBusy() {
    return !!(G.typeJob || G.typeQueue.length);
  }

  // Finish every line still typing, so a screen whose loop stops (the retro)
  // never freezes the assistant mid-word.
  function flushTyping() {
    var jobs = G.typeQueue.slice();
    if (G.typeJob) jobs.unshift(G.typeJob);
    G.typeJob = null;
    G.typeQueue = [];
    for (var i = 0; i < jobs.length; i++) {
      var el = jobs[i].entry && jobs[i].entry.el;
      if (!el) continue;
      el.textContent = jobs[i].text;
      el.classList.remove('typing');
    }
  }

  /* --- status bar ----------------------------------------------------- */

  function defaultStatus() {
    var s = fill(COPY.STATUS_DEFAULT, {
      lines: G.counters.lines,
      generated: G.counters.generated,
      debt: slopCellsOnBoard()
    });
    if (G.showStreak) s += fill(COPY.STATUS_STREAK, { n: G.streak });
    return s;
  }

  function setStatusEvent(text) {
    G.statusEvent = text;
    G.statusEventUntil = nowMs() + cfg.STATUS_EVENT_MS;
    updateStatusBar();
    requestDraw();
  }

  function updateStatusBar() {
    if (!D.statusBar) return;
    var text;
    if (reviewActive()) {
      text = COPY.STATUS_REVIEWING;
    } else if (G.building) {
      text = COPY.STATUS_BUILDING;
    } else if (G.statusEvent && nowMs() < G.statusEventUntil) {
      text = G.statusEvent;
    } else {
      if (G.statusEvent) G.statusEvent = '';
      text = defaultStatus();
    }
    if (D.statusBar.textContent !== text) D.statusBar.textContent = text;
  }

  function statusBusy() {
    return !!(G.statusEvent && nowMs() < G.statusEventUntil);
  }

  /* =====================================================================
   * 11. GAME FLOW
   * ===================================================================== */

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function newRun() {
    deleteSave();
    G.runId += 1;
    G.newConfirmUntil = 0;
    cancelBuild();
    G.seedMode = G.seedModePref;
    G.seed = resolveSeed(G.seedMode, G.fixedSeed);
    G.rng = mulberry32(G.seed);
    G.sprint = 1;
    G.clockMs = deadlineFor(1) * 1000;
    G.sprintLines = 0;
    G.sprintGoal = goalFor(1);
    G.sprintBanner = null;
    G.overReason = '';
    G.warned = false;
    G.bag = [];
    G.board = newBoard();
    G.pieces = {};
    G.nextPieceId = 1;
    G.falling = null;
    G.workbench = newWorkbench();
    G.wbCursor = { x: 0, y: 0 };
    G.streak = 0;
    G.counters = newCounters();
    G.chat = [];
    G.chatLines = [];
    G.typeJob = null;
    G.typeQueue = [];
    G.pulse = null;
    G.reviewFlash = null;
    G.mutateFlash = null;
    G.settling = [];
    G.lineFlash = null;
    G.reviewHeld = false;
    G.statusEvent = '';
    G.statusEventUntil = 0;
    G.screen = 'play';
    G.state = 'spec';
    G.paused = false;
    G.howtoOpen = false;
    G.resumeConfirm = false;
    G.gravityAcc = 0;
    G.lastTickAt = nowMs();
    endReviewTone();
    rebuildChatDOM();
    newTicket();
    refreshDevSeed();
    if (D.resumePanel) D.resumePanel.hidden = true;
    renderAll();
    resize();
    saveNow();
  }

  function newTicket() {
    if (!G.bag.length) G.bag = shuffleInPlace(SHAPE_LETTERS.slice(), G.rng);
    var shape = G.bag.shift();
    var lines = COPY.TICKET[shape];
    G.ticket = { shape: shape, copyIndex: pickIndex(lines.length, G.rng) };
    clearWorkbench(false);
    updateTicketDOM();
  }

  /* --- workbench ------------------------------------------------------ */

  function workbenchCells() {
    var out = [];
    for (var i = 0; i < 16; i++) if (G.workbench[i]) out.push([i % 4, Math.floor(i / 4)]);
    return out;
  }

  function clearWorkbench(withSound) {
    for (var i = 0; i < 16; i++) G.workbench[i] = false;
    if (withSound) SFX('wb_toggle');
    updateWorkbenchDOM();
  }

  function flashWorkbench() {
    if (!D.workbench) return;
    D.workbench.classList.add('flash');
    G.wbFlashUntil = nowMs() + cfg.WB_FLASH_MS;
    setTimeout(function () {
      if (D.workbench) D.workbench.classList.remove('flash');
    }, cfg.WB_FLASH_MS);
  }

  function canUseWorkbench() {
    return G.screen === 'play' && G.state === 'spec' && !G.paused && !G.howtoOpen && !G.building;
  }

  function toggleWorkbenchCell(x, y) {
    if (!canUseWorkbench()) return;
    if (x < 0 || x > 3 || y < 0 || y > 3) return;
    var i = y * 4 + x;
    G.workbench[i] = !G.workbench[i];
    SFX('wb_toggle');
    updateWorkbenchDOM();
    var cells = workbenchCells();
    if (cells.length === 4) {
      if (matchesShape(cells, G.ticket.shape)) { acceptBuild(); return; }
      SFX('wb_reject');
      flashWorkbench();
    }
    saveNow();
  }

  /* The fourth matching cell starts the build. BUILD_MS later the piece spawns
   * in the ticket's orientation however the player drew it. The clock keeps
   * running; that wait is the price of a piece that will not change shape.
   * Generate or clear during the wait cancels the build (NOTES item 21).
   */
  function acceptBuild() {
    if (G.building) return;
    var run = G.runId;
    G.building = { until: nowMs() + cfg.BUILD_MS, timer: 0 };
    if (D.workbench) D.workbench.classList.add('building');
    updateStatusBar();
    G.building.timer = setTimeout(function () {
      if (G.runId !== run || !G.building) return;
      finishBuild();
    }, cfg.BUILD_MS);
  }

  function finishBuild() {
    G.building = null;
    if (D.workbench) D.workbench.classList.remove('building');
    // Under the resume screen or the how-to the workbench keeps its cells and
    // the build restarts when play resumes (resumePendingBuild).
    if (G.screen !== 'play' || G.state !== 'spec' || G.paused || G.howtoOpen) return;
    SFX('build');
    G.streak = 0;
    G.counters.built += 1;
    clearWorkbench(false);
    spawnPiece(G.ticket.shape, false, false, false, null, null);
    updateStatusBar();
  }

  function cancelBuild() {
    if (!G.building) return;
    clearTimeout(G.building.timer);
    G.building = null;
    if (D.workbench) D.workbench.classList.remove('building');
    updateStatusBar();
  }

  // After a reload, a workbench that already matches the ticket resumes its build.
  function resumePendingBuild() {
    if (G.screen !== 'play' || G.state !== 'spec' || G.building) return;
    var cells = workbenchCells();
    if (cells.length === 4 && matchesShape(cells, G.ticket.shape)) acceptBuild();
  }

  /* --- generate ------------------------------------------------------- */

  function generate() {
    if (G.screen !== 'play' || G.state !== 'spec' || G.paused) return;
    cancelBuild();
    clearWorkbench(false);

    // The streak is a display-only stat (dev panel "show streak"); the odds
    // depend on the sprint alone, never on the generate/build history.
    G.streak += 1;
    var chance = mutationChanceFor(G.sprint);
    var willMutate = (G.rng() * 100) < chance;
    var willRefactor = false;
    if (willMutate) willRefactor = (G.rng() * 100) < cfg.REFACTOR_CHANCE;

    // Dev overrides ride on top of the real rolls, so the stream is unchanged.
    if (G.forceMutation) {
      willMutate = true;
      G.forceMutation = false;
      if (D.devForceMutation) D.devForceMutation.checked = false;
    }
    if (G.forceRefactor) {
      willMutate = true;
      willRefactor = true;
      G.forceRefactor = false;
      if (D.devForceRefactor) D.devForceRefactor.checked = false;
    }

    var targetLocal = null;
    var targetOutline = null;
    if (willMutate) {
      var pick = chooseTargetLocal(SPAWN[G.ticket.shape], G.rng);
      if (pick) {
        targetLocal = pick.cells;
        targetOutline = outlineEdges(pick.cells);
      } else {
        willMutate = false;
      }
    }
    if (!willMutate) willRefactor = false;

    G.counters.generated += 1;
    SFX('generate');
    var tpl = COPY.GEN[pickIndex(COPY.GEN.length, G.rng)];
    chatPush(fill(tpl, { shape: G.ticket.shape }), false);
    spawnPiece(G.ticket.shape, true, willMutate, willRefactor, targetLocal, targetOutline);
  }

  function spawnPiece(shape, slop, willMutate, willRefactor, targetLocal, targetOutline) {
    var cells = SPAWN[shape];
    var minY = Infinity;
    for (var i = 0; i < cells.length; i++) if (cells[i][1] < minY) minY = cells[i][1];
    var p = {
      shape: shape,
      orientation: 0,
      x: 3,
      y: -minY,
      slop: !!slop,
      willMutate: !!willMutate,
      willRefactor: !!willRefactor,
      targetLocal: targetLocal,
      targetOutline: targetOutline,
      reviewCharge: 0,
      reviewed: false,
      landed: false,
      lockResetUsed: false,
      lockTimerMs: 0,
      pieceId: G.nextPieceId
    };
    // A piece that cannot spawn is a top-out too.
    if (!fits(pieceCells(p))) { topOut(); return; }
    G.falling = p;
    G.state = 'falling';
    G.gravityAcc = 0;
    updateWorkbenchDOM();
    updateStatusBar();
    saveNow();
    requestDraw();
  }

  /* --- piece control -------------------------------------------------- */

  function noteLockReset(p) {
    if (p.landed && !p.lockResetUsed) {
      p.lockTimerMs = 0;
      p.lockResetUsed = true;
    }
  }

  function canControl() {
    return G.screen === 'play' && G.state === 'falling' && G.falling && !G.paused && !G.howtoOpen && !reviewActive();
  }

  function tryMove(dx) {
    if (!canControl()) return false;
    var p = G.falling;
    if (!canMove(p, dx, 0)) return false;
    p.x += dx;
    SFX('move');
    noteLockReset(p);
    requestDraw();
    saveNow();
    return true;
  }

  function tryRotate(dir) {
    if (!canControl()) return false;
    var p = G.falling;
    var next = (p.orientation + (dir > 0 ? 1 : 3)) % 4;
    var base = rotateCells(SPAWN[p.shape], next);
    for (var i = 0; i < KICKS.length; i++) {
      var kx = KICKS[i][0], ky = KICKS[i][1];
      var cells = [];
      for (var c = 0; c < base.length; c++) cells.push([base[c][0] + p.x + kx, base[c][1] + p.y + ky]);
      if (!fits(cells)) continue;
      p.orientation = next;
      p.x += kx;
      p.y += ky;
      SFX('rotate');
      noteLockReset(p);
      requestDraw();
      saveNow();
      return true;
    }
    return false;
  }

  function softDropStep() {
    if (!canControl()) return false;
    var p = G.falling;
    if (!canMove(p, 0, 1)) return false;
    p.y += 1;
    SFX('soft_drop');
    p.landed = false;
    p.lockResetUsed = false;
    requestDraw();
    return true;
  }

  function hardDrop() {
    if (!canControl()) return;
    var p = G.falling;
    while (canMove(p, 0, 1)) p.y += 1;
    SFX('hard_drop');
    p.landed = true;
    lockPipeline();
  }

  /* --- falling update ------------------------------------------------- */

  function updateFalling(now, dt) {
    var p = G.falling;
    if (!p || G.state !== 'falling') return;

    var reviewing = reviewActive();
    var interval = cfg.GRAVITY_MS;
    if (reviewing) interval = cfg.REVIEW_GRAVITY_MS;
    else if (G.softDropHeld) interval = cfg.SOFT_DROP_MS;
    if (!(interval > 0)) interval = 1;

    G.gravityAcc += dt;
    var guard = 64;
    while (G.gravityAcc >= interval && guard-- > 0) {
      G.gravityAcc -= interval;
      if (!canMove(p, 0, 1)) { G.gravityAcc = 0; break; }
      p.y += 1;
      if (reviewing) {
        if (!p.reviewed) {
          p.reviewCharge += 1;
          maybeFirePulse(p, now);
        }
      } else if (G.softDropHeld) {
        SFX('soft_drop');
      }
    }

    if (!canMove(p, 0, 1)) {
      if (!p.landed) {
        p.landed = true;
        p.lockTimerMs = 0;
        p.lockResetUsed = false;
      }
      p.lockTimerMs += dt;
      if (p.lockTimerMs >= cfg.LOCK_DELAY_MS) lockPipeline();
    } else {
      if (p.landed) {
        p.landed = false;
        p.lockResetUsed = false;
      }
      p.lockTimerMs = 0;
    }
  }

  /* --- lock pipeline (CONTRACT resolution 8) -------------------------- */

  function lockPipeline() {
    if (G.state !== 'falling' || !G.falling) return;
    var p = G.falling;
    G.state = 'locking';
    G.falling = null;
    G.pulse = null;
    G.reviewFlash = null;
    G.mutateFlash = null;
    G.settling = [];
    endReviewTone();
    requestDraw();
    runLock(p);
  }

  async function runLock(p) {
    var run = G.runId;
    SFX('lock');
    var cells = pieceCells(p);
    writeCells(cells, p.pieceId, p.slop, false);
    registerPiece(p.pieceId, p.slop, cells);
    G.nextPieceId += 1;
    updateStatusBar();
    requestDraw();

    // Top-out is checked the moment the cells land, before any mutation.
    var topped = false;
    for (var i = 0; i < cells.length; i++) if (cells[i][1] <= 1) topped = true;
    if (topped) { topOut(); return; }

    if (p.slop && p.willMutate) {
      var plan = planMutation(p, cells);
      if (!plan && !p.reviewed) plan = fallbackTarget(cells);
      if (plan) {
        var beat = chatPush(COPY.BEAT, true);
        SFX('mutate_beat');
        requestDraw();
        await wait(cfg.MUTATE_BEAT_MS);
        if (G.runId !== run) return;          // a new game started under us
        commitMutation(p, cells, plan);
        G.mutateFlash = { start: nowMs(), gone: cellsMinus(cells, plan), came: cellsMinus(plan, cells) };
        startSettling([p.pieceId]);
        SFX('mutate');
        var newShape = shapeOfCells(plan) || p.shape;
        var line = COPY.MUTATED[pickIndex(COPY.MUTATED.length, G.rng)];
        chatReplace(beat, fill(line, { old: p.shape, new: newShape }));
        setStatusEvent(COPY.STATUS_MUTATED);
        G.counters.mutated += 1;
        requestDraw();
      }
      // A fizzle (reviewed piece, or nothing fits nearby) says nothing in either voice.
    }

    if (p.willRefactor) {
      var beat2 = chatPush(COPY.BEAT, true);
      requestDraw();
      await wait(cfg.REFACTOR_BEAT_MS);
      if (G.runId !== run) return;
      var moved = boardRefactor(p.pieceId);
      G.mutateFlash = { start: nowMs(), gone: moved.gone, came: moved.came };
      startSettling(moved.ids);
      SFX('refactor');
      chatReplace(beat2, COPY.REFACTORED);
      setStatusEvent(COPY.STATUS_REFACTOR);
      G.counters.refactors += 1;
      requestDraw();
    }

    await shipFullRows();
    if (G.runId !== run) return;

    if (G.screen !== 'play') return;
    G.state = 'spec';
    newTicket();
    updateWorkbenchDOM();
    updateStatusBar();
    requestDraw();
    saveNow();
  }

  /* --- top-out and retro ---------------------------------------------- */

  function topOut() { endRun('topout'); }

  /* The run ends when the board is full or the clock runs out (NOTES item
   * 15). Both land on the retro; a missed deadline also holds a banner over
   * the well and lets the assistant have the last word.
   */
  function endRun(reason) {
    cancelBuild();
    G.falling = null;
    G.pulse = null;
    G.reviewFlash = null;
    G.mutateFlash = null;
    G.settling = [];
    G.lineFlash = null;
    G.reviewHeld = false;
    G.overReason = reason;
    endReviewTone();
    flushTyping();
    G.screen = 'retro';
    G.state = 'retro';
    SFX('topout');
    audioStopMusic();
    writeBest(G.counters.lines);
    if (reason === 'deadline') {
      G.sprintBanner = deadlineBanner();
      chatPush(COPY.DEADLINE_CHAT, true);   // instant: no frame loop runs on the retro
    } else {
      G.sprintBanner = null;
    }
    renderRetro();
    updatePanelsForScreen();
    applyScreenClass();
    updateStatusBar();
    saveNow();
    requestDraw();
  }

  function deadlineBanner() {
    return {
      kind: 'over',
      start: nowMs(),
      hold: true,
      lines: [
        [COPY.BANNER_OVER, true],
        ['', false],
        [fill(COPY.BANNER_OVER_SPRINT, { n: G.sprint }), false],
        [fill(COPY.BANNER_OVER_LINES, { k: G.sprintLines, goal: G.sprintGoal }), false]
      ]
    };
  }

  function retroStatsText() {
    var lines = [];
    if (G.overReason === 'deadline') {
      lines.push(fill(COPY.RETRO_HEAD_DEADLINE, { n: G.sprint, k: G.sprintLines, goal: G.sprintGoal }));
    } else {
      lines.push(fill(COPY.RETRO_HEAD, { time: fmtMSS(G.clockMs), n: G.sprint }));
      lines.push(fill(COPY.RETRO_SPRINT, { k: G.sprintLines, goal: G.sprintGoal }));
    }
    lines.push('');
    lines.push(fill(COPY.RETRO_LINES, { n: G.counters.lines }));
    lines.push(fill(COPY.RETRO_GENERATED, { n: G.counters.generated }));
    lines.push(fill(COPY.RETRO_REVIEWED, { n: G.counters.reviewed }));
    lines.push(fill(COPY.RETRO_MUTATED, { n: G.counters.mutated }));
    if (G.counters.refactors > 0) lines.push(fill(COPY.RETRO_REFACTORS, { n: G.counters.refactors }));
    lines.push(fill(COPY.RETRO_SLOP, { n: slopCellsOnBoard() }));
    lines.push(fill(COPY.RETRO_BUILT, { n: G.counters.built }));
    if (!G.coarse) {
      lines.push('');
      lines.push(COPY.RETRO_CONTROLS);
    }
    if (G.devOpen) {
      lines.push('');
      lines.push(fill(COPY.RETRO_SEED, { n: G.seed, mode: G.seedMode }));
    }
    return lines.join('\n');
  }

  function renderRetro() {
    if (D.retroStats) D.retroStats.textContent = retroStatsText();
  }

  // Clipboard helpers are only used by the dev panel's seed copy button.
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { /* clipboard unavailable */ }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
        return;
      } catch (e) { /* fall through */ }
    }
    fallbackCopy(text);
  }

  /* --- clock and sprints (SPEC 7) ------------------------------------- */

  function tickClock() {
    var now = nowMs();
    var dt = G.lastTickAt ? Math.min(1000, now - G.lastTickAt) : 0;
    G.lastTickAt = now;
    // The how-to covers the well, so a game under it holds (NOTES item 25).
    if (G.screen !== 'play' || G.paused || G.howtoOpen || dt <= 0) return;

    G.clockMs -= dt;
    if (!G.warned && G.clockMs <= 10000) {
      G.warned = true;
      SFX('deadline_warn');
    }
    if (G.clockMs <= 0) deadlineReached();
    updateClock();
    updateStatusBar();
    if (G.state === 'falling' && !G.pulse && !G.lineFlash && !G.settling.length && (now - G.lastSaveAt) >= 1000) saveNow();
  }

  function deadlineReached() {
    if (G.screen !== 'play') return;
    G.clockMs = 0;
    updateClock();
    endRun('deadline');
  }

  /* The goal is met, which happens mid-lock right after a line clear: the
   * next sprint starts now with a fresh clock. Lines cleared past the goal
   * count toward the next one (NOTES item 15).
   */
  function advanceSprint() {
    var ended = G.sprint;
    var surplus = Math.max(0, G.sprintLines - G.sprintGoal);

    G.sprint += 1;
    G.clockMs = deadlineFor(G.sprint) * 1000;
    G.warned = false;
    G.sprintGoal = goalFor(G.sprint);
    G.sprintLines = Math.min(surplus, G.sprintGoal - 1);

    SFX('sprint');
    updateClock();
    updateSprintLabel();
    updateGoalLabel();
    flashHeader();

    var vars = { n: ended, next: G.sprint, goal: G.sprintGoal, time: fmtMSS(G.clockMs) };
    setStatusEvent(fill(COPY.STATUS_SPRINT_DONE, vars));
    G.statusEventUntil = nowMs() + Math.max(cfg.STATUS_EVENT_MS, cfg.SPRINT_BANNER_MS);

    var lines = [];
    lines.push([fill(COPY.BANNER_DONE, vars), true]);
    lines.push(['', false]);
    lines.push([fill(COPY.BANNER_NEXT, vars), true]);
    lines.push([G.sprintGoal === 1 ? COPY.BANNER_GOAL_ONE : fill(COPY.BANNER_GOAL, vars), false]);
    lines.push([fill(COPY.BANNER_BY, vars), false]);
    G.sprintBanner = { kind: 'done', start: nowMs(), hold: false, lines: lines };
    requestDraw();
    saveNow();
  }

  /* --- screens -------------------------------------------------------- */

  function showTitle() {
    G.screen = 'title';
    G.state = 'spec';
    G.paused = false;
    G.howtoOpen = false;
    if (D.resumePanel) D.resumePanel.hidden = true;
    updateTitleBest();
    updatePanelsForScreen();
    applyScreenClass();
    requestDraw();
  }

  // Sound starts with the run, not with the title or the first-visit how-to.
  function startFromTitle() {
    if (!howtoSeen()) {
      markHowtoSeen();
      openHowto('start');
      return;
    }
    audioUnlock();
    newRun();
  }

  function openHowto(ret) {
    G.howtoReturn = ret || (G.screen === 'title' ? 'title' : 'play');
    G.howtoOpen = true;
    updateHowtoControls();
    applyScreenClass();
    requestDraw();
  }

  function closeHowto() {
    if (!G.howtoOpen) return;
    G.howtoOpen = false;
    var ret = G.howtoReturn;
    G.howtoReturn = 'title';
    applyScreenClass();
    if (ret === 'start') { audioUnlock(); newRun(); return; }
    G.lastTickAt = nowMs();
    resumePendingBuild();
    requestDraw();
  }

  // COPY is the one source for the title body and the how-to paragraphs; the
  // markup only holds placeholders (NOTES item 16).
  function applyCopyToDom() {
    if (D.titleCopy) D.titleCopy.textContent = COPY.TITLE_BODY;
    var ps = [COPY.HOWTO_P1, COPY.HOWTO_P2, COPY.HOWTO_P3, COPY.HOWTO_P4];
    for (var i = 0; i < ps.length; i++) {
      if (D.howtoP && D.howtoP[i]) D.howtoP[i].textContent = ps[i];
    }
  }

  function updateHowtoControls() {
    if (D.howtoFine) D.howtoFine.hidden = G.coarse;
    if (D.howtoCoarse) D.howtoCoarse.hidden = !G.coarse;
  }

  function showResumePanel() {
    G.paused = true;
    G.resumeConfirm = false;
    if (D.resumePanel) D.resumePanel.hidden = false;
    updateResumeCopy();
    applyScreenClass();
  }

  function updateResumeCopy() {
    var retro = (G.screen === 'retro');
    if (D.resumeLine) {
      D.resumeLine.textContent = retro
        ? COPY.RESUME_LINE_RETRO
        : fill(COPY.RESUME_LINE, { time: fmtMSS(G.clockMs), n: G.sprint });
    }
    if (D.resumeControls) {
      D.resumeControls.textContent = G.resumeConfirm
        ? COPY.RESUME_CONFIRM
        : (retro ? COPY.RESUME_CONTROLS_RETRO : COPY.RESUME_CONTROLS);
      D.resumeControls.hidden = G.coarse;
    }
    if (D.resumeButtons) D.resumeButtons.hidden = !G.coarse;
    if (D.btnNewgame) D.btnNewgame.textContent = G.resumeConfirm ? COPY.BTN_THROW : COPY.BTN_NEWGAME;
  }

  function resumeRun() {
    if (!G.paused) return;
    audioUnlock();
    // Reloading onto the retro means the run is already over, so no music.
    if (G.screen === 'retro') audioStopMusic();
    G.paused = false;
    G.resumeConfirm = false;
    if (D.resumePanel) D.resumePanel.hidden = true;
    G.lastTickAt = nowMs();
    G.gravityAcc = 0;
    if (G.falling) {
      G.falling.landed = false;
      G.falling.lockTimerMs = 0;
      G.falling.lockResetUsed = false;
    }
    resumePendingBuild();
    applyScreenClass();
    updateStatusBar();
    requestDraw();
    saveNow();
  }

  function resumeNewGamePressed() {
    if (!G.resumeConfirm) {
      G.resumeConfirm = true;
      updateResumeCopy();
      return;
    }
    G.resumeConfirm = false;
    if (D.resumePanel) D.resumePanel.hidden = true;
    G.paused = false;
    audioUnlock();
    newRun();
  }

  function cancelResumeConfirm() {
    if (!G.resumeConfirm) return;
    G.resumeConfirm = false;
    updateResumeCopy();
  }

  function againFromRetro() {
    audioUnlock();
    newRun();
  }

  /* =====================================================================
   * 12. REVIEW  (SPEC 6.4)
   * ===================================================================== */

  function reviewActive() {
    return !!(G.reviewHeld && G.screen === 'play' && G.state === 'falling' &&
      G.falling && G.falling.slop && !G.paused && !G.howtoOpen);
  }

  /* 0..1 of the way to the answer. Whole rows come from reviewCharge; while
   * the hold is active the part of the next row already fallen counts too, so
   * the glow and the tone ramp smoothly instead of stepping once per row.
   * Released charge holds its last whole-row value, as SPEC 6.4 says.
   */
  function reviewProgress(p) {
    if (!p || !p.slop || !(cfg.REVIEW_THRESHOLD > 0)) return 0;
    var c = p.reviewCharge;
    if (!p.reviewed && reviewActive() && cfg.REVIEW_GRAVITY_MS > 0) {
      c += Math.min(0.999, Math.max(0, G.gravityAcc) / cfg.REVIEW_GRAVITY_MS);
    }
    return clamp(0, c / cfg.REVIEW_THRESHOLD, 1);
  }

  function startReviewHold() {
    if (G.reviewHeld) return;
    G.reviewHeld = true;
    syncReviewTone();
    updateStatusBar();
    requestDraw();
  }

  function stopReviewHold() {
    if (!G.reviewHeld) return;
    G.reviewHeld = false;
    endReviewTone();
    updateStatusBar();
    requestDraw();
  }

  function endReviewTone() {
    if (G.chargeTone) {
      audioStopCharge();
      G.chargeTone = false;
    }
  }

  function syncReviewTone() {
    var want = reviewActive() && G.falling && !G.falling.reviewed;
    if (want && !G.chargeTone) {
      audioStartCharge();
      G.chargeTone = true;
    }
    if (!want && G.chargeTone) endReviewTone();
    if (want) audioSetCharge(reviewProgress(G.falling));
  }

  // The answer arrives all at once, once, at the threshold.
  function maybeFirePulse(p, now) {
    if (p.reviewed) return;
    if (p.reviewCharge < cfg.REVIEW_THRESHOLD) return;
    p.reviewed = true;
    G.counters.reviewed += 1;
    endReviewTone();
    G.pulse = { kind: p.willMutate ? 'mutate' : 'stable', start: now };
    G.reviewFlash = { start: now };
    SFX(p.willMutate ? 'pulse_mutate' : 'pulse_stable');
    requestDraw();
  }

  /* =====================================================================
   * 13. INPUT  (SPEC 8)
   * ===================================================================== */

  function isFormFocus(e) {
    var t = e.target;
    if (!t || !t.tagName) return false;
    var tag = String(t.tagName).toUpperCase();
    if (tag === 'SELECT' || tag === 'TEXTAREA') return true;
    if (tag !== 'INPUT') return false;
    var type = String(t.type || 'text').toLowerCase();
    return type !== 'checkbox' && type !== 'radio' && type !== 'button';
  }

  function blurTarget(e) {
    var t = e && e.target;
    if (t && typeof t.blur === 'function') { try { t.blur(); } catch (err) { /* ignore */ } }
  }

  function lowerKey(k) {
    return (typeof k === 'string' && k.length === 1) ? k.toLowerCase() : k;
  }

  function moveCursor(dx, dy) {
    if (!canUseWorkbench()) return;
    G.wbCursor.x = clamp(0, G.wbCursor.x + dx, 3);
    G.wbCursor.y = clamp(0, G.wbCursor.y + dy, 3);
    updateWorkbenchDOM();
  }

  function toggleSound() {
    audioSetEnabled(!audioEnabled());
    updateSoundLabel();
  }

  function onKeyDown(e) {
    var k = e.key;
    var lk = lowerKey(k);
    if (isFormFocus(e)) {
      // A dev field has focus. Backtick still closes the panel, Escape and
      // Enter hand the keyboard back to the game; everything else types.
      if (k === '`') { e.preventDefault(); blurTarget(e); toggleDevPanel(); }
      else if (k === 'Escape' || k === 'Enter') { e.preventDefault(); blurTarget(e); }
      return;
    }
    audioResume();

    // How to play swallows the dismissing input.
    if (G.howtoOpen) {
      e.preventDefault();
      closeHowto();
      return;
    }

    if (k === '`') { e.preventDefault(); toggleDevPanel(); return; }
    if (k === 'Escape' && G.devOpen && G.screen === 'title') { e.preventDefault(); setDevOpen(false); return; }

    if (G.screen === 'title') {
      if (k === 'Enter' || k === ' ') { e.preventDefault(); startFromTitle(); return; }
      if (k === '?') { e.preventDefault(); openHowto('title'); return; }
      if (lk === 'm') { e.preventDefault(); toggleSound(); return; }
      return;
    }

    if (G.paused) {
      if (k === 'Enter') { e.preventDefault(); resumeRun(); return; }
      if (lk === 'n') { e.preventDefault(); resumeNewGamePressed(); return; }
      if (lk === 'm') { e.preventDefault(); cancelResumeConfirm(); toggleSound(); return; }
      if (k === '?') { e.preventDefault(); cancelResumeConfirm(); openHowto('play'); return; }
      cancelResumeConfirm();
      return;
    }

    if (k === '?') { e.preventDefault(); openHowto('play'); return; }
    if (lk === 'm') { e.preventDefault(); toggleSound(); return; }

    if (G.screen === 'retro') {
      if (k === 'Enter') { e.preventDefault(); againFromRetro(); return; }
      return;
    }

    if (lk === 'n') { e.preventDefault(); if (!e.repeat) newGamePressed(); return; }

    // Review holds everything else off.
    if (lk === 'r') {
      e.preventDefault();
      if (!e.repeat) startReviewHold();
      return;
    }
    if (reviewActive()) { e.preventDefault(); return; }

    if (lk === 'c' || k === 'Escape') {
      e.preventDefault();
      cancelBuild();
      clearWorkbench(true);
      saveNow();
      return;
    }

    if (G.state === 'spec') {
      if (k === 'ArrowLeft') { e.preventDefault(); moveCursor(-1, 0); return; }
      if (k === 'ArrowRight') { e.preventDefault(); moveCursor(1, 0); return; }
      if (k === 'ArrowUp') { e.preventDefault(); moveCursor(0, -1); return; }
      if (k === 'ArrowDown') { e.preventDefault(); moveCursor(0, 1); return; }
      if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        if (!e.repeat) toggleWorkbenchCell(G.wbCursor.x, G.wbCursor.y);
        return;
      }
      if (lk === 'g') { e.preventDefault(); if (!e.repeat) generate(); return; }
      return;
    }

    if (G.state === 'falling') {
      if (k === 'ArrowLeft' || lk === 'h') { e.preventDefault(); tryMove(-1); return; }
      if (k === 'ArrowRight' || lk === 'l') { e.preventDefault(); tryMove(1); return; }
      if (k === 'ArrowUp' || lk === 'x' || lk === 'k') {
        e.preventDefault();
        if (!e.repeat) tryRotate(1);
        return;
      }
      if (lk === 'z') { e.preventDefault(); if (!e.repeat) tryRotate(-1); return; }
      if (k === 'ArrowDown' || lk === 'j') {
        e.preventDefault();
        if (!G.softDropHeld) { G.softDropHeld = true; G.gravityAcc = cfg.SOFT_DROP_MS; }
        requestDraw();
        return;
      }
      if (k === ' ') { e.preventDefault(); if (!e.repeat) hardDrop(); return; }
    }
  }

  function onKeyUp(e) {
    if (isFormFocus(e)) return;
    var k = e.key;
    var lk = lowerKey(k);
    if (lk === 'r') stopReviewHold();
    if (k === 'ArrowDown' || lk === 'j') G.softDropHeld = false;
  }

  function releaseHeldKeys() {
    G.softDropHeld = false;
    stopReviewHold();
  }

  /* --- pointer gestures on the well (SPEC 8.2) ------------------------ */

  function recentVelocity(p, y) {
    var t = nowMs();
    var samples = p.samples;
    var ref = samples.length ? samples[0] : { t: p.t0, y: p.y0 };
    for (var i = samples.length - 1; i >= 0; i--) {
      if (t - samples[i].t >= cfg.FLICK_WINDOW_MS) { ref = samples[i]; break; }
      ref = samples[i];
    }
    var dt = t - ref.t;
    if (dt <= 0) return 0;
    return (y - ref.y) / dt;
  }

  function clearPointerHold() {
    if (G.ptr && G.ptr.holdTimer) {
      clearTimeout(G.ptr.holdTimer);
      G.ptr.holdTimer = 0;
    }
  }

  function onWellPointerDown(e) {
    if (e.preventDefault) e.preventDefault();
    audioResume();
    if (G.ptr) return;                       // one pointer at a time
    if (G.screen !== 'play' || G.paused || G.howtoOpen) return;
    if (D.canvas && D.canvas.setPointerCapture) {
      try { D.canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    var t = nowMs();
    G.ptr = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      t0: t,
      phase: 'pending',
      hApplied: 0,
      vApplied: 0,
      maxDist: 0,
      samples: [{ t: t, y: e.clientY }],
      holdTimer: 0
    };
    G.ptr.holdTimer = setTimeout(onHoldTimeout, cfg.HOLD_MS);
  }

  function onHoldTimeout() {
    if (!G.ptr || G.ptr.phase !== 'pending') return;
    if (G.ptr.maxDist >= cfg.TAP_MAX_PX) return;
    G.ptr.holdTimer = 0;
    G.ptr.phase = 'hold';
    startReviewHold();                       // does nothing on a hand-built piece
  }

  function onWellPointerMove(e) {
    if (!G.ptr || e.pointerId !== G.ptr.id) return;
    if (e.preventDefault) e.preventDefault();
    var p = G.ptr;
    var dx = e.clientX - p.x0;
    var dy = e.clientY - p.y0;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > p.maxDist) p.maxDist = dist;
    p.samples.push({ t: nowMs(), y: e.clientY });
    while (p.samples.length > 24) p.samples.shift();

    if (p.phase === 'hold') return;          // movement after a hold is ignored
    if (p.phase === 'pending') {
      if (dist < cfg.TAP_MAX_PX) return;
      p.phase = 'drag';                      // classified once, for good
      clearPointerHold();
    }
    if (p.phase !== 'drag') return;

    var cell = G.cell || 20;
    if (Math.abs(dx) >= Math.abs(dy)) {
      var want = dx < 0 ? Math.ceil(dx / cell) : Math.floor(dx / cell);
      while (p.hApplied < want) {
        if (!tryMove(1)) { p.hApplied = want; break; }
        p.hApplied += 1;
      }
      while (p.hApplied > want) {
        if (!tryMove(-1)) { p.hApplied = want; break; }
        p.hApplied -= 1;
      }
    } else if (dy > 0) {
      var wantDown = Math.floor(dy / cell);
      while (p.vApplied < wantDown) {
        if (!softDropStep()) { p.vApplied = wantDown; break; }
        p.vApplied += 1;
      }
    }
  }

  function onWellPointerUp(e) {
    if (!G.ptr || e.pointerId !== G.ptr.id) return;
    if (e.preventDefault) e.preventDefault();
    var p = G.ptr;
    clearPointerHold();
    G.ptr = null;
    if (D.canvas && D.canvas.releasePointerCapture) {
      try { D.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }

    if (p.phase === 'hold') { stopReviewHold(); return; }

    var elapsed = nowMs() - p.t0;
    if (p.phase === 'pending') {
      if (elapsed <= cfg.TAP_MAX_MS && p.maxDist < cfg.TAP_MAX_PX) tryRotate(1);
      return;
    }

    var dx = e.clientX - p.x0;
    var dy = e.clientY - p.y0;
    if (dy > 0 && Math.abs(dy) >= Math.abs(dx)) {
      var vel = recentVelocity(p, e.clientY);
      if (vel > cfg.FLICK_VEL && dy >= cfg.FLICK_MIN_CELLS * (G.cell || 20)) hardDrop();
    }
  }

  function onWellPointerCancel(e) {
    if (!G.ptr || e.pointerId !== G.ptr.id) return;
    if (e.preventDefault) e.preventDefault();
    clearPointerHold();
    if (G.ptr.phase === 'hold') stopReviewHold();
    G.ptr = null;
  }

  /* --- wiring --------------------------------------------------------- */

  function on(el, type, fn, opts) {
    if (el && el.addEventListener) el.addEventListener(type, fn, opts || false);
  }

  function bindInput() {
    on(window, 'keydown', onKeyDown);
    on(window, 'keyup', onKeyUp);
    on(window, 'blur', releaseHeldKeys);
    // A mouse or touch click leaves the button focused, so the next Space or
    // Enter meant for the game would click it again. Keyboard clicks
    // (detail 0) keep focus, for anyone tabbing through the dev panel.
    on(document, 'click', function (e) {
      if (!e.detail) return;
      var t = e.target;
      while (t && t !== document && !(t.tagName && String(t.tagName).toUpperCase() === 'BUTTON')) t = t.parentNode;
      if (t && t !== document && typeof t.blur === 'function') t.blur();
    });
    // Any gesture is a chance to bring a suspended context back.
    on(document, 'pointerdown', function () { audioResume(); }, true);

    on(D.canvas, 'pointerdown', onWellPointerDown);
    on(D.canvas, 'pointermove', onWellPointerMove);
    on(D.canvas, 'pointerup', onWellPointerUp);
    on(D.canvas, 'pointercancel', onWellPointerCancel);
    on(D.canvas, 'contextmenu', function (e) { e.preventDefault(); });

    // Workbench: click so every pointer type works.
    on(D.workbench, 'click', function (e) {
      var t = e.target;
      while (t && t !== D.workbench && !(t.classList && t.classList.contains('wb-cell'))) t = t.parentNode;
      if (!t || t === D.workbench) return;
      e.preventDefault();
      audioResume();
      var x = parseInt(t.getAttribute('data-x'), 10);
      var y = parseInt(t.getAttribute('data-y'), 10);
      if (isNaN(x) || isNaN(y)) return;
      G.wbCursor.x = x;
      G.wbCursor.y = y;
      toggleWorkbenchCell(x, y);
    });

    on(D.btnGenerate, 'click', function (e) { e.preventDefault(); audioResume(); generate(); });
    on(D.btnClear, 'click', function (e) { e.preventDefault(); audioResume(); cancelBuild(); clearWorkbench(true); saveNow(); });
    on(D.btnAgain, 'click', function (e) { e.preventDefault(); againFromRetro(); });
    on(D.btnNew, 'click', function (e) { e.preventDefault(); audioResume(); newGamePressed(); });
    on(D.btnHelp, 'click', function (e) {
      e.preventDefault();
      audioResume();
      if (G.howtoOpen) closeHowto(); else openHowto(G.screen === 'title' ? 'title' : 'play');
    });
    on(D.btnResume, 'click', function (e) { e.preventDefault(); resumeRun(); });
    on(D.btnNewgame, 'click', function (e) { e.preventDefault(); resumeNewGamePressed(); });
    on(D.soundToggle, 'click', function (e) { e.preventDefault(); audioResume(); toggleSound(); });
    on(D.sprintLabel, 'click', function (e) {
      e.preventDefault();
      audioResume();
      if (G.howtoOpen) closeHowto(); else openHowto(G.screen === 'title' ? 'title' : 'play');
    });

    on(D.titleScreen, 'click', function (e) { e.preventDefault(); startFromTitle(); });
    on(D.howtoScreen, 'click', function (e) { e.preventDefault(); closeHowto(); });

    // Long-press the title for the dev panel (SPEC 8.2).
    var titleTimer = 0;
    function cancelTitleTimer() {
      if (titleTimer) { clearTimeout(titleTimer); titleTimer = 0; }
    }
    // Touch browsers turn a long press into a context menu or a selection and
    // send pointercancel, so the label claims the pointer: capture it, refuse
    // the context menu, and keep the timer through small finger movement.
    on(D.titleLabel, 'pointerdown', function (e) {
      cancelTitleTimer();
      if (e && e.preventDefault) e.preventDefault();
      if (D.titleLabel.setPointerCapture && e && e.pointerId != null) {
        try { D.titleLabel.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      titleTimer = setTimeout(function () { titleTimer = 0; toggleDevPanel(); }, cfg.TITLE_LONGPRESS_MS);
    });
    on(D.titleLabel, 'pointerup', cancelTitleTimer);
    on(D.titleLabel, 'pointercancel', cancelTitleTimer);
    on(D.titleLabel, 'contextmenu', function (e) { e.preventDefault(); });

    on(window, 'resize', resize);
    on(window, 'orientationchange', function () { setTimeout(resize, 120); });
    on(document, 'visibilitychange', function () {
      if (document.visibilityState === 'hidden') { releaseHeldKeys(); saveNow(); }
    });
    on(window, 'pagehide', function () { releaseHeldKeys(); saveNow(); });

    if (window.matchMedia) {
      var mq = window.matchMedia('(pointer: coarse)');
      var onChange = function (ev) {
        G.coarse = !!ev.matches;
        if (document.body) document.body.classList.toggle('coarse', G.coarse);
        updateSoundLabel();
        updateHowtoControls();
        updateResumeCopy();
        if (G.screen === 'retro') renderRetro();
        resize();
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* =====================================================================
   * 14. DEV PANEL  (SPEC 10.2)
   * ===================================================================== */

  function toggleDevPanel() { setDevOpen(!G.devOpen); }

  function setDevOpen(open) {
    G.devOpen = !!open;
    if (D.devPanel) D.devPanel.hidden = !G.devOpen;
    if (G.screen === 'retro') renderRetro();
  }

  function refreshDevSeed() {
    if (!D.devSeed) return;
    D.devSeed.value = String(G.seed >>> 0);
    if (G.seedModePref === 'fixed') D.devSeed.removeAttribute('readonly');
    else D.devSeed.setAttribute('readonly', '');
  }

  function setValue(el, v) { if (el) el.value = String(v); }
  function setChecked(el, v) { if (el) el.checked = !!v; }

  function refreshDevInputs() {
    setChecked(D.devModeRandom, G.seedModePref === 'random');
    setChecked(D.devModeDaily, G.seedModePref === 'daily');
    setChecked(D.devModeFixed, G.seedModePref === 'fixed');
    refreshDevSeed();
    for (var i = 0; i < 5; i++) {
      setValue(D.devMut[i], cfg.MUTATION_TABLE[i]);
      setValue(D.devDeadline[i], cfg.DEADLINES_S[i]);
      setValue(D.devGoal[i], cfg.GOALS_LINES[i]);
    }
    setValue(D.devRefactor, cfg.REFACTOR_CHANCE);
    setValue(D.devReviewThreshold, cfg.REVIEW_THRESHOLD);
    setValue(D.devReviewGravity, cfg.REVIEW_GRAVITY_MS);
    setValue(D.devGravity, cfg.GRAVITY_MS);
    setValue(D.devBuildMs, cfg.BUILD_MS);
    setChecked(D.devForceMutation, G.forceMutation);
    setChecked(D.devForceRefactor, G.forceRefactor);
    setChecked(D.devShowTargets, G.showTargets);
    setChecked(D.devShowStreak, G.showStreak);
  }

  function bindNumber(el, apply) {
    function handler() {
      var v = parseFloat(el.value);
      if (isFinite(v)) { apply(v); updateStatusBar(); requestDraw(); }
    }
    on(el, 'input', handler);
    on(el, 'change', handler);
  }

  function bindCheck(el, apply) {
    on(el, 'change', function () {
      apply(!!el.checked);
      updateStatusBar();
      requestDraw();
      if (el.blur) el.blur();   // give the keyboard back to the game
    });
  }

  function resetCfg() {
    for (var k in CONFIG) {
      if (!Object.prototype.hasOwnProperty.call(CONFIG, k)) continue;
      cfg[k] = Array.isArray(CONFIG[k]) ? CONFIG[k].slice() : CONFIG[k];
    }
    G.forceMutation = false;
    G.forceRefactor = false;
    G.showTargets = false;
    G.showStreak = false;
  }

  function makeIndexSetter(arrName, idx) {
    return function (v) { cfg[arrName][idx] = v; };
  }

  function bindDev() {
    var i;
    for (i = 0; i < 5; i++) {
      bindNumber(D.devMut[i], makeIndexSetter('MUTATION_TABLE', i));
      bindNumber(D.devDeadline[i], makeIndexSetter('DEADLINES_S', i));
      bindNumber(D.devGoal[i], makeIndexSetter('GOALS_LINES', i));
    }
    bindNumber(D.devRefactor, function (v) { cfg.REFACTOR_CHANCE = v; });
    bindNumber(D.devReviewThreshold, function (v) { cfg.REVIEW_THRESHOLD = v; });
    bindNumber(D.devReviewGravity, function (v) { cfg.REVIEW_GRAVITY_MS = v; });
    bindNumber(D.devGravity, function (v) { cfg.GRAVITY_MS = v; });
    bindNumber(D.devBuildMs, function (v) { cfg.BUILD_MS = v; });

    bindCheck(D.devForceMutation, function (v) { G.forceMutation = v; });
    bindCheck(D.devForceRefactor, function (v) { G.forceRefactor = v; });
    bindCheck(D.devShowTargets, function (v) { G.showTargets = v; });
    bindCheck(D.devShowStreak, function (v) { G.showStreak = v; });

    // Seed mode takes effect on the next run, not mid-run.
    function modeHandler(mode) {
      return function () {
        G.seedModePref = mode;
        refreshDevSeed();
        blurTarget({ target: this });
      };
    }
    on(D.devModeRandom, 'change', modeHandler('random'));
    on(D.devModeDaily, 'change', modeHandler('daily'));
    on(D.devModeFixed, 'change', modeHandler('fixed'));

    on(D.devSeed, 'change', function () {
      if (G.seedModePref !== 'fixed') return;
      var v = parseInt(D.devSeed.value, 10);
      if (isFinite(v)) G.fixedSeed = v >>> 0;
    });

    on(D.devSeedCopy, 'click', function (e) {
      e.preventDefault();
      var base = '';
      try { base = window.location.origin + window.location.pathname; } catch (err) { base = ''; }
      copyToClipboard(base + '?seed=' + (G.seed >>> 0));
    });

    on(D.devCuePlay, 'click', function (e) {
      e.preventDefault();
      audioUnlock();
      var name = D.devCue ? D.devCue.value : '';
      if (!name) return;
      if (name === 'music') { audioStartMusic(); return; }
      if (name === 'review_charge') {
        audioStartCharge();
        var t0 = nowMs();
        var iv = setInterval(function () {
          var t = (nowMs() - t0) / 1000;
          audioSetCharge(t > 1 ? 1 : t);
          if (t >= 1) { clearInterval(iv); audioStopCharge(); }
        }, 50);
        return;
      }
      SFX(name);
    });

    on(D.devReset, 'click', function (e) {
      e.preventDefault();
      resetCfg();
      refreshDevInputs();
      updateStatusBar();
      requestDraw();
    });

    on(D.devClose, 'click', function (e) { e.preventDefault(); setDevOpen(false); });
    on(D.devCue, 'change', function () { if (D.devCue.blur) D.devCue.blur(); });

    fillCueDropdown();
    refreshDevInputs();
  }

  function fillCueDropdown() {
    if (!D.devCue) return;
    var a = AUD();
    var names = [];
    if (a && a.cueNames) {
      try { names = a.cueNames() || []; } catch (e) { names = []; }
    }
    while (D.devCue.firstChild) D.devCue.removeChild(D.devCue.firstChild);
    for (var i = 0; i < names.length; i++) {
      var opt = document.createElement('option');
      opt.value = names[i];
      opt.textContent = names[i];
      D.devCue.appendChild(opt);
    }
  }

  /* =====================================================================
   * 15. LOOP
   * ===================================================================== */

  function animating() {
    var bannerLive = G.sprintBanner && !G.sprintBanner.hold;
    return !!(G.pulse || G.reviewFlash || G.mutateFlash || G.settling.length || bannerLive || G.lineFlash || typingBusy() || statusBusy());
  }

  function needsRAF() {
    if (G.screen !== 'play') return false;
    if (G.paused) return false;
    return G.state === 'falling' || G.state === 'locking' || animating();
  }

  function frame(now) {
    G.rafId = 0;
    var dt = G.lastFrame ? Math.min(100, now - G.lastFrame) : 16;
    G.lastFrame = now;

    var live = G.screen === 'play' && !G.paused && !G.howtoOpen;
    if (live && G.state === 'falling') updateFalling(now, dt);
    if (live) updateSettling(dt);
    syncReviewTone();
    stepTyping(now);
    draw(now);
    updateStatusBar();

    if (needsRAF()) G.rafId = requestAnimationFrame(frame);
    else G.lastFrame = 0;
  }

  // Either kicks the loop or schedules the single draw that a quiet state needs.
  function requestDraw() {
    if (G.rafId) return;
    if (typeof requestAnimationFrame !== 'function') return;
    G.lastFrame = 0;
    G.rafId = requestAnimationFrame(frame);
  }

  /* =====================================================================
   * 16. BOOT
   * ===================================================================== */

  function cacheDom() {
    D.app = byId('app');
    D.header = byId('header');
    D.soundToggle = byId('sound-toggle');
    D.titleLabel = byId('title-label');
    D.sprintLabel = byId('sprint-label');
    D.clock = byId('clock');
    D.goal = byId('goal');
    D.goalN = byId('goal-n');

    D.canvas = byId('well');
    D.rightCol = byId('right-col');
    D.ticketPanel = byId('ticket-panel');
    D.ticketTitle = byId('ticket-title');
    D.ticketShape = byId('ticket-shape');
    D.ticketCopy = byId('ticket-copy');
    D.workbenchPanel = byId('workbench-panel');
    D.workbench = byId('workbench');
    D.retroPanel = byId('retro-panel');
    D.retroStats = byId('retro-stats');

    D.resumePanel = byId('resume-panel');
    D.resumeLine = byId('resume-line');
    D.resumeControls = byId('resume-controls');
    D.resumeButtons = byId('resume-buttons');
    D.btnResume = byId('btn-resume');
    D.btnNewgame = byId('btn-newgame');

    D.assistantPanel = byId('assistant-panel');
    D.chat = byId('chat');
    D.hintRow = byId('hint-row');
    D.hintKeys = byId('hint-keys');
    D.btnGenerate = byId('btn-generate');
    D.btnClear = byId('btn-clear');
    D.btnAgain = byId('btn-again');
    D.btnNew = byId('btn-new');
    D.btnHelp = byId('btn-help');
    D.statusBar = byId('status-bar');

    D.titleScreen = byId('title-screen');
    D.titleBest = byId('title-best');
    D.howtoScreen = byId('howto-screen');
    D.howtoFine = byId('howto-controls-fine');
    D.titleCopy = byId('title-copy');
    D.howtoP = [byId('howto-p1'), byId('howto-p2'), byId('howto-p3'), byId('howto-p4')];
    applyCopyToDom();
    D.howtoCoarse = byId('howto-controls-coarse');

    D.devPanel = byId('dev-panel');
    D.devModeRandom = byId('dev-mode-random');
    D.devModeDaily = byId('dev-mode-daily');
    D.devModeFixed = byId('dev-mode-fixed');
    D.devSeed = byId('dev-seed');
    D.devSeedCopy = byId('dev-seed-copy');
    D.devMut = [byId('dev-mut-1'), byId('dev-mut-2'), byId('dev-mut-3'), byId('dev-mut-4'), byId('dev-mut-5')];
    D.devRefactor = byId('dev-refactor');
    D.devReviewThreshold = byId('dev-review-threshold');
    D.devReviewGravity = byId('dev-review-gravity');
    D.devDeadline = [byId('dev-deadline-1'), byId('dev-deadline-2'), byId('dev-deadline-3'), byId('dev-deadline-4'), byId('dev-deadline-5')];
    D.devGoal = [byId('dev-goal-1'), byId('dev-goal-2'), byId('dev-goal-3'), byId('dev-goal-4'), byId('dev-goal-5')];
    D.devGravity = byId('dev-gravity');
    D.devBuildMs = byId('dev-build-ms');
    D.devForceMutation = byId('dev-force-mutation');
    D.devForceRefactor = byId('dev-force-refactor');
    D.devShowTargets = byId('dev-show-targets');
    D.devShowStreak = byId('dev-show-streak');
    D.devCue = byId('dev-cue');
    D.devCuePlay = byId('dev-cue-play');
    D.devReset = byId('dev-reset');
    D.devClose = byId('dev-close');
  }

  // The 16 workbench buttons and the 16 ticket cells, built here when
  // index.html ships them empty.
  function buildGrids() {
    var x, y, el;
    if (D.workbench) {
      if (D.workbench.querySelectorAll('.wb-cell').length !== 16) {
        while (D.workbench.firstChild) D.workbench.removeChild(D.workbench.firstChild);
        for (y = 0; y < 4; y++) {
          for (x = 0; x < 4; x++) {
            el = document.createElement('button');
            el.className = 'wb-cell';
            el.type = 'button';
            el.setAttribute('data-x', String(x));
            el.setAttribute('data-y', String(y));
            D.workbench.appendChild(el);
          }
        }
      }
      D.wbCells = Array.prototype.slice.call(D.workbench.querySelectorAll('.wb-cell'));
    }
    if (D.ticketShape) {
      if (D.ticketShape.querySelectorAll('.tk-cell').length !== 16) {
        while (D.ticketShape.firstChild) D.ticketShape.removeChild(D.ticketShape.firstChild);
        for (y = 0; y < 4; y++) {
          for (x = 0; x < 4; x++) {
            el = document.createElement('span');
            el.className = 'tk-cell';
            D.ticketShape.appendChild(el);
          }
        }
      }
      D.ticketCells = Array.prototype.slice.call(D.ticketShape.querySelectorAll('.tk-cell'));
    }
  }

  function detectCoarse() {
    var coarse = false;
    if (window.matchMedia) {
      try { coarse = !!window.matchMedia('(pointer: coarse)').matches; } catch (e) { coarse = false; }
    }
    G.coarse = coarse;
    if (document.body) document.body.classList.toggle('coarse', coarse);
  }

  function boot() {
    if (typeof document === 'undefined' || !document.getElementById) {
      return;
    }
    if (!document.getElementById('well')) {
      if (window.console && console.log) {
        console.log('sloptris: no #well element found, game.js is standing by');
      }
      return;
    }

    cacheDom();
    ctx = D.canvas.getContext ? D.canvas.getContext('2d') : null;
    if (!ctx) {
      if (window.console && console.log) console.log('sloptris: no 2d context, game.js is standing by');
      return;
    }

    detectCoarse();
    buildGrids();

    G.best = readBest();

    var params = queryParams();
    if (Object.prototype.hasOwnProperty.call(params, 'seed')) {
      var n = parseInt(params.seed, 10);
      if (isFinite(n)) {
        G.seedModePref = 'fixed';
        G.fixedSeed = n >>> 0;
        G.seedForced = true;
      }
    }
    G.seedMode = G.seedModePref;
    G.seed = resolveSeed(G.seedMode, G.fixedSeed);
    G.rng = mulberry32(G.seed);

    bindInput();
    bindDev();
    if (Object.prototype.hasOwnProperty.call(params, 'dev')) setDevOpen(true);

    updateSoundLabel();
    updateHowtoControls();
    updateHintRow();
    resize();

    var saved = loadSave();
    if (saved) {
      restoreState(saved);
      rebuildChatDOM();
      renderAll();
      resize();
      showResumePanel();
    } else {
      G.chat = [];
      rebuildChatDOM();
      newTicket();
      showTitle();
      renderAll();
    }
    refreshDevSeed();

    G.lastTickAt = nowMs();
    setInterval(tickClock, 100);
    requestDraw();
  }

  /* Debug handle. Nothing in the game reads from it. */
  window.Sloptris = {
    G: G,
    cfg: cfg,
    CONFIG: CONFIG,
    COPY: COPY,
    COLORS: COLORS,
    SPAWN: SPAWN,
    SHAPE_LETTERS: SHAPE_LETTERS,
    ORIENTATIONS: ORIENTATIONS,
    KICKS: KICKS,
    rotateCellCW: rotateCellCW,
    rotateVertexCW: rotateVertexCW,
    rotateCells: rotateCells,
    rotateVertices: rotateVertices,
    normalize: normalize,
    cellsKey: cellsKey,
    sameCells: sameCells,
    boundingBox: boundingBox,
    outlineEdges: outlineEdges,
    matchesShape: matchesShape,
    shapeOfCells: shapeOfCells,
    chooseTarget: chooseTarget,
    chooseTargetLocal: chooseTargetLocal,
    planMutation: planMutation,
    commitMutation: commitMutation,
    applyMutation: applyMutation,
    fallbackTarget: fallbackTarget,
    boardRefactor: boardRefactor,
    newBoard: newBoard,
    fits: fits,
    pieceCells: pieceCells,
    fullRows: fullRows,
    clearRows: clearRows,
    slopCellsOnBoard: slopCellsOnBoard,
    serialize: serialize,
    restoreState: restoreState,
    saveNow: saveNow,
    deleteSave: deleteSave,
    mulberry32: mulberry32,
    hashString: hashString,
    resolveSeed: resolveSeed,
    newRun: newRun,
    generate: generate,
    spawnPiece: spawnPiece,
    tryMove: tryMove,
    tryRotate: tryRotate,
    hardDrop: hardDrop,
    lockPipeline: lockPipeline,
    topOut: topOut,
    retroStatsText: retroStatsText,
    setDevOpen: setDevOpen,
    resize: resize,
    draw: draw
  };

  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
