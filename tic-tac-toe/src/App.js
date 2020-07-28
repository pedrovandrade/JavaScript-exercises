import React, { useState, useEffect } from "react";
//import logo from "./logo.svg";
import "./App.css";

/********************************* TIC-TAC-TOE *********************************
 ** This program is a test for a tic-tac-toe game made with React.            **
 ** Author: Pedro Vinicius Pereira de Andrade                                 **
 **                                                                           **
 ** pedrovandrade@gmail.com                                                   **
 ** https://github.com/pedrovandrade                                          **
 **                                                                           **
 ******************************************************************************/

/**
 * Game button component, responsible for setting the "X" or "O" marks on the
 * game table.
 */
function MarkButton(props) {
  // Mark type ("cross" or "circle") for styling
  //const [markType, setMarkType] = useState("cross");

  function writeMark() {
    if (props.mark || props.gameOver) return;

    props.onClick(props.location);
  }

  return (
    <button
      className="mark-field"
      id={props.buttonId}
      onClick={writeMark}
      style={props.buttonStyle}
    >
      <span className={props.markType} style={props.markStyle}>
        {props.mark}
      </span>
    </button>
  );
}

/**
 * Button array component, responsible for generating the 9 buttons of the
 * button array composing the game table.
 */
function MarkFields(props) {
  function changeMark(index) {
    if (props.gameOver) return;

    let markedObj = props.markedSquares;
    markedObj[props.turn].push(index);
    props.setMarkedSquares(markedObj);

    props.setMark(props.markArray.map((x, i) => (i === index ? "X" : x)));
    props.setMarkType(
      props.markType.map((x, i) => (i === index ? "cross" : x))
    );

    props.setMarkStyle(
      props.markStyle.map((x, i) => (i === index ? { opacity: 1 } : x))
    );

    props.onClick();
  }

  const buttonsArray = Array(9)
    .fill(0)
    .map((val, index) => {
      const buttonId = `field-${index}`;
      return (
        <MarkButton
          buttonId={buttonId}
          key={index}
          location={index}
          mark={props.markArray[index]}
          onClick={changeMark}
          gameOver={props.gameOver}
          markStyle={props.markStyle[index]}
          buttonStyle={props.buttonStyle[index]}
          markType={props.markType[index]}
        />
      );
    });

  return <>{buttonsArray}</>;
}

/**
 * The button component to reset the game to its initial conditions.
 */
function ResetButton(props) {
  function callReset() {
    props.onClick();
  }

  return (
    <button id="reset-button" onClick={callReset}>
      Reset
    </button>
  );
}

/**
 * Main component, integrating all the remaining components and including the
 * global system's state hooks.
 */
