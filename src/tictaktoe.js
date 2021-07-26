function Square(props) {
    let butClass;
    switch (props.value) {
        case null:
            butClass = "square";
            break;
        case 'X':
            butClass = "square square_blue";
            break;
        case 'O':
            butClass = "square square_red";
    }
    return ( //style={{color: 'red'}}
        <button className = { butClass }
                onClick = { e => props.onClick(e) }> 
            { props.value } 
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value = { this.props.squares[i] }
                    onClick = {(e) => this.props.onClick(e,i) } />
        ); 
    }

    render() {
        return ( 
          <div>
            <div className = "board-row" > { this.renderSquare(0) } { this.renderSquare(1) } { this.renderSquare(2) } </div> 
            <div className = "board-row" > { this.renderSquare(3) } { this.renderSquare(4) } { this.renderSquare(5) } </div> 
            <div className = "board-row" > { this.renderSquare(6) } { this.renderSquare(7) } { this.renderSquare(8) } </div>
          </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(e,i) {
        if ((this.state.history.length > this.state.stepNumber + 1) && 
            !confirm('History of your next steps will be deleted, continue?')) return;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        var obj = e.target;
        if (calculateWinner(squares)) return;
        if (squares[i]) {
            e.target.style.backgroundColor = 'magenta';
            setTimeout(() => { obj.style.backgroundColor = 'white'; }, 300);
            return;
        }
        
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return ( 
              <li key = { move }>
                <button onClick = {() => this.jumpTo(move)}>
                  { desc }
                </button> 
              </li>
            );
        });

        let status;
        let shadowColor;        
        if (winner) {
            status = "Winner: " + winner;
            shadowColor = (winner=='X') ? 'blue':'red';                 
        } else if (this.state.stepNumber==10) {            
            status = 'Draw no winner';
            shadowColor = 'green';            
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O"); 
            shadowColor = 'black';            
        }
        if (this.state.history.length>1) {//щоб не звернувся до не створ ел при першому рендерингу
            let style = document.querySelector('.game-board').style;
            style.boxShadow='0px 0px 8px 2px ' + shadowColor;
            style.border='5px solid ' + shadowColor;
        } 
        return ( 
          <div className = "game">
            <div className = "game-board">
              <Board squares = { current.squares } onClick = { (e,i)=> this.handleClick(e,i) } />
            </div> 
            <div className = "game-info">
              <div> { status } </div> 
              <ol> { moves } </ol>
            </div>
          </div>
        );
    }
}

// ========================================

ReactDOM.render( < Game / > , document.getElementById("tictaktoe"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}