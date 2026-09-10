/* Reusable cinematic page transition engine for Portfolio & Artist World.
 * Features capture-phase interception, directional sweeps with glowing beams,
 * custom atmospheric artwork background, 1-second reading hold, and seamless navigation.
 */
(function (global) {
  var EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
  var SWEEP_DURATION = 750;
  var READ_HOLD_MS = 1000; // 1 full second for the user to read the quote
  var STORAGE_KEY = "dc_page_transition_state";

  /* ---------------------------------------------------------
   * State Storage (Session + Memory fallback)
   * --------------------------------------------------------- */
  var memState = null;

  function saveState(state) {
    memState = state;
    try {
      if (global.sessionStorage) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {}
  }

  function loadState() {
    try {
      if (global.sessionStorage) {
        var raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          sessionStorage.removeItem(STORAGE_KEY);
          return JSON.parse(raw);
        }
      }
    } catch (e) {}
    var s = memState;
    memState = null;
    return s;
  }

  /* ---------------------------------------------------------
   * Transition Overlay Creation
   * --------------------------------------------------------- */
  function createCurtainElement(opts, isExit) {
    var existing = document.getElementById("dc-page-transition-curtain");
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var theme = opts.theme || "artist";
    var dir = opts.direction || "ltr";
    var isArtist = theme === "artist";

    var curtain = document.createElement("div");
    curtain.id = "dc-page-transition-curtain";
    curtain.setAttribute("data-theme", theme);
    curtain.setAttribute("data-direction", dir);

    var bg = isArtist
      ? "linear-gradient(180deg, rgba(11, 10, 9, 0.62) 0%, rgba(11, 10, 9, 0.72) 40%, rgba(11, 10, 9, 0.88) 100%), url('assets/transition-bg.jpg') center 35% / cover no-repeat, #0B0A09"
      : "linear-gradient(180deg, rgba(14, 12, 10, 0.72) 0%, rgba(14, 12, 10, 0.82) 40%, rgba(11, 10, 9, 0.92) 100%), url('assets/transition-bg.jpg') center 35% / cover no-repeat, #0D0B0A";
    var accent = "#E8763A";
    var glowAccent = "rgba(232, 118, 58, 0.95)";

    curtain.style.cssText = [
      "position:fixed",
      "inset:0",
      "width:100vw",
      "height:100vh",
      "z-index:2147483647",
      "background:" + bg,
      "pointer-events:all",
      "overflow:hidden",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "will-change:transform",
      "transform:" + (isExit ? (dir === "rtl" ? "translateX(100%)" : "translateX(-100%)") : "translateX(0%)")
    ].join(";");

    // Leading edge beam (glowing vertical light that travels at the boundary)
    var beam = document.createElement("div");
    beam.className = "dc-curtain-beam";
    var beamSide = isExit ? (dir === "rtl" ? "left:0" : "right:0") : (dir === "rtl" ? "right:0" : "left:0");
    beam.style.cssText = [
      "position:absolute",
      "top:0",
      "bottom:0",
      beamSide,
      "width:4px",
      "background:linear-gradient(180deg, rgba(232,118,58,0) 0%, " + accent + " 20%, #FFF4E5 50%, " + accent + " 80%, rgba(232,118,58,0) 100%)",
      "box-shadow:0 0 35px 12px " + glowAccent + ", 0 0 85px 28px rgba(232,118,58,0.55)",
      "pointer-events:none",
      "z-index:2"
    ].join(";");
    curtain.appendChild(beam);

    // Inner typography & atmosphere in a frosted glass card
    var badge = opts.badge || (isArtist ? "✦ Entering Artist World ✦" : "✦ Returning To Systems ✦");
    var quote = opts.quote || (isArtist ? "“Creativity keeps me human in a world of logic.”" : "“Same code. Higher bar.”");
    var subtitle = opts.subtitle || (isArtist ? "Sketches · Art · Poetry" : "Backend · Java · AI Systems");

    var content = document.createElement("div");
    content.className = "dc-curtain-content";
    content.style.cssText = [
      "position:relative",
      "z-index:1",
      "display:flex",
      "flex-direction:column",
      "align-items:center",
      "justify-content:center",
      "gap:clamp(16px, 2.5vh, 26px)",
      "padding:clamp(28px, 4vh, 48px) clamp(30px, 4vw, 56px)",
      "border-radius:24px",
      "background:rgba(11, 10, 9, 0.58)",
      "backdrop-filter:blur(14px)",
      "-webkit-backdrop-filter:blur(14px)",
      "border:1px solid rgba(244, 239, 230, 0.14)",
      "box-shadow:0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(232, 118, 58, 0.2)",
      "max-width:min(90vw, 680px)",
      "text-align:center",
      "color:#F4EFE6",
      "opacity:" + (isExit ? "0" : "1"),
      "transform:" + (isExit ? "scale(0.92)" : "scale(1)"),
      "transition:opacity 500ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)"
    ].join(";");

    content.innerHTML = [
      '<div style="display:inline-flex;align-items:center;gap:10px;padding:7px 20px;border-radius:999px;background:rgba(232,118,58,0.18);border:1px solid rgba(232,118,58,0.45);font-family:\'Poppins\',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:#E8763A;box-shadow:0 0 25px rgba(232,118,58,0.3)">',
      '  <span style="width:7px;height:7px;border-radius:50%;background:#E8763A;display:inline-block;box-shadow:0 0 8px #E8763A"></span>',
      '  <span>' + badge + '</span>',
      '</div>',
      '<div style="font-family:\'Caveat\',cursive;font-size:clamp(30px, 4.2vw, 52px);font-weight:500;line-height:1.2;color:#F4EFE6;max-width:24ch;text-wrap:pretty;text-shadow:0 4px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)">',
      '  ' + quote,
      '</div>',
      '<div style="font-family:\'Poppins\',sans-serif;font-size:clamp(10px, 0.82vw, 13px);letter-spacing:0.32em;text-transform:uppercase;color:rgba(244,239,230,0.65)">',
      '  ' + subtitle,
      '</div>',
      '<div style="width:160px;height:3px;background:rgba(244,239,230,0.14);border-radius:999px;overflow:hidden;margin-top:10px">',
      '  <div id="dc-curtain-progress-bar" style="width:100%;height:100%;background:linear-gradient(90deg, #E8763A, #FFA86B);transform:scaleX(0);transform-origin:left"></div>',
      '</div>'
    ].join("");

    curtain.appendChild(content);
    return curtain;
  }

  /* ---------------------------------------------------------
   * Outbound Sweep Animation with 1-Second Reading Hold
   * --------------------------------------------------------- */
  function sweepTo(destinationUrl, options) {
    if (global._dcTransitioning) return;
    global._dcTransitioning = true;

    var opts = options || {};
    var dir = opts.direction || "ltr";
    var duration = opts.duration || SWEEP_DURATION;
    var hold = typeof opts.hold === "number" ? opts.hold : READ_HOLD_MS;

    var curtain = createCurtainElement(opts, true);
    document.body.appendChild(curtain);

    // Save intent so destination page un-curtains smoothly
    saveState({
      theme: opts.theme || "artist",
      direction: dir,
      timestamp: Date.now()
    });

    // Force paint of initial outside state
    void curtain.offsetHeight;

    // Trigger sweep across screen
    requestAnimationFrame(function () {
      curtain.style.transition = "transform " + duration + "ms " + EASE;
      curtain.style.transform = "translateX(0%)";

      // Animate content fade-in and progress bar
      var content = curtain.querySelector(".dc-curtain-content");
      var progressBar = curtain.querySelector("#dc-curtain-progress-bar");
      if (content) {
        setTimeout(function () {
          content.style.opacity = "1";
          content.style.transform = "scale(1)";
        }, 100);
      }
      if (progressBar) {
        setTimeout(function () {
          progressBar.style.transition = "transform " + (duration + hold - 150) + "ms cubic-bezier(0.2, 0.8, 0.3, 1)";
          progressBar.style.transform = "scaleX(1)";
        }, 140);
      }
    });

    // Hold for 1 full second so user can read before navigating!
    setTimeout(function () {
      global.location.href = destinationUrl;
    }, duration + hold);
  }

  /* ---------------------------------------------------------
   * Inbound Reveal Animation on Destination Page
   * --------------------------------------------------------- */
  var revealed = false;
  function initReveal(fallbackOpts) {
    if (revealed) return;
    var state = loadState();
    if (!state) return;
    revealed = true;

    // Discard stale transitions (> 14s)
    if (state.timestamp && Date.now() - state.timestamp > 14000) return;

    var opts = Object.assign({}, fallbackOpts || {}, state);
    var dir = opts.direction || "ltr";
    var duration = opts.duration || SWEEP_DURATION;

    var curtain = createCurtainElement(opts, false);
    var beam = curtain.querySelector(".dc-curtain-beam");
    if (beam) {
      if (dir === "ltr") {
        beam.style.left = "auto";
        beam.style.right = "0";
      } else {
        beam.style.right = "auto";
        beam.style.left = "0";
      }
    }

    var content = curtain.querySelector(".dc-curtain-content");
    if (content) {
      content.style.opacity = "1";
      content.style.transform = "scale(1)";
    }
    var progressBar = curtain.querySelector("#dc-curtain-progress-bar");
    if (progressBar) progressBar.style.transform = "scaleX(1)";

    document.body.appendChild(curtain);
    void curtain.offsetHeight;

    // Brief hold so DOM settles, then sweep OFF to the right (ltr) or left (rtl)
    var revealTarget = dir === "ltr" ? "translateX(100%)" : "translateX(-100%)";
    setTimeout(function () {
      curtain.style.transition = "transform " + duration + "ms " + EASE;
      curtain.style.transform = revealTarget;

      if (content) {
        content.style.transition = "opacity 350ms ease, transform 350ms ease";
        content.style.opacity = "0";
        content.style.transform = "scale(0.95)";
      }

      setTimeout(function () {
        if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
        global._dcTransitioning = false;
      }, duration + 80);
    }, 160);
  }

  /* ---------------------------------------------------------
   * Capture-Phase Interceptor: Bulletproof Instant Intercept
   * --------------------------------------------------------- */
  global.addEventListener("click", function (e) {
    var link = e.target && e.target.closest ? e.target.closest("a, button") : null;
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var text = (link.textContent || "").trim().toLowerCase();

    // Developer Portfolio -> Artist World
    if (
      href.indexOf("Artist") !== -1 ||
      text.indexOf("other profession") !== -1 ||
      link.hasAttribute("data-go-artist")
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (link.style) {
        link.style.transform = "scale(0.94)";
        link.style.opacity = "0.85";
        setTimeout(function () {
          link.style.transform = "";
          link.style.opacity = "";
        }, 300);
      }
      var dest = href && href !== "#" && href.indexOf("javascript") === -1
        ? href
        : "Artist%20World.dc.html" + (global.location.search || "");
      sweepTo(dest, {
        theme: "artist",
        direction: "ltr",
        title: "Artist World",
        badge: "✦ Entering Artist World ✦",
        quote: "“Creativity keeps me human in a world of logic.”",
        subtitle: "Sketches · Art · Poetry",
        hold: READ_HOLD_MS
      });
      return;
    }

    // Artist World -> Developer Portfolio
    if (
      (href.indexOf("Hero") !== -1 && href.indexOf("#contact") !== -1) ||
      text.indexOf("back to developer") !== -1 ||
      link.hasAttribute("data-go-dev")
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (link.style) {
        link.style.transform = "scale(0.94)";
        link.style.opacity = "0.85";
        setTimeout(function () {
          link.style.transform = "";
          link.style.opacity = "";
        }, 300);
      }
      var dest = href && href !== "#" && href.indexOf("javascript") === -1
        ? href
        : "Hero%20Scroll.dc.html" + (global.location.search || "") + "#contact";
      sweepTo(dest, {
        theme: "developer",
        direction: "rtl",
        title: "Developer Portfolio",
        badge: "✦ Returning To Systems ✦",
        quote: "“Same code. Higher bar.”",
        subtitle: "Backend · Java · AI Systems",
        hold: READ_HOLD_MS
      });
      return;
    }
  }, true); // TRUE = CAPTURE PHASE!

  // Auto-reveal on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { initReveal(); });
  } else {
    initReveal();
  }
  global.addEventListener("load", function () { initReveal(); });

  /* Legacy PageReveal */
  global.PageReveal = {
    go: function (opts) {
      sweepTo(opts.destination || "Artist%20World.dc.html", opts);
    }
  };

  global.PageTransition = {
    sweepTo: sweepTo,
    initReveal: initReveal
  };
})(window);
