function Player(gl,x,y,z) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
  primitives = [];
  primitives.push(Basic2(gl, x, y, z,1.0/4.0 ,1.0/4.0 ,1.0/4.0))
  primitives.push(Basic2(gl, x, y+1.25/8, z,0.5/4.0 ,0.25/4.0 ,1.0/4.0))
  primitives.push(Basic2(gl, x+0.5625/4.0, y-1.25/4.0, z,0.4375/4.0 ,0.25/4.0 ,1.0/4.0))
  primitives.push(Basic2(gl, x-0.5625/4.0, y-1.25/4.0, z,0.4375/4.0 ,0.25/4.0 ,1.0/4.0))
  let init = () =>{
    primitives.forEach( prim => {
      prim.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,textures) =>{
      var modelViewMatrix = mat4.create();
      // mat4.translate(modelViewMatrix,     // destination matrix
      //   modelViewMatrix,     // matrix to translate
      //   location);  // amount to translate
      // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // rotation_ob,
      // [1, 1, 0]);
      // mat4.scale(modelViewMatrix,
      //   modelViewMatrix,
      //   [0.4,0.4,0.4])
      mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      primitives.forEach( (prim) => {
        gl = prim.draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures,[1, 1, 1]);
      });
      return gl;
  };

  let tick = () => {
    rotation_ob += 0.01
  };
  return {
    location: location,
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
    draw : draw,
    init : init,
    tick : tick,
  };

}
