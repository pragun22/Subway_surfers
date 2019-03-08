function Shoes(gl,x,y,z) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
  var primitives = [];
  var sc = 0.2;
  primitives.push(Basic2(gl, 0, 0, 0, 0.5*0.2, 1*0.2, 0.5*0.2));
  primitives.push(Basic2(gl, -1*0.2, -0.5*0.2, 0, 0.5*0.2, 0.5*0.2, 0.5*0.2));
  let init = () =>{
    primitives.forEach( prim => {
      prim.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,textures) =>{
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        location);  // amount to translate
      mat4.rotate(modelViewMatrix,
      modelViewMatrix,
      rotation_ob,
      [1, 1, 0]);
      // mat4.scale(modelViewMatrix,
      //   modelViewMatrix,
      //   [0.2,0.2,0.2]);
      primitives.forEach( (prim) => {
        gl = prim.draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures,[0.1, 0.1, 0.1]);
        // prim.tick();
      });
      tick();
      return gl;
  };

  let tick = () => {
    rotation_ob += 0.04
  };
  let reset = (val) =>{
    // player.location[2] = val + 2;
  };
  return {
    location: location,
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
    draw : draw,
    init : init,
    tick : tick,
    reset : reset,
  };

}
