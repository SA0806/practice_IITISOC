import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useGesture } from "@use-gesture/react";
// import "./App.css";

// Background Image Plane
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
    <mesh position={[0, localSize[1] / 2 - 1.5,-10]}>
      <planeGeometry args={localSize} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}

// Interactive 3D Furniture
function Furniture({
  url,
  position,
  scale,
  rotation,
  onUpdate,
  selected,
  onSelect,
}) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  const [pos, setPos] = useState(position);

  // Drag logic
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

  return (
    <group
      {...bind()}
      ref={meshRef}
      position={pos}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
      castShadow
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

// Raycasting Plane to detect floor clicks
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
      position={[0, 0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[width + 1, height + 1]} />
      <meshStandardMaterial transparent opacity={0.0} />
    </mesh>
  );
}

// Main 3D Scene
function Scene({
  bg,
  furnitureList,
  setFurnitureList,
  selectedModel,
  selectedIndex,
  setSelectedIndex,
}) {
  const [bgSize, setBgSize] = useState([10, 10]);

  const handlePlace = (position) => {
    if (selectedIndex !== null) return; // Don't place if something is selected
    if (window.selectedModel) {
      setFurnitureList((prev) => [
        ...prev,
        {
          url: window.selectedModel,
          position: [position.x, 0, position.z],
          scale: 0.5,
          rotation: 0,
        },
      ]);
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

  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
      camera={{ position: [0, 5, 12], fov: 45, near: 0.1, far: 1000, }}
      style={{
    width: `${bgSize[0] * 107}px`,   // scale as needed for display
    height: `${bgSize[1] * 150}px`,  // scale as needed for display
    background: "#fff",
    className:"Two-Dimensional-View-Page-canvas"
  }}
      onPointerMissed={() => setSelectedIndex(null)}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} castShadow />
      <Background image={bg} setSize={setBgSize} />

      {furnitureList.map((item, i) => (
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
  );
}

// App Entry
export default function TwoDimensionalViewPage() {
  const [bg, setBg] = useState(null);
  const [furnitureList, setFurnitureList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Store selected model globally for simplicity
  useEffect(() => {
    window.selectedModel = process.env.PUBLIC_URL + "/models/chair.glb";
  }, []);

  const handleCapture = () => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
     setTimeout(() => {
    canvas.toBlob((blob) => {
      link.href = URL.createObjectURL(blob);
      link.download = "room-design.png";
      link.click();
    });
  }, 100); // Wait 100ms for rendering
};

  const updateSelected = (updates) => {
    setFurnitureList((prev) =>
      prev.map((item, i) =>
        i === selectedIndex ? { ...item, ...updates } : item
      )
    );
  };

  return (
    <div className="Two-Dimensional-View-Page-container">
      {!bg ? (
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setBg(URL.createObjectURL(file));
          }}
        />
      ) : (
        <Scene
          bg={bg}
          furnitureList={furnitureList}
          setFurnitureList={setFurnitureList}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}

      <div className="Two-Dimensional-View-Page-toolbar" style={{ marginTop: 500 }}>
        <button
          onClick={() =>
            (window.selectedModel =
              process.env.PUBLIC_URL + "/models/chair.glb")
          }
        >
          Chair
        </button>
        <button
          onClick={() =>
            (window.selectedModel =
              process.env.PUBLIC_URL + "/models/table.glb")
          }
        >
          Table
        </button>
        <button
          onClick={() =>
            (window.selectedModel = process.env.PUBLIC_URL + "/models/sofa.glb")
          }
        >
          Sofa
        </button>
        <button onClick={handleCapture}>Save as PNG</button>

        <button
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              scale: Math.min(
                (furnitureList[selectedIndex]?.scale || 0.5) + 0.1,
                2
              ),
            })
          }
        >
          +
        </button>
        <button
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              scale: Math.max(
                (furnitureList[selectedIndex]?.scale || 0.5) - 0.1,
                0.1
              ),
            })
          }
        >
          -
        </button>

        <span style={{ marginLeft: "10px" }}>Rotate:</span>
        <button
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              rotation:
                (furnitureList[selectedIndex]?.rotation || 0) + Math.PI / 12,
            })
          }
        >
          ⟲
        </button>
        <button
          onClick={() =>
            selectedIndex !== null &&
            updateSelected({
              rotation:
                (furnitureList[selectedIndex]?.rotation || 0) - Math.PI / 12,
            })
          }
        >
          ⟳
        </button>
        <button onClick={handleShare}>Share</button>
        {selectedIndex !== null && (
          <button
            style={{ marginLeft: "10px", color: "red" }}
            onClick={() => {
              if (
                window.confirm(
                  "Do you really want to delete this model from the scene?"
                )
              ) {
                setFurnitureList((prev) =>
                  prev.filter((_, i) => i !== selectedIndex)
                );
                setSelectedIndex(null);
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
