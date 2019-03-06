function Player(gl,x,y,z) {
  var location = [0,0,0]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
  primitives = [];
  primitives.push(Basic2(gl, location[0], location[1], location[2],1.0/6.0 ,1.0/6.0 ,1.0/6.0))
  primitives.push(Basic2(gl, location[0], location[1]+1.25/6.0, location[2],0.5/6.0 ,0.45/6.0 ,1.0/6.0))
  primitives.push(Basic2(gl, location[0]+0.5625/6.0, location[1]-1.25/6.0, location[2],0.4375/6.0 ,0.25/6.0 ,1.0/6.0))
  primitives.push(Basic2(gl, location[0]-0.5625/6.0, location[1]-1.25/6.0, location[2],0.4375/6.0 ,0.25/6.0 ,1.0/6.0))
  let init = () =>{
    primitives.forEach( prim => {
      prim.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,textures) =>{
    var modelViewMatrix = mat4.create();
    trans = [location[0]+x, location[1]+y, location[2]+z];
    mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      // console.log(trans);
      // mat4.scale(modelViewMatrix,
      //   modelViewMatrix,
      // [0.4,0.4,0.4])
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        trans);  // amount to translate
        // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // rotation_ob,
      // [0, 1, 0]);
      var ind = 0;
      primitives.forEach( (prim) => {
        gl = prim.draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures[ind],[1, 1, 1]);
        // prim.tick();
        if( ind < 2 ){
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
