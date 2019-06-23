import input, { windowSize } from './input';

/**
 * Goertzel filter
 */
function goertzelFilter(f, N) {
	const buffer = new Float32Array(N);

	const realW = Math.cos(2 * Math.PI * f);
	const imagW = Math.sin(2 * Math.PI * f);
	const coeff = 2 * realW;

	let offset = 0;

	return sample => {
		buffer[offset] = sample;
		let Skn1 = 0, Skn2 = 0;
		for(let i = 0; i < N; i++) {
			const Skn = buffer[(offset + i) % N] + coeff * Skn1 - Skn2;
			Skn2 = Skn1;
			Skn1 = Skn;
		}
		offset = (offset + 1) % N;
		const resultr = Skn1 - realW * Skn2;
		const resulti = -imagW * Skn2;
		return Math.sqrt(resultr * resultr + resulti * resulti);
	};
}


/**
 * Sliding-window DFT
 */
function sdftFilter(f, N) {
	const buffer = new Float32Array(N);
	const rTwiddle = Math.cos(2 * Math.PI * f);
	const iTwiddle = Math.sin(2 * Math.PI * f);
	let rS = 0, iS = 0;

	let offset = 0;
	const r = 0.9999999999;
	const rp = Math.pow(r, N);

	return sample => {
		const old = buffer[offset];
		buffer[offset] = sample;
		rS = r * rTwiddle * rS - r * iTwiddle * iS + sample - rp * old;
		iS = r * rTwiddle * iS + r * iTwiddle * rS + sample - rp * old;
		offset = (offset + 1) % N;
		return Math.sqrt(rS * rS + iS * iS);
	};
}


draw();

function draw() {
	setTimeout(() => requestAnimationFrame(draw), 100);

	const markWaveLength = 100;
	const spaceWaveLength = 90;

	const markFilter = goertzelFilter(1 / markWaveLength, 10 * markWaveLength);
	const spaceFilter = goertzelFilter(1 / spaceWaveLength, 10 * spaceWaveLength);
	//let markFilter = sdftFilter(normalizedMark, Math.round(10 / normalizedMark));
	//let spaceFilter = sdftFilter(normalizedSpace, Math.round(10 / normalizedSpace));

	const markOutput = new Float32Array(windowSize);
	const spaceOutput = new Float32Array(windowSize);
	const fskSamples = new Float32Array(windowSize);

	const samples = input();

	for(let i = 0; i < windowSize; i++) {
		markOutput[i] = markFilter(samples[i]);
		spaceOutput[i] = spaceFilter(samples[i]);
		fskSamples[i] = markOutput[i] - spaceOutput[i];
	}

	drawFilters(spaceOutput, markOutput);
	//drawFskSamples(fskSamples);
}


function drawFilters(spaceSamples, markSamples) {
	const e = document.getElementById('mark-filter');
	const halfHeight = e.height;// / 1.5;

	const ctx = e.getContext('2d');
	ctx.clearRect(0, 0, e.width, e.height);
	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.moveTo(0, halfHeight);
	ctx.lineTo(e.width, halfHeight);
	ctx.stroke();

	const pixelsPerSample = e.width / spaceSamples.length;

	let max = 0;
	for(const sample of spaceSamples) {
		const abs = sample > 0 ? sample : -sample;
		if(abs > max) max = abs;
	}

	for(const sample of markSamples) {
		const abs = sample > 0 ? sample : -sample;
		if(abs > max) max = abs;
	}

	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = spaceSamples.length; i < l; i += 50) {
		ctx.moveTo(i * pixelsPerSample, halfHeight - 3);
		ctx.lineTo(i * pixelsPerSample, halfHeight + 3);
	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = spaceSamples.length; i < l; i++) {
		ctx.lineTo(i * pixelsPerSample, halfHeight - spaceSamples[i] / 10);
	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'blue';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = markSamples.length; i < l; i++) {
		ctx.lineTo(i * pixelsPerSample, halfHeight - markSamples[i] / 10);
	}
	ctx.stroke();
}

window.shit = -1;
let beenHigh = false;

window.addEventListener('keydown', () => setTimeout(()=>window.shit++, 20));

function drawFskSamples(samples) {
	const e = document.getElementById('fsk-samples');
	const halfHeight = e.height / 2;

	const ctx = e.getContext('2d');
	ctx.clearRect(0, 0, e.width, e.height);
	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.moveTo(0, halfHeight);
	ctx.lineTo(e.width, halfHeight);
	ctx.stroke();

	const pixelsPerSample = e.width / samples.length;

	ctx.beginPath();
	ctx.strokeStyle = 'gray';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = samples.length; i < l; i += 50) {
		ctx.moveTo(i * pixelsPerSample, halfHeight - 3);
		ctx.lineTo(i * pixelsPerSample, halfHeight + 3);
	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = samples.length; i < l; i++) {
		ctx.lineTo(i * pixelsPerSample, samples[i] > 0 ? 0 : (samples[i] < 0 ? e.height : halfHeight));
	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = 'blue';
	ctx.moveTo(0, halfHeight);
	for(let i = 0, l = samples.length; i < l; i++) {
		ctx.lineTo(i * pixelsPerSample, halfHeight - samples[i] / 2);
	}
	ctx.stroke();
}
