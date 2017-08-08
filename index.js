const regl = require('regl')();
const mandril = require('baboon-image');
const resl = require('resl');
const camera = require('regl-camera');
const glsl = require('glslify');
const parseObj = require('parse-wavefront-obj');

const mainCamera = camera(regl, {
    center: [0,45,0],
    eye: [0,1,0],
    distance: 175
});

const manifest = {
    cube: {
        src: './assets/cube.obj',
        parser: parseObj
    },
    texture: {
        src: './assets/nick-knowles.jpg',
        type: 'image',
        parser: (data) => regl.texture({
            data,
            mag: 'linear',
            min: 'linear'
        })
    }
}; 
const drawCube = regl({
    frag: glsl.file('./index.js.frag.glsl'),
    vert: glsl.file('./index.js.vert.glsl'),
    attributes: {
        position: regl.prop('position'),
        uv: regl.prop('uv')
    },
    elements: regl.prop('elements'),
    uniforms: {
        texture: regl.prop('texture')
    }
});

resl({
    manifest: manifest,
    onDone: (data) => {
        regl.frame(({time}) => {
            mainCamera(() => {
                drawCube({
                    texture: data.texture,
                    position: data.cube.positions,
                    elements: data.cube.cells,
                    uv: data.cube.vertexUVs
                });
            });
        });
    }
});
