export function exportGeoJSONPropsToCSV(geojson) {
  const keys = [];
  const properties = [];
  geojson.features.forEach(f => {
    for (let k in f.properties) {
      if (!keys.includes(k)) keys.push(k)
    }
    properties.push(f.properties)
  })

  let csv = "data:text/csv;charset=utf-8,";

  csv += keys.join(",")
  csv += "\r\n";

  properties.forEach(p => {
    const array = [];
    keys.forEach(k => {
      const v = (p[k]) ? p[k].toString().replace(/,/g, " | ") : '';
      array.push(v)
    });
    csv += array.join(",") + "\r\n";
  })

  // console.log(csv, keys)

  var encodedUri = encodeURI(csv);
  // var link = document.createElement("a");
  // link.setAttribute("href", encodedUri);
  // link.setAttribute("download", "my_data.csv");
  // document.body.appendChild(link); // Required for FF

  // link.click(); // This will download the data file named "my_data.csv".
}

