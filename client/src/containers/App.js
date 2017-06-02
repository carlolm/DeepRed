import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import { setPlayerW, setPlayerB, updateRoomInfo, getRequestFailure, receiveGame, movePiece, unselectPiece, capturePiece, displayError, colorSquare } from '../store/actions';

// Components
import ChessMenu from '../components/ChessMenu';
import SettingsDrawer from '../components/SettingsDrawer';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import ErrorAlert from './ErrorAlert';
import './css/App.css';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// CSS

class App extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.attemptMove = this.attemptMove.bind(this);
    this.checkLegalMove = this.checkLegalMove.bind(this);
    this.newChessGame = this.newChessGame.bind(this);
    this.startSocket = this.startSocket.bind(this);
    this.sendPauseRequest = this.sendPauseRequest.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
    .then((response) => {
      console.log('successfully fetched current user infomation');
      dispatch(setPlayerW(response));
    })
    .then(() => {
      this.startSocket();
    })
    .catch((err) => {
      dispatch(getRequestFailure(err));
      console.error('failed to obtain current user infomation!', err);
    });
  }

  startSocket() {

    const { dispatch, playerW } = this.props;

    const name = playerW;
    // instantiate socket instance on the cllient side
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side connected!');
      this.socket.emit('sendCurrentUserName', name);
    });

    this.socket.on('firstPlayerJoined', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      console.log(`first player has joined ${roomInfo.room} as ${roomInfo.playerW}`);
    });

    this.socket.on('secondPlayerJoined', (roomInfo) => {
      console.log(`second player has joined ${roomInfo.room} as ${roomInfo.playerB}`);
    });

    this.socket.on('startGame', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
    });

    this.socket.on('attemptMoveResult', (board, error, selectedPiece, origin, dest, selection, room) => {
      console.log('************** BOARD: ', board);
      // dispatch(receiveGame(board));
      if (error === null) {
        dispatch(movePiece(selectedPiece, origin, dest));
        if (selection) {
          dispatch(capturePiece(selectedPiece, origin, dest, selection));
        }
      } else {
        console.log('---------- ERROR: ', error);
        dispatch(displayError(error));
      }
      dispatch(unselectPiece());
      dispatch(colorSquare(null, dest));
    });

    this.socket.on('isLegalMoveResult', (dest, bool) => {
      // dispatch(receiveGame(board));
      let color = 'board-col red';
      if (bool) {
        color = 'board-col green';
      }
      dispatch(colorSquare(color, dest));
    });

    this.socket.on('requestPauseDialogBox', () => {
      console.log('receieved request!');
    });
  }

  sendPauseRequest() {
    const { room } = this.props;
    this.socket.emit('requestPause', room);
  }

  newChessGame() {
    const { dispatch } = this.props;
    console.log('make new game');
    this.socket.emit('newChessGame');
    this.socket.on('createdChessGame', game => dispatch(receiveGame(game)));
  }

  attemptMove(selectedPiece, origin, dest, selection, room) {
    // const { dispatch } = this.props;
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('attemptMove', selectedPiece, origin, dest, selection, room);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  checkLegalMove(origin, dest, room) {
    // const { dispatch } = this.props;
    console.log('checking legal move');

    this.socket.emit('checkLegalMove', origin, dest, room);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  render() {
    const { moveHistory, capturedPiecesBlack, capturedPiecesWhite, message, playerB, playerW, error } = this.props;
    return (
      <div className="site-wrap">
        <div>
        <ChessMenu />
          <table>
            <tbody>
              <tr>
                <td><h1>Deep Red</h1></td>
                <td className="button-cell">
                  <SettingsDrawer />
                  <a href="/profile" className="button">Home</a>
                  <a href="/logout" className="button">Logout</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content">
          <div className="flex-row">

            <div className="flex-col">
              <CapturedPieces color="Black" capturedPieces={capturedPiecesBlack} player={playerB} />
              <Board attemptMove={this.attemptMove} checkLegalMove={this.checkLegalMove} />
              <CapturedPieces color="White" capturedPieces={capturedPiecesWhite} player={playerW} />
              <CapturedPieces color="Black" capturedPieces={capturedPiecesBlack} player={playerB} sendPauseRequest={this.sendPauseRequest} />
              <Board attemptMove={this.attemptMove} checkLegalMove={this.checkLegalMove} />
              <CapturedPieces color="White" capturedPieces={capturedPiecesWhite} player={playerW} sendPauseRequest={this.sendPauseRequest} />
              <Message message={message} />
              <Message message={error} />
            </div>

            <div className="flex-col right-col">
              <MoveHistory moveHistory={moveHistory} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, moveState, userState } = state;
  const {
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  } = gameState;
  const {
    playerW,
    playerB,
    room,
  } = userState;
  const { message, error } = moveState;
  return {
    room,
    playerB,
    playerW,
    message,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    error,
  };
}

export default connect(mapStateToProps)(App);
