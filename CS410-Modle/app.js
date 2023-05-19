const OBJLoader = require('three/examples/jsm/loaders/OBJLoader.js').OBJLoader;


// Create the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

// Create the renderer and add it to the page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// Create a ground plane
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// Load the spine model
const loader = new OBJLoader();
loader.load('Test.obj', (object) => {
  // Add the model to the scene
  scene.add(object);

  // Position and scale the model
  object.position.set(0, 5, 0);
  object.scale.set(0.5, 0.5, 0.5);

  // Create a physics body for the model
  const spineShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  const spineBody = new CANNON.Body({ mass: 1 });
  spineBody.addShape(spineShape);
  spineBody.position.set(0, 5, 0);
  world.addBody(spineBody);

  // Create controls for the spine model
  const guiFolder = gui.addFolder('Spine');
  guiFolder.add(object.position, 'x', -10, 10).name('X position');
  guiFolder.add(object.position, 'y', 0, 10).name('Y position');
  guiFolder.add(object.position, 'z', -10, 10).name('Z position');
  guiFolder.add(object.rotation, 'x', -Math.PI, Math.PI).name('X rotation');
  guiFolder.add(object.rotation, 'y', -Math.PI, Math.PI).name('Y rotation');
  guiFolder.add(object.rotation, 'z', -Math.PI, Math.PI).name('Z rotation');
  guiFolder.add(object.scale, 'x', 0, 1).name('X scale');
  guiFolder.add(object.scale, 'y', 0, 1).name('Y scale');
  guiFolder.add(object.scale, 'z', 0, 1).name('Z scale');
});

// Create the GUI
const gui = new dat.GUI();

// Start the animation loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  // Render the scene
  renderer.render(scene, camera);
}
animate();
