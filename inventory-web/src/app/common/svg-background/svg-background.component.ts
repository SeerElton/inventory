import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-background',
  templateUrl: './svg-background.component.html',
  styleUrls: ['./svg-background.component.css']
})
export class SvgBackgroundComponent implements OnInit {

  clientHeight: number;
  clientWidth: number;

  constructor() {
    const doc = document.children[0];
    this.clientHeight = doc.clientHeight;
    this.clientWidth = doc.clientWidth;

  }

  ngOnInit(): void {
    var mySVG = document.getElementById('svg') as HTMLElement;
    var img = document.getElementById('bg-logo');

    mySVG.setAttribute("viewBox", `0 0 ${this.clientWidth} ${this.clientHeight}`);
    img ? img.style.top = `${(this.clientHeight - 210) / 2}px` : null;

    for (const circle of Array.from(mySVG.children)) {
      circle.setAttribute("cx", `${(this.clientWidth + circle.clientWidth) / 2}`);
      circle.setAttribute("cy", `${(this.clientHeight + circle.clientHeight) / 2}`);
    }
  }

}
