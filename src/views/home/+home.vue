<template>
  <div id="home-section" class="h-screen w-screen bg-dark relative">
    <canvas id="home-section-three" class="absolute h-full w-full top-0 left-0" />
  </div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "HomeSection",
  mounted() {
    // SCENE & CAMERA
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer: THREE.WebGL1Renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#home-section-three"),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    renderer.render(scene, camera);

    // TORUS
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus);

    // STARS
    function addStart() {
      const geometry = new THREE.SphereGeometry(0.25, 24, 24);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      const [x, y, z] = Array(3)
        .fill(0)
        .map(() => THREE.MathUtils.randFloatSpread(100));

      star.position.set(x, y, z);
      scene.add(star);
    }

    Array(200).fill(0).forEach(addStart);

    // BACKGROUND
    const spaceTexture = new THREE.TextureLoader().load(
      "../../assets/img/max-mckinnon.jpg"
    );
    scene.background = spaceTexture;

    // MOON
    //const moonTexture = new THREE.TextureLoader().load("./moon.jpg");
    //const normalMoonTexture = new THREE.TextureLoader().load("./moon.jpg");
    //const moon = new THREE.Mesh(
    //  new THREE.SphereGeometry(3, 23, 32),
    //  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalMoonTexture })
    //);

    //moon.position.z = 30;
    //moon.position.setX(-10);

    //scene.add(moon);

    // LIGHTING
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);

    // HELPERS
    //const lightHelper = new THREE.PointLightHelper(pointLight);
    //const gridHelper = new THREE.GridHelper(200, 50);

    //scene.add(lightHelper, gridHelper);

    // ORBIT CONTROL
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    // MOVE ON SCROLL
    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;

      //moon.rotation.x += 0.05;
      //moon.rotation.y += 0.075;
      //moon.rotation.z += 0.05;

      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      camera.position.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;

    // INFINITE LOOP
    function animate() {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;

      //moon.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  },
};
</script>
