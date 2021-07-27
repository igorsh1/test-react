function Square(props) {
    let butClass;
    let squareColor = {};
    if (props.isWin) squareColor =  {boxShadow: 'inset 0 0 10px 10px yellow'};//{backgroundColor: 'yellow'};
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
    if (props.current) butClass += ' current';
    return ( //style={{color: 'red'}}
        <button className = { butClass }                
                style={ squareColor }
                onClick = { e => props.onClick(e) }> 
            { props.value } 
        </button>
    );
}

function SquareRow(props) {
    return (
        <div className = "board-row" /*key = {props.i}*/ > {props.row} </div>  
    );
}

class Board extends React.Component {
    renderSquare(i,current) {
        return (
            <Square value = { this.props.squares[i] }
                    key = {i}
                    current = { current }
                    isWin = { (this.props.winLine.length !==0) && (this.props.winLine.indexOf(i)!==-1) }
                    onClick = {(e) => this.props.onClick(e,i) } />
        ); 
    }

    renderRow(i,arr){
       return (//якщо ств декілька подібн комп в іншому обовязково треба передавати аттр key
            <SquareRow row = {arr} key = {i} />
       ); 
    }

    render() {
        let board = [];
        let row =[];
        let current;
        for (let i = 0; i <= 2; i++) {
            row[i]=[];
            board[i]=[];
            for (let j = 0; j <=2; j++) {
                current = (this.props.position.i==i+1 && this.props.position.j==j+1)?true:false;
                row[i].push(this.renderSquare(3*i+j,current));                
            }  
            board[i].push(this.renderRow(i,row[i]));          
        }
        return ( 
          <div> {board} </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: {i:null, j:null},
                //buttonText: ''
            }],
            stepNumber: 0,
            xIsNext: true,            
        };
    }

    handleClick(e,i) {
        if ( this.state.stepNumber > 0  && //щоб не питало для нової гри
            (this.state.history.length > this.state.stepNumber + 1) && 
            !confirm('History of your next steps will be deleted, continue?')) return;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const obj = e.target;        
        if (this.calculateWinner(squares).name) {//є переможець            
            return;
        }
        if (squares[i]) {//натисли на заповнене вічко
            e.target.style.backgroundColor = 'magenta';
            setTimeout(() => { obj.style.backgroundColor = 'white'; }, 300);
            return;
        }
        
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                position: {i: Math.floor(i/3)+1, j:i%3+1},
                //buttonText: `row=${Math.floor(i/3)+1} col=${i%3+1}`,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,           
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,            
        });
    }

    calculateWinner(squares) {
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
                //this.setState({winLine: lines[i]}); бо викл в render а там змінювати стан неможна
                return {name: squares[a], winLine: lines[i]};
            }
        }
        return {name: null, winLine: []};
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #'+move+' '+ `row=${step.position.i} col=${step.position.j}` :
                'Go to game start';
            return ( 
              <li key = { move }>
                <button onClick = {() => this.jumpTo(move)}
                        active = {(move == this.state.stepNumber)?1:0}>
                  { desc }
                </button> 
              </li>
            );
        });

        let status;
        let shadowColor;        
        if (winner.name) {
            status = "Winner: " + winner.name;
            shadowColor = (winner.name=='X') ? 'blue':'red';                 
        } else if (this.state.stepNumber==9) {            
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
                <Board squares = { current.squares } 
                    position = { current.position }
                    winLine = { winner.winLine }
                    onClick = { (e,i)=> this.handleClick(e,i) }
                />
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

