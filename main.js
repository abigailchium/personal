async function loadContent() {
  const res = await fetch("content.json");
  if (!res.ok) {
    throw new Error("Unable to load content.json");
  }
  return res.json();
}

function linkifyText(text, links = []) {
  if (!links.length) return text;
  let output = text;
  links.forEach((link, index) => {
    const placeholder = `{link${index}}`;
    const anchor = `<a href="${link.url}" target="_blank" rel="noopener">${link.text}</a>`;
    output = output.replaceAll(placeholder, anchor);
  });
  return output;
}

function renderParagraphs(container, paragraphs) {
  paragraphs.forEach((item) => {
    const p = document.createElement("p");
    p.innerHTML = linkifyText(item.text, item.links);
    container.appendChild(p);
  });
}

function renderSection(container, section) {
  const wrapper = document.createElement("div");
  wrapper.className = "section";

  const title = document.createElement("div");
  title.className = "section-title";
  title.innerHTML = linkifyText(section.title, section.titleLinks);
  wrapper.appendChild(title);

  if (section.items && section.items.length) {
    const list = document.createElement("ul");
    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = linkifyText(item.text, item.links);
      list.appendChild(li);
    });
    wrapper.appendChild(list);
  }

  container.appendChild(wrapper);
}

function renderPage(data) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = data.name;
  container.appendChild(title);

  renderParagraphs(container, data.introParagraphs || []);

  (data.sections || []).forEach((section) => {
    renderSection(container, section);
  });
}

loadContent()
  .then(renderPage)
  .catch((err) => {
    const container = document.getElementById("content");
    container.innerHTML = `<p class="muted">${err.message}</p>`;
  });
