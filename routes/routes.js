const router = require("express").Router();

router.get("/", (req, res) => {
  // Tu lógica para la ruta raíz aquí
});

router.get("/downloads/:file", (req, res) => {
  let { file } = req.params;
  res.sendFile(__dirname + "/uploads/" + file);
  console.log(file);
});

module.exports = router;