/**
 * Copyright (c) Pedro Vinicius Pereira de Andrade
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *******************************************************************************
 * Minesweeper game made with create-reat-app. The game contains 3 standard
 * difficulty levels (easy, medium and hard) and the option to customize your
 * mine field.
 *
 * Bugs, comments or suggestions: pedrovandrade@gmail.com
 */

import React from "react";
import "./App.css";

/** A single clickable button on the mine field. */
class FieldButton extends React.Component {
  /**
   * Initialize a button to its default parameters.
   * @param {object} props - Object containing the input properties:
   * @param {string} props.gameStatus - The GameContainer's "gameStatus" state.
   * @param {number} props.fieldNumber - The button's numerical value, either
   *  being the number of surrounding mines or -1 if it's a mine.
   * @param {string} props.level - The GameContainer's "level" state.
   * @param {number} props.rows - The GameContainer's "rows" state.
   * @param {number} props.columns - The GameContainer's "columns" state.
   * @param {number} props.mines - The GameContainer's "mines" state.
   * @param {function} props.setMineProfile - The Minefield's "setMineProfile"
   *  method.
   * @param {function} props.setProfile - The GameContainer's "setState" method.
   * @param {function} props.setZeroExpandables - The Minefield's
   *  "setZeroExpandables" method.
   * @param {boolean} props.isZeroExpandable - The button's property telling if
   *  it should be automatically revealed. It's true in case the button is
   *  surrounded by a revealed button with the value of 0.
   * @param {array} props.location - A two-element number array indicating the
   *  button's coordinates (row and column) on the minefield matrix.
   * @param {array} props.firstClickedLocation - The GameContainer's
   *  "firstClickedLocation" state.
   * @param {number} props.squaresToReveal - The GameContainer's
   *  "squaresToReveal" state.
   * @param {number} props.revealedSquares - The GameContainer's
   *  "revealedSquares" state.
   */
  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {JSX object} buttonContent - The inner HTML content of the
     *  button, such as a styled number or mine icon image.
     * @property {string} buttonColor - The button's background color.
     * @property {string} contentDisplay - The buttonContent element's
     *  style.display property value (either an empty string for it to be shown
     *  or the "none" string for it to be hidden).
     * @property {boolean} isClicked - The button property defining if it was
     *  already left-clicked (in case which it's not anymore clickable).
     * @property {boolean} hasFlag - The button property defining if it contains
     *  a flag image element, in which case it's not anymore clickable.
     */
    this.state = {
      buttonContent: <></>,
      buttonColor: "",
      contentDisplay: "none",
      isClicked: false,
      hasFlag: false
    };

    // Mapping of the button number value and its styling color.
    this.colorCode = {
      "1": "blue",
      "2": "green",
      "3": "red",
      "4": "purple",
      "5": "maroon",
      "6": "turquoise",
      "7": "black",
      "8": "gray"
    };
  }

  /**
   * In case the button is still clickable, set the GameContainer's
   * "mouseIsDown" state to true (changing the games's reset button face to
   * worried).
   * @param {object} event - The mousedown event object (for preventDefault).
   */
  createExpectation = event => {
    event.preventDefault();
    if (
      this.state.isClicked ||
      this.state.hasFlag ||
      ["won", "lost"].includes(this.props.gameStatus)
    )
      return;

    this.props.setProfile({ mouseIsDown: true });
  };

  /**
   * Handle the mouseup event, whether being left- or right-sided.
   * @param {object} event - The mouseup event object (for event.button).
   */
  handleMouseUp = event => {
    if (event.button === 0) this.revealSquare();
    else if (event.button === 2) this.putFlag();
  };

  /**
   * In case the button is clickable, put a flag image on it and makes it
   * non-clickable. In case it has already a flag, remove this flag and make it
   * clickable again.
   */
  putFlag = () => {
    if (this.state.isClicked || ["won", "lost"].includes(this.props.gameStatus))
      return;

    this.props.setProfile({ mouseIsDown: false });

    if (this.props.gameStatus !== "in progress") {
      this.props.setMineProfile(this.props.location);
      this.props.setProfile({
        gameStatus: "in progress",
        firstClickedLocation: this.props.location
      });
    }

    if (!this.state.hasFlag) {
      this.props.setProfile((state, props) => ({
        flags: state.flags - 1
      }));
      this.setState({
        contentDisplay: "",
        hasFlag: true,
        buttonContent: (
          <img
            src="images/flag-mini-2.svg"
            alt="placed-flag"
            style={{ display: this.state.contentDisplay }}
          />
        )
      });
    } else if (this.state.hasFlag) {
      this.props.setProfile((state, props) => ({
        flags: state.flags + 1
      }));
      this.setState({
        hasFlag: false,
        buttonContent: <></>
      });
    }
  };

