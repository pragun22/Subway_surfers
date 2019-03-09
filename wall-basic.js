function Wall(gl,x,y,z,len,hgt,wid) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
	var normalBuffer = gl.createBuffer();
  const textureCoordBuffer = gl.createBuffer();
  var obj_rot = 0;
let init = () =>{
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    // Front face
    -len, -hgt,  wid,
     len, -hgt,  wid,
     len,  hgt,  wid,
    -len,  hgt,  wid,

    // Back face
    -len, -hgt, -wid,
    -len,  hgt, -wid,
     len,  hgt, -wid,
     len, -hgt, -wid,

    // Top face
    -len,  hgt, -wid,
    -len,  hgt,  wid,
     len,  hgt,  wid,
     len,  hgt, -wid,

    // Bottom face
    -len, -hgt, -wid,
     len, -hgt, -wid,
     len, -hgt,  wid,
    -len, -hgt,  wid,

    // Right face
     len, -hgt, -wid,
     len,  hgt, -wid,
     len,  hgt,  wid,
     len, -hgt,  wid,

    // Left face
    -len, -hgt, -wid,
    -len, -hgt,  wid,
    -len,  hgt,  wid,
    -len,  hgt, -wid,
  ];  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
          // Front
          1.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          // Back
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          // Top
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          // Bottom
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          // Right
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          // Left
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
        ];
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
          gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    
        var vertexNormals = [
          // Front
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
    
          // Back
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
    
          // Top
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
    
          // Bottom
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
    
          // Right
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
    
          // Left
          -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
        ];
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
          gl.STATIC_DRAW);
    
};
  let draw = (gl,VP,projectionMatrix, programInfo,texture,scale) =>{
      var modelViewMatrix = mat4.create();
      mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        location);  // amount to translate
      // mat4.rotate(modelViewMatrix,
      // modelViewMatrix,
      // obj_rot,
      // [0, 1, 0]);
      // mat4.scale(modelViewMatrix,
      //   modelViewMatrix,
      //   scale);
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
      }

      gl.useProgram(programInfo.program);
      const normalMatrix = mat4.create();
	  	// mat4.invert(normalMatrix, modelViewMatrix);
      // mat4.transpose(normalMatrix, normalMatrix);
      // mat4.transpose(normalMatrix, normalMatrix);
      // gl.uniformMatrix4fv(
      //   programInfo.uniformLocations.normalMatrix, 
      //   false, 
      //   normalMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix); 

      gl.activeTexture(gl.TEXTURE0);
      let bind_texture = texture;
      gl.bindTexture(gl.TEXTURE_2D, bind_texture);
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
      // {
      //   const numComponents = 3;
      //   const type = gl.FLOAT;
      //   const normalize = false;
      //   const stride = 0;
      //   const offset = 0;
      //   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      //   gl.vertexAttribPointer(
      //     programInfo.attribLocations.vertexNormal,
      //     numComponents,
      //     type,
      //     normalize,
      //     stride,
      //     offset);
      //   gl.enableVertexAttribArray(
      //     programInfo.attribLocations.vertexNormal);
      //   }      
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      return gl;
  };

  let tick = () => {
    obj_rot += 0.01
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
