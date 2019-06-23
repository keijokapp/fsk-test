import './visualisation';
import './afsk';
import { setNoisePower, setPhase, setSignalPower, setWaveLength } from './input';

function resize() {
	const width = document.body.clientWidth;
	for(const canvas of document.querySelectorAll('.canvasContainer > canvas.full-width')) {
		canvas.width = width;
		canvas.height = 128;
	}
}

window.addEventListener('resize', resize);
resize();

let waveLength = 100, phase = 0, sPower = 10, nPower = 0;

window.onkeydown = e => {
	if(e.key === 'ArrowLeft') {
		e.preventDefault();
		phase = setPhase(phase + (e.ctrlKey ? 50 : 1));
	}

	if(e.key === 'ArrowRight') {
		e.preventDefault();
		phase = setPhase(phase - (e.ctrlKey ? 50 : 1));
	}

	if(e.key === 'ArrowUp') {
		e.preventDefault();
		waveLength = setWaveLength(waveLength + (e.ctrlKey ? 50 : 1));
	}

	if(e.key === 'ArrowDown') {
		e.preventDefault();
		waveLength = setWaveLength(waveLength - (e.ctrlKey ? 50 : 1));
	}

	if(e.key === 'p') {
		e.preventDefault();
		sPower = setSignalPower((sPower + 1) / 10) * 10;
	}

	if(e.key === 'P') {
		e.preventDefault();
		sPower = setSignalPower((sPower - 1) / 10) * 10;
	}

	if(e.key === 'n') {
		e.preventDefault();
		nPower = setNoisePower((nPower + 1) / 10) * 10;
	}

	if(e.key === 'N') {
		e.preventDefault();
		nPower = setNoisePower((nPower - 1) / 10) * 10;
	}

	console.log('Wave length: %f\tPhase: %f\tSignal power: %f\tNoise power: %f', waveLength, phase, sPower, nPower);
};

setWaveLength(waveLength);
