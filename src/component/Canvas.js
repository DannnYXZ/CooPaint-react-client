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
  console.log("CLEARED");
  gl.clearColor(40 / 255, 44 / 255, 52 / 255, 1.0);
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
  programInfo.mainBAO = BAO;
  return programInfo;
}

function drawLine(gl, params, BAO) {
  gl.bindBuffer(gl.ARRAY_BUFFER, BAO);
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(params),
      gl.STATIC_DRAW);
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
    window.addEventListener("resize", this.resize.bind(this));
    this.gl = this.canvasRef.current.getContext("webgl", {preserveDrawingBuffer: true});
    let gl = this.gl;
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    this.programInfo = init(gl);
    this.resize();
    // mat4.perspective(this.projM,
    //     100 * Math.PI / 180,
    //     gl.canvas.width / gl.canvas.height,
    //     .1,
    //     100.0);
  }

  draw(elements) {
    let gl = this.gl;
    gl.useProgram(this.programInfo.program);
    gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projM);
    for (let shape of elements) {
      switch (shape.type) {
        case TOOL.LINE:
          drawLine(this.gl, shape.params, this.programInfo.mainBAO);
          break
      }
    }
  }

  resize() {
    let canvas = this.canvasRef.current;
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    let gl = this.gl;
    clear(gl);
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.projM = mat4.create();
    mat4.ortho(this.projM, 0, canvas.width, canvas.height, 0, -1, 1);
  }

  render() {
    return (
        <canvas ref={this.canvasRef} style={{width: "100%", height: "100%", display: "block"}}/>
    );
  }
}

export default Canvas;