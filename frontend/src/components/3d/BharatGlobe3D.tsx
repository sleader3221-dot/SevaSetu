"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface StateNode {
  name: string;
  hindiName: string;
  lat: number;
  lng: number;
  schemes: number;
  benefitCap: string;
  type: "Central Hub" | "State Direct";
}

const INDIAN_NODES: StateNode[] = [
  { name: "New Delhi", hindiName: "नई दिल्ली (PMO)", lat: 28.6139, lng: 77.2090, schemes: 30, benefitCap: "₹1.52 Cr+", type: "Central Hub" },
  { name: "Bengaluru", hindiName: "बेंगलुरु", lat: 12.9716, lng: 77.5946, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Mumbai", hindiName: "मुंबई", lat: 19.0760, lng: 72.8777, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Chennai", hindiName: "चेन्नई", lat: 13.0827, lng: 80.2707, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Kolkata", hindiName: "कोलकाता", lat: 22.5726, lng: 88.3639, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Hyderabad", hindiName: "हैदराबाद", lat: 17.3850, lng: 78.4867, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Ahmedabad", hindiName: "अहमदाबाद", lat: 23.0225, lng: 72.5714, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Lucknow", hindiName: "लखनऊ", lat: 26.8467, lng: 80.9462, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Jaipur", hindiName: "जयपुर", lat: 26.9124, lng: 75.7873, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
  { name: "Guwahati", hindiName: "गुवाहाटी", lat: 26.1445, lng: 91.7362, schemes: 30, benefitCap: "₹1.52 Cr+", type: "State Direct" },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate high-resolution procedural Earth texture with India brightly illuminated
function createEarthCanvasTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Space Midnight Ocean Background
  ctx.fillStyle = "#030914";
  ctx.fillRect(0, 0, width, height);

  // 2. Latitude / Longitude Grid Lines
  ctx.strokeStyle = "rgba(0, 150, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 3. Cybernetic Continents (Simplified accurate silhouettes)
  ctx.fillStyle = "#0c1e36";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 2;

  // Helper to convert lat/lng to canvas x/y
  const toXY = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  });

  const drawPolygon = (coords: [number, number][], fill: string, stroke: string) => {
    if (coords.length < 3) return;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    const start = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i < coords.length; i++) {
      const p = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Eurasia (Broad landmass)
  drawPolygon([
    [70, -10], [70, 170], [60, 160], [40, 140], [20, 120],
    [10, 105], [5, 100], [20, 90], [25, 60], [30, 35],
    [35, 25], [40, -5], [55, -5], [65, 10]
  ], "#0a192f", "rgba(56, 189, 248, 0.2)");

  // Africa
  drawPolygon([
    [35, -5], [30, 32], [12, 43], [-10, 40], [-34, 25],
    [-34, 18], [-5, 10], [5, -10], [15, -17], [30, -10]
  ], "#0a192f", "rgba(56, 189, 248, 0.2)");

  // Australia
  drawPolygon([
    [-12, 130], [-12, 145], [-20, 150], [-35, 150],
    [-38, 140], [-33, 115], [-20, 115]
  ], "#0a192f", "rgba(56, 189, 248, 0.2)");

  // Americas
  drawPolygon([
    [70, -160], [60, -65], [45, -60], [30, -80], [15, -90],
    [8, -78], [10, -60], [-5, -35], [-20, -40], [-55, -65],
    [-50, -75], [-20, -70], [0, -80], [20, -105], [50, -125], [65, -165]
  ], "#0a192f", "rgba(56, 189, 248, 0.2)");

  // 4. ⭐ PROMINENT BHARAT / INDIA HIGHLIGHT (Golden Saffron & Emerald Luminous Glow)
  // Approximate accurate boundary points of India
  const indiaCoords: [number, number][] = [
    [36.5, 74.5],  // North Kashmir / Ladakh
    [35.0, 78.5],  // Ladakh / Aksai
    [31.0, 79.0],  // Uttarakhand / Tibet border
    [27.5, 88.5],  // Sikkim
    [28.0, 96.0],  // Arunachal Pradesh
    [27.0, 96.5],  // Assam / Nagaland
    [24.0, 93.0],  // Manipur / Mizoram
    [22.0, 89.5],  // West Bengal Sundarbans
    [19.5, 85.5],  // Odisha coast
    [16.0, 81.0],  // Andhra Pradesh coast
    [13.0, 80.2],  // Chennai coast
    [9.5, 79.0],   // Tamil Nadu / Palk Strait
    [8.0, 77.5],   // Kanyakumari (Southern Tip)
    [10.0, 76.0],  // Kerala coast
    [15.0, 73.8],  // Goa
    [19.0, 72.8],  // Mumbai coast
    [22.5, 69.0],  // Gujarat / Saurashtra
    [24.0, 68.5],  // Rann of Kutch
    [27.0, 71.0],  // Rajasthan / Thar
    [30.5, 74.0],  // Punjab
    [34.0, 74.0],  // Kashmir Valley
    [36.5, 74.5]   // Close loop
  ];

  // Convert India coordinates to canvas polygon
  ctx.save();
  ctx.beginPath();
  const startInd = toXY(indiaCoords[0][0], indiaCoords[0][1]);
  ctx.moveTo(startInd.x, startInd.y);
  for (let i = 1; i < indiaCoords.length; i++) {
    const pt = toXY(indiaCoords[i][0], indiaCoords[i][1]);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.closePath();

  // Vibrant Saffron & Gold Radial Gradient Fill
  const indCenter = toXY(22, 79);
  const indGradient = ctx.createRadialGradient(
    indCenter.x, indCenter.y, 10,
    indCenter.x, indCenter.y, 140
  );
  indGradient.addColorStop(0, "rgba(255, 153, 51, 0.95)");  // Saffron core
  indGradient.addColorStop(0.5, "rgba(249, 115, 22, 0.85)"); // Vibrant orange
  indGradient.addColorStop(0.85, "rgba(234, 88, 12, 0.70)"); // Deep saffron
  indGradient.addColorStop(1, "rgba(16, 185, 129, 0.60)");   // Emerald green border

  ctx.fillStyle = indGradient;
  ctx.shadowColor = "#ff9933";
  ctx.shadowBlur = 35;
  ctx.fill();

  // Glowing Golden/Saffron Border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = "#ffaa00";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // 5. India Label on Texture
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ff9933";
  ctx.shadowBlur = 15;
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("★ BHARAT (INDIA) ★", indCenter.x, indCenter.y - 45);
  ctx.font = "bold 15px sans-serif";
  ctx.fillStyle = "#ffaa33";
  ctx.fillText("NATIONAL WELFARE GATEWAY", indCenter.x, indCenter.y - 25);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export default function BharatGlobe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 210;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 72;

    // Center camera on Bharat/India (lat 22°N, lng 79°E)
    // Longitude 79°E needs rotation.y = - (79 + 90) deg
    globeGroup.rotation.y = -Math.PI / 1.32;
    globeGroup.rotation.x = 0.28;

    // 3. Globe Sphere with High-Res Texture
    const earthTexture = createEarthCanvasTexture();
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 30,
      specular: new THREE.Color(0x224488),
      emissive: new THREE.Color(0x040c1e),
      emissiveIntensity: 0.8,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // 4. Subtle Outer Atmosphere Glow Ring
    const atmoGeo = new THREE.SphereGeometry(globeRadius + 1.2, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // 5. Concentric Saffron Shockwave Rings at India Core (Representing DBT Broadcast)
    const indiaCenter = latLngToVector3(22.0, 79.0, globeRadius + 0.4);
    const pulseRings: THREE.Mesh[] = [];

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(4 + r * 6, 5 + r * 6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r === 2 ? 0x10b981 : 0xf97316,
        transparent: true,
        opacity: 0.6 - r * 0.15,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(indiaCenter);
      ringMesh.lookAt(0, 0, 0); // Align with sphere normal
      globeGroup.add(ringMesh);
      pulseRings.push(ringMesh);
    }

    // 6. State Nodes & DBT Energy Arcs from New Delhi (PMO)
    const centralNode = INDIAN_NODES[0]; // New Delhi
    const centralPos = latLngToVector3(centralNode.lat, centralNode.lng, globeRadius + 0.5);

    const nodeObjects: { mesh: THREE.Group; node: StateNode }[] = [];
    const arcLines: THREE.Line[] = [];

    INDIAN_NODES.forEach((node, idx) => {
      const pos = latLngToVector3(node.lat, node.lng, globeRadius + 0.5);
      const isCentral = idx === 0;

      const nGroup = new THREE.Group();
      nGroup.position.copy(pos);

      // Node Marker Sphere
      const nGeo = new THREE.SphereGeometry(isCentral ? 2.8 : 1.6, 16, 16);
      const nMat = new THREE.MeshBasicMaterial({
        color: isCentral ? 0xffffff : 0xf97316,
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nGroup.add(nMesh);

      // Vertical Laser Pillar (Shooting up from city)
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, isCentral ? 14 : 8, 8);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: isCentral ? 0xfbbf24 : 0x38bdf8,
        transparent: true,
        opacity: 0.8,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      pillar.position.copy(pos.clone().normalize().multiplyScalar(isCentral ? 7 : 4));
      globeGroup.add(pillar);

      globeGroup.add(nGroup);
      nodeObjects.push({ mesh: nGroup, node });

      // DBT Curved Arc (Delhi -> State Capitals)
      if (!isCentral) {
        const midPoint = centralPos.clone().lerp(pos, 0.5);
        const midLength = midPoint.length();
        midPoint.normalize().multiplyScalar(midLength + 18);

        const curve = new THREE.QuadraticBezierCurve3(centralPos, midPoint, pos);
        const points = curve.getPoints(40);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineBasicMaterial({
          color: 0xfb923c,
          transparent: true,
          opacity: 0.75,
          linewidth: 2,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arcLine);
        arcLines.push(arcLine);
      }
    });

    // 7. Tricolor Orbital Rings (Saffron, White, Emerald)
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    const orbitColors = [0xf97316, 0xffffff, 0x10b981];
    const orbits: THREE.Mesh[] = [];

    orbitColors.forEach((color, i) => {
      const radius = globeRadius + 18 + i * 8;
      const oGeo = new THREE.TorusGeometry(radius, 0.25, 16, 100);
      const oMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
      });
      const orbit = new THREE.Mesh(oGeo, oMat);
      orbit.rotation.x = Math.PI / 2 + (i - 1) * 0.3;
      orbit.rotation.y = (i - 1) * 0.2;
      orbitalGroup.add(orbit);
      orbits.push(orbit);
    });

    // 8. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(100, 80, 120);
    scene.add(sunLight);

    const indiaSpotLight = new THREE.PointLight(0xff9933, 2.5, 300);
    indiaSpotLight.position.set(0, 40, 150);
    scene.add(indiaSpotLight);

    // 9. Interactive Mouse Drag & Zoom Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setAutoRotate(false);
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

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setAutoRotate(true), 4000);
    };

    const onWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(160, Math.min(300, camera.position.z + e.deltaY * 0.1));
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: true });

    // 10. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 11. 60 FPS Render Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation focusing on India
      if (autoRotate && !isDragging) {
        globeGroup.rotation.y += 0.0015;
      }

      // Animate shockwave rings at India core
      pulseRings.forEach((ring, idx) => {
        const scale = 1 + ((elapsedTime * 0.8 + idx * 0.4) % 1) * 0.8;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1.8 - scale));
      });

      // Animate orbital rings
      orbits.forEach((orbit, idx) => {
        orbit.rotation.z += (idx % 2 === 0 ? 0.002 : -0.002);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
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
    };
  }, [autoRotate]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl flex items-center justify-center select-none">
      
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry HUD Overlay */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none text-xs z-10">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono font-bold tracking-wider uppercase text-emerald-400">
            3D Bharat Welfare Radar
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-orange-400 font-bold">Bharat Center Stage</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
          <span>Click & Drag to Orbit • Scroll to Zoom</span>
        </div>
      </div>

      {/* Bottom Live Telemetry HUD Bar */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3.5 sm:px-6 sm:py-3 rounded-2xl border border-slate-700/80 text-xs text-slate-300 z-10 pointer-events-auto">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
              National DBT Gateway
            </span>
            <span className="font-extrabold text-white text-sm">New Delhi (PMO / NIC)</span>
          </div>
          <div className="h-7 w-px bg-slate-700"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
              Pan-India Coverage
            </span>
            <span className="font-extrabold text-orange-400 text-sm">All 36 States & Union Territories</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>100% Live DynamoDB Disbursals</span>
        </div>
      </div>

    </div>
  );
}
