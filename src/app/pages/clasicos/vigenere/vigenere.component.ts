import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TextUtilService } from '../../common-services/text-util.service';
import { DialogoComponent } from '../../dialogo/dialogo.component';

@Component({
  selector: 'ngx-vigenere',
  styleUrls: ['./vigenere.component.scss'],
  templateUrl: './vigenere.component.html',
})
export class VigenereComponent {

  
  textoCifradoForm1 = '';
  
  textoClaroForm2 = '';

  textoCifradoForm3 = '';

  kasiskiFrecuencies = [];

  tipoClave = 'string';

  resultadoKasiski = {};

  indicesCoincidencia = [];

  model = {
    textoCifrado: '',
    maxM: 10
  }

  model2 = {
    textoCifrado: '',
    longitudClave: 1,
    clave: ''
  }

  columnsIndices = ['m', 'indices'];

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {}

  cifrar($event) {
    var textoCifrado = this.vigenereCipher($event.textoClaro, $event.clave);
    if (textoCifrado != 'error') {
      this.textoCifradoForm1 = textoCifrado;
    } else {
      this.showClaveIncorrecta();
    }
  }

  descifrar($event) {
    var textoClaro = this.vigenereDecipher($event.textoCifrado, $event.clave);
    if (textoClaro != "error") {
      this.textoClaroForm2 = textoClaro;
    } else {
      this.showClaveIncorrecta();
    }
  }

   // Ejemplo para kasiskiTest
  /* console.log(
      kasiskiTest(
          normalizeInput(
              `CHREEVOAHMAERATBIAXXWTNXBEEOPHBSBQMQEQERBW
              RVXUOAKXAOSXXWEAHBWGJMMQMNKGRFVGXWTRZXWIAK
              LXFPSKAUTEMNDCMGTSXMXBTUIADNGMGPSRELXNJELX
              VRVPRTULHDNQWTWDTYGBPHXTFALJHASVBFXNGLLCHR
              ZBWELEKMSJIKNBHWRJGNMGJSGLXFEYPHAGNRBIEQJT
              AMRVLCRREMNDGLXRRIMGNSNRWCHRQHAEYEVTAQEBBI
              PEEWEVKAKOEWADREMXMTBHHCHRTKDNVRZCHRCLQOHP
              WQAIIWXNRMGWOIIFKEE`
          ),
          "chr"
      )
  ); */

  mostrarIndicesCoincidencia(textoCifrado, maxM) {
    if (textoCifrado !== '') {
      var datosTabla = [];
      for(var i = 1; i <= maxM; i++) {
        textoCifrado = this.util.normalizeInput(textoCifrado);
        var indices = this.getAllCoincidenceIndex(textoCifrado, i).toString().replace(/,/g, ' | ');
        var obj = {
          data: { m: i, indices }
        }
        datosTabla.push(obj);
      }
      this.indicesCoincidencia = datosTabla;
    }
  }

  encontrarClave(textoCifrado, m) {
    if (textoCifrado !== '') {
      textoCifrado = this.util.normalizeInput(textoCifrado);
      this.model2.clave = this.vigenereCryptanalysis(textoCifrado, m);
    }
  }


  kasiski($event) {
    if ($event.textoCifrado != '') {
      var kasiskiFrecuencies = [];
      var frecuencies = this.charFrecuency($event.textoCifrado, $event.tamanio);
      for (var i = 0; i < frecuencies.length; i++) {
        var obj = {
          data: { n_grama: frecuencies[i][0], frecuencia: frecuencies[i][1] }
        }
        kasiskiFrecuencies.push(obj);
      }
      this.kasiskiFrecuencies = kasiskiFrecuencies;
    }
  }

  kasiskiAnalisis($event) {
    console.log('ants de indices: '+JSON.stringify($event));
    var indices = JSON.stringify(this.getIndicesOf($event.textoCifrado, $event.n_grama));
    console.log('indices: '+indices);
    var longitudClave = this.kasiskiTest($event.textoCifrado, $event.n_grama);
    this.resultadoKasiski = {indices, longitudClave} 
  }

