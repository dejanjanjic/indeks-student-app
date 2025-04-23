// material-page.component.ts
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Subject as Subj } from '../../../model/subject.model';
import { Material } from '../../../model/material.model';
import { AuthService } from '../../../services/auth.service';
import { MaterialService } from '../../../services/material.service';
import { SubjectService } from '../../../services/subject.service';
import { ThemeService } from '../../../services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeratorService } from '../../../services/moderator.service';

declare var URL: {
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
};

@Component({
  selector: 'app-moderator-material-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DragDropModule, FormsModule],
  templateUrl: './moderator-materials-page.component.html',
  styleUrls: ['./moderator-materials-page.component.css'],
})
export class ModeratorMaterialsPageComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  subjects: Subj[] = [];
  selectedSubject: Subj | null = null;
  materials: Material[] = [];
  filteredMaterials: Material[] = [];
  fileError: string = '';
  searchQuery: string = '';
  isLoading = false;
  MAX_FILE_SIZE = 10 * 1024 * 1024;
  currentUserId: number | null = null;

  isDarkMode = false;
  private themeSubscription: Subscription;

  constructor(
    private subjectService: SubjectService,
    private materialService: MaterialService,
    private authService: AuthService,
    private themeService: ThemeService,
    private moderatorService: ModeratorService,
  ) {
    this.currentUserId = this.authService.getUserId();
    this.themeSubscription = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  userMaterials: Material[] = [];

  selectedYear: any = null;

  ngOnInit(): void {

    this.selectedYear = this.authService.getUserId()!;

    this.moderatorService.getModeratorMaterialPath(this.selectedYear!).subscribe({
      next: (materialPath) => {
        const parsedYear = Number(materialPath);

        if (!isNaN(parsedYear)) {
          this.selectedYear = parsedYear;
          this.loadSubjects(this.selectedYear);
        } else {
          console.warn('materialPath nije validan broj:', materialPath);
          // opcionalno: postavi defaultnu vrijednost, prikaži poruku korisniku, itd.
        }
      },
      error: (err) => {
        console.error('Failed to load moderator material path:', err);
      },
    });


    this.loadSubjects(this.selectedYear);
    this.loadUserMaterials();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  fileBrowseHandler(event: any): void {
    this.handleFileUpload(event);
  }
  downloadMaterial(materialId: number): void {
    this.materialService.downloadMaterial(materialId).subscribe({
      next: (material) => {
        if (!material.base64Content) {
          this.fileError = 'File content is missing';
          return;
        }

        const byteCharacters = atob(material.base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: 'application/octet-stream',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = material.name;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.fileError = 'Failed to download material';
      },
    });
  }

  loadSubjects(year: number): void {
    this.isLoading = true;
    this.selectedYear = year;
    this.subjectService.getSubjectsByYear(year).subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.selectedSubject = subjects.length > 0 ? subjects[0] : null;
        this.selectSubject(this.selectedSubject!);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  selectSubject(subject: Subj): void {
    this.isLoading = true;
    this.selectedSubject = subject;
    this.materialService.getMaterialsBySubject(subject.id).subscribe({
      next: (materials) => {
        this.materials = materials;
        this.filteredMaterials = [...materials];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  filterMaterials(): void {
    this.filteredMaterials = this.materials.filter((material) =>
      material.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getFileType(material: Material): { extension: string; color: string } {
    const ext = material.name.split('.').pop()?.toLowerCase() || 'file';
    switch (ext) {
      case 'pdf':
        return { extension: 'PDF', color: '#e74c3c' };
      case 'doc':
      case 'docx':
        return { extension: 'DOC', color: '#2b579a' };
      case 'xls':
      case 'xlsx':
        return { extension: 'XLS', color: '#217346' };
      case 'ppt':
      case 'pptx':
        return { extension: 'PPT', color: '#d04423' };
      case 'zip':
      case 'rar':
        return { extension: 'ZIP', color: '#f39c12' };
      default:
        return { extension: ext.toUpperCase(), color: '#666' };
    }
  }
  showUploadArea = false;

  toggleUploadArea(): void {
    this.showUploadArea = !this.showUploadArea;
  }

  @ViewChild('uploadZone') uploadZone!: ElementRef;
  isDragging = false;

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files);
    }
  }

  handleFileUpload(files: FileList | null): void {
    this.fileError = '';

    if (!files || files.length === 0) {
      this.fileError = 'Nijedan fajl nije odabran';
      return;
    }

    const file = files[0];
    if (this.selectedSubject) {
      this.isLoading = true;
      this.materialService
        .uploadMaterial(this.selectedSubject.id, file)
        .subscribe({
          next: (uploadedMaterial) => {
            this.isLoading = false;
            this.showUploadArea = false;

            if (uploadedMaterial) {
              // Direktno dodajemo materijal u trenutnu listu
              this.materials.push(uploadedMaterial);
              this.filterMaterials();
            } else {
              this.selectSubject(this.selectedSubject!);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.fileError = err.message || 'Upload failed';
          },
        });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  protected readonly HTMLInputElement = HTMLInputElement;

  // Modifikovano da uvek vraća true
  isMaterialOwner(material: Material): boolean {
    return true; // Omogućava prikaz indikatora vlasništva za sve materijale
  }

  deleteMaterial(materialId: number): void {
    if (confirm('Da li ste sigurni da želite obrisati ovaj materijal?')) {
      this.materialService.deleteMaterial(materialId).subscribe({
        next: () => {
          // Uklanjamo materijal iz svih lista
          this.materials = this.materials.filter((m) => m.id !== materialId);
          this.filteredMaterials = this.filteredMaterials.filter(
            (m) => m.id !== materialId
          );
          this.userMaterials = this.userMaterials.filter(
            (m) => m.id !== materialId
          );
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.fileError = 'Brisanje nije uspjelo';
        },
      });
    }
  }

  showingUserMaterials: boolean = false;

  loadUserMaterials(): void {
    if (this.currentUserId) {
      this.isLoading = true;
      this.materialService.getUserMaterials(this.currentUserId).subscribe({
        next: (materials) => {
          this.userMaterials = materials;
          if (this.showingUserMaterials) {
            this.materials = materials;
            this.filteredMaterials = [...materials];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load user materials:', err);
          this.isLoading = false;
          if (this.showingUserMaterials) {
            this.filteredMaterials = [];
          }
        },
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}