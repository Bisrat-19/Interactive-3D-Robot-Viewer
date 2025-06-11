import { initScene } from './initScene.js';
import { createRobot } from './createRobot.js';
import { setupLights } from './lighting.js';
import { setupInteractions } from './interactions.js';
import { setupCameraAnimation } from './cameraControls.js';

class RobotViewer {
    constructor() {
        // Initialize core components
        const { scene, camera, renderer, controls } = initScene();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = setupCameraAnimation(controls);
        
        // Build robot
        this.robot = createRobot();
        scene.add(this.robot);
        
        // Setup features
        setupLights(scene);
        setupInteractions(scene, camera, this.robot);
        
        // Start animation loop
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application
new RobotViewer();