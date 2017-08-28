const mat4 = require('gl-mat4');

module.exports = (regl, props_) => {
    const props = props_ || {}
    return regl({
        context: {
            view: (context) => {
                let modelViewMat = [];
                return mat4.lookAt(modelViewMat,
                    props.eye,
                    props.target,
                    [0, 1, 0]);
            },
            projection: (context) => {
                let projMat = mat4.create();
                return mat4.perspective(projMat,
                    Math.PI / 4,
                    context.viewportWidth / context.viewportHeight,
                    0.01,
                    1000);
            },
            eye: props.eye
        },
        uniforms: {
            view: regl.context('view'),
            projection: regl.context('projection')
        }
    });
}
