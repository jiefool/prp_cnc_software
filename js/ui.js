$(document).ready(function(){

  $("#laser-clear-canvas").click(function(){
    clearCanvas();
  })

  $("#laser-import-svg").click(function(){
    $("#selectedFile").click()
  })

  $("#laser-cut-material").click(function(){
    viewController("laser-operate")
    navigationController(4)
  })

  $("#laser-prepare-file").click(function(){
    viewController("laser-setup")
    navigationController(3);
    handleAddRuler();
  })

  $(".prev-container").click(function(){
    var currentStep = parseInt($(".prev-num").html());
    viewController(viewWindows[currentStep - 1])
    navigationController(currentStep)
  });

  $(".next-container").click(function(){
    var currentStep = parseInt($(".next-num").html());
    if (currentStep > 2 && currentStep <= 4){
      viewController(viewWindows[currentStep - 1])
      navigationController(currentStep)
    }
  });


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

  var operationStep = 1;
  $(".operation-text-next").click(function(){
    if (operationStep == 1 && hasImportedGcode){
      operationStep++;
    }else{
      alert("Must import Gcode.")
    }

    if (operationStep == 2 && hasPortOpen){
      console.log("port added");
      appendSerialDevice();
    }else{
      alert("Must connect a device.")
    }
    
    operationStepController(operationStep);
    setOperationView(operationStep);

  })

  $(".operation-text-prev").click(function(){
    if (operationStep > 1){
      operationStep--;
    }
    operationStepController(operationStep);
    setOperationView(operationStep);
  })

  $("#laser-operation").click(function(){
    viewController("laser-operation-select")
    navigationController(2)
  })


  $(".cut-button").click(function(){
    // lasingCommand();
    startTime();
  })

  $(".stop-button").click(function(){
    // stopLasing();
    stopTime();
  })

  $(".pause-button").click(function(){
    // pauseLasing();
    stopTime();
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
    $("#step-num-"+i).removeClass("next-step")
    $("#step-label-"+i).removeClass("ol-current")
    $("#step-label-"+i).removeClass("ol-next")
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
  $(".oss-"+stepNum).addClass("current-step")
}

function hideAllOperationViews(){
  $(".laser-operations").hide();
}

function setOperationView(viewNum){
  hideAllOperationViews();
  $(".laser-operate-step-"+viewNum).show();
}

