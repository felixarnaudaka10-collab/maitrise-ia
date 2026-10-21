/* Promo « Le Club des Agentiques » — injectée sur toutes les pages tutos (v2, zéro friction).
   À inclure avant </body> : <script src="/club.js" defer></script>
   - Carte en fin de tuto : vidéo de lancement + réservation de place en 1 clic, sans quitter la page.
     Si la page a déjà capté l'email (mur email du tuto), le bouton réserve directement avec cet email.
   - Barre fixe en bas : fait défiler jusqu'à la carte.
   - Les inscriptions arrivent dans Netlify Forms « club-attente » (site lesagentiques), comme celles du quiz.
   Aucun prix affiché : il se découvre à la fin du quiz. */
(function () {
  if (window.__clubPromo) return; window.__clubPromo = true;
  var SITE = "https://lesagentiques.netlify.app";
  var page = (location.pathname.replace(/^\/|\.html$/g, "").replace(/\//g, "-")) || "accueil";
  var QUIZ = SITE + "/club/?src=" + encodeURIComponent(page) + "#quiz";
  var K_MAIL = "cdab-email", K_DONE = "cdab-reserve";
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var okMail = function (m) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m || ""); };

  // Retient l'email tapé dans le mur email du tuto (aucun envoi, juste pour pré-remplir la réservation)
  document.addEventListener("change", function (e) {
    var t = e.target; if (t && t.type === "email" && !t.closest(".cdac") && okMail(t.value.trim())) { ls(K_MAIL, t.value.trim()); render(); }
  }, true);

  var css = ""
    + ".cdab{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;gap:12px;"
    + "max-width:640px;margin:0 auto;padding:10px 10px 10px 16px;border-radius:18px;background:#14110F;color:#F5EFE6;"
    + "border:1px solid rgba(232,98,42,.55);box-shadow:0 18px 40px -12px rgba(0,0,0,.55),0 0 0 4px rgba(232,98,42,.08);"
    + "font:500 14px/1.3 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;transform:translateY(140%);transition:transform .45s cubic-bezier(.2,.8,.2,1);text-align:left}"
    + ".cdab.on{transform:none}"
    + ".cdab .sp{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,#F7A35C,#E8622A);color:#fff;font-size:16px}"
    + ".cdab .tx{flex:1;min-width:0}.cdab .tx b{display:block;font-size:14px;font-weight:800}.cdab .tx small{display:block;font-size:12px;color:#B9AFA3;margin-top:1px}"
    + ".cdab a.go{flex:none;text-decoration:none;font-weight:800;font-size:14px;color:#140E0A;background:linear-gradient(90deg,#F7A35C,#E8622A);padding:11px 14px;border-radius:12px;white-space:nowrap}"
    + ".cdab button{flex:none;background:none;border:0;color:#8A8077;font-size:20px;line-height:1;padding:4px 6px;cursor:pointer}"
    + "@media (max-width:420px){.cdab .tx small{display:none}.cdab a.go{padding:10px 12px}}"
    + ".cdac{display:block;color:#F5EFE6;margin:36px auto;max-width:760px;width:100%;box-sizing:border-box;border-radius:22px;padding:22px;text-align:left;"
    + "background:radial-gradient(120% 140% at 100% 0%,rgba(232,98,42,.28),rgba(232,98,42,0) 60%),#14110F;border:1px solid rgba(232,98,42,.5);"
    + "font:400 15px/1.55 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;scroll-margin-top:20px}"
    + ".cdac *{box-sizing:border-box}"
    + ".cdac .tg{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F7A35C;border:1px solid rgba(247,163,92,.45);padding:5px 10px;border-radius:99px}"
    + ".cdac h3{font-size:23px;line-height:1.2;margin:12px 0 6px;color:#fff;font-weight:800}"
    + ".cdac p{margin:0 0 14px;color:#D9D1C7;font-size:15px}"
    + ".cdac .vw{position:relative;border-radius:16px;overflow:hidden;background:#000;aspect-ratio:16/9;margin:4px 0 16px;cursor:pointer}"
    + ".cdac video{display:block;width:100%;height:100%;object-fit:cover}"
    + ".ag-play{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;cursor:pointer;white-space:nowrap;"
    + "background:rgba(10,9,8,.72);color:#F5EFE6;border:1px solid rgba(247,163,92,.5);font:700 13px Inter,system-ui,sans-serif;padding:7px 14px 7px 8px;border-radius:99px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}"
    + ".ag-play span{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:linear-gradient(90deg,#F7A35C,#E8622A);color:#140E0A;font-size:10px}"
    + ".ag-play.hide{display:none}"
    + "@keyframes agp{0%,100%{box-shadow:0 12px 30px rgba(0,0,0,.45),0 0 0 6px rgba(247,163,92,.18)}50%{box-shadow:0 12px 30px rgba(0,0,0,.45),0 0 0 12px rgba(247,163,92,.06)}}"
    + ".cdac .snd{position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.7);color:#fff;font-size:12px;font-weight:700;padding:6px 10px;border-radius:99px;pointer-events:none}"
    + ".cdac form{display:flex;gap:8px;flex-wrap:wrap;margin:0}"
    + ".cdac input{flex:1 1 200px;min-width:0;height:50px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:#1E1A17;color:#fff;padding:0 14px;font:inherit;font-size:16px}"
    + ".cdac button.rs{flex:1 1 200px;height:50px;border:0;border-radius:14px;cursor:pointer;font:800 15px Inter,system-ui,sans-serif;color:#140E0A;background:linear-gradient(90deg,#F7A35C,#E8622A)}"
    + ".cdac button.rs:disabled{opacity:.6;cursor:default}"
    + ".cdac .sm{display:block;margin-top:9px;font-size:12.5px;color:#9C9187}.cdac .sm a{color:#F7A35C;cursor:pointer;text-decoration:underline}"
    + ".cdac .ok{font-size:15px;color:#86EFAC;font-weight:600;margin:0 0 10px}"
    + ".cdac a.qz{display:inline-block;color:#F7A35C;font-weight:800;text-decoration:none}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // Carte : remplace l'ancien bloc .club s'il existe, sinon se place après le contenu du tuto
  var card = document.createElement("div");
  card.className = "cdac"; card.id = "club-agentiques";
  // Placement : juste après la fin du tuto, AVANT les blocs « Tu veux aller plus loin ? » (70 Spécialistes, Skool, Calendly, OpenBound…)
  var all = document.body.getElementsByTagName("*"), N = all.length || 1, idx = new Map();
  for (var ii = 0; ii < all.length; ii++) idx.set(all[ii], ii);
  function late(el) { return (idx.get(el) || 0) / N > 0.45; }
  function blockOf(el) {
    var sec = el.closest("section");
    if (sec && sec.parentNode !== document.body && sec.getElementsByTagName("*").length < N * 0.25) return sec;
    var b = el; while (b.parentElement && b.parentElement !== document.body && b.parentElement.children.length === 1) b = b.parentElement;
    return b;
  }
  var cands = [];
  [].forEach.call(document.querySelectorAll("div,p,span,h2,h3,h4"), function (el) {
    var t = (el.textContent || "").trim();
    if (t.length < 60 && el.children.length === 0 && /^(tu veux aller plus loin|pour aller plus loin|aller plus vite|envie d'aller plus loin)/i.test(t)) cands.push(el);
  });
  [].forEach.call(document.querySelectorAll('[class*="specialistes"],a[href*="70-specialistes"],a[href*="skool.com"],a[href*="calendly.com"],a[href*="openbound"],a[href*="closeia"]'), function (el) { if (late(el)) cands.push(el); });
  var old = document.querySelector("a.club");
  if (old) { var os = old.closest("section"); (os && os.children.length === 1 ? os : old).remove(); }
  cands = cands.filter(function (el) { return document.body.contains(el); });
  cands.sort(function (x, y) { return x.compareDocumentPosition(y) & 4 ? -1 : 1; });
  if (cands.length) {
    var blk = blockOf(cands[0]); blk.parentNode.insertBefore(card, blk);
  } else {
    var secs = document.querySelectorAll("section"), last = secs.length ? secs[secs.length - 1] : null;
    if (last && last.parentNode && last.parentNode !== document.body) {
      last.parentNode.insertBefore(card, last.nextSibling);
    } else {
      var host = document.querySelector("main"), best = 0;
      if (!host) { [].forEach.call(document.body.children, function (el) {
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) return;
        if (el.offsetHeight > best) { best = el.offsetHeight; host = el; } }); }
      host = host || document.body;
      var foot = host.querySelector(":scope > footer");
      if (foot) host.insertBefore(card, foot); else host.appendChild(card);
    }
  }

  card.innerHTML = '<span class="tg">Places fondateurs · prévente le 2 novembre</span>'
    + "<h3>Tu as aimé ce tuto ? Le Club des Agentiques arrive.</h3>"
    + "<p>La formation + communauté pour faire bosser Claude dans ton business, avec des workflows prêts à importer, puis apprendre à le vendre.</p>"
    + '<div class="vw"><video muted playsinline loop preload="metadata" poster="' + SITE + '/club/poster.jpg?v=2"><source src="' + SITE + '/club/lancement.mp4?v=2" type="video/mp4"></video><button type="button" class="ag-play" aria-label="Regarder la vidéo avec le son"><span>▶</span> Regarder avec le son</button></div>'
    + '<div class="act"></div>';
  var vid = card.querySelector("video"), vw = card.querySelector(".vw");

  // Vidéos du Club (haut de page + carte) : 1 tap sur le bouton = lecture depuis le début AVEC le son.
  // (Les navigateurs interdisent le son automatique sans geste de la personne.)
  [].forEach.call(document.querySelectorAll(".ag-vid, .cdac .vw"), function (box) {
    var v = box.querySelector("video"), b = box.querySelector(".ag-play"); if (!v || !b) return;
    function go() {
      [].forEach.call(document.querySelectorAll("video"), function (o) { if (o !== v) { o.pause(); o.muted = true; } });
      v.muted = false; v.loop = false; v.currentTime = 0; v.controls = true; b.classList.add("hide");
      var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); b.classList.remove("hide"); });
    }
    b.addEventListener("click", function (e) { e.stopPropagation(); go(); });
    v.addEventListener("ended", function () { v.controls = false; b.innerHTML = "<span>↺</span> Revoir"; b.classList.remove("hide"); });
    // Hors écran (ou caché, ex. mur email débloqué) = pause ; à l'écran = aperçu muet tant que la personne n'a pas lancé le son
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { en.forEach(function (x) {
      if (!x.isIntersecting) { v.pause(); return; }
      if (b.classList.contains("hide")) return;
      v.muted = true; v.loop = true; v.play().catch(function () {});
    }); }, { threshold: 0.4 }).observe(box);
  });

  function reserve(email, btn) {
    btn.disabled = true; btn.textContent = "Réservation…";
    var d = { "form-name": "club-attente", email: email, prenom: "", objectif: "Inscrit depuis le tuto « " + page + " »", formule: "Réservée depuis le tuto « " + page + " » (quiz non fait)" };
    var body = Object.keys(d).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(d[k]); }).join("&");
    fetch(SITE + "/", { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
      .catch(function () {}).then(function () { ls(K_MAIL, email); ls(K_DONE, "1"); render(); });
  }

  function render() {
    var act = card.querySelector(".act"), mail = ls(K_MAIL);
    if (ls(K_DONE) === "1") {
      act.innerHTML = '<p class="ok">✓ Ta place est réservée. Le lundi 2 novembre à 9h, tu reçois ton lien de prévente avant tout le monde.</p>'
        + '<a class="qz" href="' + QUIZ + '" target="_blank" rel="noopener">Découvre ton plan sur mesure et ton prix fondateur (45 s) →</a>';
      return;
    }
    if (okMail(mail)) {
      act.innerHTML = '<form><button class="rs" type="submit">Réserver ma place →</button></form>'
        + '<span class="sm">Avec ' + esc(mail) + ' · <a data-chg>changer</a> · Gratuit, sans engagement</span>';
      act.querySelector("[data-chg]").onclick = function () { try { localStorage.removeItem(K_MAIL); } catch (e) {} render(); };
      act.querySelector("form").onsubmit = function (e) { e.preventDefault(); reserve(mail, act.querySelector("button")); };
    } else {
      act.innerHTML = '<form><input type="email" inputmode="email" autocomplete="email" placeholder="ton@email.com" aria-label="Ton email" required>'
        + '<button class="rs" type="submit">Réserver ma place →</button></form>'
        + '<span class="sm">Gratuit, sans engagement · ou <a href="' + QUIZ + '" target="_blank" rel="noopener">fais le quiz pour ton plan sur mesure</a></span>';
      act.querySelector("form").onsubmit = function (e) {
        e.preventDefault(); var v = act.querySelector("input").value.trim();
        if (!okMail(v)) { act.querySelector("input").focus(); return; }
        reserve(v, act.querySelector("button"));
      };
    }
  }
  render();

  // Barre fixe en bas : amène à la carte (même page, zéro changement d'onglet)
  var closed = false; try { closed = sessionStorage.getItem("cdab-x") === "1"; } catch (e) {}
  if (closed || ls(K_DONE) === "1") return;
  var bar = document.createElement("div");
  bar.className = "cdab"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Le Club des Agentiques");
  bar.innerHTML = '<span class="sp" aria-hidden="true">✦</span>'
    + '<span class="tx"><b>Le Club des Agentiques</b><small>Places fondateurs · prévente le 2 novembre</small></span>'
    + '<a class="go" href="#club-agentiques">Réserver ma place</a>'
    + '<button type="button" aria-label="Fermer">×</button>';
  document.body.appendChild(bar);
  // Une seule action sur la page de capture : tant que le mur email est visible, la barre est cachée
  function wallOpen() {
    var fs = document.querySelectorAll("form");
    for (var i = 0; i < fs.length; i++) { var f = fs[i];
      if (f.closest(".cdac") || !f.querySelector('input[type="email"]')) continue;
      if (f.offsetParent !== null) return true; }
    return false;
  }
  var cardSeen = false;
  function syncBar() { if (document.body.contains(bar)) bar.classList.toggle("on", !wallOpen() && !cardSeen); }
  setInterval(syncBar, 700);
  function hideBar() { bar.classList.remove("on"); setTimeout(function () { bar.remove(); }, 500); }
  bar.querySelector("a.go").addEventListener("click", function (e) {
    e.preventDefault(); if (card.offsetParent === null) { window.open(QUIZ, "_blank", "noopener"); return; } card.scrollIntoView({ behavior: "smooth", block: "start" });
    var i = card.querySelector("input"); if (i) setTimeout(function () { i.focus({ preventScroll: true }); }, 600);
  });
  bar.querySelector("button").addEventListener("click", function () { try { sessionStorage.setItem("cdab-x", "1"); } catch (e) {} hideBar(); });
  // La barre disparaît quand la carte est à l'écran (pas de doublon)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { en.forEach(function (x) {
      if (!document.body.contains(bar)) return; cardSeen = x.isIntersecting; syncBar(); }); }, { threshold: 0.15 }).observe(card);
  } else setTimeout(syncBar, 1200);
})();