  /**
   * Get the numeric value of a clickable button and handle it accordingly. If
   * the value lies between 1 and 8, reveal it and make the button
   * non-clickable. If the value is 0, reveal an emptied square, call the
   * setZeroExpandables() to reveal all the buttons around it and makes the
   * button non-clickable. If the value is -1 (mine button), reveal all the
   * mines on the field and set the game status as "lost".
   */
  revealSquare = () => {
    if (
      this.state.isClicked ||
      this.state.hasFlag ||
      ["won", "lost"].includes(this.props.gameStatus)
    )
      return;

    this.props.setProfile({ mouseIsDown: false });
    this.setState({ contentDisplay: "", isClicked: true });

    if (this.props.gameStatus !== "in progress") {
      this.setState({
        buttonColor: "#FADEC8"
      });
      this.props.setMineProfile(this.props.location);
      this.props.setProfile({
        gameStatus: "in progress",
        firstClickedLocation: this.props.location
      });
      this.props.setProfile((state, props) => ({
        revealedSquares: state.revealedSquares + 1
      }));
      return;
    }

    if (this.props.fieldNumber === -1) {
      this.setState({
        buttonContent: (
          <img
            src="images/Marine_Mine_mini_2.svg"
            alt="mine"
            style={{ display: this.state.contentDisplay }}
          />
        ),
        buttonColor: "red"
      });
      this.props.setProfile({ gameStatus: "lost" });
    } else if (this.props.fieldNumber === 0) {
      this.props.setProfile((state, props) => ({
        revealedSquares: state.revealedSquares + 1
      }));
      this.setState({
        buttonContent: "",
        buttonColor: "#FADEC8"
      });
      if (!this.props.isZeroExpandable)
        this.props.setZeroExpandables(...this.props.location);
    } else {
      this.props.setProfile((state, props) => ({
        revealedSquares: state.revealedSquares + 1
      }));

      this.setState({
        buttonContent: (
          <span
            style={{
              color: this.colorCode[this.props.fieldNumber],
              fontWeight: "bolder",
              display: this.state.contentDisplay
            }}
          >
            {this.props.fieldNumber}
          </span>
        ),
        buttonColor: "#FADEC8"
      });
    }
  };

