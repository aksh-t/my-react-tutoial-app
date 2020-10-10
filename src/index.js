import React from 'react';
import ReactDOM from "react-dom";
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
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquareRow(i) {
        return [0, 1, 2].map(
            j => {
                return (
                    this.renderSquare(i * 3 + j)
                );
            }
        );
    }

    renderSquareRows() {
        return [0, 1, 2].map(
            i => {
                return (
                    <div className="board-row" key={i}>
                        {this.renderSquare(i * 3 + 0)}
                        {this.renderSquare(i * 3 + 1)}
                        {this.renderSquare(i * 3 + 2)}
                    </div>
                );
            }
        );
    }

    render() {
        return (
            <div>
                {this.renderSquareRows()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            orderIsAsc: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    handleChange(o) {
        this.setState({
            orderIsAsc: o === "asc" ? true : false,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // 0手目をもっとスッキリ扱いたい
            const clickedIndex = move ?
                step.squares.findIndex((s, i) => s !== history[move - 1].squares[i]) :
                null;
            const clickedPositon = clickedIndex !== null ? convertIndexToPostion(clickedIndex) : null;

            const desc = move ?
                <span style={{ fontWeight: move === this.state.stepNumber ? 800 : "" }}>
                    {'Go to move #' + move + ` (${clickedPositon?.col}, ${clickedPositon?.row})`}
                </span> :
                <span>{'Go to game start'}</span>;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = `Next player: ` + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <input type="radio" name="sort" id="asc" value="asc"
                            checked={this.state.orderIsAsc}
                            onChange={() => this.handleChange("asc")}></input>
                        <label htmlFor="asc">asc</label>
                        <input type="radio" name="sort" id="desc" value="desc"
                            checked={!this.state.orderIsAsc}
                            onChange={() => this.handleChange("desc")}></input>
                        <label htmlFor="desc">desc</label>
                    </div>
                    <div>{this.state.orderIsAsc ? moves : moves.reverse()}</div>
                </div>
            </div>
        );
    }
}

// ===================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return squares[a];
        }
    }
    return null;
}

function convertIndexToPostion(index) {
    // 剰余で算出したほうがメンテしやすそう
    const map = {
        0: { col: 0, row: 0 },
        1: { col: 1, row: 0 },
        2: { col: 2, row: 0 },
        3: { col: 0, row: 1 },
        4: { col: 1, row: 1 },
        5: { col: 2, row: 1 },
        6: { col: 0, row: 2 },
        7: { col: 1, row: 2 },
        8: { col: 2, row: 2 },
    };
    return map[index];
}