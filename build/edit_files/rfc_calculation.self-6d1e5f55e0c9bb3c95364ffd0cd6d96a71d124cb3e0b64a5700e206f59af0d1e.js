
function QuitarArticulos(palabra){
  var palabra=palabra.replace("DEL ",""); 
  palabra=palabra.replace("LAS ",""); 
  palabra=palabra.replace("DE ",""); 
  palabra=palabra.replace("LA ",""); 
  palabra=palabra.replace("Y ",""); 
  palabra=palabra.replace("A ",""); 
  palabra=palabra.replace("MC ","");
  palabra=palabra.replace("LOS ","");
  palabra=palabra.replace("VON ","");
  palabra=palabra.replace("VAN ","");
  return palabra; 
} 

function EsVocal(letra) {
  if (letra == 'A' || letra == 'E' || letra == 'I' || letra == 'O' || letra == 'U' || letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra == 'u') {
    return true; 
  }else{
    return 0;
  }
} 

function noTilde (s) {
    if (s.normalize != undefined) {
        s = s.normalize ("NFKD");
    }
    return s.replace (/[\u0300-\u036F]/g, "");
}

function CalcularRFC(nombre, apellidoPaterno, apellidoMaterno, fecha){
  /*Cambiamos todo a mayúsculas. 
  Quitamos los espacios al principio y final del nombre y apellidos*/ 
  nombre = noTilde(nombre.trim().toUpperCase()); 
  apellidoPaterno = noTilde(apellidoPaterno.trim().toUpperCase())
  apellidoMaterno = noTilde(apellidoMaterno.trim().toUpperCase())

  //RFC que se regresará 
  var rfc = ""; 

  //Quitamos los artículos de los apellidos 
  apellidoPaterno = QuitarArticulos(apellidoPaterno); 
  apellidoMaterno = QuitarArticulos(apellidoMaterno); 

  //Agregamos el primer caracter del apellido paterno 
  rfc = apellidoPaterno.substr(0, 1)

  //Buscamos y agregamos al rfc la primera vocal del primer apellido 
  len_apellidoPaterno = apellidoPaterno.length 
  for(var x=1;x<len_apellidoPaterno;x++) {
    var c = apellidoPaterno.substr(x,1); 
    if (EsVocal(c)){
      rfc = rfc.concat(c); 
      break; 
    } 
  } 

  //Agregamos el primer caracter del apellido materno 
  rfc = rfc.concat(apellidoMaterno.substr(0, 1)); 

  //Agregamos el primer caracter del primer nombre 
  rfc = rfc.concat(nombre.substr(0, 1)); 

  //agregamos la fecha yymmdd (por ejemplo: 680825, 25 de agosto de 1968 ) 
  rfc = rfc.concat(fecha.substr(8, 2).concat(fecha.substr(3, 2)).concat(fecha.substr(0, 2))); 

  //Le agregamos la homoclave al rfc 
  return CalcularHomoclave(apellidoPaterno+" "+apellidoMaterno+" "+nombre, fecha, rfc); 
   
} 

