const router = require("express").Router();
const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {

});

router.get("/receive", (req, res)=>{
    res.sendFile(path.join(__dirname, "../public/", "receive.html"));
});

router.get("/sendfiles", (req, res)=>{
  res.sendFile(path.join(__dirname, "../public/", "send.html"));
});

router.get("/downloads/:file", (req, res) => {
    let { file } = req.params;
    let file_2 = file.replace(/"/g, ' ').trim();
    let filePath = path.join(__dirname, "../uploads/", file_2);
  
    // Verifica si el archivo existe antes de intentar enviarlo
    if (fs.existsSync(filePath)) {
      const fileStream = fs.createReadStream(filePath);
  
      // Establece el encabezado Content-Disposition para sugerir un nombre de archivo para la descarga
      res.setHeader("Content-Disposition", `attachment; filename="${file_2}"`);
  
      // Configura un manejador de eventos para cuando se complete la descarga
      fileStream.on("end", () => {
        // Elimina el archivo después de que se haya descargado
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo:", err);
          } else {
            console.log("Archivo eliminado exitosamente:", filePath);
          }
        });
      });
  
      // Transmite el archivo al cliente
      fileStream.pipe(res);
    } else {
      res.status(404).send("Archivo no encontrado");
    }
  });

module.exports = router;