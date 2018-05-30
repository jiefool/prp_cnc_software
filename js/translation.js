var globalLanguage = "english";

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
    console.log(key+":"+value)
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
