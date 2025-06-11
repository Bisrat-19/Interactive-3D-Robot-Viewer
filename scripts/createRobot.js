export function createRobot() {
    const robot = new THREE.Group();
    const robotParts = {};

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
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1.5, 0.8), 
        bodyMat
    );
    torso.position.y = 0.75;
    torso.castShadow = true;
    torso.userData.name = "Torso";
    robot.add(torso);
    robotParts.torso = torso;

    // Head (removed glass cabin)
    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8), 
        bodyMat
    );
    head.position.set(0, 1.75, 0);
    head.userData.name = "Head";
    robot.add(head);
    robotParts.head = head;

    // Eyes (original implementation)
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, detailMat);
    leftEye.position.set(-0.2, 1.85, 0.5);
    leftEye.userData.name = "Left Eye";
    robot.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.x = 0.2;
    rightEye.userData.name = "Right Eye";
    robot.add(rightEye);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-0.6, 1, 0);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.userData.name = "Left Arm";
    robot.add(leftArm);
    robotParts.leftArm = leftArm;

    const rightArm = leftArm.clone();
    rightArm.position.x = 0.6;
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.userData.name = "Right Arm";
    robot.add(rightArm);
    robotParts.rightArm = rightArm;

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.3, 0.1, 0);
    leftLeg.userData.name = "Left Leg";
    robot.add(leftLeg);

    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.3;
    rightLeg.userData.name = "Right Leg";
    robot.add(rightLeg);

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(0.4, 0.2, 0.1);
    const panel = new THREE.Mesh(panelGeo, detailMat);
    panel.position.set(0, 1, 0.6);
    panel.userData.name = "Control Panel";
    robot.add(panel);

    // Buttons
    const buttonGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const button1 = new THREE.Mesh(buttonGeo, detailMat);
    button1.position.set(-0.1, 1, 0.65);
    button1.userData.name = "Power Button";
    robot.add(button1);

    // Ground plane
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ 
            color: 0xdddddd,
            roughness: 0.8
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    robot.add(ground);

    return robot;
}