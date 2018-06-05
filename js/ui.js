$(document).ready(function(){

  $("#laser-clear-canvas").click(function(){
    clearCanvas();
    $(".preparation-text-next").hide();
  })

  $("#laser-import-svg").click(function(){
    $("#selectedFile").click()
  })

  $("#laser-cut-material").click(function(){
    viewController("laser-operate")
    navigationController(4)
    handleAddRuler(en_cut_canvas_fabric, ".cut-canvas-area");
  })

  $("#laser-prepare-file").click(function(){
    viewController("laser-setup")
    navigationController(3);
    handleAddRuler(canvas);
  })

  $(".prev-container").click(function(){
    if (!enableLasing){
      var currentStep = parseInt($(".prev-num").html());
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)

      if(currentStep == 1){
        $(".next-container").hide();
      }
    }
  });

  $(".next-container").click(function(){
    var currentStep = parseInt($(".next-num").html());
    if (currentStep > 2 && currentStep <= 4){
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)
      if (currentStep == 4){
        handleAddRuler(en_cut_canvas_fabric, ".cut-canvas-area");
      }
    }
  });

  $(".next-container").hover(function(){
    var nextNum = parseInt($(".next-num").html())
    if (nextNum > 2){
      $("div.next-container > div.operation-step").addClass("operation-step-hover")
      $(".next-arrow").html('')
      $(".next-arrow").html('<img src="images/next_arrow_hovered.png" width="30">')
    }
  });

   $(".next-container").mouseout(function(){
    var nextNum = parseInt($(".next-num").html())
    if (nextNum > 2){
      $("div.next-container > div.operation-step").removeClass("operation-step-hover")
      $(".next-arrow").html('')
      $(".next-arrow").html('<img src="images/next_arrow.png" width="30">')
    }
  });


  $(".prev-container").hover(function(){
    if (!enableLasing){
      $("div.prev-container > div.operation-step").addClass("operation-step-hover")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow_hovered.png" width="30">')
    }
  });

   $(".prev-container").mouseout(function(){
    if (!enableLasing){
      $("div.prev-container > div.operation-step").removeClass("operation-step-hover")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow.png" width="30">')
    }
  });

  $(".main-back-btn").click(function(){
    if (!enableLasing){
      var currentStep = parseInt($(".prev-num").html());
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)

      if(currentStep == 1){
        $(".next-container").hide();
      }
    }
  })

  $(".main-home-btn").click(function(){
    if (!enableLasing){
      currentStep = 0
      viewController(viewWindows[currentStep])
      navigationController(currentStep+1)
      $(".next-container").hide();
    }
  })


  $("#generate-gcode-btn").click(function(){
    console.log(checkForInput());
    if (checkForInput()){
      canvasToGcode();
    }else{
      alert("Please input some value to the power and speed fields.");
    }
  })

   $(".preparation-text-prev").click(function(){
    $(".preparation-text-prev").hide();
    $(".laser-file-action-2").hide();
    $(".laser-file-action-1").show();
    $(".preparation-text-next").show();
    $("#laser-prep-step-2").removeClass("current-step");
    $("#laser-prep-step-1").addClass("current-step");
  })

  $(".preparation-text-next").click(function(){
    if (checkForImportedFile()){
      $(".laser-file-action-1").hide();
      $(".laser-file-action-2").show();
      $(".preparation-text-prev").show();
      $(".preparation-text-next").hide();
      $("#laser-prep-step-1").removeClass("current-step");
      $("#laser-prep-step-2").addClass("current-step");
    }else{
      alert("Must import a file.")
    }
  })

  $(".preparation-text-prev").hover(function(){
    $(this).html('<img src="images/prev_arrow_hovered.png" width="15"/> Back')
  })

  $(".preparation-text-prev").mouseout(function(){
    $(this).html('<img src="images/prev_arrow.png" width="15"/> Back')
  })

  $(".preparation-text-next").hover(function(){
    $(this).html('Next <img src="images/next_arrow_hovered.png" width="15"/>')
  })

   $(".preparation-text-next").mouseout(function(){
    $(this).html('Next <img src="images/next_arrow.png" width="15"/>')
  })

  var operationStep = 1;
  $(".operation-text-next").click(function(){
    if (operationStep == 1 ){
      if (hasImportedGcode){
        appendSerialDevice();
        operationStep++;
      }else{
        alert("Must import gcode.")
      }
    }else if (operationStep == 2){
      // if (hasPortOpen){
        operationStep++;
      // }else{
        // alert("Must connect a device.")
      // }
    }   
   
    if (operationStep > 1){
      $(".operation-text-prev").show();
    }

    if (operationStep == 3){
      $(".operation-text-next").hide();
    }
    
    operationStepController(operationStep);
    setOperationView(operationStep);

  })

  $(".operation-text-prev").click(function(){
    if (operationStep > 1 && !enableLasing){
      operationStep--;
    }

    if (operationStep == 1){
      $(".operation-text-prev").hide();
    }

    if (operationStep < 3){
      $(".operation-text-next").show();
    }

    operationStepController(operationStep);
    setOperationView(operationStep);
  })


  $("#laser-operation").click(function(){
    $(".next-num").addClass("current-step")
    $(".next-num").removeClass("os-disable")
    $(".next-arrow").html('')
    $(".next-arrow").html('<img src="images/next_arrow.png" width="30">')
    viewController("laser-operation-select")
    navigationController(2)
  })


  $(".cut-button").click(function(){
    if (!enableLasing){
      $(this).addClass("cb-disabled")
      $(".cut-wrapper").css("color", "#dce1ea")
      $(".pause-wrapper").css("color", "#ffc107")
      $(".pause-button").removeClass("pb-disabled")
      $(".stop-wrapper").css("color", "#f44336")
      $(".stop-button").removeClass("sb-disabled")

      $("div.prev-container > div.operation-step").removeClass("current-step")
      $("div.prev-container > div.operation-step").addClass("next-step")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow_disabled.png" width="30"/>')

      $(".operation-text-prev").css("color", "#97969c")
      $(".operation-text-prev").html('<img src="images/prev_arrow_disabled.png" width="15"/> Back')

      lasingCommand();
      startTime();
    }
  })

  $(".stop-button").click(function(){
    if (enableLasing){
      $(this).addClass("sb-disabled")
      $(".stop-wrapper").css("color", "#dce1ea")
      $(".pause-wrapper").css("color", "#dce1ea")
      $(".pause-button").addClass("pb-disabled")
      $(".cut-button").removeClass("cb-disabled")
      $(".cut-wrapper").css("color", "#4caf50")
      $("#cut-span").html("Cut")


      $("div.prev-container > div.operation-step").addClass("current-step")
      $("div.prev-container > div.operation-step").removeClass("next-step")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow.png" width="30"/>')


      $(".operation-text-prev").css("color", "#ab47bc")
      $(".operation-text-prev").html('<img src="images/prev_arrow.png" width="15"/> Back')


      stopLasing();
      stopTime();
    }
  })

  $(".pause-button").click(function(){
    if (enableLasing){
      $(this).addClass("pb-disabled")
      $(".pause-wrapper").css("color", "#dce1ea")
      $(".cut-button").removeClass("cb-disabled")
      $("#cut-span").html("Continue")
      $(".cut-wrapper").css("color", "#4caf50")


      $("div.prev-container > div.operation-step").addClass("current-step")
      $("div.prev-container > div.operation-step").removeClass("next-step")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow.png" width="30"/>')


      $(".operation-text-prev").css("color", "#ab47bc")
      $(".operation-text-prev").html('<img src="images/prev_arrow.png" width="15"/> Back')

      pauseLasing();
      stopTime();
    }
  })


  $("#clear-settings-btn").click(function(){
    $(".ps-params").val('')
  })

  $(".machine-select-btn").click(function(){
    $(this).parent().toggleClass("machine-selected")
    if ($(this).html().indexOf("Selected") > -1){
      $(this).html('Select')
    }else{
      $(this).html('Selected')
    }
  })

})


