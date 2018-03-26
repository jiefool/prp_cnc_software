// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//



















$(document).ready(function(){

  // if (window.location.href.indexOf("step=3") > -1){
  //   $(".thirdLeadForm").submit(function(){  
  //     console.log("submit")
  //     $("#overlay-open-loading").click()
  //   })
  // }

  $('#my_popup').popup();

  if ($("#api-error").val() == "1" ){
    $(".my_popup_open").click()
  }

  $("#lead_confirm_email").blur(function(){
    checkEmail();
  })

  $("#terms_conditions").change(function() {
    if($("#terms_conditions").prop('checked') == true){
      $(".terms-checkbox").css("border", "")
    }
  })

  $('input[type="email"]').focusout(function(){
    if(this.value.length > 0){
      trackJs.configure({ userId: this.value})
    }
  })

  // $('.date').datepicker({
  //   startDate: '0d',
  //   autoclose: true,
  //   beforeShowDay: function(date){
  //     currentDate = new Date()
  //     calDate = Date.parse(date)
  //     if(calDate >= currentDate){
  //       return {classes : 'active'}
  //     }else{
  //       return {classes : 'disabled'};
  //     }
  //   }
  // });

  $(window).on("scroll", function() {
    if($(window).scrollTop() > 100) {
        $(".transparent-header").addClass("active");
    } else {
        //remove the background property so it comes transparent again (defined in your css)
       $(".transparent-header").removeClass("active");
    }
  });

})

$(window).on('load',function(e){
  $(".geocomplete-mx").geocomplete({
    details: "form",
    detailsAttribute: "id",
    types: ["geocode", "establishment"],
    country: 'mx',
  });
})

var isScrolled = false;
function scrollField(element){
  if (!isScrolled){
    $('html, body').animate({
      scrollTop: $(element).offset().top - 120
    }, 1000);
  }
  isScrolled = true;
}

function scrollFalse(){
  isScrolled = false;
}

var email_validated = false;
function checkEmail(){
  var email = $("#lead_email").val();
  var repeat_email = $("#lead_confirm_email").val();
  if(email == repeat_email){
    email_validated = true
    $(".email-check-msg").html("");
  }else{
    email_validated = false
    $(".email-check-msg").html(" La confirmación del email no coincide.");
  }
}

function checkboxInvalid(element){
  if(element.id.indexOf('gender') && ($("#lead_gender_m").prop('checked') == false && $("#lead_gender_f").prop('checked') == false)){
    $(".gender-checkbox").css("border", "3px red solid")
    $(".gender-prompt").show();
  }

  if(element.id == 'terms_conditions' && $("#terms_conditions").prop('checked') == false){
    $(".terms-checkbox").css("border", "3px red solid")
  } 
}

function InvalidMsg(textbox) {
  var response = true;
  if(textbox.validity.patternMismatch){
    textbox.setCustomValidity('El formato no es correcto, por favor revíselo.');
    response = false;
  }else if(textbox.validity.valueMissing){
    textbox.setCustomValidity('Este valor es requerido.');
    response = false;
  }else if(textbox.validity.tooShort){
    textbox.setCustomValidity('El número de dígitos no es válido.');
    response = false;
  }else if(textbox.validity.typeMismatch){
    textbox.setCustomValidity('Por favor incluya un "@"" en la dirección de correo electrónico.');
    response = false;
  }else if(textbox.validity.rangeOverflow){
    textbox.setCustomValidity('El valor debe coincidir con el número de dígitos.');
    response = false;
  }else if(textbox.validity.rangeUnderflow){
    textbox.setCustomValidity('El valor debe coincidir con el número de dígitos.');
    response = false;
  }else if(checkSucceedingSpaces(textbox)){
    textbox.setCustomValidity('No se permiten espacios sucesivos.');
    response = false;
  }else{
    textbox.setCustomValidity('');
  }
  return response;
}

function checkSucceedingSpaces(element){
  if ($(element).val().indexOf('  ') >= 0){
    return true
  }else{
    return false
  }
}

function characterBelowDigit(element, char_limit){
  if ($(element).val().length < char_limit){
    $(element).get(0).setCustomValidity('Número no válido, por favor reviselo.')
  }else{
    $(element).get(0).setCustomValidity('')
  }
}

function checkRepeatEmail(element){
  var remail = $(element).val()
  var email = $("#credicompadre_lead_email").val()
  if (remail == email){
    $(element).get(0).setCustomValidity('')
  }else{
    $(element).get(0).setCustomValidity('El email no coincide.')
  }
}

function openNav(prompt) {
  console.log(prompt)
  if (prompt == "loading-prompt"){
    document.getElementById("loading-prompt").style.width = "100%";
  }else if(prompt == "salary-prompt"){
    document.getElementById("salary-prompt").style.width = "100%";
  }else if(prompt == "bancaria-prompt"){
    document.getElementById("bancaria-prompt").style.width = "100%";
  }
}

function setfocus(element){
  element.value = ''
  element.focus()
}

function closeNav(prompt) {
  if (prompt == "loading-prompt"){
    document.getElementById("loading-prompt").style.width = "0%";
  }else if(prompt == "salary-prompt"){
    document.getElementById("salary-prompt").style.width = "0%";
  }else if(prompt == "bancaria-prompt"){
    document.getElementById("bancaria-prompt").style.width = "0%";
    if($('#credicompi_lead_cbu').get(0)){
      setTimeout(setfocus(document.getElementById('credicompi_lead_cbu')), 2000);
    }
  }
}



