
function converterParaSegundos(hora, minuto) {
  return hora * 3600 + minuto * 60;
}

function calcular() {
  const agora = new Date();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();

  const horaFinalInput = document.getElementById("horaFinal").value;
  const gemasAtuais = parseInt(document.getElementById("gemasAtuais").value);
  const isVip = document.getElementById("vip").checked;

  if (!horaFinalInput || isNaN(gemasAtuais)) {
    document.getElementById("resultado").innerHTML = "❌ Preencha todos os campos corretamente!";
    return;
  }

  const [horaFinal, minutoFinal] = horaFinalInput.split(":").map(Number);
  const intervaloSegundos = 80;
  const gemasPorCiclo = isVip ? 6 : 3;

  let tempoAtual = converterParaSegundos(horaAtual, minutoAtual);
  let tempoFinal = converterParaSegundos(horaFinal, minutoFinal);

  if (tempoFinal <= tempoAtual) {
    tempoFinal += 24 * 3600;
  }

  const tempoTotal = tempoFinal - tempoAtual;
  const ciclos = Math.floor(tempoTotal / intervaloSegundos);
  const gemasGanhas = ciclos * gemasPorCiclo;
  const gemasTotais = gemasAtuais + gemasGanhas;

  const horas = Math.floor(tempoTotal / 3600);
  const minutos = Math.floor((tempoTotal % 3600) / 60);

  document.getElementById("resultado").innerHTML = `
    ⏳ Tempo AFK: ${horas}h e ${minutos}min<br>
    🔁 Ciclos completos: ${ciclos}<br>
    💎 Gemas ganhas: +${gemasGanhas}<br>
    💠 Gemas totais: ${gemasTotais}
  `;
}
