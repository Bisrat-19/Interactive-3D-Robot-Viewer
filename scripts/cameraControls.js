export function setupCameraAnimation(controls) {
    // Enable auto-rotation with slower speed
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Smooth damping
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Pause auto-rotate during user interaction
    controls.addEventListener('start', () => {
        controls.autoRotate = false;
    });
    
    // Resume auto-rotate after 3 seconds of inactivity
    controls.addEventListener('end', () => {
        setTimeout(() => {
            controls.autoRotate = true;
        }, 3000);
    });

    return controls;
}