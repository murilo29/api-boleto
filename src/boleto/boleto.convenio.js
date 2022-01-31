const moment = require("moment");

class boletoConvenio {
  validar(ACodigoBarra) {
    const codigoBarra =
      ACodigoBarra.substring(0, 11) +
      ACodigoBarra.substring(12, 23) +
      ACodigoBarra.substring(24, 35) +
      ACodigoBarra.substring(36, 47);

    if ([6, 7].find((n) => n == ACodigoBarra[2])) {
      this.digitoVerificador(ACodigoBarra);
      this.digitoVerificadorGeral(codigoBarra);
    } else if ([8, 9].find((n) => n == ACodigoBarra[2])) {
      this.validarDigitos(ACodigoBarra);
      this.validarDigitoGeral(codigoBarra);
    } else {
      throw new Error("Identificador de Valor Efetivo inválido");
    }

    const valor = this.valorTotal(codigoBarra);
    const data = this.dataVencimento(codigoBarra);

    return {
      barra: codigoBarra,
      total: valor,
      data: data,
    };
  }

  dataVencimento(ACodigoBarra) {
    let vencimento = moment(ACodigoBarra.substring(19, 27), "YYYYMMDD").format(
      "YYYY-MM-DD"
    );

    return vencimento == "data inválida" ? "" : vencimento;
  }

  valorTotal(ACodigoBarra) {
    return parseFloat(ACodigoBarra.substring(4, 15)) / 100;
  }

  validarDigitoGeral(ACodigoBarra) {
    let codigoAuxiliar =
      ACodigoBarra.substring(0, 3) + ACodigoBarra.substring(4, 44);

    let digitoVerificador = ACodigoBarra[3];

    codigoAuxiliar = codigoAuxiliar.split("").reverse();

    let multiplicador = 2;
    let somaDoCampoMultiplicado = 0;

    codigoAuxiliar.forEach((n) => {
      let resultado = n * multiplicador;
      somaDoCampoMultiplicado += resultado;
      multiplicador = multiplicador == 9 ? 2 : ++multiplicador;
    });

    let restoDaDivisaoPor11 = somaDoCampoMultiplicado % 11;

    let digitoVerificadorCalculado = 11 - restoDaDivisaoPor11;

    if ([0, 1].find((n) => n == restoDaDivisaoPor11)) {
      digitoVerificadorCalculado = 0;
    } else if (restoDaDivisaoPor11 == 10) {
      digitoVerificadorCalculado = 1;
    }

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador inválido");
    }
  }

  validarDigitos(ACodigoBarra) {
    let campo1 = ACodigoBarra.substring(0, 12);
    let campo2 = ACodigoBarra.substring(12, 24);
    let campo3 = ACodigoBarra.substring(24, 36);
    let campo4 = ACodigoBarra.substring(36, 48);

    let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3, campo4];

    camposParaValidacaoDigitoVerificador.forEach((c) => {
      let campo = c.split("");
      var digitoVerificador = campo.pop();

      campo = campo.reverse();

      let multiplicador = 2;
      let somaDoCampoMultiplicado = 0;

      campo.forEach((n) => {
        let resultado = n * multiplicador;

        somaDoCampoMultiplicado += resultado;

        multiplicador = multiplicador == 9 ? 2 : ++multiplicador;
      });

      let restoDaDivisaoPor11 = somaDoCampoMultiplicado % 11;

      let digitoVerificadorCalculado = 11 - restoDaDivisaoPor11;

      if ([0, 1].find((n) => n == restoDaDivisaoPor11)) {
        digitoVerificadorCalculado = 0;
      } else if (restoDaDivisaoPor11 == 10) {
        digitoVerificadorCalculado = 1;
      }

      if (digitoVerificadorCalculado != digitoVerificador) {
        throw new Error("Dígito verificador inválido");
      }
    });
  }

  digitoVerificadorGeral(ACodigoBarra) {
    let codigoAuxiliar =
      ACodigoBarra.substring(0, 3) + ACodigoBarra.substring(4, 44);

    let digitoVerificador = ACodigoBarra[3];

    codigoAuxiliar = codigoAuxiliar.split("").reverse();

    let multiplicador = 2;
    let somaDoCampoMultiplicado = 0;

    codigoAuxiliar.forEach((n) => {
      let resultado = n * multiplicador;
      multiplicador = multiplicador == 1 ? 2 : 1;

      if (resultado > 9) {
        resultado =
          Number(resultado.toString()[0]) + Number(resultado.toString()[1]);
      }

      somaDoCampoMultiplicado += resultado;
    });

    let digitoVerificadorCalculado = 10 - (somaDoCampoMultiplicado % 10);

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador geral inválido");
    }
  }

  digitoVerificador(ACodigoBarra) {
    let campo1 = ACodigoBarra.substring(0, 12);
    let campo2 = ACodigoBarra.substring(12, 24);
    let campo3 = ACodigoBarra.substring(24, 36);
    let campo4 = ACodigoBarra.substring(36, 48);

    let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3, campo4];

    camposParaValidacaoDigitoVerificador.forEach((c) => {
      let campo = c.split("");
      var digitoVerificador = campo.pop();

      campo = campo.reverse();

      let multiplicador = 2;
      let somaDoCampoMultiplicado = 0;

      campo.forEach((n) => {
        let resultado = n * multiplicador;
        multiplicador = multiplicador == 1 ? 2 : 1;

        if (resultado > 9) {
          resultado =
            Number(resultado.toString()[0]) + Number(resultado.toString()[1]);
        }

        somaDoCampoMultiplicado += resultado;
      });

      let restoDaDivisaoPor10 = somaDoCampoMultiplicado % 10;

      let digitoVerificadorCalculado =
        restoDaDivisaoPor10 == 0 ? 0 : 10 - restoDaDivisaoPor10;

      if (digitoVerificadorCalculado != digitoVerificador) {
        throw new Error("Dígito verificador inválido");
      }
    });
  }
}

module.exports = new boletoConvenio();
