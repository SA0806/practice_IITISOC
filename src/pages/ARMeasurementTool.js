import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import './ARMeasurementTool.css';

const ARMeasurementTool = () => {
  const labelRef = useRef();
  const resetBtnRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const markers = useRef([]);
  const lineRef = useRef();
  const reticleRef = useRef();
  const hitTestSourceRef = useRef(null);
  const hitTestSourceRequested = useRef(false);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // const camera = new THREE.PerspectiveCamera(); //no need to use it, since WebXR handles the camera internally. You can safely remove it.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    document.body.appendChild(
      ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] })
    );
    renderer.xr.addEventListener('sessionstart', () => {
  console.log("✅ AR session started");
});
renderer.xr.addEventListener('sessionerror', (e) => {
  console.error("❌ AR session failed:", e);
});



    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    renderer.setAnimationLoop(render);

    resetBtnRef.current.onclick = reset;

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  const onSelect = () => {
    const reticle = reticleRef.current;
    if (!reticle.visible) return;

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    marker.position.setFromMatrixPosition(reticle.matrix);
    sceneRef.current.add(marker);
    markers.current.push(marker);

    if (markers.current.length === 2) {
      const d = markers.current[0].position.distanceTo(markers.current[1].position);
      labelRef.current.textContent = `Distance: ${d.toFixed(2)} meters`;

      const points = [markers.current[0].position, markers.current[1].position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
      const line = new THREE.Line(geometry, material);
      sceneRef.current.add(line);
      lineRef.current = line;

      resetBtnRef.current.style.display = 'block';
    }
  };

  const reset = () => {
    markers.current.forEach(marker => sceneRef.current.remove(marker));
    markers.current = [];

    if (lineRef.current) {
      sceneRef.current.remove(lineRef.current);
      lineRef.current = null;
    }

    labelRef.current.textContent = 'Tap two points to measure';
    resetBtnRef.current.style.display = 'none';
  };

  const render = (timestamp, frame) => {
  const renderer = rendererRef.current;
  const reticle = reticleRef.current;
  const scene = sceneRef.current;

  if (!renderer || !scene || !renderer.xr.isPresenting) return;

  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequested.current) {
      session.requestReferenceSpace('viewer').then(space => {
        session.requestHitTestSource({ space }).then(source => {
          hitTestSourceRef.current = source;
        });
      });
      session.addEventListener('end', () => {
        hitTestSourceRequested.current = false;
        hitTestSourceRef.current = null;
      });
      hitTestSourceRequested.current = true;
    }

    if (hitTestSourceRef.current) {
      const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);

        reticle.visible = true;
        reticle.matrix.fromArray(pose.transform.matrix);
        reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale);
      } else {
        reticle.visible = false;
      }
    }
  }

  const xrCamera = renderer.xr.getCamera?.();
  if (xrCamera) {
    renderer.render(scene, xrCamera);
  }
};


  return (
    <>
      <div id="label" ref={labelRef}>Tap two points to measure</div>
      <button id="resetBtn" ref={resetBtnRef}>Reset</button>
    </>
  );
};

export default ARMeasurementTool;
