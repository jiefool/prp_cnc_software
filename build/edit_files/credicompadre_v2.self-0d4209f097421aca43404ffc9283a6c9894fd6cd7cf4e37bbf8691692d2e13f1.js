$(document).ready(function(){
  // $("#credicompadre_lead_first_name").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_last_name").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_second_last_name").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_birthdate_1i").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_birthdate_2i").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_birthdate_3i").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_gender_f").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });

  // $("#credicompadre_lead_gender_m").change(function(){
  //   calculateCustomerRFC();
  //   calculateCustomerCURP();
  // });


  //credivalentin header font color on other page change
  var pathname = window.location.pathname
  if (pathname.length > 4){
    $(".transparent-header .navbar-brand").css({color: "#34a8ef"})
  }

  // if($('#email_temp').get(0) && $('#email_temp').val().length > 0){
  //   $('#credicompadre_lead_email').val($('#email_temp').val())
  // }

  $('#credicompadre_lead_email').blur(function(){
    validateEmail()
  })

  $("#credicompadre_monthly_salary").change(function(){
    if ($(this).val() < 4000){
      console.log("salary below")
      $("#formButton-open-salary").click()
    }
  })

  $(".formButton").hover(function(){
    if (window.location.href.indexOf('step=2') > -1){
      calculateCustomerRFC();
    }
  })

  $('select').mousedown(function(){
    if(this.options.length > 1 && this.options[0].value.length == 0  && this.value.length == 0){
      if(this.options[0].remove){
        this.options[0].remove()  
      } else {
        this.options[0].parentNode.removeChild(this.options[0])
      }
      this.value = this.options[0].value
      this.id && $('#'+this.id).focus();
      setCustomValidation($(this).get(0), '');
    }
  })

  $("#credicompadre_lead_born_state").on('change focus',function(){
    if ($(this).val() !=''){
      // calculateCustomerCURP();
      setCustomValidation($(this).get(0), '');
    }
  });

  $(".gender").change(function() {
    $(".gender").prop('checked', false);
    $(this).prop('checked', true);
    $(".gender-checkbox").css("border", "")
    $(".gender-prompt").hide();
    var gender_field_id = $(this).prop('id')
    if (gender_field_id == 'lead_gender_m') {
      $("#lead_gender_f").removeAttr('required')
      $("#lead_gender_m").attr('required', 'required')
      $("#gender-final").val('H')
    }else{
      $("#lead_gender_m").removeAttr('required')
      $("#lead_gender_f").attr('required', 'required')
      $("#gender-final").val('M')
    }
    // calculateCustomerCURP();
  });
  
  //if backed from step 2
  if($("#gender-final").val() == 'H'){
    $("#lead_gender_f").prop("checked", false)
    $("#lead_gender_m").prop("checked", true)
    $("#lead_gender_f").removeAttr("required")
  }else{
    $("#lead_gender_m").prop("checked", false)
    $("#lead_gender_f").prop("checked", true)
    $("#lead_gender_m").removeAttr("required")
  }

  $("#lead_city").change(function(){
    if($(this).val()!=''){
      setCustomValidation($(this).get(0), '');
    }
  })

  $("#postal_code").mask("00000")
  $("#lead_income_verifiable_monthly_income").mask("00000")
  //$("#credicompadre_lead_first_name").mask("AAAAAAAAAAAAAAAAAAAAAAAAAAA", {'translation': {A: {pattern: /[a-zA-Z\u00C0-\u017F\s]/}}})
  //$("#credicompadre_lead_last_name").mask("AAAAAAAAAAAAAAAAAAAAAAAAAAA", {'translation': {A: {pattern: /[a-zA-Z\u00C0-\u017F\s]/}}})
  //$("#credicompadre_lead_second_last_name").mask("AAAAAAAAAAAAAAAAAAAAAAAAAAA", {'translation': {A: {pattern: /[a-zA-Z\u00C0-\u017F\s]/}}})
  $("#credicompadre_lead_customer_rfc").mask("AAAAAAAAAAAAA")
  $("#credicompadre_lead_personal_id").mask("AAAAAAAAAAAAAAAAAA")
  //$("#credicomapdre_lead_street_name").mask("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", {'translation': {A: {pattern: /[a-zA-Z\u00C0-\u017F\s]/}}})
  $("#credicomapdre_lead_interior_house").mask("00000")
  $("#credicompadre_monthly_salary").mask("000000000")
  $(".number-field").mask("0000000000")
  $('#credicompadre_lead_clave_interbancaria').mask("000000000000000000")


  $("select").change(function(){
    if($(this).val()!=''){
      setCustomValidation($(this).get(0), '');
      scrollFalse();
    }
  })



  $(".masked-field").on('keydown', function(event){
    var value = event.key
    var pattern = '[a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_ \s]'
    var regex = new RegExp(pattern)
    isTrue = regex.test(value)

    if(!isTrue && event){
      if(event.preventDefault) {
        event.preventDefault()        
      } else {
        event.returnValue =false
      }
      return
    }
  });



  
  $("#credicompadre_lead_clave_interbancaria").on('keyup paste', function(e){
    e = e || window.event;
    limitCharacter($(this), e, 18);
    validateClabe();
  })




  if ($("#lead_employment_status").val() == '1'){
    showCompanyNameField()
  }

  $("#lead_employment_status").on('change focus', function(){
    if ($(this).val() == '1' || $(this).val() == '13'){
      setCustomValidation($(this).get(0), '');
      showCompanyNameField()
    }else{
      hideCompanyNameField()
    }
  })


  //check if state and init city
  if ($("#lead_state_select").val()!= undefined){ 
    initCitySelect($("#lead_state_select").val(), '')
  }
  //enable/disable city select if state changed
  $("#lead_state_select").focus(function(){
    //check for state value and enable city select
    initCitySelect($(this).val(), '')
  })



  //check if city got value
  if ($("#locality").val()!= undefined){ 
    initColoniaSelect($("#locality").val(), '')
  }
  $("#locality").on('focus click', function(e){
  //$("#locality").click(function(e){
    //console.log(e)
    //check for state value and enable city select
      initColoniaSelect($(this).val(), '')
  })

  if ($("#mexico_colony").val()!= undefined){ 
    initColoniaSelect($("#mexico_city").val(), '')
  }


  $("#postal_code").on('keyup paste change', function(){
    postalCodeRoutine();
  })

  //thirdLeadForm
  $(".thirdLeadForm").submit(function(e){
    var pc_vl = $("#postal_code").val()
    if(pc_vl.length == 5){
      setCustomValidation($("#postal_code").get(0), "")
      $("#overlay-open-loading").click()
      return true;
    }else{
      setCustomValidation($("#postal_code").get(0), 'Codigo postal invalido');
      scrollField($("#postal_code"))
      e.preventDefault(e);
    }
  })
})

