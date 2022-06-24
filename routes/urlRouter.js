const express = require("express");
const router = express.Router()
const {getter, poster} = require("../controllers/urlController")

router.get("/:data", getter)

router.post("/", poster)

module.exports = router