  clearForm(formIndex) {
    if (formIndex == 1) {
      this.textoCifradoForm1 = '';
    } else if (formIndex == 2) {
      this.textoClaroForm2 = '';
    } else if (formIndex == 3) {
      this.textoCifradoForm3 = '';
      this.kasiskiFrecuencies = [];
    }
  }
  
  clearForm2(formIndex, $event) {
    $event.preventDefault();
    if (formIndex == 5) {
      this.model.textoCifrado = '';
      this.indicesCoincidencia = [];
    } else if (formIndex == 6) {
      this.model2.textoCifrado = '';
      this.model2.clave = '';
    }
  }

  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'La clave debe ser un n??mero entre 0 y 25'
      },
    });
  }
  

  // Funci??n que cifra (o descifra cuando cipher=false) un texto (clearText) usando el m??todo de Vigenere con la clave (key).
  vigenere(clearText, key, cipher) {
      var normalTextCodes = this.util.getCharCodes(this.util.normalizeInput(clearText));
      var normalKeyCodes = this.util.getCharCodes(this.util.normalizeInput(key));
      var m = normalKeyCodes.length;
      var indexKey = 0;
      for (var i = 0; i < normalTextCodes.length; i++) {
          indexKey = i % m;
          if (cipher)
              normalTextCodes[i] =
                  (normalTextCodes[i] + normalKeyCodes[indexKey]) % 26;
          else
              normalTextCodes[i] =
                  (normalTextCodes[i] - normalKeyCodes[indexKey] + 26) % 26;
      }
      return this.util.codesToString(normalTextCodes);
  }

  // Funci??n que cifra un texto (clearText) con una clave (key) usando Vigenere.
  vigenereCipher(clearText, key) {
      return this.vigenere(clearText, key, true);
  }

  // Funci??n que descifra un texto (cipherText) con una clave (key) usando Vigenere.
  vigenereDecipher(cipherText, key) {
      return this.vigenere(cipherText, key, false);
  }

  //Ejemplo para vigenereCipher y vigenereDecipher
  /* console.log(
      vigenereCipher(
          "From Zanzibar to Zambia to Zaire, ozone zones make zebras run zany zigzags", 
          "zone"
      )
  );
  console.log(
      vigenereDecipher(
          "efbqyoadhpnvscmelpvescmehfrsycaiycairanodnrfqofvtbmemmmmfnnkr",
          "zone"
      )
  ); */

  // Funci??n que retorna una palabra aleatoria de longitud m, puede ser usada como clave.
  randomKey(size) {
      var arrTemp = Array(size)
      .fill(0)
      .map(() => Math.round(Math.random() * 25));
      return this.util.codesToString(arrTemp);
  }

  // Funci??n que retorna la frecuencia de todas las subpalabras de longitud lenChar de un texto (text)
  charFrecuency(text, lenChar) {
      text = this.util.normalizeInput(text);
      var frecuencyMap = {};
      for (var i = 0; i < text.length - (lenChar - 1); i++) {
          if (frecuencyMap[text.substring(i, i + lenChar)])
              frecuencyMap[text.substring(i, i + lenChar)] += 1;
          else
              frecuencyMap[text.substring(i, i + lenChar)] = 1;
      }
      return Object.entries(frecuencyMap);
  }

  //Ejemplo para charFrecuency
  /* console.log(
      charFrecuency(
          "efbqyoadhpnvscmelpvescmehfrsycaiycairanodnrfqofvtbmemmmmfnnkr",
          3
      )
  ); */

  // Funci??n que retorna los ??ndices de las councidencias de una palabra (searchStr) en un texto (str)
  getIndicesOf(str, searchStr) {
    str = this.util.normalizeInput(str);
      searchStr = this.util.normalizeInput(searchStr);
      var searchStrLen = searchStr.length;
      if (searchStrLen == 0) {
          return [];
      }
      var startIndex = 0, index, indices = [];
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
          indices.push(index);
          startIndex = index + searchStrLen;
      }
      return indices;
  }

  // Funci??n que retorna el m??ximo com??n divisor de un arreglo de n??meros (numList) 
  gcd (numList) {
      if (numList.length == 2) {
          if (numList[1] == 0)
              return numList[0];
          else
              return this.gcd(new Array(numList[1], numList[0] % numList[1]));
      } else if (numList.length > 2) {
          var result = this.gcd(new Array(numList[0], numList[1]));
          for (var i = 2; i < numList.length; i++)
              result = this.gcd(new Array(result, numList[i]));
          return result;
      }
  };

  // Funci??n que retorna una posible longitud de la clave del cifrado Vigenere recibiendo el texto cifrado (cipherText)
  // y una de las subpalabras de longitud > 3 que m??s se repita.  
  kasiskiTest(cipherText, searchStr) {
      cipherText = this.util.normalizeInput(cipherText);
      searchStr = this.util.normalizeInput(searchStr);
      var indices = this.getIndicesOf(cipherText, searchStr);
      if (indices.length == 0) {
          return 0;
      }
      var indexDiff = [];
      for (var i = 1; i < indices.length; i++) {
          indexDiff.push(indices[i] - indices[0]);
      }
      return this.gcd(indexDiff);
  }

  // Ejemplo para kasiskiTest
  /* console.log(
      kasiskiTest(
          normalizeInput(
              `CHREEVOAHMAERATBIAXXWTNXBEEOPHBSBQMQEQERBW
              RVXUOAKXAOSXXWEAHBWGJMMQMNKGRFVGXWTRZXWIAK
              LXFPSKAUTEMNDCMGTSXMXBTUIADNGMGPSRELXNJELX
              VRVPRTULHDNQWTWDTYGBPHXTFALJHASVBFXNGLLCHR
              ZBWELEKMSJIKNBHWRJGNMGJSGLXFEYPHAGNRBIEQJT
              AMRVLCRREMNDGLXRRIMGNSNRWCHRQHAEYEVTAQEBBI
              PEEWEVKAKOEWADREMXMTBHHCHRTKDNVRZCHRCLQOHP
              WQAIIWXNRMGWOIIFKEE`
          ),
          "chr"
      )
  ); */

  // Funci??n que retorna el ??ndice de coincidencias de un texto (strText)
  coinciIndex(strText) {
      var text = this.util.normalizeInput(strText);
      var frecuencies = {};
      for (var i = 0; i < text.length; i++) {
          if (frecuencies[text.charAt(i)]) {
              frecuencies[text.charAt(i)] += 1;
          }
          else {
              frecuencies[text.charAt(i)] = 1;
          }
      }
      var coincidence = 0;
      Object.keys(frecuencies).reduce(function (previous, key) {
        return coincidence += frecuencies[key] * (frecuencies[key] - 1)
      }, 0);

      var n = strText.length;

      return coincidence / (n * (n - 1));
  }

  // Funci??n que divide un texto (strText) en m subpalabras y arma nuevas palabras tomando todos los caractesres que est??n en
  // la misma posici??n de la subpalabra 
  splitStr(strText, m) {
      var strToSend = [];
      for (var i = 0; i < m; i++) {
          strToSend.push("");
      }
      for (var i = 0; i < strText.length; i++) {
          strToSend[i % m] += strText.charAt(i);
      }
      return strToSend;
  }

  // Funci??n que retorna todos los m ??ndices de coincidencia de un texto.
  // Es buen m si los ??ndices de coincidencia son cercanos a 0.065. Es un mal m si son cercanos a 0.038, as?? se escoge el m
  getAllCoincidenceIndex(strText, m) {
      var out = [];
      if (m <= 0) {
          return out;
      }
      var strToSend = this.splitStr(strText, m);
      //console.log(strToSend)
      for (var i = 0; i < m; i++) {
          out.push(Math.round(this.coinciIndex(strToSend[i]) * 1000) / 1000);
      }
      return out;
  }

  // Ejemplo getAllCoincidenceIndex
  /* console.log(
      getAllCoincidenceIndex(
          normalizeInput(
              `CHREEVOAHMAERATBIAXXWTNXBEEOPHBSBQMQEQERBW
              RVXUOAKXAOSXXWEAHBWGJMMQMNKGRFVGXWTRZXWIAK
              LXFPSKAUTEMNDCMGTSXMXBTUIADNGMGPSRELXNJELX
              VRVPRTULHDNQWTWDTYGBPHXTFALJHASVBFXNGLLCHR
              ZBWELEKMSJIKNBHWRJGNMGJSGLXFEYPHAGNRBIEQJT
              AMRVLCRREMNDGLXRRIMGNSNRWCHRQHAEYEVTAQEBBI
              PEEWEVKAKOEWADREMXMTBHHCHRTKDNVRZCHRCLQOHP
              WQAIIWXNRMGWOIIFKEE`
          ), 
          5
      )
  ); */

  // Funci??n de que retorna la M_g(strText): la suma de para cada letra del alfabeto
  // (probabilidad est??ndar de una letra en ingl??s)*(probabilidad de la letra corrida g posisciones en el texto).
  // Lo que, entre m??s cercano a 0.065, significa que esa letra se corri?? k posiciones en el texto.
  funM_g(strText, g) {
      // Probabilidades estandar de encontrarse la i-??sima letra de un texto en ingl??s.  
      var standardProbabilities = 
          [0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.061, 0.070,
          0.002, 0.008, 0.040, 0.024, 0.067, 0.075, 0.019, 0.001, 0.060, 
          0.063, 0.091, 0.028, 0.010, 0.023, 0.001, 0.020, 0.001];
      var text = this.util.normalizeInput(strText);
      var frecuencies = {};
      for (var i = 0; i < text.length; i++) {
          if (frecuencies[text.charAt(i)])
              frecuencies[text.charAt(i)] += 1;
          else
              frecuencies[text.charAt(i)] = 1;
      }
      var t = [];
      for (var i = 0; i < standardProbabilities.length; i++) {
          t = [(i + g) % 26];
          if (frecuencies[this.util.codesToString(t)]) {
              standardProbabilities[i] *= frecuencies[this.util.codesToString(t)];
          }
          else {
              standardProbabilities[i] = 0;
          }
      }
      var sum = 0;
      for (var i = 0; i < standardProbabilities.length; i++) {
          sum += standardProbabilities[i];
      }
      return sum / strText.length;
  }

  // Funci??n que retorna la posible clave del texto cifrado con Vigenere (cipherText) suponinedo que la clave es de longitud m
  vigenereCryptanalysis(cipherText, m) {
      var possibleKey = this.splitStr(cipherText, m);
      const expectedCI = 0.065;
      var minDiff = -1;
      var indexMinDiff = -1;
      var testDiff = 0;
      for (var i = 0; i < m; i++) {
          minDiff = 100;
          indexMinDiff = 0;
          for (var j = 0; j < 26; j++) {
              testDiff = Math.abs(this.funM_g(possibleKey[i], j) - expectedCI);
              if (testDiff < minDiff) {
                  minDiff = testDiff;
                  indexMinDiff = j;
              }
          }
          possibleKey[i] = this.util.codesToString([indexMinDiff])
      }
      console.log('posible key: '+possibleKey.join(""));
      console.log(this.vigenereDecipher(cipherText, possibleKey.join("")));
      return possibleKey.join("");
  }

// Ejemplo para vigenereCryptanalysis
/*console.log(
    vigenereCryptanalysis(
        normalizeInput(
            `CHREEVOAHMAERATBIAXXWTNXBEEOPHBSBQMQEQERBW
            RVXUOAKXAOSXXWEAHBWGJMMQMNKGRFVGXWTRZXWIAK
            LXFPSKAUTEMNDCMGTSXMXBTUIADNGMGPSRELXNJELX
            VRVPRTULHDNQWTWDTYGBPHXTFALJHASVBFXNGLLCHR
            ZBWELEKMSJIKNBHWRJGNMGJSGLXFEYPHAGNRBIEQJT
            AMRVLCRREMNDGLXRRIMGNSNRWCHRQHAEYEVTAQEBBI
            PEEWEVKAKOEWADREMXMTBHHCHRTKDNVRZCHRCLQOHP
            WQAIIWXNRMGWOIIFKEE`
        ),
        5
    )
);*/

}
