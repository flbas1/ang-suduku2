import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { SudokuGame } from  'src/app/grid/grid.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() {
    this.appComponent = new AppComponent();
  }

  isArrow: boolean;
  appComponent;

  ngOnInit() {
    this.isArrow = false;
  }

  newGame() {
    this.isArrow = false;
    var s = SudokuGame.getInstance();
    s.newGame();
    
    
  }


  onClick($event) {
    this.isArrow = !this.isArrow;
  }
}
