import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision';

type CultureGestureControllerProps = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onOpenPalm: () => void;
  onFist: () => void;
};

type GestureStatus =
  | 'idle'
  | 'waiting'
  | 'initializing'
  | 'running'
  | 'no-hand'
  | 'recognized'
  | 'error';

type GestureName = '左挥' | '右挥' | '张开手掌' | '握拳';
type HandPoint = {
  x: number;
  y: number;
  time: number;
};

const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const HAND_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const DETECT_INTERVAL_MS = 85;
const SWIPE_COOLDOWN_MS = 900;
const POSE_COOLDOWN_MS = 1100;
const CROSS_GESTURE_GUARD_MS = 280;
const TRAIL_WINDOW_MS = 1000;
const SWIPE_MIN_DURATION = 220;
const SWIPE_MAX_DURATION = 1000;
const SWIPE_MIN_DELTA_X = 0.13;
const SWIPE_DOMINANCE_RATIO = 1.5;
// MediaPipe 坐标基于原始视频，若预览使用镜像，需要通过 IS_VIDEO_MIRRORED 统一用户感知方向。
const IS_VIDEO_MIRRORED = false;

const STATUS_TEXT: Record<GestureStatus, string> = {
  idle: '手势识别未开启，可使用按钮与键盘浏览。',
  waiting: '请允许浏览器访问摄像头。',
  initializing: '正在初始化手势识别……',
  running: '识别中：请在摄像头前左右挥手，或张开手掌展开讲解。',
  'no-hand': '请将手掌置于摄像头前。',
  recognized: '已识别',
  error: '摄像头不可用，请使用按钮或键盘操作。',
};

const GESTURE_STATUS_TEXT: Record<GestureName, string> = {
  左挥: '已识别：左挥，切换到下一项。',
  右挥: '已识别：右挥，切换到上一项。',
  张开手掌: '已识别：张开手掌，展开 / 收起讲解。',
  握拳: '已识别：握拳，收起讲解。',
};

function distance(a: NormalizedLandmark, b: NormalizedLandmark) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
}