function CalcularHomoclave(nombreCompleto, fecha, rfc){
  //Guardara el nombre en su correspondiente numérico 
  //agregamos un cero al inicio de la representación númerica del nombre 
  var nombreEnNumero = "0"; 
  //La suma de la secuencia de números de nombreEnNumero 
  var valorSuma = 0; 

  //region Tablas para calcular la homoclave 
  //Estas tablas realmente no se porque son como son 
  //solo las copie de lo que encontré en internet 

  var tablaRFC1 = []
  tablaRFC1['&']='10'; 
  tablaRFC1['Ñ']='10'; 
  tablaRFC1['A']='11'; 
  tablaRFC1['B']='12'; 
  tablaRFC1['C']='13'; 
  tablaRFC1['D']='14'; 
  tablaRFC1['E']='15'; 
  tablaRFC1['F']='16'; 
  tablaRFC1['G']='17'; 
  tablaRFC1['H']='18'; 
  tablaRFC1['I']='19'; 
  tablaRFC1['J']='21'; 
  tablaRFC1['K']='22'; 
  tablaRFC1['L']='23'; 
  tablaRFC1['M']='24'; 
  tablaRFC1['N']='25'; 
  tablaRFC1['O']='26'; 
  tablaRFC1['P']='27'; 
  tablaRFC1['Q']='28'; 
  tablaRFC1['R']='29'; 
  tablaRFC1['S']='32'; 
  tablaRFC1['T']='33'; 
  tablaRFC1['U']='34'; 
  tablaRFC1['V']='35'; 
  tablaRFC1['W']='36'; 
  tablaRFC1['X']='37'; 
  tablaRFC1['Y']='38'; 
  tablaRFC1['Z']='39'; 
  tablaRFC1['0']='00'; 
  tablaRFC1['1']='01'; 
  tablaRFC1['2']='02'; 
  tablaRFC1['3']='03'; 
  tablaRFC1['4']='04'; 
  tablaRFC1['5']='05'; 
  tablaRFC1['6']='06'; 
  tablaRFC1['7']='07'; 
  tablaRFC1['8']='08'; 
  tablaRFC1['9']='09'; 

  var tablaRFC2 = []
  tablaRFC2[0]="1"; 
  tablaRFC2[1]="2"; 
  tablaRFC2[2]="3"; 
  tablaRFC2[3]="4"; 
  tablaRFC2[4]="5"; 
  tablaRFC2[5]="6"; 
  tablaRFC2[6]="7"; 
  tablaRFC2[7]="8"; 
  tablaRFC2[8]="9"; 
  tablaRFC2[9]="A"; 
  tablaRFC2[10]="B"; 
  tablaRFC2[11]="C"; 
  tablaRFC2[12]="D"; 
  tablaRFC2[13]="E"; 
  tablaRFC2[14]="F"; 
  tablaRFC2[15]="G"; 
  tablaRFC2[16]="H"; 
  tablaRFC2[17]="I"; 
  tablaRFC2[18]="J"; 
  tablaRFC2[19]="K"; 
  tablaRFC2[20]="L"; 
  tablaRFC2[21]="M"; 
  tablaRFC2[22]="N"; 
  tablaRFC2[23]="P"; 
  tablaRFC2[24]="Q"; 
  tablaRFC2[25]="R"; 
  tablaRFC2[26]="S"; 
  tablaRFC2[27]="T"; 
  tablaRFC2[28]="U"; 
  tablaRFC2[29]="V"; 
  tablaRFC2[30]="W"; 
  tablaRFC2[31]="X"; 
  tablaRFC2[32]="Y"; 
  tablaRFC2[33]="Z"; 

  var tablaRFC3 = []
  tablaRFC3['A']=10; 
  tablaRFC3['B']=11; 
  tablaRFC3['C']=12; 
  tablaRFC3['D']=13; 
  tablaRFC3['E']=14; 
  tablaRFC3['F']=15; 
  tablaRFC3['G']=16; 
  tablaRFC3['H']=17; 
  tablaRFC3['I']=18; 
  tablaRFC3['J']=19; 
  tablaRFC3['K']=20; 
  tablaRFC3['L']=21; 
  tablaRFC3['M']=22; 
  tablaRFC3['N']=23; 
  tablaRFC3['O']=25; 
  tablaRFC3['P']=26; 
  tablaRFC3['Q']=27; 
  tablaRFC3['R']=28; 
  tablaRFC3['S']=29; 
  tablaRFC3['T']=30; 
  tablaRFC3['U']=31; 
  tablaRFC3['V']=32; 
  tablaRFC3['W']=33; 
  tablaRFC3['X']=34; 
  tablaRFC3['Y']=35; 
  tablaRFC3['Z']=36; 
  tablaRFC3['0']=0; 
  tablaRFC3['1']=1; 
  tablaRFC3['2']=2; 
  tablaRFC3['3']=3; 
  tablaRFC3['4']=4; 
  tablaRFC3['5']=5; 
  tablaRFC3['6']=6; 
  tablaRFC3['7']=7; 
  tablaRFC3['8']=8; 
  tablaRFC3['9']=9; 
  tablaRFC3['']=24; 
  tablaRFC3[' ']=37; 

  //Recorremos el nombre y vamos convirtiendo las letras en 
  //su valor numérico 
  var len_nombreCompleto = nombreCompleto.length; 
  for(var x=0;x<len_nombreCompleto;x++) {
    var c = nombreCompleto.substr(x,1) 
    if (tablaRFC1[c] !== undefined ){ 
      nombreEnNumero = nombreEnNumero.concat(tablaRFC1[c]); 
    }else{ 
      nombreEnNumero = nombreEnNumero.concat("00"); 
    }
  } 
  //Calculamos la suma de la secuencia de números 
  //calculados anteriormente 
  //la formula es: 
  //( (el caracter actual multiplicado por diez) 
  //mas el valor del caracter siguiente ) 
  //(y lo anterior multiplicado por el valor del caracter siguiente) 

  var n = nombreEnNumero.length - 1; 
  for (var i=0;i<n;i++) {
    var prod1 = nombreEnNumero.substr(i, 2);
    var prod2 = nombreEnNumero.substr(i + 1, 1);
    valorSuma += prod1 * prod2;
  } 
  //Lo siguiente no se porque se calcula así, es parte del algoritmo. 
  //Los magic numbers que aparecen por ahí deben tener algún origen matemático 
  //relacionado con el algoritmo al igual que el proceso mismo de calcular el 
  //digito verificador. 
  //Por esto no puedo añadir comentarios a lo que sigue, lo hice por acto de fe. 
  var div = 0; 
  var mod = 0; 
  div = valorSuma % 1000; 
  mod = Math.floor(div / 34);//cociente 
  div = div - mod * 34;//residuo 

  var hc = tablaRFC2[mod]; 
  hc = hc.concat(tablaRFC2[div]); 

  rfc = rfc.concat(hc); 

  //Aqui empieza el calculo del digito verificador basado en lo que tenemos del RFC 
  //En esta parte tampoco conozco el origen matemático del algoritmo como para dar 
  //una explicación del proceso, así que ¡tengamos fe hermanos!. 
  sumaParcial = 0; 
  var n = rfc.length; 
  for (var i = 0; i < n; i++) {
    c = rfc.substr(i, 1) 
    if (tablaRFC3[c] !== undefined ){
      sumaParcial += (tablaRFC3[c] * (13 - (i)));
    } 
  } 


  last_digit = ""  
  moduloVerificador = sumaParcial % 11; 
  if (moduloVerificador == 0){
    last_digit = "0"; 
  }

  if (moduloVerificador > 0){
    last_digit = 11 - moduloVerificador
  }

  if (last_digit == 10){
    last_digit = "A"; 
  }

  rfc = rfc.concat(last_digit)
  return rfc;
}
