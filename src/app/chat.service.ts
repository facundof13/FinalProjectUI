import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private _http: HttpClient,
  ) { }

  async getExistingMessages(roomId) {
    const url = `${environment.apiUrl}/rooms/${roomId}/chat`;

    return await this._http.get(url).toPromise<any>();
  }

  async getName(socketId) {
    const url = `${environment.apiUrl}/player/${socketId}`;
    return await this._http.get(url).toPromise<any>();
  }

  async updateName(body) {
    const url = `${environment.apiUrl}/player`;
    return await this._http.post(url, body).toPromise<any>();
  }

  async postMessage(roomId, playerId, message) {
    const url = `${environment.apiUrl}/rooms/${roomId}/player/${playerId}`;
    return await this._http.post(url, { message }).toPromise<any>();
  }

}
