import React from "react";
import "./Canvas.css"
import {TOOL} from "./Board";
import {mat4} from "gl-matrix/gl-matrix";

const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      // gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      gl_Position = uProjectionMatrix * vec4(aVertexPosition.xy, 0, 1);
    } 
  `;
const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function clear(gl) {
  gl.clearColor(40/255, 44/255, 52/255, 1.0);
  gl.clearDepth(1.0);
  gl.lineWidth(3);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function init(gl) {
  let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  let programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  };

  const BAO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, BAO);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  console.log(programInfo.attribLocations.vertexPosition);
  programInfo.mainBAO = BAO;
  return programInfo;
}

function drawLine(gl, params, BAO) {
  //params = [-.5, 0, 7000, 7000];
  //params = [0., .0, 80.5, 80.5];
  gl.bindBuffer(gl.ARRAY_BUFFER, BAO);
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(params),
      gl.STATIC_DRAW);
  console.log("DRAWLINE");
  console.log(params.length / 2);
  console.log(params);
  gl.drawArrays(gl.LINE_STRIP, 0, params.length / 2);
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    // init
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.gl = this.canvasRef.current.getContext("webgl");
    let gl = this.gl;
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    this.programInfo = init(gl);
    this.resizeCanvas();
    this.projM = mat4.create();
    mat4.ortho(this.projM, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    // mat4.perspective(this.projM,
    //     100 * Math.PI / 180,
    //     gl.canvas.width / gl.canvas.height,
    //     .1,
    //     100.0);
  }

  componentDidUpdate(prevProps, prevState) {
    // drawing shapes here
    let gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    clear(gl);
    gl.useProgram(this.programInfo.program);
    console.log("PROJ");
    console.log(this.projM);
    gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projM);
    for (let shape of this.props.elements) {
      console.log(shape);
      switch (shape.type) {
        case TOOL.LINE:
          drawLine(this.gl, shape.params, this.programInfo.mainBAO);
          break
      }
    }
  }

  resizeCanvas() {
    let canvas = this.canvasRef.current;
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  render() {
    return (
        //<canvas ref={this.canvasRef} width={1000} height={1000} style={{width: "100%", height: "100%"}}/>
        <canvas ref={this.canvasRef} style={{width: "100%", height: "100%", display: "block"}}/>
    );
  }
}

export default Canvas;