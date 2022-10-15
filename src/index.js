/*
 * @Author: EnhaoSun enhao.sun@outlook.com
 * @Date: 2022-09-11 04:58:04
 * @LastEditors: EnhaoSun enhao.sun@outlook.com
 * @LastEditTime: 2022-10-13 12:04:33
 * @FilePath: /tic-tac-toe/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  // 每当有人获胜时，高亮显示连成一线的 3 颗棋子
  const valueView = props.value == null ? null : props.isWin ? (<span className='winSquare'>{props.value}</span>) : (<span>{props.value}</span>)
  return (
    <button className='square' onClick={props.onClick}>
      {valueView}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        isWin={this.props.winSquares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {

    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: -1,
        // 每当有人获胜时，高亮显示连成一线的 3 颗棋子
        winSquares: Array(9).fill(false),
      }],
      isAsc: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    console.log("Click on #" + i)
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winSquares = current.winSquares.splice();
    this.setState({
      history: history.concat([{
        squares: squares,
        winSquares: winSquares,
        index: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)
      const desc = move ?
        `Go to move #${move}:(${Math.floor(step.index / 3) + 1},${step.index % 3 + 1})` :
        'Go to game start';
      return (
        <li key={move}>
          {/* 在历史记录列表中加粗显示当前选择的项目 */}
          <button className={this.state.stepNumber === move ? "bold" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })


    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
      // 每当有人获胜时，高亮显示连成一线的 3 颗棋子
      current.winSquares[winner.squares[0]] = true;
      current.winSquares[winner.squares[1]] = true;
      current.winSquares[winner.squares[2]] = true;
    } else if (!current.squares.includes(null)) {
      // 当无人获胜时，显示一个平局的消息
      status = 'No one win!'
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O')
    }


    return (
      <div className='container'>
        <div className='game-status'>
          <h2>{status}</h2>
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              // 每当有人获胜时，高亮显示连成一线的 3 颗棋子
              winSquares={current.winSquares}
            />
          </div>
          <div className="game-info">
            <div className='group-button'>
              <button className='asc' onClick={() => { this.setState({ isAsc: true }) }}>升序</button>
              <button className='dsc' onClick={() => { this.setState({ isAsc: false }) }}>降序</button>
            </div>
            <ol>{!this.state.isAsc ? moves.reverse() : moves}</ol>
          </div>
          {/* 添加一个可以升序或降序显示历史记录的按钮 */}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        winner: squares[a],
        squares: lines[i]
      })
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
