import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Material } from '../model/material.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:8080/api/v1/material';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMaterialsBySubject(subjectId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/materials/subject/${subjectId}`);
  }

  uploadMaterial(subjectId: number, file: File): Observable<any> {
    const ownerAccountId = this.authService.getUserId();

    if (!ownerAccountId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return from(this.convertFileToBase64(file)).pipe(
      switchMap(base64 => {
        const payload = {
          base64: base64,
          name: file.name,
          subjectId: subjectId,
          ownerAccountId: ownerAccountId
        };
        return this.http.post(`${this.apiUrl}/upload`, payload);
      })
    );
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  downloadMaterial(materialId: number): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/material/${materialId}`);
  }

  getUserMaterials(ownerId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  deleteMaterial(materialId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${materialId}`);
  }
}
