function Track(gl,x,y,z) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
	const normalBuffer = gl.createBuffer();
	const textureCoordBuffer = gl.createBuffer();
  var tracks = [];
  var col = {
    'r':0.56,
    'g':0.56,
    'b':0.56,
    'o':1,
  };
  for(var i =0 ; i < 3; i++){
    tracks.push(Basic(gl, x+i, y, z, col,0.25 ,0.5 ,0.12))
  }
  let init = () =>{
    tracks.forEach(track => {
      track.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,texture) =>{
      var modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0.0, 0.0, -6.0]);  // amount to translate
      mat4.rotate(modelViewMatrix,
      modelViewMatrix,
      0,
      [1, 1, 0]);
      mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      tracks.forEach( track => {
        gl = track.draw(gl,VP,projectionMatrix,programInfo,texture);
      });
      return gl;
  };

  let tick = () => {
    tracks.forEach( track => {
      track.tick();
    });
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
