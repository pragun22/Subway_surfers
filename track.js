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
    tracks.push(Basic(gl, x+i*0.55, 0, 0,0.25 ,1.5 ,0.12))
  }
  let init = () =>{
    tracks.forEach(track => {
      track.init();
    });
  };
  let draw = (gl,VP,projectionMatrix, programInfo,texture) =>{
      var modelViewMatrix = mat4.create();
      mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      // trans = [location[0]+x,location[1]+y,location[2]+z]
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        location);  // amount to translate
      // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // 0,
      // [1, 1, 0]);
      tracks.forEach( (track,index) => {
        gl = track.draw(gl,modelViewMatrix,projectionMatrix,programInfo,texture);
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
