const navLinks = [
  ["About", "about.html"],
  ["Ministries", "ministries.html"],
  ["What's On", "events.html"],
  ["Groups", "groups.html"],
  ["News & Devotionals", "posts.html"],
  ["Get Involved", "get-involved.html"],
  ["Contact", "contact.html"],
];

const headerTemplate = `
  <a class="brand" href="index.html" aria-label="Kingfisher Church home">
    <img class="brand-logo" src="assets/img/churchlogo.svg" alt="Kingfisher Church" />
  </a>
  <nav class="desktop-nav" aria-label="Primary navigation">
    ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
  </nav>
  <div class="header-actions">
    <a class="icon-link youtube-link" href="https://www.youtube.com/@kingfisherchurch" aria-label="Kingfisher Church on YouTube">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z"></path>
        <path class="youtube-play" d="m10 15 5.2-3L10 9v6Z"></path>
      </svg>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span data-menu-label>Menu</span>
      <span class="menu-icon" aria-hidden="true"></span>
    </button>
  </div>
`;

const mobileMenuTemplate = `
  <div class="mobile-menu-inner">
    <div class="mobile-menu-group">
      <p class="menu-group-title">Start Here</p>
      <a href="index.html">Home</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Visit Us</a>
    </div>
    <details class="mobile-folder" open>
      <summary>Explore</summary>
      <a href="ministries.html">Ministries</a>
      <a href="events.html">What's On</a>
      <a href="groups.html">Connect Groups</a>
      <a href="posts.html">News & Devotionals</a>
      <a href="get-involved.html">Get Involved</a>
      <a href="giving.html">Giving</a>
    </details>
    <details class="mobile-folder">
      <summary>Connect</summary>
      <a href="https://www.youtube.com/@kingfisherchurch">YouTube Channel</a>
      <a href="https://login.churchsuite.com/">ChurchSuite</a>
      <a href="contact.html">Contact</a>
    </details>
    <a class="button mobile-feature-link" href="contact.html">Plan Your Visit</a>
  </div>
`;

const footerTemplate = `
  <div>
    <a class="brand footer-brand" href="index.html">
      <img class="brand-logo" src="assets/img/churchlogo.svg" alt="Kingfisher Church" />
    </a>
    <p>Reaching lost people and seeing them transformed into fully devoted followers of Jesus Christ.</p>
  </div>
  <nav aria-label="Footer connect links">
    <h2>Connect</h2>
    <a href="contact.html">Visit</a>
    <a href="https://www.youtube.com/@kingfisherchurch">YouTube</a>
    <a href="https://login.churchsuite.com/">ChurchSuite</a>
  </nav>
  <nav aria-label="Footer site links">
    <h2>Explore</h2>
    <a href="about.html">About</a>
    <a href="ministries.html">Ministries</a>
    <a href="events.html">What's On</a>
    <a href="groups.html">Connect Groups</a>
    <a href="posts.html">News & Devotionals</a>
    <a href="giving.html">Giving</a>
  </nav>
  <nav aria-label="Footer social links">
    <h2>Social</h2>
    <a href="#" aria-label="Instagram placeholder">Instagram</a>
    <a href="#" aria-label="Facebook placeholder">Facebook</a>
  </nav>
`;

document.querySelectorAll("[data-header]").forEach((header) => {
  if (!header.innerHTML.trim()) {
    header.innerHTML = headerTemplate;
  }
});

document.querySelectorAll("[data-mobile-menu]").forEach((menu) => {
  if (!menu.innerHTML.trim()) {
    menu.innerHTML = mobileMenuTemplate;
  }
});

document.querySelectorAll("[data-footer]").forEach((footer) => {
  if (!footer.innerHTML.trim()) {
    footer.innerHTML = footerTemplate;
  }
});

const menu = document.querySelector("[data-mobile-menu]");
const toggle = document.querySelector("[data-menu-toggle]");
const menuLabel = document.querySelector("[data-menu-label]");

function setMenuState(isOpen) {
  if (!menu || !toggle || !menuLabel) return;
  document.body.classList.toggle("menu-open", isOpen);
  menu.setAttribute("aria-hidden", String(!isOpen));
  toggle.setAttribute("aria-expanded", String(isOpen));
  menuLabel.textContent = isOpen ? "Close" : "Menu";
}

toggle?.addEventListener("click", () => {
  setMenuState(!document.body.classList.contains("menu-open"));
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuState(false);
});

document.querySelectorAll("[data-support-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".support-slide"));
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  let timer;

  if (slides.length < 2) return;

  function wrap(index) {
    return (index + slides.length) % slides.length;
  }

  function showSlide(nextIndex) {
    currentIndex = wrap(nextIndex);
    const previousIndex = wrap(currentIndex - 1);
    const followingIndex = wrap(currentIndex + 1);

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
      slide.classList.toggle("is-prev", index === previousIndex);
      slide.classList.toggle("is-next", index === followingIndex);
      slide.setAttribute("aria-hidden", String(index !== currentIndex));
    });

    carousel.classList.add("is-ready");
  }

  function stopRotation() {
    if (timer) window.clearInterval(timer);
  }

  function startRotation() {
    if (reduceMotion) return;
    stopRotation();
    timer = window.setInterval(() => showSlide(currentIndex + 1), 3600);
  }

  previousButton?.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    startRotation();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    startRotation();
  });

  carousel.addEventListener("mouseenter", stopRotation);
  carousel.addEventListener("mouseleave", startRotation);
  carousel.addEventListener("focusin", stopRotation);
  carousel.addEventListener("focusout", startRotation);

  showSlide(0);
  startRotation();
});

function postCard(post) {
  return `
    <article class="post-card">
      <img src="${post.image}" alt="" />
      <div>
        <p class="tag">${post.type}</p>
        <h3>${post.title}</h3>
        <p class="post-date">${post.date}</p>
        <p>${post.excerpt}</p>
      </div>
    </article>
  `;
}

function ministryCard(ministry) {
  return `
    <article class="ministry-card">
      <img src="${ministry.image}" alt="" />
      <div>
        <h2>${ministry.title}</h2>
        <p>${ministry.excerpt}</p>
        <a class="arrow-link" href="contact.html">Ask about ${ministry.title}</a>
      </div>
    </article>
  `;
}

const content = window.kingfisherContent || { posts: [], ministries: [] };

document.querySelectorAll("[data-post-preview]").forEach((container) => {
  container.innerHTML = content.posts.slice(0, 3).map(postCard).join("");
});

document.querySelectorAll("[data-post-list]").forEach((container) => {
  container.innerHTML = content.posts.map(postCard).join("");
});

document.querySelectorAll("[data-ministry-list]").forEach((container) => {
  container.innerHTML = content.ministries.map(ministryCard).join("");
});
