import { Component, OnInit } from '@angular/core';
import * as sudoku from "src/app/grid/sudoku.js";

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

	constructor() {

	}
	grid: any;
	__solve = false;
	__grid;

	style: any;

	ngOnInit() {
		let _sudoku = sudoku.generate("easy");
		let _solved = sudoku.solve(_sudoku);
		//let _user = _sudoku;//todo:  make copy

		let _user: any = {};
		this.style = document.createElement('style');
		//style.innerText = '.C1 {background:yellow;}';
		//style.id='userWins'
		document.body.appendChild(this.style);
		//fill in the rest of _user
		for (let r = 1; r <= 9; r++)
			for (let c = 1; c <= 9; c++) {
				let rc = String.fromCharCode(r + 64) + c;
				if (_sudoku[rc] === undefined)
					_user[rc] = "0";
				else
					_user[rc] = _sudoku[rc];
			}


		this.grid = {
			base: _sudoku,
			user: _user,
			solved: _solved,
			// notes: Array[9][9],
		};
		//this.__grid = this.grid.base;
	}

	drawCell(cell) {

		//let c = this.__grid[cell];
		let c = this.grid.user[cell];
		if (c === undefined || c === "0")
			return " ";
		else
			return c;
	}

	lastCell: any = null;
	useCell(cell) {
		let c = cell.currentTarget.id;

		if (c.startsWith('N')) {  //if we clicked a number, 
			if (this.lastCell !== null) {  //todo:  and this isn't a base selected cell
				this.grid.user[this.lastCell] = c[1];

			}
		}
		else
			//if (this.grid.base[c] === undefined)  //so we don't modify the given numbers
			this.lastCell = cell.currentTarget.id;
		// else
		// 	this.lastCell = null;
		this.style.innerText = this.colorGrid(c.startsWith('N'));

	}

	colorGrid(inputHappened: boolean) {

		let color = {
			bad: "{background: red} ",
			good: "{background: lightgreen} ",
			highlight: "{background: green} ",
			highlightRed: "{background: orange} ",
		}

		let newCSS: string = "";


		//Highlight the selected cell.  
		newCSS += `#${this.lastCell} ${color.highlight}`;


		//if i select the wrong #, highlight it

		//if the selected cell has a value, populate all of the numbers
		if (this.grid.user[this.lastCell] !== "0")
			for (let r = 1; r <= 9; r++) {
				for (let c = 1; c <= 9; c++) {
					let rc = String.fromCharCode(r + 64) + c;
					if (this.grid.user[rc] == this.grid.user[this.lastCell]) {
						newCSS += `#${rc} ${color.highlight}`;  //highlight cell only
						// newCSS += `.R${r} ${color.highlightRed}`;  //highlight row cell is in
						// newCSS += `.C${c} ${color.highlightRed}`;  //highlight column cell is in
					}
				}
			}


		//check all rows for completeness
		for (let r = 1; r <= 9; r++) {
			let isComplete: boolean = true;
			for (let c = 1; c <= 9; c++) {
				let rc = String.fromCharCode(r + 64) + c;
				if (this.grid.user[rc] !== this.grid.solved[rc])
					isComplete = false;
			}
			if (isComplete)
				newCSS += `.R${r} ${color.good}`;
		}

		//check all cols for completeness
		for (let c = 1; c <= 9; c++) {
			let isComplete: boolean = true;
			for (let r = 1; r <= 9; r++) {
				let rc = String.fromCharCode(r + 64) + c;
				if (this.grid.user[rc] !== this.grid.solved[rc])
					isComplete = false;
			}
			if (isComplete)
				newCSS += `.C${c} ${color.good}`;
		}

		//check all groups for completeness

		///top 3
		if (this.grid.user.A1 === this.grid.solved.A1 &&
			this.grid.user.A2 === this.grid.solved.A2 &&
			this.grid.user.A3 === this.grid.solved.A3 &&

			this.grid.user.B1 === this.grid.solved.B1 &&
			this.grid.user.B2 === this.grid.solved.B2 &&
			this.grid.user.B3 === this.grid.solved.B3 &&

			this.grid.user.C1 === this.grid.solved.C1 &&
			this.grid.user.C2 === this.grid.solved.C2 &&
			this.grid.user.C3 === this.grid.solved.C3)
			newCSS += `.G1 ${color.good}`;

		if (this.grid.user.A4 === this.grid.solved.A4 &&
			this.grid.user.A5 === this.grid.solved.A5 &&
			this.grid.user.A6 === this.grid.solved.A6 &&

			this.grid.user.B4 === this.grid.solved.B4 &&
			this.grid.user.B5 === this.grid.solved.B5 &&
			this.grid.user.B6 === this.grid.solved.B6 &&

			this.grid.user.C4 === this.grid.solved.C4 &&
			this.grid.user.C5 === this.grid.solved.C5 &&
			this.grid.user.C6 === this.grid.solved.C6)
			newCSS += `.G2 ${color.good}`;


		if (this.grid.user.A7 === this.grid.solved.A7 &&
			this.grid.user.A8 === this.grid.solved.A8 &&
			this.grid.user.A9 === this.grid.solved.A9 &&

			this.grid.user.B7 === this.grid.solved.B7 &&
			this.grid.user.B8 === this.grid.solved.B8 &&
			this.grid.user.B9 === this.grid.solved.B9 &&

			this.grid.user.C7 === this.grid.solved.C7 &&
			this.grid.user.C8 === this.grid.solved.C8 &&
			this.grid.user.C9 === this.grid.solved.C9)
			newCSS += `.G3 ${color.good}`

		/////middle  3
		if (this.grid.user.D1 === this.grid.solved.D1 &&
			this.grid.user.D2 === this.grid.solved.D2 &&
			this.grid.user.D3 === this.grid.solved.D3 &&

			this.grid.user.E1 === this.grid.solved.E1 &&
			this.grid.user.E2 === this.grid.solved.E2 &&
			this.grid.user.E3 === this.grid.solved.E3 &&

			this.grid.user.F1 === this.grid.solved.F1 &&
			this.grid.user.F2 === this.grid.solved.F2 &&
			this.grid.user.F3 === this.grid.solved.F3)
			newCSS += `.G4 ${color.good}`;

		if (this.grid.user.D4 === this.grid.solved.D4 &&
			this.grid.user.D5 === this.grid.solved.D5 &&
			this.grid.user.D6 === this.grid.solved.D6 &&

			this.grid.user.E4 === this.grid.solved.E4 &&
			this.grid.user.E5 === this.grid.solved.E5 &&
			this.grid.user.E6 === this.grid.solved.E6 &&

			this.grid.user.F4 === this.grid.solved.F4 &&
			this.grid.user.F5 === this.grid.solved.F5 &&
			this.grid.user.F6 === this.grid.solved.F6)
			newCSS += `.G5 ${color.good}`;

		if (this.grid.user.D7 === this.grid.solved.D7 &&
			this.grid.user.D8 === this.grid.solved.D8 &&
			this.grid.user.D9 === this.grid.solved.D9 &&

			this.grid.user.E7 === this.grid.solved.E7 &&
			this.grid.user.E8 === this.grid.solved.E8 &&
			this.grid.user.E9 === this.grid.solved.E9 &&

			this.grid.user.F7 === this.grid.solved.F7 &&
			this.grid.user.F8 === this.grid.solved.F8 &&
			this.grid.user.F9 === this.grid.solved.F9)
			newCSS += `.G6 ${color.good}`;

		////bottom 3 
		if (this.grid.user.G1 === this.grid.solved.G1 &&
			this.grid.user.G2 === this.grid.solved.G2 &&
			this.grid.user.G3 === this.grid.solved.G3 &&

			this.grid.user.H1 === this.grid.solved.H1 &&
			this.grid.user.H2 === this.grid.solved.H2 &&
			this.grid.user.H3 === this.grid.solved.H3 &&

			this.grid.user.I1 === this.grid.solved.I1 &&
			this.grid.user.I2 === this.grid.solved.I2 &&
			this.grid.user.I3 === this.grid.solved.I3)
			newCSS += `.G7 ${color.good}`;

		if (this.grid.user.G4 === this.grid.solved.G4 &&
			this.grid.user.G5 === this.grid.solved.G5 &&
			this.grid.user.G6 === this.grid.solved.G6 &&

			this.grid.user.H4 === this.grid.solved.H4 &&
			this.grid.user.H5 === this.grid.solved.H5 &&
			this.grid.user.H6 === this.grid.solved.H6 &&

			this.grid.user.I4 === this.grid.solved.I4 &&
			this.grid.user.I5 === this.grid.solved.I5 &&
			this.grid.user.I6 === this.grid.solved.I6)
			newCSS += `.G8 ${color.good}`;


		if (this.grid.user.G7 === this.grid.solved.G7 &&
			this.grid.user.G8 === this.grid.solved.G8 &&
			this.grid.user.G9 === this.grid.solved.G9 &&

			this.grid.user.H7 === this.grid.solved.H7 &&
			this.grid.user.H8 === this.grid.solved.H8 &&
			this.grid.user.H9 === this.grid.solved.H9 &&

			this.grid.user.I7 === this.grid.solved.I7 &&
			this.grid.user.I8 === this.grid.solved.I8 &&
			this.grid.user.I9 === this.grid.solved.I9)
			newCSS += `.G9 ${color.good}`;


		if (inputHappened)
			if (this.grid.user[this.lastCell] !== this.grid.solved[this.lastCell])
				newCSS += `#${this.lastCell} ${color.bad}`;

		return newCSS;

	}
}
