let siteData = null;

async function loadContent() {
  const res = await fetch("content.json");
  if (!res.ok) throw new Error("Unable to load content.json");
  return res.json();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkify(text, links = []) {
  let out = escapeHtml(text);
  links.forEach((link, i) => {
    const anchor = `<a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a>`;
    out = out.replaceAll(`{link${i}}`, anchor);
  });
  return out;
}

function renderHome(data) {
  const parts = [];
  parts.push(`<h1>${escapeHtml(data.title)}</h1>`);

  (data.paragraphs || []).forEach((p) => {
    parts.push(`<p>${linkify(p.text, p.links)}</p>`);
  });

  (data.sections || []).forEach((section) => {
    parts.push(`<div class="section">`);
    parts.push(
      `<div class="section-title">${linkify(section.title, section.titleLinks)}</div>`
    );
    if (section.items && section.items.length) {
      parts.push(`<ul>`);
      section.items.forEach((item) => {
        parts.push(`<li>${linkify(item.text, item.links)}</li>`);
      });
      parts.push(`</ul>`);
    }
    parts.push(`</div>`);
  });

  return parts.join("");
}

function renderSubPage(page) {
  const parts = [];
  parts.push(`<h2>${escapeHtml(page.title)}</h2>`);
  (page.paragraphs || []).forEach((p) => {
    parts.push(`<p>${linkify(p.text, p.links)}</p>`);
  });
  parts.push(`<a class="back" href="#/">← back</a>`);
  return parts.join("");
}

function route() {
  const container = document.getElementById("content");
  const hash = window.location.hash.replace(/^#\/?/, "");
  document.title = "Abigail Chiu";
  window.scrollTo(0, 0);

  if (!hash) {
    container.innerHTML = renderHome(siteData.home);
    return;
  }

  const page = siteData.pages && siteData.pages[hash];
  if (page) {
    document.title = `${page.title} — Abigail Chiu`;
    container.innerHTML = renderSubPage(page);
  } else {
    container.innerHTML = `<h2>Not found</h2><p>That page doesn’t exist yet.</p><a class="back" href="#/">← back</a>`;
  }
}

loadContent()
  .then((data) => {
    siteData = data;
    window.addEventListener("hashchange", route);
    route();
  })
  .catch((err) => {
    document.getElementById("content").innerHTML = `<p>${escapeHtml(err.message)}</p>`;
  });
