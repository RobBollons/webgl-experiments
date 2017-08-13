const regl = require('regl')();
const resl = require('resl');
const camera = require('regl-camera');
const glsl = require('glslify');
const parseObj = require('parse-wavefront-obj');
const mat4 = require('gl-mat4');
const normals = require('angle-normals');

const mainCamera = camera(regl, {
    center: [0,0,0],
    eye: [0,1,1],
    distance: 2
});

const manifest = {
    cube: {
        src: './assets/cube.obj',
        parser: parseObj
    },
    texture: {
        src: './assets/texture.png',
        type: 'image',
        parser: (data) => regl.texture({
            data,
            mag: 'linear',
            min: 'linear'
        })
    }
};

const drawCube = () => {
    var model = [];
    return regl({
        frag: glsl.file('./index.js.frag'),
        vert: glsl.file('./index.js.vert'),
        attributes: {
            position: regl.prop('position'),
            uv: regl.prop('uv'),
            normal: regl.prop('normals')
        },
        elements: regl.prop('elements'),
        uniforms: {
            tex: regl.prop('texture'),
            model: function (context, props) {
                mat4.identity(model)
                return model
            },
            'light.color': [1, 1, 1],
            'light.position': [90, 90, 90]
        }
    });
};

resl({
    manifest: manifest,
    onDone: (data) => {
//        regl.frame(() => {
            regl.clear({
                depth: 1,
                color: [0, 0, 0, 1]
            });
//            mainCamera(() => {
                drawCube()({
                    texture: data.texture,
                    position: data.cube.positions,//cubePosition,
                    elements: data.cube.cells,//cubeElements,
                    uv: data.cube.vertexUVs, //cubeUv
                    normals: data.cube.faceNormals
                });
//            });
//        });
    }
});
