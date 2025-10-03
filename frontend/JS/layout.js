// Detectar si estamos en index (raíz) o en /pages
let basePath = "";

if (window.location.pathname.includes("/pages/")) {
  basePath = ""; // porque header.html y footer.html están dentro de /pages
} else {
  basePath = "pages/"; // estamos en index.html, entonces debemos ir a /pages
}

// Función para cargar fragmentos HTML en contenedores
function loadComponent(id, file, callback) {
  fetch(basePath + file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    });
}

// Cargar header
loadComponent("header", "header.html", () => {
  const path = window.location.pathname;

  if (path.includes("cart.html")) {
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) searchBar.style.display = "none";
  }

  if (path.includes("admin.html")) {
    document.querySelector("header").style.backgroundColor = "#2c3e50";
  }
});

// Cargar footer
loadComponent("footer", "footer.html", () => {
  const path = window.location.pathname;

  if (path.includes("index.html")) {
    document.querySelector(".footer-bottom p").innerHTML =
      "&copy; 2025 TechStore - Página principal.";
  }

  if (path.includes("cart.html")) {
    document.querySelector(".footer-bottom p").innerHTML =
      "🛒 Revisa tus productos antes de comprar.";
  }

  if (path.includes("login.html")) {
    document.querySelector(".footer-bottom p").innerHTML =
      "🔐 Bienvenido, inicia sesión para continuar.";
  }
});