  /**
   * Handle the state changes for when the gameStatus turns to "reset" (reseting
   * the button states), "lost" (revealing all the mines and indicating the
   * wrongly placed flags in case there are), "won" (putting a flag over all the
   * mines' squares) and "in progress" (setting the style for all the buttons on
   * the minefield, whether it's a number, an empty square or a mine). Also,
   * handle the state changes when the user clicks on an empty square (to make a
   * square expansion) or when the user reveals all the good squares (in which
   * case the game is won).
   * @param  {object} prevProps - A copy of the props object imediately before
   *  the update.
   * @param  {object} prevState - A copy of the state object imediately before
   * the update.
   */
  componentDidUpdate(prevProps, prevState) {
    // In case the game is reset
    if (prevProps.gameStatus !== "reset" && this.props.gameStatus === "reset") {
      this.setState({
        contentDisplay: "none",
        isClicked: false,
        hasFlag: false,
        buttonContent: <></>,
        buttonColor: ""
      });
    }

    // In case the player clicks on a zero-square, reveal the surroundings
    if (!prevProps.isZeroExpandable && this.props.isZeroExpandable) {
      this.revealSquare();
    }

    // In case the player loses the game, reveal all the mines on the field and
    // indicate the missplaced flags, in case there, are with a red cross over
    // it.
    if (prevProps.gameStatus !== "lost" && this.props.gameStatus === "lost") {
      if (this.props.fieldNumber === -1 && !this.state.hasFlag) {
        this.setState({
          buttonContent: (
            <img
              src="images/Marine_Mine_mini_2.svg"
              alt="mine"
              style={{ display: this.state.contentDisplay }}
            />
          )
        });
      } else if (this.props.fieldNumber !== -1 && this.state.hasFlag) {
        this.setState({
          buttonContent: (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  color: "red",
                  position: "absolute",
                  top: -7,
                  left: 5,
                  fontSize: "33px",
                  backgroundColor: ""
                }}
              >
                X
              </div>
              <img
                src="images/flag-mini-2.svg"
                alt="placed-flag"
                style={{ display: this.state.contentDisplay }}
              />
            </div>
          )
        });
      }
    }

    // In case the player wins the game, put a flag on all mine squares
    if (prevProps.gameStatus !== "won" && this.props.gameStatus === "won") {
      if (this.props.fieldNumber === -1) {
        this.setState({
          buttonContent: (
            <img
              src="images/flag-mini-2.svg"
              alt="placed-flag"
              style={{ display: this.state.contentDisplay }}
            />
          )
        });
      }
    }

    // In case a match has started, set the style all the squares on the field.
    if (
      prevProps.gameStatus !== "in progress" &&
      this.props.gameStatus === "in progress"
    ) {
      if (this.state.hasFlag) {
        this.setState({
          contentDisplay: "",
          buttonContent: (
            <img
              src="images/flag-mini-2.svg"
              alt="placed-flag"
              style={{ display: this.state.contentDisplay }}
            />
          )
        });
      } else if (this.props.fieldNumber === -1)
        this.setState({
          buttonContent: (
            <img
              src="images/Marine_Mine_mini_2.svg"
              alt="mine"
              style={{ display: this.state.contentDisplay }}
            />
          )
        });
      else if (this.props.fieldNumber === 0) {
        this.setState({ buttonContent: "" });

        if (
          JSON.stringify(this.props.location) ===
          JSON.stringify(this.props.firstClickedLocation)
        )
          this.props.setZeroExpandables(...this.props.location);
      } else {
        this.setState({
          buttonContent: (
            <span
              style={{
                color: this.colorCode[this.props.fieldNumber],
                display: this.state.contentDisplay,
                fontWeight: "bold"
              }}
            >
              {this.props.fieldNumber}
            </span>
          )
        });
      }

      this.setState({ contentDisplay: "" });
    }

    // In case all the correct squares are revealed, the game is won
    if (
      prevProps.revealedSquares < this.props.squaresToReveal &&
      this.props.revealedSquares === this.props.squaresToReveal
    ) {
      this.props.setProfile({ gameStatus: "won" });
    }
  }

  render() {
    return (
      <button
        className="field-button"
        onMouseDown={this.createExpectation}
        onContextMenu={event => event.preventDefault()}
        onMouseUp={this.handleMouseUp}
        style={{ backgroundColor: this.state.buttonColor }}
      >
        {this.state.buttonContent}
      </button>
    );
  }
}

/** The array of FieldButton elements representing the minefield. */
class Minefield extends React.Component {
  /**
   * Initialize the minefield with an empty zeroExpandables array (the array of
   * buttons around to be revealed when the player clicks on an empty button).
   * @param {object} props - Object containing the input properties:
   * @param {string} props.gameStatus - The GameContainer's "gameStatus" state.
   * @param {number} props.fieldProfile - The GameContainer's "fieldProfile"
   *  state.
   * @param {string} props.level - The GameContainer's "level" state.
   * @param {number} props.rows - The GameContainer's "rows" state.
   * @param {number} props.columns - The GameContainer's "columns" state.
   * @param {number} props.mines - The GameContainer's "mines" state.
   * @param {function} props.setProfile - The GameContainer's "setState" method.
   * @param {array} props.firstClickedLocation - The GameContainer's
   *  "firstClickedLocation" state.
   * @param {number} props.squaresToReveal - The GameContainer's
   *  "squaresToReveal" state.
   * @param {number} props.revealedSquares - The GameContainer's
   *  "revealedSquares" state.
   */
  constructor(props) {
    super(props);

    this.state = {
      zeroExpandables: []
    };
    this.setState = this.setState.bind(this);
  }

