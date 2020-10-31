import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      squareNumber: 0,
      doMove: false,
      deleteSquare: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.squareNumber < 6) {
      const num = this.state.squareNumber + 1;

      if (calculateWinner(squares) || squares[i]) {
        return;
      }
   
      squares[i] = this.state.xIsNext ? "X" : "O";
    
      this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      squareNumber: num
      });
    }
    else {
      const currentSquare = this.state.xIsNext ? "X" : "O";
      if (squares[i] === currentSquare) {
        this.setState({
          doMove: true,
          deleteSquare: i
        });
      }
      else {
        this.setState({
          doMove: false
        });
      }
    }
  }

  moveSquare(oldSquare, newSquare) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(validMove(squares, oldSquare, newSquare)) {
      const currentSquare = this.state.xIsNext ? "X" : "O";

    if (squares[4] === currentSquare) {
      const squaresCopy = current.squares.slice();
      if (squaresCopy[newSquare] ==  null) {
        squaresCopy[oldSquare] = null;
        squaresCopy[newSquare] = currentSquare;
        if (calculateWinner(squaresCopy)) {
          this.setState({
            history: history.concat([
              {
                squares: squaresCopy
              }
            ]),
            stepNumber: history.length
          });
          return;
        }
        else {
          if (oldSquare !== 4) {
            this.setState({
              doMove: false
            });
            return;
          }
        }
      }
    }

    if (calculateWinner(squares) || squares[newSquare]) {
      this.setState({
         doMove: false
      });
      return;
    }
      
    squares[oldSquare] = null;
    squares[newSquare] = this.state.xIsNext ? "X" : "O";
    
    this.setState({
    history: history.concat([
      {
        squares: squares
      }
     ]),
       stepNumber: history.length,
       xIsNext: !this.state.xIsNext,
       doMove: false
     });
    }
    else {
      this.setState({
        doMove: false
      });
      return;
    }
  }


  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      squareNumber: step
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
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (this.state.doMove) {
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.moveSquare(this.state.deleteSquare, i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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

function validMove(squares, oldMove, newMove) {
  const lines = [
    [0, 1, 3, 4],
    [1, 0, 2, 3, 4, 5],
    [2, 1, 4, 5],
    [3, 0, 6, 1, 4, 7],
    [4, 0, 1, 2, 3, 5, 6, 7, 8],
    [5, 2, 8, 1, 4, 7],
    [6, 3, 4, 7],
    [7, 6, 8, 3, 4, 5],
    [8, 4, 7, 5]
  ];
  for (let i = 0; i < lines.length; i++) {
    const currLine = lines[i];

    if (currLine[0] === oldMove) {
      const currlength = currLine.length;
      for (let j = 1; j < currlength; j++) {
        if (newMove === currLine[j])
          return true;
      }
    }
  }
  return false;
}