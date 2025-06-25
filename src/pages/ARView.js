import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { useLocation } from 'react-router-dom';
import './ARView.css';

const ARView = () => {
  const { state } = useLocation();
  const selectedObjects = state?.selectedObjects || [];
  const [isSurfaceFound, setSurfaceFound] = useState(false);
  const [arButtonRef, setArButtonRef] = useState(null);

  useEffect(() => {
    let camera, scene, renderer, controller, container, reticle;
    const loader = new GLTFLoader();
    let arButton;

    init();

    async function init() {
      container = document.createElement('div');
      container.className = 'three-container';
      document.body.appendChild(container);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      // AR Button (hidden)
      arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
      arButton.style.display = 'none';
      document.body.appendChild(arButton);
      setArButtonRef(arButton);

      // Lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load 3D Models
      const models = await Promise.all(
        selectedObjects.map((object) =>
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

      // Reticle setup
      const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.7, transparent: true });
      reticle = new THREE.Mesh(geometry, material);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // Controller tap-to-place
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

      // XR Session logic
      renderer.xr.addEventListener('sessionstart', async () => {
        const session = renderer.xr.getSession();

        try {
          const viewerSpace = await session.requestReferenceSpace('viewer');
          const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

          // XR-safe render loop
          renderer.setAnimationLoop((timestamp, frame) => {
            if (frame) {
              const referenceSpace = renderer.xr.getReferenceSpace();
              const hitTestResults = frame.getHitTestResults(hitTestSource);

              if (hitTestResults.length > 0) {
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
        } catch (error) {
          console.error('Hit-test failed:', error);
        }
      });

      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      if (renderer?.xr?.isPresenting) return; // Avoid resizing during AR
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
      if (container) document.body.removeChild(container);
      if (arButton) document.body.removeChild(arButton);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [selectedObjects]);

  return (
    <div className="ar-container">
      {/* Top Bar */}
      <div className="top-bar">
        <p>Selected Objects</p>
        <div className="selected-items">
          {selectedObjects.map((obj, i) => (
            <div className="thumbnail" key={i}>
              <img src={obj.thumbnail || 'https://via.placeholder.com/40'} alt={`Object ${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Instruction + Custom AR Start Button */}
      {!isSurfaceFound && (
        <>
          <div className="loading-message">Move your device around to detect a surface...</div>
          {arButtonRef && (
            <button className="custom-start-ar" onClick={() => arButtonRef.click()}>
              Start AR
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ARView;
