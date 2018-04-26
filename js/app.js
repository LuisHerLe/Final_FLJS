
$(document).ready(function(){

  var start = false;
  // NOTE: Punto 1: Animación del título Match Game #DCFF0E
  setInterval(function(){
    $(".main-titulo").stop().animate({color:'white'},1000);
    $(".main-titulo").animate({color:'#DCFF0E'},1000);
  },1800)

  // NOTE: Punto 2: Se generan las imágenes de forma aleatoria
  setInterval(getRowCandies(),1000);

})
// ********************** INICIO VARIABLES GLOBALES **********************

var countMov=0;
var listDelete = new Array();
var findedH = "";
var findedV = "";
var aux = "";
// ********************** FIN VARIABLES GLOBALES **********************

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
    //  setInterval(function(){findVertical()},150);
    findVertical(listDelete);
    findHorizontal(listDelete);

  }
}

function getImgCandies(rowNew){
  // TODO: CAMBIAR!!!!!!!!!
  var candyRandom = Math.round(Math.random()*4);
  //var candyRandom = 1; //Para pruebas
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
function findVertical(listDelete){

  var colMatch1 = "";
  var colMatch2 = "";
  var colMatch3 = "";
  var aux = "";

  for (var i = 1; i < 8; i++) {

    try {
      //Se recorren las columnas
      for (var r = 0; r < 7; r++) {
        aux = listDelete.length + r;
        colMatch1=$(".panel-tablero .col-"+(i)).children().children().get(+(r)).attributes[0]
        colMatch2=$(".panel-tablero .col-"+(i)).children().children().get(+(r+1)).attributes[0]
        colMatch3=$(".panel-tablero .col-"+(i)).children().children().get(+(r+2)).attributes[0]

        //var colMatch3=$(".col-"+(r+2)).children("img:nth-child("+i+")").attr("src")

        if (colMatch1 != null && colMatch2 != null && colMatch3 != null){
          if (colMatch1.value == colMatch2.value && colMatch2.value == colMatch3.value){
            colMatch1=$(".panel-tablero .col-"+(i)).children().children().get(r);
            colMatch2=$(".panel-tablero .col-"+(i)).children().children().get(r+1);
            colMatch3=$(".panel-tablero .col-"+(i)).children().children().get(r+2);

            try {
              console.log("Si hay coincidencias de columna " + i + " Fila " + r);
              if (aux == 0 ) {
                listDelete[aux] = $(".panel-tablero .col-"+(i)).children().get(r).firstElementChild;
                listDelete[aux+1] = $(".panel-tablero .col-"+(i)).children().get(r+1).firstElementChild;
                listDelete[aux+2] = $(".panel-tablero .col-"+(i)).children().get(r+2).firstElementChild;
              }else {
                listDelete[aux+1] = $(".panel-tablero .col-"+(i)).children().get(r).firstElementChild;
                listDelete[aux+2] = $(".panel-tablero .col-"+(i)).children().get(r+1).firstElementChild;
                listDelete[aux+3] = $(".panel-tablero .col-"+(i)).children().get(r+2).firstElementChild;
              }


            } catch (e) {
              console.log("No se puede agregar a la lista el elemento a eliminar: " + e.message);
            }
          }
        }
      }
    } catch (e) {
      console.log("Error al ubicar una columna: " + e.message);
    }finally{
      listDelete = listDelete.filter(function(listDelete){
        return listDelete != undefined;
        console.log("Lista de findVertical");
        console.log(listDelete);
      });
    }
  }

  return listDelete;

}

function findHorizontal(listDelete){

  var rowMatch1 = "";
  var rowMatch2 = "";
  var rowMatch3 = "";

  var aux = "";

  for (var i = 1; i < 8; i++) {

    try {
      //Se recorren las columnas
      for (var l = 0; l < 7; l++) {
        if (listDelete.length ==0) {
          aux = listDelete.length;
        }else {
          aux = listDelete.length + 1;
        }

        rowMatch1=$(".panel-tablero .col-"+(i)).children().children().get(+(l)).attributes[0]
        rowMatch2=$(".panel-tablero .col-"+(i+1)).children().children().get(+(l)).attributes[0]
        rowMatch3=$(".panel-tablero .col-"+(i+2)).children().children().get(+(l)).attributes[0]

        if (rowMatch1 != null && rowMatch2 != null && rowMatch3 != null){
          if (rowMatch1.value == rowMatch2.value && rowMatch2.value == rowMatch3.value){
            rowMatch1=$(".panel-tablero .col-"+(i)).children().children().get(+(l));
            rowMatch2=$(".panel-tablero .col-"+(i+1)).children().children().get(+(l));
            rowMatch3=$(".panel-tablero .col-"+(i+2)).children().children().get(+(l));

            try {

              if (aux == 0 ) {
                listDelete[aux] = $(".panel-tablero .col-"+(i)).children().get(+(l)).firstElementChild;
                listDelete[aux+1] = $(".panel-tablero .col-"+(i+1)).children().get(+(l)).firstElementChild;
                listDelete[aux+2] = $(".panel-tablero .col-"+(i+2)).children().get(+(l)).firstElementChild;

              }else {
                listDelete[aux+1] =$(".panel-tablero .col-"+(i)).children().get(+(l)).firstElementChild;
                listDelete[aux+2] = $(".panel-tablero .col-"+(i+1)).children().get(+(l)).firstElementChild;
                listDelete[aux+3] = $(".panel-tablero .col-"+(i+2)).children().get(+(l)).firstElementChild;

                //$(".panel-tablero .col-"+(i+2)).children().get(+(l)).firstElementChild.remove();
              }

            } catch (e) {
              console.log("No se puede agregar a la lista el elemento a eliminar: " + e.message);
            }finally{
              listDelete = listDelete.filter(function(listDelete){
                animateToDelete(listDelete);
                return listDelete != undefined;
              });

            }
          }
        }
      }
    } catch (e) {
      console.log("Error al ubicar una columna: " + e.message);
    }finally{

      listDelete = listDelete.filter(function(listDelete){
        return listDelete != undefined;

      });
    }
    animateToDelete(listDelete);
  }

  // TODO: TERMINAR EL EFECTO!!!!
  function animateToDelete(listDelete){
    for (var i = 0; i < listDelete.length; i++) {
      parpadear();
    }
    function parpadear(){
      //console.log(listDelete[i]);
      //$(".row-1").get(0).children[0].fadeIn(500).delay(250).fadeOut(500, parpadear)
      listDelete[i].fadeIn(500).delay(250).fadeOut(500, parpadear)
      //listDelete[i].fadeIn(500,function(){
        //listDelete[i].fadeOut(500);
      //})
    }
    setInterval(deleteCandies(listDelete),100);
  }


}

// NOTE: ***********************************************************
function deleteCandies(listDelete){

  listDelete.filter(function(listDelete){
    return listDelete !== undefined
    console.log(listDelete);
  });

  for (var i = 0; i < listDelete.length; i++) {

    console.log("Posición: " + i);
    console.log(listDelete[i]);
    listDelete[i].remove();

  }
}
