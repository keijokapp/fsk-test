import input, { windowSize } from './input';
import { fft } from './fft';

const inputSamplesCanvas = document.getElementById('inputSamples');
const inputSamplesCtx = inputSamplesCanvas.getContext('2d');
const inputFftCanvas = document.getElementById('inputFft');
const inputFftCtx = inputFftCanvas.getContext('2d');
const fftInfoContainer = document.getElementById('fft-info-container');


inputFftCanvas.addEventListener('mousemove', ({ target, clientX, clientY, offsetX }) => {
	//console.log(target.clientWidth, windowSize, offsetX)
	const bin = windowSize / target.clientWidth * offsetX;
	const waveLength = windowSize / bin;
	fftInfoContainer.style.display = null;
	fftInfoContainer.innerHTML = `Bin: ${Math.floor(bin)}<br/>Wavelength: ${waveLength}<br/>Frequency: ${1 / waveLength}`;
	fftInfoContainer.style.top = clientY + 28;
	fftInfoContainer.style.left = clientX;
});

inputFftCanvas.addEventListener('mouseout', () => {
	fftInfoContainer.style.display = 'none';
});


function drawTone(input, waveLength) {
	const inputToneCanvas = document.getElementById('inputTone-' + waveLength);
	const inputToneCtx = inputToneCanvas.getContext('2d');

	const canvasWidth = inputToneCanvas.width;
	const canvasHeight = inputToneCanvas.height;

	const centerX = canvasWidth / 2;
	const centerY = canvasHeight / 2;

	inputToneCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	const omega = 2 * Math.PI / waveLength;

	inputToneCtx.strokeStyle = "black";
	const slope = [ Math.cos(input.length * omega), Math.sin(input.length * omega) ];
	inputToneCtx.beginPath();
	inputToneCtx.moveTo(centerX - slope[0] * 300, centerY - slope[1] * 300);
	inputToneCtx.lineTo(centerX + slope[0] * 300, centerX + slope[1] * 300);
	inputToneCtx.stroke();

	inputToneCtx.fillStyle = "gray";
	inputToneCtx.fillRect(centerX, centerY, 1, 1);

	inputToneCtx.strokeStyle = "gray";
	inputToneCtx.beginPath();
	inputToneCtx.moveTo(centerX, 0);
	inputToneCtx.lineTo(centerX, 10);
	inputToneCtx.moveTo(centerX, canvasHeight - 10);
	inputToneCtx.lineTo(centerX, canvasHeight);
	inputToneCtx.moveTo(0, centerY);
	inputToneCtx.lineTo(10, centerY);
	inputToneCtx.moveTo(canvasWidth - 10, centerY);
	inputToneCtx.lineTo(canvasWidth, centerY);
	inputToneCtx.stroke();

	inputToneCtx.fillStyle = "blue";
	let sumR = 0;
	let sumI = 0;
	for(let i = 0; i < input.length; i++) {
		const real = Math.cos(i * omega);
		const imag = Math.sin(i * omega);
		sumR += real * input[i];
		sumI += imag * input[i];
		inputToneCtx.fillRect(centerX + real * input[i] * 100, centerY + imag * input[i] * 100, 1, 1);
	}

	sumR /= input.length;
	sumI /= input.length;

	inputToneCtx.fillStyle = "red";
	inputToneCtx.fillRect(centerX + sumR * 100 - 1, centerY + sumI * 100 - 1, 2, 2);
}


function draw() {
	setTimeout(() => requestAnimationFrame(draw), 100);

	const canvasWidth = inputSamplesCanvas.width, canvasHeight = inputSamplesCanvas.height;

	inputSamplesCtx.clearRect(0, 0, canvasWidth, canvasHeight);

	const inputSamples = input();
	const N = inputSamples.length;

	inputSamplesCtx.strokeStyle = "gray";
	inputSamplesCtx.beginPath();
	inputSamplesCtx.moveTo(0, canvasHeight / 2);
	inputSamplesCtx.lineTo(canvasWidth, canvasHeight / 2);
	for(let x = 0; x < N; x += 100) {
		inputSamplesCtx.moveTo(x * canvasWidth / N, canvasHeight / 2 - 10);
		inputSamplesCtx.lineTo(x * canvasWidth / N, canvasHeight / 2 + 10);
	}
	inputSamplesCtx.stroke();
	inputSamplesCtx.strokeStyle = 'blue';
	inputSamplesCtx.beginPath();
	inputSamplesCtx.moveTo(0, canvasHeight / 2);
	for(let x = 0; x < N; x++) {
		inputSamplesCtx.lineTo(x * canvasWidth / N, canvasHeight / 2 - inputSamples[x] * canvasHeight / 2);
	}
	inputSamplesCtx.stroke();

	const [ inputFftR, inputFftI ] = fft(inputSamples);

	inputFftCtx.clearRect(0, 0, canvasWidth, canvasHeight);
	/*inputFftCtx.strokeStyle = 'gray';
	inputFftCtx.beginPath();
	inputFftCtx.moveTo(0, canvasHeight);
	for(let x = 0; x < N; x++) {
		inputFftCtx.lineTo(x * canvasWidth / N,  canvasHeight - Math.sqrt(inputFftI[x] * inputFftI[x] + inputFftR[x] * inputFftR[x]));
	}
	inputFftCtx.stroke();*/
	inputFftCtx.strokeStyle = 'blue';
	inputFftCtx.beginPath();
	inputFftCtx.moveTo(0, canvasHeight / 2);
	for(let x = 0; x < N; x++) {
		inputFftCtx.lineTo(x * canvasWidth / N,  canvasHeight / 2 - inputFftR[x] / 2);
	}
	inputFftCtx.stroke();
	inputFftCtx.strokeStyle = 'red';
	inputFftCtx.beginPath();
	inputFftCtx.moveTo(0, canvasHeight / 2);
	for(let x = 0; x < N; x++) {
		inputFftCtx.lineTo(x * canvasWidth / N,  canvasHeight / 2 - inputFftI[x] / 2);
	}
	inputFftCtx.stroke();

	drawTone(inputSamples, 10);
	drawTone(inputSamples, 100);
	drawTone(inputSamples, 128);
	drawTone(inputSamples, 200);
	drawTone(inputSamples, 256);
	drawTone(inputSamples, 500);
	drawTone(inputSamples, 512);
	drawTone(inputSamples, windowSize);
}

requestAnimationFrame(draw);
