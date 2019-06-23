export const windowSize = 1024;
const buffer = new Float32Array(windowSize);
let noise = new Float32Array;
let sPower = 1;
let nPower = 0;
let minPhase = 0;
let maxPhase = 0;
let currentPhase = 0;
let waveLength = 0;

function generateNoise() {
	if(currentPhase < minPhase) {
		const additionalSamples = minPhase - currentPhase;
		console.log('Generating %d samples of noise to the left', additionalSamples);
		const newNoise = new Float32Array(additionalSamples + noise.length);
		for(let i = 0; i < additionalSamples; i++) {
			newNoise[i] = Math.random() * 2 - 1;
		}
		newNoise.set(noise, additionalSamples);
		noise = newNoise;
		minPhase = currentPhase;
	}

	if(currentPhase > maxPhase - windowSize) {
		const additionalSamples = currentPhase - maxPhase + windowSize;
		console.log('Generating %d samples of noise to the right', additionalSamples);
		const newNoise = new Float32Array(noise.length + additionalSamples);
		newNoise.set(noise, 0);
		for(let i = noise.length; i < newNoise.length; i++) {
			newNoise[i] = Math.random() * 2 - 1;
		}
		noise = newNoise;
		maxPhase = currentPhase + windowSize;
	}
}

function rebuildBuffer() {
	generateNoise();
	for(let i = 0; i < buffer.length; i++) {
		const sine = Math.sin(2 * Math.PI * (i + currentPhase) / waveLength);
		const sample = Math.atan(sine);
		buffer[i] = sPower * sample + nPower * noise[currentPhase - minPhase + i];
	}
}

export default function input() {
	return buffer;
}

export function setWaveLength(wl) {
	if(wl <= 0) {
		throw new Error('Bad wave length');
	}
	waveLength = wl;
	rebuildBuffer();
	return waveLength;
}

export function setPhase(phase) {
	currentPhase = phase;
	rebuildBuffer();
	return currentPhase;
}

export function setSignalPower(power) {
	if(power < 0) {
		throw new Error('Bad signal power');
	}
	sPower = power;
	rebuildBuffer();
	return sPower;
}

export function setNoisePower(power) {
	if(power < 0) {
		throw new Error('Bad noise power');
	}
	nPower = power;
	rebuildBuffer();
	return nPower;
}
