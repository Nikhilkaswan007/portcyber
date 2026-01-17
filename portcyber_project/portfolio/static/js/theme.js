// ========================================
// CYBERPUNK THEME - Shared JavaScript
// ========================================

// Three.js Background Setup
function initThreeBackground() {
    const container = document.getElementById('three-background');
    
    if (!container) return; // Skip if no Three.js container
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff3366,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create grid
    const gridHelper = new THREE.GridHelper(100, 50, 0xff3366, 0x333333);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    camera.position.z = 30;
    camera.position.y = 5;

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x = mouseY * 0.1;
        particlesMesh.rotation.z = mouseX * 0.1;

        camera.position.x = mouseX * 2;
        camera.position.y = 5 + mouseY * 2;

        renderer.render(scene, camera);
    }
    animate();

    // Window resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Update time display
function updateTime() {
    const serverTimeEl = document.getElementById('server-time');
    const localTimeEl = document.getElementById('local-time');
    
    if (!serverTimeEl || !localTimeEl) return;

    const now = new Date();
    localTimeEl.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    serverTimeEl.textContent = new Date(now.getTime() - 7 * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

// Settings buttons
function initSettingsButtons() {
    document.querySelectorAll('.setting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Quest panel close
function initQuestPanel() {
    const closeBtn = document.querySelector('.quest-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.querySelector('.quest-panel').style.display = 'none';
        });
    }
}

// Random glitch effect (DISABLED - causes layout shift)
function initGlitchEffect() {
    // Disabled to prevent transform layout issues
    // setInterval(() => {
    //     if (Math.random() > 0.95) {
    //         document.body.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
    //         setTimeout(() => {
    //             document.body.style.transform = 'translate(0, 0)';
    //         }, 50);
    //     }
    // }, 100);
}

// Landing page logo glitch
function initLandingGlitch() {
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            if (Math.random() > 0.9) {
                logo.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    logo.style.transform = 'translate(0, 0)';
                }, 50);
            }
        }, 100);
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    initThreeBackground();
    updateTime();
    setInterval(updateTime, 1000);
    initSettingsButtons();
    initQuestPanel();
    initGlitchEffect();
    initLandingGlitch();
});
