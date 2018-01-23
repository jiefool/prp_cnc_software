const electron = require('electron');
const {ipcRenderer} = electron;
var fs = require('fs');
var PNG = require('png-js');
var sp = require('serialport');
var lineReader = require('line-reader');

const Readline = sp.parsers.Readline;
const parser = new Readline();
var port;
var checkGantryPosition;
var gantryPosition;
var gcodes = []
var counter = 0;
var x_center_group = 0;
var y_center_group = 0;
var objectStrokeColors = {};
var laserDevices = []

var cwidth = 0
var canvas = new fabric.Canvas('canvas');
var en_cut_canvas = new fabric.Canvas('en-cut-canvas');
canvas.setHeight(620);
en_cut_canvas.setHeight(620);

window.addEventListener('resize', resizeCanvas, false);

const mainOptionView = document.querySelector(".main-option")
const breadCrumb1 = document.querySelector("#breadcrumb-1");
const breadCrumb2 = document.querySelector("#breadcrumb-2");
const breadCrumb3 = document.querySelector("#breadcrumb-3");
const laser = document.querySelector("#laser");
const laserOptionView = document.querySelector(".laser-option");
const milling = document.querySelector("#milling");
const millingOptionView = document.querySelector(".milling-option");
const laserSetup = document.querySelector("#laser-setup");
const laserSetupView = document.querySelector(".laser-setup");
const laserOperate = document.querySelector("#laser-operate");
const laserOperateView = document.querySelector(".laser-operate");
const millingGcode = document.querySelector("#milling-gcode");
const millingGcodeView = document.querySelector(".milling-gcode");
const millingOperate = document.querySelector("#milling-operate");
const millingOperateView = document.querySelector(".milling-operate");


$('#device-select').hover(function(){
  appendSerialDevice();
})


parser.on('data', function(data){
  console.log(data)
  if (counter < gcodes.length){
    counter++;
    console.log(gcodes[counter])
    port.write(gcodes[counter]+"\n")
    port.write("?\n")
  }

  if ((counter+1) >= gcodes.length){
    port.close();
    counter = 0;
  }

});


$('#device-select').change(function(){
  port = new sp($(this).val(), {
    baudRate: 57600,
    autoOpen: false
  });

  port.pipe(parser);
})

breadCrumb1.addEventListener('click', function(){
  hideAllView()
  mainOptionView.style.display = "block"
  breadCrumb2.innerHTML = ""
  breadCrumb3.innerHTML = ""
})

breadCrumb2.addEventListener('click', function(){
  breadCrumbText = breadCrumb2.innerHTML

  if (breadCrumbText == "LASER OPERATION"){
    hideAllView()
    laserOptionView.style.display = "block"
  }else if(breadCrumbText == "MILLING OPERATION"){
    hideAllView()
    millingOptionView.style.display = "block"
  }

  breadCrumb3.innerHTML = ""

})

breadCrumb3.addEventListener('click', function(){
  hideAllView()
  mainOptionView.style.display = "block"
})

// second level
laser.addEventListener('click', function(){
  hideAllView()
  laserOptionView.style.display = "block"
  breadCrumb2.innerHTML = "LASER OPERATION"
})

milling.addEventListener('click', function(){
  hideAllView()
  millingOptionView.style.display = "block"
  breadCrumb2.innerHTML = "MILLING OPERATION"
})

// third level
laserSetup.addEventListener('click', function(){
  hideAllView()
  laserSetupView.style.display = "block"
  breadCrumb3.innerHTML = "LASER SETUP PARAMS"
  cwidth = $(".canvas-area").get(0).offsetWidth;
  resizeCanvas();
})

laserOperate.addEventListener('click', function(){
  hideAllView()
  laserOperateView.style.display = "block"
  breadCrumb3.innerHTML = "LASER ENGRAVING/CUTTING"
})

millingGcode.addEventListener('click', function(){
  hideAllView()
  millingGcodeView.style.display = "block"
  breadCrumb3.innerHTML = "GENERATE G-CODE"
})

millingOperate.addEventListener('click', function(){
  hideAllView()
  millingOperateView.style.display = "block"
  breadCrumb3.innerHTML = "MILLING OPERATION"
})

