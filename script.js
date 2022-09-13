mapboxgl.accessToken = 'pk.eyJ1IjoibWFobW91ZC10YWhhIiwiYSI6ImNsN2Vpcm82YTAwdGMzeXBxYTN1NGVkaDUifQ.XtgGBx9IOoMS4MCBJSMcrQ';


//map config
const config = ({
  lng: -122.4,
  lat: 37.7923539,
  zoom: 11.5,
  fillOpacity: 0.8,
})

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mahmoud-taha/cl7k94weg002w14lkwa93p0vg', // style URL
  center: h3.cellToLatLng("882b9b501bfffff").reverse(), // starting position [lng, lat]
  zoom: 11, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
  
  
  // map.addLayer(
  //     {
  //       id: 'country-boundaries',
  //       source: {
  //         type: 'vector',
  //         url: 'mapbox://mapbox.country-boundaries-v1',
  //       },
  //       'source-layer': 'country_boundaries',
  //       type: 'fill',
  //       paint: {
  //         'fill-color': '#d2361e',
  //         'fill-opacity': 0.4,
  //       },
  //     },
  //     'country-label'
  // );
  //
  // map.setFilter('country-boundaries', [
  //   "in",
  //   "iso_3166_1_alpha_3",
  //   'NLD',
  //   'ITA'
  // ]);
  
  const popup = new mapboxgl.Popup();
  
  map.on('click', 'helium-data', (e) => {
    popup.setLngLat(e.lngLat)
        .setHTML(`
          <p>Lat: ${e.lngLat.lat}</p>
          <p>Lng: ${e.lngLat.lng}</p>
          `)
        .addTo(map);
  });
  
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'helium-data', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

// Change it back to a pointer when it leaves.
  map.on('mouseleave', 'helium-data', () => {
    map.getCanvas().style.cursor = '';
  });
  
  
  map.on('click', 'senet-data', (e) => {
    // console.log("mcndnc", e.lngLat)
    // console.log("h3Index", e.features[0].properties.h3Index)
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


