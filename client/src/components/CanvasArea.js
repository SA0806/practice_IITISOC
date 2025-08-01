import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import "./CanvasArea.css";
import { useGesture } from "@use-gesture/react";

// inserting the background function
function Background({ image, setSize }) {
  const [localSize, setLocalSize] = useState([1, 1]);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const aspect = img.width / img.height;
      const height = 10;
      const width = height * aspect;
      setLocalSize([width, height]);
      setSize([width, height]);

      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      setTexture(tex);
    };
  }, [image, setSize]);

  if (!texture) return null;

  return (
    <mesh position={[0, localSize[1] / 2 - 5.5, -5]}>
      <planeGeometry args={localSize} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}
// function Furniture({
//   url,
//   position,
//   scale,
//   rotation,
//   onUpdate,
//   selected,
//   onSelect,
//   orbitRef,
// }) {
//   const { scene } = useGLTF(url);
//   const groupRef = useRef();
//   const [isDragging, setIsDragging] = useState(false);
//   const { camera, gl } = useThree();
//   const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
//   const raycaster = useRef(new THREE.Raycaster());
//   const pointer = useRef(new THREE.Vector2());
//   const offset = useRef(new THREE.Vector3());

//   useEffect(() => {
//     if (groupRef.current) {
//       groupRef.current.position.set(...position);
//     }
//   }, [position]);

//   const handlePointerDown = (e) => {
//     e.stopPropagation();
//     onSelect();

//     pointer.current.set(
//       (e.clientX / window.innerWidth) * 2 - 1,
//       -(e.clientY / window.innerHeight) * 2 + 1
//     );

//     raycaster.current.setFromCamera(pointer.current, camera);
//     const intersect = new THREE.Vector3();
//     raycaster.current.ray.intersectPlane(planeRef.current, intersect);
//     offset.current.copy(intersect).sub(groupRef.current.position);

//     setIsDragging(true);
//   };

//   const handlePointerMove = (e) => {
//     if (!isDragging) return;

//     pointer.current.set(
//       (e.clientX / window.innerWidth) * 2 - 1,
//       -(e.clientY / window.innerHeight) * 2 + 1
//     );

//     raycaster.current.setFromCamera(pointer.current, camera);
//     const intersect = new THREE.Vector3();
//     if (raycaster.current.ray.intersectPlane(planeRef.current, intersect)) {
//       groupRef.current.position.copy(intersect.sub(offset.current));
//     }
//   };

//   const handlePointerUp = () => {
//     if (isDragging && groupRef.current) {
//       const pos = groupRef.current.position;
//       onUpdate({ position: [pos.x, pos.y, pos.z] });
//     }
//     setIsDragging(false);
//   };

//   useEffect(() => {
//     const dom = gl.domElement;
//     dom.addEventListener("pointermove", handlePointerMove);
//     dom.addEventListener("pointerup", handlePointerUp);

//     return () => {
//       dom.removeEventListener("pointermove", handlePointerMove);
//       dom.removeEventListener("pointerup", handlePointerUp);
//     };
//   }, [isDragging]);

//   return (
//     <group
//       ref={groupRef}
//       scale={[scale, scale, scale]}
//       rotation={[0, rotation, 0]}
//       onPointerDown={handlePointerDown}
//     >
//       <primitive object={scene} />
//     </group>
//   );
// }

