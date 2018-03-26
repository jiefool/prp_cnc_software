$(document).ready(function(){
  $(".laser-operation").mouseover(function(){
    $(".laser-option").addClass("hover")
  })

  $(".laser-operation").mouseout(function(){
    $(".laser-option").removeClass("hover")
    $(".laser-option").removeClass("active")
  })

  $(".laser-operation").mousedown(function(){
    $(".laser-option").addClass("active")
  })

  $(".laser-operation").mouseup(function(){
    $(".laser-option").removeClass("active")
  })

  $(".milling-operation").mouseover(function(){
    $(".milling-option").addClass("hover")
  })

  $(".milling-operation").mouseout(function(){
    $(".milling-option").removeClass("hover")
    $(".milling-option").removeClass("active")
  })

  $(".milling-operation").mousedown(function(){
    $(".milling-option").addClass("active")
  })

  $(".milling-operation").mouseup(function(){
    $(".milling-option").removeClass("active")
  })

  $(".laser-file-preparation").click(function(){
    showLaserSetup();
  })

  $("#main-menu-button").click(function(){
    showMainMenu();
  })

  $(".laser-file-operation").click(function(){
    showLaserOperate();
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

function hideAllView(){
  $(".main-option").hide();
  $(".laser-setup").hide();
  $(".laser-operate").hide();
}