


function executeParser(){
	executeSetcustomvalidity();
	parseSelect();
	parseText();
}

function executeSetcustomvalidity(){
	(function ($){
		$.fn.setCustomValidity = function(text){
			console.log(text);
			console.log(this)
			return false;
		}
	})(jQuery);
/*
	(function ($){
		$.fn.validity = function(){
			console.log('validity');
			return false;
		}
	})(jQuery);
	*/
}

function parseSelect(){
	$("select[oninvalid]").each(function(){
		if( $(this).attr('oninvalid')){
		 	 $(this).attr("oninvalid",($(this).attr('oninvalid').replace("InvalidMsg", "validInputCheck"))).attr('onFormSubmit', $(this).attr('oninvalid'))
		 	$(this).removeAttr('oninvalid')
		}
	});

	$("select[oninput]").each(function(){
		if( $(this).attr('oninput') ){
			$(this).attr("oninput",($(this).attr('oninput').replace("InvalidMsg", "validInputCheck"))) 
		}
	});

	$("select[required]").each(function(){
		$(this).removeAttr('required')
		$(this).attr('isneeded', 'true')
	});	
}

function parseText(){
	$("input[oninvalid]").each(function(){
		if( $(this).attr('oninvalid')){
		 	 $(this).attr("oninvalid",($(this).attr('oninvalid').replace("InvalidMsg", "validInputCheck"))).attr('onFormSubmit', $(this).attr('oninvalid'))
		 	$(this).removeAttr('oninvalid')
		}
	});

	$("input[oninput]").each(function(){
		if( $(this).attr('oninput') ){
			$(this).attr("oninput",($(this).attr('oninput').replace("InvalidMsg", "validInputCheck"))) 
		}
	});

	$("input[required]").each(function(){
		$(this).removeAttr('required')
		$(this).attr('isneeded', 'true')
	});	
}

function consoles(value){
//	console.log(response.message)
	console.log(value)
}


function validInputCheck(element) {
  	var response = inputCheck(element)
  	status = false
  	if(response && !response.status){
  		thisElement = $("#"+element.id);
  	//	consoles(response,element.id)
  		if(element.type=="checkbox"){
  			if(thisElement.parents('div[class^=col]').first().find('div.ie-error').length < 1) {
		  		div = $("<div>", {"class": "ie-error"})
		  		div.html(response.message)
		  		thisElement.parents('div[class^=col]').first().find('div.checkbox').first().append(div);
	  		} else {
	  			$("#"+element.id).parents('div[class^=col]').first().find('div.ie-error').html(response.message)
	  		}
	  		if(!response.status) $("#"+element.id).parents('div[class^=col]').first().find('span:not(.checkboxTxt)').css('border','1px solid red')
  			return false
  		}
  		else {
  			if(thisElement.hasClass('custom-error-form')){
  				if(thisElement.parent().siblings('div.ie-error').length == 0) {
			  		div = $("<div>", {"class": "ie-error"})
			  		div.html(response.message)
			  		thisElement.parent().after(div);
		  		} else {
		  			$("#"+element.id).siblings('div.ie-error').html(response.message)
		  		}
  			}
  			else {
		  		if(thisElement.siblings('div.ie-error').length == 0) {
			  		div = $("<div>", {"class": "ie-error"})
			  		div.html(response.message)
			  		thisElement.after(div);
		  		} else {
		  			$("#"+element.id).siblings('div.ie-error').html(response.message)
		  		}
		  	}

	  		if(!response.status) element.style.border='1px solid red'
  			return false
  		}

  		
  	} else {
  		if(element.type=="checkbox"){
	  		$("#"+element.id).parents('div[class^=col]').first().find('div.ie-error').remove();
	  		$("#"+element.id).parents('div[class^=col]').first().find('span:not(.checkboxTxt)').removeAttr('style')
  		} else {
	  		$("#"+element.id).siblings('div.ie-error').remove();
	  		$("#"+element.id).removeAttr('style')
  		}
		return true
  	}
}



function checkSucceedingSpaces(element){
  if ($(element).val().indexOf('  ') >= 0){
    return true
  }else{
    return false
  }
}

function inputCheck(e){
	switch (e.type){
		case "text":
			return (e.id.indexOf("email") != -1)? checkEmailType(e) : checkTextType(e);
		case "email":
		   	return checkEmailType(e);
		case "select": 
			return checkSelect(e);
		case "select-one":
			return checkSelect(e);
		case "checkbox":
			return checkCheckbox(e);
	}
}