function TicTacToe() {
  // System's state hooks
  const [turn, setTurn] = useState("player");
  const [gameOver, setGameOver] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [mark, setMark] = useState(Array(9).fill(""));
  const [markStyle, setMarkStyle] = useState(Array(9).fill({ opacity: 0 }));
  const [markType, setMarkType] = useState(Array(9).fill(""));
  const [markedSquares, setMarkedSquares] = useState({
    player: [],
    machine: []
  });
  const [buttonStyle, setButtonStyle] = useState(
    Array(9).fill({ backgroundColor: "" })
  );

  /**
   * Winning sequences
   *
   * Square positions:
   *  _0_|_1_|_2_
   *  _3_|_4_|_5_
   *   6 | 7 | 8
   */
  const winningSeqs = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = () => {
    const players = ["player", "machine"];
    let total_marks = 0;

    function winnerSeq(current) {
      for (let seq of winningSeqs) {
        if (seq.every(val => markedSquares[current].includes(val))) {
          return seq;
        }
      }
      return false;
    }

    for (let target of players) {
      let victoriousSequence = winnerSeq(target);
      if (victoriousSequence) {
        highlightWinning(victoriousSequence);
        setGameOver(true);
        setEndMessage(`${target} win!`);
        return;
      }
      total_marks += markedSquares[target].length;
    }

    // Check if there is a draw
    if (total_marks === 9) {
      setGameOver(true);
      setEndMessage("Draw game!");
    }
  };

  function highlightWinning(buttons) {
    setButtonStyle(
      buttonStyle.map((x, i) =>
        buttons.includes(i) ? { backgroundColor: "#FCD4DC" } : x
      )
    );
  }

  function getRandomIndex() {
    let availableIndices = [];
    for (let i = 0; i < mark.length; ++i) {
      if (mark[i] === "") availableIndices.push(i);
    }
    console.log(`availableIndices: ${availableIndices}`);

    return availableIndices[
      Math.floor(Math.random() * availableIndices.length)
    ];
  }

  function getWinnerIndex() {
    let availableIndices = [];
    for (let i = 0; i < mark.length; ++i) {
      if (mark[i] === "") availableIndices.push(i);
    }

    // First, do the first move either on the middle square or the upper left
    // one if the middle one is not available
    const machineSquares = markedSquares["machine"];
    if (machineSquares.length === 0)
      return availableIndices.includes(4) ? 4 : 0;

    // Second, check if there is a winner square
    for (let seq of winningSeqs) {
      const noMarks = seq.filter(x => availableIndices.includes(x));
      const machineMarks = seq.filter(x => machineSquares.includes(x));
      if (noMarks.length === 1 && machineMarks.length === 2) return noMarks[0];
    }

    // Third, check if the player has a winner square (in which case the
    // machine should block it)
    const playerSquares = markedSquares["player"];
    for (let seq of winningSeqs) {
      const noMarks = seq.filter(x => availableIndices.includes(x));
      const playerMarks = seq.filter(x => playerSquares.includes(x));
      if (noMarks.length === 1 && playerMarks.length === 2) return noMarks[0];
    }

    // Finally, if none of the situations above applies, chose one available
    // corner of the game table or chose a random available square
    return availableIndices.includes(0) && availableIndices.includes(8)
      ? 0
      : availableIndices.includes(2) && availableIndices.includes(6)
      ? 2
      : availableIndices[Math.floor(Math.random() * availableIndices.length)];
  }

  function playMachine(index) {
    if (gameOver || turn === "player") return;

    let markedObj = markedSquares;
    markedObj["machine"].push(index);
    setMarkedSquares(markedObj);

    setMark(mark.map((x, i) => (i === index ? "O" : x)));

    setMarkStyle(markStyle.map((x, i) => (i === index ? { opacity: 1 } : x)));

    setMarkType(markType.map((x, i) => (i === index ? "circle" : x)));

    checkWinner();
    changeTurn(turn);
  }

  function changeTurn(currentTurn) {
    if (gameOver) return;
    else if (currentTurn === "player") setTurn("machine");
    else if (currentTurn === "machine") setTurn("player");
  }

  function reset() {
    // Reset the game to the initial configuration
    setTurn("player");
    setGameOver(false);
    setMark(Array(9).fill(""));
    setMarkedSquares({ player: [], machine: [] });
    setEndMessage("");
    setMarkStyle(Array(9).fill({ opacity: 0 }));
    setButtonStyle(Array(9).fill({ backgroundColor: "" }));
  }

  useEffect(() => {
    if (gameOver || turn === "player") return;
    const a = setTimeout(() => playMachine(getWinnerIndex()), 500);
    return () => clearTimeout(a);
  }, [gameOver, getWinnerIndex, playMachine, turn]);

  return (
    <div id="App-game">
      <MarkFields
        turn={turn}
        onClick={() => {
          checkWinner();
          changeTurn(turn);
        }}
        gameOver={gameOver}
        markArray={mark}
        setMark={setMark}
        markStyle={markStyle}
        setMarkStyle={setMarkStyle}
        buttonStyle={buttonStyle}
        setButtonStyle={setButtonStyle}
        markedSquares={markedSquares}
        setMarkedSquares={setMarkedSquares}
        markType={markType}
        setMarkType={setMarkType}
      />
      <div>
        <div id="winner">{endMessage}</div>
        <ResetButton onClick={reset} />
      </div>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
    <div id="App-container">
      <header id="App-title">Tic-Tac-Toe</header>
      <TicTacToe />
    </div>
  );
}

export default App;
