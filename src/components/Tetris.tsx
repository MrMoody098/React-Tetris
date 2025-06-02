import React, { useEffect } from 'react';

const animate = () => {
  if (!analyserRef.current) return;
  
  const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
  analyserRef.current.getByteFrequencyData(dataArray);
  // Use the average volume
  const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  setMusicVolume(avg);
  animationFrameRef.current = requestAnimationFrame(animate);
}; 

// Music control effect + analyser
useEffect(() => {
  if (!musicRef.current) return;

  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (!sourceRef.current) {
    sourceRef.current = audioCtxRef.current.createMediaElementSource(musicRef.current);
  }

  if (gameStarted && !gameState.gameOver && !gameState.isPaused) {
    musicRef.current.loop = true;
    musicRef.current.volume = 0.25;
    musicRef.current.muted = musicMuted;
    musicRef.current.play().catch(() => {});

    const analyser = audioCtxRef.current.createAnalyser();
    analyser.fftSize = 256;
    sourceRef.current.connect(analyser);
    analyser.connect(audioCtxRef.current.destination);
    analyserRef.current = analyser;

    // Animation loop to update volume
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const animate = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      // Use the average volume
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setMusicVolume(avg);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  } else {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setMusicVolume(0);
  }

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
  };
}, [gameStarted, gameState.gameOver, gameState.isPaused, musicMuted]);

return () => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
  if (analyserRef.current) {
    analyserRef.current.disconnect();
  }
}; 