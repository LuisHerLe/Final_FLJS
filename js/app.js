$(document).ready(function(){

  var start = false;
  $(".timer").html("02:00");
  // NOTE: Animación del título Match Game #DCFF0E
  setInterval(function(){
    $(".main-titulo").stop().animate({color:'white'},1000);
    $(".main-titulo").animate({color:'#DCFF0E'},1000);
  },1800)

})

//NOTE: **********////////// INICIO Variables globales //////////**********
var matchHori=0;
var matchVert=0;
var bnewd=false;
var arrayCol=[""];
var arrayAux=[""];
var auxCount=0;
var arrayCandies=0;
var canMov=0;
var deleteC=0;
var auxNewCandies=0;
var i=0;
var count=0;
var conc1=0;
var initialPos;
var espera=0;
var score=0;
var mov=0;
var counter = 0;
var timeLeft = 30; //Está en segundos

//NOTE: **********////////// FIN Variables globales //////////**********

$(".btn-reinicio").click(function(){

  var contButton = $(".btn-reinicio").html();
  start = true;
  if (contButton == "Iniciar") {
    $(".btn-reinicio").html("Reiniciar");

    if (start) {
      // NOTE: Se llama inicia el temporizador
      setup(start);
      $(".panel-score").css("width","25%");
      // NOTE: Se habilita el movimiento de las fichas
      canMov=setInterval(function(){move()},200)
    }


  }else {
    location.reload();
  }

})

// NOTE: Función para temporizador usando p5
function setup(start){
  if (start) {
    setInterval(countDown, 1000);
  }

  //noCanvas();
  var timer = $("#timer");
  timer.html(convertMinutes(timeLeft - counter))
  function countDown(){
    counter ++;
    timer.html(convertMinutes(timeLeft - counter))
  }

  // NOTE: Convertir a minutos + segundos
  function convertMinutes(s){
    var min = floor (s / 60);
    var sec = floor (s % 60);
    var time = nf(min,2) + ":" + nf(sec,2);
    //var time = "02:00"
    if (min == 0 && sec == 0) {
      //NOTE: Se termina el juego
      endGame();
    }
    return time;
  }
}


// NOTE: Obtener el tablero de dulces
function move()
{
  i=i+1
  var numero=0;
  var imagen=0;

  $(".candy").draggable({disabled: true});
  if(i<8)
  {
    for(var l=1;l<8;l++)
    {
      if($(".col-"+l).children("img:nth-child("+i+")").html()==null)
      {
        numero=getNameCandy();
        imagen="image/"+numero+".png";
        $(".col-"+l).prepend("<img src="+imagen+" class='candy'/>")
      }
    }
  }
  if(i==8)
  {
    clearInterval(canMov);
    deleteC=setInterval(function(){deleteMatchs()},100)
  }
}
// NOTE: Eliminar coincidencias
function deleteMatchs()
{
  arrayCandies=0;
  matchHori=findHor()
  matchVert=findVer()

  for(var j=1;j<8;j++)
  {
    arrayCandies=arrayCandies+$(".col-"+j).children().length;
  }

  if(matchHori==false && matchVert==false && arrayCandies!=49)
  {
    clearInterval(deleteC);
    bnewd=false;
    auxNewCandies=setInterval(function(){nuevosdulces()},100)
  }
  if(matchHori==true || matchVert==true)
  {
    $(".candy").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",900,function(){

      //NOTE: Cambio de puntuación
      var auxScore=$(".activo").length;
      $(".activo").remove("img")
      score=score+auxScore;
      $("#score-text").html(score)

    })
  }

  if(matchHori==false && matchVert==false && arrayCandies==49)
  {
    $(".candy").draggable({
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".candy",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){

        //NOTE: Contar movimientos
        mov=mov+1;
        $("#movimientos-text").html(mov)
      }
    });
  }

  $(".candy").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap(droppedOn);
      }while(espera==0)
      matchHori=findHor()
      matchVert=findVer()
      if(matchHori==0 && matchVert==0)
      {
        dropped.swap(droppedOn);
      }
      if(matchHori==true || matchVert==true)
      {
        clearInterval(auxNewCandies);
        clearInterval(deleteC);
        deleteC=setInterval(function(){deleteMatchs()},100)
      }
    },
  });
}

//NOTE: Intercambio de dulces
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

//NOTE: Crear nuevos dulces
function nuevosdulces()
{
  $(".candy").draggable({disabled: true});
  //alert("pase")
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
    arrayCol[j-1]=$(".col-"+j).children().length;
  }
  if(bnewd==false)
  {
    for(var j=0;j<7;j++)
    {
      arrayAux[j]=(7-arrayCol[j]);
    }
    auxCount=Math.max.apply(null,arrayAux);
    count=auxCount;
  }
  if(auxCount!=0)
  {
    if(bnewd==true)
    {
      for(var j=1;j<8;j++)
      {
        if(count>(auxCount-arrayAux[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(arrayAux[j-1])+")").remove("img")
        }
      }
    }
    if(bnewd==false)
    {
      bnewd=true;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(arrayAux[k-1]-1);j++)
        {
          $(".col-"+k).prepend("<img src='' class='candy' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(count>(auxCount-arrayAux[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='candy'/>")
      }
    }
  }
  if(count==1)
  {
    clearInterval(auxNewCandies);
    deleteC=setInterval(function(){deleteMatchs()},80)
  }
  count=count-1;
}

//NOTE: Buscar coincidencias en forma horizontal
function findHor()
{
  var matchedHor=false;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var element1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var element2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var element3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")


      if ((element2!=null) && (element3!=null)) {

        if((element1==element2) && (element2==element3) && (element1!=null))
        {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","candy activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","candy activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","candy activo")
          //console.log("Hay coincidencias");
          matchedHor=true;
        }
      }

    }
  }
  return matchedHor;
}

//NOTE: Buscar coincidencias en forma vertical
function findVer()
{
  var matchedVer=false;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var element1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var element2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var element3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")

      if ((element1!=null) && (element2!=null) && (element3!=null)) {
        if((element1==element2) && (element2==element3) )
        {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","candy activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","candy activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","candy activo")
          matchedVer=true;
          //console.log("Hay coincidencias");
        }
      }


    }
  }
  return matchedVer;
}

function getNameCandy(){

  var candyRandom = Math.round(Math.random()*4);
  //var candyRandom = 1; //Para pruebas
  while (candyRandom == 0) {
    candyRandom = Math.round(Math.random()*4)
  }
  return candyRandom;
}

// NOTE: Función para terminar el juego
function endGame(){
  // NOTE: Se oculta el tablero de juego y el tiempo, adicional se agranda al 100% el ancho del panel de puntos
  $(".time").hide(1000,"swing");
  $(".panel-tablero").hide(1000,"swing", function(){
    $(".panel-score").animate({width:'100%'},1500);
  });

  // NOTE: Se crea nuevo div para indicar que se acabó el Juego
  var rowEnd = $("<div class='main-container'><p class = 'score'>End Game!</p></div>")
  var gameName = $(".main-titulo")
  rowEnd.appendTo(gameName);
}
