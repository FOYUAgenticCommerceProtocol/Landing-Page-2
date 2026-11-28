/* Docs shell: top bar, tabs, sidebar, "On this page", search, copy buttons, footer. Shared by /docs, /docs/mcp and /docs/api. */
(function(){
  var page = document.body.getAttribute("data-page"); // overview | mcp | api
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
  var I = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12"/></svg>',
    toc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h13"/></svg>'
  };
  var TABS = [["overview", "Overview", "/docs"], ["mcp", "MCP", "/docs/mcp"], ["api", "API", "/docs/api"]];
  var NAV = [
    { h: "Get started", items: [["Overview", "/docs", "overview"], ["MCP or API", "/docs#choose", "overview"], ["Preview and access", "/docs#access", "overview"]] },
    { h: "MCP servers", items: [["Introduction", "/docs/mcp", "mcp"], ["For shoppers", "/docs/mcp#shoppers", "mcp", "shoppers"], ["For merchants", "/docs/mcp#merchants", "mcp", "merchants"], ["For partners", "/docs/mcp#partners", "mcp", "partners"], ["For developers", "/docs/mcp#developers", "mcp", "developers"]] },
    { h: "Connect an assistant", items: [["Claude", "/docs/mcp#claude", "mcp"], ["Claude Code", "/docs/mcp#claude-code", "mcp"], ["Other assistants", "/docs/mcp#other", "mcp"], ["Try it", "/docs/mcp#try", "mcp"]] },
    { h: "API", items: [["Quickstart", "/docs/api", "api"], ["Sandbox", "/docs/api#sandbox", "api"], ["Reference", "/docs/api#reference", "api"], ["Rules every call follows", "/docs/api#rules", "api"]] }
  ];
  var SEARCH = [
    ["Overview", "Get started", "/docs", "docs mcp api start agentic commerce"],
    ["MCP or API", "Get started", "/docs#choose", "compare choose oauth bearer rest"],
    ["Pick your server", "Get started", "/docs#servers", "shoppers merchants partners developers address"],
    ["How every order is decided", "Get started", "/docs#decided", "policy engine limits passkey store seller payment"],
    ["Preview and access", "Get started", "/docs#access", "private test invite waiting list test mode"],
    ["MCP introduction", "MCP servers", "/docs/mcp", "model context protocol remote server streamable http"],
    ["MCP for shoppers", "MCP servers", "/docs/mcp#shoppers", "shopping agent limits orders pause"],
    ["MCP for merchants", "MCP servers", "/docs/mcp#merchants", "store feed rules sandbox pause"],
    ["MCP for partners", "MCP servers", "/docs/mcp#partners", "programme report totals"],
    ["MCP for developers", "MCP servers", "/docs/mcp#developers", "docs api reference sandbox manifest"],
    ["Your server address", "MCP servers", "/docs/mcp#address", "url copy endpoint"],
    ["Get access", "MCP servers", "/docs/mcp#get-access", "join waiting list passkey invited"],
    ["Connect Claude", "Connect an assistant", "/docs/mcp#claude", "settings connectors custom connector"],
    ["Connect Claude Code", "Connect an assistant", "/docs/mcp#claude-code", "terminal claude mcp add transport http"],
    ["Other assistants", "Connect an assistant", "/docs/mcp#other", "oauth 2.1 any mcp client no api key"],
    ["Try it", "Connect an assistant", "/docs/mcp#try", "example prompts"],
    ["What your assistant can and can't do", "MCP servers", "/docs/mcp#limits", "permissions boundaries money approve"],
    ["API quickstart", "API", "/docs/api", "base address sign-in bearer token auth start"],
    ["Sandbox", "API", "/docs/api#sandbox", "curl demo propose fictional stores"],
    ["Reference", "API", "/docs/api#reference", "routes openapi endpoints orders propose pause agents revoke"],
    ["Rules every call follows", "API", "/docs/api#rules", "policy engine idempotency cents instructions"]
  ];
  var JOIN = { shoppers: "/join", merchants: "/merchants/join", partners: "/partners/contact", developers: "/developers/register-interest" };

  /* Top bar and tabs */
  var top = document.createElement("header");
  top.className = "dtop";
  top.innerHTML = '<a class="skip" href="#doc">Skip to content</a><div class="dwrap"><div class="dbar">' +
    '<button type="button" class="ibtn" id="dmenu" aria-label="Open docs menu" aria-expanded="false" aria-controls="dside">' + I.menu + '</button>' +
    '<a class="dhome" href="/docs" aria-label="Docs home"><span class="wm" aria-hidden="true"></span><span class="lbl">Docs</span></a>' +
    '<button type="button" class="dsearch" id="dsearch" aria-label="Search docs">' + I.search + '<span>Search docs</span><kbd>⌘K</kbd></button>' +
    '<div class="dright"><a class="btn" id="dcta" href="' + JOIN.developers + '">Get access</a></div>' +
    '</div><nav class="dtabs" aria-label="Docs sections">' +
    TABS.map(function(t){ return '<a href="' + t[2] + '"' + (t[0] === page ? ' aria-current="page"' : '') + '>' + t[1] + '</a>'; }).join("") +
    '<span class="sp"></span><a class="ext" href="/developers">Agentic Dev Platform</a><a class="ext" href="/merchants">Agentic Mini-Store</a><a class="ext" href="/partners">Agentic Mini-Program</a></nav></div>';
  document.body.insertBefore(top, document.body.firstChild);

  /* Sidebar */
  var side = $("#dside");
  side.innerHTML = '<div class="dclose"><button type="button" class="ibtn" id="dclose" aria-label="Close docs menu">' + I.close + '</button></div>' +
    '<a class="home" href="/developers">' + I.home + 'Developer home</a>' +
    NAV.map(function(g){
      return '<div class="grp"><span class="gh">' + g.h + '</span><ul>' + g.items.map(function(it){
        return '<li><a href="' + it[1] + '" data-pg="' + it[2] + '"' + (it[3] ? ' data-persona="' + it[3] + '"' : '') + '>' + it[0] + '</a></li>';
      }).join("") + '</ul></div>';
    }).join("");
  var scrim = document.createElement("div");
  scrim.className = "scrim";
  document.body.appendChild(scrim);
  function nav(open){
    document.body.classList.toggle("nav-open", open);
    $("#dmenu").setAttribute("aria-expanded", String(open));
    if (open) { var a = $("a.on", side) || $("a", side); if (a) a.focus(); }
  }
  $("#dmenu").addEventListener("click", function(){ nav(true); });
  $("#dclose").addEventListener("click", function(){ nav(false); });
  scrim.addEventListener("click", function(){ nav(false); });
  side.addEventListener("click", function(e){ if (e.target.closest("a")) nav(false); });

  /* Heading anchors and "On this page" */
  var art = $("#doc");
  var heads = $$("h2[id],h3[id]", art);
  function buildToc(){
    heads = $$("h2[id],h3[id]", art);
    heads.forEach(function(h){
      if (!$("a.anc", h)) { var a = document.createElement("a"); a.className = "anc"; a.href = "#" + h.id; a.setAttribute("aria-label", "Link to this section"); a.textContent = "#"; h.appendChild(a); }
    });
    var toc = $("#dtoc");
    if (!toc) return;
    toc.innerHTML = heads.length ? '<div class="th">' + I.toc + 'On this page</div><ul>' + heads.map(function(h){
      var t = h.cloneNode(true); $$(".anc,.badge", t).forEach(function(x){ x.remove(); });
      return '<li><a href="#' + h.id + '"' + (h.tagName === "H3" ? ' class="sub"' : '') + '>' + esc(t.textContent.trim()) + '</a></li>';
    }).join("") + '</ul>' : "";
  }
  buildToc();
  window.docsRebuildToc = function(){ buildToc(); spy(); };

  /* Sidebar active state + scroll spy */
  function persona(){ return document.body.getAttribute("data-p") || ""; }
  function spy(){
    var cur = "";
    heads.forEach(function(h){ if (h.getBoundingClientRect().top < 150) cur = h.id; });
    $$("#dtoc a").forEach(function(a){ a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
    var best = null;
    $$("a[data-pg]", side).forEach(function(a){
      a.classList.remove("on"); a.removeAttribute("aria-current");
      if (a.getAttribute("data-pg") !== page) return;
      var href = a.getAttribute("href"), hash = href.split("#")[1] || "";
      var p = a.getAttribute("data-persona");
      if (p) { if (p === persona() && !best) best = a; return; }
      if (hash && hash === cur) best = a;
    });
    if (!best && page !== "mcp") best = $('a[data-pg="' + page + '"]', side);
    if (!best && page === "mcp" && !persona()) best = $('a[data-pg="mcp"]', side);
    if (best) { best.classList.add("on"); best.setAttribute("aria-current", "page"); }
  }
  var ticking = false;
  window.addEventListener("scroll", function(){ if (!ticking) { ticking = true; requestAnimationFrame(function(){ ticking = false; spy(); }); } }, { passive: true });
  window.docsSpy = spy;
  spy();

  /* Copy buttons on code blocks */
  window.docsCopy = function(btn, text){
    var done = function(){ var o = btn.getAttribute("data-label") || btn.textContent; btn.setAttribute("data-label", o); btn.textContent = "Copied"; setTimeout(function(){ btn.textContent = o; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function(){ btn.textContent = "Select and copy"; });
    else btn.textContent = "Select and copy";
  };
  document.addEventListener("click", function(e){
    var b = e.target.closest(".code .copy");
    if (b) { var pre = $("pre", b.closest(".code")); window.docsCopy(b, pre.textContent); }
  });

  /* Search */
  var dlg = document.createElement("dialog");
  dlg.className = "sx";
  dlg.setAttribute("aria-label", "Search docs");
  dlg.innerHTML = '<div class="sxin">' + I.search + '<input id="sxq" type="search" placeholder="Search docs" aria-label="Search docs" autocomplete="off"><button type="button" class="esc" id="sxx">Esc</button></div><ul id="sxr" role="listbox"></ul>';
  document.body.appendChild(dlg);
  var q = $("#sxq", dlg), res = $("#sxr", dlg), sel = 0;
  function run(){
    var v = q.value.trim().toLowerCase(), words = v.split(/\s+/).filter(Boolean);
    var hits = SEARCH.filter(function(s){ var hay = (s[0] + " " + s[1] + " " + s[3]).toLowerCase(); return words.every(function(w){ return hay.indexOf(w) > -1; }); });
    sel = 0;
    res.innerHTML = hits.length ? hits.map(function(s, i){ return '<li><a href="' + s[2] + '" role="option"' + (i === 0 ? ' class="sel"' : '') + '>' + esc(s[0]) + '<small>' + esc(s[1]) + '</small></a></li>'; }).join("") : '<li class="none">Nothing found. Try “passkey”, “sandbox” or “Claude”.</li>';
  }
  function openSearch(){ q.value = ""; run(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); q.focus(); }
  $("#dsearch").addEventListener("click", openSearch);
  $("#sxx", dlg).addEventListener("click", function(){ dlg.close(); });
  dlg.addEventListener("click", function(e){ if (e.target === dlg) dlg.close(); if (e.target.closest("a")) dlg.close(); });
  q.addEventListener("input", run);
  q.addEventListener("keydown", function(e){
    var items = $$("a", res);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!items.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length; items.forEach(function(a, i){ a.classList.toggle("sel", i === sel); }); items[sel].scrollIntoView({ block: "nearest" }); }
    if (e.key === "Enter" && items[sel]) { e.preventDefault(); dlg.close(); location.href = items[sel].getAttribute("href"); }
  });
  document.addEventListener("keydown", function(e){
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
    else if (e.key === "/" && !/input|textarea/i.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); openSearch(); }
    else if (e.key === "Escape" && document.body.classList.contains("nav-open")) nav(false);
  });

  /* Persona CTA (MCP page sets it) */
  window.docsSetJoin = function(p){ var c = $("#dcta"); if (c && JOIN[p]) c.href = JOIN[p]; };

  /* Footer */
  var f = document.createElement("footer");
  f.className = "dfoot";
  f.innerHTML = '<div class="dwrap"><div class="fin"><div><span class="wm" role="img" aria-label="Wordmark"></span><p class="sg"><span class="t1">The Agentic Commerce Stack</span><span class="t2">Powering your Business</span></p></div>' +
    '<nav class="fl" aria-label="Footer"><a href="/merchants">Agentic Mini-Store</a><a href="/partners">Agentic Mini-Program</a><a href="/developers">Agentic Dev Platform</a><a href="/docs">Docs</a></nav></div>' +
    '<div class="fbot"><span class="cp">© 2026</span><nav aria-label="Legal"><a href="/business/privacy">Privacy Policy</a><a href="/business/cookies">Cookie Policy</a><a href="/business/terms">Terms</a></nav><span class="wm" aria-hidden="true"></span></div></div>';
  document.body.appendChild(f);
})();
