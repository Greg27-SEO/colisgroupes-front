import { Component, OnInit } from '@angular/core';
import { faBoxes, faStream, faCheckCircle, faTruckLoading, faRoad, faCoins } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-home-steps',
  templateUrl: './home-steps.component.html',
  styleUrls: ['./home-steps.component.css']
})
export class HomeStepsComponent implements OnInit {
  step1 = faStream;
  step2 = faBoxes;
  step3 = faCheckCircle;
  step4 = faTruckLoading;
  step5 = faRoad;
  step6 = faCoins;

  iconFacebook = faFacebook;
  iconTwitter = faTwitter;
  iconInsta = faInstagram;

  constructor() { }

  ngOnInit() {
  }

}
