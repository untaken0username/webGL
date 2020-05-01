"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.log("no wegl");
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  return [gl, program]
}

var prev = null;

function drawRect(gl, program, poses) {
    /*poses = [[10, 10, 20, 20, 0, 0, 0, 1],
            [10, 190, 20, 20, 0, 0, 0, 1],
            [70, 190, 20, 20, 0, 0, 0, 1],];*/
    var line_width = 10;
    for(var i = 0; i < line_width; i ++) {
        poses.forEach((line) => {

            var array = [];
            line.forEach(element => {
                var index = line.indexOf(element);
                if (index === line.length) 
                    return;
                var x = element[0];
                var y = element[1] - line_width/2 + i;
                var width = element[2];
                var height = element[3];
                var color = element.slice(4, 7);
            
                webglUtils.resizeCanvasToDisplaySize(gl.canvas);

                // Tell WebGL how to convert from clip space to pixels
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                // Clear the canvas
                //gl.clearColor(0, 0, 0, 0);
                //gl.clear(gl.COLOR_BUFFER_BIT);

                // Tell it to use our program (pair of shaders)
                gl.useProgram(program);

                var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
                var positionBuffer = gl.createBuffer();
                var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
                var colorUniformLocation = gl.getUniformLocation(program, "u_color");


                // Turn on the attribute
                gl.enableVertexAttribArray(positionAttributeLocation);

                // Bind the position buffer.
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

                // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
                var size = 2;          // 2 components per iteration
                var type = gl.FLOAT;   // the data is 32bit floats
                var normalize = false; // don't normalize the data
                var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                var offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    positionAttributeLocation, size, type, normalize, stride, offset);

                // set the resolution
                gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

                if (prev === null)
                    prev = [x, y];
                //setRectangle(gl, x, y, width, height);
                array.push(x, y)
                //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, prev[0], prev[1]]), gl.STATIC_DRAW);
                //prev = [x, y];
                // Set a random color.
                gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], 1);
                gl.uniform4f(colorUniformLocation, 0,0,0,1);

                // Draw the rectangle.
                //var primitiveType = gl.TRIANGLES;



            });

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);

            var primitiveType = gl.LINE_STRIP
            var offset = 0;
            var count = array.length/2;
            gl.drawArrays(primitiveType, offset, count);
        });
    }
}

// Returns a random integer from 0 to range - 1.
function randomInt1(range, min) {
  return Math.floor(Math.random() * range + min);
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
  }

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

let res = main();

var gl = res[0];
var program = res[1];
var poses = []


function mousedown(event) {
    poses.push([]);
    document.addEventListener("mousemove", whilemousedown);
}

function mouseup(event) {
    document.removeEventListener("mousemove", whilemousedown);
    //prev = null;
}
function whilemousedown(event) {
    var width = randomInt1(50, 30);
    var height = randomInt1(50, 30);
    var r = Math.random(1)/10+0.9;
    var g = Math.random(1)/5+0.8;
    var b = Math.random(1)/5+0.8;
    var x = event.clientX;// - width/2;
    var y = event.clientY;// - height/2;
    poses[poses.length-1].push([x, y, width, height, r, g, b]);
    drawRect(gl, program, poses);
}

document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);

document.addEventListener("keydown", () => {
    if (event.code == 'Space')
        poses = []
        drawRect(gl, program, [[[0, 0, 0, 0, 0, 0, 0]]]);
})