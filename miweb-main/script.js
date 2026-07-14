const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function interpolateColor(color1, color2, factor) {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    return rgbToHex(r, g, b);
}

const stars = [];
const shootingStars = [];
const fallingElements = [];
const clickEffects = []; 

const phrases = [

"HOY CELEBRAMOS A UNA PERSONA ESPECIAL",
"QUE ESTE AÑO VENGA ACOMPAÑADO DE MUCHOS EXITOS Y SONRISAS",
"DISFRUTA AL MAXIMO TU DIA",
"ROUSS FELIZ CUMPLEAÑOS",
"QUE TODOS TUS DESEOS SE HAGAN REALIDAD",
"PASALA INCREIBLE! FELIZ CUMPLEAÑOS",
"QUE NUNCA TE FALTEN MOTIVOS PARA SONREIR",
"ERES UNA PERSONA UNICA Y MUY ESPECIAL",
"QUE LA FELICIDAD TE ACOMPAÑE SIEMPRE",
"QUE CADA DIA SEA MEJOR QUE EL ANTERIOR",
"SIGUE BRILLANDO COMO SIEMPRE LO HACES",
"QUE TUS SUEÑOS SE CONVIERTAN EN REALIDAD",
"ESPERO QUE ESTE DIA SEA TAN BONITO COMO TU SONRISA",
"GRACIAS POR ILUMINAR LA VIDA DE QUIENES TE RODEAN",
"QUE DIOS BENDIGA CADA PASO QUE DES",
"QUE NUNCA PIERDAS ESA LINDA FORMA DE SER",
"HOY ES TU DIA, DISFRUTALO AL MAXIMO",
"QUE LA ALEGRIA TE ACOMPAÑE TODO EL AÑO",
"ERES EL MOTIVO DE MUCHAS SONRISAS",
"QUE ESTE NUEVO AÑO DE VIDA ESTE LLENO DE MOMENTOS INOLVIDABLES",
"SIGUE CUMPLIENDO TUS METAS Y SUEÑOS",
"QUE SIEMPRE ENCUENTRES RAZONES PARA SER FELIZ",
"TU SONRISA HACE MAS BONITO EL MUNDO",
"QUE CADA DESEO QUE PIDAS SE HAGA REALIDAD",
"HOY EL UNIVERSO CELEBRA CONTIGO",
"20 AÑOS LLENOS DE LUZ, ALEGRIA Y ESPERANZA",
"QUE ESTA NUEVA ETAPA ESTE LLENA DE AVENTURAS",
"SIGUE SIENDO ESA PERSONA TAN INCREIBLE",
"QUE LA VIDA TE SORPRENDA CON COSAS HERMOSAS",
"FELICES 20 AÑOS ROUSS",
"QUE ESTE CUMPLEAÑOS SEA INOLVIDABLE",
"SONRIE MUCHO, HOY TODO ES PARA TI",
"DISFRUTA CADA SEGUNDO DE ESTE DIA ESPECIAL",
"SIEMPRE HABRA MOTIVOS PARA CELEBRARTE",
"QUE TU CORAZON SIEMPRE ESTE LLENO DE FELICIDAD",
"ERES UNA PERSONA QUE MERECE LO MEJOR",
"GRACIAS POR EXISTIR, ROUSS",
"QUE TU VIDA ESTE LLENA DE AMOR Y PAZ",
"HOY TODO BRILLA PORQUE ES TU CUMPLEAÑOS",
"QUE LOS MEJORES RECUERDOS COMIENCEN HOY",
"FELIZ CUMPLEAÑOS A UNA CHICA EXTRAORDINARIA",
"SIGUE HACIENDO FELICES A QUIENES TE CONOCEN",
"QUE LA SUERTE SIEMPRE ESTE DE TU LADO",
"QUE CADA PASO TE ACERQUE A TUS SUEÑOS",
"TU ALEGRIA HACE ESPECIAL ESTE DIA",
"QUE NUNCA DEJES DE CREER EN TI",
"FELIZ CUMPLEAÑOS, QUE SEAS MUY FELIZ"

];
const images = [
    'https://png.pngtree.com/png-vector/20220619/ourmid/pngtree-sparkling-star-vector-icon-glitter-star-shape-png-image_5228522.png'
];

const heartImages = [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
    '7.png', '8.png', '9.png', '10.png', '11.png', '12.png'
];

