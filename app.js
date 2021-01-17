const express = require('express');
const bodyParser = require('body-parser');
const sudoku = require('./src/sudoku');

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/solve/text', (req, res) => {
    let solver = new sudoku.Sudoku(sudoku.parse(req.body.puzzle));
    solver.solve();
    let solutions = "";
    solver.solutions.forEach(sol => {
        solutions += sudoku.dump(sol) + "\n\n";
    })
    res.render('solved', {
        solutions: solutions
    });
});

app.post('/solve/json', (req, res) => {
    let solver = new sudoku.Sudoku(req.body);
    solver.solve();
    res.json(solver.solutions);
});

app.listen(port);
