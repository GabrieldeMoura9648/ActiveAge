document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("activeAgeToken");
  const userJSON = localStorage.getItem("activeAgeUser");

  const navbarNav = document.querySelector("#navbarNav .navbar-nav");

  if (token && userJSON && navbarNav) {
    const user = JSON.parse(userJSON);
    navbarNav.innerHTML = `
      <li class="nav-item d-flex align-items-center me-3">
        <span class="navbar-text">
          Olá, ${user.nome}
        </span>
      </li>
      <li class="nav-item me-2">
        <a class="btn btn-primary" href="dashboard.html">Meu Painel</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-outline-danger" id="global-logout-button">Sair</button>
      </li>
    `;

    const logoutButton = document.getElementById("global-logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        localStorage.removeItem("activeAgeToken");
        localStorage.removeItem("activeAgeUser");
        alert("Você saiu da sua conta.");
        window.location.href = "index.html";
      });
    }
  }

  const currentPage = window.location.pathname.split("/").pop();

  if (
    token &&
    (currentPage === "login.html" || currentPage === "cadastro.html")
  ) {
    alert("Você já está logado!");
    window.location.href = "dashboard.html";
  }
});
