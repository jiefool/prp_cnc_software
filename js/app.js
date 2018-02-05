const electron = require('electron')
const {ipcRenderer} = electron
var fs = require('fs')
var PNG = require('png-js')
var sp = require('serialport')
var lineReader = require('line-reader')

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
var enableLasing

var cwidth = 0
var canvas = new fabric.Canvas('canvas')
var en_cut_canvas = new fabric.Canvas('en-cut-canvas')
canvas.setHeight(620)
en_cut_canvas.setHeight(620)

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


$('#device-select').hover(function(){
  appendSerialDevice()
})


parser.on('data', function(data){
  if (counter < gcodes.length && enableLasing){
    counter++
    console.log(gcodes[counter])
    port.write(gcodes[counter]+"\n")
    port.write("?\n")
  }

  if ((counter+1) >= gcodes.length){
    port.close()
    counter = 0
  }
})


$('#device-select').change(function(){
  port = new sp($(this).val(), {
    baudRate: 57600,
    autoOpen: false
  })

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
  canvas.setWidth(cwidth)
  en_cut_canvas.setWidth(cwidth)
  canvas.renderAll()
  en_cut_canvas.renderAll()
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
      }else{
         svgObjects.push(object)
      }
    })

    group = new fabric.Group(svgObjects)
    canvas.add(group)
    canvas.renderAll()
    
    canvas._objects.forEach(function(gObject, index){
      group = gObject
      gObject._objects.forEach(function(object, index){
        if(objectStrokeColors[object.stroke] == undefined){
          objectStrokeColors[object.stroke] = []
        }
        objectStrokeColors[object.stroke].push(object)

        if (object.fill != ""){
          fillVal = parseRGBValue(object.fill)
          if(objectStrokeColors[fillVal] == undefined){
            objectStrokeColors[fillVal] = []
          }
          objectStrokeColors[fillVal].push(object)
        }
      })
    })

    addStrokeSpeedPowerParams();
  })
}

function addStrokeSpeedPowerParams(){
  Object.keys(objectStrokeColors).forEach(function(stroke){
    stroke_n = stroke.replace("#","")
    html_text = '<div class="input-group"><span class="input-group-addon" id="'+stroke+'"><div style="height: 20px;width:20px;background-color:'+stroke+'"></div></span><span class="input-group-addon" id="basic-addon1">Speed</span> <input type="text" class="form-control" placeholder="0000" aria-describedby="basic-addon1" id="'+stroke_n+'-speed"> <span class="input-group-addon" id="basic-addon1">Power</span> <input type="text" class="form-control" placeholder="100%" aria-describedby="basic-addon1" id="'+stroke_n+'-power"><span class="input-group-addon" id="basic-addon1">Rasterize</span> <span class="input-group-addon"><input type="checkbox" aria-label="" id="'+stroke_n+'-raster"></div><br/>'
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

  console.log(red)
  console.log(green)
  console.log(blue)

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

function canvasToGcode(){
  var shapeObjects = []
  gcodes = []
  var scale = 0.353

  Object.keys(objectStrokeColors).forEach(function(stroke){
    stroke = parseRGBValue(stroke)
    speed_id = stroke + "-speed" 
    speed = $(speed_id).val()
    power_id = stroke + "-power" 
    power = $(power_id).val()
    raster_id = stroke + "-raster" 
    isRaster = $(raster_id).is(":checked")
    rasterColor = parseHexValue(stroke)

    console.log(rasterColor)

    gcodes.push(GcodeWriter.write(objectStrokeColors[stroke], scale, speed, power, isRaster, rasterColor))
  })

  gcodes.forEach(function(element, index){
    if (index != 0){
      gcodes[index] = element.replace("G30", "")
    }
  })

  gcodes.push("G0 X5Y5")

  fs.writeFile("/Users/jaypaulaying/Desktop/sample.gcode", gcodes.join("\n"), function(err) {
      if(err) {
          return console.log(err)
      }
      console.log("The file was saved!")
  }) 
} 

function lasingCommand(){
  enableLasing = true;
  port.open(function(err){
      port.write(gcodes[counter]+"\n")
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

function gcodeImport(){
  gcodes = []
  file = document.getElementById("gcodeFileSelect").files[0].path
  lineReader.eachLine(file, function(line, last) {
    gcodes.push(line.replace(",", ""))
  })
}

function svgSelectFile(){
  canvas.clear()
  $(".speed-power-params").html("")
  $('#selectedFile').val("")
  $('#selectedFile').click()
}

function stopLasing(){
  enableLasing = false;
}

function gantryHome(){
  port.write("G30\n")
}

