# Gramado 3D

Ultra-realistic 3D recreation of the iconic Gramado entrance gate in Serra Gaucha, Brazil.

Built with **Three.js** and **Node.js**, featuring:

- Procedurally generated stone textures with normal mapping for realistic depth
- ACES Filmic tone mapping and HDR-quality lighting
- PCF Soft Shadow Maps (4096x4096) for cinematic shadow quality
- Multi-pass post-processing pipeline: Unreal Bloom, SMAA anti-aliasing, vignette, color grading
- Dynamic sky shader with atmospheric fog
- Procedural pine and deciduous trees surrounding the gate
- Colorful flower beds (orange, yellow, red) matching the original scene
- Distant mountains with flat shading for depth
- Asphalt road with lane markings and sidewalks
- Warm lamp posts with point lights
- Orbit controls for full 360-degree exploration
- Loading screen with progress bar

## Run

```
chmod +x run.sh
./run.sh
```

Open http://localhost:3000

## Controls

- **Left-click + drag** - Orbit around the scene
- **Scroll** - Zoom in/out
- **Right-click + drag** - Pan the camera

## Tech Stack

- Node.js + Express (static server)
- Three.js r162 (via CDN import maps)
- Custom GLSL shaders for sky, vignette, and color correction
- All textures procedurally generated on canvas (no external assets needed)
