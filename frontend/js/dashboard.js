document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("activeAgeToken");
  const usuario = JSON.parse(localStorage.getItem("activeAgeUser"));

  if (!token || !usuario) {
    alert("Você precisa estar logado para ver esta página.");
    window.location.href = "login.html";
    return;
  }

  const welcomeMessage = document.getElementById("welcome-message");
  if (usuario.nome) {
    welcomeMessage.innerText = `Olá, ${usuario.nome}`;
  }

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("activeAgeToken");
    localStorage.removeItem("activeAgeUser");
    alert("Você saiu da sua conta.");
    window.location.href = "index.html";
  });

  if (usuario.tipoPerfil === "PACIENTE_CUIDADOR") {
    document.getElementById("paciente-dashboard").style.display = "block";
    document.getElementById("dashboard-title").innerText = "Painel do Paciente";
    iniciarPainelPaciente();
  } else if (usuario.tipoPerfil === "MEDICO") {
    document.getElementById("medico-dashboard").style.display = "block";
    document.getElementById("dashboard-title").innerText = "Painel do Médico";
    iniciarPainelMedico();
  }

  function iniciarPainelPaciente() {
    const resultadosDiv = document.getElementById("lista-medicos-resultado");

    async function carregarMedicos() {
      try {
        const response = await fetch("http://localhost:3000/api/medicos", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error((await response.json()).mensagem);
        }

        const medicos = await response.json();
        resultadosDiv.innerHTML = "";

        if (medicos.length === 0) {
          resultadosDiv.innerHTML =
            "<p>Nenhum médico aprovado encontrado no momento.</p>";
          return;
        }

        medicos.forEach((medico) => {
          const cardMedico = `
            <div class="card mb-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-8">
                    <h5 class="card-title" style="color: var(--aa-brown);">${
                      medico.nome
                    }</h5>
                    <h6 class="card-subtitle mb-2 text-muted">CRM: ${
                      medico.crm
                    }</h6>
                    <p class="card-text">${
                      medico.biografia || "Biografia não informada."
                    }</p>
                    <span class="badge bg-secondary me-1">${
                      medico.especializacoes || "Clínico Geral"
                    }</span>
                  </div>
                  <div class="col-md-4 d-flex align-items-center justify-content-end">
                    <a href="agendar.html?id=${
                      medico.idUsuario
                    }" class="btn btn-primary btn-lg">
                      Ver Agenda
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
          resultadosDiv.innerHTML += cardMedico;
        });
      } catch (error) {
        console.error("Erro ao carregar médicos:", error);
        resultadosDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      }
    }
    carregarMedicos();

    const divAgendamentosPaciente = document.getElementById(
      "lista-paciente-agendamentos"
    );

    async function carregarAgendamentosPaciente() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/paciente/agendamentos",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error((await response.json()).mensagem);
        }

        const agendamentos = await response.json();
        divAgendamentosPaciente.innerHTML = "";

        if (agendamentos.length === 0) {
          divAgendamentosPaciente.innerHTML =
            "<p>Você não possui nenhuma consulta futura agendada.</p>";
          return;
        }

        agendamentos.forEach((ag) => {
          const dataInicio = new Date(
            ag.dataHoraInicio.replace(" ", "T")
          ).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

          const cardDiv = document.createElement("div");
          cardDiv.className = "card-body p-3 mb-2 bg-light border rounded";
          cardDiv.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Consulta com ${ag.nomeMedico}</strong>
              <br>
              <span class="text-muted">${dataInicio}</span>
            </div>
            <div>
              <a href="teleconsulta.html?id=${ag.idAgendamento}" class="btn btn-success me-2">
                <i class="bi bi-camera-video-fill"></i> Entrar
              </a>
              <button class="btn btn-outline-danger btn-cancelar" data-id="${ag.idAgendamento}">
                <i class="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
          </div>
        `;

          cardDiv
            .querySelector(".btn-cancelar")
            .addEventListener("click", () => {
              cancelarAgendamento(ag.idAgendamento, "PACIENTE");
            });

          divAgendamentosPaciente.appendChild(cardDiv);
        });
      } catch (error) {
        divAgendamentosPaciente.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      }
    }

    carregarAgendamentosPaciente();

    async function cancelarAgendamento(idAgendamento, perfil) {
      if (
        !confirm(
          "Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/agendamentos/${idAgendamento}/cancelar`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resultado = await response.json();

        if (response.ok) {
          alert(resultado.mensagem);

          if (perfil === "PACIENTE") {
            carregarAgendamentosPaciente();
          } else if (perfil === "MEDICO") {
            carregarAgendamentosMedico();
            carregarMeusHorarios();
          }
        } else {
          alert(`Erro: ${resultado.mensagem}`);
        }
      } catch (error) {
        console.error("Erro ao cancelar consulta:", error);
        alert("Erro ao conectar com a API para cancelar.");
      }
    }
  }

  function iniciarPainelMedico() {
    const formMedicoPerfil = document.getElementById("formMedicoPerfil");
    const formMedicoHorarios = document.getElementById("formMedicoHorarios");
    const listaHorariosDiv = document.getElementById("lista-meus-horarios");
    const alertaMedico = document.getElementById("medico-alerta");

    if (usuario.statusVerificacao === "PENDENTE") {
      alertaMedico.style.display = "block";
    } else {
      alertaMedico.style.display = "none";
    }

    async function carregarMeusHorarios() {
      try {
        const cacheBuster = `?t=${new Date().getTime()}`;

        const response = await fetch(
          `http://localhost:3000/api/medico/horarios${cacheBuster}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error((await response.json()).mensagem);
        }

        const horarios = await response.json();
        listaHorariosDiv.innerHTML = "";

        if (horarios.length === 0) {
          listaHorariosDiv.innerHTML =
            "<p>Você ainda não cadastrou nenhum horário futuro.</p>";
          return;
        }

        const listaUl = document.createElement("ul");
        listaUl.className = "list-group";

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

          const li = document.createElement("li");
          li.className =
            "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
          <span>De: <strong>${dataInicio}</strong> até: <strong>${dataFim}</strong></span>
          <span class="badge ${
            horario.status === "AGENDADO" ? "bg-danger" : "bg-success"
          }">${horario.status}</span>
        `;
          listaUl.appendChild(li);
        });
        listaHorariosDiv.appendChild(listaUl);
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        listaHorariosDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      }
    }

    formMedicoPerfil.addEventListener("submit", async (event) => {
      event.preventDefault();
      const dadosPerfil = {
        crm: document.getElementById("medicoCRM").value,
        biografia: document.getElementById("medicoBiografia").value,
        especializacoes: document.getElementById("medicoEspecializacoes").value,
      };
      try {
        const response = await fetch(
          "http://localhost:3000/api/medico/perfil",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dadosPerfil),
          }
        );
        const resultado = await response.json();
        if (response.ok) {
          alert(resultado.mensagem);
          alertaMedico.style.display = "none";
          usuario.statusVerificacao = "APROVADO";
          localStorage.setItem("activeAgeUser", JSON.stringify(usuario));
        } else {
          alert(`Erro: ${resultado.mensagem}`);
        }
      } catch (error) {
        console.error("Erro ao salvar perfil do médico:", error);
        alert("Erro ao conectar com a API para salvar o perfil.");
      }
    });

    formMedicoHorarios.addEventListener("submit", async (event) => {
      event.preventDefault();
      const dataHoraInicio = document.getElementById("dataHoraInicio").value;
      const dataHoraFim = document.getElementById("dataHoraFim").value;

      try {
        const response = await fetch(
          "http://localhost:3000/api/medico/horarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dataHoraInicio, dataHoraFim }),
          }
        );

        const resultado = await response.json();

        if (response.ok) {
          alert(resultado.mensagem);
          formMedicoHorarios.reset();
          await carregarMeusHorarios();
        } else {
          alert(`Erro: ${resultado.mensagem}`);
        }
      } catch (error) {
        console.error("Erro ao adicionar horário:", error);
        alert("Erro ao conectar com a API para adicionar horário.");
      }
    });

    carregarMeusHorarios();

    const divAgendamentosMedico = document.getElementById(
      "lista-medico-agendamentos"
    );

    async function carregarAgendamentosMedico() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/medico/agendamentos",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error((await response.json()).mensagem);
        }

        const agendamentos = await response.json();
        divAgendamentosMedico.innerHTML = "";

        if (agendamentos.length === 0) {
          divAgendamentosMedico.innerHTML =
            "<p>Você não possui nenhuma consulta futura agendada.</p>";
          return;
        }

        agendamentos.forEach((ag) => {
          const dataInicio = new Date(
            ag.dataHoraInicio.replace(" ", "T")
          ).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

          const cardDiv = document.createElement("div");
          cardDiv.className = "card-body p-3 mb-2 bg-light border rounded";
          cardDiv.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Consulta com ${ag.nomePaciente}</strong>
              <br>
              <span class="text-muted">${dataInicio}</span>
            </div>
            <div>
              <a href="teleconsulta.html?id=${ag.idAgendamento}" class="btn btn-success me-2">
                <i class="bi bi-camera-video-fill"></i> Entrar
              </a>
              <button class="btn btn-outline-danger btn-cancelar" data-id="${ag.idAgendamento}">
                <i class="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
          </div>
        `;

          cardDiv
            .querySelector(".btn-cancelar")
            .addEventListener("click", () => {
              cancelarAgendamento(ag.idAgendamento, "MEDICO");
            });

          divAgendamentosMedico.appendChild(cardDiv);
        });
      } catch (error) {
        divAgendamentosMedico.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      }
    }

    carregarAgendamentosMedico();

    async function cancelarAgendamento(idAgendamento, perfil) {
      if (
        !confirm(
          "Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita."
        )
      ) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/agendamentos/${idAgendamento}/cancelar`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resultado = await response.json();

        if (response.ok) {
          alert(resultado.mensagem);

          if (perfil === "PACIENTE") {
            carregarAgendamentosPaciente();
          } else if (perfil === "MEDICO") {
            carregarAgendamentosMedico();
            carregarMeusHorarios();
          }
        } else {
          alert(`Erro: ${resultado.mensagem}`);
        }
      } catch (error) {
        console.error("Erro ao cancelar consulta:", error);
        alert("Erro ao conectar com a API para cancelar.");
      }
    }
  }
});
