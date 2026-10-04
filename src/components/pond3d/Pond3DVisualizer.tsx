import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Pond } from '../../types/erp';
import { useERP } from '../../context/ERPContext';
import { Droplets, Wind, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Pond3DProps {
  selectedPondId?: string;
  onPondChange?: (pondId: string) => void;
  className?: string;
}

export const Pond3DVisualizer: React.FC<Pond3DProps> = ({
  selectedPondId,
  onPondChange,
  className = '',
}) => {
  const { ponds, updatePond, recordFeeding, feedItems, language } = useERP();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePondId, setActivePondId] = useState<string>(
    selectedPondId || ponds[0]?.id || ''
  );
  const [feedNotification, setFeedNotification] = useState<string | null>(null);

  const activePond = ponds.find((p) => p.id === activePondId) || ponds[0];

  useEffect(() => {
    if (selectedPondId && selectedPondId !== activePondId) {
      setActivePondId(selectedPondId);
    }
  }, [selectedPondId]);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x063945); // Deep aquatic teal
    scene.fog = new THREE.FogExp2(0x063945, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x70c5d7, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7d6, 1.8);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const waterGlow = new THREE.PointLight(0x00e1d9, 2.0, 15);
    waterGlow.position.set(0, 1, 0);
    scene.add(waterGlow);

    // 3. Pond Basin (Bed & Sand)
    const basinGeo = new THREE.CylinderGeometry(8.5, 7.0, 4.5, 32, 1, true);
    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x1a463c,
      roughness: 0.9,
      side: THREE.BackSide,
    });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = -1.5;
    scene.add(basin);

    // Pond Bed Bottom
    const bedGeo = new THREE.CircleGeometry(7.0, 32);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x0f2d25,
      roughness: 0.95,
    });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.rotation.x = -Math.PI / 2;
    bed.position.y = -3.75;
    scene.add(bed);

    // 4. Shimmering Water Surface
    const waterGeo = new THREE.PlaneGeometry(16, 16, 40, 40);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x159895,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65,
      wireframe: false,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.5;
    scene.add(water);

    // 5. Create 3D Fish School
    interface FishObject {
      group: THREE.Group;
      body: THREE.Mesh;
      tail: THREE.Mesh;
      speed: number;
      turnSpeed: number;
      target: THREE.Vector3;
      phase: number;
      color: number;
    }

    const fishList: FishObject[] = [];
    const fishColors = [0xf39c12, 0xe67e22, 0xd35400, 0xbdc3c7, 0xf1c40f, 0x16a085];

    // Helper to create a single 3D fish mesh
    const createFish = (colorHex: number): FishObject => {
      const group = new THREE.Group();

      // Fish Body (streamlined squashed sphere)
      const bodyGeo = new THREE.ConeGeometry(0.35, 1.2, 8);
      bodyGeo.rotateX(Math.PI / 2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.3,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Tail fin
      const tailGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, -0.6,
        0, 0.35, -1.1,
        0, -0.35, -1.1,
      ]);
      tailGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const tailMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
      });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      group.add(tail);

      // Random starting position within pond
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4.5;
      group.position.set(
        Math.cos(angle) * radius,
        -0.8 - Math.random() * 2.2,
        Math.sin(angle) * radius
      );

      scene.add(group);

      return {
        group,
        body,
        tail,
        speed: 0.03 + Math.random() * 0.04,
        turnSpeed: 0.02 + Math.random() * 0.02,
        target: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          -1.5,
          (Math.random() - 0.5) * 8
        ),
        phase: Math.random() * Math.PI * 2,
        color: colorHex,
      };
    };

    // Instantiate 14 fish
    for (let i = 0; i < 14; i++) {
      fishList.push(createFish(fishColors[i % fishColors.length]));
    }

    // 6. Oxygen Aerator Bubbles (Particle System)
    const bubbleCount = 70;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      bubblePositions[i * 3 + 0] = -3.5 + (Math.random() - 0.5) * 1.5;
      bubblePositions[i * 3 + 1] = -3.2 + Math.random() * 3.5;
      bubblePositions[i * 3 + 2] = -2.5 + (Math.random() - 0.5) * 1.5;
      bubbleVelocities[i] = 0.04 + Math.random() * 0.04;
    }

    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xe0f7fa,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    scene.add(bubbles);

    // Aerator paddlewheel representation
    const aeratorGroup = new THREE.Group();
    aeratorGroup.position.set(-3.5, 0.4, -2.5);
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    aeratorGroup.add(wheel);
    scene.add(aeratorGroup);

    // 7. Feed Pellets Array
    interface FeedPellet {
      mesh: THREE.Mesh;
      vy: number;
    }
    const activePellets: FeedPellet[] = [];
    const pelletGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const pelletMat = new THREE.MeshStandardMaterial({ color: 0xd4ac0d, roughness: 0.5 });

    // Expose dropPellets trigger
    (container as unknown as { dropPellets: () => void }).dropPellets = () => {
      for (let i = 0; i < 15; i++) {
        const mesh = new THREE.Mesh(pelletGeo, pelletMat);
        mesh.position.set(
          (Math.random() - 0.5) * 5,
          0.8 + Math.random() * 0.5,
          (Math.random() - 0.5) * 5
        );
        scene.add(mesh);
        activePellets.push({ mesh, vy: -0.015 - Math.random() * 0.01 });
      }

      // Attract fish towards center
      fishList.forEach((f) => {
        f.target.set((Math.random() - 0.5) * 2, -0.6, (Math.random() - 0.5) * 2);
        f.speed = 0.08; // Fast swim to food
      });
    };

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rippling water surface animation
      const pos = waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z =
          Math.sin(u * 1.5 + elapsedTime * 2.2) * 0.08 +
          Math.cos(v * 1.5 + elapsedTime * 1.8) * 0.08;
        pos.setZ(i, z);
      }
      waterGeo.computeVertexNormals();
      pos.needsUpdate = true;

      // Aerator paddle rotation
      if (activePond?.aeratorRunning) {
        wheel.rotation.x += 0.15;
        bubbles.visible = true;

        // Animate rising bubbles
        const bPos = bubbleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < bubbleCount; i++) {
          let y = bPos.getY(i);
          y += bubbleVelocities[i];
          if (y > 0.4) {
            y = -3.2; // Reset to bottom
            bPos.setX(i, -3.5 + (Math.random() - 0.5) * 1.2);
            bPos.setZ(i, -2.5 + (Math.random() - 0.5) * 1.2);
          }
          bPos.setY(i, y);
        }
        bPos.needsUpdate = true;
      } else {
        bubbles.visible = false;
      }

      // Feed Pellets falling
      for (let i = activePellets.length - 1; i >= 0; i--) {
        const pellet = activePellets[i];
        pellet.mesh.position.y += pellet.vy;
        if (pellet.mesh.position.y < -3.6) {
          scene.remove(pellet.mesh);
          activePellets.splice(i, 1);
        }
      }

      // Fish swimming & flocking
      fishList.forEach((fish) => {
        fish.phase += 0.18;

        // Tail wiggle
        fish.tail.rotation.y = Math.sin(fish.phase) * 0.45;
        fish.group.rotation.z = Math.sin(fish.phase) * 0.08;

        // Move towards target
        const dir = new THREE.Vector3().subVectors(fish.target, fish.group.position);
        const dist = dir.length();

        if (dist < 1.2 || Math.random() < 0.01) {
          // Pick new random target within pond radius
          const angle = Math.random() * Math.PI * 2;
          const radius = 1.0 + Math.random() * 4.5;
          fish.target.set(
            Math.cos(angle) * radius,
            -0.8 - Math.random() * 2.2,
            Math.sin(angle) * radius
          );
          fish.speed = 0.03 + Math.random() * 0.03;
        }

        dir.normalize();
        fish.group.position.addScaledVector(dir, fish.speed);

        // Smooth rotation to face swim direction
        const targetRotY = Math.atan2(-dir.x, -dir.z);
        fish.group.rotation.y += (targetRotY - fish.group.rotation.y) * fish.turnSpeed;
      });

      // Gentle camera sway
      camera.position.x = Math.sin(elapsedTime * 0.15) * 1.5;
      camera.lookAt(0, -0.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 640;
      const newH = container.clientHeight || 340;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      basinGeo.dispose();
      basinMat.dispose();
      bedGeo.dispose();
      bedMat.dispose();
    };
  }, [activePondId, activePond?.aeratorRunning]);

  // Handle feed button click
  const handleDropFeed = () => {
    if (mountRef.current && (mountRef.current as unknown as { dropPellets?: () => void }).dropPellets) {
      (mountRef.current as unknown as { dropPellets: () => void }).dropPellets();
    }

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#f1c40f', '#f39c12', '#2ecc71'],
    });

    if (activePond && feedItems.length > 0) {
      recordFeeding({
        date: new Date().toISOString().split('T')[0],
        pondId: activePond.id,
        feedItemId: feedItems[0].id,
        quantityKg: 25,
        timeSlot: 'Morning (07:00)',
        loggedBy: 'Visualizer Auto-Feed',
        notes: 'Interactive feed dispensed via 3D pond viewer',
      });
    }

    setFeedNotification(
      language === 'bn'
        ? `খাবার দেওয়া হয়েছে: ২৫ কেজি ফিড ${activePond?.nameBn || activePond?.name} এ ছিটানো হয়েছে!`
        : `Fed 25 KG feed to ${activePond?.name}!`
    );

    setTimeout(() => setFeedNotification(null), 3500);
  };

  // Toggle Aerator
  const toggleAerator = () => {
    if (!activePond) return;
    const nextState = !activePond.aeratorRunning;
    updatePond(activePond.id, {
      aeratorRunning: nextState,
      dissolvedOxygen: nextState ? 7.2 : 5.4,
    });
  };

  return (
    <div className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-[320px] md:h-[400px] cursor-grab active:cursor-grabbing" />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-teal-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            3D Pond View
          </span>
          <span className="text-slate-500">|</span>
          <select
            value={activePondId}
            onChange={(e) => {
              setActivePondId(e.target.value);
              onPondChange?.(e.target.value);
            }}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {ponds.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                {language === 'bn' && p.nameBn ? p.nameBn : p.name} ({p.areaDecimal} dec)
              </option>
            ))}
          </select>
        </div>

        {/* Live Water Telemetry HUD */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-mono tabular-nums">
          <div className="text-slate-300">
            <span className="text-slate-500 text-[10px] block">TEMP</span>
            {activePond?.temperatureC.toFixed(1)}°C
          </div>
          <div className="text-slate-300">
            <span className="text-slate-500 text-[10px] block">pH</span>
            {activePond?.waterPh.toFixed(1)}
          </div>
          <div className="text-teal-300">
            <span className="text-slate-500 text-[10px] block">DO</span>
            {activePond?.dissolvedOxygen.toFixed(1)} mg/L
          </div>
          <div className="text-slate-300">
            <span className="text-slate-500 text-[10px] block">DEPTH</span>
            {activePond?.depthFeet.toFixed(1)} ft
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {feedNotification && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 font-medium px-4 py-1.5 rounded-full shadow-lg text-xs backdrop-blur-md animate-bounce">
          {feedNotification}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Feed Button */}
          <button
            onClick={handleDropFeed}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-semibold rounded-lg shadow-md transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'bn' ? 'খাবার দিন (Feed 25kg)' : 'Feed Pond (25 KG)'}
          </button>

          {/* Aerator Switch */}
          <button
            onClick={toggleAerator}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activePond?.aeratorRunning
                ? 'bg-teal-600/30 text-teal-300 border-teal-500/60'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            <Wind className={`w-3.5 h-3.5 ${activePond?.aeratorRunning ? 'animate-spin' : ''}`} />
            {activePond?.aeratorRunning
              ? language === 'bn' ? 'এরেটর চালু (ON)' : 'Aerator: Running'
              : language === 'bn' ? 'এরেটর বন্ধ (OFF)' : 'Aerator: Stopped'}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded">
          <Droplets className="w-3 h-3 text-cyan-400" />
          <span>Biomass: {activePond?.stockingCapacityKg.toLocaleString()} KG Cap</span>
        </div>
      </div>
    </div>
  );
};
