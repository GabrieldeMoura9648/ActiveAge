document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(formLogin);
    const dados = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        alert(resultado.mensagem);

        localStorage.setItem("activeAgeToken", resultado.token);
        localStorage.setItem("activeAgeUser", JSON.stringify(resultado.usuario));

        window.location.href = "dashboard.html"; 

      } else {
        alert(resultado.mensagem);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Não foi possível se conectar ao servidor. Tente novamente mais tarde.");
    }
  });
});