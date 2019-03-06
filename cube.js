function Player(gl,x,y,z) {
  var location = [x,y,z]
  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();  
	const colorBuffer = gl.createBuffer();
  const normalBuffer = gl.createBuffer();
  var rotation_ob = 0
	const textureCoordBuffer = gl.createBuffer();
let init = () =>{
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
  //main body
    -1,-1,0,  //0
    1,-1,0, // 1
    1,1,0, // 2
    -1,1,0, // 3
    
    -1,-1,1, // 4
    1,-1,1, // 5
    1,1,1, // 6
    -1,1,1, // 7

    //head
    -0.5,1,0, //8
    0.5,1,0, //9 
    0.5,1.5,0, //10
    -0.5,1.5,0, //11

    -0.5,1,1, //12
    0.5,1,1, //13
    0.5,1.5,1, // 14
    -0.5,1.5,1, //15

    //legs
    -1,-1.5,0, //16
    -1.0/8.0,-1.5,0, //17
    -1.0/8.0,-1,0, //18
    -1,-1,0, //19

    -1,-1.5,1, //24
    -1.0/8.0,-1.5,1, //25
    -1.0/8.0,-1,1, //26
    -1,-1,1, //27

    1.0/8.0,-1.5,0, //20
    1,-1.5,0, //21
    1,-1,0, //22
    1.0/8.0,-1,0, //23

    1.0/8.0,-1.5,1, //28
    1,-1.5,1, //29
    1,-1,1, //30
    1.0/8.0,-1,1, //31
    ];
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // const faceColors = [
    //   [1.0,  0.69,  0.39,  1.0],    
    //   [1.0,  0.69,  0.39,  1.0], // body sandy    

    //   [0.69,  0.0,  0.46,  1.0],    
    //   [0.69,  0.0,  0.46,  1.0], //head purples   
      
    //   [0.69,  0.0,  0.0,  1.0],    
    //   [0.69,  0.0,  0.0,  1.0],    

    //   [0.69,  0.0,  0.0,  1.0],    
    //   [0.69,  0.0,  0.0,  1.0],    // legs
    // ];
    // var colors = [];
    // for (var j = 0; j < faceColors.length; ++j) {
    //   const c = faceColors[j];
    //   colors = colors.concat(c, c, c, c);
    // }
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    var indices = [];
    for(var i=0;i<4*8;i+=8){
      indices.push(
        0+i,1+i,2+i,  0+i,3+i,2+i,
        4+i,5+i,6+i, 4+i,7+i,6+i,
    
        0+i,4+i,5+i, 0+i,1+i,5+i,
        7+i,3+i,6+i, 3+i,6+i,2+i,
    
        0+i,4+i,7+i, 3+i,7+i,0+i,
        1+i,5+i,6+i, 6+i,2+i,1+i,  
      );
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    var textureCoordinates = []
    for(var i = 0 ; i < 4; i++){
      textureCoordinates.push( 
        // Front
        0.0, 0.0,
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
      );
    }

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
			gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    var vertexNormals = []
    for(var i = 0 ; i<4 ; i++){
      vertexNormals.push(

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
      );
    }
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
			gl.STATIC_DRAW);

};
  let draw = (gl,VP,projectionMatrix, programInfo,textures) =>{
      var modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        location);  // amount to translate
      mat4.rotate(modelViewMatrix,
      modelViewMatrix,
      rotation_ob,
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
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  		gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  		gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
      gl.useProgram(programInfo.program);
      const normalMatrix = mat4.create();
	  	mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);
      
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix, 
        false, 
        normalMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix); 

    gl.activeTexture(gl.TEXTURE0);
		let bind_texture = textures;
		gl.bindTexture(gl.TEXTURE_2D, bind_texture);
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexNormal,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexNormal);
		}    
      gl.drawElements(gl.TRIANGLES, 36*4, gl.UNSIGNED_SHORT, 0);
        // console.log("returned new gl")
      return gl;
  };

  let tick = () => {
    rotation_ob += 0.01
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
