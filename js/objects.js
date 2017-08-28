var playlist = ["synthwaveAudio","garrixAudio","valenAudio", "chainsmokersAudio", "ingrossoAudio"];

var track = 0;

function changeTrack(track) {
    var ctx = new AudioContext();
    audio = document.getElementById( playlist[ track ] );
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
            // mesh.name = 'mountain';

            // wireframe
            var material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: '#D6017D'
            });
            var mesh = new THREE.Mesh( geometry, material );
            mesh.scale.set( 25, 25, 25 );
            mesh.position.set( x, y, z );

            scene.add( mesh );
            // mesh.name = 'mountain-wf';

            resolve( mesh );
        });
    });
}

function getText( text ) {
    var loader = new THREE.FontLoader();
    loader.load('./assets/fonts/helvetiker_regular.typeface.json', font => {
        console.log('getText SPAWNED:', text);
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
        textMesh.position.set(-12, 2, -25);

        textMesh.name = 'text';

        scene.add( textMesh );
    });
}
