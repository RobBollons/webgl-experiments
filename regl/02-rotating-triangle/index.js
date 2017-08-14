const glsl = require('glslify');
const regl = require('regl')();
const mat4 = require('gl-mat4');

const triangle = regl({
    frag: glsl.file('./index.js.frag'),
    vert: glsl.file('./index.js.vert'),
    attributes: {
        position: regl.buffer([
             0.0,  0.5,  0.0,
            -0.5, -0.5,  0.0,
             0.5, -0.5,  0.0
        ])
    },
    uniforms: {
        angle: ({ tick }) => 0.02 * tick
    },
    count: 3
});

regl.frame(function () {
    regl.clear({
        color: [0, 0, 0, 1],
        depth: 1
    });
    triangle();
});
