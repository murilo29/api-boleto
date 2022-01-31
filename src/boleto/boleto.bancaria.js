const moment = require("moment");

class boletoBancaria {
  validar(ACodigoBarra) {
    this.digitoVerificador(ACodigoBarra);

    const codigoBarra =
      ACodigoBarra.substring(0, 4) +
      ACodigoBarra.substring(32, 47) +
      ACodigoBarra.substring(4, 9) +
      ACodigoBarra.substring(10, 20) +
      ACodigoBarra.substring(21, 31);

    this.digitoCodigoBarra(codigoBarra);

    const valor = this.valorTotal(ACodigoBarra);
    const data = this.dataVencimento(ACodigoBarra);

    return {
      barra: codigoBarra,
      total: valor,
      data: data,
    };
  }

  dataVencimento(ACodigoBarra) {
    let campo = ACodigoBarra.substring(33, 47);

    let fatorVencimento = parseInt(campo.substring(0, 4));
    let dataBase = moment("1997-10-07");
    let vencimento = dataBase.add(fatorVencimento, "days").format("YYYY-MM-DD");

    return vencimento;
  }

  valorTotal(ACodigoBarra) {
    let campo = ACodigoBarra.substring(33, 47);
    let total = parseFloat(campo.substring(4, 15)) / 100;

    return total;
  }

  digitoCodigoBarra(ACodigoBarra) {
    let digitoVerificador = ACodigoBarra[4];

    let posicoes = ACodigoBarra.substring(0, 4) + ACodigoBarra.substring(5, 45);

    posicoes = posicoes.split("").reverse();
    let multiplicador = 2;
    let somaDasPosicoesMultiplicadas = 0;

    posicoes.forEach((p) => {
      let resultado = p * multiplicador;
      multiplicador = multiplicador == 9 ? 2 : ++multiplicador;

      somaDasPosicoesMultiplicadas += resultado;
    });

    let digitoVerificadorCalculado = 11 - (somaDasPosicoesMultiplicadas % 11);

    if ([0, 10, 11].find((x) => x == digitoVerificadorCalculado)) {
      digitoVerificadorCalculado = 1;
    }

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador do código de barras é inválido");
    }
  }

  digitoVerificador(ACodigoBarra) {
    let campo1 = ACodigoBarra.substring(0, 10);
    let campo2 = ACodigoBarra.substring(10, 21);
    let campo3 = ACodigoBarra.substring(21, 32);

    let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3];

    camposParaValidacaoDigitoVerificador.forEach((c) => {
      let campo = c.split("");
      var digitoVerificador = campo.pop();

      campo = campo.reverse();

      let multiplicador = 2;

      let campoMultiplicado = campo.map((n) => {
        let resultado = n * multiplicador;
        multiplicador = multiplicador == 1 ? 2 : 1;
        return resultado;
      });

      let somaDoCampoMultiplicado = 0;

      campoMultiplicado.forEach((n) => {
        if (n > 9) {
          n = Number(n.toString()[0]) + Number(n.toString()[1]);
        }

        somaDoCampoMultiplicado += n;
      });

      let restoDaDivisaoPor10 = somaDoCampoMultiplicado % 10;

      let dezenaPosterior = Math.ceil(somaDoCampoMultiplicado / 10) * 10;

      let resultadoSubtracao = (
        dezenaPosterior - restoDaDivisaoPor10
      ).toString();

      let digitoVerificadorCalculado =
        resultadoSubtracao[resultadoSubtracao.length - 1];

      if (digitoVerificadorCalculado != digitoVerificador) {
        throw new Error("Dígito verificador inválido");
      }
    });
  }
}

module.exports = new boletoBancaria();
