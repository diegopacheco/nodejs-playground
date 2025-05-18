import * as THREE from 'three';

class Tree {
  constructor(options = {}) {
    const {
      position = new THREE.Vector3(0, 0, 0),
      height = 4,
      trunkColor = 0x8B4513, // SaddleBrown
      leavesColor = 0x228B22  // ForestGreen
    } = options;
    
    this.position = position;
    this.height = height;
    this.sway = { speed: 0.005, amplitude: 0.05, offset: Math.random() * Math.PI * 2 };
    
    this.createMesh(trunkColor, leavesColor);
  }
  
  createMesh(trunkColor, leavesColor) {
    const group = new THREE.Group();
    
    // Create trunk
    const trunkHeight = this.height * 0.6;
    const trunkRadius = this.height * 0.05;
    const trunkGeometry = new THREE.CylinderGeometry(
      trunkRadius * 0.7, // top radius
      trunkRadius, // bottom radius
      trunkHeight, // height
      8 // radial segments
    );
    
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: trunkColor,
      roughness: 0.9
    });
    
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.position.y = trunkHeight / 2; // Position trunk at ground level
    group.add(trunk);
    
    // Create leaves (foliage)
    const leavesRadius = this.height * 0.25;
    const leavesGeometry = new THREE.SphereGeometry(
      leavesRadius,
      10, // width segments
      10 // height segments
    );
    
    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: leavesColor,
      roughness: 0.8
    });
    
    // Create multiple leaf clusters for a fuller tree
    for (let i = 0; i < 3; i++) {
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.castShadow = true;
      
      // Position leaves above trunk
      leaves.position.y = trunkHeight - leavesRadius * 0.3 + (i * leavesRadius * 0.8);
      
      // Slight offset for variety
      if (i > 0) {
        leaves.position.x = (Math.random() - 0.5) * leavesRadius * 0.5;
        leaves.position.z = (Math.random() - 0.5) * leavesRadius * 0.5;
        leaves.scale.set(1.1 - i * 0.2, 1.1 - i * 0.15, 1.1 - i * 0.2);
      }
      
      group.add(leaves);
    }
    
    // Position the entire tree
    group.position.copy(this.position);
    
    this.mesh = group;
    this.trunk = trunk;
    this.initialRotation = trunk.rotation.clone();
  }
  
  update() {
    // Simulate gentle swaying motion for the tree
    if (this.trunk) {
      const time = Date.now() * this.sway.speed + this.sway.offset;
      
      this.trunk.rotation.x = this.initialRotation.x + Math.sin(time) * this.sway.amplitude * 0.3;
      this.trunk.rotation.z = this.initialRotation.z + Math.cos(time) * this.sway.amplitude;
    }
  }
}

export default Tree;