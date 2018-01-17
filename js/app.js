const electron = require('electron');
const {ipcRenderer} = electron;
var fs = require('fs');
var PNG = require('png-js');
var sp = require('serialport');
const Readline = sp.parsers.Readline;
const parser = new Readline();
var port;
var checkGantryPosition;
var gantryPosition;
var gcodes = []
var counter = 0;
var x_center_group = 0;
var y_center_group = 0;

var cwidth = 0
var canvas = new fabric.Canvas('canvas');
canvas.setHeight(620);
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

$('#device-select').change(function(){
  port = new sp($(this).val(), {
    baudRate: 57600
  });

  port.pipe(parser);

  parser.on('data', function(data){
    if (counter < gcodes.length){
      counter++;
      port.write(gcodes[counter]+"\n")
      port.write("?\n")
    }
  });
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
  appendSerialDevice();
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
  canvas.renderAll();
}

function svgImport(){
  file = document.getElementById("selectedFile").files[0].path
  fabric.loadSVGFromURL(file, function(objects, options) {
    var shape = fabric.util.groupSVGElements(objects, options);
    canvas.add(shape);
  });
}

function canvasToGcode(){
  var shapeObjects = []
  var scale = 0.353
  canvasData = canvas.toJSON()

  canvasData.objects.forEach(function(group, index){
    if (group.objects != undefined){
      x_center_group = canvasData.objects[0].left + (canvasData.objects[0].width/2)
      y_center_group = canvasData.objects[0].top + (canvasData.objects[0].height/2)
      group.objects.forEach(function(shape, index){
        shapeObjects.push(shape)
      })
    }else{
      shapeObjects.push(group)
    }
  })

  gcodes = GcodeWriter.write(shapeObjects, scale)
  console.log(gcodes)

  fs.writeFile("/Users/jaypaulaying/Desktop/sample.gcode", gcodes, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); 
} 

function lasingCommand(){
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('/Users/jaypaulaying/Desktop/sample.gcode')
  });

  lineReader.on('line', function (line) {
    gcodes.push(line)
  });

  setTimeout(function(){
    port.write(gcodes[counter]+"\n")
    port.write("?\n")
  }, 2000)
}

function appendSerialDevice(){
  sp.list(function(err, ports) {
    ports.forEach(function(port, index){
      if (port.manufacturer != undefined ){
        $('#device-select').append($('<option>', {
            value: port.comName,
            text: port.comName + '('+port.manufacturer+')'
        }));
      }
    })
  });
}

