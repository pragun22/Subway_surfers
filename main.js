const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
const audio = $("#bgmp3")[0];
const audio1 = $("#coin")[0];
const audio2 = $("#gaurd")[0];
const audio3 = $("#stum")[0];
const jetaud = $("#jet")[0];
const jumpaud = $("#jump")[0];
var police;
var tracks = [];
var walls = [];
var obstacle = [];
var bridge = [];
var coins = [];
var boots = [];
var trains = [];
var flying = [];
var newobs = [];
var jumpcoins = [];
var score = 0;
var superjump = false;
var isjet = false;
var theta = 0;
var train_stand = false;
var speedx = 0;
var speedy = 0;
var speedz = 0.05;
var isjump = 0;
var mag_time = 0;
var temp = 0;
var shad = 0;
const alt = [-1.2, 0 ,1.2];
const alt_1 = [-0.9, 0 ,0.9];

const player = Player(gl,0,0.4,-0.2);
const dog = Dog(gl,0.5,0.4,-0.2);
flying.push(Jet(gl,0,0.8,10));
trains.push(Train(gl,0,0,35,2));
police = Player(gl,0,0.5,0);
boots.push(Shoes(gl,0,1,13));
bridge.push(Bridge(gl,-1,0,24,0.9));
tracks.push(Basic(gl, 1.2, 0, 0,0.35 ,100.5 ,0.12));
tracks.push(Basic(gl, -1.2, 0, 0,0.35 ,100.5 ,0.12));
tracks.push(Basic(gl, 0.0, 0, 0,0.35 ,100.5 ,0.12));
walls.push(Wall(gl,1.5,2,0,0.1,5.0,100.0));
walls.push(Wall(gl,-1.5,2,0,0.1,5.0,100.0));
obstacle.push(Basic2(gl,0,0,5.5,0.35,0.6,0.1));
for(var i = 0 ; i < 4 ; i++){
  coins.push(Circle(gl,alt[i%3],0.4,15-i*1.5,0.2,0.05));
}
var target = [0, 0.6, -0.2]
var eye = [0, 1.4, -3.1];
var follow = 10;
const textures = {
  lightwood: loadTexture(gl, './images/lightwood.jpeg'),
  rail: loadTexture(gl,'./images/tron.jpeg'),
  legyel: loadTexture(gl,'./images/lego_yellow.jpeg'),
  legbl: loadTexture(gl,'./images/lego_blue.jpeg'),
  leggr: loadTexture(gl,'./images/lego_green.jpg'),
  legbr: loadTexture(gl,'./images/lego_brown.jpg'),
  wall: loadTexture(gl,'./images/tron_wall3.JPG'),
  hurdle : loadTexture(gl,'./images/hurdle3.jpeg'),
  build : loadTexture(gl,'./images/build3.jpeg'),
  coin : loadTexture(gl,'./images/coin2.png'),
  shoe : loadTexture(gl,'./images/tiles.jpeg'),
  ts : loadTexture(gl,'./images/tt.png'),
  tf : loadTexture(gl,'./images/tf2.jpg'),
  jet : loadTexture(gl,'./images/jet.jpg'),
  police : loadTexture(gl,'./images/police.jpeg'),
  pol : loadTexture(gl,'./images/pol.jpeg'),
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
  var fsSource= []
  fsSource.push(`
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
  `);
  fsSource.push(`
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    precision highp float;
    vec4 color = texture2D(uSampler, vTextureCoord);
    float gray = dot(color.rgb, vec3(0.299,0.587,0.114));
    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    gl_FragColor = vec4(vec3(gray),1.0);
  }
  `);

    var shaderProgram = initShaderProgram(gl, vsSource, fsSource[0]);
    var programInfo = {
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
        var inc = (Math.floor(Math.random() * 10))%3;
        boots.push(Shoes(gl,alt_1[inc],1,player.location[2]+11)); 
        boots.shift();
        boots[0].init();
    }, 18 * 1000);

      setInterval(() => {
        var inc = (Math.floor(Math.random() * 10))%3;
        trains.push(Train(gl,alt_1[inc],0,player.location[2]+31,2)); 
        trains.shift();
        trains[0].init();
    }, 25 * 1000);

      setInterval(() => {
        speedz += 0.01;
        mag_time += 0.003;
    }, 20 * 1000);

      setInterval(() => {
        var inc = (Math.floor(Math.random() * 10))%3;
        obstacle.push(Basic2(gl,alt[inc],0.3,5.5,0.35,0.3,0.1)); 
        obstacle.shift();
        obstacle[0].init();
    }, 13 * 1000);

      setInterval(() => {
        var inc = (Math.floor(Math.random() * 10))%3;
        flying.push(Jet(gl,alt_1[inc],0.8,player.location[2]+14));
        flying.shift();
        flying[0].init();
    }, 13 * 1000);

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
          coins.push(Circle(gl,alt_1[(i+a)%3],0.4,player.location[2]+30-i*1.5,0.2));
        }
          coins.forEach(coin => {
            coin.init();
          });
      }, 20 * 1000);


      player.init();
      police.init();
      dog.init();
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
      boots.forEach(boot => {
        boot.init();
      });
      trains.forEach(train => {
        train.init();
      });
      flying.forEach(jet => {
        jet.init();
      });
      var then = 0;
      function render(now) {
        eye[2]+=speedz;      
        target[2]+=speedz;
        player.location[2] +=speedz;
        Mousetrap.bind(["left", "a"], () => {
          if(temp == 0)
          {
            if(player.location[0] > 1.1){
              audio2.play();
              if(follow < 0.9) alert('Game Over');
              follow = 0.7;
              // speedz -= 0.01;
              player.location[0] -= 0.3;
              temp = 0.3;
              speedx = 0.03;
              setTimeout(()=>{
                follow = 10;
                speedz += 0.01;
              },7000);
            }
            speedx = 0.065+mag_time;
            temp = 1.2
          }
        });
        Mousetrap.bind(["d", "right"], () => {
          if(temp==0)
          {
            // console.log(player.position[0]);
            if(player.location[0] < -1.1){
              audio2.play();
              if(follow < 0.9) alert('Game Over');
              follow = 0.7;
              player.location[0] += 0.3;
              temp = 0.3;
              speedx = -0.03;
              setTimeout(()=>{
                follow = 10;
                speedz += 0.01;
              },7000);
            }
            else{
              speedx = -0.065-mag_time;
              temp = 1.2
            }
          }          
        });
        Mousetrap.bind(["g"], () => {
          shad ^= 1;
          shaderProgram = initShaderProgram(gl, vsSource, fsSource[shad]);   
          programInfo = {
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
        });
        Mousetrap.bind(["p"], () => {
          audio.play();
        alert("your score is"  + String(score));
      });
      audio.pause();
      Mousetrap.bind(["w", "space"], () => {
        if(isjump==0) {
          isjump = 1;
          superjump?speedy=0.075:speedy = 0.055;
        }
      });
      tick();
      detect();
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
    police.location[0] = player.location[0];
    police.location[2] = player.location[2]-follow;
    if( player.location[0] < 0 ) dog.location[0] = player.location[0]+0.3;
    else dog.location[0] = player.location[0]-0.3;
    dog.location[2] = player.location[2]-1;
    if(isjump==1){
      if(train_stand == false){
        player.location[1]+=speedy;
        speedy -= 0.002;
        if(player.location[1] < 0.4 ){
          isjump = 0;
          speedy = 0;
          player.location[1] = 0.4;
        } 
      }
    }
    else if(isjet){
      jetaud.play();
      player.location[1] = 2 + 0.2*Math.cos(theta*Math.PI/180);
      flying[0].location[0] = player.location[0];
      flying[0].location[1] = player.location[1];
      flying[0].location[2] = player.location[2];
      flying[0].location[2] -=1/6.0;
      theta += 2;
      eye[1] = player.location[1]+0.6;      
    }
    else{
      eye[1] = player.location[1]+1.2;
    }
    if(!isjet)
    {
      jetaud.pause();
      dog.location[1] = player.location[1];
    } 
      
    if(temp>0){
      player.location[0]+=speedx;
      if(speedx < 0){
        temp+=speedx;
      }
      else{
        temp-=speedx;
      } 
      if(temp < 0)
      {
          temp = 0;
          if(player.location[0]< -1.0) player.location[0] = -1.2;
          else if(player.location[0]> 1.0) player.location[0] = 1.2;
          else player.location[0] = 0;        
      } 
    };
    if ( player.location[2] - tracks[0].location[2] > 20 ){
      var t = player.location[2];      
      tracks.forEach(track => {
        track.location[2]= player.location[2];
      });
      walls.forEach(wall => {
        wall.location[2]= player.location[2];
      });
    }
    trains[0].location[2] -= speedz/1.3;
    
  };
  function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.21, 0.35, 0.42, 0.5);  // Clear to black, fully opaque
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
    coins.forEach(coin => {
      coin.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.coin);
      coin.tick();
    });
      
    superjump ? tex = [textures.legyel,textures.legbl,textures.legbr] :tex = [textures.legyel,textures.legbl,textures.leggr]
    walls.forEach(wall => {
      wall.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.wall);
    });
    player.draw(gl, modelViewMatrix,projectionMatrix, programInfo,tex);
    dog.draw(gl, modelViewMatrix,projectionMatrix, programInfo,[textures.legbr,textures.legbr,textures.legbl]);
    police.draw(gl, modelViewMatrix, projectionMatrix, programInfo, [textures.police, textures.police]);
    bridge.forEach(obs => {
      obs.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.build);
    });
    tracks.forEach(track => {
      track.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.rail);
    });
    obstacle.forEach(obs => {
      obs.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.hurdle);
    });
    boots.forEach(boot => {
      boot.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.shoe);
    });
    trains.forEach(train => {
      train.draw(gl, modelViewMatrix, projectionMatrix, programInfo, [textures.tf, textures.ts]);
    });
    flying.forEach(jet => {
      jet.draw(gl, modelViewMatrix, projectionMatrix, programInfo, textures.jet);
    });
  };
  function detect(){
    // console.log(bridge[0].location)
    var bound_player = {
      x : player.location[0]-1/6.0,
      y : player.location[1]-1.25/6.0,
      z : player.location[2]-1/6.0,
      width : 2/6.0,
      depth : 2/6.0,
    height : 2.5/6.0,
  };
  obstacle.forEach(obs => {
    var det = {
      x : obs.location[0]-0.25,
      y : obs.location[1]-0.6,
      z : obs.location[2]-0.1,
      width : 0.5,
      depth : 0.2,
      height : 1.2,
    };
    if (detect_collision(det,bound_player)){
      audio2.play();
      audio3.play();
      speedz -= 0.015;
      if(follow < 0.9) alert('Game Over');      
      obs.location[1] = 4;
      follow = 0.7;
      setTimeout(()=>{
        follow = 10;
        speedz += 0.02;
      },6500);
    }
  });
  bridge.forEach(br => {
    var det = {
      x : br.location[0]-2.3,
      y : br.location[1]-2,
      z : br.location[2]-2,
      width : 1.8,
      height : 4,
      depth : 4,
    };
    var det2 = {
      x : br.location[0]+0.9,
      y : br.location[1]-2,
      z : br.location[2]-2,
      width : 1.8,
      height : 4,
      depth : 4,
    };
    var det3 = {
      x : br.location[0]+0.5,
      y : br.location[1],
      z : br.location[2]-2,
      width : -1,
      height : 4,
      depth : 4,
    };
    if(detect_collision(det,bound_player)){
      alert('wallr');
      audio3.play();
   }
   else if(detect_collision(det2,bound_player)){
    alert('wall-l');
    audio3.play();

    }
  // else if(detect_collision(det3,bound_player)){
  //   eye[0] = player.location[0];
  //   console.log("uo")
  // } 
  // else {
  //   console.log(det3.x,det3.y,det3.z)
  //   eye[0] = 0;
  // }
  });
  coins.forEach(coin => {
    var det = {
      x : coin.location[0]-0.2,
      y : coin.location[1]-0.2,
      z : coin.location[2],
      width : 0.4,
      depth : 0.05,
      height : 0.4,
    };
    if (detect_collision(det,bound_player)){
      audio1.play();
      score += 20;
      coin.location[2] = 10;
    }
  });
  boots.forEach(boot => {
    var det = {
      x : boot.location[0]-0.1,
      y : boot.location[1]-0.2,
      z : boot.location[2],
      width : 0.2,
      depth : 0.2,
      height : 0.3,
      };
      if (detect_collision(det,bound_player)){
        jumpaud.play();        
        superjump = true;
        setTimeout(()=>{
          superjump = false;
        },12*1000);
        boot.location[2] = 10;
      }
    });
    trains.forEach(train => {
    var det = {
      x : train.location[0]-0.3,
      y : train.location[1]+ 0.6,
      z : train.location[2]+1,
      width : 0.6,
      depth : 3.0,
      height : 0.4,
      };
      if (detect_collision(det,bound_player) && (player.location[1]-0.40)>det.y+0.16){
        train_stand = true;
        player.location[1] = 1.5;
      }
      else if (detect_collision(det,bound_player)){
          alert("game ended");
      }
      else if(player.location[2] - train.location[2] > 4.1){
        train_stand = false;
      }
  });
  flying.forEach(jet => {
    var det = {
      x : jet.location[0]-0.15,
      y : jet.location[1]-0.17,
      z : jet.location[2]-0.05,
      width : 0.3,
      depth : 0.1,
      height : 0.34,
      };
      if (detect_collision(det,bound_player)){
        isjet = true;
        isjump = 0;
        setTimeout(()=>{
          isjet = false;
          isjump = 1;
          theta = 0;
        },12*1000);
      }
  }); 
  }
  function detect_collision(a,b) {
    var x = a.x + a.width >= b.x && b.x + b.width >= a.x?true:false;
    var y = a.y + a.height >= b.y && b.y + b.height >= a.y?true:false;       
    var z = a.z + a.depth >= b.z && b.z + b.depth >= a.z?true:false; 
    return (x && y && z);      
  }
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
