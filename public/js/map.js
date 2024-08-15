
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  // You can add layers to the predetermined slots within the Standard style basemap.
  style: "mapbox://styles/mapbox/standard",
  center: cordinates,
  zoom: 10,
  maxZoom: 6,
});

const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    'Exact location provided after booking.  '
);
const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(cordinates)
.setPopup(popup)
.addTo(map);