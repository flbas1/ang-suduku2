import { Component, OnInit } from '@angular/core';
import { Soduku } from '../soduku';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let s =    Soduku.Soduku.generate('easy');
    
    console.log(s);
  }

}