function getErrorMgs(errorType){
	switch (errorType){
		case "patternMismatch":
			return "El formato no es correcto, por favor revíselo."
		case "valueMissing":
			return "Este valor es requerido."
		case "tooShort":
			return "El número de dígitos no es válido."
		case "emailMismatch":
			return 'Por favor incluya un "@"" en la dirección de correo electrónico.'
		case "rangeOverflow":
			return 'El valor debe coincidir con el número de dígitos.'
		case "rangeUnderflow":
			return "El formato no es correcto, por favor revíselo."
		case "rangeOverflow":
			return "El valor debe coincidir con el número de dígitos."
		case "spaceError":
			return "No se permiten espacios sucesivos."
	}
}

function checkCheckbox(e){
 	if($("."+e.className).parents('div[class^=col]').first().find(':checkbox:checked').length < 1){
 		return { status : false, message: getErrorMgs('valueMissing') }
 	}
 	return { status : true, message : "check_passed" }
}

function checkSelect(e){
	if(!e.value || e.value.length == 0){
		return { status : false, message: getErrorMgs('valueMissing') }	
	}
	return { status : true, message : "check_passed" }
}

function checkEmailType(e){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(e.value)){
		return { status : true, message : "check_passed" }
    } else {
    	return { status : false, message: getErrorMgs('emailMismatch') }
    }

}

function checkTextType(e){
	var val = e.value;
	if(val.length == 0){
		return { status : false, message: getErrorMgs('valueMissing') }	
	}

	if(val.length > 0 && e.pattern && e.pattern.length > 0 && !inPattern(e, e.pattern)){
		return { status : false, message: getErrorMgs('patternMismatch') }
	}

	if($.isNumeric(val) && e.pattern && e.pattern.length == 0){
		return { status : false, message: getErrorMgs('patternMismatch') }
	}


	if(e.minLength && val.length < e.minLength){
		return { status : false, message: getErrorMgs('tooShort') }	
	}
	
	return { status : true, message : "check_passed" }
}



function inPattern(e, pattern){
	var regex = new RegExp(pattern)
    var value = $('#'+e.id).val();
    isTrue = regex.test(value)
    return isTrue
}


function browserCapabilityCheck(){
	if(isIE() && isIE()<10){
		executeParser()

		haltFormSubmit = false;
		if($('form').attr('onsubmit') == "return submitLeadProcess()"){
			$('form').removeAttr('onsubmit');
			haltFormSubmit = true;
		}

		$("form").submit(function( event ) {
			isNotValidForm = 0;
			$("input[onformsubmit][isneeded]").each(function(index, element){
		 		validated = validInputCheck(element)
		 		if(!validated) isNotValidForm++ 
			}.bind(this));

			$("select[onformsubmit][isneeded]").each(function(index, element){
		 		validated = validInputCheck(element)
		 		if(!validated) isNotValidForm++ 
			}.bind(this));

			$('[onformsubmit]').each(function(){
				if(this.getAttribute('onformsubmit').indexOf('validInputCheck') != -1){
					validator = window["validInputCheck"](this)
					if(!validator) isNotValidForm++
				} 

				if(this.getAttribute('onformsubmit').indexOf('checkIBAN') != -1){
					validator = window["checkIBAN"](this)
					if(!validator) isNotValidForm++ 
				} 

				if(this.getAttribute('onformsubmit').indexOf('validateMobileNumberAction') != -1){
					validator = window["validateMobileNumberAction"](this)
					if(!validator) isNotValidForm++ 
				} 

				if(this.getAttribute('onformsubmit').indexOf('validateDniNieAction') != -1){
					validator = window["validateDniNieAction"](this)
					if(!validator) isNotValidForm++
				} 

			})

			if(isNotValidForm > 0 ){
				if(event.preventDefault) {
					event.preventDefault()				
				} else {
					event.returnValue =false
				}
			} else {
				haltFormSubmit && this.attributes['haltsubmit'] && submitLeadProcess();
			}
		});
	}
}


function executeFunctionByName(functionName, arguments) {
  var args = [].slice.call(arguments).splice(2);
  return window["functionName"](arguments);
}

function isCanvasSupported(){
  	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}


$(document).ready(function(){
	browserCapabilityCheck()
});



function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
