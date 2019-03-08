
const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const player = Player(gl,0,0.5,-0.2);
var tracks = [];
var walls = [];
var obstacle = [];
var bridge = [];
var coins = [];
var boots = [];
var flying = [];
var newobs = [];
var jumpcoins = [];
alt = [-1.2, 0 ,1.2]
bridge.push(Bridge(gl,0,0,24,0.9));
tracks.push(Basic(gl, 1.2, 0, 0,0.35 ,100.5 ,0.12));
tracks.push(Basic(gl, -1.2, 0, 0,0.35 ,100.5 ,0.12));
tracks.push(Basic(gl, 0.0, 0, 0,0.35 ,100.5 ,0.12));
walls.push(Basic2(gl,1.5,2,0,0.1,5.0,100.0));
walls.push(Basic2(gl,-1.5,2,0,0.1,5.0,100.0));
obstacle.push(Basic2(gl,0,0,5.5,0.25,0.6,0.1));
for(var i = 0 ; i < 4 ; i++){
  coins.push(Circle(gl,alt[i%3],0.4,15-i*1.5,0.2));
}
var target = [0, 0.6, -0.2]
var eye = [0, 1.4, -3.1];
const textures = {
  lightwood: loadTexture(gl, './images/lightwood.jpeg'),
  rail: loadTexture(gl,'./images/tron.jpeg'),
  legyel: loadTexture(gl,'./images/lego_yellow.jpeg'),
  legbl: loadTexture(gl,'./images/lego_blue.jpeg'),
  leggr: loadTexture(gl,'./images/lego_green.jpg'),
  wall: loadTexture(gl,'./images/tron_wall3.JPG'),
  hurdle : loadTexture(gl,'./images/hurdle3.jpeg'),
  build : loadTexture(gl,'./images/build3.jpeg'),
  // coin : loadTexture(gl,'./images/lego_red.jpg'),
  coin : loadTexture(gl,'./images/coin2.png'),
  t2 : loadTexture(gl,'./images/t2.jpeg'),
};
var speedx = 0;
var speedy = 0;
var speedz = 0.05;
var isjump = 0;
var mag_time = 0;
var temp = 0;
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
    setInterval(() => {
      speedz += 0.05;
      mag_time += 0.003;
  }, 30 * 1000);
  setInterval(() => {
      obstacle.push(Basic2(gl,0,0,player.location[2]+25.5,0.25,0.6,0.1)); 
      obstacle.shift();
      obstacle[0].init();
    }, 12 * 1000);
    setInterval(() => {
        var a = (Math.floor(Math.random() * 10))%2;
        var b = (Math.floor(Math.random() * 10) > 5? 1 : -1);
        bridge.push(Bridge(gl,a*b,0,player.location[2]+24,0.9)); 
        bridge.shift();
        bridge[0].init();
      }, 16 * 1000);
      setInterval(() => {
        coins = [];
        for(var i = 0 ; i < 9 ; i++){
          var a = Math.floor(Math.random() * 10);          
          coins.push(Circle(gl,alt[(i+a)%3],0.4,player.location[2]+30-i*1.5,0.2));
        }
        coins.forEach(coin => {
          coin.init();
        });
      }, 20 * 1000);
      player.init();
      tracks.forEach(track => {
        track.init();
      });
      walls.forEach(wall => {
        wall.init();
      });
      obstacle.forEach(obs => {
        obs.init();
      });
      bridge.forEach(br => {
        br.init();
      });
      coins.forEach(coin => {
        coin.init();
      });
    var then = 0;
    function render(now) {
      eye[2]+=speedz;      
      target[2]+=speedz;
      player.location[2] +=speedz;
      Mousetrap.bind(["left", "a"], () => {
        speedx = 0.05+mag_time;
        temp = 1.2
      });
      Mousetrap.bind(["d", "right"], () => {
        
        speedx = -0.05-mag_time;
        temp = 1.2
      });
      Mousetrap.bind(["s"], () => {
        eye[2]-=0.05;
        target[2]-=0.05;
        player.location[2] -= 0.05;
      });
      Mousetrap.bind(["w", "space"], () => {
        if(isjump==0) {
          isjump = 1;
          speedy = 0.055;
        }
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
    
    if(isjump==1){
      player.location[1]+=speedy;
      speedy -= 0.002;
      if(player.location[1] < 0 ){
        isjump = 0;
        speedy = 0;
        player.location[1] = 0;
      } 
    }
    
    if(temp>0){
      player.location[0]+=speedx;
      if(speedx < 0){
        temp+=speedx;
      }
      else{
        temp-=speedx;
      } 
    };
    if ( player.location[2] - tracks[0].location[2] > 20 ){
      var t = player.location[2];      
      // tracks.push(Basic(gl, 1.2, 0, 0,0.35 ,t+20 ,0.12));
      // tracks.push(Basic(gl, -1.2, 0, 0,0.35 ,t+20 ,0.12));
      // tracks.push(Basic(gl, 0.0, 0, 0,0.35 ,t+20 ,0.12));
      
      tracks.forEach(track => {
        track.location[2]= player.location[2];
      });
      walls.forEach(wall => {
        wall.location[2]= player.location[2];
      });
    }
    // eye[0] = 3*player.location[0]/5;
    // target[0] = 3*player.location[0]/5;
  };
  function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.21, 0.35, 0.42, 0.5);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
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
    player.draw(gl, modelViewMatrix,projectionMatrix, programInfo,tex);
    bridge.forEach(obs => {
      obs.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.build);
    });
    // console.log(modelViewMatrix)
    // console.log("b")
    tracks.forEach(track => {
      track.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.rail);
    });
    walls.forEach(wall => {
      wall.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.wall);
    });
    obstacle.forEach(obs => {
       obs.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.hurdle);
    });
    coins.forEach(coin => {
       coin.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.coin);
    });
    // console.log("a")
    // console.log(modelViewMatrix)
    // tracks.forEach(track => {
    //   track.tick();
    // });
    coins.forEach(coin => {
      coin.tick();
    });
    player.tick();
};
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
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
