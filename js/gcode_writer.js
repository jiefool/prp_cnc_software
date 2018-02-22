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
      x_center_ellipse = group.left + (group.width/2) + cSegment.x
      y_center_ellipse = group.top + (group.height/2) + cSegment.y 
      lastPoint = ""

      for (var i = 0 * Math.PI; i <= 2.02 * Math.PI; i += 0.01 ) {
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
      tl_y = segment.aCoords.tl.y
      tr_x = segment.aCoords.tr.x

      dir = 0
      for(var j=0;j<segment.height;j+=scale){
        for(var k=0;k<segment.width;k+=scale){
          dir % 2 == 0 ? x = tl_x + k :  x = tr_x - k
          y = tl_y + j
          var px = ctx.getImageData(x, y, 1, 1).data;
          pixelGcode(px)
        }
        dir++;
      }
    }

    function pixelGcode(px){
      if (px[0] == 0 && px[1] == 0 && px[2] == 0 && px[3] == 255){
        glist.push("G1 X"+(x * scale)+"Y"+(y * scale))
      }else{
        glist.push("G0 X"+(x * scale)+"Y"+(y * scale))
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

    glist = glist.filter(function(n){ return n != undefined }); 
    return glist.join("\n")
  }
}