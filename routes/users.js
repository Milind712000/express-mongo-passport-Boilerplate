const router = require('express').Router();

router.get("/login", (req, res, next) => {
    res.send("Login")
})

router.post("/login", (req, res, next) => {
    res.redirect("/")
    res.redirect("/login")
})

router.get("/signup", (req, res, next) => {
    res.send("Sign up page")
})

router.post("/signup", (req, res, next) => {
    res.redirect("/login")
    res.redirect("/signup")
})

router.get("/edit", (req, res, next) => {
    res.send("edit profile")
})

router.put("/edit", (req, res, next) => {
    res.redirect("/edit")
})

router.get("/:username", (req, res, next) => {
    res.send(`Details of user : ${req.params.username}`)
})

module.exports = router;