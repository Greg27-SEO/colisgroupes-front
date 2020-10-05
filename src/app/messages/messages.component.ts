import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  action = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.action = this.route.snapshot.paramMap.get('action');
  }

}
