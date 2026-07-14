/* =========================================================
   ROUSS · 20 AÑOS — lógica interactiva
   ========================================================= */

// ---------------------------------------------------------
// ✍️ EDITA AQUÍ TU MENSAJE PERSONAL PARA LA CARTA
// Puedes usar saltos de línea normales, se respetan tal cual.
// ---------------------------------------------------------
const MENSAJE_CARTA = `Rouss es tu cumpleaños, valoro la oportunidad de poder enviarte un mensaje.
Aunque no sea un regalo en físico, deseo enviártelo. Tiene bastantes detalles, no es solo un mensaje aburrido que debas leer. 

Después de bastante tiempo te hice un regalo. Cuantos inviernos y primaveras pasaron, ya tienes 20. Ya eres docente persigues tus sueños, y me siento muy feliz de que sea así. 

Por esa razón te obsequio mis mejores deseos. Recita versos, canta, baila, escucha tus canciones favoritas. Abraza a las personas que amas, agradece una vez más a Dios y a la vida que te ponen la dirección correcta para que cumplas tus sueños día tras día. 

Una parte mía se siente orgulloso de que hayas mejorado muchísimo.  De que tengas a las personas correctas a tu lado. 

Y la otra parte siente con pesar no estar presente para escucharte y decirte tantas cosas que llevo guardando tanto tiempo. 

Entre varios lugares, horarios y estaciones, decido centrarme en el día de tu cumpleaños, Srta Rouss disfruta de este día con fervor, con inocencia, con alegría, con sosiego, con integridad y compromiso. 

Que Dios te guarde, proteja y guíe tu camino. Feliz cumpleaños Srta. Roussmery`;

const TOTAL_VELAS = 20;
const SEGUNDOS_DESEO = 20;

document.addEventListener('DOMContentLoaded', () => {

  // ---------- referencias ----------
  const contenedorVelas   = document.getElementById('velas');
  const escena            = document.getElementById('escena-interactiva');
  const torta              = document.getElementById('torta');
  const regaloFinal        = document.getElementById('regalo-final');
  const audio              = document.getElementById('audio-cumple');
  const textoGuia          = document.getElementById('texto-guia');
  const contadorDeseo      = document.getElementById('contador-deseo');
  const numeroContador     = document.getElementById('numero-contador');
  const platoIzq           = document.getElementById('plato-izq');
  const platoDer           = document.getElementById('plato-der');
  const confetiContenedor  = document.getElementById('confeti-contenedor');
  const cartaOverlay       = document.getElementById('carta-overlay');
  const cartaScroll        = document.getElementById('carta-scroll');
  const cartaTextoEl       = document.getElementById('carta-texto');
  const cartaCerrar        = document.getElementById('carta-cerrar');

  cartaTextoEl.textContent = MENSAJE_CARTA;

  // salvaguarda: asegurar que el audio nunca suene antes del primer toque
  audio.autoplay = false;
  audio.pause();

  // ---------- crear las 20 velitas ----------
  for (let i = 0; i < TOTAL_VELAS; i++) {
    const vela = document.createElement('div');
    vela.className = 'vela';
    vela.innerHTML = '<span class="mecha"></span><span class="flama"></span>';
    contenedorVelas.appendChild(vela);
  }
  const velas = contenedorVelas.querySelectorAll('.vela');

  // ---------- estado ----------
  // idle -> lit -> wishing -> granted
  let estado = 'idle';
  let cuentaRegresivaId = null;

  function encenderVelas() {
    velas.forEach(v => v.classList.add('encendida'));
  }
  function apagarVelas() {
    velas.forEach(v => v.classList.remove('encendida'));
  }

  function reproducirCancion() {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // el navegador puede bloquear autoplay sin interacción previa;
      // como esto ocurre dentro de un click, normalmente se permite.
    });
  }
  function pausarCancion() {
    audio.pause();
  }

  function lanzarConfeti() {
    const colores = ['#ff6fa0', '#ffd35c', '#b083ff', '#5fb3ff', '#4fd3c4'];
    for (let i = 0; i < 60; i++) {
      const pieza = document.createElement('span');
      pieza.className = 'confeti';
      pieza.style.left = Math.random() * 100 + '%';
      pieza.style.background = colores[Math.floor(Math.random() * colores.length)];
      pieza.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      pieza.style.animationDelay = (Math.random() * 0.5) + 's';
      pieza.style.width = (5 + Math.random() * 5) + 'px';
      pieza.style.height = pieza.style.width;
      confetiContenedor.appendChild(pieza);
      setTimeout(() => pieza.remove(), 3600);
    }
  }

  function revelarRegalo() {
    torta.classList.add('oculto');
    regaloFinal.classList.add('mostrar');
    if (platoIzq) platoIzq.classList.add('mostrar');
    if (platoDer) platoDer.classList.add('mostrar');
    lanzarConfeti();
  }

  function actualizarTexto(mensaje) {
    textoGuia.textContent = mensaje;
  }

  function iniciarCuentaDeseo() {
    let restante = SEGUNDOS_DESEO;
    numeroContador.textContent = restante;
    contadorDeseo.hidden = false;

    cuentaRegresivaId = setInterval(() => {
      restante--;
      numeroContador.textContent = restante;
      if (restante <= 0) {
        clearInterval(cuentaRegresivaId);
        contadorDeseo.hidden = true;
        apagarVelas();
        estado = 'granted';
        actualizarTexto('¡Deseo cumplido! Toca el regalo 🎁');
        revelarRegalo();
      }
    }, 1000);
  }

  // ---------- manejador principal de clicks sobre la escena ----------
  function manejarClickEscena() {
    if (estado === 'idle') {
      estado = 'lit';
      encenderVelas();
      reproducirCancion();
      actualizarTexto('Haz click para pedir un deseo 🌠 (tendrás 20 segundos para pensarlo)');
      return;
    }

    if (estado === 'lit') {
      estado = 'wishing';
      pausarCancion();
      actualizarTexto('Cierra los ojos y piensa tu deseo…');
      iniciarCuentaDeseo();
      return;
    }

    // durante 'wishing' o 'granted' los clicks sobre la torta ya no hacen nada
  }

  escena.addEventListener('click', manejarClickEscena);
  escena.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      manejarClickEscena();
    }
  });

  // ---------- click en el regalo final: abre la carta ----------
  regaloFinal.addEventListener('click', (e) => {
    e.stopPropagation();
    if (estado !== 'granted') return;
    cartaOverlay.hidden = false;
    // siempre abrir con el scroll al inicio del mensaje
    if (cartaScroll) cartaScroll.scrollTop = 0;
  });

  function cerrarCarta() {
    cartaOverlay.hidden = true;
  }
  cartaCerrar.addEventListener('click', cerrarCarta);
  cartaOverlay.addEventListener('click', (e) => {
    if (e.target === cartaOverlay) cerrarCarta();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartaOverlay.hidden) cerrarCarta();
  });
});