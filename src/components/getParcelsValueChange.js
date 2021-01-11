export function getParcelsValueChange(parcels, field) {
  //need sanity checks - check if appraised_total_value exists
  let error = null;

  // let years = new Set([])
  const validParcelsSet = new Set([]);
  const validParcels = {
    type: "FeatureCollection",
    features: []
  }
  const invalidParcels = {
    type: "FeatureCollection",
    features: []
  }

  parcels.features.forEach(f => {
    validParcelsSet.add(f.properties.parcelnum);

    const years = [];

    if (f.properties.timeseries_years) {
      (f.properties.timeseries_years).split(",").forEach(y => {
        if (years.includes(y)) {
          console.log(y, f.properties.parcelnum);
          validParcelsSet.delete(f.properties.parcelnum);
        }
        years.push(y);
      })
    };

    if (validParcelsSet.has(f.properties.parcelnum)) {
      validParcels.features.push(f)
    }else{
      invalidParcels.features.push(f)
    }
    // console.log(years);
  });

  console.log([...validParcelsSet]);

  //TODO check if all parcels have values for all years and that the years we are checking are the same
  let value2019 = validParcels.features.reduce((v,f) => {
    return Number(v) + Number(f.properties.appraised_value_100)
  }, 0);

  let value2009 = validParcels.features.reduce((v,f) => {
    const _values = f.properties.timeseries_values.split(",");
    const _years = f.properties.timeseries_years.split(",");
    console.log(_years[_years.length - 10])
    console.log(_values[_values.length - 10] );
    if (_values[_values.length - 10] === undefined || !_years[_years.length - 10] || _years[_years.length - 10] != "2010") {
      return false
    }

    return Number(v) + Number(_values[_values.length - 10])
  }, 0);

  if (!value2009) {
    return {
      error_timeseries: "Error in timeseries data."
    }
  }

  return {
    number_timeseries: [...validParcelsSet].length,
    value_change : value2019 - value2009,
    pnt_change   : (value2019 - value2019) / value2019 * 100,
    valid: validParcels,
    invalid: invalidParcels,
    error_timeseries: error
  }
}
