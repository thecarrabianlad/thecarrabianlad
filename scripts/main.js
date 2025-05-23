import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const warmLight = new THREE.DirectionalLight(0xfff4cc, 2.5);
warmLight.position.set(10, 20, 10);
warmLight.castShadow = true;
scene.add(warmLight);

const ambientLight = new THREE.AmbientLight(0x404040, 4);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// Load the 3D object
const loader = new GLTFLoader();
let ship;

function setShipPosition() {
  if (!ship) return;

  const distanceFromCamera = camera.position.z - ship.position.z;
  const vFOV = THREE.MathUtils.degToRad(camera.fov);
  const height = 2 * Math.tan(vFOV / 2) * distanceFromCamera;
  const width = height * camera.aspect;

  if (window.innerWidth <= 768) {
    // Mobile settings
    ship.position.x = 0; // Center horizontally
    ship.scale.set(0.6, 0.6, 0.6); // Scale down for mobile
    ship.position.y = -0.5; // Adjust vertical position
  } 
  else if (window.innerWidth <= 1220) {
    // Tablet settings
    ship.position.x = 0; // Center horizontally
    ship.scale.set(0.8, 0.8, 0.8); // Scale down for tablet
    ship.position.y = -0.7; // Adjust vertical position
  }
  else {
    // Desktop settings
    const margin = 1.5; // Appears ~20–30px from right
    ship.position.x = (width / 2) - margin;
    ship.scale.set(1, 1, 1); // Normal scale
    ship.position.y = 0; // Center vertically
  }
}

loader.load('./models/pirate-ship.glb',
  function (gltf) {
    ship = gltf.scene;
    ship.position.z = 13;
    ship.rotation.y = -1;
    scene.add(ship);
    setShipPosition();
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the 3D model:', error);
  }
);

// Track mouse position
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setShipPosition(); // Adjust on resize
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (ship) {
    ship.rotation.y += ((mouseX * 0.5) - ship.rotation.y) * 0.05;
    ship.rotation.x += ((mouseY * 0.2) - ship.rotation.x) * 0.05;

    ship.rotation.y = THREE.MathUtils.clamp(ship.rotation.y, -0.6, 0.6);
    ship.rotation.x = THREE.MathUtils.clamp(ship.rotation.x, -0.3, 0.3);
  }

  renderer.render(scene, camera);
}
animate();
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');

    // Wait for the fade transition to finish before hiding completely and showing main content
    preloader.addEventListener('transitionend', () => {
      preloader.style.display = 'none';

      const mainContent = document.getElementById('main-content');
      mainContent.style.display = 'block';

      startHomepageAnimation();
    }, { once: true }); // only listen once
  }, 2500); // 2.5 seconds delay before fade
});

function startHomepageAnimation() {
  // Trigger your homepage animations here
}

let lastFrameTime = 0;
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;

function animatex(time) {
  requestAnimationFrame(animatex);

  if (time - lastFrameTime < frameInterval) return;
  lastFrameTime = time;

  if (ship) {
    ship.rotation.y += ((mouseX * 0.5) - ship.rotation.y) * 0.05;
    ship.rotation.x += ((mouseY * 0.2) - ship.rotation.x) * 0.05;

    ship.rotation.y = THREE.MathUtils.clamp(ship.rotation.y, -0.6, 0.6);
    ship.rotation.x = THREE.MathUtils.clamp(ship.rotation.x, -0.3, 0.3);
  }

  renderer.render(scene, camera);
}

const isLowEndDevice = navigator.hardwareConcurrency <= 4;
targetFPS = isLowEndDevice ? 20 : 30;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

if (!isLowEndDevice) {
  const warmLight = new THREE.DirectionalLight(0xfff4cc, 2.5);
  warmLight.position.set(10, 20, 10);
  warmLight.castShadow = true;
  scene.add(warmLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  scene.add(topLight);
}

if (isLowEndDevice) {
  renderer.setPixelRatio(0.75); // reduce GPU load
} else {
  renderer.setPixelRatio(window.devicePixelRatio);
}
renderer.setSize(window.innerWidth, window.innerHeight);
