// ========================================
// THREE.JS BACKGROUND & ANIMATION
// ========================================

function initThreeBackground() {
    const container = document.getElementById('three-background');
    
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.systemState.settings.performanceMode ? 1000 : 2000;
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
    window.particlesMesh = particlesMesh;

    // Create grid
    const gridHelper = new THREE.GridHelper(100, 50, 0xff3366, 0x333333);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    camera.position.z = 30;
    camera.position.y = 5;

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const motionFactor = window.systemState.settings.motionLevel / 100;
        
        particlesMesh.rotation.y += 0.001 * motionFactor;
        particlesMesh.rotation.x = mouseY * 0.1 * motionFactor;
        particlesMesh.rotation.z = mouseX * 0.1 * motionFactor;

        camera.position.x = mouseX * 2 * motionFactor;
        camera.position.y = 5 + mouseY * 2 * motionFactor;

        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, particlesMesh };
}

// Initialize Three.js on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.systemState.bootComplete) {
            initThreeBackground();
        }
    }, 100);
});
