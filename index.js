const regl = require('regl')();
const mandril = require('baboon-image');
const resl = require('resl');
const camera = require('regl-camera');
const glsl = require('glslify');

const mainCamera = camera({
    center: [0,45,0],
    eye: [0,1,0],
    distance: 175
});

const manifest = {
    cube: {
        src: './assets/cube.obj',
        parser: parseObj
    }
};

const drawCube = regl({
    frag: glsl.file('./index.js.frag.glsl'),
    vert: glsl.file('./index.js.vert.glsl'),
    attributes: {
        position: regl.prop('position')
    },
    elements: regl.prop('elements'),
    uniforms: {
        texture: regl.prop('texture')
    }
});

resl({
    manifest,
    onDone: (data) => {
        regl.frame(({time}) => {
            mainCamera(() => {
                drawCube({
                    texture: mandril,
                    position: data.cube.positions,
                    elements: data.cube.cells
                });
            });
        });
    }
});
