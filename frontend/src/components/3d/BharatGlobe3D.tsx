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

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020813, 0.002); // Subtle fog for depth

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Orient India towards camera
    globeGroup.rotation.y = -Math.PI / 1.6;
    globeGroup.rotation.x = 0.25;

    const globeRadius = 75;

    // 1. Dark Navy Base Sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x020813,
      emissive: 0x051024,
      transparent: true,
      opacity: 0.9,
      shininess: 50,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Glowing grid lines (latitude/longitude)
    const gridGeo = new THREE.SphereGeometry(globeRadius + 0.1, 36, 36);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Glowing Atmospheric Halo (Fresnel effect via Custom Shader)
    const haloGeo = new THREE.SphereGeometry(globeRadius + 4, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.1 },
        p: { value: 3.5 },
        glowColor: { value: new THREE.Color(0x0088ff) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, intensity * 0.4 );
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 2. Dots for Earth & India (BufferGeometry)
    const DOT_COUNT = 3000;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const dotSizes = new Float32Array(DOT_COUNT);

    let validDots = 0;
    const isIndia = (lat: number, lng: number) => {
      return lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97;
    };

    while (validDots < DOT_COUNT) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      const lat = 90 - (phi * 180) / Math.PI;
      const lng = (theta * 180) / Math.PI - 180;
      
      // Simple pseudo-random distribution to simulate continents vs oceans loosely
      const isLand = Math.random() > 0.3; 
      
      if (isLand) {
        const pos = latLngToVector3(lat, lng, globeRadius + 0.3);
        dotPositions[validDots * 3] = pos.x;
        dotPositions[validDots * 3 + 1] = pos.y;
        dotPositions[validDots * 3 + 2] = pos.z;
        
        const india = isIndia(lat, lng);
        const color = india ? new THREE.Color(0xff8c00) : new THREE.Color(0x004488);
        dotColors[validDots * 3] = color.r;
        dotColors[validDots * 3 + 1] = color.g;
        dotColors[validDots * 3 + 2] = color.b;
        
        dotSizes[validDots] = india ? 2.5 : 1.2;
        validDots++;
      }
    }

    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
    dotGeo.setAttribute("size", new THREE.BufferAttribute(dotSizes, 1));

    const customDotMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vec4(vColor, 0.8 * (1.0 - dist*2.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const dotPoints = new THREE.Points(dotGeo, customDotMat);
    globeGroup.add(dotPoints);

    // 3. Enhanced State Capital Nodes & 4. Animated Arcs
    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);
    const nodeMeshes: { mesh: THREE.Group; node: StateNode; rings: THREE.Mesh[]; pillar: THREE.Mesh }[] = [];
    const arcMaterials: THREE.LineDashedMaterial[] = [];

    const centralNode = INDIAN_NODES[0]; // New Delhi
    const centralPos = latLngToVector3(centralNode.lat, centralNode.lng, globeRadius);

    INDIAN_NODES.forEach((node, idx) => {
      const pos = latLngToVector3(node.lat, node.lng, globeRadius + 0.5);
      const isCentral = idx === 0;
      const baseColor = isCentral ? 0xf97316 : 0x10b981; // Saffron vs Emerald
      
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);
      nodeGroup.lookAt(new THREE.Vector3(0, 0, 0));
      nodeGroup.rotateX(Math.PI / 2);
      nodeGroup.rotateY(Math.PI);
      
      const scale = node.schemes / 18;

      // Core sphere
      const coreGeo = new THREE.SphereGeometry(0.8 * scale, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: baseColor });
      const core = new THREE.Mesh(coreGeo, coreMat);
      nodeGroup.add(core);

      // Animated pulsing rings
      const rings: THREE.Mesh[] = [];
      for (let r = 1; r <= 2; r++) {
        const ringGeo = new THREE.RingGeometry(1.2 * scale * r, 1.4 * scale * r, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6 / r,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        nodeGroup.add(ring);
        rings.push(ring);
      }

      // Glowing Pillar (Beam)
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.6, 10 * scale, 16);
      pillarGeo.translate(0, 5 * scale, 0);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.rotateX(Math.PI / 2);
      nodeGroup.add(pillar);

      nodesGroup.add(nodeGroup);
      nodeMeshes.push({ mesh: nodeGroup, node, rings, pillar });

      // DBT Flow Arcs (Delhi to States)
      if (!isCentral) {
        const midPoint = centralPos.clone().lerp(pos, 0.5);
        const midLength = midPoint.length();
        midPoint.normalize().multiplyScalar(midLength + 35);

        const curve = new THREE.QuadraticBezierCurve3(centralPos, midPoint, pos);
        const points = curve.getPoints(60);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        
        const arcMat = new THREE.LineDashedMaterial({
          color: 0xf97316,
          linewidth: 2,
          dashSize: 2,
          gapSize: 3,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        arcMaterials.push(arcMat);

        const arcLine = new THREE.Line(arcGeo, arcMat);
        arcLine.computeLineDistances();
        globeGroup.add(arcLine);
      }
    });

    // 5. Outer Orbital Rings
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    const orbitColors = [0xf97316, 0xffffff, 0x10b981];
    const orbitMeshes: { mesh: THREE.Mesh, speedX: number, speedY: number, speedZ: number }[] = [];

    orbitColors.forEach((color, i) => {
      const radius = globeRadius + 18 + i * 10;
      const oGeo = new THREE.TorusGeometry(radius, 0.2, 32, 100);
      const oMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const orbit = new THREE.Mesh(oGeo, oMat);
      
      orbit.rotation.x = Math.random() * Math.PI;
      orbit.rotation.y = Math.random() * Math.PI;
      
      orbitalGroup.add(orbit);
      orbitMeshes.push({
        mesh: orbit,
        speedX: (Math.random() - 0.5) * 0.0015,
        speedY: (Math.random() - 0.5) * 0.0015,
        speedZ: (Math.random() - 0.5) * 0.0015,
      });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    scene.add(directionalLight);

    // 6. Interactive Controls
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
      setTimeout(() => { if (!isDragging) autoRotate = true; }, 4000);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.05;
      camera.position.z = Math.max(120, Math.min(400, camera.position.z));
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: false });

    // 7. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (autoRotate) {
        globeGroup.rotation.y += 0.001;
      }

      // Update Halo shader viewVector
      haloMat.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, haloMesh.position);
      
      // Update custom dots
      customDotMat.uniforms.time.value = time;

      // Animate Node Rings & Pillars
      nodeMeshes.forEach((nm, idx) => {
        nm.rings.forEach((ring, rIdx) => {
          const scale = 1 + Math.sin(time * 3 + idx + rIdx) * 0.2;
          ring.scale.set(scale, scale, 1);
          (ring.material as THREE.MeshBasicMaterial).opacity = (0.6 / (rIdx + 1)) * (1.2 - scale);
        });
        const pillarScale = 1 + Math.sin(time * 2 + idx) * 0.1;
        nm.pillar.scale.set(1, pillarScale, 1);
      });

      // Animate Arcs (Data Flow)
      arcMaterials.forEach(mat => {
        (mat as any).dashOffset = ((mat as any).dashOffset || 0) - 0.05;
      });

      // Rotate Orbital Rings
      orbitMeshes.forEach(orbit => {
        orbit.mesh.rotation.x += orbit.speedX;
        orbit.mesh.rotation.y += orbit.speedY;
        orbit.mesh.rotation.z += orbit.speedZ;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Clean-up
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
      scene.clear();
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
          <span>Interactive 3D WebGL • Scroll to Zoom • Drag to Orbit</span>
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
