import {  DrawRectangle } from "./controls/mglDrawRectangle.js"
import {  mglSidebarToggle} from "./controls/mglSidebarToggle.js"
import {  mglDrawRectangleIcon} from "./controls/mglDrawRectangleIcon.js"
import { mapClickListener } from "./components/mapClickListener"
import { isNullArray } from "./components/isNullArray";
import { mglSelectFeatures } from "./components/mglSelectFeatures";
import { uiUpdateInfo } from "./components/uiUpdateInfo";

let parcelIds = [], chart;

init()

function init() {
  /**
   * Token, Needed for the basemap
   */
  mapboxgl.accessToken = 'pk.eyJ1IjoiY296Z2lzIiwiYSI6ImNqZ21lN2R5ZDFlYm8ycXQ0a3R2cmI2NWgifQ.z4GxUZe5JXAdoRR4E3mvpg';

  /**
   * Map Object
   */
  var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-82.0100912,39.9402613], // starting position [lng, lat]
    zoom: 16, // starting zoom,
    hash: true
  });
  
  map.on("load", async function() {
    /**
     * Map Layers
     */
    await addLayers(map)
  
    /**
     * Map Controls
     */
    const sidebarToggle = new mglSidebarToggle();
    const draw = mglDrawRectangleConfig()
    map.addControl(sidebarToggle, 'top-left');
    map.addControl(draw, "top-left");
  
    /**
     * Event Listners
     */
    drawControlListeners(map, draw)
    uiEventListeners(map)
    mapClickListener(map, draw)

    map.on("contextmenu", () => {
      reset(null, map)
    })
  })
}

function mglDrawRectangleConfig() {

  MapboxDraw.modes.draw_rectangle = DrawRectangle;

  return new MapboxDraw({
    displayControlsDefault: false,
    modes: MapboxDraw.modes,
    uerProperties: true,
    controls: {
      point: true,
      polygon: true,
      line_string: true
    }
  });
}

function drawControlListeners(map, draw) {

   /**
   * hack to show a different control icon for the rectangle draw control
   */
  var bboxButton = document.querySelector(".mapbox-gl-draw_line");
  if (bboxButton) {
    bboxButton.style.backgroundImage = `url(${mglDrawRectangleIcon()})`;
    bboxButton.setAttribute("title", "Bounding Box Tool")
  }

  map.on('draw.modechange', function () {
    switch (draw.getMode()) {
      case "draw_polygon":
        draw.changeMode('draw_polygon');
        break;
      case "draw_point":
        draw.changeMode('draw_point');
        break;
      case "draw_line_string":
        draw.changeMode('draw_rectangle');
        break;
      default:
        draw.changeMode('draw_polygon');
        setTimeout(function() {
          draw.changeMode('simple_select');
        }, 500)
    }
  })
  .on("draw.create", () => updateSelection(map, draw))
  .on("draw.update", () => updateSelection(map, draw));
}

async function addLayers(map) {
  const res = await fetch("https://gis.coz.org/map-layers-config.json")
  const allLayers = await res.json();
  const layersArray = ["adm_mus_parcels","ParcelsOutline","admin-outline","admin-dash"]
  const layers = allLayers.filter(l => {
    return layersArray.includes(l.id)
  });

  console.log(layers)
  map.addSource("adminSource", layers[2].sourceType)
  map.addSource("parcelSource", layers[0].sourceType)
  layers.map(l => {
    l.layout.visibility = "visible";
    map.addLayer(l)
  });

  const selection = layers[0]
  selection.id = "selection";
  selection.paint["fill-color"] = "red";
  selection.paint["fill-opacity"] = 0.6;
  selection.filter = ["==", ["get", "parcelnum"], ""]
  map.addLayer(selection)
}

function updateSelection(map, draw) {
  const { _uniqueIds, _selectedFeatures } = mglSelectFeatures(map, draw.getAll(), ["adm_mus_parcels"], "parcelnum", function(f) {
    return f.properties.parcelnum && f.properties.parcelnum.length === 15 && f.properties.district_code === 80
  })
  // console.log(_selectedFeatures)
  _uniqueIds.forEach(p => {
    if (!parcelIds.includes(p)) {
      parcelIds.push(p)
    }else{
      parcelIds[parcelIds.indexOf(p)] = null
    }
  });

  map.setFilter("selection", 
    ["all",
      ["in", ["get", "parcelnum"], parcelIds.join(",")],
      ["!=", ["get", "parcelnum"], "9"]
    ] 
  )

  if (parcelIds.length && !isNullArray(parcelIds)) {
    document.querySelector("[data-type='fetch']").disabled = false
  }else{
    document.querySelector("[data-type='fetch']").disabled = true
  }

  draw.deleteAll();

}

function uiEventListeners(map) {
  const sidebar = document.querySelector(".sidebar");
  const buttons = [...sidebar.querySelectorAll("button")]

  buttons.map(b => {
    b.addEventListener("click", async function(e) {
      switch (e.target.dataset.type) {
        // case "select"    : {
          
        //   document.querySelector(".mapbox-gl-draw_ctrl-draw-btn").style.display = "block"

          
        //   break;
        // } 
        // case "single" :   break;
        case "fetch"  : uiUpdateInfo(parcelIds); break;
        default: reset(this, map);
      }
    })
  });
}

function createChart(data, chart) {

  if (chart) chart.destroy()

  const props = data.features[0].properties
  const config = {
    type: 'line',
    data: {
      labels: props.timeseries_years.split(","),
      datasets: [{
        label: 'Parcel Value',
        backgroundColor: 'rgba(224,64,251,0.5)',
        borderColor: 'rgba(224,64,251,0.5)',
        data: props.timeseries_values.split(","),
        lineTension: 0.2,
        trendlineLinear: {
          style: "#121212",
          lineStyle: "dotted",
          width: 1
        }
      }]
    },
    options: {
      // scales: {
      //   xAxes: [{
      //     type: 'time'
      //   }]
      // },
      tooltips: {
        enabled: true
      }
    }
  };

  const ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, config)

}

function reset(e, map) {
  parcelIds = [];
  map.setFilter("selection", ["==", ["get", "id"], "-1"])
  document.querySelector("[data-type='fetch']").disabled = true;
  document.querySelector("[data-type='info']").innerHTML = "";
  if (chart) chart.destroy();
  if (e) e.blur()
}