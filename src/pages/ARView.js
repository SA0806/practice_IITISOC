import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { useLocation } from 'react-router-dom';
import './ARView.css';

import SelectedItemsBar from '../components/SelectedItemsBar';
import { useSelectedObjects } from '../Context/SelectedObjectsContext';

const ARView = () => {
  const { selectedObjects, toggleObjectSelection } = useSelectedObjects();
  const [isSurfaceFound, setSurfaceFound] = useState(false);
  const [placedModels, setPlacedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

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

      arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
      arButton.classList.add('custom-ar-button');
      document.body.appendChild(arButton);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const models = await Promise.all(
        selectedObjects.map(object =>
          new Promise((resolve, reject) => {
            loader.load(
              object.model,
              gltf => {
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
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.7, transparent: true });
      reticle = new THREE.Mesh(geometry, material);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      controller = renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        if (reticle.visible && models.length > 0) {
          const newPlaced = [];

          models.forEach(model => {
            const clone = model.clone();
            clone.position.setFromMatrixPosition(reticle.matrix);
            clone.quaternion.setFromRotationMatrix(reticle.matrix);
            scene.add(clone);
            newPlaced.push(clone);
          });

          setPlacedModels(prev => [...prev, ...newPlaced]);
          setSelectedModel(newPlaced[newPlaced.length - 1]); // Set last placed as selected
        }
      });
      scene.add(controller);

      renderer.xr.addEventListener('sessionstart', async () => {
        const session = renderer.xr.getSession();
        try {
          const viewerSpace = await session.requestReferenceSpace('viewer');
          const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

          renderer.setAnimationLoop((timestamp, frame) => {
            if (frame) {
              const referenceSpace = renderer.xr.getReferenceSpace();
              const hits = frame.getHitTestResults(hitTestSource);

              if (hits.length > 0) {
                const hit = hits[0];
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
        } catch (err) {
          console.error('Hit test setup failed:', err);
        }
      });

      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
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

  // UI Handlers
  const handleScaleChange = (e) => {
    const value = parseFloat(e.target.value);
    if (selectedModel) {
      selectedModel.scale.set(value, value, value);
    }
  };

  const handleRotateYChange = (e) => {
    const value = parseFloat(e.target.value);
    if (selectedModel) {
      selectedModel.rotation.y = value;
    }
  };

  return (
    <div className="ar-container">
      <div className='top-bar'>
        <SelectedItemsBar
          selectedObjects={selectedObjects}
          toggleObjectSelection={toggleObjectSelection}
        />
      </div>

      {!isSurfaceFound && (
        <div className="loading-message">Move your device around to detect a surface...</div>
      )}

      {selectedModel && (
        <div className="model-controls">
          <label>
            Scale:
            <input type="range" min="0.1" max="2" step="0.1" onChange={handleScaleChange} />
          </label>
          <label>
            Rotate Y:
            <input type="range" min="0" max={Math.PI * 2} step="0.1" onChange={handleRotateYChange} />
          </label>
        </div>
      )}
    </div>
  );
};

export default ARView;
