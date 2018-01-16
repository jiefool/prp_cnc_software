  GcodeWriter = {
  write: function(fcObjects, scale){
    x_prev = 0
    y_prev = 0
    glist = []

    glist.push("G0 F2000")
    glist.push("G1 F500")
    glist.push("S255")
    glist.push("G30")

    fcObjects.forEach(function(segment, index){
      console.log(segment)
      switch(segment.type){
        case "path":
          glist.push(parsePath(segment))
          break
        case "rect":
          glist.push(parseRect(segment))
          break
        case "ellipse":
          glist.push(parseEllipse(segment))
          break
        case "line":
          glist.push(parseLine(segment))
          break
        case "polygon":
          glist.push(parsePolygon(segment))
          break
      }
    })

    function parsePolygon(segment){
      segment.points.forEach(function(point, index){
        if (index == 0){
          glist.push("G0 X"+(point.x * scale)+"Y"+(point.y * scale))
        }else{
          glist.push("G1 X"+(point.x * scale)+"Y"+(point.y * scale))
        }
      })
      glist.push("G1 X"+(segment.points[0].x * scale)+"Y"+(segment.points[0].y * scale))
    }

    function parseRect(segment){
      //move to top left corner

      x_prev = x_center_group + segment.left
      y_prev = y_center_group + segment.top

      glist.push("G0 X"+(x_prev * scale)+"Y"+(y_prev * scale))

      //lase to top right corner
      x_prev += segment.width
      glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))

      //lase to bot right corner
      y_prev += segment.height
      glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))

      //lase to bot left
      x_prev -= segment.width
      glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))

      //lase to top left
      y_prev -= segment.height
      glist.push("G1 X"+(x_prev * scale)+"Y"+(y_prev * scale))
    }

    function parseEllipse(segment){
      //move to top left corner
      x_center_ellipse = x_center_group + segment.left + segment.rx
      y_center_ellipse = y_center_group + segment.top + segment.ry

      for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
          xPos = x_center_ellipse - (segment.rx * Math.cos(i));
          yPos = y_center_ellipse + (segment.ry * Math.sin(i));

          if (i == 0) {
            glist.push("G0 X"+(xPos * scale )+"Y"+(yPos* scale))
          } else {
            glist.push("G1 X"+(xPos * scale)+"Y"+(yPos* scale))
          }
      }
    }

    function parseLine(segment){
      x = x_center_group + segment.left + segment.width/2 + segment.x1
      y = y_center_group + segment.top + segment.height/2 + segment.y1
      glist.push("G0 X"+(x* scale)+"Y"+(y* scale))

      x = x_center_group + segment.left + segment.width/2 + segment.x2
      y = y_center_group + segment.top + segment.height/2 + segment.y2
      glist.push("G1 X"+(x* scale)+"Y"+(y* scale))
    }

    function parsePath(segment){
      console.log(segment)
      segment.path.forEach(function(path, index){
        console.log(path[0])
        switch(path[0]){
          case "M":
            x_prev = path[1]
            y_prev = path[2]
            glist.push("G0 X"+(x_prev* scale)+" Y"+(y_prev* scale))
            break
          case "m":
            x_prev = x_prev + path[1]
            y_prev = y_prev + path[2]
            glist.push("G0 X"+(x_prev* scale)+" Y"+(y_prev* scale))
            break
          case "H":
            x_prev = path[1]
            glist.push("G1 X"+(x_prev* scale)+" Y"+(y_prev* scale))
            break
          case "h":
            x_prev = x_prev + path[1]
            glist.push("G1 X"+(x_prev* scale)+" Y"+(y_prev* scale))
            break
          case "V":
            y_prev = path[1]
            glist.push("G1 X"+(x_prev* scale)+" Y"+(y_prev* scale))
            break
          case "v":
            y_prev = y_prev + path[1]
            glist.push("G1 X"+(x_prev* scale)+" Y"+(y_prev* scale))
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
            glist.push("G1 X"+(x_prev * scale)+" Y"+(y_prev * scale))
            break
          case "l":
            x_prev = x_prev + path[1]
            y_prev = y_prev + path[2]
            glist.push("G1 X"+(x_prev * scale)+" Y"+(y_prev * scale))
            break
        }
      })
    }

    function calBezierCurve(start_x, start_y, start_cx, start_cy, end_cx, end_cy, end_x, end_y){
      var t = 0.1;
      var offset_increment = 0.1;

      while (t < 1) {
        x = (1-t)*(1-t)*(1-t)*start_x + 3*(1-t)*(1-t)*t*start_cx + 3*(1-t)*t*t*end_cx + t*t*t*end_x;
        y = (1-t)*(1-t)*(1-t)*start_y + 3*(1-t)*(1-t)*t*start_cy + 3*(1-t)*t*t*end_cy + t*t*t*end_y;
        glist.push("G1 X"+(x* scale)+" Y"+(y * scale))
        t  = t + offset_increment;
      }
    }

    glist.push("G0 X5Y5")
    return glist.join("\n")
  }
}