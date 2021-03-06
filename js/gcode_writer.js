GcodeWriter = {
  write: function(fcObjects, scale, speed, power, isRaster){
    x_prev = 0
    y_prev = 0
    glist = []
    intensity = 255 * (power/100)

    glist.push("G0 F2000")
    glist.push("G1 F"+speed)
    glist.push("S"+intensity)
    glist.push("G30")

    fcObjects.forEach(function(segment, index){
      switch(segment.type){
        case "path":
          isRaster ? rasterizeObject(segment) : glist.push(parsePath(segment))
          break
        case "rect":
          isRaster ? rasterizeObject(segment) : glist.push(parseRect(segment))
          break
        case "ellipse":
          isRaster ? rasterizeObject(segment) : glist.push(parseEllipse(segment))
          break
        case "line":
          isRaster ? rasterizeObject(segment) : glist.push(parseLine(segment))
          break
        case "polygon":
          isRaster ? rasterizeObject(segment) : glist.push(parsePolygon(segment))
          break
        case "circle":
          isRaster ? rasterizeObject(segment) : glist.push(parseEllipse(segment))
          break
        case "image":
          rasterizeImage(segment)
          break
      }
    })

    function parsePolygon(segment){
      x_offset = 0
      y_offset = 0

      segment.points.forEach(function(point, index){
        x = point.x + x_offset
        y = point.y + y_offset
        if (index == 0){
          glist.push("G0 X"+(x * scale)+"Y"+(y * scale))
        }else{
          glist.push("G1 X"+(x * scale)+"Y"+(y * scale))
        }
      })

      x = segment.points[0].x + x_offset
      y = segment.points[0].y + y_offset
      glist.push("G1 X"+( x * scale)+"Y"+( y * scale))
    }

    function parseRect(segment){
      pos = segment.aCoords
      glist.push("G0 X"+(pos.tl.x * scale)+"Y"+(pos.tl.y * scale))
      glist.push("G1 X"+(pos.tr.x * scale)+"Y"+(pos.tr.y * scale))
      glist.push("G1 X"+(pos.br.x * scale)+"Y"+(pos.br.y * scale))
      glist.push("G1 X"+(pos.bl.x * scale)+"Y"+(pos.bl.y * scale))
      glist.push("G1 X"+(pos.tl.x * scale)+"Y"+(pos.tl.y * scale))
    }

    function parseEllipse(segment){
      cSegment = segment.getCenterPoint()

      rx = segment.radius
      ry = segment.radius

      if (segment.type == "ellipse"){
        rx = segment.rx
        ry = segment.ry
      }
     
      x_center_ellipse = segment.aCoords.tl.x + segment.width/2
      y_center_ellipse = segment.aCoords.tl.y + segment.height/2

      if ((segment.width/scale) < 10){
        var incOffset = 0.2
      }else{
        var incOffset = 0.01
      }
      

      for (var i = 0 * Math.PI; i <= 2.02 * Math.PI; i += incOffset ) {
        xPos = x_center_ellipse - (rx * Math.cos(i));
        yPos = y_center_ellipse + (ry * Math.sin(i));

        if (i == 0) {
          glist.push("G0 X"+(xPos * scale )+"Y"+(yPos * scale))
          lastPoint = "G1 X"+(xPos * scale )+"Y"+(yPos * scale)
        }else {
          glist.push("G1 X"+(xPos * scale)+"Y"+(yPos * scale))
        }
      }

      glist.push(lastPoint)
    }

    function parseLine(segment){
      x_offset = 0
      y_offset = 0

      x = x_offset + segment.x1 
      y = y_offset + segment.y1 
      glist.push("G0 X"+(x * scale)+"Y"+(y* scale))

      x = x_offset + segment.x2 
      y = y_offset + segment.y2 
      glist.push("G1 X"+(x * scale)+"Y"+(y* scale))
    }

    function parsePath(segment){
      segment.path.forEach(function(path, index){
        switch(path[0]){
          case "M":
            x_prev = path[1]
            y_prev = path[2]
            glist.push("G0 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "m":
            x_prev = x_prev + path[1]
            y_prev = y_prev + path[2]
            glist.push("G0 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "H":
            x_prev = path[1]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "h":
            x_prev = x_prev + path[1]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "V":
            y_prev = path[1]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "v":
            y_prev = y_prev + path[1]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "C":
            start_cx = path[1]
            start_cy = path[2]

            end_cx = path[3]
            end_cy = path[4]

            end_x = path[5]
            end_y = path[6]

            glist.push(calBezierCurve(x_prev, y_prev, start_cx, start_cy, end_cx, end_cy, end_x, end_y))

            x_prev = end_x
            y_prev = end_y
            break
          case "c":
            start_cx = x_prev + path[1]
            start_cy = y_prev + path[2]

            end_cx = x_prev + path[3]
            end_cy = y_prev + path[4]

            end_x = x_prev + path[5]
            end_y = y_prev + path[6]

            glist.push(calBezierCurve(x_prev, y_prev, start_cx, start_cy, end_cx, end_cy, end_x, end_y))

            x_prev = end_x
            y_prev = end_y
            break
          case "S":
            start_cx = path[1]
            start_cy = path[2]

            end_cx = path[1]
            end_cy = path[2]

            end_x = path[3]
            end_y = path[4]

            glist.push(calBezierCurve(x_prev, y_prev, start_cx, start_cy, end_cx, end_cy, end_x, end_y))

            x_prev = end_x
            y_prev = end_y
            break
          case "s":
            start_cx = x_prev + path[1]
            start_cy = y_prev + path[2]

            end_cx = x_prev + path[1]
            end_cy = y_prev + path[2]

            end_x = x_prev + path[3]
            end_y = y_prev + path[4]

            glist.push(calBezierCurve(x_prev, y_prev, start_cx, start_cy, end_cx, end_cy, end_x, end_y))

            x_prev = end_x
            y_prev = end_y
            break
          case "L":
            x_prev = path[1]
            y_prev = path[2]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
          case "l":
            x_prev = x_prev + path[1]
            y_prev = y_prev + path[2]
            glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
            break
        }
      })
    }

    function rasterizeObject(segment){
      tl_x = segment.aCoords.tl.x
      tl_y = segment.aCoords.tl.y + (8/scale)
      tr_x = segment.aCoords.tr.x

      dir = 0
      for(var j=0;j<segment.height;j+=scale){
        if (dir % 2 == 0){
          for(var k=0;k<segment.width;k+=scale){
            x = tl_x + k
            y = tl_y + j
            var px = ctx.getImageData(x, y, 1, 1).data;
            pixelGcode(px)
          }
        }else{
          for(var k=0;k<segment.width;k+=scale){
            x = tr_x - k
            y = tl_y + j
            var px = ctx.getImageData(x, y, 1, 1).data;
            pixelGcode(px)
          }
        }
        dir++;
      }
    }

    function pixelGcode(px){
      if (px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] == 255){
        glist.push("G1 X"+(x * scale)+"Y"+((y - (8/scale)) * scale))
      }else{
        glist.push("G0 X"+(x * scale)+"Y"+((y - (8/scale)) * scale))
      }
    }

    function imagePixelGcode(px){
      if (px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] == 255){
        glist.push("G1 X"+(x * scale)+"Y"+((y - (8/scale)) * scale))
      }else{
        glist.push("G0 X"+(x * scale)+"Y"+((y - (8/scale)) * scale))
      }
    }

    function calBezierCurve(start_x, start_y, start_cx, start_cy, end_cx, end_cy, end_x, end_y){
      var t = 0.1;
      var offset_increment = 0.1;

      while (t < 1) {
        x = (1-t)*(1-t)*(1-t)*start_x + 3*(1-t)*(1-t)*t*start_cx + 3*(1-t)*t*t*end_cx + t*t*t*end_x;
        y = (1-t)*(1-t)*(1-t)*start_y + 3*(1-t)*(1-t)*t*start_cy + 3*(1-t)*t*t*end_cy + t*t*t*end_y;
        glist.push("G1 X"+(x * scale)+"Y"+(y * scale))
        t  = t + offset_increment;
      }
    }

    function rasterizeImage(segment){
      var tlx = segment.aCoords.tl.x
      var trx = segment.aCoords.tr.x
      var tly = segment.aCoords.tl.y + (8/scale)
      var sw = segment.width * segment.scaleX
      var sh = segment.height * segment.scaleY

      var imagePixelData = ctx.getImageData(tlx, tly, sw, sh)
      imagePixelData["data"] = floydSteinberg(imagePixelData.data, imagePixelData.width, imagePixelData.height)
      ctx.putImageData(imagePixelData, tlx, tly)

      for(var i=0; i<sh; i+=0.5){
        var line = 0;
        for(var j=0; j<sw; j+=0.5){
          if (line % 2 == 0 ){
            x = tlx + j
            y = tly + i
            var pixelData = ctx.getImageData(x, y, 1, 1).data
            imagePixelGcode(pixelData)
          }else{
            x = trx - j
            y = tly + i
            var pixelData = ctx.getImageData(x, y, 1, 1).data
            imagePixelGcode(pixelData)
          }
        }
        line++;
      }

    }

    function floydSteinberg(sb, w, h){
      var i=0
      while(i<sb.length){
        for(var j=0; j<w; j++){
           var ci = i*w+j;
           var cc = sb[ci];
           var rc = (cc<128?0:255);
           var err = cc-rc;
           sb[ci] = rc;
           if(j+1<w) sb[ci  +1] += (err*7)>>4;
           if(j>0) sb[ci+w-1] += (err*3)>>4;  
                     sb[ci+w] += (err*5)>>4;  
           if(j+1<w) sb[ci+w+1] += (err*1)>>4;
        }
        i++;
      }
      return sb;
    }

    glist = glist.filter(function(n){ return n != undefined }); 
    return glist.join("\n")
  }
}