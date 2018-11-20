function Cat() {
  var segmentHeight = 1;
  var segmentCount = 16;
  var height = segmentHeight * segmentCount;
  var halfHeight = height / 2;
  this.time = 0;
  this.sizing = { segmentHeight, segmentCount, height, halfHeight };
  var [geometry, tip] = this.createGeometry();
  this.geometry = geometry;
  this.tip = tip;
  this.skeleton = this.createSkeleton();
  var [mesh, tipMesh] = this.createMesh(geometry, tip, this.skeleton);
  this.mesh = mesh;
  this.tipMesh = tipMesh;
}

Cat.prototype.createGeometry = function() {
  var geometry = new THREE.CylinderGeometry(1, 1, this.sizing.height, 32, this.sizing.segmentCount);
  for (var i = 0; i < geometry.vertices.length; i += 1) {
    var vertex = geometry.vertices[i];
    var y = vertex.y + this.sizing.halfHeight;
    var skinIndex = Math.floor(y / this.sizing.segmentHeight);
    var skinWeight = (y % this.sizing.segmentHeight) / this.sizing.segmentHeight;
    
    geometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
    geometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
  }
  
  geometry.rotateZ(Math.PI);
  
  var tip = new THREE.SphereGeometry(2, 16, 16);
  return [geometry, tip];
};

Cat.prototype.createSkeleton = function() {
  var bones = [];

  var prevBone = new THREE.Bone();
  prevBone.position.y = - this.sizing.halfHeight;
  bones.push(prevBone);

  for (var i = 0; i < this.sizing.segmentCount; i += 1) {
    var bone = new THREE.Bone();
    bone.position.y = this.sizing.segmentHeight;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }

  var skeleton = new THREE.Skeleton(bones);
  return skeleton;
};

Cat.prototype.createMesh = function(geometry, tip, skeleton) {
  var material = new THREE.MeshLambertMaterial({ skinning: true, color: 0xffff00 });
  var mesh = new THREE.SkinnedMesh(geometry, material);
  
  var tipMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, sides: THREE.BothSide });
  var tipMesh = new THREE.Mesh(tip, tipMaterial);

  mesh.add(skeleton.bones[0]);
  mesh.bind(skeleton);
  
  return [mesh, tipMesh];
};

Cat.prototype.render = function() {
  for (var i = 1; i < this.mesh.skeleton.bones.length; i += 1) {
    var a = THREE.Math.mapLinear(i, 1, this.mesh.skeleton.bones.length - 1, 0.01, 0.1);
    var r = THREE.Math.mapLinear(Math.sin(this.time + (i * 0.001)), -1, 1, -a, a);
    this.mesh.skeleton.bones[i].rotation.z = r;
  }
  this.time += 0.02;
};