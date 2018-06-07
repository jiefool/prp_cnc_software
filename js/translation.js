var globalLanguage = "english";
var translateData;

$(window).load(function(){
  initLanguage();
})

function updateLanguage(translation){
  $.get( "translations/"+translation+".json").done(function(data) {
    translateData = JSON.parse(data)
    translateText(translateData)
  });
}

function translateText(data){
  $.each( data, function( key, value ) {
    $("."+key).html(value)
  });

  // console.log(data)
  // $("#laser-operations").html(data["laser_operations"])
  // $("#milling-operations").html(data["milling_operations"])
}


function setLanguage(language){
  globalLanguage = language;
  // Cookies.set("language", language);
  // console.log(language)
  if (language == "bisaya"){
    $("#laser-cut-material").css("height", "65px")
    $("#laser-prepare-file").css("height", "65px")
    $("#laser-import-svg").css("height", "65px")
    $("#laser-clear-canvas").css("height", "65px")
    $("#generate-gcode-btn").css("height", "65px")
    $("#clear-settings-btn").css("height", "65px")
    $(".laser-file-action-step").css("padding", "20px 10px")
    $("#import-gcode-btn").css("height", "65px")
  }else{
    $("#laser-cut-material").css("height", "40px")
    $("#laser-prepare-file").css("height", "40px")
    $("#laser-import-svg").css("height", "40px")
    $("#laser-clear-canvas").css("height", "40px")
    $("#generate-gcode-btn").css("height", "40px")
    $("#clear-settings-btn").css("height", "40px")
    $(".laser-file-action-step").css("padding", "0px 10px")
    $("#import-gcode-btn").css("height", "40px")
  }
  initLanguage()
}

function initLanguage(){
  // var translation = Cookies.get("language")
  // console.log(translation)
  // if (translation == undefined){
  //   globalLanguage = "english"
  //   updateLanguage(globalLanguage)
  // } else{
  //   updateLanguage(globalLanguage)
  // }
  updateLanguage(globalLanguage)
}
