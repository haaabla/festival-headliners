var THREE, dataArray, analyser, getByteFrequencyData, audio, camZ;

var startExperience = false;
var paused = true;

var interface = $('#interface');
var webgl = $('#webgl');

interface.on('click', () => {
    interface.fadeOut('slow');
    startExperience = true;
    changeTrack( trackNumber );
    trackNumber++;
});

webgl.on('click', () => {
    if (paused) {
        normalSpeed = 0;
        audio.pause();
        paused = false;
    } else if (!paused) {
        normalSpeed += 0.25;
        audio.play();
        paused = true;
    }
});

function init() {
    var scene = new THREE.Scene();
    // var gui = new dat.GUI();
    // var stats = new Stats();
    // document.body.appendChild(stats.dom);

    var renderer = setupRenderer();

    scene.add( getParticleSystem( 20000, 500, 200) );

    // Scene Add
    scene.add( getMountain( 100, 0, -100 ) );
    scene.add( getMountain( 100, 0, -250 ) );
    scene.add( getMountain( -100, 0, 50 ) );
    scene.add( getMountain( -100, 0, -100 ) );
    scene.add( getMountain( -100, 0, -250 ) );

    // Camera
    var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 600 );

    var cameraZPosition = new THREE.Group();
    var cameraYRotation = new THREE.Group();

    cameraZPosition.name = 'cameraZPosition';
    cameraYRotation.name = 'cameraYRotation';

    cameraZPosition.add( camera );
    cameraYRotation.add( cameraZPosition );
    scene.add( cameraYRotation );

    cameraZPosition.position.y = 3;
    cameraZPosition.position.z = 250;

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
    var files = [
        path + 'space' + format, path + 'space' + format, path + 'space' + format,
        path + 'space' + format, path + 'space' + format, path + 'miami' + format
    ];
    var skyMap = new THREE.CubeTextureLoader().load( files );
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

var artists = [ "Martin Garrix", "Mickey Valen", "Chainsmokers", "Ingrosso", "and many more..." ];
var text = getArtist( artists[0], -12, 2, -45 );
var artistCount = 1;
var nextArtistZPosition = -305;
var currentArtist = false;
var removeArtist = true;
var removeArtistZPosition = -220;
var centerArtistPosition = [ -12, -13, -8, -15 ];
var centerArtistCount = 0;
var normalSpeed = 0.25;
var planeZPosition = -250;
var addMountains = -300;
var milestoneMin = -10;
var milestoneMax = -10.5;

function animate( composer, scene, camera, controls ) {
    controls.update();
    // stats.update();
    composer.render( scene, camera );

    if (startExperience) {

        var camZ = scene.getObjectByName('cameraZPosition');
        camZ.position.z -= normalSpeed;

        if (camZ.position.z < milestoneMin && camZ.position.z > milestoneMax) {
            if ( trackNumber < 5 ) {
                changeTrack( trackNumber );
            }

            var plane = scene.getObjectByName('plane');
            plane.position.z = planeZPosition;
            planeZPosition -= 260;
            // console.log('planeZPosition', planeZPosition);

            for (var i = 0; i < scene.children.length; i++) {
                if (scene.children[i].name === 'text') {
                    scene.children[i].material.emissive.r = 1;
                    scene.children[i].material.emissive.g = 0;
                    scene.children[i].material.emissive.b = 1;
                    currentArtist = i;
                }
            }

            getArtist( artists[ artistCount ], centerArtistPosition[ centerArtistCount ], 2, nextArtistZPosition );
            for (var i = 0; i < 4; i++) {
                scene.add( getMountain( 100, 0, addMountains ) );
                scene.add( getMountain( -100, 0, addMountains ) );
                addMountains -= 150;
                }

            milestoneMin -= 260;
            milestoneMax -= 260;
            nextArtistZPosition -= 260;
            centerArtistCount++;
            artistCount++;
            trackNumber++;
            removeArtist = true;

            scene.add( getParticleSystem( 20000, 500, milestoneMin) );
        }

        if (currentArtist) {
            if (trackNumber === 6) {
                scene.children[ currentArtist ].position.z -= 0;
                setTimeout( () => {
                    $('#call-to-action').fadeIn('slow', () => {
                    $('#call-to-action').css({
                        visibility: 'visible',
                        opacity: 1,
                        transition: 'opacity 2.5s ease-in'
                        });
                    });
                }, 2500);
            } else {
                scene.children[ currentArtist ].position.z -= normalSpeed;
            }

            if (camZ.position.z < removeArtistZPosition && removeArtist) {
                removeArtist = false;
                removeArtistZPosition -= 260;
                scene.remove( scene.children[ currentArtist ] );
            }
        }

        // Mountains
        if (trackNumber > 1) {
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
        }

        // console.log(dataArray);

        analyser.getByteFrequencyData( dataArray );
    }

    requestAnimationFrame(() => {
        animate( composer, scene, camera, controls )
    });
}

var scene = init();
