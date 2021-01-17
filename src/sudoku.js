function clone(obj) {
    let out, value, key;
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    out = Array.isArray(obj) ? [] : {}
    for (key in obj) {
        value = obj[key]
        out[key] = clone(value)
    }
    return out
}

module.exports.parse = function parse(puzzle) {
    const zerocode = "0".charCodeAt();
    let board = [];
    puzzle.replaceAll(" ", "").split("\n").forEach(line => {
        let row = [];
        for (let c of line) {
            row.push(c.charCodeAt() - zerocode);
        }
        board.push(row);
    });
    return board;
}

module.exports.dump = function dump(board) {
    const zerocode = "0".charCodeAt();
    let puzzle = "";
    for(let r = 0; r < 9; r += 1) {
        for(let c = 0; c < 9; c += 1) {
            puzzle += String.fromCharCode(board[r][c] + zerocode);
        }
        if (r < 8) {
            puzzle += "\n";
        }
    }
    return puzzle;
}

module.exports.Sudoku = class Solver {
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.solutions = [];
    }

    findCandidates(row, col) {
        let candidates = new Set([1,2,3,4,5,6,7,8,9]);
        for(let r = 0; r < 9; r += 1) {
            let val = this.puzzle[r][col];
            if (val > 0) {
                candidates.delete(val);
            }
        }
        for(let c = 0; c < 9; c += 1) {
            let val = this.puzzle[row][c];
            if (val > 0) {
                candidates.delete(val);
            }
        }
        let rowbox = Math.floor(row / 3);
        let colbox = Math.floor(col / 3);
        for(let r = rowbox * 3; r < (rowbox + 1) * 3; r += 1) {
            for(let c = colbox * 3; c < (colbox + 1) * 3; c += 1) {
                let val = this.puzzle[r][c];
                if (val > 0) {
                    candidates.delete(val);
                }
            }
        }
        return candidates;
    }

    solve() {
        for(let r = 0; r < 9; r += 1) {
            for(let c = 0; c < 9; c += 1) {
                let val = this.puzzle[r][c];
                if (val == 0) {
                    this.findCandidates(r, c).forEach(cand => {
                        this.puzzle[r][c] = cand;
                        this.solve();
                        this.puzzle[r][c] = 0;
                    });
                    return;
                }
            }
        }
        this.solutions.push(clone(this.puzzle));
    }
}