const textColorsCycle = [
    '#FF6FB5', 
    '#5ec9ff', 
    '#FFFFFF', 
    '#C77DFF', 
    '#FFD27D', 
    '#8ED1FC'  
];
let currentColorIndex = 0;
let nextColorIndex = 1;
let transitionProgress = 0;
const transitionSpeed = 0.005;

let cameraX = 0;
let cameraY = 0;
let zoomLevel = 1;
const focalLength = 300; 

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let totalDragDist = 0; 

// --- Luna en la esquina superior derecha ---
const moonImg = new Image();
moonImg.src = 'luna.png'; 

function drawMoon() {
    if (moonImg.complete && moonImg.naturalHeight !== 0) {
        ctx.save();
        const size = Math.max(80, Math.min(150, canvas.width * 0.18)); 
        const x = canvas.width - size - (canvas.width < 600 ? 15 : 30); 
        const y = canvas.width < 600 ? 75 : 30; 
        
        ctx.shadowColor = 'rgba(255, 234, 167, 0.4)';
        ctx.shadowBlur = size * 0.2;
        ctx.drawImage(moonImg, x, y, size, size);
        ctx.restore();
    }
}

// --- Astronautas flotantes (Espaciado Mejorado) ---
const astronautImages = ['astronauta1.png', 'astronauta2.png'];
const astronauts = astronautImages.map((src, i) => {
    const img = new Image();
    img.src = src;
    return {
        img: img,
        baseSize: 250, 
        xOffsetRatio: i === 0 ? -0.11 : 0.11, // Un poco más de separación base
        floatSpeed: 0.0015 + i * 0.0004,
        floatAmplitude: 15 + i * 5,
        floatPhase: i * Math.PI,
        rotatePhase: i * Math.PI / 2
    };
});
let astronautTime = 0;

function drawAstronauts() {
    astronautTime += 1;

    const screenScale = Math.min(canvas.width, canvas.height) / 900;
    const isMobile = canvas.width < 600;

    astronauts.forEach(a => {
        if (!a.img.complete || a.img.naturalHeight === 0) return;

        const aspect = a.img.naturalWidth / a.img.naturalHeight;
        
        // Si es móvil, escalamos hacia arriba y ponemos un tamaño mínimo mucho mayor (180px)
        const h = isMobile 
            ? Math.max(180, a.baseSize * screenScale * 1.4) 
            : Math.max(120, a.baseSize * screenScale);
        const w = h * aspect;

        // Mantenemos la separación responsiva para que no se encimen con el nuevo tamaño
        const responsiveRatio = isMobile ? a.xOffsetRatio * 1.6 : a.xOffsetRatio;
        const baseX = canvas.width / 2 + canvas.width * responsiveRatio;
        const baseY = canvas.height - h * 0.85; 

        const floatY = Math.sin(astronautTime * a.floatSpeed + a.floatPhase) * a.floatAmplitude * (isMobile ? 0.6 : 1);
        const floatX = Math.cos(astronautTime * a.floatSpeed * 0.7 + a.floatPhase) * (a.floatAmplitude * 0.3);
        const rotation = Math.sin(astronautTime * a.floatSpeed * 0.8 + a.rotatePhase) * 0.06;

        ctx.save();
        ctx.translate(baseX + floatX, baseY + floatY);
        ctx.rotate(rotation);
        ctx.shadowColor = 'rgba(94, 201, 255, 0.4)';
        ctx.shadowBlur = 15;
        ctx.drawImage(a.img, -w / 2, -h / 2, w, h);
        ctx.restore();
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars.length = 0;
    const starCount = canvas.width < 600 ? 150 : 300; 
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            delta: (Math.random() * 0.02) + 0.005
        });
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0a1a3d"); 
    gradient.addColorStop(0.5, "#2a1750"); 
    gradient.addColorStop(1, "#3d0f3d"); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
    stars.forEach(star => {
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
        ctx.save();
        ctx.globalAlpha = Math.min(1, star.alpha + 0.15);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#5ec9ff";
        ctx.shadowBlur = star.radius * 5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function createShootingStar() {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height / 2;
    shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * (canvas.width < 600 ? 150 : 300) + 80,
        speed: Math.random() * 8 + 5,
        angle: Math.PI / 4,
        opacity: 1
    });
}

function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        const endX = s.x - Math.cos(s.angle) * s.length;
        const endY = s.y - Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(s.x, s.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.012;

        if (s.opacity <= 0) {
            shootingStars.splice(i, 1);
        }
    }
}

