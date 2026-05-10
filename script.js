"use strict";

const INTERVALO_SEGUNDOS = 80;
const GEMAS_NORMAL = 3;
const GEMAS_VIP = 6;
const DIA_EM_SEGUNDOS = 24 * 60 * 60;

const STORAGE_KEYS = {
  gemasAtuais: "calculadoraAfk.gemasAtuais",
  horaFinal: "calculadoraAfk.horaFinal",
  vip: "calculadoraAfk.vip",
  musicaAtiva: "calculadoraAfk.musicaAtiva",
};

function converterParaSegundos(hora, minuto, segundo = 0) {
  return hora * 3600 + minuto * 60 + segundo;
}

function obterSegundosDoHorario(horario) {
  const [hora, minuto] = horario.split(":").map(Number);
  return converterParaSegundos(hora, minuto);
}

function obterSegundosDoDate(data) {
  return converterParaSegundos(data.getHours(), data.getMinutes(), data.getSeconds());
}

function validarGemas(valor) {
  const texto = String(valor).trim();

  if (!texto) {
    return { ok: false, mensagem: "Informe a quantidade atual de gemas." };
  }

  if (texto.startsWith("-")) {
    return { ok: false, mensagem: "As gemas nao podem ser negativas." };
  }

  if (!/^\d+$/.test(texto)) {
    return { ok: false, mensagem: "Use apenas numeros inteiros no campo de gemas." };
  }

  const gemas = Number(texto);

  if (!Number.isSafeInteger(gemas)) {
    return { ok: false, mensagem: "Informe uma quantidade menor de gemas." };
  }

  return { ok: true, valor: gemas };
}

function validarHorario(valor) {
  const horario = String(valor).trim();
  const formatoValido = /^([01]\d|2[0-3]):([0-5]\d)$/.test(horario);

  if (!horario) {
    return { ok: false, mensagem: "Escolha a hora final do farm." };
  }

  if (!formatoValido) {
    return { ok: false, mensagem: "Use um horario valido no formato HH:MM." };
  }

  return { ok: true, valor: horario };
}

function calcularDuracaoAteHorario(agora, horarioFinal) {
  const segundosAtuais = obterSegundosDoDate(agora);
  let segundosFinais = obterSegundosDoHorario(horarioFinal);

  if (segundosFinais <= segundosAtuais) {
    segundosFinais += DIA_EM_SEGUNDOS;
  }

  return segundosFinais - segundosAtuais;
}

function calcularFarm({
  gemasAtuais,
  horarioFinal,
  vip,
  agora = new Date(),
  intervaloSegundos = INTERVALO_SEGUNDOS,
  gemasNormal = GEMAS_NORMAL,
  gemasVip = GEMAS_VIP,
}) {
  const tempoTotalSegundos = calcularDuracaoAteHorario(agora, horarioFinal);
  const ciclos = Math.floor(tempoTotalSegundos / intervaloSegundos);
  const gemasPorCiclo = vip ? gemasVip : gemasNormal;
  const gemasGanhas = ciclos * gemasPorCiclo;

  return {
    tempoTotalSegundos,
    ciclos,
    gemasPorCiclo,
    gemasGanhas,
    gemasTotais: gemasAtuais + gemasGanhas,
  };
}

function formatarDuracao(segundosTotais) {
  const horas = Math.floor(segundosTotais / 3600);
  const minutos = Math.floor((segundosTotais % 3600) / 60);
  const segundos = segundosTotais % 60;

  return `${horas}h ${minutos}min ${segundos}s`;
}

function lerStorage(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function salvarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    // O calculo continua funcionando mesmo se o navegador bloquear localStorage.
  }
}

