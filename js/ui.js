var currentStep = 1;
var laserMachineSelected = false;

$(document).ready(function(){
  $("#laser-clear-canvas").click(function(){
    clearCanvas();
    $(".preparation-text-next").hide();
  })

  $("#laser-import-svg").click(function(){
    $("#selectedFile").click()
  })

  $("#laser-cut-material").click(function(){
    currentStep = 3;
    viewController("laser-operate")
    navigationController(currentStep)
    handleAddRuler(en_cut_canvas_fabric, ".cut-canvas-area");
  })

  $("#laser-prepare-file").click(function(){
    currentStep = 2;
    viewController("laser-setup")
    navigationController(currentStep);
    handleAddRuler(canvas);
  })

  $(".prev-container").click(function(){
    if (!enableLasing){
      currentStep = parseInt($(".prev-num").html());
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)

      if(currentStep == 1){
        $(".next-container").hide();
      }

      if(currentStep == 2){
        handleAddRuler(canvas)
      }
    }
  });

  $(".next-container").click(function(){
    var currentStep = parseInt($(".next-num").html());
    if (currentStep > 1 && currentStep <= 3){
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)
      if (currentStep == 3){
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
    console.log(currentStep);   

    if (!enableLasing && currentStep != undefined){
     
      if (currentStep > 1){
        var confirmBack = confirm(translateData["text_lost_changes"])

        if (confirmBack){
          if (currentStep == 3){
            operationStep = 1;
            currentStep--;
            operationStepController(operationStep);
            setOperationView(operationStep);
            clearCutEngraveCanvas()
            gcodes = []
            bCodes = []
            elapsedLasingTime = 0
            $(".lasing-time").html("00:00:00")
            isBackToMain = true

            $("#laser-port").html("Laser device in port:")
            $("#connection-status").html("Connection status:")
            $(".operation-text-prev").hide();
          }

          if (currentStep == 2){
            clearCanvas()
          }
          currentStep--
        }

      }else{
        currentStep--;
      }

      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)
      if(currentStep == 1){
        $(".next-container").hide();
      }
    }

  })

  $(".main-back-btn").mouseover(function(){
    $(this).find('img').attr("src", "images/prev_arrow_white.png")
  })

  $(".main-back-btn").mouseout(function(){
    $(this).find('img').attr("src", "images/prev_arrow.png")
  })

  $(".main-home-btn").click(function(){
    $(this).find('img').attr("src", "images/home_btn_white.png")
    if (!enableLasing){
      if (currentStep > 1){
        var confirmBack = confirm(translateData["text_lost_changes"])
        if(confirmBack){
          clearCanvas()
          clearCutEngraveCanvas()
          currentStep = 1
        }
      }
     
      viewController(viewWindows[currentStep-1])
      navigationController(currentStep)
      $(".next-container").hide();
    }
  })

  $(".main-home-btn").mouseout(function(){
    $(this).find('img').attr("src", "images/home_btn.png")
  })

  $(".main-home-btn").mouseover(function(){
    $(this).find('img').attr("src", "images/home_btn_white.png")
  })


  $("#generate-gcode-btn").click(function(){
    console.log(checkForInput());
    if (checkForInput()){
      canvasToGcode();
    }else{
      alert(translateData['text_input_some_value']);
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
      alert(translateData['text_import_file'])
    }
  })

  $(".preparation-text-prev").hover(function(){
    $(this).html('<img src="images/prev_arrow_hovered.png" width="15"/> '+translateData['text_back'])
  })

  $(".preparation-text-prev").mouseout(function(){
    $(this).html('<img src="images/prev_arrow.png" width="15"/> '+translateData['text_back'])
  })

  $(".preparation-text-next").hover(function(){
    $(this).html(translateData['text_next']+' <img src="images/next_arrow_hovered.png" width="15"/>')
  })

   $(".preparation-text-next").mouseout(function(){
    $(this).html(translateData['text_next']+' <img src="images/next_arrow.png" width="15"/>')
  })

  var operationStep = 1;

  $(".operation-text-next").click(function(){
    if (operationStep == 1 ){
      if (hasImportedGcode){
        appendSerialDevice();
        operationStep++;
        $(".operation-text-next").hide();
      }else{
        alert(translateData['text_please_import_gcode'])
      }
    }else if (operationStep == 2){
      if (hasPortOpen){
        operationStep++;
      }else{
        alert(translateData['text_connect_device'])
      }
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


  // $("#laser-operation").click(function(){
  //   $(".next-num").addClass("current-step")
  //   $(".next-num").removeClass("os-disable")
  //   $(".next-arrow").html('')
  //   $(".next-arrow").html('<img src="images/next_arrow.png" width="30">')

  //   if ($(this).parent().hasClass("machine-selected")){
  //     $(this).parent().removeClass("machine-selected")
  //   }else{
  //     currentStep++;
  //     viewController("laser-operation-select")
  //     navigationController(currentStep)
  //   }
  // })


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
      $(".operation-text-prev").html('<img src="images/prev_arrow_disabled.png" width="15"/> '+translateData['text_back'])

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
      $("#cut-span").html(translateData["text_cut"])


      $("div.prev-container > div.operation-step").addClass("current-step")
      $("div.prev-container > div.operation-step").removeClass("next-step")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow.png" width="30"/>')


      $(".operation-text-prev").css("color", "#ab47bc")
      $(".operation-text-prev").html('<img src="images/prev_arrow.png" width="15"/> '+translateData['text_back'])


      stopLasing();
      stopTime();
    }
  })

  $(".pause-button").click(function(){
    if (enableLasing){
      $(this).addClass("pb-disabled")
      $(".pause-wrapper").css("color", "#dce1ea")
      $(".cut-button").removeClass("cb-disabled")
      $("#cut-span").html(translateData['text_continue'])
      $(".cut-wrapper").css("color", "#4caf50")


      $("div.prev-container > div.operation-step").addClass("current-step")
      $("div.prev-container > div.operation-step").removeClass("next-step")
      $(".prev-arrow").html('')
      $(".prev-arrow").html('<img src="images/prev_arrow.png" width="30"/>')


      $(".operation-text-prev").css("color", "#ab47bc")
      $(".operation-text-prev").html('<img src="images/prev_arrow.png" width="15"/> '+translateData['text_back'])

      pauseLasing();
      stopTime();
    }
  })


  $("#clear-settings-btn").click(function(){
    $(".ps-params").val('')
  })

  $(".machine-select-btn").click(function(){
    if ($(this).html().indexOf("Selected") > -1 || $(this).html().indexOf("Pili-a") > -1){
      $(this).html(translateData['text_select'])
      $(this).css("background-color", "#ab47bc")
    }else{
      $(this).html(translateData['text_selected'])
      $(this).css("background-color", "#6a1b9a")
    }

    if (!$(this).parent().hasClass("machine-selected")){
      viewController( $(this).attr("data-view"))
      currentStep++
      navigationController(currentStep)
      $(this).parent().addClass("machine-selected")
    }else{
      $(this).parent().removeClass("machine-selected")
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


var viewWindows = ["laser-operation-select","laser-setup","laser-operate"]

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

