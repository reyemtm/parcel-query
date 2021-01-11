import { Control } from 'ol/Control'

class SidebarToggle extends Control {
  constructor() {
    super({});

    const button = document.createElement('button');
    this.button = button;
    button.type = 'button';
    button.classList = 'ol-control ol-custom-control';
    button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-left.svg?size=28&color=currentColor">';
    button.addEventListener('click', () => this.click());

    const element = document.createElement('div');
    element.className = 'ol-feature ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element
    });

  }

  click() {
    this.button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-right.svg?size=28&color=currentColor">';
    this.button.blur()
    const sidebar = document.querySelector(".sidebar");
    const map = document.querySelector(".map");
    if (!sidebar || !map) return
    console.log(sidebar.style.left)
    if (sidebar.style.left != "-400px"){
      sidebar.style.left = "-400px";
      sidebar.style.width = 0
      map.style.width = "100vw";
      setTimeout(() => this.getMap().updateSize(), 0)

    }else{
      this.button.innerHTML = '<img src="https://icongr.am/fontawesome/angle-left.svg?size=28&color=currentColor">';
      this.button.blur()
      sidebar.style.left = 0;
      sidebar.style.width = "300px"
      map.style.width = "calc(100vw - 300px)";
      setTimeout(() => this.getMap().updateSize(), 0)
    }
  }

}

export {
  SidebarToggle
}