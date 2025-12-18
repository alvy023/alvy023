const mainContentP = document.getElementById('main-content');
const projectsBtn = document.getElementById('projects-btn');
const projectsContainer = document.getElementById('projects-container');

function showProjects() {
    mainContentP?.classList.add('hidden');
    projectsContainer?.classList.remove('hidden');
}

function hideProjects() {
    mainContentP?.classList.remove('hidden');
    projectsContainer?.classList.add('hidden');
}

if (projectsBtn) {
    projectsBtn.addEventListener('click', (e) => {
        // Stop propagation so click doesn't trigger document click listener
        e.stopPropagation();
        showProjects();
    });
}

document.addEventListener('click', (event) => {
    if (projectsContainer && !projectsContainer.classList.contains('hidden')) {
        const target = event.target as Node;
        
        // Check click OUTSIDE projects container
        if (!projectsContainer.contains(target)) {
            hideProjects();
        }
    }
});