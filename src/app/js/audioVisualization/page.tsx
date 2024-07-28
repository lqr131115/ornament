// You're importing a component that needs useRef. It only works in a Client Component but none of its parents are marked with "use client"
"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.scss";

const CVS_SIZE = 500;
function initCanvas(cvs: HTMLCanvasElement) {
  cvs.width = CVS_SIZE * devicePixelRatio;
  cvs.height = CVS_SIZE * devicePixelRatio;
  cvs.style.width = CVS_SIZE + "px";
  cvs.style.height = CVS_SIZE + "px";
}

function draw(data: any[] = [], maxValue = 255, cvs: HTMLCanvasElement) {
  const ctx = cvs.getContext("2d")!;
  const r = cvs.width / 4 + 20 * devicePixelRatio;
  const center = cvs.width / 2;
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // 每条能量柱的间隔
  const hslStep = 360 / (data.length - 1);
  const maxLength = cvs.width / 2 - r;
  const minLength = 2 * devicePixelRatio;
  for (let i = 0; i < data.length; i++) {
    ctx.beginPath();
    const len = Math.max(minLength, maxLength * (data[i] / maxValue));
    const rotate = i * hslStep;
    ctx.strokeStyle = `hsl(${rotate}deg, 65%, 65%)`;
    ctx.lineWidth = minLength;
    const rad = (rotate / 180) * Math.PI;
    const beginX = center + r * Math.cos(rad);
    const beginY = center + r * Math.sin(rad);

    const endX = center + (r + len) * Math.cos(rad);
    const endY = center + (r + len) * Math.sin(rad);
    ctx.moveTo(beginX, beginY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

export default function AudioVisualization() {
  const analyserRef = useRef<AnalyserNode>(),
    bufferRef = useRef<Uint8Array>(),
    isInitRef = useRef<boolean>(false),
    cvsRef = useRef<HTMLCanvasElement>(null),
    videoRef = useRef<HTMLVideoElement>(null);

  // init canvas
  useEffect(() => {
    const cvs = cvsRef.current;
    if (cvs) {
      initCanvas(cvs);
      draw(new Array(256).fill(0), 255, cvs!);
    }
  }, []);

  //  listen video onplay
  const onVideoPlay = () => {
    if (isInitRef.current) {
      return;
    }
    const videoCtx = new AudioContext();
    // 音频源:videoRef.current
    const source = videoCtx.createMediaElementSource(videoRef.current!);
    // 其他源: 如麦克风源
    // navigator.mediaDevices.getUserMedia({audio:true}).then((stream) => {
    //     console.log(stream);
    // })

    // 创建音频分析器节点
    const analyser = (analyserRef.current = videoCtx.createAnalyser());
    analyser.fftSize = 512;
    bufferRef.current = new Uint8Array(analyser.frequencyBinCount);
    // 生源与分析器
    source.connect(analyser);
    // 分析器与输出设备
    analyser.connect(videoCtx.destination);

    isInitRef.current = true;
  };
  const update = () => {
    requestAnimationFrame(update);
    if (!isInitRef.current) {
      return;
    }
    const analyser = analyserRef.current!,
      buffer = bufferRef.current!;
    analyser.getByteFrequencyData(buffer);
    const offset = Math.floor((buffer.length * 2) / 3);
    const data = new Array(offset * 2);
    for (let i = 0; i < offset; i++) {
      data[i] = data[data.length - i - 1] = buffer[i];
    }
    draw(data, 255, cvsRef.current!);
  };
  const handleOnVideoPlay = () => {
    if (!videoRef.current) {
      return;
    }
    onVideoPlay();
    update();
  };
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            onPlay={() => handleOnVideoPlay()}
            className={styles.testVideo}
            controls
          >
            <source src="/videos/audioVisualizationTest.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.canvasWrapper}>
          <canvas ref={cvsRef}></canvas>
        </div>
      </div>
    </main>
  );
}
