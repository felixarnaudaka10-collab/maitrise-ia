/* Promo « Le Club des Agentiques » — injectée sur toutes les pages tutos.
   À inclure avant </body> : <script src="/club.js" defer></script>
   Ajoute : 1) une barre fixe en bas de l'écran (fermable), 2) une carte en fin de tuto
   si la page n'a pas déjà son propre bloc .club. Aucun prix affiché : il se découvre à la fin du quiz. */
(function () {
  if (window.__clubPromo) return; window.__clubPromo = true;
  var page = (location.pathname.replace(/^\/|\.html$/g, "").replace(/\//g, "-")) || "accueil";
  var URL = "https://lesagentiques.netlify.app/club/?src=" + encodeURIComponent(page) + "#quiz";

  var css = ""
    + ".cdab{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;display:flex;align-items:center;gap:12px;"
    + "max-width:640px;margin:0 auto;padding:10px 10px 10px 16px;border-radius:18px;background:#14110F;color:#F5EFE6;"
    + "border:1px solid rgba(232,98,42,.55);box-shadow:0 18px 40px -12px rgba(0,0,0,.55),0 0 0 4px rgba(232,98,42,.08);"
    + "font:500 14px/1.3 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;transform:translateY(140%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}"
    + ".cdab.on{transform:none}"
    + ".cdab .sp{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,#F7A35C,#E8622A);color:#fff;font-size:16px}"
    + ".cdab .tx{flex:1;min-width:0}.cdab .tx b{display:block;font-size:14px;font-weight:800}.cdab .tx small{display:block;font-size:12px;color:#B9AFA3;margin-top:1px}"
    + ".cdab a.go{flex:none;text-decoration:none;font-weight:800;font-size:14px;color:#140E0A;background:linear-gradient(90deg,#F7A35C,#E8622A);padding:11px 14px;border-radius:12px;white-space:nowrap}"
    + ".cdab button{flex:none;background:none;border:0;color:#8A8077;font-size:20px;line-height:1;padding:4px 6px;cursor:pointer}"
    + "@media (max-width:420px){.cdab .tx small{display:none}.cdab a.go{padding:10px 12px}}"
    + ".cdac{display:block;text-decoration:none;color:#F5EFE6;margin:36px auto;max-width:760px;border-radius:22px;padding:26px;"
    + "background:radial-gradient(120% 140% at 100% 0%,rgba(232,98,42,.28),rgba(232,98,42,0) 60%),#14110F;border:1px solid rgba(232,98,42,.5);"
    + "font:400 15px/1.55 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-sizing:border-box;width:100%}"
    + ".cdac .tg{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F7A35C;border:1px solid rgba(247,163,92,.45);padding:5px 10px;border-radius:99px}"
    + ".cdac h3{font-size:24px;line-height:1.2;margin:14px 0 8px;color:#fff;font-weight:800}"
    + ".cdac p{margin:0 0 16px;color:#D9D1C7}"
    + ".cdac .go{display:inline-block;font-weight:800;color:#140E0A;background:linear-gradient(90deg,#F7A35C,#E8622A);padding:13px 18px;border-radius:14px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // 1) Carte en fin de tuto (sauf si la page a déjà son bloc Club)
  if (!document.querySelector('a.club, a[href*="lesagentiques.netlify.app/club"]')) {
    var card = document.createElement("a");
    card.className = "cdac"; card.href = URL; card.target = "_blank"; card.rel = "noopener";
    card.innerHTML = '<span class="tg">Liste d\'attente · places fondateurs</span>'
      + "<h3>Tu as aimé ce tuto ? Le Club des Agentiques arrive.</h3>"
      + "<p>La formation + communauté pour faire bosser Claude dans ton business, avec des workflows prêts à importer, puis apprendre à le vendre. Fais le quiz de 45 secondes : ton plan sur mesure et ton prix fondateur s'affichent à la fin.</p>"
      + '<span class="go">Faire le quiz et réserver ma place →</span>';
    // Place la carte dans le conteneur principal du tuto (jamais comme enfant direct d'un body en flex/grid)
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

  // 2) Barre fixe en bas (fermée = cachée pour la session)
  var closed = false; try { closed = sessionStorage.getItem("cdab-x") === "1"; } catch (e) {}
  if (closed) return;
  var bar = document.createElement("div");
  bar.className = "cdab"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Le Club des Agentiques");
  bar.innerHTML = '<span class="sp" aria-hidden="true">✦</span>'
    + '<span class="tx"><b>Le Club des Agentiques</b><small>Places fondateurs · prévente le 2 novembre</small></span>'
    + '<a class="go" href="' + URL + '" target="_blank" rel="noopener">Réserver ma place</a>'
    + '<button type="button" aria-label="Fermer">×</button>';
  document.body.appendChild(bar);
  bar.querySelector("button").addEventListener("click", function () {
    bar.classList.remove("on"); try { sessionStorage.setItem("cdab-x", "1"); } catch (e) {}
    setTimeout(function () { bar.remove(); }, 500);
  });
  setTimeout(function () { bar.classList.add("on"); }, 1200);
})();
