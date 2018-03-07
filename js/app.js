const electron = require('electron')
const {ipcRenderer} = electron
var fs = require('fs')
var PNG = require('png-js')
var sp = require('serialport')
var lineReader = require('line-reader')
var app = require('electron').remote; 
var dialog = app.dialog;


const Readline = sp.parsers.Readline
const parser = new Readline()
var port
var checkGantryPosition
var gantryPosition
var gcodes = []
var counter = 0
var group
var x_center_group = 0
var y_center_group = 0
var objectStrokeColors = {}
var laserDevices = []
var enableLasing = false;
var sendBatch = false;
var linePath = [];
var scale = 0.346020761245675
var cwidth = 0
var seekRate = ""
var laseRate = ""
var laseIntensity = ""
var rulerLineGroup
var isResumed = false;
var canvas = new fabric.Canvas('canvas')
var en_cut_canvas = document.getElementById("en-cut-canvas");
var en_cut_ctx = en_cut_canvas.getContext("2d");
canvas.setHeight(620)


window.addEventListener('resize', resizeCanvas, false)

const mainOptionView = document.querySelector(".main-option")
const breadCrumb1 = document.querySelector("#breadcrumb-1")
const breadCrumb2 = document.querySelector("#breadcrumb-2")
const breadCrumb3 = document.querySelector("#breadcrumb-3")
const laser = document.querySelector("#laser")
const laserOptionView = document.querySelector(".laser-option")
const milling = document.querySelector("#milling")
const millingOptionView = document.querySelector(".milling-option")
const laserSetup = document.querySelector("#laser-setup")
const laserSetupView = document.querySelector(".laser-setup")
const laserOperate = document.querySelector("#laser-operate")
const laserOperateView = document.querySelector(".laser-operate")
const millingGcode = document.querySelector("#milling-gcode")
const millingGcodeView = document.querySelector(".milling-gcode")
const millingOperate = document.querySelector("#milling-operate")
const millingOperateView = document.querySelector(".milling-operate")
const hexLiteral = {10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F"}
const decLiteral = {A: 10, B: 11, C: 12, D: 13, E: 14, F: 15}

var canvasElement = document.getElementById('canvas');
var ctx = canvasElement.getContext("2d");
var hasImportedDesign = false;
var hasImportedGcode = false;
var hasPortOpen = false;

$(document).ready(function(){

  $('.generate-gcode').on('click', function() {
    if (hasImportedDesign){
      var $this = $(this);
      $this.button('loading');
      canvasToGcode();
    }else{
      alert("Please import a design first.")
    }
    
  });


  $('#lasing-button').on('click', function() {
    if (hasImportedGcode){
      var $this = $(this);
      if (hasPortOpen){
        $this.button('loading');
        lasingCommand();
      }else{
         alert("No laser device connected.")
      }
      
    }else{
      alert("Please import a gcode first.")
    }
  });
})


function addRuler(){
  var rulerLine = []

  rulerLine.push(new fabric.Rect({
    left: 0,
    top: 0,
    fill: 'black',
    width: canvas.width,
    height: 8/scale
  }))


  for(var i=0;i<canvas.width;i+=10){
    rulerLine.push(new fabric.Line([i, 0, i, 8/scale], {
      left: i/scale,
      top: 0,
      stroke: 'white',
      strokeWidth: 0.5
    }))

    rulerLine.push(new fabric.Text(String(i), { 
      left: i/scale,
      top: 4/scale, 
      fill: 'white',
      fontSize: 10,
      textAlign: 'center'
    }))
  }

  for(var i=5;i<canvas.width;i+=10){
    rulerLine.push(new fabric.Line([i, 0, i, 2.5/scale], {
      left: i/scale,
      top: 0,
      stroke: 'white',
      strokeWidth: 0.5
    }))
  }

  rulerLineGroup = new fabric.Group(rulerLine)
  rulerLineGroup.lockMovementX = true
  rulerLineGroup.lockMovementY = true
  rulerLineGroup.selectable = false
  canvas.add(rulerLineGroup)
}

$('#device-select').hover(function(){
  appendSerialDevice()
})



parser.on('data', function(data){

  if (counter < gcodes.length && enableLasing){
    if(gcodes[counter].indexOf("S") > -1){
      laseIntensity = gcodes[counter]
    }

    if(gcodes[counter].indexOf("G0 F") > -1){
      seekRate = gcodes[counter]
    }

    if(gcodes[counter].indexOf("G1 F") > -1){
      laseRate = gcodes[counter]
    }

    if(isResumed){
      counter-=10
      port.write(seekRate+"\n")
      port.write(laseRate+"\n")
      port.write(laseIntensity+"\n")
      port.write(gcodes[counter].replace("G1", "G0")+"\n")
      port.write("?\n")
      isResumed = false;
    }else{
      port.write(gcodes[counter]+"\n")
      port.write("?\n");
     
      var line = drawLasingPath(gcodes[counter], gcodes[counter+1])
      counter++

      if (counter >= gcodes.length){
        $("#lasing-button").button('reset');
        port.close()
      }
    }
  }

  //pausing
  if (!enableLasing){
    gantryHome();
  }
})


$('#device-select').change(function(){
  port = new sp($(this).val(), {
    baudRate: 57600
  })

  hasPortOpen = true;
  port.pipe(parser)
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
  cwidth = $(".canvas-area").get(0).offsetWidth
  resizeCanvas()
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
  cwidth = $(".canvas-area").get(0).offsetWidth
  canvas.setWidth(cwidth)
  handleAddRuler();
}

function handleAddRuler(){
  canvas._objects.forEach(function(cGroup, index){
    if(cGroup._objects.length == rulerLineGroup._objects.length){
      canvas.remove(cGroup)
    }
  })
  addRuler();
}

function svgImport(){ 
  var svgFile = document.getElementById("selectedFile").files[0].path

  fabric.loadSVGFromURL(svgFile, function(objects, options) {
    svgObjects = []
    objects.forEach(function(object,index){
      if(object.type == "circle"){
        svgObjects.push(new fabric.Circle({
          radius: object.radius,
          stroke: object.stroke,
          strokeWidth: object.strokeWidth,
          fill: object.fill,
          top: object.top,
          left: object.left
        }))
      }else if (object.type == "rect"){
        svgObjects.push(new fabric.Rect({
          stroke: object.stroke,
          strokeWidth: object.strokeWidth,
          fill: object.fill,
          height: object.height,
          width: object.width,
          top: object.top,
          left: object.left
        }))
      }else if (object.type == "line"){
        svgObjects.push(new fabric.Line([object.x1, object.y1, object.x2, object.y2], {
          stroke: object.stroke,
          strokeWidth: object.strokeWidth,
          fill: object.fill,
          top: object.top,
          left: object.left
        }))
      }else if (object.type == "polygon"){
        svgObjects.push(new fabric.Polygon(object.points, {
          stroke: object.stroke,
          strokeWidth: object.strokeWidth,
          fill: object.fill,
          top: object.top,
          left: object.left
        }))
      }else if(object.type == "image"){
        var filter = new fabric.Image.filters.Grayscale();
        object.filters.push(filter);
        object.applyFilters();
        svgObjects.push(object)
      }else{
        svgObjects.push(object)
      }
    })

    hasImportedDesign = true;
    group = new fabric.Group(svgObjects)

    group.set({
      top: (group.top) + 8/scale
    })

    group.lockMovementX = true
    group.lockMovementY = true
    group.selectable = false

    canvas.add(group)
    canvas.renderAll()
    
    canvas._objects.forEach(function(gObject, index){
      if (index == (canvas._objects.length - 1)){

        group = gObject
        gObject._objects.forEach(function(object, index){
            if (object.stroke != null && object.stroke != "#FFFFFF"){
              if(objectStrokeColors[object.stroke] == undefined){
                objectStrokeColors[object.stroke] = []
              }
              objectStrokeColors[object.stroke].push(object)
            }

            if (object.fill != null && object.fill != "#FFFFFF"){
              if (object.fill != ""){
                fillVal = parseRGBValue(object.fill)
                if(objectStrokeColors[fillVal] == undefined){
                  objectStrokeColors[fillVal] = []
                }
                objectStrokeColors[fillVal].push(object)
              }
            }
          
        })
      }
    })

    addStrokeSpeedPowerParams();
  })
}

function addStrokeSpeedPowerParams(){
  Object.keys(objectStrokeColors).forEach(function(stroke){
    stroke_n = stroke.replace("#","")
    html_text = '<div class="input-group"><span class="input-group-addon" id="'+stroke+'"><div style="height: 20px;width:20px;background-color:'+stroke+'"></div></span><span class="input-group-addon" id="basic-addon1">Speed</span> <input type="text" class="form-control" placeholder="0000" aria-describedby="basic-addon1" id="'+stroke_n+'-speed"> <span class="input-group-addon" id="basic-addon1">Power</span> <input type="text" class="form-control" placeholder="100%" aria-describedby="basic-addon1" id="'+stroke_n+'-power">'
    if (stroke == "#000000" || stroke == "#000"){
      html_text += '<span class="input-group-addon" id="basic-addon1">Rasterize</span> <span class="input-group-addon"><input type="checkbox" aria-label="" id="'+stroke_n+'-raster"></div><br/>'
    }else{
      html_text += '</div><br/>'
    }
    $(".speed-power-params").append(html_text)
  })
}

function parseRGBValue(val){
  var myRegexp = /\(([0-9,]+)\)/g;
  var match = myRegexp.exec(val);
  if (match != null){
    colorVal = match[1]
    colorVal = colorVal.split(",")
    colorVal[0] = changeDecToHex(colorVal[0])
    colorVal[1] = changeDecToHex(colorVal[1])
    colorVal[2] = changeDecToHex(colorVal[2])
    return "#"+colorVal.join("")
  }else{
    return val
  }
}

function changeDecToHex(val){
  if (val == 0){
    return "00"
  }

  quotient = val
  result = []
  while(quotient != 0 ){
    result.push(hexVal(quotient % 16))
    quotient = Math.floor(quotient/16)
  }
  return result.reverse().join("")
}

function hexVal(val){
  if (val > 9){
    return hexLiteral[val]
  }else{
    return "0"+val
  }
}

function parseHexValue(val){
  red = val.substring(1,3)
  green = val.substring(3,5)
  blue = val.substring(5,7)

  rgbVal = {
    r: decVal(red),
    g: decVal(green),
    b: decVal(blue)
  }

  return rgbVal
}

function decVal(val){
  dec = 0;
  for(var i=(val.length-1);i>=0;i--){
    val[i] < 10 ? dec += val[i] * Math.pow(16,i) : dec += (decLiteral[val[i]] * Math.pow(16,i))
  }
  return dec
}


function saveGcodeToFile(){
  dialog.showSaveDialog({
    filters: [{
      name: 'G-Code File',
      extensions: ['gcode']
    }]
  },

  (fileName) => {
    if (fileName === undefined){
        $(".generate-gcode").button('reset');
        console.log("You didn't save the file");
        return;
    }

    fs.writeFile(fileName, gcodes.join("\n"), (err) => {
        if(err){
          alert("An error ocurred creating the file "+ err.message)
        }
        $(".generate-gcode").button('reset');
        alert("Done saving G-Codes to "+ fileName)
    });
  }); 
}


function canvasToGcode(){
  

  var shapeObjects = []
  gcodes = []

  Object.keys(objectStrokeColors).forEach(function(stroke){
    stroke = parseRGBValue(stroke)
    speed_id = stroke + "-speed" 
    speed = $(speed_id).val()
    power_id = stroke + "-power" 
    power = $(power_id).val()
    raster_id = stroke + "-raster" 
    isRaster = $(raster_id).is(":checked")
    gcodes.push(GcodeWriter.write(objectStrokeColors[stroke], scale, speed, power, isRaster))
  })

  gcodes.forEach(function(element, index){
    if (index != 0){
      gcodes[index] = element.replace("G30", "")
    }
  })

  gcodes.push("G0 X5Y5")


  saveGcodeToFile();
} 

function lasingCommand(){
  enableLasing = true;
  counter = 0;
  port.open(function(err){
    port.write("?\n")
  })
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
          }))
        }
      }
    })
  })
}

