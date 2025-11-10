document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("activeAgeToken");
  const usuario = JSON.parse(localStorage.getItem("activeAgeUser"));

  if (!token || !usuario) {
    alert("Você precisa estar logado para ver esta página.");
    window.location.href = "login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const idMedico = urlParams.get("id");

  if (!idMedico) {
    alert("Médico não especificado.");
    window.location.href = "dashboard.html";
    return;
  }

  const divDetalhesMedico = document.getElementById("detalhes-medico");
  const divHorarios = document.getElementById("lista-horarios-disponiveis");

  async function carregarDetalhesMedico() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/medicos/${idMedico}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error((await response.json()).mensagem);
      }

      const medico = await response.json();

      divDetalhesMedico.innerHTML = `
      <h2 class="h3" style="color: var(--aa-brown);">${medico.nome}</h2>
      <h5 class="text-muted mb-3">CRM: ${medico.crm}</h5>
      <p>${medico.biografia || "Biografia não informada."}</p>
      <span class="badge bg-secondary me-1">${
        medico.especializacoes || "Clínico Geral"
      }</span>
    `;
    } catch (error) {
      console.error("Erro ao carregar detalhes do médico:", error);
      divDetalhesMedico.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }

  async function carregarHorariosMedico() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/medicos/${idMedico}/horarios`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error((await response.json()).mensagem);
      }

      const horarios = await response.json();

      if (horarios.length === 0) {
        divHorarios.innerHTML =
          "<p class='text-center'>Nenhum horário disponível para este médico no momento.</p>";
        return;
      }

      const listaGroup = document.createElement("div");
      listaGroup.className = "list-group";

      horarios.forEach((horario) => {
        const dataInicioStr = horario.dataHoraInicio.replace(" ", "T");
        const dataFimStr = horario.dataHoraFim.replace(" ", "T");
        const dataInicio = new Date(dataInicioStr).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });
        const dataFim = new Date(dataFimStr).toLocaleString("pt-BR", {
          timeStyle: "short",
        });

        const botaoHorario = document.createElement("button");
        botaoHorario.type = "button";
        botaoHorario.className =
          "list-group-item list-group-item-action text-center fs-5";

        botaoHorario.dataset.idHorario = horario.idHorario;
        botaoHorario.innerText = `De ${dataInicio} até ${dataFim}`;

        botaoHorario.addEventListener("click", async () => {
          if (
            !confirm(`Deseja realmente agendar a consulta para ${dataInicio}?`)
          ) {
            return;
          }

          botaoHorario.disabled = true;
          botaoHorario.innerText = "Agendando...";

          try {
            const responseAgendar = await fetch(
              "http://localhost:3000/api/agendamentos",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ idHorario: horario.idHorario }),
              }
            );

            const resultado = await responseAgendar.json();

            if (responseAgendar.ok) {
              alert(resultado.mensagem);
              window.location.href = "dashboard.html";
            } else {
              alert(`Erro: ${resultado.mensagem}`);
              carregarHorariosMedico();
            }
          } catch (error) {
            console.error("Erro ao agendar consulta:", error);
            alert("Erro ao conectar com a API para agendar.");
            botaoHorario.disabled = false;
            botaoHorario.innerText = `De ${dataInicio} até ${dataFim}`;
          }
        });

        listaGroup.appendChild(botaoHorario);
      });

      divHorarios.innerHTML = "";
      divHorarios.appendChild(listaGroup);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      divHorarios.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }

  carregarDetalhesMedico();
  carregarHorariosMedico();
});
