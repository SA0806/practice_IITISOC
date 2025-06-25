import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation } from 'react-router-dom';
import './ARView.css';

const ARView = () => {
  const { state } = useLocation();
  const selectedObjects = state?.selectedObjects || [];
  const mountRef = useRef(null);
  const [isSurfaceFound, setSurfaceFound] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const setupAR = async (session) => {
    let camera, scene, renderer, controller, reticle;
    const container = mountRef.current;
    if (!container) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.01,
      20
    );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    const models = await Promise.all(
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
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.7, transparent: true });
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

    renderer.xr.setSession(session);
    setSessionStarted(true);

    let viewerSpace;
    try {
      viewerSpace = await session.requestReferenceSpace('viewer');
    } catch (e) {
      console.warn('viewer reference space not supported, using local');
      viewerSpace = await session.requestReferenceSpace('local');
    }

    const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

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

    window.addEventListener('resize', () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  };

  useEffect(() => {
    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = ''; // Remove canvas
      }
    };
  }, []);

  return (
    <div className="ar-container">
      {/* Top Bar */}
      <div className="top-bar">
        <p>Selected Objects</p>
        <div className="selected-items">
          {selectedObjects.map((obj, i) => (
            <div className="thumbnail" key={i}>
              <img src={obj.thumbnail || '/placeholder.png'} alt={`Object ${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Camera Screen */}
      <div className="camera-screen" ref={mountRef}></div>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <button>Rotate</button>
        <button>Capture</button>
        <button>Drag</button>
      </div>

      {/* Start AR */}
      {!sessionStarted && (
        <div className="start-ar-overlay">
          <button
            onClick={async () => {
              if (!navigator.xr) {
                alert('WebXR not supported');
                return;
              }

              const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
              if (!isSupported) {
                alert('AR not supported on this device');
                return;
              }

              try {
                const session = await navigator.xr.requestSession('immersive-ar', {
                  requiredFeatures: ['hit-test'],
                });
                setupAR(session); // ✅ Call your proper setup function
              } catch (err) {
                console.error('❌ Failed to start AR session', err);
                alert('Failed to start AR session. Please try again.');
              }
            }}
          >
            Start AR
          </button>
        </div>
      )}

      {/* Surface Detection Message */}
      {!isSurfaceFound && sessionStarted && (
        <div className="loading-message">
          Move your device around to detect a surface...
        </div>
      )}
    </div>
  );
};

export default ARView;
