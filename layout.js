document.addEventListener("DOMContentLoaded", function () {
  loadLayoutByPetraPixel();
});

function loadLayoutByPetraPixel() {
  const mainEl = document.querySelector("main");
  if (!mainEl) return;

  // ONLY inject footer inside .layout
  mainEl.insertAdjacentHTML("afterend", footerHTML());

  // Inject bookmarks inside .notebook
  const notebookEl = document.querySelector(".notebook");
  if (notebookEl) {
    notebookEl.insertAdjacentHTML("beforeend", bookmarksHTML());
  }

  giveActiveClassToCurrentPage();
  giveActiveClassToCurrentBookmark();
}

const nesting = getNesting();

// --- BOOKMARKS ---
function bookmarksHTML() {
  return `
    <div class="bookmarks">
      <a href="/" class="bookmark" data-page="home" title="Home">
        <img src="${nesting}/images/layout/home_sticky.png" alt="Home">
      </a>
      <a href="/bookbug/" class="bookmark" data-page="bookbug" title="Books">
        <img src="${nesting}/images/layout/books_sticky.png" alt="Books">
      </a>
      <a href="/blog/" class="bookmark" data-page="blog" title="Blog">
        <img src="${nesting}/images/layout/blog_sticky.png" alt="Blog">
      </a>
      <a href="/nature/" class="bookmark" data-page="nature" title="Nature">
        <img src="${nesting}/images/layout/nature_sticky.png" alt="Nature">
      </a>
    </div>
  `;
}

// --- FOOTER ---
function footerHTML() {
  return `
    <footer>
      <div></div>
    </footer>
  `;
}

// --- ACTIVE PAGE LOGIC ---
function giveActiveClassToCurrentPage() {
  const els = document.querySelectorAll("nav a");
  [...els].forEach((el) => {
    const href = el.getAttribute("href").replace(".html", "").replace("#", "");
    const pathname = window.location.pathname.replace("/public/", "");
    const currentHref = window.location.href.replace(".html", "") + "END";

    if (href == "/" || href == "/index.html") {
      if (pathname == "/") el.classList.add("active");
    } else {
      if (currentHref.includes(href + "END")) {
        el.classList.add("active");
        if (el.closest("details")) {
          el.closest("details").setAttribute("open", "open");
          el.closest("details").classList.add("active");
        }
        if (el.closest("ul")) {
          if (el.closest("ul").closest("ul")) {
            el.closest("ul").closest("ul").classList.add("active");
          }
        }
      }
    }
  });
}

// --- ACTIVE BOOKMARK LOGIC ---
function giveActiveClassToCurrentBookmark() {
  const bookmarks = document.querySelectorAll('.bookmark');
  let currentPath = window.location.pathname.toLowerCase();
  
  // Clean up the URL to make matching easy
  currentPath = currentPath.replace('/index.html', '');
  if (currentPath.endsWith('/') && currentPath.length > 1) {
      currentPath = currentPath.slice(0, -1);
  }

  let matched = false;
  
  // Check bookmarks in reverse. That way we check specific folders before falling back to Home
  Array.from(bookmarks).reverse().forEach(bookmark => {
    bookmark.classList.remove('active');
    
    let href = bookmark.getAttribute('href').toLowerCase();
    href = href.replace('/index.html', '');
    if (href.endsWith('/') && href.length > 1) {
        href = href.slice(0, -1);
    }

    if (!matched) {
        // If it's a sub-page (like /test) and our URL contains it
        if (href !== '/' && href !== '' && currentPath.includes(href)) {
            bookmark.classList.add('active');
            matched = true;
        } 
        // If we made it all the way back to the Home icon ("/") without finding a match
        else if (href === '/' || href === '') {
            bookmark.classList.add('active');
            matched = true;
        }
    }
  });
}

function getNesting() {
  const numberOfSlashes = window.location.pathname.split("/").length - 1;
  if (numberOfSlashes == 1) return "./";
  return "../".repeat(numberOfSlashes - 1);
}