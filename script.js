let demandas = JSON.parse(localStorage.getItem("demandasTI")) || [];

const ctx = document.getElementById("graficoDemandas").getContext("2d");

const chartData = {
  labels: ["Pendentes", "Em Andamento", "Concluídas"],
  datasets: [
    {
      label: "Demandas",
      data: [0, 0, 0],
      backgroundColor: ["#facc15", "#3b82f6", "#22c55e"],
      borderWidth: 1,
    },
  ],
};

const grafico = new Chart(ctx, {
  type: "doughnut",
  data: chartData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

function atualizarGrafico() {
  const contagem = { pendente: 0, andamento: 0, concluida: 0 };
  demandas.forEach((d) => contagem[d.status]++);
  grafico.data.datasets[0].data = [
    contagem.pendente,
    contagem.andamento,
    contagem.concluida,
  ];
  grafico.update();
}

function salvar() {
  localStorage.setItem("demandasTI", JSON.stringify(demandas));
  renderizar();
  atualizarGrafico();
}

function adicionarDemanda() {
  const input = document.getElementById("inputDemanda");
  const titulo = input.value.trim();
  if (titulo === "") return;

  demandas.push({ id: Date.now(), titulo, status: "pendente" });
  input.value = "";
  salvar();
}

function mudarStatus(id, novoStatus) {
  const demanda = demandas.find((d) => d.id === id);
  if (demanda) {
    demanda.status = novoStatus;
    salvar();
  }
}

function criarItem(demanda) {
  const div = document.createElement("div");
  div.className = "item";
  div.textContent = demanda.titulo;

  const botoes = {
    pendente: ["andamento", "concluida"],
    andamento: ["pendente", "concluida"],
    concluida: ["pendente", "andamento"],
  };

  botoes[demanda.status].forEach((novoStatus) => {
    const btn = document.createElement("button");
    btn.textContent = novoStatus[0].toUpperCase() + novoStatus.slice(1);
    btn.onclick = () => mudarStatus(demanda.id, novoStatus);
    div.appendChild(btn);
  });

  return div;
}

function renderizar() {
  const listaPendente = document.getElementById("listaPendente");
  const listaAndamento = document.getElementById("listaAndamento");
  const listaConcluida = document.getElementById("listaConcluida");

  listaPendente.innerHTML = "";
  listaAndamento.innerHTML = "";
  listaConcluida.innerHTML = "";

  demandas.forEach((demanda) => {
    const item = criarItem(demanda);
    if (demanda.status === "pendente") listaPendente.appendChild(item);
    else if (demanda.status === "andamento") listaAndamento.appendChild(item);
    else if (demanda.status === "concluida") listaConcluida.appendChild(item);
  });
}

renderizar();
atualizarGrafico();
