function Jet(gl,x,y,z) {
  var location = [x, y, z]
  var primitives = [];
  primitives.push(Basic2(gl, 0.08, 0, 0, 0.07,0.17,0.05))
  primitives.push(Basic2(gl, -0.08, 0, 0, 0.07,0.17,0.05));
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
      primitives.forEach( (prim) => {
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
    draw : draw,
    init : init,
    tick : tick,
    reset : reset,
  };

}
