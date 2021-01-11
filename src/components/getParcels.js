
export async function getParcels(ids) {
  // console.log(ids);
  try {
    const res = await fetch(`https://311.coz.org/api/v1/feature-server/functions/get_parcel_values/items.json?pids=${ids.join(",")}`);
    const data = await res.json();
    // console.log(data);
    return data;
  } catch (err) {
    return null;
  }
}
