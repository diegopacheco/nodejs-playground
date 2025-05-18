import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './styles.css';
import Scene from './components/Scene';
import { createClouds, createButterflies } from './components/Spring';

let scene, camera, renderer, controls;
let threeJsScene, clouds, butterflies;
let clock = new THREE.Clock();

function init() {
  // Create the scene
  threeJsScene = new Scene();
  scene = threeJsScene.scene;
  camera = threeJsScene.camera;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87CEEB); // Sky blue background
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Add header information
  const header = document.createElement('h1');
  header.textContent = 'Three.js Spring Garden';
  document.body.appendChild(header);
  
  const info = document.createElement('div');
  info.id = 'info';
  info.textContent = 'Use mouse to orbit camera. Scroll to zoom.';
  document.body.appendChild(info);

  // Add orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Add clouds
  clouds = createClouds();
  scene.add(clouds);
  
  // Add butterflies
  butterflies = createButterflies(15);
  scene.add(butterflies);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  
  controls.update();
  
  // Update garden scene
  if (threeJsScene.update) {
    threeJsScene.update(delta);
  }
  
  // Animate clouds
  if (clouds) {
    clouds.children.forEach(cloud => {
      const { speed, direction } = cloud.userData;
      cloud.position.x += direction.x * speed;
      cloud.position.z += direction.z * speed;
      
      // Wrap clouds around the scene
      if (cloud.position.x > 100) cloud.position.x = -100;
      if (cloud.position.x < -100) cloud.position.x = 100;
      if (cloud.position.z > 100) cloud.position.z = -100;
      if (cloud.position.z < -100) cloud.position.z = 100;
    });
  }
  
  // Animate butterflies
  if (butterflies) {
    butterflies.children.forEach(butterfly => {
      const { speed, radius, height, phase, center } = butterfly.userData;
      
      // Update phase
      butterfly.userData.phase += speed;
      
      // Circular flight pattern with vertical bobbing
      butterfly.position.x = center.x + Math.cos(butterfly.userData.phase) * radius;
      butterfly.position.y = center.y + Math.sin(butterfly.userData.phase * 2) * height;
      butterfly.position.z = center.z + Math.sin(butterfly.userData.phase) * radius;
      
      // Orient butterfly to face movement direction
      butterfly.rotation.y = -butterfly.userData.phase + Math.PI / 2;
      
      // Flap wings
      const wingSpeed = speed * 10;
      butterfly.children[0].rotation.z = Math.cos(butterfly.userData.phase * wingSpeed) * 0.3;
      butterfly.children[1].rotation.z = -Math.cos(butterfly.userData.phase * wingSpeed) * 0.3;
    });
  }
  
  renderer.render(scene, camera);
}

init();