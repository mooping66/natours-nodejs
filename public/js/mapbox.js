/* eslint-disable */
// @@Including a Map with Mapbox - Part 1
// console.log('Hello from the client side 😊');

//@@ Including a Map with Mapbox - Part 2
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9vcGluZyIsImEiOiJja21wMHo2Mm4wN210Mm5uczFnb3lodXQ2In0.37bWPY9Av8xSM2ax0F8dPA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mooping/ckmp1mxpn63cj17oacrzv46bj',
    scrollZoom: false,
    //   center: [34.0203463, -118.9722379],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //* Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //* Add marker
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //* Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //* Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
