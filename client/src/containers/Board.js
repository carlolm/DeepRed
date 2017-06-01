import React, { Component } from 'react';
import { connect } from 'react-redux';

import { invalidSelection, selectPiece } from '../store/actions';
import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch(fetchGame());
  }

  onClick(coordinates) {
    const { dispatch, board, fromPosition, selectedPiece, attemptMove } = this.props;

    const x = coordinates[0];
    const y = coordinates[1];
    const selection = board[x][y];
    console.log('SELECTION: ', selection);
    // If no piece is currently selected
    if (selectedPiece === '') {
      // && selection[0] === playerColor
      if (selection) {
        dispatch(selectPiece(selection, coordinates));
      } else {
        dispatch(invalidSelection(coordinates));
      }
      // If a piece is already selected
      /* NOTE: CHECK FOR VALID MOVE REQUIRED HERE    */
      // if (selection === null)
    } else {
      attemptMove(selectedPiece, fromPosition, coordinates, selection);
    // } else if (selectedPiece[0] === board[x][y][0]) {
    //   dispatch(invalidSelection(coordinates));
    // } else {
    //   const capturedPiece = selection;
    //   dispatch(capturePiece(selectedPiece, fromPosition, coordinates, capturedPiece));
    }
  }
  getImage(CP) {
    return <img className="piece-img" src={`/assets/${CP}.png`} />;
  }
  render() {
    const { board } = this.props;
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={Math.random()} className="board-row">
            {row.map((col, colIndex) => (
              <div
                className={((rowIndex + colIndex) % 2 === 1) ? 'board-col dark' : 'board-col light'}
                key={rowIndex.toString() + colIndex.toString()}
                onClick={() => this.onClick([rowIndex, colIndex])}
              >
                {this.getImage(col)}
              </div>),
            )}
          </div>
        ),
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, boardState, moveState } = state;
  const { playerColor } = gameState;
  const { board } = boardState;
  const { fromPosition, selectedPiece } = moveState;
  return {
    playerColor,
    board,
    fromPosition,
    selectedPiece,
  };
}

export default connect(mapStateToProps)(Board);