  /**
   * Randomly distribute all the due mines over the minefield, caring to not
   * place a mine on the first clicked location. An optimization is made to
   * pre-fill all the field with the majoritary element, either a mine (-1) or a
   * non-mine (0) square, and distribute the minoritary one to make the random
   * distribution less time-consuming.
   * @param  {number} rows - The number of field rows.
   * @param  {number} columns - The number of field columns.
   * @param  {number} mines - The number of field mines.
   * @param  {array} firstSquare - A two-element number array indicating the
   *  coordinates (row and column) of the first clicked button on the minefield
   *  matrix.
   * @return {array} - The minefield matrix consisting of an array of row arrays
   *  each containing either 0s (non-mine locations) or -1s (mine locations).
   */
  distributeMines = (rows, columns, mines, firstSquare) => {
    let [majority, minority] = mines < (rows * columns) / 2 ? [0, -1] : [-1, 0];

    // The array of arrays to bear the field profile
    let mineFieldArray = Array.from(Array(rows), () =>
      new Array(columns).fill(majority)
    );

    let elementsToDistribute = majority === 0 ? mines : rows * columns - mines;
    let [distributedElements, randomRow, randomColumn] = [0, 0, 0];

    // If the majority of elements is mines, put the first clicked square not as
    // a mine
    if (majority === -1) {
      mineFieldArray[firstSquare[0]][firstSquare[1]] = minority;
      distributedElements = 1;
    }

    while (distributedElements < elementsToDistribute) {
      [randomRow, randomColumn] = [
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * columns)
      ];

      if (
        mineFieldArray[randomRow][randomColumn] === majority &&
        JSON.stringify([randomRow, randomColumn]) !==
          JSON.stringify(firstSquare)
      ) {
        mineFieldArray[randomRow][randomColumn] = minority;
        ++distributedElements;
      }
    }
    return mineFieldArray;
  };

  /**
   * Make the verification of elements of a two-dimensional array (a matrix)
   * index-safe by taking into account the indexes that may be out of boundaries
   * (in which case they should have te value undefined).
   * @param  {array} arr - The two-dimensional array to be checked.
   * @param  {number} index1 - The first index to be checked.
   * @param  {number} index2 - The second index to be checked.
   * @return {*} - The two-dimensional array element value (from index1 and
   *  index2).
   */
  indexSecure = (arr, index1, index2) => {
    if (arr[index1] === undefined || arr[index1][index2] === undefined)
      return 0;

    return arr[index1][index2];
  };

  /**
   * For a given non-mine button on the minefield with distributed mines,
   * calculate how many mines surround the button.
   * @param  {array} arr - The minefield matrix with distributed mines.
   * @param  {number} x - The button's row number.
   * @param  {number} y - The button's column number.
   * @return {number} - The number of mines surrounding the button.
   */
  getSurroundingMines = (arr, x, y) => {
    let sum = 0;
    sum = this.indexSecure(arr, x - 1, y - 1) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x - 1, y) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x - 1, y + 1) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x, y - 1) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x, y + 1) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x + 1, y - 1) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x + 1, y) === -1 ? sum + 1 : sum;
    sum = this.indexSecure(arr, x + 1, y + 1) === -1 ? sum + 1 : sum;
    return sum;
  };

  /**
   * Get the buttons around a zero (empty) button to be expanded when this zero
   * button is clicked.
   * @param  {number} row - The button's row number.
   * @param  {number} col - The button's column number.
   * @return {array} - The array of two-elements row-column arrays containing
   *  the buttons' coordinates around the zero (empty) button.
   */
  getZeroExpandables = (row, col) => {
    let candidates = [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1]
    ];

    candidates = candidates.filter(
      val =>
        this.props.fieldProfile[val[0]] !== undefined &&
        this.props.fieldProfile[val[0]][val[1]] !== undefined
    );

    return candidates;
  };

  /**
   * Set the array of coordinates (the state.zeroExpandables) whose buttons will
   * be expanded (revealed) following a click over a zero (empty) button. if one
   * of the state.zeroExpandables buttons is also a zero button, this button's
   * state.zeroExpandables coordinates will also be computed, with redundancies
   * (already computed zero-expandables) not taken into account.
   * @param {number} x - The button's row number.
   * @param {number} y - The button's column number.
   */
  setZeroExpandables = (x, y) => {
    let expandables = this.getZeroExpandables(x, y);
    let analyzed = Array.from(expandables, val => JSON.stringify(val));
    let newZeros = expandables.filter(
      val => this.props.fieldProfile[val[0]][val[1]] === 0
    );

    while (newZeros.length > 0) {
      expandables = [];
      for (let elem of newZeros) {
        expandables = expandables.concat(
          this.getZeroExpandables(elem[0], elem[1])
        );
      }

      // Eliminate already analyzed squares and the clicked square ([x, y])
      expandables = Array.from(expandables, val => JSON.stringify(val));
      expandables = expandables.filter(
        val => !analyzed.includes(val) && !(val === JSON.stringify([x, y]))
      );

      // Now, eliminate repeated elements
      expandables = Array.from(new Set(expandables));
      analyzed = analyzed.concat(expandables);

      // Finally, check if there are new zero-squares to keep the expansion
      expandables = Array.from(expandables, val => JSON.parse(val));
      newZeros = expandables.filter(
        val => this.props.fieldProfile[val[0]][val[1]] === 0
      );
    }
    // analyzed.sort();

    this.setState({ zeroExpandables: analyzed });
  };

  /**
   * Fill in the fieldProfile array with the numerical values from each button
   * accordingly, being -1 a mine button and a positive integer number the
   * number of mines around that button. This function is called after the
   * player clicks on the first button on the match to assure that the first
   * clicked button is not a mine.
   * @param {array} firstClickedSquare - The two-dimensional coordinates array
   * of the first clicked button on a match.
   */
  setMineProfile = firstClickedSquare => {
    // The array of arrays to bear the field profile
    let fieldArray = this.distributeMines(
      this.props.rows,
      this.props.columns,
      this.props.mines,
      firstClickedSquare
    );

    // Now, distribute the numbers over the field
    for (let x = 0; x < this.props.rows; ++x) {
      for (let y = 0; y < this.props.columns; ++y) {
        if (fieldArray[x][y] === 0) {
          fieldArray[x][y] = this.getSurroundingMines(fieldArray, x, y);
        }
      }
    }

    this.props.setProfile({ fieldProfile: fieldArray });
  };

  /**
   * Handles any field profile change on the game (namely any change on the
   * number of rows, columns or mines, which also causes the game status to
   * change to reset in case it's not) by recalculating the number of field
   * squares to reveal to win and resetting the zeroExpandables array.
   * @param  {object} prevProps - A copy of the props object imediately before
   *  the update.
   */
  componentDidUpdate(prevProps) {
    if (
      (prevProps.gameStatus !== "reset" && this.props.gameStatus === "reset") ||
      prevProps.rows !== this.props.rows ||
      prevProps.columns !== this.props.columns ||
      prevProps.mines !== this.props.mines
    ) {
      this.props.setProfile({
        squaresToReveal: this.props.rows * this.props.columns - this.props.mines
      });
      this.setState({ zeroExpandables: [] });
    }
  }

  render() {
    return (
      <div
        className="minefield"
        style={{ width: `${30 * this.props.columns}px` }}
      >
        {Array(this.props.rows * this.props.columns)
          .fill(0)
          .map((val, i) => {
            const [x, y] = [
              Math.floor(i / this.props.columns),
              i % this.props.columns
            ];

            return (
              <FieldButton
                gameStatus={this.props.gameStatus}
                fieldNumber={this.props.fieldProfile[x][y]}
                level={this.props.level}
                rows={this.props.rows}
                columns={this.props.columns}
                mines={this.props.mines}
                setMineProfile={this.setMineProfile}
                setProfile={this.props.setProfile}
                setZeroExpandables={this.setZeroExpandables}
                isZeroExpandable={
                  this.props.gameStatus !== "reset" &&
                  this.state.zeroExpandables.includes(JSON.stringify([x, y]))
                    ? true
                    : false
                }
                location={[x, y]}
                firstClickedLocation={this.props.firstClickedLocation}
                squaresToReveal={this.props.squaresToReveal}
                revealedSquares={this.props.revealedSquares}
                key={i}
              />
            );
          })}
      </div>
    );
  }
}

