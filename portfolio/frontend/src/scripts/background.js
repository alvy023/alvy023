// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.139.0/build/three.module.js';
import * as THREE from 'three';

// Set up the scene
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 20);

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Create array to store squares
const squares = [];
const squareCount = 35;

// Create the ripple surface
const surfaceWidth = 100;
const surfaceDepth = 50;
const surfaceResolution = 500;
const ripples = [];

// Create the surface and square colors
const squareColorGreen = new THREE.Color();
squareColorGreen.setHex(0x4FC879); // Vibrant Emerald
const squareColorYellow = new THREE.Color();
squareColorYellow.setHex(0xFFDA03); // Sunflower Yellow
const surfaceColor = new THREE.Color();
surfaceColor.setHex(0x28C864); // Standard Emerald -> 40, 200, 100

// Create surface geometry
const surfaceGeometry = new THREE.PlaneGeometry(
    surfaceWidth,
    surfaceDepth,
    surfaceResolution,
    Math.floor(surfaceResolution * surfaceDepth/surfaceWidth)
);

// Create surface material
const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: surfaceColor,
    wireframe: true,
    transparent: true,
    opacity: 0.60
});

// Create the surface mesh
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
surface.rotation.x = -Math.PI / 2; // Rotate to be horizontal
surface.position.y = -3; // Position at bottom of viewport
scene.add(surface);

// Store original positions of surface vertices
const surfaceVerticesOriginal = [];
for (let i = 0; i < surface.geometry.attributes.position.count; i++) {
    surfaceVerticesOriginal.push({
        x: surface.geometry.attributes.position.getX(i),
        y: surface.geometry.attributes.position.getY(i),
        z: surface.geometry.attributes.position.getZ(i)
    });
}

// Simplified Ripple class for cleaner circular ripples
class Ripple {
    constructor(x, y, z, s) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = 0.1;        // Start with a small radius
        this.maxRadius = s * 10.0 + 25.0;     // Maximum size the circle will grow to
        this.growthSpeed = 0.025;   // How fast the circle expands
        this.opacity = 0.8;       // Initial opacity
        this.fadeSpeed = 1 / (500 * s);    // How quickly it fades out
    }

    // Update the ripple properties for animation
    update() {
        // Grow the radius
        this.radius += this.growthSpeed;

        // Fade out over time
        this.opacity -= this.fadeSpeed;

        // Return false when the ripple should be removed
        return this.opacity > 0 && this.radius < this.maxRadius;
    }

    // Get the displacement at a specific point - corrected for horizontal plane
    getDisplacement(x, y, z) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create a ring effect - only displace points near the edge of the circle
        const ringWidth = 0.2;
        const distFromEdge = Math.abs(distance - this.radius);

        if (distFromEdge < ringWidth) {
            // Calculate displacement magnitude
            const displacement = 0.2 * this.opacity * (1 - distFromEdge/ringWidth);

            // Calculate normalized direction vectors for the outward displacement
            const normalizedDx = distance > 0 ? dx / distance : 0;
            const normalizedDy = distance > 0 ? dy / distance : 0;

            return {
                y: displacement * normalizedDy * 0.3,
                x: displacement * normalizedDx * 0.3,
                z: displacement
            };
        }

        return { x: 0, y: 0, z: 0 };
    }
}

// Simplified function to add a new ripple
function addRipple(x, y, z, s) {
    ripples.push(new Ripple(x, y, z, s));
}

function updateSurface() {
    // Reset vertices
    const positions = surface.geometry.attributes.position.array;

    // Apply ripple effects to each vertex
    for (let i = 0; i < surface.geometry.attributes.position.count; i++) {
        const originalX = surfaceVerticesOriginal[i].x;
        const originalY = surfaceVerticesOriginal[i].y;
        const originalZ = surfaceVerticesOriginal[i].z;

        let totalDisplacementX = 0;
        let totalDisplacementY = 0;
        let totalDisplacementZ = 0;

        // Sum displacements from all active ripples
        ripples.forEach(ripple => {
            const displacement = ripple.getDisplacement(originalX, originalY, originalZ);
            totalDisplacementX += displacement.x;
            totalDisplacementY += displacement.y;
            totalDisplacementZ += displacement.z;
        });

        // Apply displacement to all coordinates
        positions[i * 3] = originalX + totalDisplacementX;
        positions[i * 3 + 1] = originalY + totalDisplacementY;
        positions[i * 3 + 2] = originalZ + totalDisplacementZ;
    }

    // Update geometry
    surface.geometry.attributes.position.needsUpdate = true;
}

// Function to generate a random color between orange and pink
function getRandomColor() {
    // Orange = rgb(248,131,121), Pink = rgb(255,0,255)
    // v2 rgb(255, 137, 4), rgb(246, 51, 154)
    // Green = rgb(79, 200, 121), Yellow = rgb(255, 218, 3)

    const r = Math.floor(Math.random() * (255 - 79 + 1) + 79); // bias 1
    const g = Math.floor(Math.random() * (218 - 200 + 15) + 200); // bias 15
    const b = Math.floor(Math.random() * (121 - 3 + 15) + 3); // bias 15

    return (r << 16) | (g << 8) | b;
}

