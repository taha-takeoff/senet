import geojson2h3 from 'https://cdn.skypack.dev/geojson2h3';


// sk.eyJ1IjoibWFobW91ZC10YWhhIiwiYSI6ImNsN2Z1b3J0ODBlNHg0MWxxdGdid282ZnEifQ.563LbI29ILCkkAiNCmSlUA
mapboxgl.accessToken = 'pk.eyJ1IjoibWFobW91ZC10YWhhIiwiYSI6ImNsN2Vpcm82YTAwdGMzeXBxYTN1NGVkaDUifQ.XtgGBx9IOoMS4MCBJSMcrQ';

//read h3 ids from text file
function readTextFile(file) {
  const rawFile = new XMLHttpRequest();
  let data;
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        const allText = rawFile.responseText;
        //this code work correctly on helium data
        // to do handle senet data
        data = allText.split("\n").reduce((acc, el) => {
          const newEl = el.split(";")[0];
          acc[newEl] = 1;
          return acc
        }, {});
      }
    }
  }
  rawFile.send(null);
  
  return data || null;
}


//Demo data
const hexagons = {
  '88283082a3fffff': 0.5,
  '88283082a1fffff': 0.5058315654603276,
  '88283082a7fffff': 0.6876528363410663,
  '88283080c9fffff': 0.44496849207875266,
  '88283082b5fffff': 0.45394476775010983,
  '88283082bdfffff': 0.12271989635767366,
  '88283082abfffff': 0.8816531351387473,
  '88283082a9fffff': 0.030478712672643127,
  '88283082adfffff': 0.34152778288870933,
  '88283082a5fffff': 0.9690472673109802,
  '882830801bfffff': 0.13702530246773859,
  '88283080cdfffff': 0.5078607020044035,
  '88283080c1fffff': 0.4788211414186967,
  '88283080cbfffff': 0.9083408192352027,
  '88283082b7fffff': 0.20714183482498005,
  '88283082b1fffff': 0.22577260632974405,
  '88283082b9fffff': 0.680124716294171,
  '8828308287fffff': 0.49242936534402726,
  '8828308285fffff': 0.5813316426960002,
  '88283082e3fffff': 0.9743301960120205,
  '88283082e7fffff': 0.978726338221203,
  '882830805bfffff': 0.7902397856475809,
  '8828308053fffff': 0.8684440770060262,
  '8828308019fffff': 0.2962202279784576,
  '8828308011fffff': 0.6358452100571828,
  '8828308013fffff': 0.32605752088991125,
  '88283080c5fffff': 0.31314821614843824,
  '88283080c7fffff': 0.9066271685483993,
  '88283080c3fffff': 0.15330345884369145,
  '88283080ddfffff': 0.5185325497745472,
  '88283080d9fffff': 0.48237178893134547,
  '88283082b3fffff': 0.7525531348748489,
  '88283082bbfffff': 0.3848810015992372,
  '8828308295fffff': 0.16493875165521255,
  '8828308283fffff': 0.20586019570605196,
  '8828308281fffff': 0.6807406771970914,
  '882830828dfffff': 0.42603277782918614,
}

//map config
const config = ({
  lng: -122.4,
  lat: 37.7923539,
  zoom: 11.5,
  fillOpacity: 0.8,
})

const renderHexes = (map, hexagons, colorScale) => {
  // Transform the current hexagon map into a GeoJSON object
  const geojson = geojson2h3.h3SetToFeatureCollection(
      Object.keys(hexagons),
      hex => ({value: hexagons[hex]})
  );
  const sourceId = 'h3-hexes';
  const layerId = `${sourceId}-layer`;
  let source = map.getSource(sourceId);
  
  // Add the source and layer if we haven't created them yet
  if (!source) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });
    map.addLayer({
      id: layerId,
      source: sourceId,
      type: 'fill',
      interactive: false,
      paint: {
        'fill-outline-color': 'rgba(0,0,0,0)',
      }
    });
    source = map.getSource(sourceId);
  }
  
  // Update the geojson data
  source.setData(geojson);
  
  // Update the layer paint properties, using the current config values
  map.setPaintProperty(layerId, 'fill-color', {
    property: 'value',
    stops: [
      [0, colorScale[0]],
      [0.5, colorScale[1]],
      [1, colorScale[2]]
    ]
  });
  
  map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
  
  map.loadImage(
      './Group 40067.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);
        map.addSource('points', {
          'type': 'geojson',
          data: {
            'type': 'FeatureCollection',
            'features': geojson.features.map(el => ({
              ...el, geometry: {
                coordinates: h3.cellToLatLng(el.id).reverse(),
                type: "Point",
                properties: {value: 1}
              }
            }))
          }
        })

// Add a symbol layer
        map.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          'layout': {
            'icon-image': 'custom-marker',
// get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': [
              'Open Sans Semibold',
              'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
          }
        });
      }
  );
}

function renderAreas(map, hexagons, threshold) {
  
  // Transform the current hexagon map into a GeoJSON object
  const geojson = geojson2h3.h3SetToFeature(
      Object.keys(hexagons).filter(hex => hexagons[hex] > threshold)
  );
  
  const sourceId = 'h3-hex-areas';
  const layerId = `${sourceId}-layer`;
  let source = map.getSource(sourceId);
  
  // Add the source and layer if we haven't created them yet
  if (!source) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });
    map.addLayer({
      id: layerId,
      source: sourceId,
      type: 'line',
      interactive: false,
      paint: {
        'line-width': 3,
        'line-color': config.colorScale[2],
      }
    });
    source = map.getSource(sourceId);
  }
  
  // Update the geojson data
  source.setData(geojson);
}

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-122.4, 37.7923539], // starting position [lng, lat]
  zoom: 11, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
  
  // readTextFile("./helium-data.dat")
  
  // ['#ffffcc', '#78c679', '#006837']
  renderHexes(map, hexagons, ['#98EC87', '#6ACC4D', '#6BAD5D']);
  // renderAreas(map, hexagons, 0.75);
  
  
  const popup = new mapboxgl.Popup();
  
  map.on('click', 'h3-hexes-layer', function (e) {
    
    if (map.getZoom() > 14) {
      popup.setLngLat(e.lngLat)
          .setHTML(`
          <p>Lat: ${e.lngLat.lat}</p>
          <p>Lng: ${e.lngLat.lng}</p>
          `)
          .addTo(map);
    } else {
      map.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: 14.5,
        speed: 0.8,
        curve: 0.8,
        easing(t) {
          return t;
        }
      });
    }
  });
  
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'h3-hexes-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

// Change it back to a pointer when it leaves.
  map.on('mouseleave', 'h3-hexes-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


