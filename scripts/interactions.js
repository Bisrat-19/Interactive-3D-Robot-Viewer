export function setupInteractions(scene, camera, robot) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const infoPanel = document.getElementById('info-panel');
    let highlightedObject = null;
    let originalEmissive;

    // Mouse move event for hover effect
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(robot.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            highlightObject(object);
        } else if (highlightedObject) {
            removeHighlight();
        }
    });

    // Click event for part selection
    window.addEventListener('click', (event) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(robot.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            showPartInfo(object.userData.name);
            triggerPartAction(object);
        } else {
            infoPanel.style.display = 'none';
        }
    });

    function highlightObject(object) {
        if (highlightedObject === object) return;
        
        removeHighlight();
        highlightedObject = object;
        
        // Store original emissive color
        if (object.material.emissive) {
            originalEmissive = object.material.emissive.getHex();
            object.material.emissive.setHex(0x333333);
        }
    }

    function removeHighlight() {
        if (highlightedObject && highlightedObject.material.emissive) {
            highlightedObject.material.emissive.setHex(originalEmissive);
            highlightedObject = null;
        }
    }

    function showPartInfo(partName) {
        infoPanel.textContent = `Selected: ${partName}`;
        infoPanel.style.display = 'block';
        setTimeout(() => infoPanel.style.display = 'none', 2000);
    }

    function triggerPartAction(object) {
        switch(object.userData.name) {
            case "Head":
                // Rotate head when clicked
                gsap.to(object.rotation, { 
                    y: object.rotation.y + Math.PI/4, 
                    duration: 0.5 
                });
                break;
                
            case "Power Button":
                // Animate button press
                animateButton(object);
                // Pulse panel light
                gsap.to(scene.children.find(child => child instanceof THREE.PointLight), { 
                    intensity: 2, 
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
                break;
                
            case "Left Arm":
                // Wave left arm forward
                waveArm(object, -Math.PI/3);
                break;
                
            case "Right Arm":
                // Wave right arm forward (opposite direction)
                waveArm(object, Math.PI/3);
                break;
        }
    }

    function animateButton(button) {
        // Button press animation
        gsap.to(button.scale, {
            z: 0.5,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    function waveArm(arm, angle) {
        // Arm waving animation
        const startRot = arm.rotation.z;
        gsap.to(arm.rotation, {
            z: startRot + angle,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }
}