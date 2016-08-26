var scene, camera, renderer;
var geometry, material, mesh, texture;

const width = window.innerWidth;
const height = window.innerHeight;

function init() {

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
    camera.position.z = 1000;

    const length = 675;
    geometry = new THREE.PlaneGeometry( length, 200 );

    texture = new THREE.TextureLoader().load( "textures/basketball.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set( length / 200, 1 );

    material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = length / 2;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x7f7f7f, 1.0);
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}


init();
animate();
