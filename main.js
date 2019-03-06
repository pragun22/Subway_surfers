
const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const player = Player(gl,-0.5,0.5,-0.2);
var tracks = []
tracks.push(Track(gl,-0.5,0,-1));
var target = [-0.5, 0.6, -0.2]
var eye = [-0.5, 1.2, -2.4];
const textures = {
      lightwood: loadTexture(gl, 'lightwood.jpeg'),
      rail: loadTexture(gl,'rail1.jpg'),
      legyel: loadTexture(gl,'lego_yellow.jpeg'),
      legbl: loadTexture(gl,'lego_blue.jpeg'),
      leggr: loadTexture(gl,'lego_green.jpg'),
    };
main();
function main() {
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
  `;

  // Fragment shader program
  const fsSource = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };

    player.init();
    tracks.forEach(track => {
      track.init();
    });
    var then = 0;
    function render(now) {
      eye[2]+=0.05      
      target[2]+=0.05;
      player.location[2] += 0.05;
      Mousetrap.bind(["left", "a"], () => {
        // console.log("check2")
        player.location[0]+=0.5
      });
      Mousetrap.bind(["d", "right"], () => {
        // console.log("check1")        
        player.location[0]-=0.5          
      });
      Mousetrap.bind(["w"], () => {
        // console.log("check3")        
        eye[2]+=0.05      
        target[2]+=0.05;
        player.location[2] += 0.05;
        // tracks[0].location[2] -= 0.05;
        // Player.reset(eye[2]);
      });
      Mousetrap.bind(["s"], () => {
        // console.log("check3")        
        eye[2]-=0.05;
        target[2]-=0.05;
        player.location[2] -= 0.05;
        // tracks[0].location[2] += 0.05;

        // player.reset(eye[2]);          
      });
      tick();
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        drawScene(gl, programInfo, deltaTime);
        // console.log("calling again and again")
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    }
  let tick = () => {
    // console.log(player.location[2])
    // console.log(tracks[0].location[2])
    if ( player.location[2] - tracks[0].location[2] > 4 ){
      console.log(player.location[2]);
      tracks.push(Track(gl,-0.5,0,player.location[2]+0.8));
      tracks[1].init()
      console.log(tracks[0].location[2])
      tracks.shift();
    }
  };
  function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.2, 0.5, 0.4, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 60 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
                      fieldOfView,
                      aspect,
                      zNear,
                      zFar);
                      
    var modelViewMatrix = mat4.create();
    mat4.lookAt(modelViewMatrix, eye, target, [0, 1, 0]);
    tex = [textures.legyel,textures.legbl,textures.leggr]
    gl = player.draw(gl, modelViewMatrix,projectionMatrix, programInfo,tex);
    gl = tracks[0].draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.rail);
    tracks[0].tick();
    player.tick();
};

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
};

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