function createFallingElement() {
    const rand = Math.random();
    let type;
    if (rand < 0.6) {
        type = 'phrase';
    } else if (rand < 0.8) {
        type = 'image';
    } else {
        type = 'heart';
    }

    const minZ = focalLength * 1.5;
    const maxZ = focalLength * 5;
    const initialZ = minZ + Math.random() * (maxZ - minZ);

    const worldPlaneWidth = (canvas.width / focalLength) * maxZ;
    const worldPlaneHeight = (canvas.height / focalLength) * maxZ;

    const bufferFactor = 1.1; 
    const spawnRangeX = worldPlaneWidth * bufferFactor;
    const spawnRangeY = worldPlaneHeight * bufferFactor;

    const initialX = ((Math.random() + Math.random() - 1) * 0.5) * spawnRangeX;
    const initialY = ((Math.random() + Math.random() - 1) * 0.5) * spawnRangeY;

    let content;
    let baseSize;

    if (type === 'phrase') {
        content = phrases[Math.floor(Math.random() * phrases.length)];
        baseSize = canvas.width < 600 ? 22 : 32; 
    } else if (type === 'heart') {
        content = new Image();
        content.src = heartImages[Math.floor(Math.random() * heartImages.length)];
        content.onload = () => {};
        content.onerror = () => {
            const index = fallingElements.findIndex(el => el.content === content);
            if (index > -1) fallingElements.splice(index, 1);
        };
        // Agrandado notablemente (antes era 35 en móvil / 50 en PC)
        baseSize = canvas.width < 600 ? 55 : 75;
    } else { 
        content = new Image();
        content.src = images[Math.floor(Math.random() * images.length)];
        content.onload = () => {};
        content.onerror = () => {
            const index = fallingElements.findIndex(el => el.content === content);
            if (index > -1) fallingElements.splice(index, 1);
        };
        // Agrandado notablemente (antes era 35 en móvil / 50 en PC)
        baseSize = canvas.width < 600 ? 55 : 75;
    }

    fallingElements.push({
        type: type,
        content: content,
        x: initialX,
        y: initialY,
        z: initialZ,
        baseSize: baseSize,
        speedZ: Math.random() * 4 + 2,
    });
}

function drawFallingElements() {
    const currentTextColor = interpolateColor(
        textColorsCycle[currentColorIndex],
        textColorsCycle[nextColorIndex],
        transitionProgress
    );

    for (let i = fallingElements.length - 1; i >= 0; i--) {
        const el = fallingElements[i];

        el.z -= el.speedZ * zoomLevel;

        if (el.z <= 0) {
            fallingElements.splice(i, 1);
            createFallingElement();
            continue;
        }

        const perspectiveScale = focalLength / el.z;

        const size = el.baseSize * perspectiveScale * zoomLevel;
        const opacity = Math.max(0, Math.min(1, perspectiveScale));

        const displayX = (el.x - cameraX) * perspectiveScale + canvas.width / 2;
        const displayY = (el.y - cameraY) * perspectiveScale + canvas.height / 2;

        ctx.save();
        ctx.globalAlpha = opacity;

        if (el.type === 'phrase') {
            ctx.fillStyle = currentTextColor;
            ctx.font = `${size}px 'Indie Flower', cursive`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.shadowColor = currentTextColor;
            ctx.shadowBlur = 5 * perspectiveScale;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillText(el.content, displayX, displayY);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

        } else if ((el.type === 'image' || el.type === 'heart') && el.content.complete && el.content.naturalHeight !== 0) {
            ctx.drawImage(el.content, displayX - size / 2, displayY - size / 2, size, size);
        }

        ctx.restore();

        if ((displayX + size / 2 < 0 || displayX - size / 2 > canvas.width ||
             displayY + size / 2 < 0 || displayY - size / 2 > canvas.height) && el.z > focalLength) {
            fallingElements.splice(i, 1);
            createFallingElement();
        }
    }
}

// --- Animación de Clic Responsiva (¡Feliz Cumpleaños!) ---
function triggerClickAnimation(x, y) {
    const isMobile = canvas.width < 600;

    clickEffects.push({
        type: 'text',
        text: '¡FELIZ CUMPLEAÑOS ROUSS! 👩🏽‍🎓🤗',
        x: x,
        y: y,
        alpha: 1,
        scale: 1,
        color: textColorsCycle[Math.floor(Math.random() * textColorsCycle.length)]
    });

    const particleCount = isMobile ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isMobile ? 4 : 6) + 2;
        clickEffects.push({
            type: 'particle',
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5, 
            alpha: 1,
            size: Math.random() * (isMobile ? 6 : 10) + 5,
            color: textColorsCycle[Math.floor(Math.random() * textColorsCycle.length)],
            isHeart: Math.random() > 0.4
        });
    }
}

function drawMiniHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.quadraticCurveTo(x, y, x - size / 2, y);
    ctx.quadraticCurveTo(x - size, y, x - size, y + size / 2);
    ctx.quadraticCurveTo(x - size, y + size, x, y + size * 1.3);
    ctx.quadraticCurveTo(x + size, y + size, x + size, y + size / 2);
    ctx.quadraticCurveTo(x + size, y, x + size / 2, y);
    ctx.quadraticCurveTo(x, y, x, y + size / 4);
    ctx.closePath();
    ctx.fill();
}

function drawClickEffects() {
    const isMobile = canvas.width < 600;
    for (let i = clickEffects.length - 1; i >= 0; i--) {
        const eff = clickEffects[i];
        eff.alpha -= 0.012; 

        if (eff.alpha <= 0) {
            clickEffects.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = eff.alpha;

        if (eff.type === 'text') {
            eff.y -= 1.0; 
            eff.scale += 0.004; 
            ctx.fillStyle = eff.color;
            const baseFont = isMobile ? 18 : 26;
            ctx.font = `bold ${baseFont * eff.scale}px 'Dancing Script', cursive`;
            ctx.textAlign = 'center';
            ctx.shadowColor = eff.color;
            ctx.shadowBlur = 12;
            ctx.fillText(eff.text, eff.x, eff.y);
        } else if (eff.type === 'particle') {
            eff.x += eff.vx;
            eff.y += eff.vy;
            eff.vy += 0.07; 

            ctx.fillStyle = eff.color;
            ctx.shadowColor = eff.color;
            ctx.shadowBlur = 10;

            if (eff.isHeart) {
                drawMiniHeart(eff.x, eff.y, eff.size);
            } else {
                ctx.beginPath();
                ctx.arc(eff.x, eff.y, eff.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}

// --- Bucle de Animación Principal ---
function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawStars();
    drawMoon(); 
    drawShootingStars();
    drawFallingElements();
    drawClickEffects(); 
    drawAstronauts();

    transitionProgress += transitionSpeed;
    if (transitionProgress >= 1) {
        transitionProgress = 0;
        currentColorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % textColorsCycle.length;
    }
}

const audio = document.getElementById('mi-audio');
const playBtn = document.getElementById('btn-play');

playBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<span class="nota-musical">⏸️</span> Pausar Música';
    } else {
        audio.pause();
        playBtn.innerHTML = '<span class="nota-musical">🎵</span> Reproducir Música';
    }
});

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scaleAmount = 0.1;
    if (event.deltaY < 0) {
        zoomLevel += scaleAmount;
    } else {
        zoomLevel -= scaleAmount;
    }
    zoomLevel = Math.max(0.1, Math.min(zoomLevel, 5));
}, { passive: false });

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    totalDragDist = 0;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;

    cameraX -= dx / zoomLevel;
    cameraY -= dy / zoomLevel;

    totalDragDist += Math.sqrt(dx * dx + dy * dy);

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mouseup', (e) => {
    isDragging = false;
    canvas.style.cursor = 'grab';

    if (totalDragDist < 6) {
        triggerClickAnimation(e.clientX, e.clientY);
    }
});

function getTouchPos(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
}

canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    const pos = getTouchPos(e);
    lastMouseX = pos.x;
    lastMouseY = pos.y;
    totalDragDist = 0;
});

canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const pos = getTouchPos(e);
    const dx = pos.x - lastMouseX;
    const dy = pos.y - lastMouseY;

    cameraX -= dx / zoomLevel;
    cameraY -= dy / zoomLevel;

    totalDragDist += Math.sqrt(dx * dx + dy * dy);

    lastMouseX = pos.x;
    lastMouseY = pos.y;
});

canvas.addEventListener('touchend', (e) => {
    isDragging = false;
    if (totalDragDist < 10) {
        const pos = getTouchPos(e);
        triggerClickAnimation(pos.x, pos.y);
    }
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.style.cursor = 'default';
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
animate();

setInterval(createShootingStar, 500);

const isMobile = window.innerWidth < 600;
const initialFallingElementsCount = isMobile ? 25 : 50;
for (let i = 0; i < initialFallingElementsCount; i++) {
    createFallingElement();
}

setInterval(createFallingElement, isMobile ? 180 : 100);