/* Reusable inner-page reveal transition.
 *
 * No iframes: the destination is the REAL component, mounted in the same DOM
 * tree inside a fixed full-viewport container above the current page. This
 * helper owns only the timeline — the caller owns mounting.
 *
 *   PageReveal.go({
 *     element,              // the fixed container holding the destination
 *     direction,            // "ltr" (boundary left -> right) | "rtl"
 *     duration,             // sweep ms, default 1150
 *     hold,                 // frozen anticipation beat, default 130
 *     commit,               // called at full reveal, to swap route
 *     onDone
 *   })
 *
 * Stage 1 setup: hidden clip applied, then a forced reflow + double rAF so
 * the browser paints the hidden state instead of collapsing both states into
 * one paint (which would skip the animation entirely).
 * Stage 2: hold. Stage 3: sweep. Stage 4: commit.
 */
(function (global) {
  var EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
  var HOLD = 130;
  var DURATION = 1150;
  var SETTLE = 120;
  var running = false;

  function hiddenClip(dir) {
    // zero-width visible strip, pinned to the edge the boundary moves from
    return dir === "rtl" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  }

  function setClip(el, value) {
    el.style.clipPath = value;
    el.style.webkitClipPath = value;
  }

  function go(opts) {
    var el = opts && opts.element;
    if (!el || running) return;
    running = true;

    var dir = opts.direction === "rtl" ? "rtl" : "ltr";
    var duration = opts.duration || DURATION;
    var hold = typeof opts.hold === "number" ? opts.hold : HOLD;
    var committed = false;
    // a reverse run starts fully revealed and clips back out
    var from = opts.reverse ? "inset(0 0 0 0)" : hiddenClip(dir);
    var to = opts.reverse ? hiddenClip(dir) : "inset(0 0 0 0)";

    var finish = function () {
      if (committed) return;
      committed = true;
      running = false;
      if (typeof opts.commit === "function") { try { opts.commit(); } catch (e) {} }
      if (typeof opts.onDone === "function") { try { opts.onDone(); } catch (e) {} }
    };

    /* Stage 1 — hidden state, painted for real */
    el.style.transition = "none";
    el.style.willChange = "clip-path";
    setClip(el, from);
    void el.offsetHeight;

    var sweep = function () {
      /* Stage 3 — one continuous boundary sweep */
      el.style.transition = "clip-path " + duration + "ms " + EASE +
        ", -webkit-clip-path " + duration + "ms " + EASE;
      setClip(el, to);
    };

    var begin = function () {
      /* Stage 2 — frozen anticipation beat */
      setTimeout(sweep, hold);
      // Stage 4 is timer-driven as well as transitionend-driven: rAF and
      // transitions are both starved in a throttled document, and the route
      // commit must never depend on the sweep having actually run.
      setTimeout(finish, hold + duration + SETTLE);
      el.addEventListener("transitionend", function (ev) {
        if (ev.propertyName.indexOf("clip-path") > -1) setTimeout(finish, SETTLE);
      });
    };

    if (global.requestAnimationFrame) {
      global.requestAnimationFrame(function () {
        global.requestAnimationFrame(begin);
      });
      // rAF starvation fallback
      setTimeout(begin, 80);
    } else {
      setTimeout(begin, 32);
    }
  }

  global.PageReveal = { go: go };
})(window);