function showLaserSetup(){
  hideAllView();
  $(".laser-setup").show();
}

function showMainMenu(){
  hideAllView();
  $(".main-option").show();
}

function showLaserOperate(){
  hideAllView();
  $(".laser-operate").show();
}


var viewWindows = ["machine-select","laser-operation-select","laser-setup","laser-operate"]

function hideAllView(){
  $.each( viewWindows, function( key, value ) {
   $("#"+value).hide();
  });
}

function showView( view ){
  $("#"+view).show();
}

function viewController( view ){
  hideAllView();
  showView( view );
}

function removeNavClass(){
  for(var i=1;i<5;i++){
    $("#step-num-"+i).removeClass("current-step")
    // $("#step-num-"+i).removeClass("next-step")
    $("#step-label-"+i).removeClass("ol-current")
    // $("#step-label-"+i).removeClass("ol-next")
  }
 
}

function navigationController( step ){
  removeNavClass();
  switch(step){
    case 1:
      $("#step-num-1").addClass("current-step")
      $("#step-num-2").addClass("next-step")
      $("#step-label-1").addClass("ol-current")
      $("#step-label-2").addClass("ol-next")
      $(".prev-container").hide();
      $(".next-num").html(step + 1);
    break;
    case 2:
      $("#step-num-2").addClass("current-step")
      $("#step-num-3").addClass("next-step")
      $("#step-label-2").addClass("ol-current")
      $("#step-label-3").addClass("ol-next")
      $(".prev-container").show();
      $(".next-container").show();
      $(".prev-num").html(step - 1);
      $(".next-num").html(step + 1);
    break;
    case 3:
      $("#step-num-3").addClass("current-step")
      $("#step-num-4").addClass("next-step")
      $("#step-label-3").addClass("ol-current")
      $("#step-label-4").addClass("ol-next")
      $(".prev-container").show();
      $(".next-container").show();
      $(".prev-num").html(step - 1);
      $(".next-num").html(step + 1);
    break;
    case 4:
      $("#step-num-4").addClass("current-step")
      $("#step-label-4").addClass("ol-current")
      $(".prev-container").show();
      $(".next-container").hide();
      $(".prev-num").html(step - 1);
    break;
  }
}

function checkForInput(){
  var hasInput = true;

  $(".ps-params").each(function(){
    if ($(this).val() == null || $(this).val() == ""){
      hasInput = false;
    }
  })

  return hasInput;
}


function clearOperationStepClass(){
  $(".operation-step-small").removeClass("current-step")
}

function operationStepController(stepNum){
  clearOperationStepClass();
  setOperationStep(stepNum);
}

function setOperationStep(stepNum){
  if (stepNum == 1){
    $(".import-gcode-status").show()
    $(".device-status").hide()
  }else{
    $(".import-gcode-status").hide()
    $(".device-status").show()
  }

  $(".oss-"+stepNum).addClass("current-step")
}

function hideAllOperationViews(){
  $(".laser-operations").hide();
}

function setOperationView(viewNum){
  hideAllOperationViews();
  $(".laser-operate-step-"+viewNum).show();
}

