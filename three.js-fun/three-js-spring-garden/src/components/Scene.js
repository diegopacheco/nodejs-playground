import * as THREE from 'three';
import Tree from './Tree';
import Flower from './Flower';
import { createSun } from './Spring';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Set camera position
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
    
    // Setup basic scene elements
    this.setupLights();
    this.createGround();
    
    // Initialize garden elements
    this.init();
  }
  
  init() {
    // Create sun
    this.sun = createSun();
    this.scene.add(this.sun);
    
    // Create garden with trees and flowers
    this.createGarden();
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    
    this.scene.add(directionalLight);
  }
  
  createGround() {
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cfc00, // Lawngreen
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = -0.01; // Slightly below origin to avoid z-fighting
    ground.receiveShadow = true;
    
    this.scene.add(ground);
  }
  
  createGarden() {
    // Create trees
    const treePositions = [
      { x: -8, z: -8 },
      { x: -5, z: 5 },
      { x: 8, z: -3 },
      { x: 4, z: 7 },
      { x: 0, z: -10 }
    ];
    
    this.trees = [];
    treePositions.forEach(pos => {
      const tree = new Tree({
        height: 3 + Math.random() * 2,
        position: new THREE.Vector3(pos.x, 0, pos.z)
      });
      this.scene.add(tree.mesh);
      this.trees.push(tree);
    });
    
    // Create flowers
    this.flowers = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      
      // Don't place flowers too close to trees
      if (!this.isNearTree(x, z, 2)) {
        const flower = new Flower({
          position: new THREE.Vector3(x, 0, z),
          color: this.getRandomFlowerColor()
        });
        this.scene.add(flower.mesh);
        this.flowers.push(flower);
      }
    }
  }
  
  isNearTree(x, z, minDistance) {
    for (const tree of this.trees) {
      const treePos = tree.mesh.position;
      const distance = Math.sqrt((x - treePos.x) ** 2 + (z - treePos.z) ** 2);
      if (distance < minDistance) return true;
    }
    return false;
  }
  
  getRandomFlowerColor() {
    const colors = [
      0xFF1493, // Deep pink
      0xFF69B4, // Hot pink
      0xFFB6C1, // Light pink
      0xFFC0CB, // Pink
      0xFF0000, // Red
      0xFFFF00, // Yellow
      0xDA70D6, // Orchid
      0x9370DB, // Medium purple
      0xBA55D3  // Medium orchid
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  update(delta) {
    // Animate elements
    if (this.trees) {
      this.trees.forEach(tree => tree.update(delta));
    }
    
    if (this.flowers) {
      this.flowers.forEach(flower => flower.update(delta));
    }
    
    // Animate sun
    if (this.sun) {
      this.sun.rotation.y += 0.005;
    }
  }
}

export default Scene;