function clearCutEngraveCanvas(){
  en_cut_ctx.clearRect(0, 0, en_cut_canvas.width, en_cut_canvas.height);
  $("#gcode-path").html("")
  $("#gcodeFileSelect").val("")
  hasImportedGcode = false;
  counter = 0;
}


function gcodeImport(){
  gcodes = []
  file = document.getElementById("gcodeFileSelect").files[0]

  if (file != undefined){
    lineReader.eachLine(file.path, function(line, last) {
      gcodes.push(line)
    })

    $("#gcode-path").html(file.path)
    hasImportedGcode = true;
  }
}

function svgSelectFile(){
  if (canvas._objects[1] != undefined){
    canvas.remove(canvas._objects[1]);
  }
  $(".speed-power-params").html("")
  $('#selectedFile').val("")
  $('#selectedFile').click()
}

function stopLasing(){
  enableLasing = false;
  counter = 0;
  $("#lasing-button").button('reset');
  closeOpenPort();
}

function pauseLasing(){
  enableLasing = false;
  closeOpenPort();
}

function resumeLasing(){
  enableLasing = true;
  isResumed = true;
  closeOpenPort();
}

function gantryHome(){
  port.write("G30\n")
}

function drawLasingPath(previousPoint, nextPoint){
  var prevVal = getGcodeCommand(previousPoint)
  var nextVal = getGcodeCommand(nextPoint)

  if (prevVal != undefined && nextVal != undefined){
    if((prevVal[1] == "G0" && nextVal[1] == "G1") || (prevVal[1] == "G1" && nextVal[1] == "G1")){
      return lowDrawLine(prevVal[2]/scale, prevVal[3]/scale, nextVal[2]/scale, nextVal[3]/scale);
    }
  }
}

function getGcodeCommand(val){
  var regGcode = /(G[0-1])\sX(\d+.\d+)Y(\d+.\d+)/g
  var gcodeCommand = regGcode.exec(val)

  if (gcodeCommand != null){
    return gcodeCommand
  }
}

function lowDrawLine(x1, y1, x2, y2){
  en_cut_ctx.strokeStyle="#FF0000";
  en_cut_ctx.beginPath();
  en_cut_ctx.moveTo(x1,y1);
  en_cut_ctx.lineTo(x2,y2);
  en_cut_ctx.stroke();
}

function closeOpenPort(){
  port.close(function(){
    port.open(function(){
      port.write("?\n", function(err){
        console.log(err)
      });
    })
  })
}
