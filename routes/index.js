const router = require('express').Router();

router.get('/home', (req, res) => {
	res.send('You\'ve reached the Home Page 0w0');
});

router.get('/throwerror', (req, res ) => {
	throw new Error('Some serious shit is happening right here');
	// this line below not get executed
	// eslint-disable-next-line no-unreachable
	res.send('Something Something');
} );

module.exports = router;