import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AddModeratorDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  materialPath: number;
}

export interface UpdateModeratorDTO {
  materialPath: number;
}

export interface ModeratorAccount {
  id: number;
  firstName: string;
  lastName: string;
  materialPath: number;
  account: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/moderator';

  constructor(private http: HttpClient) {}

  getAllModerators(): Observable<ModeratorAccount[]> {
    return this.http.get<ModeratorAccount[]>(`${this.apiUrl}`);
  }

  getModeratorById(id: number): Observable<ModeratorAccount> {
    return this.http.get<ModeratorAccount>(`${this.apiUrl}/${id}`);
  }

  getModeratorMaterialPath(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/material-path`);
  }

  addModerator(dto: AddModeratorDTO): Observable<ModeratorAccount> {
    return this.http.post<ModeratorAccount>(`${this.apiUrl}`, dto);
  }

  updateModerator(id: number, dto: UpdateModeratorDTO): Observable<ModeratorAccount> {
    return this.http.put<ModeratorAccount>(`${this.apiUrl}/${id}`, dto);
  }

  deleteModerator(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
