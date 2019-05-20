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
 * React components can have state by setting this.state in the constructor.
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
        squares[i] = 'X';
        this.setState({squares: squares});
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
        const status = 'Next player: X';

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
