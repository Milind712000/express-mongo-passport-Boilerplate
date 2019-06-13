const router = require('express').Router();
const fn = require('express-async-handler');

async function err2(msg){
	throw new Error(msg);
}

router.get('/home', (req, res) => {
	res.send('You\'ve reached the Home Page 0w0');
});

router.get('/throwerror', (req, res ) => {
	throw new Error('Some serious shit is happening right here');
	// this line below not get executed
	// eslint-disable-next-line no-unreachable
	res.send('Something Something');
} );

//no async error handling
router.get('/asyncerror3', async (req, res) => {
	await err2('fasdfasdf');
	res.send('safe');
});

//async error handling using a wrapper
router.get('/asyncerror', fn(async (req, res) => {
	await err2('fasdfasdf');
	res.send('safe');
}));

// async error handling using try catch
router.get('/asyncerror2', async (req, res, next) => {
	try{
		// throw new Error('asdfa');
		await err2('fasdfasdf');
	} catch (err) {
		return next(err); //if I don't use return here then res.send gets executed resulting in an error
		// for some reason next here does not pass the control to the next middleware completely and this
		// async functions keeps executing
	}
	res.send('safe');
});

module.exports = router;