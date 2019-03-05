function Basic(gl,x,y,z,col,len,wid,hgt) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
	const normalBuffer = gl.createBuffer();
	const textureCoordBuffer = gl.createBuffer();
let init = () =>{
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -len,-hgt,-wid,
    len,-hgt,-wid,
    len,hgt,-wid,
    -len,hgt,-wid,
    -len,-hgt,wid,
    len,-hgt,wid,
    len,hgt,wid,
    -len,hgt,wid 
  ];    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const faceColors = [
      [col.r,  col.g,  col.b,  col.o],    
      [col.r,  col.g,  col.b,  col.o], // body sandy    
    ];
    var colors = [];
    for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      colors = colors.concat(c, c, c, c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    var indices = [];
    indices.push(
      0,1,2, 0,3,2,
      4,5,6, 4,7,6,
  
      0,4,5, 0,1,5,
      7,3,6, 3,6,2,
  
      0,4,7, 3,7,0,
      1,5,6, 6,2,1,  
    );
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
};
  let draw = (gl,VP,projectionMatrix, programInfo) =>{
      var modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0.0, 0.0, -6.0]);  // amount to translate
      mat4.rotate(modelViewMatrix,
      modelViewMatrix,
      0,
      [1, 1, 0]);
      mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
      }
      {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.useProgram(programInfo.program);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix); 
      gl.drawElements(gl.TRIANGLES, 36*4, gl.UNSIGNED_SHORT, 0);
        // console.log("returned new gl")
      return gl;
  };

  let tick = () => {
    cubeRotation += 0.01
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
