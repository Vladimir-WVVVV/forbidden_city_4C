import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/** 与 App 中 HotspotData 兼容的最小字段 */
export type Building3DHotspot = {
  id: string;
  label: string;
  position: [number, number, number];
  positionLabel?: string;
  functionSummary?: string;
  observeTip?: string;
  description?: string;
  calibrated?: boolean;
};

type Building3DCanvasProps = {
  modelPath: string;
  buildingName: string;
  hotspots: Building3DHotspot[];
  onHotspotClick: (hotspot: Building3DHotspot) => void;
  selectedHotspotId: string | null;
};

/** 监听 R3F size，修正透视相机 aspect，避免父级宽度动画时画面拉伸变形 */
function CameraAspectSync() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  useLayoutEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const h = Math.max(size.height, 1);
      // R3F exposes a mutable Three.js camera; aspect must be kept in sync during panel resizing.
      // eslint-disable-next-line react-hooks/immutability
      camera.aspect = size.width / h;
      camera.updateProjectionMatrix();
    }
    gl.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5));
  }, [camera, size.width, size.height, gl]);

  return null;
}

function HotspotMarker({
  hotspot,
  selected,
  onPick,
}: {
  hotspot: Building3DHotspot;
  selected: boolean;
  onPick: (h: Building3DHotspot) => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useLayoutEffect(() => {
    ringRef.current?.lookAt(camera.position);
  }, [camera]);

  return (
    <group
      position={hotspot.position}
      userData={{ hotspotId: hotspot.id }}
    >
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onPick(hotspot);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.6}
          roughness={0.3}
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Html center distanceFactor={8} style={{ pointerEvents: 'none' }} zIndexRange={[50, 0]}>
        <button
          type="button"
          className={`model-hotspot-button ${selected ? 'is-active' : ''} ${hotspot.calibrated === false ? 'is-uncalibrated' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onPick(hotspot);
          }}
        >
          <span className="model-hotspot-dot" />
          <span>{hotspot.label}</span>
          {hotspot.calibrated === false && <span className="model-hotspot-calibration">待校准</span>}
        </button>
      </Html>
    </group>
  );
}

function PalaceBuilding({
  modelPath,
  hotspots,
  onHotspotClick,
  selectedHotspotId,
}: Building3DCanvasProps) {
  const buildingRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelPath);

  const { scene, scale, position } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = 4.6 / maxAxis;

    return {
      scene: clonedScene,
      scale: normalizedScale,
      position: new THREE.Vector3(
        -center.x * normalizedScale,
        -box.min.y * normalizedScale - 0.8,
        -center.z * normalizedScale
      ),
    };
  }, [gltf.scene]);

  return (
    <group ref={buildingRef}>
      <primitive object={scene} scale={scale} position={position} />

      {hotspots.map((h) => (
        <HotspotMarker
          key={h.id}
          hotspot={h}
          selected={selectedHotspotId === h.id}
          onPick={onHotspotClick}
        />
      ))}
    </group>
  );
}

function SceneContent(props: Building3DCanvasProps) {
  return (
    <>
      <CameraAspectSync />
      <color attach="background" args={['#f5f0e8']} />
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#fff7df', '#8b6f55', 1.4]} />
      <directionalLight position={[4, 5, 6]} intensity={1.65} />
      <directionalLight position={[-3, 3, -2]} intensity={0.55} color="#fff1c6" />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#ffd47a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <PalaceBuilding {...props} />
      <OrbitControls
        makeDefault
        target={[0, 1.1, 0]}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={12}
        enablePan
      />
    </>
  );
}

function ModelLoading({ buildingName }: { buildingName: string }) {
  return (
    <Html center>
      <div className="model-loading-state">{buildingName}三维模型加载中……</div>
    </Html>
  );
}

export function Building3DCanvas({ modelPath, buildingName, hotspots, onHotspotClick, selectedHotspotId }: Building3DCanvasProps) {
  const displayHotspots = hotspots;
  const hasCalibratedHotspots = displayHotspots.some((hotspot) => hotspot.calibrated !== false);

  return (
    <div className="building-3d-view relative h-full w-full min-h-0">
      <div className="absolute inset-0 h-full w-full min-h-[200px]">
        <ErrorBoundary
          resetKey={modelPath}
          fallback={
            <div className="model-error-state" role="alert">
              {buildingName}三维模型暂时加载失败，请刷新页面或稍后重试。
            </div>
          }
        >
          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            className="block h-full w-full"
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [4, 2.8, 5.4], fov: 55, near: 0.1, far: 1000 }}
            gl={{ antialias: true, alpha: false }}
            resize={{ debounce: 0, scroll: false, offsetSize: true }}
          >
            <Suspense fallback={<ModelLoading buildingName={buildingName} />}>
              <SceneContent
                modelPath={modelPath}
                buildingName={buildingName}
                hotspots={displayHotspots}
                onHotspotClick={onHotspotClick}
                selectedHotspotId={selectedHotspotId}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>
      <div className="view-controls pointer-events-none">
        <span className="control-hint">
          {displayHotspots.length > 0
            ? hasCalibratedHotspots
              ? '点击金色光点查看详情 | 拖拽旋转 | 滚轮缩放'
              : '模型热点为初始校准点，可点击查看说明并继续旋转观察。'
            : '该建筑模型热点正在校准中，可先旋转模型进行整体观察。'}
        </span>
      </div>
    </div>
  );
}

