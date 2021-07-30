import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _http: HttpClient) { }

  async getBoard(roomId) {
    const url = `${environment.apiUrl}/board/${roomId}`;
    return await this._http.get(url).toPromise<any>();
  }

  async updateBoard(roomId, body) {
    const url = `${environment.apiUrl}/board/${roomId}`;
    return await this._http.post(url, body).toPromise<any>();
  }

  async updateRematch(roomId, player) {
    const url = `${environment.apiUrl}/board/${roomId}/rematch`;
    return await this._http.post(url, player).toPromise<any>();
  }
}
