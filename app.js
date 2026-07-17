/* The Tesla Pod — app.js */
(function () {
  "use strict";

  var episodes = EPISODES.slice(); // newest first (from data.js)
  var people = PEOPLE.slice();

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function epNum(ep) { return "EP " + String(ep.num).padStart(2, "0"); }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("tp-theme"); } catch (e) {}
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  function applyTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("tp-theme", next); } catch (e) {}
    renderHeroVideo();
    if (window.__setMapTheme) window.__setMapTheme(next);
    document.querySelectorAll("#tsThemeSeg button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-theme-set") === next);
    });
  }
  $("#themeToggle").addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- mobile menu ---------- */
  var burger = $("#navBurger"), menu = $("#mobileMenu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- scroll progress ---------- */
  var progress = $("#scrollProgress");
  addEventListener("scroll", function () {
    var h = document.documentElement;
    var pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = pct * 100 + "%";
  }, { passive: true });

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  var captureMode = /[?&]capture/.test(location.search);
  function observeReveals(ctx) {
    (ctx || document).querySelectorAll(".reveal:not(.in)").forEach(function (n) {
      if (captureMode) { n.classList.add("in"); return; }
      io.observe(n);
    });
  }

  /* ---------- telemetry ---------- */
  (function speed() {
    var elv = $("#speedVal"), v = 0, target = 32;
    var iv = setInterval(function () {
      v += Math.max(1, Math.round((target - v) / 8));
      if (v >= target) { v = target; clearInterval(iv); drift(); }
      elv.textContent = v;
    }, 60);
    function drift() {
      // tracks the FSD profile picked on the map card (window.__speedRange)
      setInterval(function () {
        var r = window.__speedRange || [24, 41];
        var v2 = parseInt(elv.textContent, 10) + (Math.random() > 0.5 ? 1 : -1);
        if (v2 < r[0]) v2 += 2;
        if (v2 > r[1]) v2 -= 2;
        elv.textContent = v2;
      }, 1800);
    }
  })();
  /* the live map card: a real Leaflet map of San Francisco.
     The pod navigates a street network between landmarks — click one to send it there. */
  (function liveMap() {
    var mapEl = document.getElementById("liveMap");
    var coordEl = $("#coordVal");
    var cursorEl = $("#mapCursor");
    var passingEl = $("#mapPassing");
    if (!mapEl || typeof L === "undefined") return;

    var TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    var TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    var map = L.map(mapEl, { scrollWheelZoom: false, zoomSnap: 0.25, attributionControl: true });
    map.attributionControl.setPrefix(false);
    var tiles = L.tileLayer(
      root.getAttribute("data-theme") === "dark" ? TILE_DARK : TILE_LIGHT,
      { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }
    ).addTo(map);
    window.__setMapTheme = function (theme) {
      tiles.setUrl(theme === "dark" ? TILE_DARK : TILE_LIGHT);
    };
    window.__podMap = map;

    /* ---- the street network: nodes at real intersections, edges along streets ---- */
    var NODES = {
      FERRY: [37.7955, -122.3937],
      BROADWAY_EMB: [37.7986, -122.3990],
      PIER39: [37.8087, -122.4098],
      WHARF: [37.8080, -122.4177],
      GHIRARDELLI: [37.8059, -122.4230],
      FORT_MASON: [37.8060, -122.4330],
      MARINA_FILL: [37.8055, -122.4430],
      PALACE: [37.8029, -122.4484],
      CRISSY: [37.8039, -122.4640],
      GGB_VISTA: [37.8073, -122.4754],
      GGB_END: [37.8117, -122.4772],
      PRESIDIO_MID: [37.7989, -122.4662],
      BAKER_BEACH: [37.7936, -122.4833],
      SEACLIFF: [37.7876, -122.4966],
      LEGION: [37.7845, -122.5008],
      CLIFF_HOUSE: [37.7784, -122.5136],
      OB_FULTON: [37.7714, -122.5093],
      OCEAN_BEACH: [37.7640, -122.5088],
      GREAT_SLOAT: [37.7355, -122.5052],
      LAKE_MERCED: [37.7280, -122.4940],
      SUNSET_SLOAT: [37.7353, -122.4753],
      N19_NORIEGA: [37.7540, -122.4760],
      N19_LINCOLN: [37.7660, -122.4770],
      PARKPRES_FULTON: [37.7717, -122.4718],
      GEARY_PARKPRES: [37.7808, -122.4720],
      DEYOUNG: [37.7715, -122.4687],
      STANYAN: [37.7685, -122.4535],
      HAIGHT_ASH: [37.7692, -122.4463],
      GEARY_MASONIC: [37.7815, -122.4470],
      GEARY_VANNESS: [37.7855, -122.4213],
      DIVIS_CHESTNUT: [37.8005, -122.4360],
      PAINTED: [37.7763, -122.4327],
      CITY_HALL: [37.7793, -122.4193],
      VANNESS_MKT: [37.7750, -122.4190],
      MKT_POWELL: [37.7844, -122.4080],
      UNION_SQ: [37.7880, -122.4074],
      CHINATOWN: [37.7908, -122.4056],
      TRANSAM: [37.7952, -122.4028],
      COLUMBUS_BWAY: [37.7977, -122.4067],
      COIT: [37.8024, -122.4058],
      LOMBARD_CRK: [37.8021, -122.4187],
      MKT_MONTGOMERY: [37.7890, -122.4010],
      SALESFORCE: [37.7897, -122.3972],
      EMB_BRANNAN: [37.7845, -122.3880],
      ORACLE: [37.7786, -122.3893],
      CHASE: [37.7680, -122.3877],
      CESAR_3RD: [37.7480, -122.3880],
      BERNAL: [37.7430, -122.4155],
      MISSION_24TH: [37.7524, -122.4184],
      DOLORES_PARK: [37.7596, -122.4269],
      MISSION_DOLORES: [37.7642, -122.4266],
      CHURCH_MKT: [37.7672, -122.4292],
      CASTRO: [37.7621, -122.4348],
      TWIN_PEAKS: [37.7544, -122.4477],
      SUTRO: [37.7552, -122.4528],
      PORTOLA_W: [37.7400, -122.4580]
    };
    var EDGES = [
      ["FERRY", "BROADWAY_EMB"], ["BROADWAY_EMB", "PIER39"], ["PIER39", "WHARF"],
      ["WHARF", "GHIRARDELLI"], ["GHIRARDELLI", "FORT_MASON"], ["FORT_MASON", "MARINA_FILL"],
      ["MARINA_FILL", "PALACE"], ["PALACE", "CRISSY"], ["CRISSY", "GGB_VISTA"],
      ["GGB_VISTA", "GGB_END"], ["GGB_VISTA", "PRESIDIO_MID"], ["PALACE", "PRESIDIO_MID"],
      ["PRESIDIO_MID", "BAKER_BEACH"], ["BAKER_BEACH", "SEACLIFF"], ["SEACLIFF", "LEGION"],
      ["LEGION", "CLIFF_HOUSE"], ["CLIFF_HOUSE", "OB_FULTON"], ["OB_FULTON", "OCEAN_BEACH"],
      ["OCEAN_BEACH", "GREAT_SLOAT"], ["GREAT_SLOAT", "LAKE_MERCED"], ["GREAT_SLOAT", "SUNSET_SLOAT"],
      ["SUNSET_SLOAT", "N19_NORIEGA"], ["N19_NORIEGA", "N19_LINCOLN"], ["N19_LINCOLN", "PARKPRES_FULTON"],
      ["PARKPRES_FULTON", "GEARY_PARKPRES"], ["GEARY_PARKPRES", "GGB_VISTA"],
      ["OB_FULTON", "PARKPRES_FULTON"], ["OCEAN_BEACH", "N19_LINCOLN"],
      ["PARKPRES_FULTON", "DEYOUNG"], ["DEYOUNG", "STANYAN"], ["STANYAN", "HAIGHT_ASH"],
      ["CLIFF_HOUSE", "GEARY_PARKPRES"], ["GEARY_PARKPRES", "GEARY_MASONIC"],
      ["GEARY_MASONIC", "GEARY_VANNESS"], ["GEARY_VANNESS", "UNION_SQ"],
      ["DIVIS_CHESTNUT", "MARINA_FILL"], ["DIVIS_CHESTNUT", "PAINTED"],
      ["PAINTED", "HAIGHT_ASH"], ["PAINTED", "CITY_HALL"],
      ["GEARY_VANNESS", "CITY_HALL"], ["CITY_HALL", "VANNESS_MKT"],
      ["VANNESS_MKT", "MKT_POWELL"], ["MKT_POWELL", "UNION_SQ"], ["MKT_POWELL", "MKT_MONTGOMERY"],
      ["UNION_SQ", "CHINATOWN"], ["CHINATOWN", "TRANSAM"], ["TRANSAM", "COLUMBUS_BWAY"],
      ["COLUMBUS_BWAY", "COIT"], ["COLUMBUS_BWAY", "WHARF"], ["COLUMBUS_BWAY", "LOMBARD_CRK"],
      ["LOMBARD_CRK", "GHIRARDELLI"], ["TRANSAM", "MKT_MONTGOMERY"], ["TRANSAM", "FERRY"],
      ["MKT_MONTGOMERY", "SALESFORCE"], ["SALESFORCE", "FERRY"], ["SALESFORCE", "ORACLE"],
      ["FERRY", "EMB_BRANNAN"], ["EMB_BRANNAN", "ORACLE"], ["ORACLE", "CHASE"],
      ["CHASE", "CESAR_3RD"], ["CESAR_3RD", "BERNAL"], ["BERNAL", "MISSION_24TH"],
      ["MISSION_24TH", "DOLORES_PARK"], ["DOLORES_PARK", "MISSION_DOLORES"],
      ["MISSION_DOLORES", "CHURCH_MKT"], ["CHURCH_MKT", "VANNESS_MKT"], ["CHURCH_MKT", "CASTRO"],
      ["CASTRO", "DOLORES_PARK"], ["CASTRO", "TWIN_PEAKS"], ["TWIN_PEAKS", "SUTRO"],
      ["TWIN_PEAKS", "PORTOLA_W"], ["PORTOLA_W", "SUNSET_SLOAT"], ["PORTOLA_W", "BERNAL"]
    ];
    var nodeLL = {};
    Object.keys(NODES).forEach(function (k) { nodeLL[k] = L.latLng(NODES[k][0], NODES[k][1]); });
    var adj = {};
    Object.keys(NODES).forEach(function (k) { adj[k] = []; });
    EDGES.forEach(function (e) {
      var d = nodeLL[e[0]].distanceTo(nodeLL[e[1]]);
      adj[e[0]].push({ to: e[1], d: d });
      adj[e[1]].push({ to: e[0], d: d });
    });
    function dijkstra(from, to) {
      var distv = {}, prev = {}, seen = {};
      Object.keys(NODES).forEach(function (k) { distv[k] = Infinity; });
      distv[from] = 0;
      for (;;) {
        var u = null, best = Infinity;
        Object.keys(distv).forEach(function (k) {
          if (!seen[k] && distv[k] < best) { best = distv[k]; u = k; }
        });
        if (u === null || u === to) break;
        seen[u] = true;
        adj[u].forEach(function (e) {
          var nd = distv[u] + e.d;
          if (nd < distv[e.to]) { distv[e.to] = nd; prev[e.to] = u; }
        });
      }
      if (distv[to] === Infinity) return [to];
      var chain = [to];
      while (chain[0] !== from) chain.unshift(prev[chain[0]]);
      return chain;
    }
    function nearestNode(ll) {
      var best = null, bd = Infinity;
      Object.keys(NODES).forEach(function (k) {
        var d = nodeLL[k].distanceTo(ll);
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }

    /* ---- landmarks: [name, lat, lng, major] — pod drives to the nearest street node ---- */
    var LANDMARKS = [
      ["the Golden Gate Bridge", 37.8117, -122.4772, 1],
      ["Alcatraz", 37.8267, -122.4230, 1],
      ["Fisherman's Wharf", 37.8080, -122.4177, 1],
      ["the Ferry Building", 37.7955, -122.3937, 1],
      ["Coit Tower", 37.8024, -122.4058, 1],
      ["the Palace of Fine Arts", 37.8029, -122.4484, 1],
      ["the Painted Ladies", 37.7763, -122.4327, 1],
      ["Oracle Park", 37.7786, -122.3893, 1],
      ["Twin Peaks", 37.7544, -122.4477, 1],
      ["Ocean Beach", 37.7640, -122.5088, 1],
      ["Golden Gate Park", 37.7715, -122.4687, 1],
      ["Dolores Park", 37.7596, -122.4269, 1],
      ["Ghirardelli Square", 37.8059, -122.4230, 0],
      ["Lombard Street", 37.8021, -122.4187, 0],
      ["Chinatown", 37.7908, -122.4056, 0],
      ["Union Square", 37.7880, -122.4074, 0],
      ["the Transamerica Pyramid", 37.7952, -122.4028, 0],
      ["Salesforce Tower", 37.7897, -122.3972, 0],
      ["City Hall", 37.7793, -122.4193, 0],
      ["Haight-Ashbury", 37.7692, -122.4463, 0],
      ["the Castro Theatre", 37.7621, -122.4348, 0],
      ["Mission Dolores", 37.7642, -122.4266, 0],
      ["Sutro Tower", 37.7552, -122.4528, 0],
      ["Chase Center", 37.7680, -122.3877, 0],
      ["the Legion of Honor", 37.7845, -122.5008, 0],
      ["Baker Beach", 37.7936, -122.4833, 0],
      ["the Cliff House", 37.7784, -122.5136, 0],
      ["Lake Merced", 37.7280, -122.4940, 0],
      ["the SF Zoo", 37.7325, -122.5039, 0],
      ["Crissy Field", 37.8039, -122.4640, 0],
      ["Bernal Heights", 37.7430, -122.4155, 0]
    ];
    var target = null, targetLm = null;
    var landmarks = LANDMARKS.map(function (l) {
      var ll = L.latLng(l[1], l[2]);
      var short = l[0].replace(/^the /, "");
      var icon = L.divIcon({
        className: "lm-marker-wrap",
        html: '<span class="lm-marker' + (l[3] ? "" : " lm-minor") + '" role="button" tabindex="0" aria-label="Send the pod to ' + esc(short) + '">' +
          '<span class="lmm-dot"></span><span class="lmm-txt">' + esc(short.toUpperCase()) + "</span></span>",
        iconSize: null,
        iconAnchor: [5, 5]
      });
      var marker = L.marker(ll, { icon: icon, keyboard: false }).addTo(map);
      return { name: l[0], ll: ll, marker: marker, node: nearestNode(ll) };
    });
    var allBounds = L.latLngBounds(Object.keys(NODES).map(function (k) { return nodeLL[k]; }));
    var cine = !captureMode && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    // start pulled back over the whole Bay; the intro flies in when the card scrolls into view
    map.fitBounds(allBounds, { padding: cine ? [130, 130] : [24, 24] });

    // labels for minor landmarks appear when zoomed in
    map.on("zoomend", function () {
      mapEl.classList.toggle("zoomed-in", map.getZoom() >= 13.5);
    });

    /* ---- the pod ---- */
    var carIcon = L.divIcon({
      className: "car-marker-wrap",
      html: '<span class="car-marker"><span class="cm-halo"></span><span class="cm-dot"></span></span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    var carPos = nodeLL.FERRY;
    var car = L.marker(carPos, { icon: carIcon, interactive: false, keyboard: false }).addTo(map);

    /* ---- the route: a faded trail already driven + a flowing dotted line ahead ---- */
    var routeBehind = L.polyline([], {
      className: "pod-route-behind", color: "#c8102e", weight: 2.5, opacity: 0.28,
      lineCap: "round", lineJoin: "round", interactive: false
    }).addTo(map);
    var routeAhead = L.polyline([], {
      className: "pod-route-ahead", color: "#c8102e", weight: 3, opacity: 0.95,
      dashArray: "0.1 11", lineCap: "round", lineJoin: "round", interactive: false
    }).addTo(map);

    // never mutate polyline geometry mid zoom/pan animation — that's what makes it
    // "fly all over"; freeze during animations, redraw once when they settle.
    var isAnimating = false;
    function redrawRoute() {
      if (isAnimating) return;
      if (!path.length || dist >= pathLen) { routeAhead.setLatLngs([]); routeBehind.setLatLngs([]); return; }
      var behind = [], ahead = [carPos];
      for (var i = 0; i < path.length; i++) {
        if (cum[i] <= dist) behind.push(path[i]);
        else ahead.push(path[i]);
      }
      behind.push(carPos);
      routeBehind.setLatLngs(behind.length > 1 ? behind : []);
      routeAhead.setLatLngs(ahead);
    }
    function clearRoute() { routeAhead.setLatLngs([]); routeBehind.setLatLngs([]); }
    map.on("zoomstart movestart", function () { isAnimating = true; });
    map.on("zoomend moveend", function () { isAnimating = false; redrawRoute(); });

    /* ---- FSD speed profiles (map m/s + the plausible mph shown in the hero) ---- */
    var PROFILES = {
      sloth: { cruise: 45, mph: [12, 18] },
      chill: { cruise: 75, mph: [19, 26] },
      standard: { cruise: 110, mph: [27, 35] },
      hurry: { cruise: 165, mph: [34, 43] },
      madmax: { cruise: 250, mph: [45, 58] }
    };
    var profile = "standard";
    var FAST_MULT = 3.8;    // reroute boost on top of the profile
    var GAME_SPEED_MULT = 4.5;  // the game runs brisk; ambient wander stays calm
    window.__speedRange = PROFILES[profile].mph;
    var fastMode = false;
    var parked = false;
    var follow = false;
    var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    var path = [], cum = [0], pathLen = 0, dist = 0, curSpd = 0;
    var dwellUntil = 0, passingUntil = 0;
    var lastUi = 0, lastRoute = 0, lastGameUi = 0, lastTick = performance.now();

    function setPath(latlngs) {
      path = latlngs; cum = [0];
      for (var i = 1; i < path.length; i++) cum.push(cum[i - 1] + path[i - 1].distanceTo(path[i]));
      pathLen = cum[cum.length - 1] || 0;
      dist = 0;
      redrawRoute();
    }
    function pointAt(d) {
      if (!path.length) return carPos;
      if (d <= 0) return path[0];
      if (d >= pathLen) return path[path.length - 1];
      var i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      var seg = cum[i] - cum[i - 1] || 1;
      var f = (d - cum[i - 1]) / seg;
      var a = path[i - 1], b = path[i];
      return L.latLng(a.lat + (b.lat - a.lat) * f, a.lng + (b.lng - a.lng) * f);
    }
    function planTripTo(lm, fast) {
      var startNode = nearestNode(carPos);
      var chain = dijkstra(startNode, lm.node);
      var pts = [carPos];
      chain.forEach(function (k) { pts.push(nodeLL[k]); });
      setPath(pts);
      target = lm; targetLm = fast ? lm : null;
      fastMode = fast;
    }
    function pickNextTrip() {
      var here = nearestNode(carPos);
      var options = landmarks.filter(function (lm) { return lm.node !== here; });
      var lm = options[Math.floor(Math.random() * options.length)];
      planTripTo(lm, false);
      if (passingEl) passingEl.innerHTML = "<b>EN ROUTE</b> · " + esc(lm.name.replace(/^the /, ""));
    }
    function goTo(lm) {
      landmarks.forEach(function (l) {
        var el = l.marker.getElement();
        if (el) el.classList.remove("lm-target");
      });
      var el = lm.marker.getElement();
      if (el) el.classList.add("lm-target");
      dwellUntil = 0;
      userTouched = true;
      setParked(false);
      // in the game the FSD profile IS the speed — no reroute boost
      planTripTo(lm, !gameOn);
      if (passingEl) {
        passingEl.innerHTML = gameOn
          ? "<b>DISPATCHED</b> · " + esc(lm.name.replace(/^the /, ""))
          : "<b>REROUTING</b> · to " + esc(lm.name);
      }
    }
    landmarks.forEach(function (lm) {
      lm.marker.on("click", function () { goTo(lm); });
      lm.marker.on("keypress", function (e) {
        var k = e.originalEvent && e.originalEvent.key;
        if (k === "Enter" || k === " ") goTo(lm);
      });
    });

    /* ---- the control deck ---- */
    function nearestLmName(ll, radius) {
      var best = null, bd = Infinity;
      landmarks.forEach(function (lm) {
        var d = lm.ll.distanceTo(ll);
        if (d < bd) { bd = d; best = lm; }
      });
      return best && bd < (radius || 700) ? best.name.replace(/^the /, "") : null;
    }
    function setParked(on) {
      parked = on;
      var btn = document.getElementById("ctlPark");
      if (btn) {
        btn.textContent = on ? "Resume" : "Park";
        btn.classList.toggle("on", on);
      }
      if (on) {
        clearRoute();
        path = []; pathLen = 0; dist = 0;
        target = null; targetLm = null;
        var at = nearestLmName(carPos, 900);
        if (passingEl) passingEl.innerHTML = "<b>PARKED</b> · " + esc(at || "roadside, San Francisco");
      } else if (passingEl && !target) {
        dwellUntil = 0;
      }
    }
    var segEl = document.getElementById("speedSeg");
    if (segEl) {
      segEl.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-speed]");
        if (!btn) return;
        profile = btn.getAttribute("data-speed");
        window.__speedRange = PROFILES[profile].mph;
        segEl.querySelectorAll("button").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on);
        });
      });
    }
    var studioBtn = document.getElementById("ctlStudio");
    if (studioBtn) {
      studioBtn.addEventListener("click", function () {
        var on = !studioBtn.classList.contains("on");
        studioBtn.classList.toggle("on", on);
        studioBtn.setAttribute("aria-pressed", on);
        var cabin = document.getElementById("cabinVal");
        if (cabin) {
          cabin.textContent = on ? "RECORDING" : "STANDBY";
          cabin.classList.toggle("tel-ok", on);
        }
      });
    }
    var followBtn = document.getElementById("ctlFollow");
    function setFollow(on) {
      follow = on;
      if (followBtn) {
        followBtn.classList.toggle("on", on);
        followBtn.setAttribute("aria-pressed", on);
      }
      if (on) map.panTo(carPos);
    }
    if (followBtn) followBtn.addEventListener("click", function () { setFollow(!follow); });
    map.on("dragstart", function () { if (follow) setFollow(false); });
    var parkBtn = document.getElementById("ctlPark");
    if (parkBtn) parkBtn.addEventListener("click", function () { if (!gameOn) setParked(!parked); });
    var shuffleBtn = document.getElementById("ctlShuffle");
    if (shuffleBtn) shuffleBtn.addEventListener("click", function () {
      if (gameOn) return;
      setParked(false);
      dwellUntil = 0;
      target = null; targetLm = null;
      pickNextTrip();
    });
    var recenterBtn = document.getElementById("ctlRecenter");
    if (recenterBtn) recenterBtn.addEventListener("click", function () {
      setFollow(false);
      map.fitBounds(allBounds, { padding: [24, 24] });
    });

    // maximize: the card takes over the viewport, Esc exits
    var maxBtn = document.getElementById("ctlMax");
    var cardEl = document.getElementById("about");
    function setFull(on) {
      if (!cardEl) return;
      cardEl.classList.toggle("is-full", on);
      document.body.classList.toggle("map-full", on);
      if (maxBtn) {
        maxBtn.setAttribute("aria-label", on ? "Exit fullscreen" : "Maximize map");
        maxBtn.title = on ? "Exit fullscreen (Esc)" : "Maximize";
      }
      setTimeout(function () {
        map.invalidateSize();
        map.fitBounds(allBounds, { padding: on ? [46, 46] : [24, 24] });
      }, 80);
    }
    if (maxBtn) maxBtn.addEventListener("click", function () {
      setFull(!cardEl.classList.contains("is-full"));
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("map-full")) setFull(false);
    });

    /* ---- cinematic camera: intro fly-in on first view, glances on arrivals ---- */
    var userTouched = false, introRan = false;
    map.on("dragstart", function () { userTouched = true; });
    var zoomCtl = mapEl.querySelector(".leaflet-control-zoom");
    if (zoomCtl) zoomCtl.addEventListener("click", function () { userTouched = true; });
    function runIntro() {
      if (!cine || userTouched) return;
      setTimeout(function () {
        if (userTouched) return;
        map.flyTo(carPos, 13.6, { duration: 2.6 });
      }, 450);
      setTimeout(function () {
        if (userTouched) return;
        map.flyToBounds(allBounds, { padding: [24, 24], duration: 2.4 });
      }, 5400);
    }
    if (cine) {
      var introIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !introRan) {
          introRan = true;
          runIntro();
          introIO.disconnect();
        }
      }, { threshold: 0.35 });
      introIO.observe(mapEl);
    }

    /* ---- remote hooks for the Tesla screen's Pod app ---- */
    window.__podCam = {
      locate: function () {
        userTouched = true;
        setFollow(true);
        map.flyTo(carPos, 14, { duration: 1.6 });
      },
      shuffle: function () {
        if (gameOn) return;
        setParked(false);
        dwellUntil = 0;
        target = null; targetLm = null;
        pickNextTrip();
      }
    };
    var gearEls = document.querySelectorAll("#tsGears span");
    function setGear(g) {
      gearEls.forEach(function (s) { s.classList.toggle("on", s.textContent === g); });
    }

    /* ============ PICKUP RUN — the game ============
       Founders request rides at landmarks. Click landmarks to dispatch the pod:
       pick them up, drop them off, beat the clock. FSD profile = speed vs battery. */
    var gameOn = false, gScore = 0, gStreak = 0, gBatt = 100, gEndAt = 0;
    var gFare = null, gFareStart = 0, gDelivered = 0;
    var GAME_MS = 180000;
    // % battery per km — slow profiles are sustainable, fast ones burn out over a run
    var DRAIN = { sloth: 0.9, chill: 1.4, standard: 2.1, hurry: 3.1, madmax: 4.3 };
    var GUESTS = (typeof people !== "undefined" ? people : [])
      .filter(function (p) { return !p.isHost; })
      .map(function (p) { return p.name; });
    if (!GUESTS.length) GUESTS = ["A founder"];

    var ghScore = document.getElementById("ghScore"), ghTime = document.getElementById("ghTime");
    var ghBatt = document.getElementById("ghBatt"), ghStreak = document.getElementById("ghStreak");
    var ghFare = document.getElementById("ghFare"), hudEl = document.getElementById("gameHud");
    var overEl = document.getElementById("gameOver");
    var gameBtn = document.getElementById("ctlGame");

    function lmShort(lm) { return lm.name.replace(/^the /, ""); }
    function fmtClock(ms) {
      var s = Math.max(0, Math.ceil(ms / 1000));
      return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
    }
    function tipMult() { return 1 + Math.min(gStreak, 8) * 0.25; }
    function clearFareMarks() {
      landmarks.forEach(function (l) {
        var el = l.marker.getElement();
        if (el) el.classList.remove("lm-fare", "lm-dest");
      });
    }
    function markFare() {
      clearFareMarks();
      if (!gFare) return;
      var lm = gFare.stage === "pickup" ? gFare.from : gFare.to;
      var el = lm.marker.getElement();
      if (el) el.classList.add(gFare.stage === "pickup" ? "lm-fare" : "lm-dest");
    }
    function spawnFare(now) {
      var hereNode = nearestNode(carPos);
      var froms = landmarks.filter(function (l) { return l.node !== hereNode; });
      var from = froms[Math.floor(Math.random() * froms.length)];
      var tos = landmarks.filter(function (l) { return l !== from && l.node !== from.node; });
      var to = tos[Math.floor(Math.random() * tos.length)];
      gFare = {
        guest: GUESTS[Math.floor(Math.random() * GUESTS.length)],
        from: from, to: to, stage: "pickup"
      };
      gFareStart = now;
      markFare();
      if (ghFare) ghFare.innerHTML = "<b>" + esc(gFare.guest) + "</b> wants on the show — board them at <b>" + esc(lmShort(from)) + "</b> (green)";
    }
    function updateHud(now) {
      if (ghScore) ghScore.textContent = gScore;
      if (ghStreak) ghStreak.textContent = "×" + String(tipMult()).replace(/(\.\d\d)\d+$/, "$1");
      if (ghBatt) {
        ghBatt.textContent = Math.max(0, Math.round(gBatt)) + "%";
        ghBatt.classList.toggle("crit", gBatt < 22);
      }
      if (ghTime) {
        var left = gEndAt - now;
        ghTime.textContent = fmtClock(left);
        ghTime.classList.toggle("crit", left < 30000);
      }
    }
    function gameArrival(lm, now) {
      if (!gFare) return;
      if (gFare.stage === "pickup" && lm === gFare.from) {
        gFare.stage = "drop";
        gFareStart = now;
        markFare();
        if (ghFare) ghFare.innerHTML = "Recording with <b>" + esc(gFare.guest) + "</b> — wrap the episode at <b>" + esc(lmShort(gFare.to)) + "</b> (red)";
      } else if (gFare.stage === "drop" && lm === gFare.to) {
        var secs = (now - gFareStart) / 1000;
        var km = gFare.from.ll.distanceTo(gFare.to.ll) / 1000;
        var base = Math.round(km * 55);
        var tip = Math.max(0, Math.round(300 - secs * 6));
        var pts = Math.round((base + tip) * tipMult());
        gScore += pts;
        gDelivered++;
        gStreak = tip > 60 ? gStreak + 1 : 0;
        gBatt = Math.min(100, gBatt + 10);
        if (ghFare) ghFare.innerHTML = "<b>" + esc(gFare.guest) + "</b>'s episode wrapped · +" + pts + " pts" + (tip > 60 ? " · streak up" : " · slow record, streak reset");
        gFare = null;
        clearFareMarks();
        setTimeout(function () { if (gameOn && !gFare) spawnFare(performance.now()); }, 1200);
      } else {
        var want = gFare.stage === "pickup" ? gFare.from : gFare.to;
        var verb = gFare.stage === "pickup" ? "board them" : "wrap the episode";
        if (ghFare) ghFare.innerHTML = "Wrong stop — " + verb + " at <b>" + esc(lmShort(want)) + "</b>";
      }
      updateHud(now);
    }
    function startGame() {
      if (gameOn || reduced) return;
      gameOn = true;
      gScore = 0; gStreak = 0; gBatt = 100; gDelivered = 0; gFare = null;
      userTouched = true;
      setFollow(false);
      setParked(false);
      target = null; targetLm = null;
      path = []; pathLen = 0; dist = 0; curSpd = 0;
      dwellUntil = 0;
      clearRoute(); clearFareMarks();
      gEndAt = performance.now() + GAME_MS;
      if (hudEl) hudEl.hidden = false;
      if (overEl) overEl.hidden = true;
      if (mapEl.parentElement) mapEl.parentElement.classList.add("playing");
      if (gameBtn) { gameBtn.textContent = "End Run"; gameBtn.classList.add("on"); }
      if (passingEl) passingEl.innerHTML = "<b>PICKUP RUN</b> · click landmarks to dispatch the pod";
      map.fitBounds(allBounds, { padding: [24, 24] });
      spawnFare(performance.now());
      updateHud(performance.now());
    }
    function endGame(reason) {
      if (!gameOn) return;
      gameOn = false;
      gFare = null;
      clearFareMarks();
      if (hudEl) hudEl.hidden = true;
      if (mapEl.parentElement) mapEl.parentElement.classList.remove("playing");
      if (gameBtn) { gameBtn.textContent = "▶ Pickup Run"; gameBtn.classList.remove("on"); }
      var best = 0;
      try { best = +localStorage.getItem("tp-best") || 0; } catch (e) {}
      var isBest = gScore > best;
      if (isBest) { best = gScore; try { localStorage.setItem("tp-best", String(best)); } catch (e) {} }
      var rank = gScore < 800 ? "Sunday Cruiser"
        : gScore < 2000 ? "City Chauffeur"
        : gScore < 3800 ? "FSD Operator"
        : gScore < 6000 ? "Route Legend" : "Mad Max Dispatcher";
      var reasonTxt = reason === "battery" ? "Battery dead" : reason === "time" ? "Time's up" : "Run ended";
      var goReason = document.getElementById("goReason"), goScore = document.getElementById("goScore");
      var goMeta = document.getElementById("goMeta"), goRank = document.getElementById("goRank");
      if (goReason) goReason.textContent = reasonTxt;
      if (goScore) goScore.textContent = gScore;
      if (goMeta) goMeta.textContent = gDelivered + (gDelivered === 1 ? " founder booked" : " founders booked") + " · best " + best + (isBest ? " — new record!" : "");
      if (goRank) goRank.textContent = "“" + rank + "”";
      if (overEl) overEl.hidden = false;
      if (passingEl) passingEl.innerHTML = "<b>CRUISING</b> · San Francisco";
      // the pod quietly resumes its wander behind the scorecard
      target = null; path = []; pathLen = 0; dist = 0;
      dwellUntil = performance.now() + 2500;
    }
    if (gameBtn) gameBtn.addEventListener("click", function () {
      if (gameOn) endGame("ended"); else startGame();
    });
    var goAgain = document.getElementById("goAgain"), goExit = document.getElementById("goExit"), goSeat = document.getElementById("goSeat");
    if (goAgain) goAgain.addEventListener("click", function () { if (overEl) overEl.hidden = true; startGame(); });
    if (goExit) goExit.addEventListener("click", function () { if (overEl) overEl.hidden = true; });
    if (goSeat) goSeat.addEventListener("click", function () {
      if (overEl) overEl.hidden = true;
      var mic = document.querySelector('.ts-dock-icon[data-app="boarding"]');
      if (mic) mic.click();
      var screen = document.querySelector(".tesla-screen");
      if (screen) screen.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.__startPodGame = startGame;

    function fmtGeo(ll) {
      return ll.lat.toFixed(4) + "° N · " + Math.abs(ll.lng).toFixed(4) + "° W";
    }
    var hovering = false;
    map.on("mousemove", function (e) {
      hovering = true;
      if (cursorEl) cursorEl.textContent = fmtGeo(e.latlng);
    });
    map.on("mouseout", function () { hovering = false; });

    function tick() {
      var now = performance.now();
      var dt = Math.min(now - lastTick, 1000);
      lastTick = now;

      if (parked) {
        // pulled over — waiting for Resume
      } else if (now < dwellUntil) {
        // dwelling at a landmark
      } else if (!path.length || dist >= pathLen) {
        if (target) {
          // arrival
          var arrived = target;
          carPos = path.length ? path[path.length - 1] : carPos;
          car.setLatLng(carPos);
          clearRoute();
          var lmEl = arrived.marker.getElement();
          if (lmEl) {
            (function (el) { setTimeout(function () { el.classList.remove("lm-target"); }, 2600); })(lmEl);
          }
          target = null; targetLm = null;
          path = []; pathLen = 0; dist = 0;
          curSpd = 0;
          if (gameOn) {
            dwellUntil = now + 650;
            gameArrival(arrived, now);
          } else {
            var name = arrived.name.replace(/^the /, "");
            if (passingEl) passingEl.innerHTML = "<b>ARRIVED</b> · " + esc(name);
            dwellUntil = now + 3500;
            // camera glance at the arrival if the visitor hasn't taken the wheel
            if (introRan && !userTouched && !follow) map.panTo(carPos, { duration: 1.2 });
          }
        } else if (!gameOn) {
          pickNextTrip();
        }
      } else {
        // driving physics: accelerate toward the profile speed, brake into stops
        var cruise = PROFILES[profile].cruise * (gameOn ? GAME_SPEED_MULT : 1);
        var targetSpd = cruise * (fastMode ? FAST_MULT : 1);
        var remaining = pathLen - dist;
        var brakeCap = Math.max(10, remaining / 2.2);   // slow smoothly into the stop
        if (brakeCap < targetSpd) targetSpd = brakeCap;
        var accel = cruise * (fastMode ? 2.2 : 1.1); // m/s per s
        if (curSpd < targetSpd) curSpd = Math.min(targetSpd, curSpd + accel * dt / 1000);
        else curSpd = Math.max(targetSpd, curSpd - accel * 2 * dt / 1000);
        var step = curSpd / 1000 * dt;
        dist += step;
        carPos = pointAt(dist);
        car.setLatLng(carPos);
        // keep the trail tracking the pod, but never during a zoom/pan animation
        if (now - lastRoute > 200) { lastRoute = now; redrawRoute(); }
        // game: driving drains the battery, faster profiles drain much faster
        if (gameOn) {
          gBatt -= (step / 1000) * DRAIN[profile];
          if (gBatt <= 0) { gBatt = 0; endGame("battery"); }
        }
      }

      if (gameOn) {
        if (now >= gEndAt) endGame("time");
        else if (now - lastGameUi > 300) { lastGameUi = now; updateHud(now); }
      }

      if (now - lastUi > 1200) {
        lastUi = now;
        var txt = fmtGeo(carPos);
        if (coordEl) coordEl.textContent = txt;
        if (cursorEl && !hovering) cursorEl.textContent = txt;
        if (follow && !parked) map.panTo(carPos);
        // publish state for the Tesla screen's Pod app + sync the PRND bar
        window.__podState = {
          status: passingEl ? passingEl.textContent : "",
          coords: txt,
          profile: profile === "madmax" ? "Mad Max" : profile.charAt(0).toUpperCase() + profile.slice(1),
          parked: parked || now < dwellUntil || !path.length
        };
        setGear(parked || now < dwellUntil || !path.length || dist >= pathLen ? "P" : "D");
        // passing note when cruising by a landmark that isn't the destination
        if (!gameOn && path.length && dist < pathLen) {
          if (target && !fastMode && now > passingUntil) {
            for (var j = 0; j < landmarks.length; j++) {
              var lm = landmarks[j];
              if (lm !== target && lm.ll.distanceTo(carPos) < 420) {
                if (passingEl) passingEl.innerHTML = "<b>NOW PASSING</b> · " + esc(lm.name.replace(/^the /, ""));
                passingUntil = now + 4000;
                setTimeout(function () {
                  if (target && passingEl && performance.now() >= passingUntil - 50) {
                    passingEl.innerHTML = "<b>EN ROUTE</b> · " + esc(target.name.replace(/^the /, ""));
                  }
                }, 4000);
                break;
              }
            }
          }
        }
      }
    }

    if (coordEl) coordEl.textContent = fmtGeo(carPos);
    if (cursorEl) cursorEl.textContent = fmtGeo(carPos);
    if (reduced) {
      if (passingEl) passingEl.innerHTML = "<b>PARKED</b> · the Ferry Building";
      return;
    }
    pickNextTrip();
    // interval instead of rAF so the car keeps driving in background tabs too
    setInterval(tick, 33);

    // Leaflet needs a size recalc once the reveal animation settles
    setTimeout(function () { map.invalidateSize(); }, 900);
  })();

  /* ---------- marquee duplication ---------- */
  var track = $("#marqueeTrack");
  track.innerHTML += track.innerHTML;

  /* ---------- modal player with prev/next navigation ---------- */
  var modal = $("#modal"), modalVideo = $("#modalVideo"), modalMeta = $("#modalMeta");
  var modalIndex = -1;
  function openEpisode(ep) {
    modalIndex = episodes.findIndex(function (e) { return e.id === ep.id; });
    var prev = episodes[modalIndex + 1]; // older ride
    var next = episodes[modalIndex - 1]; // newer ride
    modalVideo.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + esc(ep.id) + '?autoplay=1&rel=0" ' +
      'title="' + esc(ep.fullTitle) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    modalMeta.innerHTML =
      '<div class="ep-meta"><span class="ep-chip hot">' + esc(epNum(ep)) + "</span>" +
      '<span class="ep-chip">' + esc(ep.releaseDate) + "</span>" +
      '<span class="ep-chip">' + esc(ep.duration) + "</span></div>" +
      "<h3>" + esc(ep.fullTitle) + "</h3>" +
      '<p class="ep-desc">' + esc(ep.description) + "</p>" +
      '<div class="modal-links"><div class="ep-guest">with <b>' + esc(ep.guest) + "</b> · " + esc(ep.guestRole) + "</div>" +
      '<a class="modal-yt" href="https://www.youtube.com/watch?v=' + esc(ep.id) + '" target="_blank" rel="noopener">Open on YouTube ↗</a></div>' +
      '<div class="modal-nav">' +
      '<button type="button" id="modalPrev" ' + (prev ? "" : "disabled") + ">← " + (prev ? esc(epNum(prev)) + " · " + esc(prev.title) : "First ride") + "</button>" +
      '<span class="mn-hint">← → to browse</span>' +
      '<button type="button" id="modalNext" ' + (next ? "" : "disabled") + ">" + (next ? esc(epNum(next)) + " · " + esc(next.title) : "Latest ride") + " →</button>" +
      "</div>";
    if (prev) $("#modalPrev").onclick = function () { openEpisode(prev); };
    if (next) $("#modalNext").onclick = function () { openEpisode(next); };
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    modalVideo.innerHTML = "";
    modalIndex = -1;
    document.body.style.overflow = "";
  }
  modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft" && episodes[modalIndex + 1]) openEpisode(episodes[modalIndex + 1]);
    if (e.key === "ArrowRight" && modalIndex > 0) openEpisode(episodes[modalIndex - 1]);
  });

  /* ---------- render: hero ---------- */
  // ambient background video (muted loop of the latest ride) — dark theme only,
  // so the light theme stays clean and we never load a hidden iframe
  function renderHeroVideo() {
    var wrap = $("#heroVideoWrap");
    if (root.getAttribute("data-theme") !== "dark") { wrap.innerHTML = ""; return; }
    var latest = episodes[0];
    if (wrap.getAttribute("data-vid") === latest.id) return;
    wrap.setAttribute("data-vid", latest.id);
    wrap.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + esc(latest.id) +
      "?autoplay=1&mute=1&controls=0&loop=1&playlist=" + esc(latest.id) +
      '&showinfo=0&rel=0&modestbranding=1" title="" tabindex="-1" aria-hidden="true" ' +
      'allow="autoplay; encrypted-media"></iframe>';
  }

  function renderHero() {
    var latest = episodes[0];
    renderHeroVideo();

    var card = $("#latestCard");
    var upNextRows = episodes.slice(1, 3).map(function (ep) {
      return '<div class="up-next-row" role="button" tabindex="0" data-ep="' + esc(ep.id) + '" aria-label="Play ' + esc(ep.fullTitle) + '">' +
        '<img loading="lazy" src="' + esc(ep.thumb) + '" alt="" ' +
        "onerror=\"this.src='https://img.youtube.com/vi/" + esc(ep.id) + "/hqdefault.jpg'\" />" +
        '<div class="un-body"><div class="un-meta">' + esc(epNum(ep)) + " · " + esc(ep.duration) + '</div>' +
        '<div class="un-title">' + esc(ep.title) + "</div></div>" +
        '<span class="un-go" aria-hidden="true">→</span>' +
        "</div>";
    }).join("");
    card.innerHTML =
      '<div class="latest-thumb" role="button" tabindex="0" aria-label="Play latest episode">' +
      '<img src="' + esc(latest.thumb) + '" alt="' + esc(latest.fullTitle) + '" ' +
      "onerror=\"this.src='https://img.youtube.com/vi/" + esc(latest.id) + "/hqdefault.jpg'\" />" +
      '<span class="dur">' + esc(latest.duration) + "</span>" +
      '<div class="play-badge"><span><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>' +
      "</div>" +
      '<div class="latest-body">' +
      '<p class="latest-tag">Latest Ride · ' + esc(latest.releaseDate) + "</p>" +
      "<h3>" + esc(latest.fullTitle) + "</h3>" +
      "<p>with " + esc(latest.guest) + " — " + esc(latest.guestRole) + "</p>" +
      "</div>" +
      (upNextRows ? '<div class="up-next"><div class="up-next-label">Up next</div>' + upNextRows + "</div>" : "");
    var thumb = $(".latest-thumb", card);
    thumb.addEventListener("click", function () { openEpisode(latest); });
    thumb.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEpisode(latest); } });
    card.querySelectorAll(".up-next-row").forEach(function (row) {
      var ep = episodes.find(function (e) { return e.id === row.getAttribute("data-ep"); });
      row.addEventListener("click", function () { openEpisode(ep); });
      row.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEpisode(ep); } });
    });
    $("#watchLatestBtn").onclick = function () { openEpisode(latest); };

    // show stats under the CTAs
    var totalMin = Math.round(episodes.reduce(function (s, e) {
      var p = (e.duration || "0:0").split(":").map(Number);
      return s + (p.length === 3 ? p[0] * 60 + p[1] + p[2] / 60 : p[0] + (p[1] || 0) / 60);
    }, 0));
    var hours = (totalMin / 60).toFixed(1).replace(/\.0$/, "");
    $("#heroMeta").innerHTML =
      "<span><b>" + episodes.length + "</b> rides logged</span><i>/</i>" +
      "<span><b>" + hours + " hrs</b> of unfiltered conversation</span><i>/</i>" +
      "<span>zero interventions</span>";
  }

  /* ---------- render: episodes ---------- */
  function renderEpisodes() {
    var latest = episodes[0];
    $("#episodeFeatured").innerHTML = "";
    $("#episodeFeatured").appendChild(el(
      '<article class="feat-card" tabindex="0" aria-label="Play ' + esc(latest.fullTitle) + '">' +
      '<div class="feat-thumb"><img src="' + esc(latest.thumb) + '" alt="" ' +
      "onerror=\"this.src='https://img.youtube.com/vi/" + esc(latest.id) + "/hqdefault.jpg'\" /></div>" +
      '<div class="feat-body">' +
      '<div class="ep-meta"><span class="ep-chip hot">Latest · ' + esc(epNum(latest)) + "</span>" +
      '<span class="ep-chip">' + esc(latest.releaseDate) + '</span><span class="ep-chip">' + esc(latest.duration) + "</span></div>" +
      "<h3>" + esc(latest.title) + "</h3>" +
      '<p class="ep-desc">' + esc(latest.description) + "</p>" +
      '<div class="ep-guest">with <b>' + esc(latest.guest) + "</b> · " + esc(latest.guestRole) + "</div>" +
      "</div></article>"
    ));
    $(".feat-card").addEventListener("click", function () { openEpisode(latest); });

    var grid = $("#episodeGrid");
    grid.innerHTML = "";
    episodes.slice(1).forEach(function (ep, i) {
      var card = el(
        '<article class="ep-card reveal" style="transition-delay:' + (i % 3) * 70 + 'ms" tabindex="0" aria-label="Play ' + esc(ep.fullTitle) + '">' +
        '<div class="ep-thumb">' +
        '<img loading="lazy" src="' + esc(ep.thumb) + '" alt="" ' +
        "onerror=\"this.src='https://img.youtube.com/vi/" + esc(ep.id) + "/hqdefault.jpg'\" />" +
        '<span class="dur">' + esc(ep.duration) + "</span>" +
        '<div class="play-hover"><span><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>' +
        "</div>" +
        '<div class="ep-body">' +
        '<span class="ep-num">' + esc(epNum(ep)) + " · " + esc(ep.releaseDate) + "</span>" +
        "<h3>" + esc(ep.title) + "</h3>" +
        '<div class="ep-guest">with <b>' + esc(ep.guest) + "</b></div>" +
        "</div></article>"
      );
      function go() { openEpisode(ep); }
      card.addEventListener("click", go);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      grid.appendChild(card);
    });
    observeReveals(grid);
  }

  /* ---------- render: passengers ---------- */
  function renderPeople() {
    var host = people.find(function (p) { return p.isHost; });
    $("#hostCard").innerHTML =
      '<div class="host-photo"><img src="' + esc(host.photo) + '" alt="' + esc(host.name) + '" /></div>' +
      '<div class="host-body">' +
      '<span class="host-label">The Host</span>' +
      "<h3>" + esc(host.name) + "</h3>" +
      '<p class="host-role">' + esc(host.role) + " · " + esc(host.company) + "</p>" +
      '<p class="host-bio">No studio. No steering wheel. Irosha rides Tesla FSD through San Francisco with the founders building the autonomous future — and asks the questions that only get answered when nobody’s watching the road.</p>' +
      '<a class="modal-yt host-sub" href="https://www.youtube.com/@TeslaPod?sub_confirmation=1" target="_blank" rel="noopener">Subscribe on YouTube ↗</a>' +
      "</div>";

    var grid = $("#peopleGrid");
    grid.innerHTML = "";
    people.filter(function (p) { return !p.isHost; }).forEach(function (p, i) {
      var ep = episodes.find(function (e) { return e.id === p.episodeId; });
      var photo = p.photo
        ? '<img loading="lazy" src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" />'
        : '<div class="person-initials" aria-hidden="true">' + esc(initials(p.name)) + "</div>";
      var card = el(
        '<article class="person-card reveal" style="transition-delay:' + (i % 4) * 60 + 'ms" tabindex="0" aria-label="' + esc(p.name) + (ep ? " — play their episode" : "") + '">' +
        '<div class="person-photo">' + photo + "</div>" +
        (ep ? '<span class="person-play">▶ ' + esc(epNum(ep)) + "</span>" : "") +
        '<div class="person-body"><h3>' + esc(p.name) + "</h3><p>" + esc(p.role) + " · " + esc(p.company) + "</p></div>" +
        "</article>"
      );
      if (ep) {
        card.addEventListener("click", function () { openEpisode(ep); });
        card.addEventListener("keydown", function (e) { if (e.key === "Enter") openEpisode(ep); });
      }
      grid.appendChild(card);
    });
    observeReveals(grid);
  }

  /* ---------- live YouTube sync (/api/episodes) ---------- */
  function liveSync() {
    fetch("/api/episodes")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        if (!data || !data.episodes || !data.episodes.length) return;
        var known = {};
        episodes.forEach(function (e) { known[e.id] = true; });
        var maxNum = episodes.reduce(function (m, e) { return Math.max(m, e.num); }, 0);
        var fresh = [];
        data.episodes.forEach(function (e) {
          if (known[e.videoId]) return;
          fresh.push({
            id: e.videoId,
            num: ++maxNum,
            title: (e.title || "").split(" | ")[0],
            fullTitle: e.title || "",
            guest: e.guest || "Special Guest",
            guestRole: e.guestRole || "Featured Guest",
            duration: e.duration || "",
            releaseDate: e.releaseDate || "",
            thumb: "https://img.youtube.com/vi/" + e.videoId + "/maxresdefault.jpg",
            description: (e.description || "").split("\n")[0]
          });
        });
        if (!fresh.length) return;
        // newest first
        episodes = fresh.reverse().concat(episodes);
        renderHero();
        renderEpisodes();
      })
      .catch(function () { /* offline or static deploy — baked data already rendered */ });
  }

  /* ---------- Tesla-screen apps (the dock works) ---------- */
  (function tsApps() {
    var screen = document.querySelector(".tesla-screen");
    if (!screen) return;

    // dock: switch apps
    var dockBtns = screen.querySelectorAll(".ts-dock-icon");
    var apps = screen.querySelectorAll(".ts-app");
    dockBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-app");
        dockBtns.forEach(function (b) { b.classList.toggle("ts-active", b === btn); });
        apps.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-app") === name); });
      });
    });

    // climate: temp + fan
    var temp = 68;
    var tempBig = document.getElementById("tsTempBig");
    var tempBar = document.getElementById("tsTemp");
    function setTemp(t) {
      temp = Math.max(58, Math.min(82, t));
      if (tempBig) tempBig.textContent = temp + "°";
      if (tempBar) tempBar.textContent = temp + "°F";
    }
    var tUp = document.getElementById("tsTempUp"), tDown = document.getElementById("tsTempDown");
    if (tUp) tUp.addEventListener("click", function () { setTemp(temp + 1); });
    if (tDown) tDown.addEventListener("click", function () { setTemp(temp - 1); });
    var fan = document.getElementById("tsFan");
    if (fan) fan.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var btns = [].slice.call(fan.children);
      var idx = btns.indexOf(b);
      btns.forEach(function (x, i) { x.classList.toggle("on", i <= idx); });
    });

    // on air: latest episode, playable
    var np = document.getElementById("tsNowPlaying");
    if (np && episodes.length) {
      var latest = episodes[0];
      np.innerHTML =
        '<div class="ts-np-cover"><img src="' + esc(latest.thumb) + '" alt="" ' +
        "onerror=\"this.src='https://img.youtube.com/vi/" + esc(latest.id) + "/hqdefault.jpg'\" /></div>" +
        '<div><div class="ts-np-meta">' + esc(epNum(latest)) + " · " + esc(latest.duration) + " · " + esc(latest.releaseDate) + "</div>" +
        '<div class="ts-np-title">' + esc(latest.fullTitle) + "</div></div>" +
        '<div class="ts-np-actions">' +
        '<button type="button" class="ts-chip" id="tsPlayLatest">▶ Play episode</button>' +
        '<a class="ts-chip" href="https://www.youtube.com/@TeslaPod" target="_blank" rel="noopener">Open channel ↗</a>' +
        "</div>";
      var playBtn = document.getElementById("tsPlayLatest");
      if (playBtn) playBtn.addEventListener("click", function () { openEpisode(episodes[0]); });
    }

    // settings: explicit theme set
    var themeSeg = document.getElementById("tsThemeSeg");
    if (themeSeg) {
      themeSeg.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-theme-set]");
        if (b) applyTheme(b.getAttribute("data-theme-set"));
      });
      themeSeg.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-theme-set") === root.getAttribute("data-theme"));
      });
    }

    // the pod: live telemetry mirror + remote actions
    var sEl = document.getElementById("tscStatus"), cEl = document.getElementById("tscCoords");
    var pEl = document.getElementById("tscProfile"), vEl = document.getElementById("tscSpeed");
    setInterval(function () {
      var st = window.__podState;
      if (!st) return;
      if (sEl) sEl.textContent = st.status || "—";
      if (cEl) cEl.textContent = st.coords || "—";
      if (pEl) pEl.textContent = st.profile || "—";
      if (vEl) {
        var mph = document.getElementById("speedVal");
        vEl.textContent = st.parked ? "0 mph" : (mph ? mph.textContent + " mph" : "—");
      }
    }, 1000);
    var locBtn = document.getElementById("tscLocate"), sumBtn = document.getElementById("tscSummon");
    if (locBtn) locBtn.addEventListener("click", function () {
      if (window.__podCam) window.__podCam.locate();
      document.getElementById("about").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    if (sumBtn) sumBtn.addEventListener("click", function () {
      if (window.__podCam) window.__podCam.shuffle();
    });
  })();

  /* ---------- Tesla-screen clock (SF time) ---------- */
  (function tsClock() {
    var elc = document.getElementById("tsClock");
    if (!elc) return;
    function set() {
      try {
        elc.textContent = new Date().toLocaleTimeString("en-US", {
          hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles"
        });
      } catch (e) {
        elc.textContent = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      }
    }
    set();
    setInterval(set, 20000);
  })();

  /* ---------- hero hook → jump into Pickup Run ---------- */
  var gameHook = document.getElementById("heroGameHook");
  if (gameHook) gameHook.addEventListener("click", function () {
    // the anchor handles the scroll; start the run once we've arrived
    setTimeout(function () {
      if (window.__startPodGame) window.__startPodGame();
    }, 900);
  });

  /* ---------- guest form: inline submit, no redirect ---------- */
  var guestForm = $("#guestForm");
  guestForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = $("#formSubmitBtn");
    var oldError = guestForm.querySelector(".form-error");
    if (oldError) oldError.remove();
    guestForm.classList.add("sending");
    btn.textContent = "Sending…";
    var payload = {
      name: $("#f-name").value,
      email: $("#f-email").value,
      link: $("#f-link").value,
      pitch: $("#f-pitch").value,
      _subject: "Tesla Pod — Guest Pitch"
    };
    fetch("https://formsubmit.co/ajax/irosha@marketrix.ai", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () {
        guestForm.innerHTML =
          '<div class="form-success">' +
          '<span class="fs-mark">✓</span>' +
          "<h3>Seat requested.</h3>" +
          "<p>We read every pitch. If it's a fit, we'll send pickup coordinates to your inbox.</p>" +
          "</div>";
      })
      .catch(function () {
        guestForm.classList.remove("sending");
        btn.textContent = "Request a Seat";
        var err = document.createElement("p");
        err.className = "form-error";
        err.textContent = "Couldn't send just now — please try again, or email irosha@marketrix.ai directly.";
        guestForm.insertBefore(err, $("#formFineprint"));
      });
  });

  /* ---------- init ---------- */
  renderHero();
  renderEpisodes();
  renderPeople();
  observeReveals();
  liveSync();
  $("#year").textContent = new Date().getFullYear();

  /* active nav link */
  var sections = ["episodes", "passengers", "about", "apply"];
  var navA = document.querySelectorAll(".nav-links a");
  var secIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navA.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (id) {
    var s = document.getElementById(id);
    if (s) secIO.observe(s);
  });
})();
