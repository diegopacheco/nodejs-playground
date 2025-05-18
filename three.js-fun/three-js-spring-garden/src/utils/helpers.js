// This file contains utility functions that assist in creating and managing Three.js objects.

export function loadTexture(url) {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load(url);
}

export function generateRandomPosition(range) {
    return {
        x: Math.random() * range - range / 2,
        y: Math.random() * range - range / 2,
        z: Math.random() * range - range / 2,
    };
}

export function createMesh(geometry, material) {
    return new THREE.Mesh(geometry, material);
}