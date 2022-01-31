const modelBoleto = require("../model/model.boleto");

module.exports = (app) => {
  app.get("/boleto/:codigo", (req, res) => {
    try {
      const info = modelBoleto.ValidarBoleto(req.params.codigo);
      res.status(200).send(info);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
};
