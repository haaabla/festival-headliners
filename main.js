var THREE, dataArray, analyser, getByteFrequencyData;

var startExperience = false;
var interface = $('#interface');

interface.on('click', () => {
    interface.fadeOut('slow');
    startExperience = true;
    changeTrack(track);
});

function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    // Render setup
    var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true });
    renderer.setClearColor( 0x00f00 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Scene Add
    scene.add( getMountain( 100, 0, 50 ) );
    scene.add( getMountain( 100, 0, -100 ) );
    scene.add( getMountain( 100, 0, -250 ) );
    scene.add( getMountain( -100, 0, 50 ) );
    scene.add( getMountain( -100, 0, -100 ) );
    scene.add( getMountain( -100, 0, -250 ) );

    // Camera
    var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 3000 );

    var cameraZPosition = new THREE.Group();
    var cameraYRotation = new THREE.Group();

    cameraZPosition.name = 'cameraZPosition';
    cameraYRotation.name = 'cameraYRotation';

    cameraZPosition.add( camera );
    cameraYRotation.add( cameraZPosition );
    scene.add( cameraYRotation );

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
    getMountain( 100, 0, 50 ).then(mesh => {
        animate( composer, scene, camera, controls );
    });

    return scene;
}

var log = true;

function animate( composer, scene, camera, controls ) {
    controls.update();
    composer.render( scene, camera );

    if (log === true) {
        console.log( scene.children );
        log = false
    }

    if (startExperience) {
        var cameraZ = scene.getObjectByName('cameraZPosition');
        cameraZ.position.z -= 0.25;

        for (var i = 3; i <= (scene.children.length-1); i++) {
            scene.children[i].geometry.vertices[78].y = 0.01 * dataArray[3];
            scene.children[i].geometry.vertices[66].y = 0.005 * dataArray[7];
            scene.children[i].geometry.vertices[50].y = 0.01 * dataArray[17];
            scene.children[i].geometry.vertices[53].y = 0.005 * dataArray[10];
            scene.children[i].geometry.vertices[14].y = 0.005 * dataArray[1];
            scene.children[i].geometry.vertices[33].y = 0.01 * dataArray[3];
            scene.children[i].geometry.vertices[20].y = 0.01 * dataArray[1];
            scene.children[i].geometry.vertices[10].y = 0.01 * dataArray[8];
            scene.children[i].geometry.verticesNeedUpdate = true;
        }

        analyser.getByteFrequencyData( dataArray );
    }


    requestAnimationFrame(() => {
        animate( composer, scene, camera, controls )
    });
}

var scene = init();
