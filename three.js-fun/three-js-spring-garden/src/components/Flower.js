import * as THREE from 'three';

class Flower {
  constructor(options = {}) {
    const {
      position = new THREE.Vector3(0, 0, 0),
      color = 0xFF1493, // Default to deep pink
      size = 0.2 + Math.random() * 0.2,
      bloomStage = Math.random() // Random initial bloom stage
    } = options;
    
    this.position = position;
    this.color = color;
    this.size = size;
    this.bloomStage = bloomStage;
    this.bloomSpeed = 0.0005 + Math.random() * 0.001;
    this.swaySpeed = 0.002 + Math.random() * 0.003;
    this.swayOffset = Math.random() * Math.PI * 2;
    
    this.createMesh();
  }
  
  createMesh() {
    const group = new THREE.Group();
    
    // Create stem
    const stemHeight = 0.5 + Math.random() * 0.5;
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, stemHeight, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x228B22, // Forest green
      roughness: 0.8
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.castShadow = true;
    stem.position.y = stemHeight / 2;
    group.add(stem);
    
    // Create flower center
    const centerGeometry = new THREE.SphereGeometry(this.size * 0.2, 8, 8);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // Gold
      roughness: 0.5
    });
    
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.castShadow = true;
    center.position.y = stemHeight;
    group.add(center);
    
    // Create petals
    this.petals = [];
    const petalCount = 6 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < petalCount; i++) {
      const petal = this.createPetal();
      const angle = (i / petalCount) * Math.PI * 2;
      
      petal.position.y = stemHeight;
      petal.rotation.z = angle;
      
      // Start with petals closed
      petal.scale.y = 0.1 + this.bloomStage * 0.9;
      
      group.add(petal);
      this.petals.push(petal);
    }
    
    // Position the entire flower
    group.position.copy(this.position);
    
    this.mesh = group;
    this.stem = stem;
    this.initialStemRotation = stem.rotation.clone();
  }
  
  createPetal() {
    // Create a simple petal shape
    const petalGeometry = new THREE.ConeGeometry(
      this.size * 0.15,  // radius
      this.size * 0.5,   // height
      8,                  // segments
      1                   // height segments
    );
    
    const petalMaterial = new THREE.MeshStandardMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      roughness: 0.6
    });
    
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    petal.castShadow = true;
    petal.rotation.x = Math.PI / 2; // Make petal face outward
    
    // Position the petal at center edge
    petal.position.x = this.size * 0.2;
    
    return petal;
  }
  
  update() {
    // Simulate swaying of the flower
    if (this.stem) {
      const time = Date.now() * this.swaySpeed + this.swayOffset;
      
      this.stem.rotation.x = this.initialStemRotation.x + Math.sin(time) * 0.1;
      this.stem.rotation.z = this.initialStemRotation.z + Math.cos(time) * 0.1;
    }
    
    // Simulate blooming
    if (this.petals && this.petals.length > 0) {
      // Gradually increase bloom stage
      this.bloomStage += this.bloomSpeed;
      if (this.bloomStage > 1) {
        this.bloomStage = 1;
      }
      
      // Apply bloom stage to petals
      for (const petal of this.petals) {
        petal.scale.y = 0.1 + this.bloomStage * 0.9;
      }
    }
  }
}

export default Flower;