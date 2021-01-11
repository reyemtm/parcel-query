import { getParcelsTotalValue } from "./getParcelsTotalValue";
import { getParcelsValueChange } from "./getParcelsValueChange";
import { getParcels } from "./getParcels";
import { exportGeoJSONPropsToCSV } from "./exportGeoJSONPropsToCSV";

export async function uiUpdateInfo(ids) {
  const parcels = await getParcels(ids);
  if (!parcels.features.length) {
    document.querySelector("[data-type='info']").innerHTML = `
    <p class="text-error">Error: No parcel information returned! Are you trying to query parcels outside the city limits?</p>
  `;
    return
  }

  exportGeoJSONPropsToCSV(parcels)

  const { total_value, number, error} = getParcelsTotalValue(parcels);

  const {value_change, number_timeseries, invalid, error_timeseries} = getParcelsValueChange(parcels);

  document.querySelector("[data-type='info']").innerHTML = `
    <h3>Parcel Value</h3>
    <p>
    The total appraised value for the <strong>${number}</strong> parcels is <strong>$${total_value.toLocaleString()}</strong>.
    </p>
    ${(error) ? `<p>${error}</p>` : ""}
  `;

  if (number_timeseries && !error_timeseries) {
    document.querySelector("[data-type='info']").innerHTML += `
    <hr>
    <h3>Value Change</h3>
    <p>
    The value change over the past ten years for the <strong>${number_timeseries}</strong> parcels with timeseries information is <strong>$${value_change.toLocaleString()}</strong>.
    </p>
    ${(invalid.features.length > 0) ? "<h5 class='text-error'>Parcels with missing data:</h5>" + invalid.features.map(f => f.properties.parcelnum).join("<br>") : ""}
  `;
  }else{
    document.querySelector("[data-type='info']").innerHTML += `
    <hr>
    <h3>Value Change</h3>
    <p>${error_timeseries}</p>
  `;
  }


  // createChart(parcels)
}
