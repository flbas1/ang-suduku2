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
	style: any;

	ngOnInit() {
		let _sudoku = sudoku.generate("easy");
		let _solution = sudoku.solve(_sudoku);

		let _user: any = {};
		this.style = document.createElement('style'); //todo:move to inside the app-grid element
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
			solution: _solution,
			// notes: Array[9][9],
			isSolved: false,
		};
	}

	drawCell(cell) {

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
			if (this.lastCell !== null && this.grid.base[this.lastCell] == undefined)
				this.grid.user[this.lastCell] = c[1];
		}
		else
			this.lastCell = cell.currentTarget.id;
		this.style.innerText = this.colorGrid(c.startsWith('N'));  //if we clicked a number, color grid

		if (this.grid.isSolved) {
			console.log("Winner");
			//stop timer
			//finish game
		}
	}

	colorGrid(inputHappened: boolean) {

		let options = {  //todo: this should be a configuration option
			//todo:  import color into here
			HighlightSelectedCell: true,
			HighlightSimilarNumbers: true,
			HighlightSelectedRowsAndColumns: false,
			HighlightCompletedRowsAndColumns: false,
			HighlightCompletedGroups: true,
			HighlightIncorrectEntry: true,
			HighlightCompletedNumbers: true
		}

		let color = {
			bad: "{background: red} ",
			good: "{background: lightgreen} ",
			highlight: "{background: green} ",
			highlightRed: "{background: orange} ",
		}

		let newCSS: string = "";

		//Highlight the selected cell.  
		if (options.HighlightSelectedCell)
			newCSS += `#${this.lastCell} ${color.highlight}`;

		//removing all of the loops
		let completed = [9];
		for (let r = 1; r <= 9; r++) {
			let rowComplete: boolean = true;
			let colComplete: boolean = true;
			for (let c = 1; c <= 9; c++) {
				let RC = String.fromCharCode(r + 64) + c;
				let CR = String.fromCharCode(c + 64) + r;
				if (options.HighlightSimilarNumbers && this.grid.user[RC] !== "0" && this.grid.user[RC] == this.grid.user[this.lastCell])
					newCSS += `#${RC} ${color.highlight}`;  //highlight cell only
				if (options.HighlightSelectedRowsAndColumns && this.grid.user[RC] == this.grid.user[this.lastCell]) {
					newCSS += `.R${r} ${color.highlightRed}`;  //highlight row cell is in
					newCSS += `.C${c} ${color.highlightRed}`;  //highlight column cell is in
				}
				if (this.grid.user[RC] !== this.grid.solution[RC]) rowComplete = false;
				if (this.grid.user[CR] !== this.grid.solution[CR]) colComplete = false;
				completed[this.grid.user[RC]] = completed[this.grid.user[RC]] + 1 || 1;
			}
			if (options.HighlightCompletedRowsAndColumns && rowComplete) newCSS += `.R${r} ${color.good}`;
			if (options.HighlightCompletedRowsAndColumns && colComplete) newCSS += `.C${r} ${color.good}`;
		}

		let _isSolved: boolean = true;
		for (let c = 1; c <= 9; c++)
			if (completed[c] == 9) {
				if (options.HighlightCompletedNumbers)
					newCSS += `#N${c} ${color.good}`;
			}
			else
				_isSolved = false;
		this.grid.isSolved = _isSolved;

		//check all groups for completeness
		if (options.HighlightCompletedGroups) {
			//top 3
			if (this.grid.user.A1 === this.grid.solution.A1 &&
				this.grid.user.A2 === this.grid.solution.A2 &&
				this.grid.user.A3 === this.grid.solution.A3 &&

				this.grid.user.B1 === this.grid.solution.B1 &&
				this.grid.user.B2 === this.grid.solution.B2 &&
				this.grid.user.B3 === this.grid.solution.B3 &&

				this.grid.user.C1 === this.grid.solution.C1 &&
				this.grid.user.C2 === this.grid.solution.C2 &&
				this.grid.user.C3 === this.grid.solution.C3)
				newCSS += `.G1 ${color.good}`;

			if (this.grid.user.A4 === this.grid.solution.A4 &&
				this.grid.user.A5 === this.grid.solution.A5 &&
				this.grid.user.A6 === this.grid.solution.A6 &&

				this.grid.user.B4 === this.grid.solution.B4 &&
				this.grid.user.B5 === this.grid.solution.B5 &&
				this.grid.user.B6 === this.grid.solution.B6 &&

				this.grid.user.C4 === this.grid.solution.C4 &&
				this.grid.user.C5 === this.grid.solution.C5 &&
				this.grid.user.C6 === this.grid.solution.C6)
				newCSS += `.G2 ${color.good}`;


			if (this.grid.user.A7 === this.grid.solution.A7 &&
				this.grid.user.A8 === this.grid.solution.A8 &&
				this.grid.user.A9 === this.grid.solution.A9 &&

				this.grid.user.B7 === this.grid.solution.B7 &&
				this.grid.user.B8 === this.grid.solution.B8 &&
				this.grid.user.B9 === this.grid.solution.B9 &&

				this.grid.user.C7 === this.grid.solution.C7 &&
				this.grid.user.C8 === this.grid.solution.C8 &&
				this.grid.user.C9 === this.grid.solution.C9)
				newCSS += `.G3 ${color.good}`

			//middle  3
			if (this.grid.user.D1 === this.grid.solution.D1 &&
				this.grid.user.D2 === this.grid.solution.D2 &&
				this.grid.user.D3 === this.grid.solution.D3 &&

				this.grid.user.E1 === this.grid.solution.E1 &&
				this.grid.user.E2 === this.grid.solution.E2 &&
				this.grid.user.E3 === this.grid.solution.E3 &&

				this.grid.user.F1 === this.grid.solution.F1 &&
				this.grid.user.F2 === this.grid.solution.F2 &&
				this.grid.user.F3 === this.grid.solution.F3)
				newCSS += `.G4 ${color.good}`;

			if (this.grid.user.D4 === this.grid.solution.D4 &&
				this.grid.user.D5 === this.grid.solution.D5 &&
				this.grid.user.D6 === this.grid.solution.D6 &&

				this.grid.user.E4 === this.grid.solution.E4 &&
				this.grid.user.E5 === this.grid.solution.E5 &&
				this.grid.user.E6 === this.grid.solution.E6 &&

				this.grid.user.F4 === this.grid.solution.F4 &&
				this.grid.user.F5 === this.grid.solution.F5 &&
				this.grid.user.F6 === this.grid.solution.F6)
				newCSS += `.G5 ${color.good}`;

			if (this.grid.user.D7 === this.grid.solution.D7 &&
				this.grid.user.D8 === this.grid.solution.D8 &&
				this.grid.user.D9 === this.grid.solution.D9 &&

				this.grid.user.E7 === this.grid.solution.E7 &&
				this.grid.user.E8 === this.grid.solution.E8 &&
				this.grid.user.E9 === this.grid.solution.E9 &&

				this.grid.user.F7 === this.grid.solution.F7 &&
				this.grid.user.F8 === this.grid.solution.F8 &&
				this.grid.user.F9 === this.grid.solution.F9)
				newCSS += `.G6 ${color.good}`;

			//bottom 3 
			if (this.grid.user.G1 === this.grid.solution.G1 &&
				this.grid.user.G2 === this.grid.solution.G2 &&
				this.grid.user.G3 === this.grid.solution.G3 &&

				this.grid.user.H1 === this.grid.solution.H1 &&
				this.grid.user.H2 === this.grid.solution.H2 &&
				this.grid.user.H3 === this.grid.solution.H3 &&

				this.grid.user.I1 === this.grid.solution.I1 &&
				this.grid.user.I2 === this.grid.solution.I2 &&
				this.grid.user.I3 === this.grid.solution.I3)
				newCSS += `.G7 ${color.good}`;

			if (this.grid.user.G4 === this.grid.solution.G4 &&
				this.grid.user.G5 === this.grid.solution.G5 &&
				this.grid.user.G6 === this.grid.solution.G6 &&

				this.grid.user.H4 === this.grid.solution.H4 &&
				this.grid.user.H5 === this.grid.solution.H5 &&
				this.grid.user.H6 === this.grid.solution.H6 &&

				this.grid.user.I4 === this.grid.solution.I4 &&
				this.grid.user.I5 === this.grid.solution.I5 &&
				this.grid.user.I6 === this.grid.solution.I6)
				newCSS += `.G8 ${color.good}`;


			if (this.grid.user.G7 === this.grid.solution.G7 &&
				this.grid.user.G8 === this.grid.solution.G8 &&
				this.grid.user.G9 === this.grid.solution.G9 &&

				this.grid.user.H7 === this.grid.solution.H7 &&
				this.grid.user.H8 === this.grid.solution.H8 &&
				this.grid.user.H9 === this.grid.solution.H9 &&

				this.grid.user.I7 === this.grid.solution.I7 &&
				this.grid.user.I8 === this.grid.solution.I8 &&
				this.grid.user.I9 === this.grid.solution.I9)
				newCSS += `.G9 ${color.good}`;
		}

		//if selected the wrong #, highlight it
		if (options.HighlightIncorrectEntry)
			if (inputHappened)
				if (this.grid.user[this.lastCell] !== this.grid.solution[this.lastCell])
					newCSS += `#${this.lastCell} ${color.bad}`;

		return newCSS;

	}
}
