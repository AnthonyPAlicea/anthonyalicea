/* Context-impact overlay, shared by all sixteen variants.
   Adds a floating toggle. When on, every element carrying a data-ux
   attribute gets a ring and a floating card summarizing linked
   context. Links were audited against the design logs; they do not
   certify that a requirement is fully implemented. See
   ../context/ANNOTATION-AUDIT.md. Cards prefer the page margins and fall
   back to floating above the element. */
(function () {
  "use strict";

  if (new URLSearchParams(window.location.search).get("context") !== "1") {
    return;
  }

  var SNIPPETS = {
    F1: "People do not have their policy number when they file. Never require it to begin.",
    F2: "Photographs come before words. Photos are the first step; describing it in writing is optional and last.",
    F3: "The first question everyone asks is what happens next. Say it before asking for anything.",
    F4: "Reports get abandoned and restarted. Save continuously and make returning obvious.",
    F5: "People are afraid of getting it wrong. Allow “I don't know” and say details can be corrected later.",
    U1: "They have done this about once in a decade. Guidance over efficiency, no assumed conventions.",
    U2: "They do not know insurance vocabulary. No term without a plain explanation next to it.",
    U3: "They are not coming back tomorrow. No registration before the report is filed.",
    U4: "Ability varies widely and skews older. Large text, large targets, nothing timed.",
    W1: "Standing at the roadside on a phone. Single column, one hand, high contrast.",
    W2: "Interruption is near certain. One decision per screen, safe to abandon mid-answer.",
    W3: "Documents are not at hand. Never block progress on a document.",
    W4: "The connection is unreliable. Save locally and say when something has not been sent.",
    W5: "This is a legal record. Show the timestamp and keep corrections possible after submission.",
    G1: "The words people use: report, crash, the other driver, what you pay."
  };

  var pairs = [];
  var note = null;
  var mo = null;
  var raf = 0;
  var on = false;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ctxi-btn";
  btn.textContent = "Show Context Impact";
  document.body.appendChild(btn);

  btn.addEventListener("click", function () {
    on = !on;
    btn.textContent = on ? "Hide Context Impact" : "Show Context Impact";
    if (on) { build(); } else { teardown(); }
  });

  function build() {
    var els = document.querySelectorAll("[data-ux]");
    if (!els.length) {
      note = document.createElement("div");
      note.className = "ctxi-empty";
      note.textContent = "No UX.md annotations on this page. Version 0000 received the shared prompt, visual identity, and publishing rules, with no UX.md.";
      document.body.appendChild(note);
      return;
    }
    Array.prototype.forEach.call(els, function (el) {
      var ids = (el.getAttribute("data-ux") || "").trim().split(/\s+/);
      var card = document.createElement("aside");
      card.className = "ctxi-card";
      ids.forEach(function (id) {
        var text = SNIPPETS[id];
        if (!text) { return; }
        var row = document.createElement("p");
        row.className = "ctxi-row";
        var tag = document.createElement("b");
        tag.className = "ctxi-id ctxi-id-" + id.charAt(0).toLowerCase();
        tag.textContent = id;
        row.appendChild(tag);
        row.appendChild(document.createTextNode(" " + text));
        card.appendChild(row);
      });
      if (!card.children.length) { return; }
      document.body.appendChild(card);
      el.classList.add("ctxi-hit");
      pairs.push({ el: el, card: card });
    });
    positionAll();
    window.addEventListener("resize", schedule);
    mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (!isOurs(muts[i].target)) { schedule(); return; }
      }
    });
    mo.observe(document.body, { attributes: true, childList: true, subtree: true });
  }

  function teardown() {
    pairs.forEach(function (p) {
      p.el.classList.remove("ctxi-hit");
      if (p.card.parentNode) { p.card.parentNode.removeChild(p.card); }
    });
    pairs = [];
    if (note && note.parentNode) { note.parentNode.removeChild(note); }
    note = null;
    window.removeEventListener("resize", schedule);
    if (mo) { mo.disconnect(); mo = null; }
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  function isOurs(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return !!(el && el.closest && el.closest(".ctxi-card,.ctxi-btn,.ctxi-empty"));
  }

  function schedule() {
    if (raf) { return; }
    raf = requestAnimationFrame(function () {
      raf = 0;
      positionAll();
    });
  }

  function positionAll() {
    var vw = document.documentElement.clientWidth;
    var sx = window.pageXOffset;
    var sy = window.pageYOffset;
    var placed = [];

    pairs.forEach(function (p) {
      var r = p.el.getBoundingClientRect();
      if (!r.width && !r.height) { p.card.style.display = "none"; return; }
      p.card.style.display = "";

      var cw = p.card.offsetWidth;
      var ch = p.card.offsetHeight;
      var top, left;

      if (vw - r.right >= cw + 24) {
        /* room in the right margin */
        left = sx + r.right + 12;
        top = sy + r.top;
      } else if (r.left >= cw + 24) {
        /* room in the left margin */
        left = sx + r.left - cw - 12;
        top = sy + r.top;
      } else {
        /* float above the element, clamped to the viewport width */
        left = Math.min(Math.max(sx + r.left, sx + 8), sx + vw - cw - 8);
        top = sy + r.top - ch - 10;
        if (top < 8) { top = sy + r.top + 10; }
      }

      /* nudge below any earlier card it would cover */
      for (var j = 0; j < placed.length; j++) {
        var q = placed[j];
        if (left < q.left + q.w + 8 && left + cw + 8 > q.left &&
            top < q.top + q.h + 8 && top + ch + 8 > q.top) {
          top = q.top + q.h + 8;
          j = -1;
        }
      }
      placed.push({ left: left, top: top, w: cw, h: ch });

      p.card.style.left = left + "px";
      p.card.style.top = top + "px";
    });
  }
})();
