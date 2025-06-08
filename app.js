class RobotViewer {
    constructor() {
        // Core components
        this.initScene();
        this.createRobot();
        this.addLighting();
        this.setupInteraction();
        this.setupCameraAnimation();
        this.animate();
        this.setupResizeHandler();
    }

    initScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Camera (lower angle for toy viewing)
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 0.8, 0); // Focus on robot's chest
    }

    createRobot() {
        this.robot = new THREE.Group();
        this.robotParts = {};

        // Materials
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: 0x3498db,
            metalness: 0.3,
            roughness: 0.7 
        });
        
        const detailMat = new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            emissive: 0x220000
        });

        // Torso (Main body)
        const torsoGeo = new THREE.BoxGeometry(1, 1.5, 0.8);
        const torso = new THREE.Mesh(torsoGeo, bodyMat);
        torso.position.y = 0.75;
        torso.castShadow = true;
        torso.userData.name = "Torso";
        this.robot.add(torso);
        this.robotParts.torso = torso;

        // Head
        const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.position.set(0, 1.75, 0);
        head.userData.name = "Head";
        this.robot.add(head);
        this.robotParts.head = head;

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeo, detailMat);
        leftEye.position.set(-0.2, 1.85, 0.5);
        leftEye.userData.name = "Left Eye";
        this.robot.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.x = 0.2;
        rightEye.userData.name = "Right Eye";
        this.robot.add(rightEye);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
        const leftArm = new THREE.Mesh(armGeo, bodyMat);
        leftArm.position.set(-0.6, 1, 0);
        leftArm.rotation.z = Math.PI / 4;
        leftArm.userData.name = "Left Arm";
        this.robot.add(leftArm);
        this.robotParts.leftArm = leftArm;

        // ... Add right arm, legs, antenna, etc.

        // Control Panel
        const panelGeo = new THREE.BoxGeometry(0.4, 0.2, 0.1);
        const panel = new THREE.Mesh(panelGeo, detailMat);
        panel.position.set(0, 1, 0.6);
        panel.userData.name = "Control Panel";
        this.robot.add(panel);

        // Buttons
        const buttonGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const button1 = new THREE.Mesh(buttonGeo, detailMat);
        button1.position.set(-0.1, 1, 0.65);
        button1.userData.name = "Power Button";
        this.robot.add(button1);

        // Add robot to scene
        this.scene.add(this.robot);

        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(10, 10);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0xdddddd,
            roughness: 0.8
        });
        this.ground = new THREE.Mesh(groundGeo, groundMat);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    addLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Key light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(3, 5, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Panel glow
        this.panelLight = new THREE.PointLight(0xff0000, 1, 0.5);
        this.panelLight.position.set(0, 1, 0.6);
        this.scene.add(this.panelLight);
    }

    setupInteraction() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.infoPanel = document.getElementById('info-panel');
        this.highlightedObject = null;

        // Mouse events
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onClick(event));
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.robot.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.highlightObject(object);
        } else if (this.highlightedObject) {
            this.removeHighlight();
        }
    }

    highlightObject(object) {
        if (this.highlightedObject === object) return;
        
        this.removeHighlight();
        this.highlightedObject = object;
        
        // Store original emissive color
        this.originalEmissive = object.material.emissive.getHex();
        object.material.emissive.setHex(0x333333);
    }

    removeHighlight() {
        if (this.highlightedObject) {
            this.highlightedObject.material.emissive.setHex(this.originalEmissive);
            this.highlightedObject = null;
        }
    }

    onClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.robot.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.showPartInfo(object.userData.name);
            this.triggerPartAction(object);
        } else {
            this.infoPanel.style.display = 'none';
        }
    }

    showPartInfo(partName) {
        this.infoPanel.textContent = `Selected: ${partName}`;
        this.infoPanel.style.display = 'block';
        setTimeout(() => this.infoPanel.style.display = 'none', 2000);
    }

    triggerPartAction(object) {
        switch(object.userData.name) {
            case "Head":
                gsap.to(object.rotation, { y: object.rotation.y + Math.PI/4, duration: 0.5 });
                break;
            case "Power Button":
                this.animateButton(object);
                gsap.to(this.panelLight, { 
                    intensity: 2, 
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
                break;
            case "Left Arm":
                this.waveArm(object);
                break;
        }
    }

    animateButton(button) {
        gsap.to(button.scale, {
            z: 0.5,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    waveArm(arm) {
        const startRot = arm.rotation.z;
        gsap.to(arm.rotation, {
            z: startRot - Math.PI/3,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }

    setupCameraAnimation() {
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        this.controls.addEventListener('start', () => {
            this.controls.autoRotate = false;
        });
        
        this.controls.addEventListener('end', () => {
            setTimeout(() => {
                this.controls.autoRotate = true;
            }, 3000);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Initialize
new RobotViewer();