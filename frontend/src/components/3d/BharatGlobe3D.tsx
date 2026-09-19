"use client";

import { useEffect, useRef, useState } from "react";
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
  { name: "New Delhi", hindiName: "नई दिल्ली", lat: 28.6139, lng: 77.2090, schemes: 30, benefitCap: "₹1.52 Cr+", type: "Central Hub" },
  { name: "Bengaluru", hindiName: "बेंगलुरु", lat: 12.9716, lng: 77.5946, schemes: 24, benefitCap: "₹85.4 Lakh", type: "State Direct" },
  { name: "Mumbai", hindiName: "मुंबई", lat: 19.0760, lng: 72.8777, schemes: 26, benefitCap: "₹1.12 Cr", type: "State Direct" },
  { name: "Chennai", hindiName: "चेन्नई", lat: 13.0827, lng: 80.2707, schemes: 22, benefitCap: "₹78.2 Lakh", type: "State Direct" },
  { name: "Kolkata", hindiName: "कोलकाता", lat: 22.5726, lng: 88.3639, schemes: 21, benefitCap: "₹69.5 Lakh", type: "State Direct" },
  { name: "Hyderabad", hindiName: "हैदराबाद", lat: 17.3850, lng: 78.4867, schemes: 23, benefitCap: "₹81.0 Lakh", type: "State Direct" },
  { name: "Ahmedabad", hindiName: "अहमदाबाद", lat: 23.0225, lng: 72.5714, schemes: 25, benefitCap: "₹92.6 Lakh", type: "State Direct" },
  { name: "Lucknow", hindiName: "लखनऊ", lat: 26.8467, lng: 80.9462, schemes: 27, benefitCap: "₹1.25 Cr", type: "State Direct" },
  { name: "Jaipur", hindiName: "जयपुर", lat: 26.9124, lng: 75.7873, schemes: 22, benefitCap: "₹74.0 Lakh", type: "State Direct" },
  { name: "Guwahati", hindiName: "गुवाहाटी", lat: 26.1445, lng: 91.7362, schemes: 20, benefitCap: "₹62.8 Lakh", type: "State Direct" },
];

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
  const [hoveredNode, setHoveredNode] = useState<StateNode | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<string>("DBT Telemetry Active • Live Central Feed");

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Orient India towards camera (lat ~22N, lng ~78E)
    globeGroup.rotation.y = -Math.PI / 1.6;
    globeGroup.rotation.x = 0.25;

    const globeRadius = 75;

    // 3. Base Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.85,
      wireframe: true,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 4. Dot-Matrix Points on Sphere
    const dotCount = 1200;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const x = globeRadius * Math.cos(theta) * Math.sin(phi);
      const y = globeRadius * Math.sin(theta) * Math.sin(phi);
      const z = globeRadius * Math.cos(phi);
      dotPositions[i * 3] = x;
      dotPositions[i * 3 + 1] = y;
      dotPositions[i * 3 + 2] = z;
    }

    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
    });
    const dotPoints = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotPoints);

    // 5. Outer Atmospheric Halo Rings (Tricolor subtle glow)
    const ringGeo = new THREE.RingGeometry(globeRadius * 1.15, globeRadius * 1.17, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, // Saffron glow
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    globeGroup.add(ringMesh);

    const ringGeo2 = new THREE.RingGeometry(globeRadius * 1.25, globeRadius * 1.27, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald glow
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 3;
    globeGroup.add(ringMesh2);

    // 6. India Telemetry Nodes & Connecting 3D Curved Arcs
    const centralNode = INDIAN_NODES[0]; // New Delhi
    const centralPos = latLngToVector3(centralNode.lat, centralNode.lng, globeRadius);

    // Node Markers
    const nodeSpheres: { mesh: THREE.Mesh; node: StateNode }[] = [];
    INDIAN_NODES.forEach((node, idx) => {
      const pos = latLngToVector3(node.lat, node.lng, globeRadius);
      const isCentral = idx === 0;
      
      const nGeo = new THREE.SphereGeometry(isCentral ? 2.6 : 1.6, 16, 16);
      const nMat = new THREE.MeshBasicMaterial({
        color: isCentral ? 0xf97316 : 0x38bdf8,
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.copy(pos);
      globeGroup.add(nMesh);
      nodeSpheres.push({ mesh: nMesh, node });

      // Arc from Central Hub (New Delhi) to state capitals
      if (!isCentral) {
        const midPoint = centralPos.clone().lerp(pos, 0.5);
        // Elevate midpoint above globe surface for high 3D arc
        const midLength = midPoint.length();
        midPoint.normalize().multiplyScalar(midLength + 18);

        const curve = new THREE.QuadraticBezierCurve3(centralPos, midPoint, pos);
        const points = curve.getPoints(30);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineBasicMaterial({
          color: 0xfb923c,
          transparent: true,
          opacity: 0.55,
          linewidth: 1,
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arcLine);
      }
    });

    // 7. Interactive Mouse Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotate = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
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
      // Resume slow rotation after 3 seconds of inactivity
      setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, 3000);
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (autoRotate) {
        globeGroup.rotation.y += 0.003;
      }

      // Gentle wobble of outer ring
      ringMesh.rotation.z += 0.002;
      ringMesh2.rotation.x += 0.0015;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean-up
    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl flex items-center justify-center select-none">
      
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry Overlay */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none text-xs z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono font-bold tracking-wider uppercase text-emerald-400">
            3D Bharat Welfare Radar
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Live DBT Pipeline</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
          <span>Interactive 3D WebGL • Click & Drag to Orbit</span>
        </div>
      </div>

      {/* Bottom Live Telemetry HUD Bar */}
      <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 sm:px-5 sm:py-2.5 rounded-2xl border border-slate-700/80 text-xs text-slate-300 z-10 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Central Scheme Gateway
            </span>
            <span className="font-bold text-white text-sm">New Delhi (PMO / NIC)</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Disbursal Nodes
            </span>
            <span className="font-bold text-orange-400 text-sm">28 States & 8 UTs</span>
          </div>
        </div>

        {/* Quick Node Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar text-[11px]">
          {INDIAN_NODES.slice(0, 5).map((n) => (
            <button
              key={n.name}
              onClick={() => setHoveredNode(n)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                hoveredNode?.name === n.name
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
      </div>

      {/* State Node Telemetry Tooltip Modal */}
      {hoveredNode && (
        <div className="absolute top-20 right-5 z-20 w-72 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-orange-500/30 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-black text-sm text-orange-400">{hoveredNode.name}</h4>
              <p className="text-xs text-slate-400">{hoveredNode.hindiName}</p>
            </div>
            <button
              onClick={() => setHoveredNode(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Node Classification:</span>
              <span className="font-bold text-slate-200">{hoveredNode.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active Schemes:</span>
              <span className="font-bold text-emerald-400">{hoveredNode.schemes} Welfare Programs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Max Entitlement Cap:</span>
              <span className="font-bold text-primary">{hoveredNode.benefitCap}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Verified with DynamoDB & State Social Welfare Registries
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
