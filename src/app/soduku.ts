export module Soduku {


    export class Soduku {

        //class sudoku {
        // SUDOKU

        // 2014 - Einar Egilsson

        // This sudoku library is based HEAVILY on Peter Norvig's excellent Sudoku solver,
        // available at http://norvig.com/sudoku.html.

        // This library contains a solver, generator, serialization of puzzles
        // and methods to get conflicts and hints for puzzles that are in progress.
        // For a completely straight port of Norvig's solver, look at
        // https://github.com/einaregilsson/sudoku.js/sudoku-norvig.js

        // To see a better explanation of this library, look at the blog post
        // at http://einaregilsson.com/sudoku and to see it in action try
        // my Sudoku game at http://www.sudoku-webgame.com


        // Start by setting up some basic datastructures and connections
        // between them. Each row is numbered from 1-9, each column
        // from A-I. Each square has an id like E4.

        // Throughout this libarary we will often use the following variable names:

        //    d - digit
        //    r - row
        //    c - column
        //    s - square, e.g. E5
        //    u - unit, e.g. one whole row, column or box of squares.
        constructor() {

            for (let i = 0; i < Soduku.ROWS.length; i++) {
                Soduku.UNITLIST.push(Soduku.cross(Soduku.COLS, [Soduku.ROWS[i]]));
            }

            for (var i = 0; i < Soduku.COLS.length; i++) {
                Soduku.UNITLIST.push(Soduku.cross([Soduku.COLS[i]], Soduku.ROWS));
            }

            var groupCols = ['ABC', 'DEF', 'GHI'];
            var groupRows = ['123', '456', '789'];
            for (var c = 0; c < groupCols.length; c++) {
                for (var r = 0; r < groupRows.length; r++) {
                    Soduku.UNITLIST.push(Soduku.cross(Soduku.chars(groupCols[c]), Soduku.chars(groupRows[r])));
                }
            }

            for (var i = 0; i < Soduku.SQUARES.length; i++) {
                var square = Soduku.SQUARES[i]
                    , squarePeers = []
                    , squareUnits = [];

                for (var j = 0; j < Soduku.UNITLIST.length; j++) {
                    var unit = Soduku.UNITLIST[j];
                    if (Soduku.contains(unit, square)) {
                        squareUnits.push(unit);
                        for (var k = 0; k < unit.length; k++) {
                            if (!Soduku.contains(squarePeers, unit[k]) && unit[k] !== square) {
                                squarePeers.push(unit[k]);
                            }
                        }
                    }
                }
                Soduku.UNITS[square] = squareUnits;
                Soduku.PEERS[square] = squarePeers;
            }
        }

        static ROWS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        static COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        static DIGITS = '123456789';
        static SQUARES = Soduku.cross(Soduku.COLS, Soduku.ROWS);//Simple list of all squares, [A1, A2, ..., I9]
        static UNITLIST = [];  //List of all units. Each unit contains 9 squares. [ [A1,A2,...A9], [B1,B2,...,B9]...]
        static UNITS = {}; //Units organized by square. UNITS['A1'] = [ ['A1'...'A9'], ['A1'...'I1'], ['A1'...'C3']]
        static PEERS = {}; //For each square, the list of other square that share a unit with it. PEERS['A1'] = ['A1', 'A2' ... 'H1','I1']
        ///// Utility methods. /////

        //Array.indexOf is not supported in old IEs
        static vals(obj) {
            var result = [];
            for (var key in obj) {
                result.push(obj[key]);
            }
            return result;
        }

        static keys(obj) {
            var result = [];
            for (var key in obj) {
                result.push(key);
            }
            return result;
        }

        static each(list, func) {
            Soduku.filter(list, func);
        }

        static dict(keys, values) {
            var result = {};
            Soduku.each(keys, function (i, key) {
                result[key] = values[i];
            });
            return result;
        }

        private print(s) {
            console.log(s + '\r\n');
        }

        static all(list, func) {
            if (list != undefined)
                for (var i = 0; i < list.length; i++) {
                    if (!func(list[i])) {
                        return false;
                    }
                }
            return true;
        }

        static any(list, func) {
            for (var i = 0; i < list.length; i++) {
                var result = func(list[i]);
                if (result) {
                    return result;
                }
            }
            return false;
        }

        static filter(list, func) {
            var result = [];
            for (var i = 0; i < list.length; i++) {
                if (func.length > 1) {
                    if (func(i, list[i])) {
                        result.push(list[i]);
                    }
                } else if (func(list[i])) {
                    result.push(list[i]);
                }
            }
            return result;
        }

        static sum(list) {
            var result = 0;
            Soduku.each(list, function (l) {
                if (typeof l == 'number') {
                    result += l;
                } else if (typeof l == 'boolean') {
                    result += l ? 1 : 0;
                } else {
                    throw 'Only numbers and booleans supported';
                }
            });
            return result;
        }

        static some(seq, func) {
            //Return some element ofseq that is true.
            for (var i = 0; i < seq.length; i++) {
                var result = func(seq[i]);
                if (result) {
                    return result;
                }
            }
            return false;
        }

        static first(list, func) {
            var result = [];
            for (var i = 0; i < list.length; i++) {
                if (func.length > 1) {
                    if (func(i, list[i])) {
                        return list[i];
                    }
                } else if (func(list[i])) {
                    return list[i];
                }
            }
            return null;
        }

        static map(list, expr) {
            var result = [];
            Soduku.each(list, function (value) {
                if (typeof expr === 'function') {
                    result.push(expr(value));
                } else if (typeof expr === 'string') {
                    result.push(value[expr]);
                }
            });
            return result;
        }

        static max(list, expr) {
            var maxValue;

            Soduku.each(list, function (value) {
                var candidate;
                if (typeof expr === 'undefined') {
                    candidate = value;
                } else if (typeof expr === 'string') {
                    candidate = value[expr];
                } else if (typeof expr === 'function') {
                    candidate = expr(value);
                }

                if (typeof maxValue === 'undefined' || candidate > maxValue) {
                    maxValue = candidate;
                }
            });
            return maxValue;
        }

        static min(list, expr) {
            var minValue;

            Soduku.each(list, function (value) {
                var candidate;
                if (typeof expr === 'undefined') {
                    candidate = value;
                } else if (typeof expr === 'string') {
                    candidate = value[expr];
                } else if (typeof expr === 'function') {
                    candidate = expr(value);
                }

                if (typeof minValue === 'undefined' || candidate < minValue) {
                    minValue = candidate;
                }
            });
            return minValue;
        }

        static randomElement(list) {
            return list[Math.floor(Math.random() * list.length)];
        }


        //Array.indexOf is not supported in old IEs
        static contains(list, val) {
            return Soduku.any(list, function (x) { return x === val; });
        }

        static set(list) {
            var result = [];
            Soduku.each(list, function (val) {
                if (!Soduku.contains(result, val)) {
                    result.push(val);
                }
            });
            return result;
        }

        static concat() {
            return Array.prototype.concat.apply([], arguments);
        }

        static repeat(str, times) {
            return Array(times + 1).join(str);
        }

        static center(str, width) {
            var pad = width - str.length;
            if (pad <= 0) {
                return str;
            }
            return Soduku.repeat(' ', Math.floor(pad / 2))
                + str
                + Soduku.repeat(' ', Math.ceil(pad / 2));
        }

        static copy(board) {
            return Soduku.dict(Soduku.keys(board), Soduku.vals(board));
        }

        static randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        static shuffle(seq) {
            //Return a randomly shuffled copy of the input sequence.
            seq = Soduku.map(seq, function (x) { return x; });
            //Fisher yates shuffle
            var i = seq.length;
            while (--i) {
                var j = Math.floor(Math.random() * (i + 1));
                var ival = seq[i];
                var jval = seq[j];
                seq[i] = jval;
                seq[j] = ival;
            }

            return seq
        }

        static range(count) {
            var result = [];
            for (var i = 0; i < count; i++) {
                result.push(i);
            }
            return result;
        }

        static chars(s) {
            var result = [];
            for (var i = 0; i < s.length; i++) {
                result.push(s.charAt(i));
            }
            return result;
        }

        static cross(a, b) {
            var result = [];
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < b.length; j++) {
                    result.push(a[i] + b[j]);
                }
            }
            return result;
        }

        static getHint(puzzle, values) {
            if (!values) {
                throw { message: 'Values must be sent in' };
            }
            var solved = solve(puzzle, undefined);

            var errorSquares = [];
            // 1. Check if there are any wrong fields, Hint about those first
            for (var s in values) {
                var guess = values[s];
                if (guess && guess !== solved[s]) {
                    errorSquares.push(s);
                }
            }

            if (errorSquares.length > 0) {
                return {
                    type: 'error',
                    square: Soduku.randomElement(errorSquares)
                };
            }

            // 2. Find a field that has only one possibility and give a hint about that.
            var elimValues = {};
            for (var s in solved) {
                elimValues[s] = Soduku.DIGITS;
            }

            // One round of elimination only
            for (var s in values) {
                elimValues[s] = values[s];
                var digit = values[s];
                var units = Soduku.UNITS[s];
                for (var i = 0; i < Soduku.PEERS[s].length; i++) {
                    var elimSquare = Soduku.PEERS[s][i];
                    elimValues[elimSquare] = elimValues[elimSquare].replace(digit, '');
                }
            }

            var hintSquares = [];
            for (var s in elimValues) {
                if (elimValues[s].length == 1 && !values[s]) {
                    hintSquares.push(s);
                }
            }
            if (hintSquares.length > 0) {
                return {
                    type: 'squarehint',
                    square: Soduku.randomElement(hintSquares)
                }
            }


            var unitHints = [];
            // 3. Is there a unit where one digit is only a possibility in one square?
            for (var s in elimValues) {
                var value = elimValues[s];
                if (value.length == 1) {
                    continue;
                }
                var units = Soduku.UNITS[s];
                for (var i = 0; i < value.length; i++) {
                    var d = value.charAt(i);
                    for (var u = 0; u < units.length; u++) {
                        var unit = units[u];
                        if (Soduku.all(unit, function (s2) {
                            return s2 == s || elimValues[s2].indexOf(d) == -1;
                        })) {
                            var unitType = 'box';
                            if (unit[0].charAt(0) == unit[8].charAt(0)) {
                                unitType = 'row';
                            } else if (unit[0].charAt(1) == unit[8].charAt(1)) {
                                unitType = 'column';
                            }
                            unitHints.push({
                                type: 'unithint',
                                unitType: unitType,
                                unit: unit,
                                digit: d
                            });
                        }
                    }
                }
            }

            if (unitHints.length > 0) {
                return Soduku.randomElement(unitHints);
            }

            return {
                type: 'dontknow',
                squares: elimValues
            };
        }

        static getConflicts(values) {

            var errors = [];
            for (var key in values) {
                var value = values[key] + '';
                if (!value || value.length > 1) {
                    continue;
                }

                var units = Soduku.UNITS[key];
                for (var i = 0; i < Soduku.UNITS[key].length; i++) {
                    var unit = Soduku.UNITS[key][i];
                    for (var j = 0; j < unit.length; j++) {
                        var otherKey = unit[j];
                        var otherValue = values[otherKey] + '';

                        if (otherKey != key && value == otherValue) {
                            errors.push({
                                unit: unit,
                                errorFields: [key, otherKey]
                            });
                        }
                    }
                }
            }
            return errors;
        }

        static solve(grid, options) {
            return Soduku.search(Soduku.parseGrid(grid), options);
        }

        static search(values, options) {
            options = options || {};
            options.chooseDigit = options.chooseDigit || 'random';
            options.chooseSquare = options.chooseSquare || 'minDigits';

            //Using depth-first search and propagation, try all possible values."
            if (values === false) {
                return false; //Failed earlier
            }

            if (Soduku.all(Soduku.SQUARES, function (s) { return values[s].length == 1; })) {
                return values; // Solved!
            }

            //Chose the unfilled square s with the fewest possibilities
            var candidates = Soduku.filter(Soduku.SQUARES, function (s) { return values[s].length > 1; });
            candidates.sort(function (s1, s2) {
                if (values[s1].length != values[s2].length) {
                    return values[s1].length - values[s2].length;
                }
                if (s1 < s2) {
                    return -1;
                } else {
                    return 1;
                }

            });

            var s;
            if (options.chooseSquare == 'minDigits') {
                s = candidates[0];
            } else if (options.chooseSquare == 'maxDigits') {
                s = candidates[candidates.length - 1];
            } else if (options.chooseSquare == 'random') {
                s = candidates[Math.floor(Math.random() * candidates.length)];
            }

            var digitsLeft = Soduku.chars(values[s]);
            if (options.chooseDigit == 'max') {
                digitsLeft.reverse();
            } else if (options.chooseDigit == 'random') {
                digitsLeft = Soduku.shuffle(digitsLeft);
            }

            return Soduku.some(digitsLeft, function (d) { return Soduku.search(Soduku.assign(Soduku.copy(values), s, d), options) });
        }

        static isUnique(grid) {
            var input = typeof grid === 'string' ? Soduku.gridValues(grid) : grid;

            var solved1 = solve(input, { chooseDigit: 'min' });
            var solved2 = solve(input, { chooseDigit: 'max' });
            if (!solved1 || !solved2) {
                throw 'Failed to solve';
            }

            for (var s in solved1) {
                if (solved2[s] != solved1[s]) {
                    return false;
                }
            }
            return true;

        }

        static serialize(values) {
            var serialized = '';
            for (var i = 0; i < Soduku.SQUARES.length; i++) {
                serialized += values[Soduku.SQUARES[i]] || 'x';
            }
            serialized = serialized.replace(/xxxxxx/g, 'f')
                .replace(/xxxxx/g, 'e')
                .replace(/xxxx/g, 'd')
                .replace(/xxx/g, 'c')
                .replace(/xx/g, 'b')
                .replace(/x/g, 'a');
            return serialized;
        }

        static deserialize(serialized) {
            var values = {};
            serialized = serialized.replace(/f/g, 'xxxxxx')
                .replace(/e/g, 'xxxxx')
                .replace(/d/g, 'xxxx')
                .replace(/c/g, 'xxx')
                .replace(/b/g, 'xx')
                .replace(/a/g, 'x');

            for (var i = 0; i < Soduku.SQUARES.length; i++) {
                if (serialized.charAt(i) != 'x') {
                    values[Soduku.SQUARES[i]] = serialized.charAt(i);
                }
            }
            return values;
        }

        static isSolvableWithElimination(grid) {
            return Soduku.isSolved(Soduku.parseGrid(grid));
        }

        static isSolved(values) {
            for (var s in values) {
                if (values[s].length > 1) {
                    return false;
                }
            }
            return true;
        }

        static squareCount(difficulty) {
            if (difficulty == 'easy') {
                return 35;
            } else if (difficulty == 'medium') {
                return 28;
            }
            return 20;
        }

        static generate(difficulty) {
            var start = new Date().getTime();
            var minSquares = Soduku.squareCount(difficulty || 'easy');

            var fullGrid = solve({}, null);
            var generatedGrid = Soduku.copy(fullGrid);
            var shuffledSquares = Soduku.shuffle(Soduku.SQUARES);
            var filledSquares = shuffledSquares.length;

            for (var i = 0; i < shuffledSquares.length; i++) {
                var s = shuffledSquares[i];

                delete generatedGrid[s];
                filledSquares--;
                if (!Soduku.isSolvableWithElimination(generatedGrid) || !isUnique(generatedGrid)) {
                    generatedGrid[s] = fullGrid[s];
                    filledSquares++;
                }

                if (filledSquares === minSquares) {
                    break;
                }

            }
            var time = new Date().getTime() - start;
            Soduku.debug('Generated puzzle with ' + Soduku.keys(generatedGrid).length + ' squares in ' + time + 'ms');
            return generatedGrid;
        }

        static parseGrid(grid) {
            //Convert grid to a dict of possible values, {square: digits}, or
            //return false if a contradiction is detected

            // To start, every square can be any digit; then assign values from the grid.
            var values = {};
            Soduku.each(Soduku.SQUARES, function (s) { values[s] = Soduku.DIGITS; });


            var input = typeof grid === 'string' ? Soduku.gridValues(grid) : grid;
            for (var s in input) {
                var d = input[s];
                if (!Soduku.assign(values, s, d)) {
                    return false; // (Fail if we can't assign d to square s.)
                }
            }
            return values;
        }

        static gridValues(grid) {
            //Convert grid into a dict of {square: char} with '0' or '.' for empties.
            grid = grid.replace(/[^0-9\.]/g, '');
            var input = {};
            for (var i = 0; i < Soduku.SQUARES.length; i++) {
                var val = grid[i];
                if (Soduku.DIGITS.indexOf(val) != -1) {
                    input[Soduku.SQUARES[i]] = val;
                }
            }
            return input;
        }

        //################ Constraint Propagation ################

        static assign(values, s, d) {
            //Eliminate all the other values (except d) from values[s] and propagate.
            //Return values, except return false if a contradiction is detected.
            var otherValues = values[s].replace(d, '');
            if (Soduku.all(Soduku.chars(otherValues), function (d2) { return Soduku.eliminate(values, s, d2); })) {
                return values;
            } else {
                return false;
            }
        }

        static eliminate(values, s, d) {
            //Eliminate d from values[s]; propagate when values or places <= 2.
            //return values, except return false if a contradiction is detected.

            if (values[s].indexOf(d) == -1) {
                return values; //Already eliminated
            }

            values[s] = values[s].replace(d, '');
            // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
            if (values[s].length == 0) {
                return false; //Contradiction: removed last value
            } else if (values[s].length == 1) {
                var d2 = values[s];
                if (!Soduku.all(Soduku.PEERS[s], function (s2) { return Soduku.eliminate(values, s2, d2); })) {
                    return false;
                }
            }
            // (2) If a unit u is reduced to only one place for a value d, then put it there.
            if (Soduku.UNITS[s] != undefined)
                for (var i = 0; i < Soduku.UNITS[s].length; i++) {
                    var u = Soduku.UNITS[s][i];
                    var dplaces = Soduku.filter(u, function (s2) { return values[s2].indexOf(d) != -1; });
                    if (dplaces.length == 0) {
                        return false; //Contradiction: no place for this value
                    } else if (dplaces.length == 1) {
                        // d can only be in one place in unit; assign it there
                        if (!Soduku.assign(values, dplaces[0], d)) {
                            return false;
                        }
                    }
                }

            return values;
        }



        static debug(msg) {
            if (debug) {
                // print(msg);
                console.log(msg);
            }
        }

        // return module;
        // }) ();

        // if (typeof exports !== 'undefined') {
        //     for (var i in sudoku) {
        //         exports[i] = sudoku[i];
        //     }
        // }

    }

    let solve = Soduku.solve
    let getConflicts = Soduku.getConflicts;
    let getHint = Soduku.getHint;
    let isUnique = Soduku.isUnique;
    let generate = Soduku.generate;
    let serialize = Soduku.serialize;
    let deserialize = Soduku.deserialize;
    let debug = true;//false,
    let test = Soduku.parseGrid;
    let unitList = Soduku.UNITLIST;

}