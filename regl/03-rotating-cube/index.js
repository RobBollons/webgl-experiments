const regl = require('regl')();
const glsify = require('glslify');
const mat4 = require('gl-mat4');

var cubePosition = [
      [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // positive z face.
      [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], // positive x face
      [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], // negative z face
      [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5], // negative x face.
      [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5], // top face
      [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5]  // bottom face
];

var cubeUv = [
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive z face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // positive x face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative z face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // negative x face.
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], // top face
      [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]  // bottom face
];

const cubeElements = [
      [2, 1, 0], [2, 0, 3],       // positive z face.
      [6, 5, 4], [6, 4, 7],       // positive x face.
      [10, 9, 8], [10, 8, 11],    // negative z face.
      [14, 13, 12], [14, 12, 15], // negative x face.
      [18, 17, 16], [18, 16, 19], // top face.
      [20, 21, 22], [23, 20, 22]  // bottom face
];

const drawCube = regl({
    frag: glsify.file('./index.js.frag'),
    vert: glsify.file('./index.js.vert'),
    attributes: {
        position: cubePosition,
        uv: cubeUv
    },
    elements: cubeElements,
    uniforms: {
        view: ({tick}) => {
            const rotation = (0.01 * tick) % 360;
            let modelViewMat = [];
            mat4.lookAt(modelViewMat,
                [1, 1, 1],
                [0, 0, 0],
                [0, 1, 0]);
            mat4.rotateY(modelViewMat, modelViewMat, rotation);
            return modelViewMat;
        },
        projection: ({viewportWidth, viewportHeight}) =>
            mat4.perspective([],
                1.7,
                viewportWidth / viewportHeight,
                0.1,
                100),
        tex: regl.prop('texture')
    }
});

const mainScope = regl({
    profile: true
});

require('resl')({
    manifest: {
        texture: {
            type: 'image',
            src: 'regl/03-rotating-cube/assets/box.jpg',
            parser: (data) => regl.texture({
                data: data,
                mag: 'linear',
                min: 'linear'
            })
        }
    },
    onDone: ({texture}) => {
        regl.frame(() => {
            mainScope(() => {
                regl.clear({
                    color: [0, 0, 0, 255],
                    depth: 1
                });
                drawCube({texture});
            });
        });
    }
});
