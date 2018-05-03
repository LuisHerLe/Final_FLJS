$(document).ready(function(){

  var start = false;
   $(".timer").html("02:00");
  // NOTE: Punto 1: Animación del título Match Game #DCFF0E
  setInterval(function(){
    $(".main-titulo").stop().animate({color:'white'},1000);
    $(".main-titulo").animate({color:'#DCFF0E'},1000);
  },1800)

  // NOTE: Punto 2: Se generan las imágenes de forma aleatoria
  //setInterval(getRowCandies(),1000);

})

var rbh=0;
var rbv=0;
var bnewd=0;
var lencol=["","","","","","",""];
var lenres=["","","","","","",""];
var maximo=0;
var arrayCandies=0;

var intervalo=0;  //variable de tiempo para funcion de desplazamiento
var eliminar=0;   //variable de tiempo para eliminar dulces
var newdulces=0;  //variable de tiempo para nuevos dulces
var tiempo=0;     //variable de tiempo para temporizador

var i=0;
var contador=0;  //contador total
var conc1=0;    //contador columna1

var initialPos;
var espera=0;
var score=0;
var mov=0;

var min=2;
var seg=0;

    var counter = 0;
    var timeLeft = 120; //Está en segundos


$(".btn-reinicio").click(function(){

  var contButton = $(".btn-reinicio").html();
  start = true;
  if (contButton == "Iniciar") {
    $(".btn-reinicio").html("Reiniciar");

    if (start) {
      // NOTE: Se llama inicia el temporizador
	  setup(start)
    }
    // NOTE: Punto 7: Se habilita el movimiento de las fichas
    // NOTE: Acá va la lógica
  }else {
    location.reload();
  }


//inicio nextu
  i=0;
  score=0;
  mov=0;
  $(".panel-score").css("width","25%");

  clearInterval(intervalo);
  clearInterval(eliminar);
  clearInterval(newdulces);
  clearInterval(tiempo);
  min=2;  //2
  seg=0;  //0
  borrartotal()
  intervalo=setInterval(function(){desplazamiento()},600)

  //fin nextu
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

	    //Convertir a minutos + segundos
    function convertMinutes(s){
      var min = floor (s / 60);
      var sec = floor (s % 60);
      var time = nf(min,2) + ":" + nf(sec,2);
	  //var time = "02:00"
      if (min == 0 && sec == 0) {
        //NOTE: Punto 4: Se termina el juego
        endGame();
      }
      return time;

    }
  }

  // NOTE: Función para terminar el juego
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

//----------Funcion de borrado--------------------------------------------------
function borrartotal()
{
  for(var i=1;i<8;i++)
  {
    $(".col-"+i).children("img").detach();
  }
}
//---------------Funcion inicial para llenar el cuadro del juego----------------
function desplazamiento()
{
  i=i+1
  var numero=0;
  var imagen=0;

  $(".elemento").draggable({ disabled: true });
  if(i<8)
  {
    for(var l=1;l<8;l++)
    {
      if($(".col-"+l).children("img:nth-child("+i+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+l).prepend("<img src="+imagen+" class='elemento'/>")//.css("justify-content","flex-start")
      }
    }
  }
  if(i==8)
  {
    clearInterval(intervalo);   //desactivar funcion desplazamiento()
    eliminar=setInterval(function(){eliminarhorver()},150)  //activar funcion eliminarhorver
  }
}
//------------------------------------------------------------------------------
//---------------Funcion para eliminar mas de 3 dulces--------------------------
function eliminarhorver()
{
  arrayCandies=0;
  rbh=horizontal()  //funcion busqueda dulces horizontal
  rbv=vertical()    //funcion buscar dulces vertical

  for(var j=1;j<8;j++)
  {
      arrayCandies=arrayCandies+$(".col-"+j).children().length;
  }

  if(rbh==0 && rbv==0 && arrayCandies!=49)  //condicion si no encuentra 3 dulces o mas llamar a funcion para volver a completar el uego
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

  if(rbh==0 && rbv==0 && arrayCandies==49)
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
        espera=dropped.swap(droppedOn);
      }while(espera==0)
      rbh=horizontal()  //funcion busqueda dulces horizontal
      rbv=vertical()    //funcion buscar dulces vertical
      if(rbh==0 && rbv==0)
      {
        dropped.swap(droppedOn);
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
//------------------------------------------------------------------------------


//---------Funcion de nuevos dulces---------------------------------------------
function nuevosdulces()
{
  $(".elemento").draggable({ disabled: true });
  //alert("pase")
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      lencol[j-1]=$(".col-"+j).children().length;
  }
  if(bnewd==0)
  {
    for(var j=0;j<7;j++)
    {
      lenres[j]=(7-lencol[j]);
    }
    maximo=Math.max.apply(null,lenres);
    contador=maximo;
  }
  if(maximo!=0)
  {
    if(bnewd==1)
    {
      for(var j=1;j<8;j++)
      {
        if(contador>(maximo-lenres[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(lenres[j-1])+")").remove("img")
        }
      }
    }
    if(bnewd==0)
    {
      bnewd=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(lenres[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(contador>(maximo-lenres[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(contador==1)
  {
      clearInterval(newdulces);
      eliminar=setInterval(function(){eliminarhorver()},150)
  }
  contador=contador-1;
}
//------------------------------------------------------------------------------
//----------funcion de busqueda horizontal de dulces----------------------------
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
