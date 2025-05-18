import * as THREE from 'three';

// Create a sun for the scene
export function createSun() {
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFD700, // Gold
  });
  
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(50, 50, -100);
  
  // Add subtle glow effect using a sprite
  const spriteMaterial = new THREE.SpriteMaterial({
    map: createSunSprite(),
    color: 0xFFFF00,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(15, 15, 1);
  sun.add(sprite);
  
  return sun;
}

// Create a texture for the sun's glow
function createSunSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width / 8,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 240, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 240, 0, 0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Create clouds for the scene
export function createClouds() {
  const cloudGroup = new THREE.Group();
  
  const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.8,
    roughness: 1
  });
  
  // Create several cloud clusters
  for (let i = 0; i < 10; i++) {
    const cloudCluster = new THREE.Group();
    
    // Position of this cloud cluster
    const x = (Math.random() - 0.5) * 100;
    const y = 20 + Math.random() * 10;
    const z = (Math.random() - 0.5) * 100;
    
    cloudCluster.position.set(x, y, z);
    
    // Create multiple spheres to form a single cloud
    const sphereCount = 3 + Math.floor(Math.random() * 5);
    for (let j = 0; j < sphereCount; j++) {
      const sphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
      
      // Random position within the cluster
      sphere.position.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 3
      );
      
      // Random scale for variety
      const scale = 0.6 + Math.random() * 0.8;
      sphere.scale.set(scale, scale * 0.6, scale);
      
      cloudCluster.add(sphere);
    }
    
    cloudCluster.userData = {
      speed: 0.01 + Math.random() * 0.03,
      direction: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        0,
        (Math.random() - 0.5) * 0.2
      )
    };
    
    cloudGroup.add(cloudCluster);
  }
  
  return cloudGroup;
}

// Create butterflies for the scene
export function createButterflies(count = 10) {
  const butterflyGroup = new THREE.Group();
  
  for (let i = 0; i < count; i++) {
    const butterfly = createButterfly();
    
    // Random position
    butterfly.position.set(
      (Math.random() - 0.5) * 40,
      1 + Math.random() * 5,
      (Math.random() - 0.5) * 40
    );
    
    // Animation parameters
    butterfly.userData = {
      speed: 0.02 + Math.random() * 0.04,
      radius: 2 + Math.random() * 3,
      height: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      center: butterfly.position.clone()
    };
    
    butterflyGroup.add(butterfly);
  }
  
  return butterflyGroup;
}

// Create a single butterfly
function createButterfly() {
  const group = new THREE.Group();
  
  // Create butterfly wings
  const wingGeometry = new THREE.CircleGeometry(0.5, 8);
  
  // Random color for butterfly
  const colors = [
    0xFF1493, // Deep pink
    0x9370DB, // Medium purple
    0x4169E1, // Royal blue
    0xFFA500, // Orange
    0xFFD700  // Gold
  ];
  
  const wingColor = colors[Math.floor(Math.random() * colors.length)];
  
  const wingMaterial = new THREE.MeshBasicMaterial({
    color: wingColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  
  // Left wing
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-0.25, 0, 0);
  leftWing.rotation.y = Math.PI / 4;
  group.add(leftWing);
  
  // Right wing
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(0.25, 0, 0);
  rightWing.rotation.y = -Math.PI / 4;
  group.add(rightWing);
  
  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(0.05, 0.3, 2, 8);
  const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000 // Black
  });
  
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);
  
  return group;
}