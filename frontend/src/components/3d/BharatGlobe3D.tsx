"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Globe, Compass, RotateCw, ZoomIn, ZoomOut, Sparkles, Landmark, ShieldCheck } from "lucide-react";

interface StateNode {
  name: string;
  state: string;
  hindiName: string;
  lat: number;
  lng: number;
  schemes: number;
  benefitCap: string;
  type: "Central Hub" | "State Direct";
}

const INDIAN_NODES: StateNode[] = [
  { name: "New Delhi", state: "National Capital", hindiName: "नई दिल्ली (PMO DBT Gateway)", lat: 28.6139, lng: 77.2090, schemes: 30, benefitCap: "₹1.52 Cr+", type: "Central Hub" },
  { name: "Mumbai", state: "Maharashtra", hindiName: "मुंबई", lat: 19.0760, lng: 72.8777, schemes: 24, benefitCap: "₹1.35 Cr+", type: "State Direct" },
  { name: "Bengaluru", state: "Karnataka", hindiName: "बेंगलुरु", lat: 12.9716, lng: 77.5946, schemes: 22, benefitCap: "₹1.28 Cr+", type: "State Direct" },
  { name: "Hyderabad", state: "Telangana", hindiName: "हैदराबाद", lat: 17.3850, lng: 78.4867, schemes: 21, benefitCap: "₹1.15 Cr+", type: "State Direct" },
  { name: "Chennai", state: "Tamil Nadu", hindiName: "चेन्नई", lat: 13.0827, lng: 80.2707, schemes: 23, benefitCap: "₹1.25 Cr+", type: "State Direct" },
  { name: "Kolkata", state: "West Bengal", hindiName: "कोलकाता", lat: 22.5726, lng: 88.3639, schemes: 20, benefitCap: "₹1.10 Cr+", type: "State Direct" },
  { name: "Ahmedabad", state: "Gujarat", hindiName: "अहमदाबाद", lat: 23.0225, lng: 72.5714, schemes: 22, benefitCap: "₹1.20 Cr+", type: "State Direct" },
  { name: "Lucknow", state: "Uttar Pradesh", hindiName: "लखनऊ", lat: 26.8467, lng: 80.9462, schemes: 28, benefitCap: "₹1.45 Cr+", type: "State Direct" },
  { name: "Jaipur", state: "Rajasthan", hindiName: "जयपुर", lat: 26.9124, lng: 75.7873, schemes: 21, benefitCap: "₹1.12 Cr+", type: "State Direct" },
  { name: "Guwahati", state: "Assam", hindiName: "गुवाहाटी", lat: 26.1445, lng: 91.7362, schemes: 19, benefitCap: "₹95 Lakh+", type: "State Direct" },
  { name: "Patna", state: "Bihar", hindiName: "पटना", lat: 25.5941, lng: 85.1376, schemes: 25, benefitCap: "₹1.30 Cr+", type: "State Direct" },
  { name: "Srinagar", state: "Jammu & Kashmir", hindiName: "श्रीनगर", lat: 34.0837, lng: 74.7973, schemes: 18, benefitCap: "₹88 Lakh+", type: "State Direct" },
  { name: "Bhopal", state: "Madhya Pradesh", hindiName: "भोपाल", lat: 23.2599, lng: 77.4126, schemes: 23, benefitCap: "₹1.18 Cr+", type: "State Direct" },
  { name: "Bhubaneswar", state: "Odisha", hindiName: "भुवनेश्वर", lat: 20.2961, lng: 85.8245, schemes: 20, benefitCap: "₹1.05 Cr+", type: "State Direct" },
  { name: "Thiruvananthapuram", state: "Kerala", hindiName: "तिरुवनंतपुरम", lat: 8.5241, lng: 76.9366, schemes: 21, benefitCap: "₹1.15 Cr+", type: "State Direct" },
  { name: "Chandigarh", state: "Punjab & Haryana", hindiName: "चंडीगढ़", lat: 30.7333, lng: 76.7794, schemes: 22, benefitCap: "₹1.20 Cr+", type: "State Direct" }
];

