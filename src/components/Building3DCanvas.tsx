import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/** 与 App 中 HotspotData 兼容的最小字段 */
export type BuildingHotspotPick = {
  id: string;
  name: string;
  shortDesc: string;
  position: { x: number; y: number; z?: number };
};

type Building3DCanvasProps = {
  hotspots: BuildingHotspotPick[];
  onHotspotClick: (hotspot: BuildingHotspotPick) => void;
  selectedHotspotId: string | null;
};

const CORNER_TOWER_MODEL_URL = '/models/corner-tower.glb';

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
    gl.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
  }, [camera, size.width, size.height, gl]);

  return null;
}

function HotspotMarker({
  hotspot,
  selected,
  onPick,
}: {
  hotspot: BuildingHotspotPick;
  selected: boolean;
  onPick: (h: BuildingHotspotPick) => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const ring = ringRef.current;
    if (!ring) return;
    const t = state.clock.elapsedTime;
    ring.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    ring.lookAt(camera.position);
  });

  return (
    <group
      position={[hotspot.position.x, hotspot.position.y, hotspot.position.z ?? 0]}
      userData={{ hotspotId: hotspot.id }}
    >
      <mesh
        castShadow
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
      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }} zIndexRange={[50, 0]}>
        <div
          className={`hotspot-label hotspot-label--r3f ${selected ? 'active' : ''}`}
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            onPick(hotspot);
          }}
        >
          <span className="hotspot-dot" />
          <span className="hotspot-name">{hotspot.name}</span>
        </div>
      </Html>
    </group>
  );
}

function PalaceBuilding({
  hotspots,
  onHotspotClick,
  selectedHotspotId,
}: Building3DCanvasProps) {
  const buildingRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(CORNER_TOWER_MODEL_URL);

  const { scene, scale, position } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = 4.6 / maxAxis;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

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

  useFrame((_, delta) => {
    const g = buildingRef.current;
    if (!g || selectedHotspotId) return;
    g.rotation.y += delta * 0.35;
  });

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
      <directionalLight position={[4, 5, 6]} intensity={2.3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-3, 3, -2]} intensity={0.55} color="#fff1c6" />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#ffd47a" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
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

function ModelLoading() {
  return (
    <Html center>
      <div className="model-loading-state">角楼三维模型加载中……</div>
    </Html>
  );
}

export function Building3DCanvas({ hotspots, onHotspotClick, selectedHotspotId }: Building3DCanvasProps) {
  return (
    <div className="building-3d-view relative h-full w-full min-h-0">
      <div className="absolute inset-0 h-full w-full min-h-[200px]">
        <ErrorBoundary
          resetKey={selectedHotspotId ?? 'model'}
          fallback={
            <div className="model-error-state" role="alert">
              三维模型暂时加载失败，请刷新页面或稍后重试。
            </div>
          }
        >
          <Canvas
            shadows
            className="block h-full w-full"
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [4, 2.8, 5.4], fov: 55, near: 0.1, far: 1000 }}
            gl={{ antialias: true, alpha: false }}
            resize={{ debounce: 0, scroll: false, offsetSize: true }}
          >
            <Suspense fallback={<ModelLoading />}>
              <SceneContent
                hotspots={hotspots}
                onHotspotClick={onHotspotClick}
                selectedHotspotId={selectedHotspotId}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>
      <div className="view-controls pointer-events-none">
        <span className="control-hint">点击金色光点查看详情 | 拖拽旋转 | 滚轮缩放</span>
      </div>
    </div>
  );
}

