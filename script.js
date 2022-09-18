mapboxgl.accessToken = 'pk.eyJ1IjoibWFobW91ZC10YWhhIiwiYSI6ImNsN2Vpcm82YTAwdGMzeXBxYTN1NGVkaDUifQ.XtgGBx9IOoMS4MCBJSMcrQ';


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
          acc[parsingElement.color] = acc[parsingElement.color] ? [...acc[parsingElement.color], parsingElement.id] : [parsingElement.id]
          return acc
        }, {})
      }
    }
  }
  rawFile.send(null);
  
  return data || null;
}

const params = new URLSearchParams(window.location.search);

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mahmoud-taha/cl7k94weg002w14lkwa93p0vg', // style URL
  center: params.has("lat") ? [params.get("lng"), params.get("lat")] : h3.cellToLatLng("882b9b501bfffff").reverse(), // starting position [lng, lat]
  zoom: params.has("lat") ? 5 : 11, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
  
  const countriesData = readCountriesFile();
  
  Object.keys(countriesData || {}).forEach(el => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    map.addLayer(
        {
          id,
          source: {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1',
          },
          'source-layer': 'country_boundaries',
          type: 'fill',
          paint: {
            'fill-color': el,
            'fill-opacity': 1,
          },
        },
        'country-label'
    );
    map.setPaintProperty(id, 'fill-opacity', [
      'interpolate',
// Set the exponential rate of change to 0.5
      ['exponential', 1],
      ['zoom'],
// When zoom is 10, buildings will be 100% transparent.
      1,
      1,
// When zoom is 18 or higher, buildings will be 100% opaque.
      11,
      0.5
    ]);
    map.setFilter(id, [
      "in",
      "iso_3166_1",
      ...countriesData[el]
    ]);
    
    map.setFilter(id, [
      "in",
      "iso_3166_1",
      ...countriesData[el]
    ]);
  })
  
  
  const popup = new mapboxgl.Popup();
  
  
  map.on('click', 'senet-data', (e) => {
    const langLat = h3.cellToLatLng(e.features[0].properties.h3Index)
    popup.setLngLat({
      lat: langLat[0],
      lng: langLat[1]
    })
        .setHTML(`
          <p>Lat: ${langLat[0]}</p>
          <p>Lng: ${langLat[1]}</p>
          `)
        .addTo(map);
  });
  
  map.on('mouseenter', 'senet-data', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'senet-data', () => {
    map.getCanvas().style.cursor = '';
  });
  
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search Postal Code or Location',
      // marker: false, // Do not use the default marker style
    })
);
