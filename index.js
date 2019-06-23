#!/usr/bin/node

const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const browserify = require('browserify-middleware');
const babelify = require('babelify');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/app.js', browserify(__dirname + '/js/app.js', {
	transform: [ babelify ]
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500);
	res.send({
		message: err.message,
		error: err
	});
});

const server = http.createServer(app);

server.on('error', e => {
	console.error('Server error: ', e);
});

server.listen(3000, () => {
	const address = server.address();
	console.log('Listening on %s:%d', address.address, address.port);
});