function getPalmCenter(landmarks: NormalizedLandmark[]) {
  const points = [landmarks[0], landmarks[5], landmarks[17]].filter(Boolean);
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function isOpenPalm(landmarks: NormalizedLandmark[]) {
  const wrist = landmarks[0];
  const fingerPairs = [
    [8, 5],
    [12, 9],
    [16, 13],
    [20, 17],
  ] as const;
  const extendedCount = fingerPairs.filter(([tip, mcp]) => distance(landmarks[tip], wrist) > distance(landmarks[mcp], wrist) * 1.32).length;
  const palmWidth = distance(landmarks[5], landmarks[17]);
  const fingerSpread = distance(landmarks[8], landmarks[20]);
  return extendedCount >= 4 && fingerSpread > palmWidth * 1.08;
}

function isFist(landmarks: NormalizedLandmark[]) {
  const center = getPalmCenter(landmarks);
  const centerPoint = { x: center.x, y: center.y, z: 0, visibility: 1 };
  const palmWidth = distance(landmarks[5], landmarks[17]);
  const tips = [8, 12, 16, 20].map((index) => landmarks[index]);
  const averageTipDistance = tips.reduce((sum, tip) => sum + distance(tip, centerPoint), 0) / tips.length;
  const foldedCount = tips.filter((tip) => distance(tip, centerPoint) < palmWidth * 0.96).length;
  return foldedCount >= 3 && averageTipDistance < palmWidth * 1.05;
}

export function CultureGestureController({
  onSwipeLeft,
  onSwipeRight,
  onOpenPalm,
  onFist,
}: CultureGestureControllerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectTimeRef = useRef(0);
  const lastSwipeTimeRef = useRef(0);
  const lastPoseTimeRef = useRef(0);
  const lastAnyGestureTimeRef = useRef(0);
  const handTrailRef = useRef<HandPoint[]>([]);
  const callbacksRef = useRef({ onSwipeLeft, onSwipeRight, onOpenPalm, onFist });
  const sessionRef = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [status, setStatus] = useState<GestureStatus>('idle');
  const [recentGesture, setRecentGesture] = useState<GestureName | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    callbacksRef.current = { onSwipeLeft, onSwipeRight, onOpenPalm, onFist };
  }, [onSwipeLeft, onSwipeRight, onOpenPalm, onFist]);

  const stopGestureRecognition = () => {
    sessionRef.current += 1;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    handTrailRef.current = [];
    lastDetectTimeRef.current = 0;
    setIsEnabled(false);
    setRecentGesture(null);
    setStatus('idle');
  };

  useEffect(() => stopGestureRecognition, []);

  const triggerGesture = (gesture: GestureName) => {
    const now = performance.now();
    const isSwipe = gesture === '左挥' || gesture === '右挥';
    const cooldown = isSwipe ? SWIPE_COOLDOWN_MS : POSE_COOLDOWN_MS;
    const lastSameGestureTime = isSwipe ? lastSwipeTimeRef.current : lastPoseTimeRef.current;
    if (now - lastSameGestureTime < cooldown) return false;
    if (now - lastAnyGestureTimeRef.current < CROSS_GESTURE_GUARD_MS) return false;

    if (isSwipe) {
      lastSwipeTimeRef.current = now;
      handTrailRef.current = [];
    } else {
      lastPoseTimeRef.current = now;
    }
    lastAnyGestureTimeRef.current = now;
    setRecentGesture(gesture);
    setStatus('recognized');

    if (gesture === '左挥') callbacksRef.current.onSwipeLeft();
    if (gesture === '右挥') callbacksRef.current.onSwipeRight();
    if (gesture === '张开手掌') callbacksRef.current.onOpenPalm();
    if (gesture === '握拳') callbacksRef.current.onFist();
    return true;
  };

  const analyzeGesture = (landmarks: NormalizedLandmark[], now: number) => {
    const center = getPalmCenter(landmarks);
    handTrailRef.current = [...handTrailRef.current, { x: center.x, y: center.y, time: now }].filter((item) => now - item.time <= TRAIL_WINDOW_MS);
    const trail = handTrailRef.current;
    const earliest = trail[0];
    const latest = trail[trail.length - 1];

    if (trail.length >= 4 && earliest && latest) {
      const duration = latest.time - earliest.time;
      const rawDeltaX = latest.x - earliest.x;
      const deltaX = IS_VIDEO_MIRRORED ? -rawDeltaX : rawDeltaX;
      const deltaY = latest.y - earliest.y;
      const isHorizontalSwipe =
        duration >= SWIPE_MIN_DURATION &&
        duration <= SWIPE_MAX_DURATION &&
        Math.abs(deltaX) >= SWIPE_MIN_DELTA_X &&
        Math.abs(deltaX) >= Math.abs(deltaY) * SWIPE_DOMINANCE_RATIO;

      if (isHorizontalSwipe) {
        handTrailRef.current = [];
        triggerGesture(deltaX < 0 ? '左挥' : '右挥');
        return;
      }
    }

    if (isOpenPalm(landmarks)) {
      triggerGesture('张开手掌');
      return;
    }

    if (isFist(landmarks)) {
      triggerGesture('握拳');
    }
  };

  const runDetectionLoop = () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const now = performance.now();

    if (video && landmarker && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && now - lastDetectTimeRef.current >= DETECT_INTERVAL_MS) {
      lastDetectTimeRef.current = now;
      const result = landmarker.detectForVideo(video, now);
      const landmarks = result.landmarks[0];

      if (!landmarks) {
        handTrailRef.current = [];
        setStatus((current) => (current === 'recognized' ? current : 'no-hand'));
      } else {
        setStatus((current) => (current === 'recognized' ? current : 'running'));
        analyzeGesture(landmarks, now);
      }
    }

    rafRef.current = requestAnimationFrame(runDetectionLoop);
  };

  const startGestureRecognition = async () => {
    if (isEnabled) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setErrorMessage('当前浏览器不支持摄像头访问，请使用按钮或键盘操作。');
      return;
    }

    setErrorMessage('');
    setRecentGesture(null);
    setStatus('waiting');
    const session = sessionRef.current + 1;
    sessionRef.current = session;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (sessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (sessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      setStatus('initializing');
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      if (sessionRef.current !== session) return;

      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_MODEL_URL,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55,
      });

      if (sessionRef.current !== session) {
        landmarkerRef.current?.close();
        landmarkerRef.current = null;
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      setIsEnabled(true);
      setStatus('running');
      rafRef.current = requestAnimationFrame(runDetectionLoop);
    } catch (error) {
      stopGestureRecognition();
      setStatus('error');
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMessage('摄像头权限未开启，可继续使用按钮或键盘操作。');
      } else if (name === 'NotFoundError') {
        setErrorMessage('未检测到可用摄像头，请使用按钮或键盘操作。');
      } else if (name === 'NotReadableError') {
        setErrorMessage('摄像头暂不可用，可能已被占用，可继续使用按钮或键盘操作。');
      } else {
        setErrorMessage('手势识别初始化失败，可继续使用按钮或键盘操作。');
      }
    }
  };

  const handleToggle = () => {
    if (isEnabled || status === 'waiting' || status === 'initializing' || status === 'running' || status === 'no-hand' || status === 'recognized') {
      stopGestureRecognition();
      return;
    }
    void startGestureRecognition();
  };

  const statusLabel = status === 'recognized' && recentGesture ? GESTURE_STATUS_TEXT[recentGesture] : STATUS_TEXT[status];

  return (
    <div className={`culture-gesture-controller ${isEnabled ? 'is-active' : ''}`}>
      <div className="culture-gesture-copy">
        <span className="culture-gesture-label">GESTURE CONTROL</span>
        <strong>{statusLabel}</strong>
        <p>{errorMessage || '摄像头画面仅用于本地手势识别，不上传视频流。按钮与键盘操作始终可用。'}</p>
      </div>
      <div className="culture-gesture-controls">
        <button type="button" onClick={handleToggle}>
          {isEnabled || status === 'waiting' || status === 'initializing' || status === 'running' || status === 'no-hand' || status === 'recognized'
            ? '关闭手势识别'
            : '开启手势识别'}
        </button>
        <div className="culture-gesture-preview" aria-label="本地摄像头预览">
          <video ref={videoRef} playsInline muted />
          {!isEnabled && <span>未开启</span>}
        </div>
      </div>
    </div>
  );
}
