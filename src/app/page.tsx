"use client";
import { useState } from "react";

function Square({ value, onSquareClick, highlight }: any) {
  return (
    <button
      className={`square ${highlight ? "bg-green-500" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }: any) {
  function handleClick(i: any) {
    if (calculateWinner(squares)?.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function isWinningSquare(index: any) {
    return winningLine && winningLine.includes(index);
  }

  return (
    <div className="pl-10 pt-10 flex flex-col">
      <div className="flex justify-center text-3xl font-bold mb-3">
        {status}
      </div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          highlight={isWinningSquare(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          highlight={isWinningSquare(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          highlight={isWinningSquare(2)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          highlight={isWinningSquare(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          highlight={isWinningSquare(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          highlight={isWinningSquare(5)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          highlight={isWinningSquare(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          highlight={isWinningSquare(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          highlight={isWinningSquare(8)}
        />
      </div>
    </div>
  );
}

function HistoryModal({ moves, onClose }: any) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: any) {
    setCurrentMove(nextMove);
    setIsModalOpen(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          className="border-2 p-2 m-2 text-xl font-semibold rounded-lg"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="history-button" onClick={() => setIsModalOpen(true)}>
          Show History
        </button>
      </div>
      {isModalOpen && (
        <HistoryModal moves={moves} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function calculateWinner(squares: any) {
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
