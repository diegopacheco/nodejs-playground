export const animate = (renderer, scene, camera) => {
    const clock = new THREE.Clock();

    const render = () => {
        requestAnimationFrame(render);
        const delta = clock.getDelta(); // seconds.
        
        // Update animations here
        // For example, you can call update methods on your Spring class instance

        renderer.render(scene, camera);
    };

    render();
};

export const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// Additional easing functions can be added here as needed.