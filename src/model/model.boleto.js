const boletoConvenio = require("../boleto/boleto.convenio");
const boletoBancario = require("../boleto/boleto.bancaria");

class ModelBoleto {
  ValidarBoleto(ACodigoBarra) {
    if (!Number(ACodigoBarra)) {
      throw new Error("Código de barras não e número valido");
    }

    if (ACodigoBarra.length != 47 && ACodigoBarra.length != 48) {
      throw new Error("Código de barras não e valido");
    }

    let boleto;

    if (ACodigoBarra.length == 48) {
      boleto = boletoConvenio.validar(ACodigoBarra);
    } else if (ACodigoBarra.length == 47) {
      boleto = boletoBancario.validar(ACodigoBarra);
    }

    return {
      barCode: boleto.barra,
      amount: boleto.total,
      expirationDate: boleto.data,
    };
  }
}

module.exports = new ModelBoleto();
