const glsl = require('glslify');

const vertShaderSource = glsl.file('./index.js.vert');
const fragShaderSource = glsl.file('./index.js.frag');
var vertexBuffer = null;
var shaderProgram = null;

const App = {
    createContext: () => {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        Object.assign(canvas.style, {
            bottom: '0px',
            right:'0px',
            position: 'absolute',
            width: '100%',
            height: '100%' });
        const context = canvas.getContext('webgl');
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
        return context;
    },

    loadShader: (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw `WebGL Shader - ${gl.getShaderInfoLog(shader)}`
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    },

    setupShaders: (gl, shaders) => {
        shaderProgram = gl.createProgram();
        shaders.forEach(s => gl.attachShader(shaderProgram, s));
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw 'WebGL - Failed to setup shaders';
        }
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        return shaderProgram;
    },

    setupBuffers: (gl) => {
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        const triangleVerts = [
             0.0,  0.5,  0.0,
            -0.5, -0.5,  0.0,
             0.5, -0.5,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(triangleVerts),
            gl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numberOfItems = 3;
    },

    draw: (gl, shaderProgram) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
            vertexBuffer.itemSize,
            gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
    }
}

const main = () => {
    const gl = App.createContext();
    const fragShader = App.loadShader(gl, gl.VERTEX_SHADER, vertShaderSource);
    const vertShader = App.loadShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
    App.setupShaders(gl, [fragShader, vertShader]);
    App.setupBuffers(gl);
    App.draw(gl, shaderProgram);
}

main();
