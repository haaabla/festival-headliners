console.log('inside objects wooop');

console.log('mainjs <3?');

function cube(){
    // Object
    var geometry = new THREE.CubeGeometry( 100, 100, 100 );
    var material = new THREE.MeshBasicMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set( 0, 0, -1000 );

    mesh.name = 'cubie';

    return mesh;
}
