const router = require("express").Router();

router.get('/home', (req, res, next) => {
    res.send("You've reached the Home Page 0w0");
})

router.get('/throwerror', (req, res, next ) => {
    throw new Error("Some serious shit is happening right here");
    res.send("Something Something"); // this will not get executed
} )

module.exports = router;