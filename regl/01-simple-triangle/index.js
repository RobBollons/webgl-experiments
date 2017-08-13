const glsl = require('glslify');
const regl = require('regl')();

regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
});
regl({
    frag: glsl.file('./index.js.frag'),
    vert: glsl.file('./index.js.vert'),
    attributes: {
        aVertexPosition: regl.buffer([
             0.0,  0.5,  0.0,
            -0.5, -0.5,  0.0,
             0.5, -0.5,  0.0
        ])
    },
    count: 3
})();
