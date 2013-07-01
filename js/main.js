$(document).ready(function () {

  initFacebook()
  loadData = function (cat) {
    cat = cat || "cat1"  
    store.currentCategory = cat
    if (parseInt(cat[cat.length-1])<5){
      store.currentSource = "NTVMSNBC.com"
      $("#source-icon").html("<img src='http://www.ntvmsnbc.com/favicon.ico' height='20px' > NTVMSNBC")
    } else {
      store.currentSource = "Milliyet.com.tr"
      $("#source-icon").html("<img src='http://www.milliyet.com.tr/favicon.ico'> Milliyet")
    }    
    $("#cat").html($("#"+cat).text())    
    $("#wait").show()    
    $.ajax({
    url : "/feed?category="+cat,
    success : function(data) {
      $("#wait").hide()
      store.headers = data
      store.numberOfHeaders = JSON.parse(data).length
      store.solved = JSON.stringify(new Array())
      store.status = "ready"
      startGame()
      }
    })  
  }

  startGame = function () {    
    $("#board").html("")
    $("#used").html("")
    $("#lives").html("+5")
    $("#monitor").fadeOut()
    $("#catDialog").slideUp()
    store.lives = 5
    store.usedLetters = ""
    store.currentPuzzle = Math.floor(Math.random()*(store.numberOfHeaders))
    store.currentHeader = trUpperCase(JSON.parse(store.headers)[store.currentPuzzle].title)
    store.currentLink = JSON.parse(store.headers)[store.currentPuzzle].link
    store.currentSummary = JSON.parse(store.headers)[store.currentPuzzle].summary
    store.status = "started"    
    
    // set the board
    for (var i=0; i <store.currentHeader.length; i++){
      ch = store.currentHeader[i]
      if ( /[a-z]/.test(ch) || /[A-Z]/.test(ch) || /[İÇÖŞÜĞıçöşğü]/.test(ch)) {
        $("#board").append("<span class='letter-closed' id='l"+i+"'>?</span>")
      } else {
        $("#board").append("<span class='letter-opened' id='l"+i+"'>"+ch+"</span>")
      }
    }
    
    //start timer
    clearInterval(store.timer)
    store.timeLeft = 60000;
    store.timer = setInterval(updateTimer,100)
     
  }
  
  keyPressed = function (event){  
    ch = trUpperCase(String.fromCharCode(event.charCode))[0]
    
    if (store.status == "started" && store.lives >= 1) {
      if (store.usedLetters.indexOf(ch) == -1) {      
        if (store.currentHeader.indexOf(ch) != -1) {
          has = true
          for (var i=0;i<store.currentHeader.length;i++){
            if (ch == trUpperCase(store.currentHeader[i])) {
              $("#l"+i).html(store.currentHeader[i])
              $("#l"+i).removeClass("letter-closed")
              $("#l"+i).addClass("letter-opened")
            }
          }
                     
        } else {
          has = false
          store.lives--
          $("#lives").html("+"+store.lives)          
        }
        
        store.usedLetters = store.usedLetters+ch
        l = store.usedLetters.length
        color = has?"#4e9a06":"#a40000" 
        $("#used").append("<span class='usedLetter' id='ul"+l+"' style='color:"+color+"'>"+ch+"</span>")
        $("#ul"+l).hide()
        $("#ul"+l).fadeIn()
        if ($(".letter-closed").length == 0){
          endGame(true)        
        }        
        if (store.lives == 0){
          endGame(false)
        }               
      } else {
        $("#ul"+store.usedLetters.indexOf(ch)+1)
        .animate({fontSize:"30px"},30)
        .animate({fontSize:"25px"},100);
      }           
    }    
  }
  
  updateTimer = function () {  
    store.timeLeft -= 100

    if (parseInt(store.timeLeft)<=0){
      endGame(false)   
    }

    timeLeft = parseInt(store.timeLeft)    
    //redraw clock
    canvas = document.getElementById('clock')
    ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,50,50)
    colorPos = parseFloat(timeLeft/60000)
    red = (colorPos>0.5)?(255-parseInt(colorPos*255))*2:255;
    green = (colorPos>0.5)?255:parseInt(colorPos*255)*2;
    //console.log("red:"+red+" green:"+green+" pos:"+parseInt(colorPos*100))
    ctx.fillStyle = "rgb("+red+","+green+",0)"
    ctx.beginPath()
    ctx.moveTo(20,20)
    ctx.arc(
      20,
      20,
      20,
      Math.PI*timeLeft/30000 - (0.5*Math.PI),
      Math.PI*2 - (0.5*Math.PI),
      true
    )
    ctx.fill()    
  
  }
  
  endGame = function(result) {
    
    clearInterval(store.timer)  
    store.status = "ready"
    store.timeLeft = 60000;
    
    //jquery takla atsin!
    $(".letter-closed").each(function(i,elem){
      $("#"+elem.id).html(store.currentHeader[elem.id.substring(1,elem.id.length)])
      $("#"+elem.id).removeClass("letter-closed")
      $("#"+elem.id).addClass("letter-failed")
    })

    m = $("#monitor")  
    m.html(result?"<h3>Tebrikler!</h3>":"<h3>Bilemedin!</h3>")
    m.append("Başlık : <b><a href='"+store.currentLink+"' target=\"_blank\">"+store.currentHeader+"</a></b><br>")
    m.append("Kaynak : "+store.currentSource)
    m.append("<br>")
    m.append("<p>"+store.currentSummary+"</p>")
    m.append("<button class='.btn3' onClick='startGame()'>Yeni Oyun Başlat</button>")       
    m.fadeIn()
  }
  
  if (window.localStorage){
    store = window.localStorage 
  } else {
    storage = new Object()
  }
  $("#btn1").bind("click",function(){
    $("#catDialog").slideToggle()
  })
  $(".btn3").bind("click",startGame) 
  
   
  $("body").bind("keypress",keyPressed)
  document.onkeyup = keyPressed
  $(".category").bind("click",function(e){
    loadData(e.currentTarget.id)    
  }) 
  $(".close").bind("click",function(e){
    $(e.currentTarget.parentNode).slideUp()
  })
  $("#monitor").hide()
  loadData()

  
  
});
	
  