/* The level selection dropdown list element on the game header. */
class LevelList extends React.Component {
  /**
   * In case a value is selected on the level dropdown list, reset the game
   * status and set the number of rows, colmuns and mines and the fieldProfile
   * array accordingly for the selected level. The "custom" level, by default,
   * has an initial configuration corresponding to the "easy" one.
   * @param  {object} event - The select event object (event.target.value).
   */
  changeLevel = event => {
    this.props.setLevel({
      level: event.target.value,
      gameStatus: "reset"
    });

    if (event.target.value === "easy" || event.target.value === "custom")
      this.props.setLevel({
        rows: 9,
        columns: 9,
        mines: 10,
        fieldProfile: Array.from(Array(9), () => new Array(9).fill(0))
      });
    else if (event.target.value === "medium")
      this.props.setLevel({
        rows: 16,
        columns: 16,
        mines: 40,
        fieldProfile: Array.from(Array(16), () => new Array(16).fill(0))
      });
    else if (event.target.value === "hard")
      this.props.setLevel({
        rows: 16,
        columns: 30,
        mines: 99,
        fieldProfile: Array.from(Array(16), () => new Array(30).fill(0))
      });
  };

  render() {
    return (
      <select
        className="level-list"
        name="level"
        onChange={this.changeLevel}
        value={this.props.level}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="custom">Custom</option>
      </select>
    );
  }
}

