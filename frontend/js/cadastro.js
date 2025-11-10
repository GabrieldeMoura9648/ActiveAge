document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("formCadastro");
  
  formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const termos = document.getElementById("termos").checked;
    
    if (senha !== confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    if (!termos) {
      alert(
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade."
      );
      return;
    }

    const formData = new FormData(formCadastro);
    const dados = Object.fromEntries(formData.entries());

    dados.termos = termos;

    delete dados.confirmarSenha;

    try {
      const response = await fetch("http://localhost:3000/api/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        alert(resultado.mensagem);
        window.location.href = "login.html";
      } else {
        alert(resultado.mensagem);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert(
        "Não foi possível se conectar ao servidor. Tente novamente mais tarde."
      );
    }
  });
});
