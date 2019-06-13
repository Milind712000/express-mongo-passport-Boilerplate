const express = require('express');
const crypto = require('crypto');
const exec = require('child_process').exec;

const {folderPath, secret} = require('./config');

const app = express();

// express body-parser
app.use(express.json({
	limit: '30MB',
	extended: true
}));
app.use(express.urlencoded({
	limit: '30MB',
	extended: true
}));

function verifyPostData(req, res, next) {
	// console.log(req.headers);
	const payload = JSON.stringify(req.body);
	if (!payload) {
		return next('Request body empty');
	}

	const headerKey = 'x-hub-signature';
	const hmac = crypto.createHmac('sha1', secret);
	const digest = 'sha1=' + hmac.update(payload).digest('hex');
	const checksum = req.headers[headerKey];

	if (!checksum || !digest || checksum !== digest) {
		return next(`Request body digest (${digest}) did not match ${headerKey} (${checksum})`);
	}

	console.log('verified signature');
	return next();
}

app.use((req, res, next) => {
	console.log(req.method, req.path);
	next();
});

app.get('/github', (req, res, next) => {
	res.send('Server is working');
});

app.post('/github',verifyPostData, (req, res, next) => {
	exec(`cd ${folderPath} && git pull`);
	console.log('*** Used git pull ***');
	res.send('gitpull');
});

//test path
app.get('/home', (req, res, next) => {
	res.send('You\'ve reached the homepage');
});

// for invalid paths
app.use((req, res) => {
	res.send('Page not found');
});

// error handling
app.use((err, req, res, next) => {
	console.log('ErrorMessage : ',err.message);
	if (res.headersSent) next(err);
	res.send('Something Broke !!');
});

//listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server started listening on PORT : ${PORT}`);
});