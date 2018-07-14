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

	ngOnInit() {
		let s = SudokuGame.getInstance();
		s.newGame();

	}

	drawCell(cell) {
		let s = SudokuGame.getInstance();
		let c = s.grid.user[cell];
		if (c === undefined || c === "0")
			return " ";
		else
			return c;
	}

	//lastCell: any = null;
	useCell(cell) {
		let sudoku = SudokuGame.getInstance();

		let c = cell.currentTarget.id;

		if (c.startsWith('N')) {  //if we clicked a number, 
			if (sudoku.lastCell !== null && sudoku.grid.base[sudoku.lastCell] == undefined)
				sudoku.grid.user[sudoku.lastCell] = c[1];
		}
		else
			sudoku.lastCell = cell.currentTarget.id;
		sudoku.style.innerText = this.colorGrid(c.startsWith('N'));  //if we clicked a number, color grid

		if (sudoku.grid.isSolved) {
			console.log("Winner");
			//stop timer
			//finish game
		}
	}

	colorGrid(inputHappened: boolean) {
		let sudoku = SudokuGame.getInstance();
		let options = {  //todo: this should be a configuration option
			//todo:  import color into here
			HighlightSelectedCell: true,
			HighlightSimilarNumbers: true,
			HighlightSelectedRowsAndColumns: true,
			HighlightCompletedRowsAndColumns: true,
			HighlightCompletedGroups: true,
			HighlightIncorrectEntry: true,
			HighlightCompletedNumbers: true
		}

		let color = {
			bad: "{background: red} ",
			good: "{background: lightgreen} ",
			highlight: "{background: LightYellow} ",
			highlightRed: "{background: orange} ",
			selected: "{background:yellow}"
		}

		let newCSS: string = "";

		//Highlight the selected cell.  
		if (options.HighlightSelectedCell)
			newCSS += `#${sudoku.lastCell} ${color.selected}`;

		let completed = [9];
		for (let r = 1; r <= 9; r++) {
			let rowComplete: boolean = true;
			let colComplete: boolean = true;
			for (let c = 1; c <= 9; c++) {
				let RC = String.fromCharCode(r + 64) + c;
				let CR = String.fromCharCode(c + 64) + r;
				if (options.HighlightSimilarNumbers && sudoku.grid.user[RC] !== "0" && sudoku.grid.user[RC] == sudoku.grid.user[sudoku.lastCell])
					newCSS += `#${RC} ${color.highlight}`;  //highlight cell only
				if (options.HighlightSelectedRowsAndColumns && sudoku.grid.user[RC] == sudoku.grid.user[sudoku.lastCell]) {
					newCSS += `.R${r} ${color.highlightRed}`;  //highlight row cell is in
					newCSS += `.C${c} ${color.highlightRed}`;  //highlight column cell is in
				}
				if (sudoku.grid.user[RC] !== sudoku.grid.solution[RC]) rowComplete = false;
				if (sudoku.grid.user[CR] !== sudoku.grid.solution[CR]) colComplete = false;
				completed[sudoku.grid.user[RC]] = completed[sudoku.grid.user[RC]] + 1 || 1;
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
		sudoku.grid.isSolved = _isSolved;

		//check all groups for completeness
		if (options.HighlightCompletedGroups) {
			//top 3
			if (sudoku.grid.user.A1 === sudoku.grid.solution.A1 &&
				sudoku.grid.user.A2 === sudoku.grid.solution.A2 &&
				sudoku.grid.user.A3 === sudoku.grid.solution.A3 &&

				sudoku.grid.user.B1 === sudoku.grid.solution.B1 &&
				sudoku.grid.user.B2 === sudoku.grid.solution.B2 &&
				sudoku.grid.user.B3 === sudoku.grid.solution.B3 &&

				sudoku.grid.user.C1 === sudoku.grid.solution.C1 &&
				sudoku.grid.user.C2 === sudoku.grid.solution.C2 &&
				sudoku.grid.user.C3 === sudoku.grid.solution.C3)
				newCSS += `.G1 ${color.good}`;

			if (sudoku.grid.user.A4 === sudoku.grid.solution.A4 &&
				sudoku.grid.user.A5 === sudoku.grid.solution.A5 &&
				sudoku.grid.user.A6 === sudoku.grid.solution.A6 &&

				sudoku.grid.user.B4 === sudoku.grid.solution.B4 &&
				sudoku.grid.user.B5 === sudoku.grid.solution.B5 &&
				sudoku.grid.user.B6 === sudoku.grid.solution.B6 &&

				sudoku.grid.user.C4 === sudoku.grid.solution.C4 &&
				sudoku.grid.user.C5 === sudoku.grid.solution.C5 &&
				sudoku.grid.user.C6 === sudoku.grid.solution.C6)
				newCSS += `.G2 ${color.good}`;


			if (sudoku.grid.user.A7 === sudoku.grid.solution.A7 &&
				sudoku.grid.user.A8 === sudoku.grid.solution.A8 &&
				sudoku.grid.user.A9 === sudoku.grid.solution.A9 &&

				sudoku.grid.user.B7 === sudoku.grid.solution.B7 &&
				sudoku.grid.user.B8 === sudoku.grid.solution.B8 &&
				sudoku.grid.user.B9 === sudoku.grid.solution.B9 &&

				sudoku.grid.user.C7 === sudoku.grid.solution.C7 &&
				sudoku.grid.user.C8 === sudoku.grid.solution.C8 &&
				sudoku.grid.user.C9 === sudoku.grid.solution.C9)
				newCSS += `.G3 ${color.good}`

			//middle  3
			if (sudoku.grid.user.D1 === sudoku.grid.solution.D1 &&
				sudoku.grid.user.D2 === sudoku.grid.solution.D2 &&
				sudoku.grid.user.D3 === sudoku.grid.solution.D3 &&

				sudoku.grid.user.E1 === sudoku.grid.solution.E1 &&
				sudoku.grid.user.E2 === sudoku.grid.solution.E2 &&
				sudoku.grid.user.E3 === sudoku.grid.solution.E3 &&

				sudoku.grid.user.F1 === sudoku.grid.solution.F1 &&
				sudoku.grid.user.F2 === sudoku.grid.solution.F2 &&
				sudoku.grid.user.F3 === sudoku.grid.solution.F3)
				newCSS += `.G4 ${color.good}`;

			if (sudoku.grid.user.D4 === sudoku.grid.solution.D4 &&
				sudoku.grid.user.D5 === sudoku.grid.solution.D5 &&
				sudoku.grid.user.D6 === sudoku.grid.solution.D6 &&

				sudoku.grid.user.E4 === sudoku.grid.solution.E4 &&
				sudoku.grid.user.E5 === sudoku.grid.solution.E5 &&
				sudoku.grid.user.E6 === sudoku.grid.solution.E6 &&

				sudoku.grid.user.F4 === sudoku.grid.solution.F4 &&
				sudoku.grid.user.F5 === sudoku.grid.solution.F5 &&
				sudoku.grid.user.F6 === sudoku.grid.solution.F6)
				newCSS += `.G5 ${color.good}`;

			if (sudoku.grid.user.D7 === sudoku.grid.solution.D7 &&
				sudoku.grid.user.D8 === sudoku.grid.solution.D8 &&
				sudoku.grid.user.D9 === sudoku.grid.solution.D9 &&

				sudoku.grid.user.E7 === sudoku.grid.solution.E7 &&
				sudoku.grid.user.E8 === sudoku.grid.solution.E8 &&
				sudoku.grid.user.E9 === sudoku.grid.solution.E9 &&

				sudoku.grid.user.F7 === sudoku.grid.solution.F7 &&
				sudoku.grid.user.F8 === sudoku.grid.solution.F8 &&
				sudoku.grid.user.F9 === sudoku.grid.solution.F9)
				newCSS += `.G6 ${color.good}`;

			//bottom 3 
			if (sudoku.grid.user.G1 === sudoku.grid.solution.G1 &&
				sudoku.grid.user.G2 === sudoku.grid.solution.G2 &&
				sudoku.grid.user.G3 === sudoku.grid.solution.G3 &&

				sudoku.grid.user.H1 === sudoku.grid.solution.H1 &&
				sudoku.grid.user.H2 === sudoku.grid.solution.H2 &&
				sudoku.grid.user.H3 === sudoku.grid.solution.H3 &&

				sudoku.grid.user.I1 === sudoku.grid.solution.I1 &&
				sudoku.grid.user.I2 === sudoku.grid.solution.I2 &&
				sudoku.grid.user.I3 === sudoku.grid.solution.I3)
				newCSS += `.G7 ${color.good}`;

			if (sudoku.grid.user.G4 === sudoku.grid.solution.G4 &&
				sudoku.grid.user.G5 === sudoku.grid.solution.G5 &&
				sudoku.grid.user.G6 === sudoku.grid.solution.G6 &&

				sudoku.grid.user.H4 === sudoku.grid.solution.H4 &&
				sudoku.grid.user.H5 === sudoku.grid.solution.H5 &&
				sudoku.grid.user.H6 === sudoku.grid.solution.H6 &&

				sudoku.grid.user.I4 === sudoku.grid.solution.I4 &&
				sudoku.grid.user.I5 === sudoku.grid.solution.I5 &&
				sudoku.grid.user.I6 === sudoku.grid.solution.I6)
				newCSS += `.G8 ${color.good}`;


			if (sudoku.grid.user.G7 === sudoku.grid.solution.G7 &&
				sudoku.grid.user.G8 === sudoku.grid.solution.G8 &&
				sudoku.grid.user.G9 === sudoku.grid.solution.G9 &&

				sudoku.grid.user.H7 === sudoku.grid.solution.H7 &&
				sudoku.grid.user.H8 === sudoku.grid.solution.H8 &&
				sudoku.grid.user.H9 === sudoku.grid.solution.H9 &&

				sudoku.grid.user.I7 === sudoku.grid.solution.I7 &&
				sudoku.grid.user.I8 === sudoku.grid.solution.I8 &&
				sudoku.grid.user.I9 === sudoku.grid.solution.I9)
				newCSS += `.G9 ${color.good}`;
		}

		//if selected the wrong #, highlight it
		if (options.HighlightIncorrectEntry)
			if (inputHappened)
				if (sudoku.grid.user[sudoku.lastCell] !== sudoku.grid.solution[sudoku.lastCell])
					newCSS += `#${sudoku.lastCell} ${color.bad}`;

		return newCSS;

	}
}

export class SudokuGame {
	public style: any;
	public grid: any;
	public lastCell: string;


	private static _instance: SudokuGame = new SudokuGame();
	private constructor() {
		if (SudokuGame._instance) {
			throw new Error("Error: Instantiation failed: Use SudokuGame.getInstance() instead of new.");
		}
		SudokuGame._instance = this;
	}

	public static getInstance(): SudokuGame {
		return SudokuGame._instance;
	}

	public newGame(): void {

		let SudokuGame = sudoku.generate("easy");
		let _solution = sudoku.solve(SudokuGame);
		this.lastCell = "";

		let _user: any = {};

		if (this.style == undefined) {
			this.style = document.createElement('style'); //todo:  this sux.  why can't i just create CSS and add it to the style tag?  //todo:move to inside the app-grid element
			document.body.appendChild(this.style);
		}
		this.style.innerText = "";

		//fill in the rest of _user
		for (let r = 1; r <= 9; r++)
			for (let c = 1; c <= 9; c++) {
				let rc = String.fromCharCode(r + 64) + c;
				if (SudokuGame[rc] === undefined)
					_user[rc] = "0";
				else
					_user[rc] = SudokuGame[rc];
			}


		this.grid = {
			base: SudokuGame,
			user: _user,
			solution: _solution,
			// notes: Array[9][9],
			isSolved: false,
		};
	}



}