function setupRenderer(){
    // Render setup
    var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true });
    renderer.setClearColor( 0x00f00 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    return renderer;
}

var playlist = [ "synthwaveAudio","garrixAudio","valenAudio", "chainsmokersAudio", "ingrossoAudio" ];

trackNumber = 0;

function changeTrack( track ) {
    console.log('changeTrack trackNumber: ', trackNumber);
    if (trackNumber > 0) {
        audio.pause();
    }
    var ctx = new AudioContext();
    audio = document.getElementById( playlist[ track ] );
    console.log('audio: ', audio);
    var audioSrc = ctx.createMediaElementSource( audio );
    analyser = ctx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    audioSrc.connect( analyser );
    audioSrc.connect( ctx.destination );

    var frequencyData = analyser.frequencyBinCount;
    dataArray = new Uint8Array( frequencyData );

    audio.play();
}

function getMountain( x, y, z ) {
    return new Promise(resolve => {
        var loader = new THREE.JSONLoader();
        loader.load('./assets/models/low-poly-mountain.json', geometry => {

            // solid
            var material = new THREE.MeshBasicMaterial({
            	color: '#41215E'
            });
            var mesh = new THREE.Mesh( geometry, material );
            mesh.scale.set( 25, 25, 25 );
            mesh.position.set( x, y, z );

            scene.add( mesh );
            mesh.name = 'mountain';

            // wireframe
            var material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: '#D6017D'
            });
            var mesh = new THREE.Mesh( geometry, material );
            mesh.scale.set( 25, 25, 25 );
            mesh.position.set( x, y, z );

            scene.add( mesh );
            mesh.name = 'mountain-wf';

            resolve( mesh );
        });
    });
}

function getArtist( text, x, y, z ) {
    var loader = new THREE.FontLoader();
    loader.load('./assets/fonts/helvetiker_regular.typeface.json', font => {
        var textGeo = new THREE.TextGeometry(text, {
            font: font,
            size: 3,
            height: 3,
            curveSegments: 5,
            bevelThickness: 0,
            bevelSize: 0.01,
            bevelEnabled: true
        });

        var textMat = new THREE.MeshLambertMaterial({ color: 0xFF00FF });
        var textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.set( x, y, z );

        textMesh.name = 'text';

        scene.add( textMesh );
    });
}

function getParticleSystem( particles, distance, z ) {
    var particleGeo = new THREE.Geometry();
    var particleMat = new THREE.PointsMaterial({
        color: 'rgb(255,255,255)',
        size: 1,
        map: new THREE.TextureLoader().load('./assets/textures/particle.jpg'),
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    var particleCount = particles;
    var particleDistance = distance;

    for (var i = 0; i < particleCount; i++) {
        var posX = (Math.random() - 0.5) * particleDistance;
        var posY = (Math.random() - 0.5) * particleDistance;
        var posZ = (Math.random() - 0.5) * particleDistance;
        var particle = new THREE.Vector3(posX, posY, posZ);

        particleGeo.vertices.push(particle);
    }

    var particleSystem = new THREE.Points( particleGeo, particleMat );
    particleSystem.position.set( 0, 0, z );
    particleSystem.name = 'particleSystem';

    return particleSystem;
}
