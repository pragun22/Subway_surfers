function Train(gl,x,y,z,len) {
  var location = [x, y, z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
  var primitives = [];
  primitives.push(Circle(gl,0, 1,0,0.30,len/20.0));
  // primitives.push(Basic2(gl,0,1,0,0.25,0.2,0.1))
  primitives.push(Basic2(gl, 0, 1, 2.1, 0.25,0.2,len));
  let init = () =>{
    primitives.forEach( prim => {
      prim.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,textures) =>{
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      // console.log(trans);
      // mat4.scale(modelViewMatrix,
      //   modelViewMatrix,
      // [0.4,0.4,0.4])
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        location);  // amount to translate
        // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // rotation_ob,
      // [0, 1, 0]);
      var ind = 0;
      primitives.forEach( (prim) => {
        gl = prim.draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures[ind],[1, 1, 1]);
        // prim.tick();
        if( ind < 1 ){
          ind++; 
        } 
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
