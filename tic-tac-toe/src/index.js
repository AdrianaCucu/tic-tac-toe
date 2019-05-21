/**
 * Built by following the tutorial at:
 * https://reactjs.org/tutorial/tutorial.html
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Components accept props and return React elements describing what should appear on the screen.
 * 
 * Passing props from parents to children is how information flows in React apps.
 * 
 * To "remember" things (like being clicked), components use state.
 * React components can have state by setting this.state (private) in the constructor.
 * 
 * prop = arbitrary input
 */

/**
 * Square components are function components.
 * 
 * Function components:
 * -> only contain a render() method
 * -> don't have their own state
 */
function Square(props) {

    /**
     * When a square is clicked, the onClick function in Board is called.
     * -> onClick tells React to set up a click event listener
     * -> when the button is clicked, the onClick event handler is called
     * -> this event handler calls props.onClick (the onClick prop was specified by the Board)
     */
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/**
 * The state is stored in the Board component (not in the individual Square components).
 */
class Board extends React.Component {

    /**
     * Constructor for an empty tic-tac-toe board.
     * When the Board's state changes, the Square components re-render automatically.
     * 
     * @param {*} props - arbitrary (passed by the parent)
     */
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),

            /**
             * 'X' starts first by default.
             */
            xIsNext: true
        };
    }

    /**
     * Updates the state of the Board when a square is clicked.
     * 
     * @param {*} i - the square that is updated
     */
    handleClick(i) {

        /**
         * Uses a copy of the squares array rather than modifying the existing array.
         * 
         * Immutability = replace the data with a new copy with the desired changes
         * Benefits of immutability:
         * -> complex features are easier to implement (e.g. ability to undo and redo previous moves)
         * -> keeping previous versions of the game's history intact (can reuse them later)
         * -> easier to detect changes in immutable objects
         * -> easy to determine when a component requires re-rendering (when changes are made)
         * -> helps you build pure components
         */
        const squares = this.state.squares.slice();

        /**
         * If the game is finished or if the square is not empty, the click is ignored.
         */
        if (getWinner(squares) || squares[i])
            return;

        /**
         * Ternary statement:
         * If xIsNext is true, set 'X', else set 'O'.
         */
        squares[i] = this.state.xIsNext ? 'X' : 'O';
      
        this.setState({
            squares: squares,

            /**
             * At each turn, the player is changed ('X' or 'O').
             */
            xIsNext: !this.state.xIsNext
        });
    }

    /**
     * The Board component tells each Square what to display.
     * 
     * @param {*} i - prop
     */
    renderSquare(i) {

        /**
         * Passes a prop from the squares array to a child Square component.
         */
        return (
            <Square 
                value={this.state.squares[i]} 

                /**
                 * Passes down a function from Board to Square.
                 * Square calls this function when a square is clicked.
                 */
                onClick={() => this.handleClick(i)} 
            />
        );
    }

    render() {

        const winner = getWinner(this.state.squares);
        const status = winner ? ("Winner: " + winner) 
            : ('Next player: ' + (this.state.xIsNext ? 'X' : 'O'));

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ===========================================================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

/**
 * Used to check whether one of the players has won.
 * 
 * @param {*} squares - the squares of the board 
 */
function getWinner(squares) {

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

    /**
     * If a player has won, the function returns their symbol ('X' or 'O').
     */
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[a];
    }

    /**
     * If the game has not been won, returns null.
     */
    return null;
}