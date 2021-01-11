class mglSidebarToggle {
  constructor() {
  }

  onAdd(map) {
    this._map = map
    const button = document.createElement('button');
    this.button = button;
    button.type = 'button';
    button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-left.svg?size=28&color=currentColor">';
    button.addEventListener('click', () => this.click());

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this._container.appendChild(button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  click() {
    // console.log(this._map)
    this.button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-right.svg?size=28&color=currentColor">';
    this.button.blur()
    const sidebar = document.querySelector(".sidebar");
    const mapDiv = document.querySelector(".map");
    if (!sidebar || !mapDiv) return
    if (sidebar.style.left != "-300px"){
      sidebar.style.left = "-300px";
      // sidebar.style.width = 0
      // mapDiv.style.width = "100vw";
      document.querySelector(".mapboxgl-ctrl-top-left").style.left = 0;
      document.querySelector(".mapboxgl-ctrl-bottom-left").style.left = 0;
      // setTimeout(() => this._map.resize(), 300)

    }else{
      this.button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-left.svg?size=28&color=currentColor">';
      this.button.blur()
      sidebar.style.left = 0;
      // sidebar.style.width = "300px"
      // mapDiv.style.width = "calc(100vw - 300px)";
      // setTimeout(() => this._map.resize(), 300);
      document.querySelector(".mapboxgl-ctrl-top-left").style.left = "300px";
      document.querySelector(".mapboxgl-ctrl-bottom-left").style.left = "300px";
    }
  }

  //   this.onAdd = function (map) {
  //     var _id = "sidebarId";
  //     this._map = map;
  //     this._btn = document.createElement('button');
  //     this._btn.id = "mapSidebarToggle";
  //     this._btn.className = 'fa fa-bars fa-2x';
  //     this._btn.type = 'button';
  //     this._btn['aria-label'] = 'Toggle Sidebar';
  //     this._btn.onclick = function () {
  //       var _mapSidebar = document.getElementById(_id);
  //       var _mapContainers = document.getElementsByClassName('mapboxgl-map');
  //       if (_mapSidebar.classList.contains('active')) {
  //         _mapSidebar.classList.remove('active');
  //         for (var m = 0; m < _mapContainers.length; m++) {
  //           _mapContainers[m].classList.remove('coz-map--sidebar-active');
  //         }
  //         map.resize();
  //       } else {
  //         _mapSidebar.classList.add('active');
  //         for (var m = 0; m < _mapContainers.length; m++) {
  //           _mapContainers[m].classList.add('coz-map--sidebar-active');
  //         }
  //       }
  //     };

  //     this._container = document.createElement('div');
  //     this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
  //     this._container.appendChild(this._btn);

  //     return this._container;
  //   };
  //   this.onRemove = function () {
  //     this._container.parentNode.removeChild(this._container);
  //     this._map = undefined;
  //   };
  // }
}

export {
  mglSidebarToggle
};