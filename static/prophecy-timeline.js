(function () {
  var labels = {
    zh: {
      filters: { all: "全部", true: "✅ 成真", false: "❌ 落空", pending: "⏳ 未到期", partial: "◐ 打折成真" },
      said: "何時說的",
      target: "應驗年",
      outcome: "後來呢",
      caveat: "更正",
      source: "出處",
      quote: "原話",
      empty: "這一格還沒有落下的預言。換個篩選，或看「全部」。",
      loadError: "資料載入失敗，請重新整理頁面。",
      contested: "判定有爭議",
      now: "現在",
    },
    en: {
      filters: { all: "All", true: "✅ Came True", false: "❌ Failed", pending: "⏳ Not Due Yet", partial: "◐ Partially True" },
      said: "Said in",
      target: "Target year",
      outcome: "What happened",
      caveat: "Correction",
      source: "Source",
      quote: "Verbatim",
      empty: "Nothing here yet. Try a different filter, or “All”.",
      loadError: "Could not load the data. Please reload the page.",
      contested: "Status is contested",
      now: "Now",
    },
    jp: {
      filters: { all: "すべて", true: "✅ 的中", false: "❌ 外れ", pending: "⏳ まだ先", partial: "◐ 部分的に的中" },
      said: "発言年",
      target: "予言年",
      outcome: "その後",
      caveat: "訂正",
      source: "出典",
      quote: "原文",
      empty: "この条件に当てはまる予言はまだありません。他の条件か「すべて」をお試しください。",
      loadError: "データの読み込みに失敗しました。ページを再読み込みしてください。",
      contested: "判定には異論があります",
      now: "現在",
    },
  };

  var lang = window.PROPHECY_LANG || "zh";
  var t = labels[lang] || labels.zh;
  var STATUS_ORDER = ["all", "true", "false", "pending", "partial"];

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function pickLang(field) {
    if (!field) return "";
    return field[lang] || field.zh || field.en || "";
  }

  function renderCard(entry) {
    var card = el("div", "prophecy-card status-" + entry.status);
    if (entry.contested) card.classList.add("is-contested");

    var st = el("div", "prophecy-status", t.filters[entry.status] || entry.status);
    if (entry.contested) {
      var badge = el("span", "prophecy-contested-badge", "⚠");
      badge.title = t.contested;
      st.appendChild(badge);
    }
    card.appendChild(st);

    var claim = el("div", "prophecy-claim", pickLang(entry.claim));
    card.appendChild(claim);

    var who = el("div", "prophecy-who", pickLang(entry.speaker));
    who.title = pickLang(entry.speaker);
    card.appendChild(who);

    var src = el("div", "prophecy-source");
    var link = el("a", null, "📄 " + entry.source_title);
    link.href = entry.source_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.title = entry.source_title;
    src.appendChild(link);
    card.appendChild(src);

    var detail = el("div", "prophecy-detail");
    detail.hidden = true;
    if (entry.quote) {
      var q = el("div", "prophecy-detail-block");
      q.appendChild(el("div", "prophecy-detail-label", t.quote));
      var qp = el("blockquote", "prophecy-quote", entry.quote);
      q.appendChild(qp);
      detail.appendChild(q);
    }
    var outcomeText = pickLang(entry.outcome);
    if (outcomeText) {
      var o = el("div", "prophecy-detail-block");
      o.appendChild(el("div", "prophecy-detail-label", t.outcome));
      o.appendChild(el("p", null, outcomeText));
      detail.appendChild(o);
    }
    var caveatText = pickLang(entry.caveat);
    if (caveatText) {
      var c = el("div", "prophecy-detail-block");
      c.appendChild(el("div", "prophecy-detail-label", t.caveat));
      c.appendChild(el("p", null, caveatText));
      detail.appendChild(c);
    }
    var meta = el("div", "prophecy-detail-block prophecy-detail-meta");
    meta.appendChild(el("span", null, t.said + "：" + entry.said_year));
    detail.appendChild(meta);
    card.appendChild(detail);

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", "false");
    function toggle() {
      var open = !detail.hidden;
      detail.hidden = open;
      card.classList.toggle("is-open", !open);
      card.setAttribute("aria-expanded", String(!open));
    }
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        toggle();
      }
    });

    return card;
  }

  function renderRail(rail, entries) {
    rail.innerHTML = "";
    if (entries.length === 0) {
      var voidEl = el("div", "prophecy-void", t.empty);
      rail.appendChild(voidEl);
      return null;
    }
    var currentYear = new Date().getFullYear();
    var nowMarker = null;
    var nowInserted = false;

    function insertNowMarkerIfDue(beforeYear) {
      if (nowInserted || beforeYear === undefined || currentYear >= beforeYear) return;
      nowMarker = el("div", "prophecy-now-marker");
      nowMarker.setAttribute("data-label", t.now + " " + currentYear);
      rail.appendChild(nowMarker);
      nowInserted = true;
    }

    entries.forEach(function (entry, i) {
      insertNowMarkerIfDue(entry.target_year);

      var node = el("div", "prophecy-node " + (i % 2 === 0 ? "up" : "down"));

      var topSlot = el("div", "prophecy-slot top");
      var botSlot = el("div", "prophecy-slot bot");
      var stem = el("div", "prophecy-stem");
      var axis = el("div", "prophecy-axis");
      var dot = el("span", "prophecy-dot");
      var yr = el("span", "prophecy-year", pickLang(entry.target_label) || String(entry.target_year));
      yr.title = t.target;
      axis.appendChild(dot);
      axis.appendChild(yr);

      var card = renderCard(entry);
      if (i % 2 === 0) {
        topSlot.appendChild(card);
        node.appendChild(topSlot);
        node.appendChild(stem);
        node.appendChild(axis);
        node.appendChild(botSlot);
      } else {
        node.appendChild(topSlot);
        node.appendChild(axis);
        node.appendChild(stem);
        botSlot.appendChild(card);
        node.appendChild(botSlot);
      }
      rail.appendChild(node);
    });

    // Every remaining entry already pointed at a year at or before "now" —
    // the marker belongs after the last card, not before any of them.
    if (!nowInserted) insertNowMarkerIfDue(currentYear + 1);

    return nowMarker;
  }

  function updateCounts(pills, data) {
    STATUS_ORDER.forEach(function (status) {
      var pill = pills[status];
      if (!pill) return;
      var count = status === "all" ? data.length : data.filter(function (d) { return d.status === status; }).length;
      var countEl = pill.querySelector(".prophecy-pill-count");
      if (countEl) countEl.textContent = String(count);
    });
  }

  function init(root) {
    var rail = root.querySelector(".prophecy-rail");
    var pillsWrap = root.querySelector(".prophecy-pills");
    var arrowLeft = root.querySelector(".prophecy-arrow.left");
    var arrowRight = root.querySelector(".prophecy-arrow.right");

    fetch("/prophecies.json")
      .then(function (res) {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then(function (data) {
        data.sort(function (a, b) { return a.target_year - b.target_year; });

        var pills = {};
        STATUS_ORDER.forEach(function (status) {
          var pill = el("button", "prophecy-pill" + (status === "all" ? " active" : ""));
          pill.type = "button";
          pill.dataset.status = status;
          pill.appendChild(el("span", null, t.filters[status]));
          pill.appendChild(el("span", "prophecy-pill-count", "0"));
          pill.addEventListener("click", function () {
            pillsWrap.querySelectorAll(".prophecy-pill").forEach(function (p) { p.classList.remove("active"); });
            pill.classList.add("active");
            var filtered = status === "all" ? data : data.filter(function (d) { return d.status === status; });
            renderRail(rail, filtered);
          });
          pillsWrap.appendChild(pill);
          pills[status] = pill;
        });

        updateCounts(pills, data);
        var nowMarker = renderRail(rail, data);
        if (nowMarker) {
          // Land on "now" by default rather than the earliest year — most of
          // what a first-time visitor wants to check is "did this come true
          // yet", and that question centers on the present, not on 1555.
          var target = nowMarker.offsetLeft - rail.clientWidth / 2 + nowMarker.offsetWidth / 2;
          rail.scrollTo({ left: Math.max(0, target), behavior: "instant" });
        }

        if (arrowLeft) arrowLeft.addEventListener("click", function () { rail.scrollBy({ left: -320, behavior: "smooth" }); });
        if (arrowRight) arrowRight.addEventListener("click", function () { rail.scrollBy({ left: 320, behavior: "smooth" }); });
      })
      .catch(function () {
        rail.innerHTML = "";
        rail.appendChild(el("div", "prophecy-void", t.loadError));
      });
  }

  var timelines = document.querySelectorAll(".prophecy-timeline");
  if (timelines.length > 0) {
    document.documentElement.classList.add("has-prophecy-timeline");
  }
  timelines.forEach(init);
})();