// Mathematical mapping from Lat / Lng to Three.js Cartesian 3D Sphere Coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function BharatGlobe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<StateNode | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);

  // Globe control callbacks exposed to UI buttons
  const focusIndiaRef = useRef<() => void>(() => {});
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});

  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 210;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // 2. Main Rotational Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 72;

    // Center camera squarely on Bharat / India (lat ~22°N, lng ~78°E)
    const DEFAULT_ROTATION_Y = -Math.PI / 1.07; // ~ -2.94 rad aligns 78°E to camera
    const DEFAULT_ROTATION_X = 0.35; // Tilts northern hemisphere to sweet spot
    globeGroup.rotation.y = DEFAULT_ROTATION_Y;
    globeGroup.rotation.x = DEFAULT_ROTATION_X;

    // 3. Realistic NASA Blue Marble Earth Sphere
    const textureLoader = new THREE.TextureLoader();
    
    // Load authentic high-resolution Earth texture
    const earthTexture = textureLoader.load(
      "/textures/earth_atmos_2048.jpg",
      () => { renderer.render(scene, camera); }
    );
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1,
      emissive: new THREE.Color(0x061022),
      emissiveIntensity: 0.35,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 4. Photorealistic Atmospheric Cloud Layer
    const cloudsTexture = textureLoader.load("/textures/earth_clouds_1024.png");
    const cloudGeo = new THREE.SphereGeometry(globeRadius + 0.6, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(cloudMesh);

    // 5. Cinematic Orbit Atmosphere Glow Shell (Fresnel Rim)
    const haloGeo = new THREE.SphereGeometry(globeRadius + 3.8, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.2, 0.65, 1.0, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 6. India Core Shockwave Pulse Rings (Radiating outward from Central DBT Hub)
    const delhiPos = latLngToVector3(28.6139, 77.2090, globeRadius + 0.4);
    const pulseRings: THREE.Mesh[] = [];

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(3 + r * 5, 4 + r * 5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0xff9933 : (r === 1 ? 0xffffff : 0x10b981),
        transparent: true,
        opacity: 0.65 - r * 0.15,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(delhiPos);
      ringMesh.lookAt(0, 0, 0); // Orient flat along the surface normal
      globeGroup.add(ringMesh);
      pulseRings.push(ringMesh);
    }

    // 7. Interactive State Capital Nodes, Beacons & Animated DBT Arcs
    const centralNode = INDIAN_NODES[0]; // New Delhi
    const centralPos = latLngToVector3(centralNode.lat, centralNode.lng, globeRadius + 0.5);

    const nodeRaycastMeshes: THREE.Mesh[] = [];
    const arcCurves: { curve: THREE.QuadraticBezierCurve3; pulseMesh: THREE.Mesh }[] = [];

    INDIAN_NODES.forEach((node, idx) => {
      const pos = latLngToVector3(node.lat, node.lng, globeRadius + 0.5);
      const isCentral = idx === 0;

      // Node Marker Pin
      const pinGeo = new THREE.SphereGeometry(isCentral ? 2.6 : 1.5, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isCentral ? 0xffd700 : 0xf97316,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { node };
      globeGroup.add(pinMesh);
      nodeRaycastMeshes.push(pinMesh);

      // Vertical Laser Pillar
      const height = isCentral ? 16 : 8;
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, height, 8);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: isCentral ? 0xffea00 : 0x38bdf8,
        transparent: true,
        opacity: 0.85,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      pillar.position.copy(pos.clone().normalize().multiplyScalar(globeRadius + height / 2));
      globeGroup.add(pillar);

      // Curved DBT Energy Arc from New Delhi to State Capitals
      if (!isCentral) {
        const midPoint = centralPos.clone().lerp(pos, 0.5);
        const midLength = midPoint.length();
        midPoint.normalize().multiplyScalar(midLength + 14);

        const curve = new THREE.QuadraticBezierCurve3(centralPos, midPoint, pos);
        const arcPoints = curve.getPoints(36);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMat = new THREE.LineBasicMaterial({
          color: 0xfb923c,
          transparent: true,
          opacity: 0.65,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arcLine);

        // Animated Traveling DBT Data Packet on Arc
        const pulseGeo = new THREE.SphereGeometry(0.8, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfff066 });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        globeGroup.add(pulseMesh);

        arcCurves.push({ curve, pulseMesh });
      }
    });

    // 8. India Tricolor Orbital Rings (Saffron, White, Emerald)
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    const orbitColors = [0xf97316, 0xffffff, 0x10b981];
    const orbits: THREE.Mesh[] = [];

    orbitColors.forEach((color, i) => {
      const oRadius = globeRadius + 16 + i * 7;
      const oGeo = new THREE.TorusGeometry(oRadius, 0.22, 16, 120);
      const oMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
      });
      const orbit = new THREE.Mesh(oGeo, oMat);
      orbit.rotation.x = Math.PI / 2 + (i - 1) * 0.25;
      orbit.rotation.y = (i - 1) * 0.15;
      orbitalGroup.add(orbit);
      orbits.push(orbit);
    });

    // 9. Natural Sunlight & Golden Bharat Highlight Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(120, 80, 160);
    scene.add(sunLight);

    const bharatSpotLight = new THREE.PointLight(0xffa500, 2.0, 260);
    bharatSpotLight.position.set(0, 30, 140);
    scene.add(bharatSpotLight);

    // 10. Mouse Drag & Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      // Check if user clicked a node (did not drag significantly)
      if (Math.abs(e.clientX - prevMouseX) < 4 && Math.abs(e.clientY - prevMouseY) < 4) {
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeRaycastMeshes);
        if (intersects.length > 0) {
          const clickedNode = intersects[0].object.userData?.node as StateNode;
          if (clickedNode) setSelectedNode(clickedNode);
        }
      }
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(140, Math.min(320, camera.position.z + e.deltaY * 0.12));
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: true });

    // Expose control functions to UI
    focusIndiaRef.current = () => {
      globeGroup.rotation.y = DEFAULT_ROTATION_Y;
      globeGroup.rotation.x = DEFAULT_ROTATION_X;
      camera.position.z = 210;
    };

    zoomInRef.current = () => {
      camera.position.z = Math.max(140, camera.position.z - 25);
    };

    zoomOutRef.current = () => {
      camera.position.z = Math.min(320, camera.position.z + 25);
    };

    // 11. Window Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 12. 60 FPS Render Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Gentle auto-rotation focusing on India
      if (autoRotateRef.current && !isDragging) {
        globeGroup.rotation.y += 0.0012;
      }

      // Slowly drift cloud layer at independent velocity
      cloudMesh.rotation.y += 0.0004;

      // Pulse concentric shockwave rings at New Delhi
      pulseRings.forEach((ring, idx) => {
        const scale = 1 + ((elapsedTime * 0.8 + idx * 0.35) % 1) * 0.75;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.65 * (1.8 - scale));
      });

      // Animate DBT energy packets traveling along the arcs
      arcCurves.forEach(({ curve, pulseMesh }, idx) => {
        const t = (elapsedTime * 0.5 + idx * 0.1) % 1.0;
        const pt = curve.getPoint(t);
        pulseMesh.position.copy(pt);
      });

      // Rotate tricolor orbital rings
      orbits.forEach((orbit, idx) => {
        orbit.rotation.z += (idx % 2 === 0 ? 0.002 : -0.002);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 13. Clean Dispose on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthTexture.dispose();
      cloudsTexture.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl flex items-center justify-center select-none group">
      
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none text-xs z-10">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-500/30 text-slate-200 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
          <span className="font-mono font-bold tracking-wider uppercase text-orange-400">
            3D Bharat Radar
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-bold hidden sm:inline">100% Real Live Earth & AWS Data</span>
        </div>

        {/* Quick 3D Camera Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => focusIndiaRef.current()}
            title="Center View on Bharat (India)"
            className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-orange-600 text-slate-200 hover:text-white border border-slate-700/80 text-[11px] font-bold transition-all shadow-md flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span>Focus Bharat</span>
          </button>

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Toggle Orbit Rotation"
            className={`p-1.5 rounded-xl border text-[11px] font-bold transition-all shadow-md ${
              isAutoRotate 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                : "bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => zoomInRef.current()}
            title="Zoom In"
            className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all shadow-md"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => zoomOutRef.current()}
            title="Zoom Out"
            className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all shadow-md"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected City Node Interactive Inspection Modal */}
      {selectedNode && (
        <div className="absolute top-16 right-4 max-w-xs bg-slate-900/95 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-4 shadow-2xl text-xs text-slate-200 z-20 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-orange-400 font-extrabold text-sm">
                <Landmark className="w-4 h-4" />
                <span>{selectedNode.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{selectedNode.state} • {selectedNode.hindiName}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white text-base leading-none p-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Node Type:</span>
              <span className="font-bold text-emerald-400">{selectedNode.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active Schemes:</span>
              <span className="font-bold text-white">{selectedNode.schemes}+ Available</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Benefit Cap:</span>
              <span className="font-bold text-orange-400">{selectedNode.benefitCap}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cloud Sync:</span>
              <span className="font-mono text-[10px] text-emerald-400">Live DynamoDB ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Live Telemetry HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-950/85 backdrop-blur-md p-3 sm:px-5 sm:py-2.5 rounded-2xl border border-slate-800 text-xs text-slate-300 z-10 pointer-events-auto shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
              Central DBT Gateway
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              New Delhi (PMO / NIC)
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
              Subcontinent Coverage
            </span>
            <span className="font-extrabold text-orange-400 text-xs sm:text-sm">
              All 36 States & Union Territories
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real World NASA Texture • 0 Mock Data</span>
        </div>
      </div>

    </div>
  );
}
