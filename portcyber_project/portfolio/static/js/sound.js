// ========================================
// SOUND SYSTEM
// ========================================

document.addEventListener('DOMContentLoaded', (event) => {
    const musicBtn = document.getElementById('music-btn');
    const backgroundMusic = document.getElementById('background-music');

    if (musicBtn && backgroundMusic) {
        musicBtn.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicBtn.classList.add('active');
            } else {
                backgroundMusic.pause();
                musicBtn.classList.remove('active');
            }
        });
    }
});
