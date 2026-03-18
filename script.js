// --- Elements ---
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const startScreen = document.getElementById('start-screen');
const mainExperience = document.getElementById('main-experience');
const slides = document.querySelectorAll('.slide');

let currentSlideIdx = 0;
let currentInterval = null;

// --- Character Data ---
const characters = [
    {
        id: 'kaneki',
        name: 'Ken Kaneki',
        message: "I am not the protagonist of a novel or anything. I'm just a college student who likes to read... But if, for argument's sake, you were to write a story with me in the lead role, it would certainly be a tragedy. Except today... Today is your birthday. Happy Birthday.",
        readingSpeed: 250
    },
    {
        id: 'tanjiro',
        name: 'Tanjiro Kamado',
        message: "Happy Birthday! No matter how hard things get, you must never give up! I can smell your kindness and strength. Keep moving forward, champion!",
        readingSpeed: 200
    },
    {
        id: 'jinwoo',
        name: 'Sung Jin-Woo',
        message: "Arise! I have faced countless dungeons, but today is about your leveling up. Happy Birthday. You are getting stronger every day.",
        readingSpeed: 220
    },
    {
        id: 'po',
        name: 'Po',
        message: "Skadoosh! Happy Birthday! There is no secret ingredient... it's just you! Let's celebrate with some dumplings after this!",
        readingSpeed: 180
    },
    {
        id: 'minion',
        name: 'Minion',
        message: "Bello! Papoy? Ahahaha! Happy Birthday to you! Banana! Muah!",
        readingSpeed: 150
    },
    {
        id: 'madagascar',
        name: 'Madagascar Cast',
        message: "Hey! We like to move it, move it! Happy Birthday! Stay wild and keep smiling!",
        readingSpeed: 180
    }
];

// --- Simulated Subtitle Engine (No Audio) ---
function speak(character, onEndCallback) {
    if (currentInterval) {
        clearInterval(currentInterval);
    }
    
    const subContainer = document.getElementById(`sub-${character.id}`);
    const words = character.message.split(' ');
    subContainer.innerHTML = words.map((w, i) => `<span class="word" id="word-${character.id}-${i}">${w}</span>`).join(' ');
    
    let wordIndex = 0;
    const wordSpans = subContainer.querySelectorAll('.word');
    
    currentInterval = setInterval(() => {
        if (wordIndex < words.length) {
            wordSpans.forEach((span, i) => {
                if(i < wordIndex) {
                    span.className = 'word spoken';
                } else if (i === wordIndex) {
                    span.className = 'word active';
                } else {
                    span.className = 'word';
                }
            });
            wordIndex++;
        } else {
            clearInterval(currentInterval);
            wordSpans.forEach(span => span.className = 'word spoken');
            if (onEndCallback) onEndCallback();
        }
    }, character.readingSpeed);
}

// --- Navigation ---
function goToSlide(idx) {
    if (idx < 0 || idx >= slides.length) return;
    
    if (currentInterval) {
        clearInterval(currentInterval);
    }
    
    slides[currentSlideIdx].classList.remove('active');
    
    currentSlideIdx = idx;
    
    slides[currentSlideIdx].classList.add('active');
    
    nextBtn.classList.remove('hidden');

    if (currentSlideIdx < characters.length) {
        // Character Slide
        const charInfo = characters[currentSlideIdx];
        setTimeout(() => {
            speak(charInfo);
        }, 1000); // Wait for transition
    } else {
        // Final Slide
        nextBtn.classList.add('hidden');
        fireConfetti();
    }
}

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlideIdx + 1);
});

// --- Click Reactions ---
characters.forEach(char => {
    const imgId = `img-${char.id}`;
    const imgEl = document.getElementById(imgId);
    if(imgEl) {
        imgEl.addEventListener('click', () => {
            // Animation reaction
            imgEl.classList.add('click-react');
            setTimeout(() => imgEl.classList.remove('click-react'), 200);
            
            // Replay Subtitles
            speak(char);
        });
    }
});

// --- Boot ---
if(startBtn) {
    startBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        mainExperience.classList.add('active');
        goToSlide(0);
    });
}

// --- Particle Effects (Simple Vanilla JS) ---
const pCanvas = document.getElementById('particles-canvas');
if(pCanvas) {
    const ctx = pCanvas.getContext('2d');
    let particles = [];
    let animFrame;

    function initParticles() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
        particles = [];
        for(let i=0; i<100; i++) {
            particles.push({
                x: Math.random() * pCanvas.width,
                y: Math.random() * pCanvas.height,
                size: Math.random() * 2,
                speedY: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles.forEach(p => {
            p.y -= p.speedY;
            if(p.y < 0) {
                p.y = pCanvas.height;
                p.x = Math.random() * pCanvas.width;
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        animFrame = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();
}

// --- Confetti Effect (Vanilla JS for Final Scene) ---
const cCanvas = document.getElementById('confetti-canvas');
let cCtx = null;
if(cCanvas) {
    cCtx = cCanvas.getContext('2d');
}
let confetti = [];
const colors = ['#ff0055', '#00ffaa', '#ffaa00', '#00aaff', '#aa00ff', '#ffffff'];

function fireConfetti() {
    if(!cCanvas) return;
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;
    confetti = [];
    for(let i=0; i<300; i++) {
        confetti.push({
            x: Math.random() * cCanvas.width,
            y: Math.random() * -cCanvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 8 + 3,
            speedX: Math.random() * 6 - 3,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 15 - 7
        });
    }
    animateConfetti();
}

function animateConfetti() {
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    let allFinished = true;
    confetti.forEach(c => {
        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotationSpeed;
        if (c.y < cCanvas.height) allFinished = false;
        
        cCtx.save();
        cCtx.translate(c.x, c.y);
        cCtx.rotate(c.rotation * Math.PI / 180);
        cCtx.fillStyle = c.color;
        cCtx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
        cCtx.restore();
    });
    if(!allFinished) {
        requestAnimationFrame(animateConfetti);
    }
}
