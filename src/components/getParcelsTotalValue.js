export function getParcelsTotalValue(data) {
  if (!data.features)
    return null;
  let value = 0;
  let error = null
  data.features.map(f => {
    if (f.properties.appraised_value_100) {
      value = value + f.properties.appraised_value_100;
    }else{
      error += `Parcel ${f.properties.parcelnum} is missing a total.\n`
    }
  });

  return {
    number: data.features.length,
    total_value: value,
    error: error
  };
}