function postalCodeRoutine(){
  var pc_vl = $("#postal_code").val()
  if(pc_vl.length == 5){
    setCustomValidation($("#postal_code").get(0), "")
    var populated = populateDropdowns();
  } else {
    setCustomValidation($("#postal_code").get(0), 'Codigo postal invalido')
    $('#postal_code').css("border", "1px solid #cccccc")
  }
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

function isIe9(){
  return isIE() && isIE() < 10
}

function setCustomValidation(element, text){
  if(isIe9()){
    if(text.length == 0){
      if(element.type=="checkbox"){
          $("#"+element.id).parents('div[class^=col]').first().find('div.ie-error').remove();
          $("#"+element.id).parents('div[class^=col]').first().find('span:not(.checkboxTxt)').removeAttr('style')
        } else {
          $("#"+element.id).siblings('div.ie-error').remove();
          $("#"+element.id).removeAttr('style')
        }
      return true
    } else {
      thisElement = $("#"+element.id);
      //  consoles(response,element.id)
      if(element.type=="checkbox"){
        if(thisElement.parents('div[class^=col]').first().find('div.ie-error').length < 1) {
          div = $("<div>", {"class": "ie-error"})
          div.html(response.message)
          thisElement.parents('div[class^=col]').first().find('div.checkbox').first().append(div);
        } else {
          $("#"+element.id).parents('div[class^=col]').first().find('div.ie-error').html(text)
        }
        if(text.length == 0) $("#"+element.id).parents('div[class^=col]').first().find('span:not(.checkboxTxt)').css('border','1px solid red')
        return false
      }
      else {
        if(thisElement.hasClass('custom-error-form')){
          if(thisElement.parent().siblings('div.ie-error').length == 0) {
            div = $("<div>", {"class": "ie-error"})
            div.html(text)
            thisElement.parent().after(div);
          } else {
            $("#"+element.id).siblings('div.ie-error').html(text)
          }
        }
        else {
          if(thisElement.siblings('div.ie-error').length == 0) {
            div = $("<div>", {"class": "ie-error"})
            div.html(text)
            thisElement.after(div);
          } else {
            $("#"+element.id).siblings('div.ie-error').html(text)
          }
        }

        if(text.length == 0) element.style.border='1px solid red'
        return false
      }
    }
  } else {
    if(element){
      element.setCustomValidity(text);  
    }
    
  }
}


function populateDropdowns(){
  var pc_val = $('#postal_code').val()

  if (!pc_val || pc_val.length ==0){
    return
  }

  var query_url = "/ccd/v2/mx-state-city-locality/"+pc_val
  if (rails_env == 'production'){
    query_url = "/v2/mx-state-city-locality/"+pc_val
  }

  $.ajax({
    url: query_url,
    dataType: 'json'
  }).done(function(res){
    if (res && res != '' && res["state"]){ 
      $("#lead_state_select").val(res["state"])
      
      //populate cities
      if (res["cities"].length > 0){
        var city_options = "<option value =''>Elija Ciudad</option>"
        $.each(res["cities"], function(key, city) {
          var init_select = res["selected_city"] == city ? 'selected' : ''
          city_options += '<option value="'+city+'" '+init_select+'>'+city+'</option>'
        });
        $("#locality option").remove()
        $("#locality").append(city_options)
        enableSelect($("#locality"))
        setCustomValidation($('#locality').get(0), '');
      }


      //populate colonia
      if (res["colonias"].length > 0){
        var colony_options = "<option value =''>Elija Colonia</option>"
        if (res["colonias"].length == 1){
          colony_options += '<option value="'+res["colonias"][0]+'" selected>'+res["colonias"][0]+'</option>'
        }else{
          $.each(res["colonias"], function(key, colony) {
              var init_select = $("#mexico_colony").val() == colony ? 'selected' : ''
              colony_options += '<option value="'+colony+'" '+init_select+'>'+colony+'</option>'
          });
        }
        $("#credicomapdre_lead_colony option").remove()
        $("#credicomapdre_lead_colony").append(colony_options)
        enableSelect($("#credicomapdre_lead_colony"))
      }

      $('#postal_code').css("border", "1px solid green")
      setCustomValidation($('#postal_code').get(0), '');
      setCustomValidation($('#credicomapdre_lead_colony').get(0), '');
      setCustomValidation($('#lead_state_select').get(0), '');
    
    }else{
      $("#lead_state_select").val('')
      setCustomValidation($('#postal_code').get(0), 'Código postal no válido');
      $('#postal_code').css("border", "1px solid red")
    }

    // setTimeout(function(){
    //   getPostalData(pc_val)
    // },500);
    
  }).error(function(){
      $("#lead_state_select").val('')
      setCustomValidation($('#postal_code').get(0), 'Código postal no válido');
      $('#postal_code').css("border", "1px solid red")
  });
}


function hideCompanyNameField(){
  $("#employment-status-wrapper").removeClass("col-md-4")
  $("#monthly-salary-wrapper").removeClass("col-md-4")
  $("#employment-status-wrapper").addClass("col-md-6")
  $("#monthly-salary-wrapper").addClass("col-md-6")
  $("#job-name-wrapper").val('')
  $("#job-name-wrapper").hide()
  $("#credicompadre_company_name").removeAttr("required")
}

function isPostCodeValid(){
  var state_value = $("#lead_state_select").val()
  var postcode_value = $("#postal_code").val()

  if (state_value != ''){
    if (mx_state_postcode[postcode_value.substr(0,1)] == state_value){
      return true;
    }else if(mx_state_postcode[postcode_value.substr(0,2)] == state_value){
      return true;
    }else{
      return false
    }
  }else{
    return true;
  }
}

function showCompanyNameField(){
  $("#employment-status-wrapper").removeClass("col-md-6")
  $("#monthly-salary-wrapper").removeClass("col-md-6")
  $("#employment-status-wrapper").addClass("col-md-4")
  $("#monthly-salary-wrapper").addClass("col-md-4")
  $("#job-name-wrapper").show()
  $("#credicompadre_company_name").attr("required", "required")
}

function calculateCustomerCURP() {
  var name = $("#credicompadre_lead_first_name").val()
  var pLname = $("#credicompadre_lead_last_name").val()
  var mLname = $("#credicompadre_lead_second_last_name").val()
  var bDate = $("#credicompadre_lead_birthdate_1i").val() +'-'+ $("#credicompadre_lead_birthdate_2i").val() +'-'+ $("#credicompadre_lead_birthdate_3i").val()
  var gender = $("#gender-final").val();
  var bState = $("#credicompadre_lead_born_state").val()
  var result = new CurpCalculation(name, pLname, mLname, bDate, gender, bState)
  $("#credicompadre_lead_personal_id").val(result.curp)
  setCustomValidation($("#credicompadre_lead_personal_id").get(0), '');
}

function calculateCustomerRFC(){
  var name = $("#credicompadre_lead_first_name").val()
  var pLname = $("#credicompadre_lead_last_name").val()
  var mLname = $("#credicompadre_lead_second_last_name").val()
  var v2_bDate = $("#credicompadre_lead_birthdate_3i").val() +'-'+ $("#credicompadre_lead_birthdate_2i").val() +'-'+ $("#credicompadre_lead_birthdate_1i").val()
  var rfc = CalcularRFC(name, pLname, mLname, v2_bDate)
  $("#credicompadre_lead_customer_rfc").val(rfc)
  setCustomValidation($("#credicompadre_lead_customer_rfc").get(0), '');
}

var clabe_valid = false;
function validateClabe(){
  // ----------
  //temporarily remove the CLABE validation check
  return;
  // ----------------
  var clabe_value = $("#credicompadre_lead_clave_interbancaria").val().replace(/\s/g, '');
  var clabe_validate = clabe.validate(clabe_value);

  if ( clabe_validate.error == false && clabe_value.length == 18) {
    clabe_valid = true;
    clabeNoError();
  }else{
    clabe_valid = false;
    showClabeError();
  }
}


function showClabeError(){
  $("#credicompadre_lead_clave_interbancaria").css("border", "1px solid red");
  setCustomValidation($("#credicompadre_lead_clave_interbancaria").get(0), 'El formato no es correcto, por favor revíselo.');
  scrollField($("#credicompadre_lead_clave_interbancaria"));
  isScroll = true;
  if($('#credicompadre_lead_clave_interbancaria').val().length == 18){
    trackJs.addMetadata("UserLogic", "warning");
    trackJs.track("Logical warning: " + "Wrong bank: " + $("#credicompadre_lead_clave_interbancaria").val()); 
    trackJs.removeMetadata("userLogicWarning");
  }
}

function clabeNoError(){
  $("#credicompadre_lead_clave_interbancaria").css("border", "1px solid #cccccc");
  setCustomValidation($("#credicompadre_lead_clave_interbancaria").get(0), '');

}


function checkStateIfExpected(state){
  var expectedStates = [ "Ciudad de México",
                        "Aguascalientes",
                        "Baja California",
                        "Baja California Sur",
                        "Campeche",
                        "Chiapas",
                        "Chihuahua",
                        "Coahuila de Zaragoza",
                        "Colima",
                        "Durango",
                        "Guanajuato",
                        "Guerrero",
                        "Hidalgo",
                        "Jalisco",
                        "México",
                        "Michoacán de Ocampo",
                        "Morelos",
                        "Nayarit",
                        "Nuevo León",
                        "Oaxaca",
                        "Puebla",
                        "Querétaro",
                        "Quintana Roo",
                        "San Luis Potosí",
                        "Sinaloa",
                        "Sonora",
                        "Tabasco",
                        "Tamaulipas",
                        "Tlaxcala",
                        "Veracruz de Ignacio de la Llave",
                        "Yucatán",
                        "Zacatecas"
                      ]

  if ( $.inArray( state, expectedStates ) > -1 ){
    return true;
  }else{
    return false
  }
}

function addCitySelect(){
  $(".city-input").remove();
  $(".city-select").remove();
  $(".city-field").append('<select required="required" class="select city-select" name="credicompadre_lead[city]" id="lead_city" oninvalid="setCustomValidity(\'Este valor es requerido\');scrollField(this)"  oninput="setCustomValidity(\'\');scrollFalse()" title="Este valor es requerido"> <option value="">Elija ciudad</option> <option value="Azcapotzalco">Azcapotzalco</option><option value="Coyoacán">Coyoacán</option> <option value="Cuajimalpa de Morelos">Cuajimalpa de Morelos</option> <option value="Gustavo A. Madero">Gustavo A\. Madero</option> <option value="Iztacalco">Iztacalco</option> <option value="Iztapalapa">Iztapalapa</option> <option value="La Magdalena Contreras">La Magdalena Contreras</option> <option value="Milpa Alta">Milpa Alta</option> <option value="Álvaro Obregón">Álvaro Obregón</option> <option value="Tláhuac">Tláhuac</option> <option value="Tlalpan">Tlalpan</option> <option value="Xochimilco">Xochimilco</option> <option value="Benito Juárez">Benito Juárez</option> <option value="Cuauhtémoc">Cuauhtémoc</option> <option value="Miguel Hidalgo">Miguel Hidalgo</option> <option value="Venustiano Carranza">Venustiano Carranza</option> </select>');
    
}

function limitCharacter(element, event, char_num){
  arrow_key_codes = [37,38,39,40]
  if (!(arrow_key_codes.indexOf(event.keyCode) > -1)){
    if ($(element).val().length >= char_num){
      $(element).val($(element).val().slice(0, char_num))
    }
  }
}

function validate(curp) {
    return true;
    
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    var isValidated = curp.match(re);   
    if (isValidated == null) {
      return false;
    }else{
       return true;
    }
}; 

function validateNumber(){
  value = $('#lead_mobile_number').val();
  if(typeof value == "number" && value.length == 10){
    setCustomValidation($('#lead_mobile_number').get(0), '');
  } else {
    setCustomValidation($('#lead_mobile_number').get(0), 'El número de dígitos no es válido.');
  }
}

function checkMexicoState(){
  if($("#administrative_area_level_1").val() == 'CDMX' ||  $("#administrative_area_level_1").val() == 'cdmx' || $("#administrative_area_level_1").val() == 'Ciudad de México'){
    addCitySelect();
  }else{
    addCityTextInput();
  }
}

function addCityTextInput(){
  $(".city-select").remove();
  $(".city-input").remove();
  $(".city-field").append('<input id="locality" placeholder="Ciudad" class="input city-input" type="text" name="credicompadre_lead[city]" required oninvalid="setCustomValidity(\'Este valor es requerido\');scrollField(this)"  oninput="setCustomValidity(\'\');scrollFalse()" title="Este valor es requerido"/>');
}

function setMunicipalityState(){
  var postcode = $("#postal_code").val()
  var mx_state = mx_state_postcode[postcode.substr(0,1)] || mx_state_postcode[postcode.substr(0,2)]
  var mx_municipality = mx_municipality_postcode[postcode]

  console.log(postcode.substr(0,2))
  console.log(mx_state)
  $("#administrative_area_level_1").val(mx_state);
  checkMexicoState()
  $("#lead_state_select").val(mx_state);
  $("#locality").val(mx_municipality);
}


function getMxStateCities(stateValue, selectedCity){
  var query_url = "/ccd/v2/mx-state-cites/"+encodeURIComponent(stateValue)
  if (rails_env == 'production'){
    query_url = "/v2/mx-state-cites/"+encodeURIComponent(stateValue)
  }

  var option_text = "<option value =''>Elija Ciudad</option>"
  $.ajax({
    url: query_url,
    dataType: 'json'
  }).done(function(res){
    $.each(res, function(key, city) {
      var init_select = $("#mexico_city").val() == city ? 'selected' : ''
      option_text += '<option value="'+city+'" '+init_select+'>'+city+'</option>'
    });
    $("#locality option").remove()
    $("#locality").append(option_text)
  });
}

function getMxCityColonies(cityValue, selectedColonia){
    var query_url = "/ccd/v2/mx-city-colonies/"+encodeURIComponent(cityValue)
    if (rails_env == 'production'){
      query_url = "/v2/mx-city-colonies/"+encodeURIComponent(cityValue)
    }

    var option_text = "<option value =''>Elija Colonia</option>"
    $.ajax({
      url: query_url,
      dataType: 'json'
    }).done(function(res){
      $.each(res, function(key, colony) {
          var init_select = $("#mexico_colony").val() == colony ? 'selected' : ''
          option_text += '<option value="'+colony+'" '+init_select+'>'+colony+'</option>'
      });
      $("#credicomapdre_lead_colony option").remove()
      $("#credicomapdre_lead_colony").append(option_text)
    });
}

function getPostalData(postalValue){
    var query_url = "/ccd/v2/mx-postal-data/"+postalValue
    if (rails_env == 'production'){
      query_url = "/v2/mx-postal-data/"+postalValue
    }

    $.ajax({url: query_url, dataType: 'json'}).done(function(res){
      if (res != null){
        $("#locality").val(res['city'])
        // $("#credicomapdre_lead_colony").val(res['locality'])
        getNumberOfColonies($("#postal_code").val(), res['locality'])
      }
    });
}

function disableSelect(element){
  $(element).attr("disabled", "disabled")
  $(element).css("background-color", "#ddd")

  if (element.get(0).id == 'locality'){
     field_id = 'Ciudad'
  } 

  if (element.get(0).id == 'credicomapdre_lead_colony'){
    field_id = 'Colonia'
  }

  $('#'+element.get(0).id+' option').remove()
  $(element).append('<option value="">Elija '+field_id+'</option>')
}

function enableSelect(element){
  $(element).removeAttr("disabled")
  $(element).css("background-color", "#fff")
}

function initCitySelect(stateValue, selectedCity){
  if (stateValue == ''){
    disableSelect($("#locality"))
  }else{
    enableSelect($("#locality"))
    //get cities for selected state
    getMxStateCities(stateValue, selectedCity)
  }
  disableSelect($("#credicomapdre_lead_colony"))
}

function initColoniaSelect(cityValue, selectedColonia){
  if (cityValue == ''){
    disableSelect($("#credicomapdre_lead_colony"))
  }else{
    enableSelect($("#credicomapdre_lead_colony"))
    //get cities for selected state
    getMxCityColonies(cityValue, selectedColonia)
  }
}

function getNumberOfColonies(postalCode, colony){
  var query_url = "/ccd/v2/postal-colonies-count/"+encodeURIComponent(postalCode)
  if (rails_env == 'production'){
    query_url = "/v2/postal-colonies-count/"+encodeURIComponent(postalCode)
  }

  $.ajax({
    url: query_url,
    dataType: 'json'
  }).done(function(res){
    if(res == 1){
      getPostalColonies($("#postal_code").val(), colony)
    }else{
      getPostalColonies($("#postal_code").val(), '')
    }
  });
}

function getPostalColonies(postalCode, preColony){
  var query_url = "/ccd/v2/postal-colonies/"+encodeURIComponent(postalCode)
  if (rails_env == 'production'){
    query_url = "/v2/postal-colonies/"+encodeURIComponent(postalCode)
  }

  var option_text = "<option value =''>Elija Colonia</option>"
  $.ajax({
    url: query_url,
    dataType: 'json'
  }).done(function(res){
    $.each(res, function(key, colony) {
      var init_select = $("#mexico_colony").val() == colony ? 'selected' : ''
      option_text += '<option value="'+colony['locality']+'" '+init_select+'>'+colony['locality']+'</option>'
    });
    $("#credicomapdre_lead_colony option").remove()
    $("#credicomapdre_lead_colony").append(option_text)
    if (preColony != ''){
      $("#credicomapdre_lead_colony").val(preColony)
    }
  });
}

function updateSalary(){
  $("#credicompadre_monthly_salary").val("")
  $("#credicompadre_monthly_salary").focus()
  closeNav("salary-prompt");
}


function checkMaskedField(element){
  var value = element.value;
  var pattern = '^[a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ_ \s]+$'
  var regex = new RegExp(pattern)
  isTrue = regex.test(value)
  
  if(value.length > 0){
    if(!isTrue){
      setCustomValidation(element, 'No se pueden poner caracteres especiales en los nombres como puntos, comas. Reviselo');     
    } else {
      setCustomValidation(element, '');
    }
  } else {
    setCustomValidation(element, 'Este valor es requerido.'); 
  }
}

function validateEmail(){
  var emailVal = $('#credicompadre_lead_email').val()
  var validateEmailUrl = "/validate-email"

  $.ajax({
    url: validateEmailUrl,
    type: 'POST',
    data: {
      email: emailVal
    }
  }).done(function(res){
    if(res.status == 'invalid'){
      $("#email-err").html("Ese email no es válido, introduzca otro diferente y válido.")
      $("#credicompadre_lead_email").get(0).setCustomValidity("Ese email no es válido, introduzca otro diferente y válido.")
    }else if (res.status == 'hint'){
      $("#email-err").html("¿Quisiste decir? <a id='email-hint' href='javascript: replaceEmail()'>"+res.replacement+'</a>')
      $("#credicompadre_lead_email").get(0).setCustomValidity("")
    }else{
      $("#email-err").html('')
      $("#credicompadre_lead_email").get(0).setCustomValidity("")
    }
  });
}


function replaceEmail(){
  $('#credicompadre_lead_email').val($("#email-hint").html())
  $('#email-err').html('');
}

