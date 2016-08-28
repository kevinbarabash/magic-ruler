var scene, camera, renderer;
var geometry, material, mesh, texture;

const width = window.innerWidth;
const height = window.innerHeight;

const lineWidth = 50;

const genCorners = (head, tail, width) => {
    const angle = Math.atan2(tail.x - head.x, tail.y - head.y);
    const wsin = (width / 2) * Math.sin(angle);
    const wcos = (width / 2) * Math.cos(angle);

    return [
        new THREE.Vector3(head.x + wcos, head.y - wsin),
        new THREE.Vector3(tail.x + wcos, tail.y - wsin),
        new THREE.Vector3(tail.x - wcos, tail.y + wsin),
        new THREE.Vector3(head.x - wcos, head.y + wsin)
    ];
};



function init() {
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(0, width, height, 0, 1, 1000);
    camera.position.z = 1000;

    geometry = new THREE.Geometry();

    const head = new THREE.Vector2(100, 100);
    const tail = new THREE.Vector2(500, 300);

    geometry.vertices = genCorners(head, tail, lineWidth);

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
    texture.repeat.set( head.distanceTo(tail) / lineWidth, 1 );

    material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x7f7f7f, 1.0);
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

let down = false;

let head = null;
let tail = null;


document.addEventListener('mousedown', function(e) {
    down = true;

    geometry = new THREE.Geometry();

    head = new THREE.Vector2(e.pageX, height - e.pageY);
    const tail = new THREE.Vector2(head.x, head.y);

    geometry.vertices = genCorners(head, tail, lineWidth);

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

    if (texture) {
        texture = texture.clone();
        texture.needsUpdate = true;
    } else {
        // THREE complains about texture not being power of 2 b/c we're using
        // texture.wrapS = THREE.RepeatWrapping;
        texture = new THREE.TextureLoader().load( "textures/basketball.png" );
    }

    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set( head.distanceTo(tail) / lineWidth, 1 );

    material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );

    mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );
});

document.addEventListener('mousemove', function(e) {
    if (down) {
        tail = new THREE.Vector2(e.pageX, height - e.pageY);

        const corners = genCorners(head, tail, lineWidth);
        for (let i = 0; i < 4; i++) {
            geometry.vertices[i].x = corners[i].x;
            geometry.vertices[i].y = corners[i].y;
        }

        geometry.verticesNeedUpdate = true;

        const length = head.distanceTo(tail);
        mesh.material.map.repeat.set( length / lineWidth, 1 );
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
