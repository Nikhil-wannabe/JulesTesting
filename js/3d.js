// Content for js/3d.js

if (THREE && window.gsap) { // Ensure Three.js and GSAP are loaded
    const heroCanvasContainer = document.getElementById('hero-3d-canvas');

    if (heroCanvasContainer) {
        // Scene
        const heroScene = new THREE.Scene();

        // Camera
        const heroCamera = new THREE.PerspectiveCamera(75, heroCanvasContainer.offsetWidth / heroCanvasContainer.offsetHeight, 0.1, 1000);
        heroCamera.position.z = 4; // Adjusted camera position

        // Renderer
        const heroRenderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true for transparent background
        heroRenderer.setSize(heroCanvasContainer.offsetWidth, heroCanvasContainer.offsetHeight);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for pixel ratio
        heroCanvasContainer.appendChild(heroRenderer.domElement);

        // Make canvas responsive
        const onHeroWindowResize = () => {
            if (!document.body.contains(heroCanvasContainer)) {
                window.removeEventListener('resize', onHeroWindowResize);
                return;
            }
            heroCamera.aspect = heroCanvasContainer.offsetWidth / heroCanvasContainer.offsetHeight;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(heroCanvasContainer.offsetWidth, heroCanvasContainer.offsetHeight);
            heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', onHeroWindowResize, false);

        // Remove old lights and cube if they exist by name
        const oldAmbientLight = heroScene.getObjectByName("ambientLight");
        if (oldAmbientLight) heroScene.remove(oldAmbientLight);
        const oldPointLight = heroScene.getObjectByName("pointLight");
        if (oldPointLight) heroScene.remove(oldPointLight);
        const oldCube = heroScene.getObjectByName("placeholderCube");
        if (oldCube) heroScene.remove(oldCube);
        const genericCube = heroScene.children.find(child => child instanceof THREE.Mesh);
        if (genericCube) heroScene.remove(genericCube);


        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        ambientLight.name = "ambientLight";
        heroScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.name = "directionalLight";
        heroScene.add(directionalLight);

        // Neural Globe Parameters
        const globeRadius = 1.5;
        const numPoints = 300;
        const pointSize = 0.03;
        const lineColor = 0x00aaff;
        const pointColor = 0x80ddff;

        const particlesGeometry = new THREE.BufferGeometry();
        const positions = [];
        for (let i = 0; i < numPoints; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            positions.push(
                globeRadius * Math.sin(phi) * Math.cos(theta),
                globeRadius * Math.sin(phi) * Math.sin(theta),
                globeRadius * Math.cos(phi)
            );
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: pointColor,
            size: pointSize,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const neuralPoints = new THREE.Points(particlesGeometry, particlesMaterial);
        neuralPoints.name = "neuralPoints";

        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const connections = {};
        const maxConnectionsPerPoint = 3;
        const connectionDistanceThreshold = globeRadius * 0.8;

        for (let i = 0; i < numPoints; i++) {
            connections[i] = 0;
            for (let j = i + 1; j < numPoints; j++) {
                if (connections[i] >= maxConnectionsPerPoint || connections[j] >= maxConnectionsPerPoint) continue;
                const p1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                const p2 = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                const distance = p1.distanceTo(p2);
                if (distance < connectionDistanceThreshold && Math.random() > 0.7) {
                    linePositions.push(p1.x, p1.y, p1.z);
                    linePositions.push(p2.x, p2.y, p2.z);
                    connections[i]++;
                    connections[j]++;
                }
            }
        }
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const neuralLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        neuralLines.name = "neuralLines";

        const neuralGlobe = new THREE.Group();
        neuralGlobe.add(neuralPoints);
        neuralGlobe.add(neuralLines);
        neuralGlobe.name = "neuralGlobe";
        heroScene.add(neuralGlobe);

        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        let isHeroSectionActive = false;

        const onHeroDocumentMouseMove = (event) => {
            if (isHeroSectionActive) {
                mouseX = (event.clientX - windowHalfX) / windowHalfX;
                mouseY = (event.clientY - windowHalfY) / windowHalfY;
            }
        };
        document.addEventListener('mousemove', onHeroDocumentMouseMove, false);

        gsap.timeline({ repeat: -1, yoyo: true })
            .to(neuralPoints.material, { size: pointSize * 1.5, duration: 2, ease: "sine.inOut" })
            .to(neuralPoints.material, { size: pointSize, duration: 2, ease: "sine.inOut" });

        gsap.timeline({ repeat: -1, yoyo: true })
            .to(lineMaterial, { opacity: 0.4, duration: 3, ease: "sine.inOut" })
            .to(lineMaterial, { opacity: 0.1, duration: 3, ease: "sine.inOut" });

        if (window.heroSphereAnimationId) {
            cancelAnimationFrame(window.heroSphereAnimationId);
        }

        function animateNeuralGlobe() {
            window.heroSphereAnimationId = requestAnimationFrame(animateNeuralGlobe);
            neuralGlobe.rotation.y += 0.001;
            neuralGlobe.rotation.x += 0.0005;
            if (isHeroSectionActive) {
                gsap.to(neuralGlobe.rotation, {
                    y: neuralGlobe.rotation.y + mouseX * 0.02,
                    x: neuralGlobe.rotation.x - mouseY * 0.02,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
            heroRenderer.render(heroScene, heroCamera);
        }

        if (!window.isHeroAnimationRunning) {
             animateNeuralGlobe();
             window.isHeroAnimationRunning = true;
        }

        if (typeof ScrollTrigger !== 'undefined' && typeof horizontalScroll !== 'undefined') {
             ScrollTrigger.create({
                trigger: ".hero-section",
                containerAnimation: horizontalScroll,
                start: "left center",
                end: "right center",
                onToggle: self => {
                    isHeroSectionActive = self.isActive;
                    heroCanvasContainer.style.pointerEvents = self.isActive ? 'auto' : 'none';
                    const tweens = gsap.getTweensOf(neuralPoints.material).concat(gsap.getTweensOf(lineMaterial));
                    if (self.isActive) {
                        tweens.forEach(tween => tween.play());
                    } else {
                        tweens.forEach(tween => tween.pause());
                    }
                },
            });
        } else {
            console.warn("ScrollTrigger or horizontalScroll not available for Hero 3D interactivity. Defaulting to active.");
            isHeroSectionActive = true;
            heroCanvasContainer.style.pointerEvents = 'auto';
        }

    } else {
        console.error("3D canvas container #hero-3d-canvas not found for Neural Globe.");
    }
} else {
    console.error("Three.js or GSAP library not loaded for Neural Globe.");
}

// MITRA OS 3D Scene
function initMitra3DScene() {
    const canvasContainer = document.getElementById('mitra-os-3d-canvas');
    if (!canvasContainer || window.mitra3DInitialized) return;
    window.mitra3DInitialized = true;

    // Clear placeholder text/content if any
    canvasContainer.innerHTML = '';
    canvasContainer.classList.remove('mitra-3d-ui-placeholder'); // Remove placeholder class styling


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
    camera.position.z = 3; // Closer view for smaller elements

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    const elements = [];
    const numElements = 5;
    const elementColors = [0x00aaff, 0x00ffaa, 0xffaa00, 0xaa00ff, 0xff00aa];

    for (let i = 0; i < numElements; i++) {
        const geometry = new THREE.PlaneGeometry(0.5 + Math.random() * 0.8, 0.2 + Math.random() * 0.3);
        const material = new THREE.MeshBasicMaterial({
            color: elementColors[i % elementColors.length],
            transparent: true,
            opacity: 0, // Start with 0 opacity, fade in with ScrollTrigger
            side: THREE.DoubleSide,
            wireframe: Math.random() > 0.5
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.x = (Math.random() - 0.5) * 3;
        plane.position.y = (Math.random() - 0.5) * 2;
        plane.position.z = (Math.random() - 0.5) * 1.5;
        plane.rotation.x = Math.random() * Math.PI;
        plane.rotation.y = Math.random() * Math.PI;
        scene.add(plane);
        elements.push(plane);
        elInitialPos = plane.position.clone(); // Store initial position for parallax
        plane.userData.initialPosition = elInitialPos; // Attach to userData
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    let mitraMouseX = 0;
    let mitraMouseY = 0;
    let isMitraSectionActive = false;
    let mitraAnimationId;

    function animateMitra3D() {
        mitraAnimationId = requestAnimationFrame(animateMitra3D);
        elements.forEach((el, index) => {
            el.rotation.y += 0.002 * (index % 2 === 0 ? 1 : -1);
            el.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
            el.position.y += Math.sin(Date.now() * 0.0005 + index) * 0.001;
            if (isMitraSectionActive) {
                const targetX = el.userData.initialPosition.x + mitraMouseX * 0.5 * (index * 0.1 + 1) ; // Adjusted parallax strength
                const targetY = el.userData.initialPosition.y - mitraMouseY * 0.5 * (index * 0.1 + 1) ;
                el.position.x += (targetX - el.position.x) * 0.05;
                el.position.y += (targetY - el.position.y) * 0.05;
            }
        });
        renderer.render(scene, camera);
    }

    const onMitraResize = () => {
        if (!canvasContainer.isConnected) {
            window.removeEventListener('resize', onMitraResizeMitra);
            if (mitraAnimationId) cancelAnimationFrame(mitraAnimationId);
            document.removeEventListener('mousemove', onMitraMouseMove); // Clean up mouse listener
            return;
        }
        camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    const onMitraResizeMitra = onMitraResize.bind(null);
    window.addEventListener('resize', onMitraResizeMitra);

    function onMitraMouseMove(event) {
        if(isMitraSectionActive && canvasContainer) {
            const rect = canvasContainer.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return; // Avoid division by zero if canvas not visible
            mitraMouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mitraMouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        }
    }

    if (typeof ScrollTrigger !== 'undefined' && typeof projectsInternalTimeline !== 'undefined') {
        ScrollTrigger.create({
            trigger: "#mitra-os",
            containerAnimation: projectsInternalTimeline,
            start: "left center-=10%", // A bit before center
            end: "right center+=10%",  // A bit after center
            onEnter: () => {
                isMitraSectionActive = true;
                if (mitraAnimationId) cancelAnimationFrame(mitraAnimationId);
                animateMitra3D();
                gsap.to(elements.map(e => e.material), {opacity: 0.6, duration: 0.5, stagger: 0.1});
                document.addEventListener('mousemove', onMitraMouseMove);
            },
            onLeave: () => {
                isMitraSectionActive = false;
                if (mitraAnimationId) cancelAnimationFrame(mitraAnimationId); mitraAnimationId = null;
                gsap.to(elements.map(e => e.material), {opacity: 0, duration: 0.5});
                document.removeEventListener('mousemove', onMitraMouseMove);
            },
            onLeaveBack: () => {
                isMitraSectionActive = false;
                if (mitraAnimationId) cancelAnimationFrame(mitraAnimationId); mitraAnimationId = null;
                gsap.to(elements.map(e => e.material), {opacity: 0, duration: 0.5});
                document.removeEventListener('mousemove', onMitraMouseMove);
            },
            onEnterBack: () => {
                isMitraSectionActive = true;
                if (mitraAnimationId) cancelAnimationFrame(mitraAnimationId);
                animateMitra3D();
                gsap.to(elements.map(e => e.material), {opacity: 0.6, duration: 0.5, stagger: 0.1});
                document.addEventListener('mousemove', onMitraMouseMove);
            },
        });
    } else {
        console.warn("ScrollTrigger or projectsInternalTimeline not found for MITRA OS 3D. Animating continuously.");
        isMitraSectionActive = true;
        animateMitra3D();
        gsap.to(elements.map(e => e.material), {opacity: 0.6, duration: 0.5, stagger: 0.1});
        document.addEventListener('mousemove', onMitraMouseMove);
    }
}

if (typeof ScrollTrigger !== 'undefined' && typeof horizontalScroll !== 'undefined') {
    ScrollTrigger.create({
        trigger: ".projects-section",
        containerAnimation: horizontalScroll,
        start: "left right-=25%", // Start initializing a bit before projects section is fully in view
        once: true,
        onEnter: () => {
             // Check if mitra-os module is one of the early ones.
             // This is a heuristic. A more robust way might involve checking its actual position.
            const mitraModule = document.getElementById('mitra-os');
            if (mitraModule && parseFloat(mitraModule.offsetLeft) < window.innerWidth * 2) { // If it's within the first two "screens" of projects
                setTimeout(initMitra3DScene, 100);
            }
        }
    });
     // Fallback if the above doesn't catch it (e.g. if it's the very first project)
    const mitraModule = document.getElementById('mitra-os');
    if (mitraModule && mitraModule.parentElement.firstChild === mitraModule) {
        setTimeout(initMitra3DScene, 200); // slightly longer delay for very first item
    }
} else {
    setTimeout(initMitra3DScene, 500);
}