function hideAllView(){
  mainOptionView.style.display = "none"
  laserOptionView.style.display = "none"
  millingOptionView.style.display = "none"
  laserSetupView.style.display = "none"
  laserOperateView.style.display = "none"
  millingGcodeView.style.display = "none"
  millingOperateView.style.display = "none"
}

function resizeCanvas() {
  canvas.setWidth(cwidth);
  en_cut_canvas.setWidth(cwidth);
  canvas.renderAll();
  en_cut_canvas.renderAll();
}

function svgImport(){
  file = document.getElementById("selectedFile").files[0].path
  fabric.loadSVGFromURL(file, function(objects, options) {

    svgObjects = []
    objects.forEach(function(object){
      svgObjects.push(object)
      getObjectStrokeColors(object)
    })

    var group = new fabric.Group(svgObjects);
    x_center_group = group.left;
    y_center_group = group.top;
    console.log(group)
    canvas.add(group)

    addStrokeSpeedPowerParams();
  });
}

function getObjectStrokeColors(object){
  if ( objectStrokeColors[object.stroke] == undefined){
    objectStrokeColors[object.stroke] = []
  }
  objectStrokeColors[object.stroke].push(object)
}

function addStrokeSpeedPowerParams(){
  Object.keys(objectStrokeColors).forEach(function(stroke){
    stroke_n = stroke.replace("#","")
    html_text = '<div class="input-group"><span class="input-group-addon" id="'+stroke+'"><div style="height: 20px;width:20px;background-color:'+stroke+'"></div></span><span class="input-group-addon" id="basic-addon1">Speed</span> <input type="text" class="form-control" placeholder="0000" aria-describedby="basic-addon1" id="'+stroke_n+'-speed"> <span class="input-group-addon" id="basic-addon1">Power</span> <input type="text" class="form-control" placeholder="100%" aria-describedby="basic-addon1" id="'+stroke_n+'-power"></div><br/>'
    $(".speed-power-params").append(html_text)
  })
}

function canvasToGcode(){
  // var shapeObjects = []
  gcodes = []
  var scale = 0.353
  // canvasData = canvas.toJSON()

  // canvasData.objects.forEach(function(group, index){
  //   if (group.objects != undefined){
  //     x_center_group = canvasData.objects[0].left + (canvasData.objects[0].width/2)
  //     y_center_group = canvasData.objects[0].top + (canvasData.objects[0].height/2)
  //     group.objects.forEach(function(shape, index){
  //       shapeObjects.push(shape)
  //     })
  //   }else{
  //     shapeObjects.push(group)
  //   }
  // })
  Object.keys(objectStrokeColors).forEach(function(stroke){
    speed_id = stroke + "-speed" 
    speed = $(speed_id).val()
    power_id = stroke + "-power" 
    power = $(power_id).val()
    gcodes.push(GcodeWriter.write(objectStrokeColors[stroke], scale, speed, power))
  })

  homeGcodes = []
  gcodes.forEach(function(element, index){
    if (index != 0){
      gcodes[index] = element.replace("G30", "")
    }
  })


  fs.writeFile("/Users/jaypaulaying/Desktop/sample.gcode", gcodes.join("\n"), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
} 

function lasingCommand(){
  port.open(function(err){
      port.write(gcodes[counter]+"\n")
      port.write("?\n")
  });
}

function appendSerialDevice(){
  sp.list(function(err, ports) {
    ports.forEach(function(port, index){
      if (port.manufacturer != undefined ){
        if (laserDevices.indexOf(port.comName) === -1){
          laserDevices.push(port.comName)
          $('#device-select').append($('<option>', {
              value: port.comName,
              text: port.comName + '('+port.manufacturer+')'
          }));
        }
      }
    })
  });
}

function gcodeImport(){
  gcodes = []
  file = document.getElementById("gcodeFileSelect").files[0].path
  lineReader.eachLine(file, function(line, last) {
    gcodes.push(line.replace(",", ""))
  });
}

function svgSelectFile(){
  canvas.clear();
  $(".speed-power-params").html("")
  $('#selectedFile').val("")
  $('#selectedFile').click();
}

