export function setupLights(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 5, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Panel glow 
    const panelLight = new THREE.PointLight(0xff0000, 1, 0.5);
    panelLight.position.set(0, 1, 0.6);
    scene.add(panelLight);
}