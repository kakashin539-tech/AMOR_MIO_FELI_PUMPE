const pantallaInicio = document.getElementById("pantallaInicio");
const titulo = document.getElementById("tituloPrincipal");
const btnMusJk = document.getElementById("btnMusJk");
const btnMusReal = document.getElementById("btnMusReal");

// Paleta sobria: azul oscuro, azul claro, blanco y negro
const coloresPaleta = ["#0d1b2a", "#1b3b6f", "#8ecae6", "#cbe0f0", "#ffffff"];

let audioCtx = null;

// Cambia ".mp3" por ".ogg" o ".wav" si tus archivos tienen otra extensión
const pistaJk = new Audio("audio/mus_jk.mp3");
const pistaReal = new Audio("audio/mus_real.mp3");
pistaJk.loop = true;
pistaReal.loop = true;

let pistaActual = null;

function alternarAudio(audio, boton) {
  if (!audio || !boton) return;

  if (pistaActual === audio && !audio.paused) {
    audio.pause();
    boton.classList.remove("activo");
    pistaActual = null;
    return;
  }

  [pistaJk, pistaReal].forEach((pista) => {
    pista.pause();
    pista.currentTime = 0;
  });
  [btnMusJk, btnMusReal].forEach((btn) => {
    if (btn) btn.classList.remove("activo");
  });

  audio.play().catch((err) => {
    console.warn("No se pudo reproducir el audio:", err);
  });

  boton.classList.add("activo");
  pistaActual = audio;
}

if (btnMusJk) {
  btnMusJk.addEventListener("click", () => alternarAudio(pistaJk, btnMusJk));
}

if (btnMusReal) {
  btnMusReal.addEventListener("click", () => alternarAudio(pistaReal, btnMusReal));
}

function tocarNarizFreddy() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const ahora = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const ganancia = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, ahora);
    osc.frequency.exponentialRampToValueAtTime(920, ahora + 0.05);
    osc.frequency.exponentialRampToValueAtTime(540, ahora + 0.16);

    ganancia.gain.setValueAtTime(0.01, ahora);
    ganancia.gain.linearRampToValueAtTime(0.45, ahora + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.18);

    osc.connect(ganancia);
    ganancia.connect(audioCtx.destination);

    osc.start(ahora);
    osc.stop(ahora + 0.19);
  } catch (err) {
    console.warn("No se pudo reproducir el sonido:", err);
  }
}

function lanzarConfetiYSonido() {
  tocarNarizFreddy();

  if (typeof confetti === "function" && titulo) {
    const rect = titulo.getBoundingClientRect();
    const xCentro = (rect.left + rect.width / 2) / window.innerWidth;
    const yCentro = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 75,
      startVelocity: 30,
      origin: { x: xCentro, y: yCentro },
      colors: coloresPaleta
    });
  }
}

function abrirSorpresa() {
  if (!pantallaInicio) return;
  pantallaInicio.classList.add("oculto");
  setTimeout(() => {
    pantallaInicio.style.display = "none";
  }, 600);

  lanzarConfetiYSonido();
  if (!window.intervaloSorpresa) {
    window.intervaloSorpresa = setInterval(lanzarConfetiYSonido, 6000);
  }
}

if (pantallaInicio) {
  pantallaInicio.addEventListener("click", abrirSorpresa, { once: true });
}