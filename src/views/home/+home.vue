<template>
  <div id="home-section" class="h-screen w-screen relative">
    <!-- <canvas id="home-section-three" class="absolute h-full w-full top-0 left-0" /> -->
  </div>
</template>

<script lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Geometry } from "three/examples/jsm/deprecated/Geometry";
import { gsap } from "gsap";

// IMG
import BG_Space from "../../assets/img/max-mckinnon.jpg";

export default {
  name: "HomeSection",
  mounted() {
    return;

    const tl = gsap.timeline({
      defaults: { ease: "power1.out" },
    });

    const canvasHomeSection: HTMLCanvasElement = document.querySelector(
      "#home-section-three"
    ) as HTMLCanvasElement;
    const canvasWidth = canvasHomeSection.offsetWidth;
    const canvasHeight = canvasHomeSection.offsetHeight;

    // SCENE & CAMERA
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    const renderer: THREE.WebGL1Renderer = new THREE.WebGL1Renderer({
      canvas: canvasHomeSection,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(75);
    renderer.render(scene, camera);

    // BACKGROUND TEXTURE
    const spaceTexture = new THREE.TextureLoader().load(BG_Space);
    scene.background = spaceTexture;

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

    // VECTOR SPHERE
    //const geometry = new THREE.SphereGeometry(10, 23, 32);
    //const material = new THREE.MeshStandardMaterial({
    //  color: 0xff6347,
    //});
    //const vectorSphere = new THREE.Mesh(geometry, material);

    //vectorSphere.position.z = 30;
    ////vectorSphere.position.setX(20);
    ////vectorSphere.position.setY(-11);

    //scene.add(spherePoints);

    // LIGHTING
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);

    scene.add(pointLight, ambientLight);

    // HELPERS
    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);

    scene.add(lightHelper, gridHelper);

    // ORBIT CONTROL
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    // MOVE ON SCROLL
    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;

      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      camera.position.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;

    // INFINITE LOOP
    function animate() {
      requestAnimationFrame(animate);

      //moon.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  },
};
</script>
