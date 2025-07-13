
# 🌌 Solar System Simulation – Frontend Assignment

### 👨‍💻 Developed by: Rishabh Mishra

## 📽️ Demo Video

## 📁 Project Structure

```
solar-system-simulation/
├── index.html
├── main.js
├── textures/
│   ├── 2k_sun.jpg
│   ├── 2k_mercury.jpg
│   ├── 2k_venus_surface.jpg
│   ├── 2k_earth_daymap.jpg
│   ├── 2k_mars.jpg
│   ├── 2k_jupiter.jpg
│   ├── 2k_saturn.jpg
│   ├── 2k_saturn_ring_alpha.png
│   ├── 2k_uranus.jpg
│   └── 2k_neptune.jpg
└── README.md
```

## 🚀 Features Implemented

| Feature | Status |
|--------|--------|
| Sun at center | ✅ |
| All 8 planets orbiting the sun | ✅ |
| Realistic lighting & camera setup | ✅ |
| Planets rotate on axis + revolve | ✅ |
| Speed control sliders for all planets | ✅ |
| Pause / Resume animation | ✅ |
| Background stars | ✅ |
| Labels on hover for each planet | ✅ |
| Dark/Light mode toggle | ✅ |
| Camera zoom, pan, rotate (OrbitControls) | ✅ |

## 📦 How to Run

### ✅ Prerequisites
- A modern browser (Chrome, Firefox, Edge)
- **Local server** (required to load textures)
    - You can use:
      ```bash
      npx serve
      ```
    - Or use **VS Code Live Server Extension**

### 🛠️ Steps to Run

1. **Download or clone the repo**
2. Make sure the `textures/` folder is in the same directory as `index.html` and `main.js`
3. Run a local server in the root folder:
   ```bash
   npx serve .
   ```
4. Open in browser (usually http://localhost:3000 or similar)

## 🧠 Code Explanation

### 🔭 Scene Setup (`Three.js`)
- **Scene**, **Camera**, and **Renderer** are initialized.
- Lighting includes:
  - `AmbientLight`: for soft lighting
  - `PointLight`: as the "Sun's light"

### 🌞 Sun
- A large sphere with `MeshBasicMaterial` and emissive color
- Texture: `2k_sun.jpg`

### 🪐 Planets
- Defined in an array (`planetsData`)
- Each planet has:
  - Radius
  - Texture map
  - Distance from sun
  - Orbital speed (revolution)
  - Rotation speed (spinning on axis)
- Added to a `THREE.Group()` for independent orbit

### 🧊 Rings (Saturn)
- Created using `RingGeometry` and alpha PNG texture
- Rotated to lie flat around planet

### ⭐ Background Stars
- Randomly generated `THREE.Points` in 3D space
- Adds realism

### 🌌 Asteroid Belt
- Between Mars and Jupiter
- 5000 small spheres randomly placed in orbit

## 🎮 Interactivity

### 🧭 OrbitControls
- Zoom, pan, and rotate using mouse or touchpad
- Uses `OrbitControls` from Three.js examples

### 🎚 Speed Control Panel
- Dynamically created sliders for each planet
- Changing a slider updates the orbital speed in real time

### ⏸ Pause/Resume Button
- Toggles animation loop via `requestAnimationFrame` and `cancelAnimationFrame`

### 🌗 Dark/Light Toggle
- Changes body background color and tooltip style

### 🪐 Hover Labels
- Uses `THREE.Raycaster` to detect which planet is under the mouse
- Shows the planet name in a floating tooltip near the cursor

### 📝 Code Walkthrough
- `main.js` is the main script
- Functions for:
  - Planet setup
  - Animation loop
  - Interactivity (speed sliders, pause/resume, dark/light mode, hover labels)
- Comments explain key sections
