document.addEventListener("DOMContentLoaded", function () {
  var g_container = undefined;
  var g_renderer = undefined;
  var g_camera = undefined;
  var g_scene = undefined;
  var g_controls = undefined;

  var g_time = undefined;

  initScene('VisContainer');

  /* Skydome */
  var g_skydome = {
    geo: undefined, mat: undefined, obj: undefined,
    radius: undefined
  };
  initSkydome();

  /* Lights */
  var g_light1 = undefined;
  initLights();

  /* Objects  */
  var g_cube = { geo: undefined, mat: undefined, obj: undefined };
  initCube();

  /* Movement */
  g_controls = new THREE.OrbitControls(g_camera, g_renderer.domElement);

  window.addEventListener('resize', () => {
    var width = g_container.offsetWidth;
    var height = g_container.offsetHeight;

    g_skydome.mat.uniforms.width.value = g_container.offsetWidth;
    g_skydome.mat.uniforms.height.value = g_container.offsetHeight;

    g_camera.aspect = width / height;
    g_camera.updateProjectionMatrix();

    g_renderer.setSize(width, height);
  });


  function initScene(canvasDiv) {
    g_container = document.getElementById(canvasDiv);

    var width = g_container.offsetWidth;
    var height = g_container.offsetHeight;

    g_renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: false
    });
    g_renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"))
    g_renderer.setSize(width, height) //< Start the renderer
    g_renderer.gammaInput = true;
    g_renderer.gammaOutput = true;
    g_renderer.shadowMap.enabled = true;
    g_renderer.shadowMap.cullFace = THREE.CullFaceBack;

    // PerspectiveCamera(fov, aspect, near, far)
    g_camera = new THREE.PerspectiveCamera(65, width / height, 2.0, 6000.0)
    g_camera.position.set(0, 2, -15);
    g_camera.lookAt(new THREE.Vector3(0, 0, 0))

    g_scene = new THREE.Scene()

    g_container.append(g_renderer.domElement)
  }


  function initSkydome() {
    var vertexShader = document.getElementById('vsSkydome').textContent;
    var fragmentShader = document.getElementById('fsSkydome').textContent;

    var textureLoader = new THREE.TextureLoader();
    var skyTex = new textureLoader.load('img/skydome/sky.jpg');

    g_skydome.radius = 5000.0;

    var uniforms = {
      //texture:     { type: 't', value: skyTex },
      time: { type: 'f', value: g_time },
      width: { type: 'f', value: g_container.offsetWidth },
      height: { type: 'f', value: g_container.offsetHeight }
    };

    g_skydome.geo = new THREE.SphereGeometry(g_skydome.radius, 32, 32);
    g_skydome.mat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });

    g_skydome.obj = new THREE.Mesh(g_skydome.geo, g_skydome.mat);

    g_scene.add(g_skydome.obj);
  }

  function initLights() {
    // HemisphereLight(skyColorHex, groundColorHex, intensity)
    g_light1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
    g_light1.color.setRGB(1.0, 1.0, 1.0);

    /* 
    ( h, s, l ) 
    h — hue value between 0.0 and 1.0 , s — saturation value between 0.0 and 1.0 
    l — lightness value between 0.0 and 1.0
    */
    g_light1.groundColor.setHSL(0.0, 0.0, 0.0); // ?
    g_light1.position.set(0, 20, 0);

    g_scene.add(g_light1);
  }

  function initCube() {
    g_cube.geo = new THREE.BoxGeometry(1, 1, 1);
    g_cube.mat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading });

    g_cube.obj = new THREE.Mesh(g_cube.geo, g_cube.mat);

    g_scene.add(g_cube.obj);
  }

  function visLoop() {
    requestAnimationFrame(visLoop)
    animationLoop();
  }

  function animationLoop() {
    var d = new Date();
    g_time = d.getTime();
    g_skydome.mat.uniforms.time.value = Math.cos(g_time * 0.00001);

    g_cube.geo.rotateY(0.03);

    g_renderer.render(g_scene, g_camera)
  }

  window.addEventListener('load', (event) => {
    visLoop();
  });

});
