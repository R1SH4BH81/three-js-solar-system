import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// Scene setup
const scene = new THREE.Scene();
let isDarkMode = true;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls (Zoom, Pan, Rotate)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 20;
controls.maxDistance = 500;

// Lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./textures/2k_sun.jpg"),
  emissive: 0xffff00,
  emissiveIntensity: 1,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planetsData = [
  {
    name: "Mercury",
    radius: 0.3,
    texture: "./textures/2k_mercury.jpg",
    distance: 15,
    orbitalSpeed: 0.04,
    rotationSpeed: 0.01,
  },
  {
    name: "Venus",
    radius: 0.8,
    texture: "./textures/2k_venus_surface.jpg",
    distance: 20,
    orbitalSpeed: 0.015,
    rotationSpeed: 0.01,
  },
  {
    name: "Earth",
    radius: 0.9,
    texture: "./textures/2k_earth_daymap.jpg",
    distance: 25,
    orbitalSpeed: 0.01,
    rotationSpeed: 0.02,
  },
  {
    name: "Mars",
    radius: 0.5,
    texture: "./textures/2k_mars.jpg",
    distance: 30,
    orbitalSpeed: 0.008,
    rotationSpeed: 0.025,
  },
  {
    name: "Jupiter",
    radius: 4,
    texture: "./textures/2k_jupiter.jpg",
    distance: 45,
    orbitalSpeed: 0.004,
    rotationSpeed: 0.05,
  },
  {
    name: "Saturn",
    radius: 3.5,
    texture: "./textures/2k_saturn.jpg",
    distance: 60,
    orbitalSpeed: 0.003,
    rotationSpeed: 0.04,
    ring: {
      innerRadius: 4,
      outerRadius: 5,
      texture: "./textures/2k_saturn_ring_alpha.png",
    },
  },
  {
    name: "Uranus",
    radius: 2.5,
    texture: "./textures/2k_uranus.jpg",
    distance: 75,
    orbitalSpeed: 0.002,
    rotationSpeed: 0.03,
  },
  {
    name: "Neptune",
    radius: 2.4,
    texture: "./textures/2k_neptune.jpg",
    distance: 90,
    orbitalSpeed: 0.001,
    rotationSpeed: 0.035,
  },
];

const planets = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "rgba(0,0,0,0.8)";
tooltip.style.color = "white";
tooltip.style.padding = "4px 8px";
tooltip.style.borderRadius = "4px";
tooltip.style.pointerEvents = "none";
tooltip.style.fontSize = "12px";
tooltip.style.display = "none";
tooltip.style.zIndex = "999";
document.body.appendChild(tooltip);

planetsData.forEach((data) => {
  const texture = new THREE.TextureLoader().load(data.texture);
  const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  const group = new THREE.Group();
  planet.position.set(data.distance, 0, 0);
  group.add(planet);
  scene.add(group);

  if (data.ring) {
    const ringGeometry = new THREE.RingGeometry(
      data.ring.innerRadius,
      data.ring.outerRadius,
      64
    );
    const ringTexture = new THREE.TextureLoader().load(data.ring.texture);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(data.distance, 0, 0);
    group.add(ring);
  }

  planets.push({ mesh: planet, group, data, angle: 0 });

  // Speed slider
  const infoPanel = document.getElementById("info-panel");
  const controlDiv = document.createElement("div");
  controlDiv.className = "planet-control";
  controlDiv.innerHTML = `
        <label for="${data.name}-speed">${data.name}:</label>
        <input type="range" id="${data.name}-speed" min="0" max="0.1" value="${data.orbitalSpeed}" step="0.0001">
    `;
  infoPanel.appendChild(controlDiv);

  controlDiv.querySelector("input").addEventListener("input", (e) => {
    data.orbitalSpeed = parseFloat(e.target.value);
  });
});

// Stars
function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push((Math.random() - 0.5) * 2000);
    vertices.push((Math.random() - 0.5) * 2000);
    vertices.push((Math.random() - 0.5) * 2000);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
addStars();

// Orbit lines
planetsData.forEach((data) => {
  const material = new THREE.LineBasicMaterial({ color: 0x333333 });
  const points = [];

  for (let i = 0; i <= 360; i++) {
    const angle = (i * Math.PI) / 180;
    points.push(
      new THREE.Vector3(
        data.distance * Math.cos(angle),
        0,
        data.distance * Math.sin(angle)
      )
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbit = new THREE.Line(geometry, material);
  scene.add(orbit);
});

// Asteroid belt
const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const minDist = planetsData[3].distance + 5;
const maxDist = planetsData[4].distance - 5;

for (let i = 0; i < 5000; i++) {
  const angle = Math.random() * Math.PI * 2;
  const dist = minDist + Math.random() * (maxDist - minDist);
  const x = dist * Math.cos(angle);
  const z = dist * Math.sin(angle);
  const y = (Math.random() - 0.5) * 5;

  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  asteroid.position.set(x, y, z);
  scene.add(asteroid);
}

// Animation
let paused = false;
let animationFrameId;

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  if (!paused) {
    planets.forEach((p) => {
      p.angle += p.data.orbitalSpeed;
      p.group.rotation.y = p.angle;
      p.mesh.rotation.y += p.data.rotationSpeed;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Pause Button
const pauseBtn = document.createElement("button");
pauseBtn.textContent = "Pause Animation";
Object.assign(pauseBtn.style, {
  position: "absolute",
  top: "10px",
  right: "10px",
  padding: "10px",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontFamily: "Arial",
});
document.body.appendChild(pauseBtn);
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume Animation" : "Pause Animation";
  if (!paused) animate();
  else cancelAnimationFrame(animationFrameId);
});

// Dark/Light Toggle
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Toggle Dark/Light Mode";
Object.assign(toggleBtn.style, {
  position: "absolute",
  top: "50px",
  right: "10px",
  padding: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  color: "black",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontFamily: "Arial",
});
document.body.appendChild(toggleBtn);

toggleBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  document.body.style.backgroundColor = isDarkMode ? "black" : "white";
  tooltip.style.background = isDarkMode
    ? "rgba(0,0,0,0.8)"
    : "rgba(255,255,255,0.9)";
  tooltip.style.color = isDarkMode ? "white" : "black";
});

// Hover Labels
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh));

  if (intersects.length > 0) {
    const match = planets.find((p) => p.mesh === intersects[0].object);
    tooltip.style.display = "block";
    tooltip.style.left = e.clientX + 10 + "px";
    tooltip.style.top = e.clientY + 10 + "px";
    tooltip.innerHTML = match?.data?.name || "";
  } else {
    tooltip.style.display = "none";
  }
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
