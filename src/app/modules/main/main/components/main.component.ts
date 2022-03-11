import { Component, OnInit } from '@angular/core';

import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [fadeInOutAnimation],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
