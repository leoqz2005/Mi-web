window.onload = () => {
    // Control de Música
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');

    if (musicBtn && audio) {
        musicBtn.onclick = () => {
            if (audio.paused) {
                audio.play().then(() => {
                    musicBtn.textContent = '🔊 Pausar Música';
                }).catch(() => {});
            } else {
                audio.pause();
                musicBtn.textContent = '🎵 Reproducir Música';
            }
        };
    }

    // Elementos de los Planetas y Puntero
    const earth = document.getElementById('planet-earth');
    const mars = document.getElementById('planet-mars');
    const jupiter = document.getElementById('planet-jupiter');
    const saturn = document.getElementById('planet-saturn');
    const pointer = document.getElementById('earth-pointer');

    // Radios de Órbitas (Basados en el CSS)
    const earthRX = 180, earthRY = 75;
    const marsRX = 270, marsRY = 110;
    const jupiterRX = 380, jupiterRY = 155;
    const saturnRX = 500, saturnRY = 210;

    // Ángulos Iniciales
    let aEarth = 0;
    let aMars = Math.PI * 0.4;
    let aJupiter = Math.PI * 0.9;
    let aSaturn = Math.PI * 1.5;

    function animate() {
        // 1. Tierra + Puntero
        if (earth) {
            aEarth += 0.009;
            const xE = earthRX * Math.cos(aEarth) - 16;
            const yE = earthRY * Math.sin(aEarth) - 16;
            earth.style.setProperty('--x', `${xE}px`);
            earth.style.setProperty('--y', `${yE}px`);

            if (pointer) {
                pointer.style.setProperty('--x', `${xE + 16}px`);
                pointer.style.setProperty('--y', `${yE + 16}px`);
            }
        }

        // 2. Marte
        if (mars) {
            aMars += 0.007;
            const xM = marsRX * Math.cos(aMars) - 14;
            const yM = marsRY * Math.sin(aMars) - 14;
            mars.style.setProperty('--x', `${xM}px`);
            mars.style.setProperty('--y', `${yM}px`);
        }

        // 3. Júpiter
        if (jupiter) {
            aJupiter += 0.004;
            const xJ = jupiterRX * Math.cos(aJupiter) - 23;
            const yJ = jupiterRY * Math.sin(aJupiter) - 23;
            jupiter.style.setProperty('--x', `${xJ}px`);
            jupiter.style.setProperty('--y', `${yJ}px`);
        }

        // 4. Saturno
        if (saturn) {
            aSaturn += 0.0025;
            const xS = saturnRX * Math.cos(aSaturn) - 20;
            const yS = saturnRY * Math.sin(aSaturn) - 20;
            saturn.style.setProperty('--x', `${xS}px`);
            saturn.style.setProperty('--y', `${yS}px`);
        }

        requestAnimationFrame(animate);
    }

    animate();
};