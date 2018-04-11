
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

eliminarhorver()
    // NOTE: Punto 7: Se habilita el movimiento de las fichas
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
}

function getImgCandies(rowNew){
  var candyRandom = Math.round(Math.random()*4);
  if (candyRandom == 0) {
    candyRandom++
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
function findMatch(){
  for (var i = 1; i < 8; i++) {
    var colName = ".panel-tablero .col-"+i
    //Se recorren las columnas
    for (var r = 1; r < 8; r++) {
      var colMatch1=$(".col-"+r).children("img:nth-last-child("+i+")").attr("src")
      var colMatch2=$(".col-"+(r+1)).children("img:nth-last-child("+i+")").attr("src")
      var colMatch3=$(".col-"+(r+2)).children("img:nth-last-child("+i+")").attr("src")

      if (colMatch1 != null && colMatch2 != null && colMatch3 != null){
        if (colMatch1 == colMatch2 && colMatch2 == colMatch3){

        }
      }

      //Se recorren las filas
      var rowMatch1=$(".row-"+r).children("img:nth-last-child("+i+")").attr("src")
      var rowMatch2=$(".row-"+(r+1)).children("img:nth-last-child("+i+")").attr("src")
      var rowMatch3=$(".row-"+(r+2)).children("img:nth-last-child("+i+")").attr("src")

      if (rowMatch1 != null && rowMatch2 != null && rowMatch3 != null){
        if (rowMatch1 == rowMatch2 && rowMatch2 == rowMatch3){
          setInterval(deleteCandies,1500) // TODO: Crear función deleteCandies
        }
      }
    }
  }
}



// NOTE: ***************************************************
function eliminarhorver()
{
  matriz=0;
  rbh=horizontal()  //funcion busqueda dulces horizontal
  rbv=vertical()    //funcion buscar dulces vertical

  for(var j=1;j<8;j++)
  {
      matriz=matriz+$(".col-"+j).children().length;
  }

  if(rbh==0 && rbv==0 && matriz!=49)  //condicion si no encuentra 3 dulces o mas llamar a funcion para volver a completar el uego
  {
      clearInterval(eliminar);
      bnewd=0;
      newdulces=setInterval(function()
      {
        nuevosdulces()  //Funcion completar nuevos dulces
      },600)
  }
  if(rbh==1 || rbv==1)
  {
    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",1000,function(){
      var scoretmp=$(".activo").length;
      $(".activo").remove("img")
      score=score+scoretmp;
      $("#score-text").html(score)  //Cambiar puntuacion
    })
  }

  if(rbh==0 && rbv==0 && matriz==49)
  {
    $(".elemento").draggable({
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".elemento",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){
        mov=mov+1;
        $("#movimientos-text").html(mov)
      }
    });
  }

  $(".elemento").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      rbh=horizontal()  //funcion busqueda dulces horizontal
      rbv=vertical()    //funcion buscar dulces vertical
      if(rbh==0 && rbv==0)
      {
        dropped.swap($(droppedOn));
      }
      if(rbh==1 || rbv==1)
      {
        clearInterval(newdulces);
        clearInterval(eliminar);   //desactivar funcion desplazamiento()
        eliminar=setInterval(function(){eliminarhorver()},150)  //activar funcion eliminarhorver
      }
    },
  });
}
//------------------------------------------------------------------------------
//---------Funcion para intercambiar dulces-------------------------------------
jQuery.fn.swap = function(b)
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};
	function horizontal()
{
  var bh=0;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          bh=1;
      }
    }
  }
  return bh;
}
//------------------------------------------------------------------------------
//----------Funcion de busqueda vertical de dulces------------------------------
function vertical()
{
  var bv=0;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
          bv=1;
      }
    }
  }
  return bv;
}
