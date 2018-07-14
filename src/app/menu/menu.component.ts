import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() {
    this.appComponent = new AppComponent();
   }

  isArrow:boolean;
  appComponent;

  ngOnInit() {
     this.isArrow=false;
  }

  // (function() {

  //   'use strict';

  //   document.querySelector('.material-design-hamburger__icon').addEventListener(
  //     'click',
  //     function() {      

  

  onClick($event) {
    //var child;

    this.isArrow = !this.isArrow;

    //var ele = document.getElementById('.material-design-hamburger__icon');

    // document.body.classList.toggle('background--blur');
    // ele.parentNode.nextSibling.element.classList.toggle('menu--on');

    // child = ele.childNodes[1];.classList;

    // if (child.contains('material-design-hamburger__icon--to-arrow')) {
    //   child.remove('material-design-hamburger__icon--to-arrow');
    //   child.add('material-design-hamburger__icon--from-arrow');
    // } else {
    //   child.remove('material-design-hamburger__icon--from-arrow');
    //   child.add('material-design-hamburger__icon--to-arrow');
    // }

  }
}
