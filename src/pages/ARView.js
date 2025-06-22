import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ARView.css';
import StartARButton from '../components/StartARButton';


const ARView =() => {

  const { state } = useLocation();
  const selectedObjects = state?.selectedObjects || [];

  const [isSurfaceFound, setSurfaceFound] = useState(false); 

  console.log("🔍 Models passed to ARView:", selectedObjects);


  useEffect(() => {
    let camera, scene, renderer, controller;
    let reticle;
   
    const loader = new GLTFLoader(); 

    init();
    animate();

    async function init() {
      const container = document.createElement('div');
      document.body.appendChild(container);

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

      // document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

      const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
arButton.classList.add('custom-ar-button'); // Add your own CSS class
document.body.appendChild(arButton);


      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      let models = [];

Promise.all(
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
).then((loadedModels) => {
  models = loadedModels;
});

      const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, opacity: 0.7, transparent: true,});
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

      renderer.xr.addEventListener('sessionstart', async () => {
        const session = renderer.xr.getSession();

        const viewerReferenceSpace = await session.requestReferenceSpace('viewer');
        const hitTestSource = await session.requestHitTestSource({ space: viewerReferenceSpace });

        renderer.setAnimationLoop((timestamp, frame) => {
          if (frame) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
              const hit = hitTestResults[0];
              const pose = hit.getPose(referenceSpace);
              reticle.visible = true;
              setSurfaceFound(true); // ✅ Update loading state
              reticle.matrix.fromArray(pose.transform.matrix);
            } else {
              reticle.visible = false;
              setSurfaceFound(false); // Hide again if lost
            }
          }

          renderer.render(scene, camera);
        });
      });

      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    }
  }, []);

  // ✅ Loading message shown until reticle appears
    return (
  <div className="ar-container">
    {!isSurfaceFound && (
      <div className="loading-message">
        Move your device around to detect a surface...
      </div>
    )}
  </div>
);


}

export default ARView;



