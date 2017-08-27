console.log('mainjs <3?');

function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    // Render setup
    var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true });
    renderer.setClearColor( 0x00f00 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Scene Add
    var cubeX = cube();
    scene.add( cubeX );

    // Camera
    var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 3000 );

    var cameraZPosition = new THREE.Group();
    var cameraYRotation = new THREE.Group();

    cameraZPosition.name = 'cameraZPosition';
    cameraYRotation.name = 'cameraYRotation';

    cameraZPosition.add(camera);
    cameraYRotation.add(cameraZPosition);
    scene.add( cameraYRotation ) ;

    cameraZPosition.position.y = 3;
    cameraZPosition.position.z = 250;

    gui.add(cameraZPosition.position, 'z', -1000, 1000);
    gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
    gui.add(cameraYRotation.rotation, 'x', -Math.PI, Math.PI);

    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    // Effects & Shaders
    var composer = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    var vignetteEffect = new THREE.ShaderPass(THREE.VignetteShader);
    vignetteEffect.uniforms['darkness'].value = 1.6;
    composer.addPass(vignetteEffect);

    var rgbShiftShader = new THREE.ShaderPass(THREE.RGBShiftShader);
    rgbShiftShader.uniforms['amount'].value = 0.003;
    rgbShiftShader.renderToScreen = true;
    composer.addPass(rgbShiftShader);

    // Skymap
    var path = './assets/';
    var format = '.jpg';
    var urls = [
        path + 'space' + format, path + 'space' + format,
        path + 'space' + format, path + 'space' + format,
        path + 'space' + format, path + 'miami' + format
    ];
    var skyMap = new THREE.CubeTextureLoader().load(urls);
    skyMap.format = THREE.RGBFormat;

    skyMap.generateMipmaps = false;
    skyMap.minFilter = THREE.LinearFilter;
    skyMap.magFilter = THREE.LinearFilter;

    scene.background = skyMap;

    // Grid
    var size = 500;
    var divisions = 100;
    var lineColor = '#D6017D';

    var plane1 = new THREE.GridHelper( size, divisions, lineColor, lineColor );
    scene.add( plane1 );
    plane1.name = 'plane';

    // Animate
    animate( composer, scene, camera, controls );

    return scene;
}

function animate( composer, scene, camera, controls ) {
    controls.update();
    composer.render( scene, camera );

    // console.log(camera);

    var cameraZ = scene.getObjectByName('cameraZPosition');
    cameraZ.position.z -= 0.1;

    var cubeMesh = scene.getObjectByName('cubie');
    cubeMesh.rotation.x += 0.1;
    cubeMesh.rotation.y += 0.1;

    requestAnimationFrame(() => {
        animate( composer, scene, camera, controls )
    });
}

init();
