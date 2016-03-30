// Default Shaders
var glslify = require('glslify');

// TODO - adopt glslify
const Shaders = {
  Vertex: {
    Default: glslify('./default-vertex')
  },
  Fragment: {
    Default: glslify('./default-fragment')
  }
};

Shaders.vs = Shaders.Vertex.Default;
Shaders.fs = Shaders.Fragment.Default;

export default Shaders;