function Furniture({
  url,
  position,
  scale,
  rotation,
  onUpdate,
  selected,
  onSelect,
  orbitRef,
}) {
  const { scene } = useGLTF(url);

//   const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
//   const raycaster = new THREE.Raycaster();
//   const offset = useRef(new THREE.Vector3());
//   const intersection = new THREE.Vector3();
//   const pointer = useRef(new THREE.Vector2());
//   const { camera, gl } = useThree();
//   const [dragging, setDragging] = useState(false);
//   const [pos, setPos] = useState(position);
  const meshRef = useRef();
  const [pos, setPos] = useState(position);

  const bind = useGesture({
    onDrag: ({ delta }) => {
      setPos((prev) => [
        prev[0] + delta[0] * 0.01,
        0,
        prev[2] + delta[1] * 0.01,
      ]);
      onUpdate &&
        onUpdate({
          position: [pos[0] + delta[0] * 0.01, 0, pos[2] + delta[1] * 0.01],
        });
    },
  });

  useEffect(() => {
    setPos(position);
  }, [position]);


//   useEffect(() => {
//     if (groupRef.current) {
//       groupRef.current.position.set(...position);
//     }
//   }, [position]);

//   const onPointerDown = (e) => {
//     e.stopPropagation();
//     onSelect();
//     pointer.current.set(
//       (e.clientX / window.innerWidth) * 2 - 1,
//       -(e.clientY / window.innerHeight) * 2 + 1
//     );

//     raycaster.setFromCamera(pointer.current, camera);
//     raycaster.ray.intersectPlane(plane, intersection);
//     offset.current.copy(intersection).sub(groupRef.current.position);

//     orbitRef.current.enabled = false;
//     setDragging(true);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging) return;

//     pointer.current.set(
//       (e.clientX / window.innerWidth) * 2 - 1,
//       -(e.clientY / window.innerHeight) * 2 + 1
//     );

//     raycaster.setFromCamera(pointer.current, camera);
//     if (raycaster.ray.intersectPlane(plane, intersection)) {
//       groupRef.current.position.copy(intersection.sub(offset.current));
//     }
//   };

//   const onPointerUp = () => {
//     if (dragging) {
//       const pos = groupRef.current.position;
//       onUpdate({ position: [pos.x, pos.y, pos.z] });
//       setDragging(false);
//       orbitRef.current.enabled = true;
//     }
//   };

//   useEffect(() => {
//     gl.domElement.addEventListener("pointermove", onPointerMove);
//     gl.domElement.addEventListener("pointerup", onPointerUp);

//     return () => {
//       gl.domElement.removeEventListener("pointermove", onPointerMove);
//       gl.domElement.removeEventListener("pointerup", onPointerUp);
//     };
//   }, [dragging]);

  return (
    <group
      {...bind()}
      ref={meshRef}
      position={pos}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    //   onPointerDown={onPointerDown}
    //   onPointerMissed={(e) => e.stopPropagation()}
    castShadow
    //   onClick={(e) => e.stopPropagation()}
    onClick={(e) => {
        e.stopPropagation();
        onSelect && onSelect();
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

const handleShare = () => {
  const canvas = document.querySelector("canvas");
  canvas.toBlob(async (blob) => {
    const file = new File([blob], "room-design.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "My Room Design",
          text: "Check out my room design!",
        });
      } catch (err) {
        alert("Sharing cancelled or failed.");
      }
    } else {
      alert("Sharing is not supported on this device/browser. Please download and share manually.");
    }
  });
};

// function RaycastPlane({ width, height, onClick }) {
//   const { camera, gl } = useThree();
//   const planeRef = useRef();

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (!planeRef.current) return;

//       const mouse = new THREE.Vector2(
//         (e.clientX / window.innerWidth) * 2 - 1,
//         -(e.clientY / window.innerHeight) * 2 + 1
//       );

//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, camera);

//       const intersects = raycaster.intersectObject(planeRef.current);
//       if (intersects.length > 0) {
//         onClick(intersects[0].point);
//       }
//     };

//     gl.domElement.addEventListener("click", handleClick);
//     return () => gl.domElement.removeEventListener("click", handleClick);
//   }, [camera, gl, onClick]);

function RaycastPlane({ width, height, onClick }) {
  const { camera, gl } = useThree();
  const planeRef = useRef();

  useFrame(() => {
    gl.domElement.onclick = (e) => {
      if (!planeRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) onClick(intersects[0].point);
    };
  });

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, -5]}
      receiveShadow
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function CanvasArea({
  bg,
  furnitureList,
  setFurnitureList,
  selectedIndex,
  setSelectedIndex,
  selectedModel
}) {
//   const [bgSize] = useState([10, 10]);
//   const orbitRef = useRef();
const [bgSize, setBgSize] = useState([10, 10]);

//   const handlePlace = (position) => {
//     if (selectedIndex !== null) return;
//     if (window.selectedModel) {
//       const newItem = {
//         url: window.selectedModel,
//         position: [position.x, 0, position.z],
//         scale: 0.5,
//         rotation: 0,
//       };
//       setFurnitureList((prev) => [...prev, newItem]);
//       setSelectedIndex(furnitureList.length);
//     }
//   };

const handlePlace = (position) => {
    if (selectedIndex !== null) return; // Don't place if something is selected
    if (window.selectedModel) {
      const newItem = {
          url: window.selectedModel,
          position: [position.x, 0, position.z],
          scale: 0.5,
          rotation: 0,
        };
      setFurnitureList((prev) => [...prev, newItem]);
      setSelectedIndex(furnitureList.length);
    }
  };

  const updateSelected = (updates) => {
    setFurnitureList((prev) =>
      prev.map((item, i) =>
        i === selectedIndex ? { ...item, ...updates } : item
      )
    );
  };

  if (!bg) return <div className="canvas-area">Upload background image</div>;

  return (
    <div
      className="canvas-wrapper"
      style={{
        // backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "68vw",
        height: "100vh",
      }}
    >
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 5, 12], fov: 45, near: 0.1, far: 1000 }}
        style={{
          width: `${bgSize[0] * 107}px`, // scale as needed for display
          height: `${bgSize[1] * 150}px`, // scale as needed for display
          background: "#fff",
        }}
        onPointerMissed={() => setSelectedIndex(null)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} castShadow />
        <Background image={bg} setSize={setBgSize} />
        {/* <OrbitControls ref={orbitRef} makeDefault /> */}

        {furnitureList
          .filter((item) => item.url)
          .map((item, i) => (
            // <Furniture
            //   key={i}
            //   {...item}
            //   selected={i === selectedIndex}
            //   onSelect={() => setSelectedIndex(i)}
            //   onUpdate={(updates) => updateSelected(updates)}
            //   orbitRef={orbitRef}
            // />
            <Furniture
              key={i}
              url={item.url}
              position={item.position}
              scale={item.scale}
              rotation={item.rotation}
              selected={i === selectedIndex}
              onSelect={() => setSelectedIndex(i)}
              onUpdate={(updates) => updateSelected(updates)}
            />
          ))}

        <RaycastPlane
          width={bgSize[0]}
          height={bgSize[1]}
          onClick={handlePlace}
        />

        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          blur={2}
          scale={10}
          far={50}
        />
      </Canvas>
    </div>
  );
}

