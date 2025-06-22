import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation } from 'react-router-dom';
import './ARView.css';
import StartARButton from '../components/StartARButton';

const ARView = () => {
  const { state } = useLocation();
  const selectedObjects = state?.selectedObjects || [];

  const [isSurfaceFound, setSurfaceFound] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const containerRef = useRef(null);

  console.log('🔍 Models passed to ARView:', selectedObjects);

  useEffect(() => {
    if (!containerRef.current || showStartButton) return;

    let camera, scene, renderer, controller;
    let reticle;
    const loader = new GLTFLoader();
    let models = [];

    const init = async () => {
      const container = containerRef.current;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      models = await Promise.all(
        selectedObjects.map(
          (object) =>
            new Promise((resolve, reject) => {
              loader.load(
                object.model,
                (gltf) => {
                  const model = gltf.scene;
                  model.scale.set(0.6, 0.6, 0.6);
                  resolve(model);
                },
                undefined,
                reject
              );
            })
        )
      );

      const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        opacity: 0.7,
        transparent: true,
      });
      reticle = new THREE.Mesh(geometry, material);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      controller = renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        if (reticle.visible && models.length > 0) {
          models.forEach((m) => {
            const clone = m.clone();
            clone.position.setFromMatrixPosition(reticle.matrix);
            clone.quaternion.setFromRotationMatrix(reticle.matrix);
            scene.add(clone);
          });
        }
      });
      scene.add(controller);

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
      });
      renderer.xr.setSession(session);

      const referenceSpace = await session.requestReferenceSpace('local');
      const viewerSpace = await session.requestReferenceSpace('viewer');
      const hitTestSource = await session.requestHitTestSource({
        space: viewerSpace,
      });

      renderer.setAnimationLoop((timestamp, frame) => {
        if (frame) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            reticle.visible = true;
            setSurfaceFound(true);
            reticle.matrix.fromArray(pose.transform.matrix);
          } else {
            reticle.visible = false;
            setSurfaceFound(false);
          }
        }

        renderer.render(scene, camera);
      });
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);
    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [showStartButton, selectedObjects]);

  const handleStartAR = () => {
    setShowStartButton(false);
  };

  return (
    <div className="ar-root">
      <div className="ar-container" ref={containerRef}></div>

      {!isSurfaceFound && (
        <div className="loading-message">
          Move your device around to detect a surface...
        </div>
      )}

      {showStartButton && <StartARButton onClick={handleStartAR} />}
    </div>
  );
};

export default ARView;
