/**
 * Based on the tutorial at:
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

class Board extends React.Component {

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
                value={this.props.squares[i]}

                /**
                 * Passes down a function from Board to Square.
                 * Square calls this function when a square is clicked.
                 */
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

/**
 * The state of the game is stored here (not in the board or the squares).
 */
class Game extends React.Component {

    /**
     * Constructor for an empty tic-tac-toe board.
     * When the Game's state changes, the Square components re-render automatically.
     * 
     * @param {*} props
     */
    constructor(props) {

        super(props);
        this.state = {

            /**
             * SToring the history of the game enables us to access past moves.
             */
            history: [{
                squares: Array(9).fill(null)
            }],

            /**
             * The step we are currently viewing.
             */
            stepNumber: 0,

            /**
             * 'X' starts first by default.
             */
            xIsNext: true
        };
    }

    /**
     * Updates the state of the game when a square is clicked.
     * 
     * @param {*} i - the square that is updated
     */
    handleClick(i) {

        /**
         * When going back to a previous state, this ensures that all states after the selected one are discarded.
         */
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

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
        const squares = current.squares.slice();

        /**
         * If the game is finished or if the square is not empty, the click is ignored.
         */
        if (getWinner(squares) || squares[i])
            return;

        /**
         * Ternary statement:
         * If xIsNext is true, set 'X', else set 'O'.
         */
        squares[i] = this.state.xIsNext ? '╳' : '◯';

        this.setState({
            history: history.concat([{
                squares: squares
            }]),

            /**
             * Updates the step number both for normal moves and when going back to a previous state.
             */
            stepNumber: history.length,

            /**
             * At each turn, the player is changed ('X' or 'O').
             */
            xIsNext: !this.state.xIsNext
        });
    }

    /**
     * Used to go back to previous game states.
     * 
     * @param {*} step - the previous game state
     */
    jumpTo(step) {

        /**
         * If the game is restarted, "deletes" the history.
         */
        if (step === 0)
            this.setState({
                history: [{
                    squares: Array(9).fill(null)
                }]
            });

        this.setState({
            stepNumber: step,

            /**
             * The 'X' player has the even steps, the 'O' player has the odd steps.
             */
            xIsNext: (step % 2) === 0
        });
    }

    render() {

        const history = this.state.history;

        /**
         * The current state of the game based on the stepNumber.
         */
        const current = history[this.state.stepNumber];

        /**
         * If one of the players has one, winner is either 'X' or 'O'.
         * Otherwise, winner is null.
         */
        const winner = getWinner(current.squares);

        /**
         * The buttons for the previous game states.
         */
        const moves = history.map((step, move) => {

            const desc = move ?
                'Go to move #' + move :
                'Restart';

            /**
             * For each move in the game's history, a list item that contains a button is created.
             */
            return (

                /**
                 * Keys tell React about the identity of each component.
                 * This allows React to maintain state between re-renders.
                 * 
                 * It's strongly recommended that proper keys are assigned when building dynamic lists.
                 */
                <li key={move}>
                    <button id={`history-${move}`} className="move" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        /**
         * Useful message based on the state of the game.
         */
        let status = 'Next player: ' + (this.state.xIsNext ? '╳' : '◯');
        let emoticon = '◔̯◔';
        if (winner) {
            status = winner + ' wins. Yay!!!';
            emoticon = '◔⚬◔';
        } else if (isFull(current.squares)) {
            status = 'It\'s a tie! Try again?';
            emoticon = '٩◔̯◔۶';
        }

        return (

            /**
             * Like a div, but is not rendered in the DOM.
             * Useful to use as a root tag for a Component whithin the virtual DOM.
             */
            <React.Fragment>
                <div className="game">
                    <div className="game-board">

                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />

                    </div>
                    <div className="game-info">
                        <div>{moves}</div>
                    </div>
                    <div className="game-status">
                        <div id="status">{status}</div>
                        <div id="emoticon">{emoticon}</div>
                    </div>
                </div>
                <footer>
                    Made with <span id="heart">❤</span> by A.C. ⠀· ⠀<a href="https://github.com/AdrianaCucu" target="_blank">GitHub</a>
                </footer>
            </React.Fragment>
        );
    }
}

/**
 * Used to check whether one of the players has won.
 * 
 * @param {*} squares - the squares of the board 
 */
function getWinner(squares) {

    /**
     * All the possible lines for winning the game.
     */
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

/**
 * Used to check whether the board is full.
 * 
 * @param {*} squares - the squares of the board
 */
function isFull(squares) {
    for (let i = 0; i < squares.length; i++)
        if (squares[i] === null)
            return false;
    return true;
}

// ===========================================================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
