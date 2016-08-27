var scene, camera, renderer;
var geometry, material, mesh, texture;

const width = window.innerWidth;
const height = window.innerHeight;

const lineWidth = 50;


function init() {

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(0, width, height / 2, -height / 2, 1, 1000);
    camera.position.z = 1000;

    const length = 675;
    // geometry = new THREE.PlaneGeometry( length, 200 );

    geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0,0,0));
    geometry.vertices.push(new THREE.Vector3(length,0,0));
    geometry.vertices.push(new THREE.Vector3(length,lineWidth,0));
    geometry.vertices.push(new THREE.Vector3(0,lineWidth,0));

    geometry.faces.push(new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push(new THREE.Face3( 0, 2, 3 ) );

    geometry.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 1)
    ]);

    geometry.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(0, 1)
    ]);

    texture = new THREE.TextureLoader().load( "textures/basketball.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set( length / lineWidth, 1 );

    material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );
    // mesh.position.x = length / 2;
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

let down = false;

let head = null;
let tail = null;


document.addEventListener('mousedown', function(e) {
    down = true;
    head = e.pageX;
});

document.addEventListener('mousemove', function(e) {
    if (down) {
        const length = lineWidth * Math.max(Math.round((e.pageX - head) / lineWidth), 1);

        geometry.vertices[0].x = head;
        geometry.vertices[1].x = head + length;
        geometry.vertices[2].x = head + length;
        geometry.vertices[3].x = head;

        geometry.verticesNeedUpdate = true;

        texture.repeat.set( length / lineWidth, 1 );
    }
});

document.addEventListener('mouseup', function(e) {
    if (down) {

        down = false;
        head = null;
        tail = null;
    }
});


init();
animate();
