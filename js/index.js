var scene, aspect, camera, renderer, directionalLight, ambientLight;
var cat, mouse;

var init = function() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xea74bb);
  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);
  camera.position.z = 11;

  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.lookAt(0,0,0);
  directionalLight.castShadow = true;
  directionalLight.position.set(0,5,15);
  scene.add(directionalLight);

  var helper = new THREE.DirectionalLightHelper(directionalLight);
  scene.add(helper);

  mouse = new THREE.Object3D();
  scene.add(mouse);

  cat = new Cat(mouse);
  scene.add(cat.mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

var render = function() {
  requestAnimationFrame(render);
  cat.render();
  renderer.render(scene, camera);
};

var onMouseMove = function(event) {
  this._vector = this._vector || new THREE.Vector3();
  this._vector.set((event.clientX / window.innerWidth) * 2 - 1,
                  -(event.clientY / window.innerHeight) * 2 + 1,
                  0.5);
  this._vector.unproject(this.camera);

  const dir = this._vector.sub(this.camera.position).normalize();
  const distance = -this.camera.position.z / dir.z;
  const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
  mouse.position.copy(pos);
}

window.addEventListener('mousemove', onMouseMove);

init();
render();