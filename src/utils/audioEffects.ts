// Audio effects using Web Audio API

export async function applyEcho(audioBuffer: AudioBuffer, delay: number = 0.3, feedback: number = 0.3): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length + (delay * audioBuffer.sampleRate),
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  const delayNode = offlineContext.createDelay();
  delayNode.delayTime.value = delay;

  const gainNode = offlineContext.createGain();
  gainNode.gain.value = feedback;

  const merger = offlineContext.createChannelMerger(2);

  source.connect(offlineContext.destination);
  source.connect(delayNode);
  delayNode.connect(gainNode);
  gainNode.connect(delayNode);
  delayNode.connect(merger, 0, 0);
  source.connect(merger, 0, 1);

  source.start(0);
  return await offlineContext.startRendering();
}

export async function applyReverb(audioBuffer: AudioBuffer, roomSize: number = 0.5): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length + (roomSize * 2 * audioBuffer.sampleRate),
    audioBuffer.sampleRate
  );

  const convolver = offlineContext.createConvolver();
  const impulse = audioContext.createBuffer(2, audioContext.sampleRate * roomSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 1);
    }
  }

  convolver.buffer = impulse;
  
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(convolver);
  convolver.connect(offlineContext.destination);

  source.start(0);
  return await offlineContext.startRendering();
}

export async function applyFadeIn(audioBuffer: AudioBuffer, duration: number = 0.5): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = offlineContext.createGain();
  const fadeSamples = duration * audioBuffer.sampleRate;

  gainNode.gain.setValueAtTime(0, 0);
  gainNode.gain.linearRampToValueAtTime(1, duration);

  source.connect(gainNode);
  gainNode.connect(offlineContext.destination);

  source.start(0);
  return await offlineContext.startRendering();
}

export async function applyFadeOut(audioBuffer: AudioBuffer, duration: number = 0.5): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = offlineContext.createGain();
  const endTime = audioBuffer.duration - duration;

  gainNode.gain.setValueAtTime(1, 0);
  gainNode.gain.linearRampToValueAtTime(0, endTime);

  source.connect(gainNode);
  gainNode.connect(offlineContext.destination);

  source.start(0);
  return await offlineContext.startRendering();
}

export async function normalizeAudio(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  // Find peak
  let max = 0;
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      max = Math.max(max, Math.abs(channelData[i]));
    }
  }

  const gainNode = offlineContext.createGain();
  if (max > 0) {
    gainNode.gain.value = 1 / max;
  }

  source.connect(gainNode);
  gainNode.connect(offlineContext.destination);

  source.start(0);
  return await offlineContext.startRendering();
}

