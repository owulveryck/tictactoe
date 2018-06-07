/* eslint-disable */
/*
   netttt - evolving neural networks to play tic tac toe
            <https://chazomaticus.github.io/netttt/>
   Copyright 2013 Charles Lindsay

   netttt is free software: you can redistribute it and/or modify it under the
   terms of the GNU General Public License as published by the Free Software
   Foundation, either version 3 of the License, or (at your option) any later
   version.

   netttt is distributed in the hope that it will be useful, but WITHOUT ANY
   WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
   FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
   details.

   You should have received a copy of the GNU General Public License along with
   netttt.  If not, see <http://www.gnu.org/licenses/>.
*/


const Ttt = (function (Ttt) {
    // Can't use strict mode because I'm using octal literals.  Great.
    //"use strict";

    var X = 1;
    var O = 3;
    var TIE = -1;

    // Boards are simply integers.  The first two bits encode the piece at
    // square 0 (top left), the next two bits are square 1, etc.  Squares are
    // 0-8 left to right, top to bottom.  If a square's bits are both 0, that
    // square is empty.  If the less significant bit is set, it's occupied.
    // The occupying player is determined by the more significant bit: X if not
    // set or O if set.
    function newBoard() {
        return 0;
    }

    function isEmpty(board) {
        return (board === 0);
    }

    function getPiece(board, square) {
        return ((board >> (square << 1)) & 3);
    }

    function toArray(board) {
        var a = [];
        for (var i = 0; i < 9; ++i, board >>= 2) {
            a[i] = (board & 3);
        }
        return a;
    }

    function toString(board) {
        var s = '';
        for (var i = 0; i < 9; ++i, board >>= 2) {
            if (i > 0 && !(i % 3)) {
                s += '/';
            }
            s += ((board & 3) === 0 ? '-' : ((board & 3) === X ? 'X' : 'O'));
        }
        return s;
    }

    function emptySquares(board) {
        var empty = [];
        for (var i = 0; i < 9; ++i, board >>= 2) {
            if ((board & 3) === 0) {
                empty.push(i);
            }
        }
        return empty;
    }

    function move(board, square, piece) {
        return (board | (piece << (square << 1)));
    }

    function winner(board, extra) {
        // extra gets its line property set if a player has won.  It's used to
        // draw an appropriate line indicating the win.
        extra = extra || {};

        if ((board & 0o0000077) === 0o0000025) { extra.line = 0; return X; }
        if ((board & 0o0000077) === 0o0000077) { extra.line = 0; return O; }
        if ((board & 0o0007700) === 0o0002500) { extra.line = 1; return X; }
        if ((board & 0o0007700) === 0o0007700) { extra.line = 1; return O; }
        if ((board & 0o0770000) === 0o0250000) { extra.line = 2; return X; }
        if ((board & 0o0770000) === 0o0770000) { extra.line = 2; return O; }
        if ((board & 0o0030303) === 0o0010101) { extra.line = 3; return X; }
        if ((board & 0o0030303) === 0o0030303) { extra.line = 3; return O; }
        if ((board & 0o0141414) === 0o0040404) { extra.line = 4; return X; }
        if ((board & 0o0141414) === 0o0141414) { extra.line = 4; return O; }
        if ((board & 0o0606060) === 0o0202020) { extra.line = 5; return X; }
        if ((board & 0o0606060) === 0o0606060) { extra.line = 5; return O; }
        if ((board & 0o0601403) === 0o0200401) { extra.line = 6; return X; }
        if ((board & 0o0601403) === 0o0601403) { extra.line = 6; return O; }
        if ((board & 0o0031460) === 0o0010420) { extra.line = 7; return X; }
        if ((board & 0o0031460) === 0o0031460) { extra.line = 7; return O; }
        if ((board & 0o0252525) === 0o0252525) return TIE;
        return 0;
    }

    // A convenient wrapper around a board and whose turn it is.  Also holds
    // the game's state going back through time.  Ignoring the history, the
    // current board state will tell you whose turn it is assuming the game has
    // been played according to the rules, but this gives us some convenience
    // and lets us bend the rules if we want to.
    function Game(board, turn, history) {
        board = (typeof board === 'undefined' ? newBoard() : board);
        turn = turn || (emptySquares(board).length % 2 === 0 ? O : X);
        history = history || [];

        this.board = board;
        this.turn = turn;
        this.history = history;
    }

    Game.prototype.clone = function Game_clone() {
        return new Game(
            this.board, this.turn, this.history.map(function (h) { return h; })
        );
    };

    Game.prototype.equals = function Game_equals(other) {
        // Ignore history.
        return (this.board === other.board && this.turn === other.turn);
    };

    Game.prototype.getPiece = function Game_getPiece(square) {
        return getPiece(this.board, square);
    };

    Game.prototype.toString = function Game_toString() {
        return "" + (this.turn === X ? "X" : "O") + "@" + toString(this.board);
    };

    Game.prototype.emptySquares = function Game_emptySquares() {
        return emptySquares(this.board);
    };

    Game.prototype.move = function Game_move(square) {
        this.history.push(this.board);
        this.board = move(this.board, square, this.turn);
        this.turn ^= 2;
    };

    Game.prototype.undo = function Game_undo() {
        this.board = this.history.pop();
        this.turn ^= 2;
    };

    Game.prototype.winner = function Game_winner() {
        return winner(this.board);
    };

    // A simple, synchronous driver for playing games.  Useful mostly for
    // testing purposes.
    function play(x, o) {
        var players = {};
        players[X] = x;
        players[O] = o;

        var game = new Game();
        var winner;
        do {
            var move = players[game.turn].getMove(game);
            if (move < 0 || move >= 9 || game.getPiece(move) !== 0) {
                throw new Error("AI chose invalid move " + move.toString()
                    + " in " + game.toString()
                );
            }

            game.move(move);
        } while (!(winner = game.winner()));

        return winner;
    }

    Ttt.X = X;
    Ttt.O = O;
    Ttt.TIE = TIE;
    Ttt.newBoard = newBoard;
    Ttt.isEmpty = isEmpty;
    Ttt.getPiece = getPiece;
    Ttt.toArray = toArray;
    Ttt.toString = toString;
    Ttt.emptySquares = emptySquares;
    Ttt.move = move;
    Ttt.winner = winner;
    Ttt.Game = Game;
    Ttt.play = play;

    return Ttt;
}(Ttt || {}));

export default Ttt;
