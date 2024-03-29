function Bridge(gl,x,y,z,num) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
  var primitives = [];
  primitives.push(Basic2(gl, 0,2.8,0,num-0.4,1.2,2));
  primitives.push(Basic2(gl, -1.4,2,0,num,2,2));
  primitives.push(Basic2(gl, 1.4,2,0,num,2,2));
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
        // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // rotation_ob,
      // [0, 1, 0]);
      primitives.forEach( (prim,i) => {
        gl = prim.draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures,[1, 1, 1]);
        // prim.tick();
      });
      return gl;
  };

  let tick = () => {
    rotation_ob += 0.01
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