// Function to create a square
function createSquare() {
    const size = Math.random() * 0.2 + 0.05; // (0.05, 0.25)
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({
        color: getRandomColor(),
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const square = new THREE.Mesh(geometry, material);

    // Position square randomly across the width of the screen
    // Pos (2.5, 10), Neg (-10, -2.5)
    let randX = Math.random();
    square.position.x = randX > 0.5 ? (randX * 22.5) - 7.5 : (randX * -22) - 3.75;
    // Start above the viewport
    square.position.y = 5 + Math.random() * 5;
    // Random z position for depth effect
    square.position.z = Math.random() * -11 + 1; // (-11, 1)

    // Set initial random rotation
    square.rotation.x = Math.random() * Math.PI * 2;
    square.rotation.y = Math.random() * Math.PI * 2;
    square.rotation.z = Math.random() * Math.PI * 2;

    // Set individual properties for animation
    square.velocity = Math.random() * 0.003 + 0.003;

    // Set rotation velocities for each axis
    square.rotationVelocityX = (Math.random() - 0.5) * 0.008;
    square.rotationVelocityY = (Math.random() - 0.5) * 0.008;
    square.rotationVelocityZ = (Math.random() - 0.5) * 0.008;

    // Periodically change rotation direction
    square.rotationChangeTime = Math.random() * 200 + 100;
    square.rotationTimer = 0;

    // Keep track if this square has triggered a ripple
    square.hasTriggeredRipple = false;

    scene.add(square);
    squares.push(square);

    return square;
}

// Create initial squares
for (let i = 0; i < squareCount; i++) {
    createSquare();
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Update each square's position, rotation and opacity
    squares.forEach(square => {
        // Move down
        square.position.y -= square.velocity;

        // Add slight horizontal drift
        square.position.x += (Math.random() - 0.5) * 0.005;

        // Update rotation
        square.rotation.x += square.rotationVelocityX;
        square.rotation.y += square.rotationVelocityY;
        square.rotation.z += square.rotationVelocityZ;

        // Periodically change rotation direction
        square.rotationTimer += 1;
        if (square.rotationTimer > square.rotationChangeTime) {
            square.rotationVelocityX = (Math.random() - 0.5) * 0.008;
            square.rotationVelocityY = (Math.random() - 0.5) * 0.008;
            square.rotationVelocityZ = (Math.random() - 0.5) * 0.008;
            square.rotationTimer = 0;
            square.rotationChangeTime = Math.random() * 200 + 100;
        }

        // Fade out as it approaches the bottom
        const bottomThreshold = -3.5;
        const fadeStartY = -2.95;

        if (square.position.y < fadeStartY) {
            const fadeProgress = 1 - ((square.position.y - bottomThreshold) / (fadeStartY - bottomThreshold));
            square.material.opacity = Math.max(0, 1 - fadeProgress);
        }

        // Create ripple effect when square is near the surface
        const rippleThreshold = -3;
        if (square.position.y < rippleThreshold && !square.hasTriggeredRipple) {
            // Get ripple position in surface coordinates
            const rippleX = square.position.x;
            const rippleY = square.position.z * Math.sin(Math.PI / 2) * -1;
            const rippleZ = square.position.y;
          
            square.velocity = 0.001;

            // Add the ripple with simplified parameters
            addRipple(rippleX, rippleY, rippleZ, square.geometry.parameters['width']);

            // Mark as having triggered a ripple
            square.hasTriggeredRipple = true;
        }

        // Reset square when it goes below the screen
        if (square.position.y < bottomThreshold) {
            square.position.y = 5 + Math.random() * 5;
            let randX = Math.random();
            square.position.x = randX > 0.5 ? (randX * 22.5) - 7.5 : (randX * -22) - 3.75;
            square.material.opacity = Math.random() * 0.5 + 0.5;
            square.material.color.setHex(getRandomColor());

            square.velocity = Math.random() * 0.003 + 0.003;

            // Reset rotation properties for variety
            square.rotation.x = Math.random() * Math.PI * 2;
            square.rotation.y = Math.random() * Math.PI * 2;
            square.rotation.z = Math.random() * Math.PI * 2;

            square.rotationVelocityX = (Math.random() - 0.5) * 0.008;
            square.rotationVelocityY = (Math.random() - 0.5) * 0.008;
            square.rotationVelocityZ = (Math.random() - 0.5) * 0.008;

            square.rotationTimer = 0;
            square.hasTriggeredRipple = false;
        }
    });

    // Update ripples and remove expired ones
    for (let i = ripples.length - 1; i >= 0; i--) {
        if (!ripples[i].update()) {
            ripples.splice(i, 1);
        }
    }

    // Update surface with ripple effects
    updateSurface();

    renderer.render(scene, camera);
}

// // Get the about modal elements
// const aboutModal = document.getElementById("about-modal");
// const aboutBtn = document.getElementById("about-button");
// const closeAboutSpan = document.getElementById("close-about-modal");

// // Get the projects modal elements
// const projectsModal = document.getElementById("projects-modal");
// const projectsBtn = document.getElementById("projects-button");
// const closeProjectsSpan = document.getElementById("close-projects-modal");

// // --- About Modal Logic ---
// aboutBtn.onclick = function() {
//     aboutModal.style.display = "block";
// }

// closeAboutSpan.onclick = function() {
//     aboutModal.style.display = "none";
// }

// // --- Projects Modal Logic ---
// projectsBtn.onclick = function() {
//     projectsModal.style.display = "block";
// }

// closeProjectsSpan.onclick = function() {
//     projectsModal.style.display = "none";
// }

// When the user clicks anywhere outside of either modal, close them
window.onclick = function(event) {
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    }
    if (event.target == projectsModal) {
        projectsModal.style.display = "none";
    }
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();