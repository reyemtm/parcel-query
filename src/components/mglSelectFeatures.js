import { booleanContains, booleanOverlap, booleanWithin, flatten, bbox, featureCollection, envelope, circle } from "@turf/turf"

/**
 * This function takes a polygon or point and selects other features in the map that intersect this feature. It returns the features as well as an array contaiing a list of unique ids for these features based on the properties field provided.
 * @param {object} map Mapbox map object 
 * @param {object} selectingFeatures GeoJSON FeatureCollection
 * @param {Array} layers Array of Mapbox layers to query
 * @param {string} field Field used to filter the features
 * @param {Function} filter Function used on each feature to optionally filter out features.
 * @example
 * mglSelectFeatures(map, features, "field_w_unique_constraint", ["layer_1"], function(f) => {
 *  return f.properties.boolean === true
 * });
 * @returns {Number} Returns the value of x for the equation.
 */
export function mglSelectFeatures(map, selectingFeatures, layers, field, filter) {
  // console.log(selectingFeatures);
  var bbox0 = bbox(selectingFeatures);
  var bbox1 = map.project([bbox0[0], bbox0[1]]);
  var bbox2 = map.project([bbox0[2], bbox0[3]]);

  var features = map.queryRenderedFeatures([
    [bbox1.x, bbox1.y],
    [bbox2.x, bbox2.y]
  ], {
    layers: layers
  });

  //filter out any features that do not have a the field property

  const cleanedFeatures = features.filter(f => {
    return f.properties[field]
  })

  const selected = featureCollection([]);
  const flattenedFeatures = featureCollection([]);

  //flatten any multi* features
  cleanedFeatures.forEach(f => {
    if (f.geometry.type.includes("Multi")) {
      f.properties._flattened = true
      let flattened = flatten(f);
      flattenedFeatures.features = [...flattenedFeatures.features, ...flattened.features];
    }else{
      flattenedFeatures.features.push(f)
    }
  });

  //iterate through all features, skipping multi* geom features
  flattenedFeatures.features.forEach(f => {
    let passedFilter = false;
    if (filter) {
      passedFilter = filter(f)
    }else{
      passedFilter = true
    }
    if (passedFilter) {
      var envelopeFeature = (f.geometry.type === "LineString") ? envelope(f) : (f.geometry.type === "Point") ? circle(f, 0.000001, {units: "degrees"}) : f;
      for (let i = 0; i < selectingFeatures.features.length; i++) {
        let s = selectingFeatures.features[i];
        if (s.geometry.type === "Point") s = circle(s, 0.000001, {units: "degrees"});
        if (
          booleanContains(envelopeFeature, s)
          || 
          booleanContains(s, envelopeFeature)
          || 
          booleanWithin(envelopeFeature, s) 
          || 
          booleanOverlap(envelopeFeature, s)
          // ||
          // !booleanDisjoint(envelopeFeature, s)

         ) {
         if (!f.properties._flattened) {
           selected.features.push(f);
         }else{
           const cloned = cleanedFeatures.filter(p => {
            return p.properties[field] === f.properties[field]
           });
           selected.features = [...selected.features, ...cloned]
          }
        }
      }
    }
  });

  const _uniqueIds = new Set([]);

  selected.features.forEach(w => {
    // console.log(w)
    _uniqueIds.add(w.properties[field]);
  });

  return {
    _uniqueIds: [..._uniqueIds],
    _selectedFeatures: selected
  };

}