/* The reset button with an interactive face on the game header. */
class FaceButton extends React.Component {
  /**
   * Initialize the reset button with a default happy face.
   * @param {object} props - Object containing the input properties:
   * @param {string} props.gameStatus - The GameContainer's "gameStatus" state.
   * @param {boolean} props.mouseIsDown - The GameContainer's "mouseIsDown"
   *  state.
   * @param {function} props.resetGame - The GameContainer's "setState" method.
   */
  constructor(props) {
    super(props);

    this.state = { imageSrc: "images/happy-face-mini.svg" };
  }

  /**
   * Set the gameStatus to "reset".
   */
  resetGame = () => {
    this.props.resetGame({ gameStatus: "reset" });
  };

  /**
   * Handle the facebutton icon image according to the game status or user
   * action. Initially, the button has the default "happy face" image, whereas
   * it changes to:
   * - a dead face when the game is lost;
   * - a worried face when the game is in progress and the player presses the
   * left-hand mouse button down over one of the minefield buttons;
   * - the happy face again when the player doesn't have the left-hand mouse
   * button down anymore over a minefield button (and the game is still in
   * progress) or when the game status is reset;
   * - a "relaxed face" (face with sunglasses and blue cap) when the player wins
   * the game.
   * @param  {object} prevProps - A copy of the props object imediately before
   *  the update.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.gameStatus !== "lost" && this.props.gameStatus === "lost")
      this.setState({ imageSrc: "images/dead-face-mini.svg" });
    else if (!prevProps.mouseIsDown && this.props.mouseIsDown)
      this.setState({ imageSrc: "images/worried-face-mini.svg" });
    else if (
      (prevProps.mouseIsDown &&
        !this.props.mouseIsDown &&
        this.props.gameStatus === "in progress") ||
      (prevProps.gameStatus !== "reset" && this.props.gameStatus === "reset")
    )
      this.setState({ imageSrc: "images/happy-face-mini.svg" });
    else if (prevProps.gameStatus !== "won" && this.props.gameStatus === "won")
      this.setState({ imageSrc: "images/relaxed-face-mini-2.svg" });
  }

  render() {
    return (
      <button id="face-button" onClick={this.resetGame}>
        <img src={this.state.imageSrc} alt="Happy face" />
      </button>
    );
  }
}

/* The flag enumerator icon on the game header. */
class FlagEnumerator extends React.Component {
  render() {
    return (
      <div id="flag-enumerator">
        <img src="images/flag-icon-mini.svg" alt="Flags" />
        <div>{this.props.flags}</div>
      </div>
    );
  }
}

/* The timer icon on the game header. */
class Timer extends React.Component {
  /**
   * Initialize the timer to 0.
   * @param {[type]} props - Object containing the input properties:
   * @param {string} props.gameStatus - The GameContainer's "gameStatus" state.
   */
  constructor(props) {
    super(props);

    this.state = {
      time: 0
    };
  }

  /**
   * Increment the timer state.
   */
  count = () => {
    this.setState((state, props) => ({
      time: state.time + 1
    }));
  };

