export function mapClickListener(map, draw) {
  map.on("click", function (e) {
    const features = map.queryRenderedFeatures(e.point);
    if (features[0] && draw.getMode() === "simple_select") {
      const values = ["parcelnum", "listed_name", "appraised_total_100"]
      const props = features[0].properties;
      const popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`${values.map(v => `<strong>${v.toUpperCase().replace(/_/g, " ")}</strong><br>${props[v]}<br>`).join("")}`)
      .addTo(map);
      setTimeout(function() {
        if (document.querySelector(".mapboxgl-popup-close-button")) document.querySelector(".mapboxgl-popup-close-button").blur()
      }, 0);
    }
  });
}
