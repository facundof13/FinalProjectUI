import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private _http: HttpClient) { }

  async getRooms() {
    const url = `${environment.apiUrl}/rooms`;
    return await this._http.get(url).toPromise<any>();
  }

  async createRoom(body) {
    const url = `${environment.apiUrl}/rooms`;
    return await this._http.post(url, body).toPromise<any>();
  }

  async getRoomDetails(roomId) {
    const url = `${environment.apiUrl}/rooms/${roomId}`;
    return await this._http.get(url).toPromise<any>();
  }
}