function criarMetrica(rotulo, valor, destaque = false) {
  const item = document.createElement("article");
  item.className = destaque ? "metric metric--highlight" : "metric";

  const label = document.createElement("span");
  label.className = "metric__label";
  label.textContent = rotulo;

  const value = document.createElement("strong");
  value.className = "metric__value";
  value.textContent = valor;

  item.append(label, value);
  return item;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculatorForm");
  const gemasInput = document.getElementById("gemasAtuais");
  const horaInput = document.getElementById("horaFinal");
  const vipInput = document.getElementById("vip");
  const resultPanel = document.getElementById("resultPanel");
  const music = document.getElementById("backgroundMusic");
  const soundToggle = document.getElementById("soundToggle");

  let audioDisponivel = true;
  let musicaAtiva = lerStorage(STORAGE_KEYS.musicaAtiva) === "true";

  function limparErro(campoId, input, erroId) {
    document.getElementById(campoId).classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    document.getElementById(erroId).textContent = "";
  }

  function exibirErro(campoId, input, erroId, mensagem) {
    document.getElementById(campoId).classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    document.getElementById(erroId).textContent = mensagem;
  }

  function exibirErroGeral(mensagem) {
    const erro = document.createElement("p");
    erro.className = "result-panel__error";
    erro.textContent = mensagem;
    resultPanel.replaceChildren(erro);
  }

  function exibirResultado(resultado) {
    const grid = document.createElement("div");
    grid.className = "result-grid";
    grid.append(
      criarMetrica("Tempo AFK", formatarDuracao(resultado.tempoTotalSegundos)),
      criarMetrica("Ciclos completos", String(resultado.ciclos)),
      criarMetrica("Gemas ganhas", `+${resultado.gemasGanhas}`),
      criarMetrica("Gemas totais", String(resultado.gemasTotais), true),
    );

    resultPanel.replaceChildren(grid);
  }

  function carregarPreferencias() {
    const gemasSalvas = lerStorage(STORAGE_KEYS.gemasAtuais);
    const horaSalva = lerStorage(STORAGE_KEYS.horaFinal);
    const vipSalvo = lerStorage(STORAGE_KEYS.vip);

    if (gemasSalvas !== null) {
      gemasInput.value = gemasSalvas;
    }

    if (horaSalva !== null) {
      horaInput.value = horaSalva;
    }

    vipInput.checked = vipSalvo === "true";
  }

  function salvarPreferencias(gemasAtuais, horarioFinal, vip) {
    salvarStorage(STORAGE_KEYS.gemasAtuais, String(gemasAtuais));
    salvarStorage(STORAGE_KEYS.horaFinal, horarioFinal);
    salvarStorage(STORAGE_KEYS.vip, String(vip));
  }

  function atualizarBotaoSom() {
    soundToggle.setAttribute("aria-pressed", String(musicaAtiva));
    soundToggle.setAttribute(
      "aria-label",
      musicaAtiva ? "Desativar musica de fundo" : "Ativar musica de fundo",
    );
    soundToggle.title = musicaAtiva ? "Desativar musica" : "Ativar musica";
  }

  function definirMusicaAtiva(ativa) {
    musicaAtiva = ativa;
    salvarStorage(STORAGE_KEYS.musicaAtiva, String(ativa));
    atualizarBotaoSom();
  }

  function marcarAudioIndisponivel() {
    audioDisponivel = false;
    soundToggle.disabled = true;
    soundToggle.title = "Coloque um theme.mp3 autorizado em assets/audio/";
    soundToggle.setAttribute("aria-label", "Musica indisponivel");
  }

  function pausarMusica() {
    music.pause();
    music.muted = true;
    definirMusicaAtiva(false);
  }

  function tentarTocarMusica() {
    if (!audioDisponivel || !musicaAtiva) {
      return;
    }

    music.muted = false;
    music.play().catch(() => {
      definirMusicaAtiva(false);
      soundToggle.title = "Clique para ativar a musica";
    });
  }

  function registrarInteracao() {
    tentarTocarMusica();
  }

  function ativarMusica() {
    if (!audioDisponivel) {
      return;
    }

    definirMusicaAtiva(true);
    tentarTocarMusica();
  }

  carregarPreferencias();
  music.muted = !musicaAtiva;
  atualizarBotaoSom();

  window.addEventListener("pointerdown", registrarInteracao, { once: true });
  window.addEventListener("keydown", registrarInteracao, { once: true });
  music.addEventListener("error", marcarAudioIndisponivel);

  gemasInput.addEventListener("input", () => {
    limparErro("gemasField", gemasInput, "gemasError");
  });

  horaInput.addEventListener("input", () => {
    limparErro("horaField", horaInput, "horaError");
  });

  soundToggle.addEventListener("click", () => {
    if (!audioDisponivel) {
      return;
    }

    if (musicaAtiva) {
      pausarMusica();
      return;
    }

    ativarMusica();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const gemas = validarGemas(gemasInput.value);
    const horario = validarHorario(horaInput.value);

    limparErro("gemasField", gemasInput, "gemasError");
    limparErro("horaField", horaInput, "horaError");

    if (!gemas.ok) {
      exibirErro("gemasField", gemasInput, "gemasError", gemas.mensagem);
    }

    if (!horario.ok) {
      exibirErro("horaField", horaInput, "horaError", horario.mensagem);
    }

    if (!gemas.ok || !horario.ok) {
      exibirErroGeral("Revise os campos destacados para calcular o farm.");
      return;
    }

    const resultado = calcularFarm({
      gemasAtuais: gemas.valor,
      horarioFinal: horario.valor,
      vip: vipInput.checked,
    });

    salvarPreferencias(gemas.valor, horario.valor, vipInput.checked);
    exibirResultado(resultado);
  });
});
