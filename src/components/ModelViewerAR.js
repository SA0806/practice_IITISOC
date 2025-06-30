import React, { useEffect } from 'react';

// Load model-viewer from CDN once (no dev-mode warning)
export default function ModelViewerAR({
  src,
  alt = "3D model",
  title = "View in your space",
  scale = "1 1 1",
  autoRotate = true,
  cameraControls = true
}) {
  useEffect(() => {
    const scriptId = 'model-viewer-cdn';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.id = scriptId;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <model-viewer
        src={src}
        alt={alt}
        ar
        ar-modes="scene-viewer webxr quick-look"
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        scale={scale}
        shadow-intensity="1"
        exposure="1"
        style={{ width: '100%', height: '100%' }}
      >
        <button slot="ar-button" style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '40px',
          cursor: 'pointer',
          zIndex: 10
        }}>
          {title}
        </button>
      </model-viewer>
    </div>
  );
}