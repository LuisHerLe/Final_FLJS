
$(document).ready(function(){

  // ********************** INICIO VARIABLES GLOBALES **********************

  var countMov=0;

  // ********************** FIN VARIABLES GLOBALES **********************

  var start = false;
  // NOTE: Punto 1: Animación del título Match Game #DCFF0E
  setInterval(function(){
    $(".main-titulo").stop().animate({color:'white'},1000);
    $(".main-titulo").animate({color:'#DCFF0E'},1000);
  },1800)

  // NOTE: Punto 2: Se generan las imágenes de forma aleatoria
  setInterval(getRowCandies(),1000);
})
//

// NOTE:Punto 6. Se inicia juego o se reinicia contenido al dar click al botón cuando este diga "Reiniciar"
$(".btn-reinicio").click(function(){
  var contButton = $(".btn-reinicio").html();
  start = true;

  if (contButton == "Iniciar") {
    $(".btn-reinicio").html("Reiniciar");

    if (start) {
      // NOTE: Se llama inicia el temporizador
      setup(start);
    }

    $("img").draggable(
      {
        disabled: false,
        containment: ".panel-tablero",
        revert: true,
        revertDuration: 1,
        snap: ".elemento",
        snapMode: "inner",
        snapTolerance: 40,
      }
    );


    // NOTE: Punto 7: Se habilita el movimiento de las fichas
    // NOTE: Acá va la lógica
  }else {
    location.reload();
  }
})

// NOTE: Punto 2: Se generan las imágenes de forma aleatoria, primero se crea la estructura dentro del DOM
function getRowCandies(){
  var colName = "";
  var auxCol = "";
  var auxRow = "";
  var auxChildren = "";

  //Se recorren las columnas
  for (var i = 1; i < 8; i++) {
    colName = ".panel-tablero .col-"+i
    auxCol = ".col-"+i

    //Se recorren las filas
    for (var r = 1; r < 8; r++) {
      auxRow = ".row-"+r
      auxChildren = ".col-"+i+ "> .row-"+r

      if ($(auxChildren).children().length == 0) { //Saber si el campo está vacío
        //console.log("Vacío col: " + auxCol + " con fila: " + auxRow);
        var rowNew = $("<div class=row-"+r+"><img src='' alt=''></div>")
        rowNew.appendTo(colName);
        getImgCandies(rowNew);
      }
    }
  }
  if (i == 8 && r ==8) {

    //setInterval(function(){findHorizontal()},150);
    setInterval(function(){findVertical()},150);
  }
}

function getImgCandies(rowNew){
  // TODO: CAMBIAR!!!!!!!!!
  //var candyRandom = Math.round(Math.random()*4);
  var candyRandom = 1;
  while (candyRandom == 0) {
    candyRandom = Math.round(Math.random()*4)
  }
  var newCandy = "image/"+candyRandom+".png"
  rowNew.find("img").attr("src",newCandy);
}

// NOTE: Punto 4: Función para temporizador usando p5
function setup(start){
  if (start) {

    var counter = 0;
    var timeLeft = 120; //Está en segundos

    //Convertir a minutos + segundos
    function convertMinutes(s){
      var min = floor (s / 60);
      var sec = s % 60;
      var time = nf(min,2) + ":" + nf(sec,2);
      if (min == 0 && sec == 0) {
        //NOTE: Punto 4: Se termina el juego
        endGame();
      }
      return time;

    }

    noCanvas();
    var timer = $("#timer");
    timer.html(convertMinutes(timeLeft - counter))
    function countDown(){
      counter ++;
      timer.html(convertMinutes(timeLeft - counter))
    }
    setInterval(countDown, 1000);
  }
}

function endGame(){
  // NOTE: Punto 4: Se oculta el tablero de juego y el tiempo, adicional se agranda al 100% el ancho del panel de puntos
  $(".time").hide(1000,"swing");
  $(".panel-tablero").hide(1000,"swing", function(){
    $(".panel-score").animate({width:'100%'},1500);
  });

  // NOTE: Se crea nuevo div para indicar que se acabó el Juego
  var rowEnd = $("<div class='main-container'><p class = 'score'>End Game!</p></div>")
  var gameName = $(".main-titulo")
  rowEnd.appendTo(gameName);
}

// NOTE: Buscar igualdades para mandar eliminar ****EN CONSTRUCCIÓN****
function findVertical(){
  for (var i = 1; i < 8; i++) {
    var colMatch1 = "";
    var colMatch2 = "";
    var colMatch3 = "";
    //Se recorren las columnas
    for (var r = 0; r < 7; r++) {
      var aux = r+1;
      colMatch1=$(".panel-tablero .col-"+(i)).children().children().get(+(r)).attributes[0]
        colMatch2=$(".panel-tablero .col-"+(i)).children().children().get(+(r+1)).attributes[0]
        colMatch3=$(".panel-tablero .col-"+(i)).children().children().get(+(r+2)).attributes[0]

      //var colMatch3=$(".col-"+(r+2)).children("img:nth-child("+i+")").attr("src")

      if (colMatch1 != null && colMatch2 != null && colMatch3 != null){
        if (colMatch1.value == colMatch2.value && colMatch2.value == colMatch3.value){
          colMatch1=$(".panel-tablero .col-"+(1)).children()
          colMatch2=$(".panel-tablero .col-"+(1)).children()
          colMatch3=$(".panel-tablero .col-"+(1)).children()

          //setInterval(deleteCandies,1500) // TODO: Crear función deleteCandies
          console.log("Si hay coincidencias de columna " + i + " Fila " + r);
        }
      }
    }
  }
}

function findHorizontal(){
  for (var i = 1; i < 8; i++) {
    var colName = ".panel-tablero .col-"+i
    //Se recorren las columnas
    for (var r = 1; r < 8; r++) {
      //Se recorren las filas
      var rowMatch1=$(".row-"+r).children("img:nth-last-child("+i+")").attr("src")
      var rowMatch2=$(".row-"+(r+1)).children("img:nth-last-child("+i+")").attr("src")
      var rowMatch3=$(".row-"+(r+2)).children("img:nth-last-child("+i+")").attr("src")

      if (rowMatch1 != null && rowMatch2 != null && rowMatch3 != null){
        if (rowMatch1 == rowMatch2 && rowMatch2 == rowMatch3){
          console.log("Si hay coincidencias de filas");
          rowMatch1=$(".row-"+r).children("img:nth-last-child("+i+")");
          rowMatch2=$(".row-"+(r+1)).children("img:nth-last-child("+i+")");
          rowMatch3=$(".row-"+(r+2)).children("img:nth-last-child("+i+")")
          setInterval(deleteCandies(rowMatch1,rowMatch2,rowMatch3),1500);
        }
      }
    }
  }
}

// NOTE: ***********************************************************

function deleteCandies(rowMatch1,rowMatch2,rowMatch3){

}
