import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from '../board.service';
import { Constants } from '../constants';
import { WinComponent } from '../dialogs/win/win.component';
import { GameService } from '../game.service';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() roomId: any;
  @Input() socketId: any;
  @Input() isTurn: boolean;
  @Input() isLoading: boolean;
  @Input() boardObj: any;
  @Output() socketEmitter = new EventEmitter();

  board;
  isHost: boolean;
  isSecondPlayer: boolean;
  isSpectator: boolean;

  canPlay = false;
  spectator = false;
  testLoading: boolean;
  currentPlayerPiece = 1;
  winner: any;


  constructor(
    private gameService: GameService,
    private _board: BoardService,
    private _room: RoomService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  async ngOnChanges() {
    await this.setupBoard();
  }

  async setupBoard() {
    if (this.isLoading || !this.boardObj) {
      return;
    }

    let board = this.boardObj.board;

    if (board) {
      board = JSON.parse(board);

      this.board = board;
    } else {
      this.initiateBoard();
    }

    this.isHost = this.boardObj.host === this.socketId;
    this.isSecondPlayer = this.boardObj.second_player === this.socketId;
    this.isSpectator = !this.isHost && !this.isSecondPlayer;

    this.currentPlayerPiece = this.isSpectator ? null : this.isSecondPlayer ? -1 : 1;

    if (!this.boardObj.last_player) {
      this.canPlay = this.isHost;
    } else if ((this.isSecondPlayer || this.isHost) && this.socketId !== this.boardObj.last_player) {
      this.canPlay = true;
    } else {
      this.canPlay = false;
    }

    this.winner = this.checkForWin();

    if (this.winner && !this.boardObj.second_player_rematch && !this.boardObj.host_rematch) {
      this.openWinDialog();
    }

    if (this.boardObj.second_player_rematch && this.boardObj.host_rematch) {
      this.initiateBoard();

      let body = {
        socketId: this.winner !== 'tie' ? this.winner : this.boardObj.host,
        board: this.board,
      };

      await this.gameService.updateBoard(this.roomId, body);
      await this.rematch('second_player_rematch', false);
      await this.rematch('host_rematch', false);
    }

  }

  initiateBoard(): void {
    let board = [];

    for (let i = 0; i < Constants.LENGTH; i++) {
      board[i] = [];
    }

    for (let i = 0; i < Constants.LENGTH; i++) {
      for (let j = 0; j < Constants.LENGTH; j++) {
        board[i][j] = {
          value: null,
          pieceConfirmed: false,
        }
      }
    }
    this.board = board;
  }

  dropPiece(row, column) {

    if (this.winner) {
      this.openWinDialog();
      return;
    }

    if (!this.canPlay || this.spectator) {
      return;
    }

    const piece = this.board[row][column];

    if (!piece.valueConfirmed && !piece.value) {
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (!this.board[i][j].pieceConfirmed) {
            this.board[i][j].value = null;
          }
        }
      }

      piece.value = this.currentPlayerPiece;
    }
  }

  async submitMove() {
    let moveChanged = false;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (!this.board[i][j].pieceConfirmed && this.board[i][j].value) {
          this.board[i][j].pieceConfirmed = true;
          moveChanged = true;
        }
      }
    }

    if (moveChanged) {
      let body = {
        socketId: this.socketId,
        board: this.board,
      };

      await this.gameService.updateBoard(this.roomId, body);

      this.socketEmitter.emit('move submitted');
    }
  }

  checkForWin() {
    if (!this.board) {
      return;
    }

    // check rows
    for (let i = 0; i < this.board.length; i++) {
      let rowSum = 0;
      for (let j = 0; j < this.board[i].length; j++) {
        rowSum += this.board[i][j].value;
      }

      if (rowSum === 3) {
        return this.boardObj?.host;
      } else if (rowSum === -3) {
        return this.boardObj?.last_player;
      }

    }

    // check columns
    for (let i = 0; i < this.board.length; i++) {
      let colSum = 0;
      for (let j = 0; j < this.board[i].length; j++) {
        colSum += this.board[j][i].value;
      }

      if (colSum === 3) {
        return this.boardObj?.host;
      } else if (colSum === -3) {
        return this.boardObj?.last_player;
      }
    }

    // check diagonal /
    let diagonalSum = 0;
    for (let i = 0; i < this.board.length; i++) {
      diagonalSum += this.board[i][i].value;
    }

    if (diagonalSum == 3) {
      return this.boardObj?.host;
    } else if (diagonalSum === -3) {
      return this.boardObj?.last_player;
    }


    // check diagonal \
    let backwardsDiagonalSum = 0;
    let j = this.board.length - 1;
    for (let i = 0; i < this.board.length; i++) {
      backwardsDiagonalSum += this.board[i][j].value;
      j--;
    }

    if (backwardsDiagonalSum === 3) {
      return this.boardObj?.host;
    } else if (backwardsDiagonalSum === -3) {
      return this.boardObj?.last_player;
    }

    let tie = true;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (!this.board[i][j].pieceConfirmed) {
          tie = false;
        }
      }
    }

    return tie ? 'tie' : null;
  }

  openWinDialog() {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    this.dialog.open(WinComponent, {
      width: '300px',
      data: {
        winId: this.winner,
        socketId: this.socketId,
      }
    });
  }

  async rematch(player, value) {
    await this.gameService.updateRematch(this.roomId, { player, value });

    this.socketEmitter.emit('move submitted');
  }

}