  /**
   * Handles the game status updates to start the counter in case the gameStatus
   * becomes "in progress", to stop the counter in case the gameStatus is not
   * "in progress" anymore, and reset the counter in case the gameStatus becomes
   * "reset".
   * @param  {object} prevProps - A copy of the props object imediately before
   *  the update.
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.gameStatus !== "in progress" &&
      this.props.gameStatus === "in progress"
    ) {
      this.clock = setInterval(() => this.count(), 1000);
    } else if (
      prevProps.gameStatus === "in progress" &&
      this.props.gameStatus !== "in progress"
    ) {
      clearInterval(this.clock);
    }

    // If the status changed to "reset", reset the counter
    if (prevProps.gameStatus !== "reset" && this.props.gameStatus === "reset") {
      this.setState({ time: 0 });
    }
  }

  render() {
    return (
      <div id="timer">
        <img src="images/hourglass-mini.svg" alt="Time" />
        <div>{this.state.time}</div>
      </div>
    );
  }
}

/* The customization panel on the game header, visible when the game level is
selected as "custom". */
class CustomizationPanel extends React.Component {
  /**
   * Initialize the customization panel to its default parameters (level easy).
   * @param {object} props - Object containing the input properties:
   * @param {string} props.level - The GameContainer's "level" state.
   * @param {number} props.rows - The GameContainer's "rows" state.
   * @param {number} props.columns - The GameContainer's "columns" state.
   * @param {number} props.mines - The GameContainer's "mines" state.
   * @param {function} props.setcustom - The GameContainer's "setState" method.
   */
  constructor(props) {
    super(props);

    this.state = {
      rowsNumber: 9,
      columnsNumber: 9,
      minesNumber: 10,
      posNumberWarningDisplay: "none",
      excessMineWarningDisplay: "none"
    };
    this.setState = this.setState.bind(this);
  }

  /**
   * Check if the entered number of mines exceeds the maximum allowed amount
   * (which depends on the entered number of rows and columns).
   * @param  {array} inputs - The array of input custom data (number ofrows,
   *  columns and mines).
   * @return {boolean} - The indication if the number of mines is exceeded.
   */
  minesExceeded = inputs => {
    const [rows, columns, mines] = inputs;
    if (!inputs.includes("") && mines >= rows * columns) return true;
    return false;
  };

  /**
   * Check if any inserted numeric input is greater than zero.
   * @param  {array} inputs - The array of input custom data (number of rows,
   *  columns and mines).
   * @return {boolean} - The indication if the input numbers are positive.
   */
  inputIsNegative = inputs => {
    if (inputs.every(input => input > 0)) return false;
    return true;
  };

  /**
   * Set the warning display object (to feed a setState function).
   * @param  {array} inputs - The array of input custom data (number of rows,
   *  columns and mines).
   * @param  {array} types - The array of strings for each warning type.
   * @return {object} - The state object for warning display.
   */
  warningDisplay = (inputs, ...types) => {
    // console.log(inputs);
    const warningState = {};

    types.forEach((type, index) => {
      if (type === "excessive number of mines") {
        warningState["excessMineWarningDisplay"] = this.minesExceeded(inputs)
          ? ""
          : "none";
      } else if (type === "negative inputs") {
        warningState["posNumberWarningDisplay"] = this.inputIsNegative(inputs)
          ? ""
          : "none";
      }
    });

    return warningState;
  };

  /**
   * Set the number of rows, columns and mines defined on their respective input
   * fields on the customization panel. The data is dinamically inserted (namely
   * the input data is processed as soon as it is typed) and the insertion of
   * invalid data only triggers the display of an error message below the panel,
   * leaving the minefield unchanged. It is considered invalid data the numbers
   * less than or equal to 0 or any number of rows, columns or mines which would
   * imply in a amount of mines on the field greater or equal to the number of
   * field buttons.
   * @param {object} event - The onchange event object
   */
  setCustomData = event => {
    // Check if the user typed a number or an empty field
    if (isNaN(Number(event.target.value))) return;

    // Update the current edited input to its newly typed value
    const actualInputStates = ["rows", "columns", "mines"].map(val =>
      val === event.target.name
        ? event.target.value
        : this.state[`${val}Number`]
    );

    this.setState(
      this.warningDisplay(
        actualInputStates,
        "excessive number of mines",
        "negative inputs"
      )
    );

    this.setState({ [`${event.target.name}Number`]: event.target.value });

    if (
      !actualInputStates.includes("") &&
      actualInputStates[2] < actualInputStates[0] * actualInputStates[1] &&
      actualInputStates.every(val => val > 0)
    ) {
      this.props.setCustom({
        rows: Number(actualInputStates[0]),
        columns: Number(actualInputStates[1]),
        mines: Number(actualInputStates[2]),
        fieldProfile: Array.from(Array(Number(actualInputStates[0])), () =>
          new Array(Number(actualInputStates[1])).fill(0)
        ),
        gameStatus: "reset"
      });
    }
  };

