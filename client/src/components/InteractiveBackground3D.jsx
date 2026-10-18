import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D WebGL Background powered by Three.js
 * Features:
 * - Floating crystalline 3D polyhedra (Emerald, Amber Gold, Coral)
 * - 3D particle constellation with interactive mouse parallax
 * - Mouse click energy ripple burst in 3D space
 * - Zero purple, zero blue, zero black
 */
export const InteractiveBackground3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color Palette: Emerald, Amber Gold, Coral Rose, Mint Jade
    const emeraldColor = new THREE.Color(0x10b981);
    const goldColor = new THREE.Color(0xf59e0b);
    const coralColor = new THREE.Color(0xf97316);
    const mintColor = new THREE.Color(0x34d399);

    // 1. Interactive 3D Particles Constellation
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const palette = [emeraldColor, goldColor, coralColor, mintColor];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.08,
        y: (Math.random() - 0.5) * 0.08,
        z: (Math.random() - 0.5) * 0.05,
      });

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 2. Floating 3D Geometric Polyhedra (Crystalline 3D Nodes)
    const geometricGroup = new THREE.Group();
    const crystals = [];

    const geoTypes = [
      new THREE.IcosahedronGeometry(3.5, 0),
      new THREE.OctahedronGeometry(3, 0),
      new THREE.TetrahedronGeometry(2.8, 0),
      new THREE.DodecahedronGeometry(3.2, 0),
      new THREE.TorusGeometry(3.5, 0.9, 12, 28),
    ];

    const crystalMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.25,
        metalness: 0.75,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.2,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      }),
    ];

    for (let i = 0; i < 9; i++) {
      const geo = geoTypes[i % geoTypes.length];
      const mat = crystalMaterials[i % crystalMaterials.length].clone();
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 90,
        (Math.random() - 0.5) * 40 - 10
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.01,
      };

      crystals.push({ mesh, rotSpeed });
      geometricGroup.add(mesh);
    }

    scene.add(geometricGroup);

    // 3. Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 120);
    emeraldLight.position.set(-30, 20, 20);
    scene.add(emeraldLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 120);
    goldLight.position.set(40, -25, 20);
    scene.add(goldLight);

    const coralLight = new THREE.PointLight(0xf97316, 2, 100);
    coralLight.position.set(0, 30, 10);
    scene.add(coralLight);

    // 4. Interactive 3D Pulse Rings (Triggered on click)
    const ripples = [];
    const rippleGeo = new THREE.RingGeometry(0.5, 1.2, 32);

    const spawnRipple = (worldX, worldY) => {
      const rippleMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x10b981 : 0xf59e0b,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(rippleGeo, rippleMat);
      ring.position.set(worldX, worldY, 15);
      scene.add(ring);
      ripples.push({ mesh: ring, scale: 1, maxScale: 35, opacity: 0.8 });
    };

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCameraX = mouseX * 12;
      targetCameraY = mouseY * 8;

      // Dynamic light tracking
      emeraldLight.position.x = mouseX * 40;
      emeraldLight.position.y = mouseY * 30;
    };

    const handleClick = (e) => {
      // Unproject mouse coordinates to 3D world
      const vector = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      spawnRipple(pos.x, pos.y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop (60 FPS)
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Rotate polyhedra
      crystals.forEach(({ mesh, rotSpeed }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;
      });

      // Slowly oscillate geometric group
      geometricGroup.rotation.y += 0.0012;
      geometricGroup.rotation.x += 0.0006;

      // Update particles
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i].x;
        posArr[i * 3 + 1] += velocities[i].y;
        posArr[i * 3 + 2] += velocities[i].z;

        // Boundary rebound
        if (Math.abs(posArr[i * 3]) > 80) velocities[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 60) velocities[i].y *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 40) velocities[i].z *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0004;

      // Animate ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.scale += 0.9;
        r.opacity -= 0.022;
        r.mesh.scale.set(r.scale, r.scale, 1);
        r.mesh.material.opacity = Math.max(0, r.opacity);

        if (r.opacity <= 0 || r.scale >= r.maxScale) {
          scene.remove(r.mesh);
          r.mesh.geometry.dispose();
          r.mesh.material.dispose();
          ripples.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      crystals.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-canvas-container pointer-events-none"
      style={{ zIndex: 0 }}
      title="Interactive 3D Universe - Move cursor or click to interact"
    />
  );
};
