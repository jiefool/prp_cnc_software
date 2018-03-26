$(window).load(function(){
  var translation = Cookies.get("language")
  if (translation == undefined){
    updateLanguage("english")
  } else{
    updateLanguage(translation)
  }

  $("#english-language").click(function(){
    Cookies.set("language", "english")
    updateLanguage("english")
    $(this).addClass("language-selected")
    $("#visayan-language").removeClass("language-selected")
  })

  $("#visayan-language").click(function(){
    Cookies.set("language", "bisaya")
    updateLanguage("bisaya")
    $(this).addClass("language-selected")
    $("#english-language").removeClass("language-selected")
  })
  
})

var translateData;
function updateLanguage(translation){
  $.get( "translations/"+translation+".json").done(function(data) {
    translateData = JSON.parse(data)
    translateText(translateData)
  });
}


function translateText(data){
  $("#laser-operations").html(data["laser_operations"])
  $("#milling-operations").html(data["milling_operations"])
}