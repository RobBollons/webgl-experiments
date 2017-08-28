const glsify = require('glslify');
const parseObj = require('parse-wavefront-obj');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');
const angleNormals = require('angle-normals');
const resl = require('resl');
const regl = require('regl')();
const createCamera = require('../components/camera');

const camera = createCamera(regl, {
    eye: [2, 2, 2],
    target: [0, 0, 0]
});

const drawCube = (cubeModel, texture) => {
    let uvs = cubeModel.vertexUVs || cubeModel.cells.map((a) => [0,0]);
    let normals = angleNormals(cubeModel.cells, cubeModel.positions);
    console.log(cubeModel);
    return regl({
        frag: glsify.file('./index.js.frag'),
        vert: glsify.file('./index.js.vert'),
        attributes: {
            position: cubeModel.positions,
            normal: normals,
            uv: uvs
        },
        elements: cubeModel.cells,
        uniforms: {
            view: ({tick, view}) => {
                const rotation = (0.01 * tick) % 360;
                let translate = vec3.create();
                let model = view || mat4.create();
                vec3.set(translate, -0.5, -0.5, -0.5);
                mat4.rotateY(model, model, rotation);
                mat4.translate(model, model, translate);
                return model;
            },
            lightPosition: [10, 10, 10],
            lightColour: [1, 1, 1],
            tex: texture
        }
    })
};

resl({
    manifest: {
        cubeModel: {
            type: 'text',
            src: './regl/per-vertex-lighting/assets/cube.obj',
            parser: parseObj
        },
        texture: {
            type: 'image',
            src: './regl/per-vertex-lighting/assets/box.jpg',
            parser: (data) => regl.texture(data)
        }
    },
    onDone: ({texture, cubeModel}) => {
        let cube = drawCube(cubeModel, texture);
        regl.frame(() => {
            camera(() => {
                    regl.clear({
                        color: [0, 0, 0, 255],
                        depth: 1
                    });
                    cube();
                }
            );
        });
    }
});
