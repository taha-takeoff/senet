import countries from "./files/globe-data-min.json" assert { type: "json" }
import travelHistory from "./files/my-flights.json" assert { type: "json" }
import airportHistory from "./files/my-airports.json" assert { type: "json" }


let renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let Globe;

init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  // Initialize renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
  
  // Initialize scene, light
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new THREE.Color(0x040d21);
  
  // Initialize camera, light
  camera = new THREE.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  let dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);
  
  let dLight1 = new THREE.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);
  
  let dLight2 = new THREE.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);
  
  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;
  
  scene.add(camera);
  
  // Additional effects
  scene.fog = new THREE.Fog(0x535ef3, 400, 2000);
  
  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // let helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // let helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);
  
  // Initialize controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 1;
  controls.zoomSpeed = 0;
  controls.autoRotate = true;
  
  controls.minPolarAngle = Math.PI *.25;
  // controls.maxPolarAngle = controls.minPolarAngle ;
  controls.maxPolarAngle = Math.PI *0.6;
  window.addEventListener("resize", onWindowResize, false);
  // document.addEventListener("mousemove", onMouseMove);
}

// SECTION Globe
function initGlobe() {
  // Initialize the Globe
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#3a228a")
      .atmosphereAltitude(0.25)
      .hexPolygonColor((e) => {
        if (
            ["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
                e.properties.ISO_A3
            )
        ) {
          return "rgba(255,255,255, 1)";
        } else return "rgba(255,255,255, 0.7)";
      });
  
  // NOTE Arc animations are followed after the globe enters the scene
  // setTimeout(() => {
  //   Globe.arcsData(travelHistory.flights)
  //       .arcColor((e) => {
  //         return e.status ? "#9cff00" : "#FF4000";
  //       })
  //       .arcAltitude((e) => {
  //         return e.arcAlt;
  //       })
  //       .arcStroke((e) => {
  //         return e.status ? 0.5 : 0.3;
  //       })
  //       .arcDashLength(0.9)
  //       .arcDashGap(4)
  //       .arcDashAnimateTime(1000)
  //       .arcsTransitionDuration(1000)
  //       .arcDashInitialGap((e) => e.order * 1)
  //       .labelsData(airportHistory.airports)
  //       .labelColor(() => "#ffcb21")
  //       .labelDotOrientation((e) => {
  //         return e.text === "ALA" ? "top" : "right";
  //       })
  //       .labelDotRadius(0.3)
  //       .labelSize((e) => e.size)
  //       .labelText("city")
  //       .labelResolution(6)
  //       .labelAltitude(0.01)
  //       .pointsData(airportHistory.airports)
  //       .pointColor(() => "#ffffff")
  //       .pointsMerge(true)
  //       .pointAltitude(0.07)
  //       .pointRadius(0.05);
  // }, 1000);
  
  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(0);
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new THREE.Color(0x3a228a);
  globeMaterial.emissive = new THREE.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;
  
  // NOTE Cool stuff
  // globeMaterial.wireframe = true;
  
  scene.add(Globe);
}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  // console.log("x: " + mouseX + " y: " + mouseY);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}
camera.position.z = 300

function animate() {
  // camera.position.x +=
  //     Math.abs(mouseX) <= windowHalfX / 2
  //         ? (mouseX / 2 - camera.position.x) * 0.005
  //         : 0;
  // camera.position.x +=
  //     Math.abs(mouseX) <= windowHalfX / 2
  //         ? (mouseX / 2 - camera.position.x) * 0.005
  //         : 0;
  // camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