  render() {
    return (
      <div style={{ display: this.props.level === "custom" ? "" : "none" }}>
        <form id="customization-panel">
          <div className="customization-panel-item">
            <div>Rows</div>
            <input
              placeholder="0"
              name="rows"
              onChange={this.setCustomData}
              value={this.state.rowsNumber}
            />
          </div>
          <div className="customization-panel-item">
            <div>Columns</div>
            <input
              placeholder="0"
              name="columns"
              onChange={this.setCustomData}
              value={this.state.columnsNumber}
            />
          </div>
          <div className="customization-panel-item">
            <div>Mines</div>
            <input
              placeholder="0"
              name="mines"
              onChange={this.setCustomData}
              value={this.state.minesNumber}
            />
          </div>
        </form>
        <div className="customization-button-count">
          Total entered buttons:{" "}
          {this.state.columnsNumber * this.state.rowsNumber}
        </div>
        <div
          className="customization-warning"
          style={{ display: this.state.posNumberWarningDisplay }}
        >
          The customized numbers should be greater than 0
        </div>
        <div
          className="customization-warning"
          style={{ display: this.state.excessMineWarningDisplay }}
        >
          The number of mines should be less than the number of squares
        </div>
      </div>
    );
  }
}

/* The game container, joining together all the game elements. */
class GameContainer extends React.Component {
  /**
   * Initialize the game to its default configuration corresponding to the easy
   * level and the status set to "reset".
   */
  constructor() {
    super();
    this.state = {
      level: "easy",
      rows: 9,
      columns: 9,
      mines: 10,
      fieldProfile: Array.from(Array(9), () => new Array(9).fill(0)),
      gameStatus: "reset", // "won", "lost", "in progress", "reset"
      mouseIsDown: false,
      firstClickedLocation: [],
      squaresToReveal: 71,
      revealedSquares: 0,
      flags: 10
    };
    this.setState = this.setState.bind(this);
  }

  /**
   * Handle the reset and winning events of the game, either by resetting the
   * number of revealed squares and equating the available flags to the number
   * of mines on the field (in case of reset) or by setting to 0 the number of
   * available flags (in case of winning).
   * @param  {object} prevProps - A copy of the props object imediately before
   *  the update.
   * @param  {object} prevState - A copy of the state object imediately before
   * the update.
   */
  componentDidUpdate(prevProps, prevState) {
    if (
      (prevState.gameStatus !== "reset" && this.state.gameStatus === "reset") ||
      prevState.mines !== this.state.mines
    ) {
      this.setState({
        revealedSquares: 0,
        flags: this.state.mines
      });
    } else if (
      prevState.gameStatus !== "won" &&
      this.state.gameStatus === "won"
    ) {
      this.setState({ flags: 0 });
    }
  }

  render() {
    return (
      <div className="game-container">
        <header className="game-container-header">
          <LevelList level={this.state.level} setLevel={this.setState} />
          <FaceButton
            gameStatus={this.state.gameStatus}
            mouseIsDown={this.state.mouseIsDown}
            resetGame={this.setState}
          />
          <FlagEnumerator flags={this.state.flags} />
          <Timer gameStatus={this.state.gameStatus} />
        </header>
        <CustomizationPanel
          level={this.state.level}
          rows={this.state.rows}
          columns={this.state.columns}
          mines={this.state.mines}
          setCustom={this.setState}
        />
        <Minefield
          level={this.state.level}
          rows={this.state.rows}
          columns={this.state.columns}
          mines={this.state.mines}
          setProfile={this.setState}
          fieldProfile={this.state.fieldProfile}
          gameStatus={this.state.gameStatus}
          firstClickedLocation={this.state.firstClickedLocation}
          squaresToReveal={this.state.squaresToReveal}
          revealedSquares={this.state.revealedSquares}
        />
      </div>
    );
  }
}

/**
 * Render the game application to the appropriate HTML elements.
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Minesweeper</div>
      </header>
      <GameContainer />
    </div>
  );
}

export default App;
