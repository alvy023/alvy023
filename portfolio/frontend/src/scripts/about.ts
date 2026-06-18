const mainContentA = document.getElementById('main-content');
const aboutBtn = document.getElementById('about-btn');
const aboutContainer = document.getElementById('about-container');

function showAbout() {
    mainContentA?.classList.add('hidden');
    aboutContainer?.classList.remove('hidden');
}

function hideAbout() {
    mainContentA?.classList.remove('hidden');
    aboutContainer?.classList.add('hidden');
}

if (aboutBtn) {
    aboutBtn.addEventListener('click', (e) => {
        // Stop propagation so click doesn't trigger document click listener
        e.stopPropagation();
        showAbout();
    });
}

document.addEventListener('click', (event) => {
    if (aboutContainer && !aboutContainer.classList.contains('hidden')) {
        const target = event.target as Node;
        
        // Check click OUTSIDE projects container
        if (!aboutContainer.contains(target)) {
            hideAbout();
        }
    }
});