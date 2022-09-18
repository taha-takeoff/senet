import countries from "./files/globe-data-min.json" assert {type: "json"};

const readCountriesFile = () => {
  const rawFile = new XMLHttpRequest();
  let data;
  rawFile.open("GET", "./WorldMapUpdate_042022.txt", false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        data = rawFile.responseText;
        data = data.split(",\n").reduce((acc, el) => {
          if (!el) return acc
          const parsingElement = JSON.parse(el.lastIndexOf(",") === el.length - 1 ? el.substring(0, el.lastIndexOf(',')) : el);
          acc[parsingElement.id] = parsingElement.color;
          return acc
        }, {})
      }
    }
  }
  rawFile.send(null);
  
  return data || null;
}
const countriesColors = readCountriesFile();

//add arcs
const N = 30;
const arcsData = [...Array(N).keys()].map(() => ({
  startLat: (Math.random() - 0.5) * 180,
  startLng: (Math.random() - 0.5) * 360,
  endLat: (Math.random() - 0.5) * 180,
  endLng: (Math.random() - 0.5) * 360,
  color: "#FF5900"
}));

const world = Globe()
    .arcsData(arcsData)
    .arcColor('color')
    .arcDashLength(1)
    .arcStroke(0.7)
    .arcDashGap(() => Math.random())
    .arcDashAnimateTime(() => Math.random() * 4000 + 500)
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .hexPolygonColor((e) => {
      return countriesColors[e.properties.ISO_A2] || "rgba(221, 221, 221, 1)"
    })
    .onHexPolygonClick((...e) => {
      window.location =`/senet/map.html?lng=${e[2].lng}&lat=${e[2].lat}`;
    })
    (document.getElementById('globeViz'));

// pauseAnimation()
world.backgroundColor("#F5F5F5");
world.controls().autoRotate = true;
console.log("world.controls", world.controls())
world.controls().autoRotateSpeed = 2;
world.onGlobeClick((lngLat) => {
  window.location =`/senet/map.html?lng=${lngLat.lng}&lat=${lngLat.lat}`;
})

const globeMaterial = world.globeMaterial();
globeMaterial.color = new THREE.Color("rgba(245, 245, 245, 1)");
globeMaterial.emissiveIntensity = 0.1;
globeMaterial.shininess = 0.7;
