import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private _http: HttpClient,
  ) { }

  async getBoard(roomId) {
    const url = `${environment.apiUrl}/rooms/${roomId}/board`;
    return await this._http.get(url).toPromise<any>();
  }
}
