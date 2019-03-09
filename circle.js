function Circle(gl,x,y,z,r,h) {
    var location = [x,y,z]
    const positionBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();  
    const colorBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
    const textureCoordBuffer = gl.createBuffer();
    var rot = 0;
    let init = () =>{
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var n = 40;
        var inc = 0;
        var position = []
        for (var i = 0; i < 9*n; i+=9)
        {
            var angle = 2*Math.PI*inc/n;
            // if(inc==n) angle = 0;
            position.push(r*Math.cos(angle));
            position.push(r*Math.sin(angle));
            position.push(0);
            position.push(r*Math.cos(angle));
            position.push(r*Math.sin(angle));
            position.push(h);
            position.push(r*Math.cos(2*Math.PI*+(inc+1)/n));
            position.push(r*Math.sin(2*Math.PI*+(inc+1)/n));
            position.push(0);
            inc++;
        }
        inc = 0;
        for (var i = 0; i < 9*n; i+=9)
        {
            var angle = 2*Math.PI*inc/n;
            position.push(r*Math.cos(angle));
            position.push(r*Math.sin(angle));
            position.push(0);
            position.push(0);
            position.push(0);
            position.push(0);
            position.push(r*Math.cos(2*Math.PI*+(inc+1)/n));
            position.push(r*Math.sin(2*Math.PI*+(inc+1)/n));
            position.push(0);
            inc++;
        }
        inc = 0;
        for (var i = 0; i < 9*n; i+=9)
        {
        var angle = 2*Math.PI*inc/n;
        position.push(r*Math.cos(angle));
        position.push(r*Math.sin(angle));
        position.push(h);
        position.push(r*Math.cos(2*Math.PI*+(inc+1)/n));
        position.push(r*Math.sin(2*Math.PI*+(inc+1)/n));
        position.push(0);
        position.push(r*Math.cos(2*Math.PI*+(inc+1)/n));
        position.push(r*Math.sin(2*Math.PI*+(inc+1)/n));
        position.push(h);
        inc++;
    }
    inc = 0;
    for (var i = 0; i < 9*n; i+=9)
    {
		var angle = 2*Math.PI*inc/n;
		position.push(r*Math.cos(angle));
		position.push(r*Math.sin(angle));
		position.push(h);
		position.push(0);
		position.push(0);
		position.push(h);
		position.push(r*Math.cos(2*Math.PI*+(inc+1)/n));
		position.push(r*Math.sin(2*Math.PI*+(inc+1)/n));
		position.push(h);
        inc++;
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      var indices = [];
      for(var i = 0 ; i<36*n ; i++){
          indices.push(i);
      }
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        var textureCoordinates = []
        inc = 0;
        for(var i = 0 ; i < 4*n ; i++){
            var angle = 2*Math.PI*inc/n;
            
            textureCoordinates.push(0.5 - 0.5*Math.cos(angle));
            textureCoordinates.push(0.5 - 0.5*Math.sin(angle));
            
            textureCoordinates.push(0.5);
            textureCoordinates.push(0.5);

            textureCoordinates.push(0.5 - 0.5*Math.cos(2*Math.PI*+(inc+1)/n));
            textureCoordinates.push(0.5 - 0.5*Math.sin(2*Math.PI*+(inc+1)/n));
            inc++;
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
        gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    
        var vertexNormals = [];
        for (var i = 0; i < 2*n; i++)
        {
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(1);
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(1);
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(1);
        }
        for (var i = 0; i < 2*n; i++)
        {
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(-1);
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(-1);
            vertexNormals.push(0);
            vertexNormals.push(0);
            vertexNormals.push(-1);
        }

    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
        gl.STATIC_DRAW);
      
  };
    let draw = (gl,VP,projectionMatrix, programInfo,texture,scale) =>{
        var modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix,modelViewMatrix,VP);
        mat4.translate(modelViewMatrix,     // destination matrix
          modelViewMatrix,     // matrix to translate
          location);  // amount to translate
        mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        rot,
        [0, 1, 0]);
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
        let bind_texture = texture;
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
        gl.drawElements(gl.TRIANGLES, 40*18*2, gl.UNSIGNED_SHORT, 0);
        return gl;
    };
  
    let tick = () => {
      rot += 0.09
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
  