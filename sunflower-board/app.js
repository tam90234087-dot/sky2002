(function () {
  const B = window.BOARD;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  const tabs = $("tabs");
  B.sections.forEach(([id, label]) => {
    const a = el("a", "tab", label);
    a.href = "#" + id;
    tabs.appendChild(a);
  });

  B.method.forEach((t) => $("methodSteps").appendChild(el("li", null, t)));

  function renderNode(node, depth) {
    const li = el("li", "node d" + Math.min(depth, 3));
    const row = el("div", "node-row");
    const kids = node.children || [];
    const toggle = el("span", "caret", kids.length ? "▾" : "•");
    row.appendChild(toggle);
    row.appendChild(el("span", "node-label", node.label));
    li.appendChild(row);
    if (kids.length) {
      const ul = el("ul");
      kids.forEach((k) => ul.appendChild(renderNode(k, depth + 1)));
      li.appendChild(ul);
      row.classList.add("clickable");
      row.addEventListener("click", () => {
        const closed = li.classList.toggle("closed");
        toggle.textContent = closed ? "▸" : "▾";
      });
    }
    return li;
  }
  const rootUl = el("ul");
  rootUl.appendChild(renderNode(B.tree, 0));
  $("treeRoot").appendChild(rootUl);

  const castName = Object.fromEntries(B.cast.map((c) => [c.id, c.name]));
  const goodsTags = ["全部", "原味", "五香", "椒盐", "奶香"];
  let active = "全部";
  function renderDirections() {
    const box = $("dirCards");
    box.replaceChildren();
    B.directions
      .filter((d) => active === "全部" || d.goods.includes(active) || d.goods.includes("4 种"))
      .forEach((d) => {
        const c = el("article", "card");
        const head = el("div", "card-head");
        head.appendChild(el("span", "num", String(d.n)));
        head.appendChild(el("span", "crowd", d.crowd));
        c.appendChild(head);
        c.appendChild(el("p", "hook", "“" + d.hook + "”"));
        const meta = el("dl", "meta");
        [["场景", d.scene], ["货", d.goods], ["主画面", d.shot],
         ["角色", d.cast.length ? d.cast.map((x) => castName[x]).join("、") : "待定"]]
          .forEach(([k, v]) => { meta.appendChild(el("dt", null, k)); meta.appendChild(el("dd", null, v)); });
        c.appendChild(meta);
        box.appendChild(c);
      });
  }
  goodsTags.forEach((g) => {
    const b = el("button", "chip" + (g === active ? " on" : ""), g);
    b.addEventListener("click", () => {
      active = g;
      document.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x.textContent === g));
      renderDirections();
    });
    $("filters").appendChild(b);
  });
  renderDirections();

  B.scripts.forEach((s) => {
    const wrap = el("div", "script");
    wrap.appendChild(el("h3", null, s.title));
    if (s.note) wrap.appendChild(el("p", "note", s.note));
    const table = el("table");
    const thead = el("tr");
    ["时间", "画面", "口播 / 字幕"].forEach((h) => thead.appendChild(el("th", null, h)));
    table.appendChild(thead);
    s.rows.forEach((r) => {
      const tr = el("tr");
      r.forEach((v) => tr.appendChild(el("td", null, v)));
      table.appendChild(tr);
    });
    wrap.appendChild(table);
    $("scriptList").appendChild(wrap);
  });

  const KEY = "sunflower-cast-picks";
  let picks = {};
  try { picks = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { picks = {}; }
  B.cast.forEach((c) => {
    const card = el("article", "cast-card");
    card.appendChild(el("h3", null, c.name));
    card.appendChild(el("p", "role", c.role));
    const imgs = el("div", "cands");
    [1, 2].forEach((i) => {
      const fig = el("figure", "cand");
      const img = el("img");
      img.src = "cast/" + c.id + "_" + i + ".png";
      img.alt = c.name + " 候选 " + i;
      img.loading = "lazy";
      fig.appendChild(img);
      fig.appendChild(el("figcaption", null, "候选 " + i + (c.pick === i ? "（推荐）" : "")));
      const sync = () => fig.classList.toggle("picked", (picks[c.id] || 0) === i);
      fig.addEventListener("click", () => {
        picks[c.id] = picks[c.id] === i ? 0 : i;
        localStorage.setItem(KEY, JSON.stringify(picks));
        imgs.querySelectorAll(".cand").forEach((f) => f.dispatchEvent(new Event("sync")));
      });
      fig.addEventListener("sync", sync);
      sync();
      imgs.appendChild(fig);
    });
    card.appendChild(imgs);
    card.appendChild(el("p", "desc", c.desc));
    card.appendChild(el("p", "uses", "出场：" + c.uses));
    $("castGrid").appendChild(card);
  });

  B.ladder.forEach((l) => {
    const step = el("div", "rung");
    step.appendChild(el("div", "rung-name", l.name));
    step.appendChild(el("div", "rung-price", l.price));
    step.appendChild(el("div", "rung-what", l.what));
    step.appendChild(el("div", "rung-where", l.where));
    $("ladder").appendChild(step);
  });
  B.phases.forEach((t) => $("phases").appendChild(el("li", null, t)));
  B.checks.forEach((t) => $("checks").appendChild(el("li", null, t)));
})();
