function Player(gl,x,y,z) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  var t = 0.07;
  var t2 = 0.04;
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
  var rot_leg = 0;
	const textureCoordBuffer = gl.createBuffer();
  var primitives = [];
  primitives.push(Basic2(gl, 0, 0, 0,1.0/6.0 ,1.0/6.0 ,1.0/6.0))
  primitives.push(Basic2(gl, 0, 0+1.25/6.0, 0,0.5/6.0 ,0.45/6.0 ,0.6/6.0))
  primitives.push(Basic2(gl, -0.5625/6.0, -1.25/6.0, 0,0.4375/6.0 ,0.45/6.0 ,0.6/6.0))
  primitives.push(Basic2(gl, 0.5625/6.0, -1.25/6.0, 0,0.4375/6.0 ,0.45/6.0 ,0.6/6.0))
  primitives.push(Basic2(gl, 1.2/6.0, 0, 0,0.2/6.0,0.8/6.0,0.6/6.0))
  primitives.push(Basic2(gl, -1.2/6.0, 0, 0,0.2/6.0,0.8/6.0,0.6/6.0))
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
        gl = primitives[0].draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures[0],[1, 1, 1]);
        gl = primitives[1].draw(gl,modelViewMatrix,projectionMatrix,programInfo,textures[1],[1, 1, 1]);
      var leg1 = mat4.create();
      var leg2 = mat4.create();
      mat4.rotate(leg1,
      modelViewMatrix,
      rot_leg,
      [1, 0, 0]);
      mat4.rotate(leg2,
        modelViewMatrix,
        -rot_leg,
        [1, 0, 0]);
      var ind = 0;
      gl = primitives[2].draw(gl,leg1,projectionMatrix,programInfo,textures[2],[1, 1, 1]);
      gl = primitives[3].draw(gl,leg2,projectionMatrix,programInfo,textures[2],[1, 1, 1]);
      var newmat = mat4.create();
    mat4.multiply(newmat,modelViewMatrix,newmat);      
      mat4.rotate(newmat,
      newmat,
      rotation_ob,
      [1, 0, 0]);
      gl = primitives[4].draw(gl,newmat,projectionMatrix,programInfo,textures[2],[1, 1, 1]);
      var newmat1 = mat4.create();
      mat4.multiply(newmat1,modelViewMatrix,newmat1);      
      mat4.rotate(newmat1,
      newmat1,
      -rotation_ob,
      [1, 0, 0]);  
      gl = primitives[5].draw(gl,newmat1,projectionMatrix,programInfo,textures[2],[1, 1, 1]);
      tick();
      return gl;
  };

  let tick = () => {
    if( rotation_ob > 60*Math.PI/180.0) t = -0.07;
    if( rotation_ob < -60*Math.PI/180.0) t = 0.07;
    rotation_ob += t;
    if( rot_leg > 30*Math.PI/180.0) t2 = -0.04;
    if( rot_leg< -30*Math.PI/180.0) t2 = 0.04;
    rot_leg += t2;

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
