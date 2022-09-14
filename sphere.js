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

const world = Globe()
    .polygonsData(countries.features)
    .polygonCapMaterial("rgba(221, 221, 221, 1)")
    .polygonAltitude("rgba(221, 221, 221, 1)")
    .onPolygonClick((...e) => {
      console.log("onPolygonClick", e)
    })
    .polygonCapColor("rgba(255,255,255,0)")
    .hexPolygonsData(countries.features)
     .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .hexPolygonColor((e) => {
      return countriesColors[e.properties.ISO_A2] || "rgba(221, 221, 221, 1)"
    })
    .onHexPolygonClick((...e) => {
      console.log("onHexPolygonClick", e)
    })
    
    (document.getElementById('globeViz'));
world.backgroundColor("#F5F5F5");
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 3;

const globeMaterial = world.globeMaterial();
globeMaterial.color = new THREE.Color("rgba(245, 245, 245, 1)");
globeMaterial.emissiveIntensity = 0.1;
globeMaterial.shininess = 0.7;
