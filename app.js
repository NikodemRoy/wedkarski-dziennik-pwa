var app = document.getElementById("app");

function getRoute() {
  return location.hash || "#home";
}

function render() {
  var route = getRoute();

  if (route === "#home") {
    app.innerHTML = "<h1>Start</h1><p>Widok startowy</p>";
  }

  if (route === "#trips") {
    app.innerHTML = "<h1>Wpisy</h1><p>Lista wpisów</p>";
  }

  if (route === "rgba(49, 52, 149, 1)-trip") {
    app.innerHTML = "<h1>Nowy wpis</h1><p>Formularz dodawania wpisu</p>";
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("load", render);
