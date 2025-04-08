// material-page.component.ts
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { MaterialService } from '../../services/material.service';
import { Subject as Subj } from '../../model/subject.model';
import { Material } from '../../model/material.model';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common'; // Add this
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

declare var URL: {
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
};
@Component({
  selector: 'app-material-page',
  standalone: true, // If using standalone components
  imports: [
    CommonModule, // Add this
    HttpClientModule,
    DragDropModule,
    FormsModule,
    // Add other necessary modules/components here
  ],
  templateUrl: './material-page.component.html',
  styleUrls: ['./material-page.component.css']
})

export class MaterialPageComponent implements OnInit {
  years = [1, 2, 3, 4];
  selectedYear: number = 1;
  subjects: Subj[] = [];
  selectedSubject: Subj | null = null;
  materials: Material[] = [];
  filteredMaterials: Material[] = [];
  fileError: string = '';
  searchQuery: string = '';
  isLoading = false;
  MAX_FILE_SIZE = 10 * 1024 * 1024;
  currentUserId: number | null = null;

  constructor(
    private subjectService: SubjectService,
    private materialService: MaterialService,
    private authService: AuthService // Add AuthService
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  userMaterials: Material[] = [];

  ngOnInit(): void {
    this.loadSubjects(this.selectedYear);
    this.loadUserMaterials();
  }


// In your component


  fileBrowseHandler(event: any): void {
    this.handleFileUpload(event);
  }
  // material-page.component.ts

  // Updated downloadMaterial method
// Then modify your download method like this:
  downloadMaterial(materialId: number): void {
    this.materialService.downloadMaterial(materialId).subscribe({
      next: (material) => {
        if (!material.base64Content) {
          this.fileError = 'File content is missing';
          return;
        }

        // Convert base64 to Blob
        const byteCharacters = atob(material.base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        // Use the declared URL interface directly
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
      }
    });
  }

  loadSubjects(year: number): void {
    this.isLoading = true;
    this.selectedYear = year;
    this.subjectService.getSubjectsByYear(year).subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
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
      }
    });
  }

  filterMaterials(): void {
    this.filteredMaterials = this.materials.filter(material =>
      material.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

// Updated getFileIcon method in component
  getFileType(material: Material): { extension: string, color: string } {
    const ext = material.name.split('.').pop()?.toLowerCase() || 'file';
    switch(ext) {
      case 'pdf': return { extension: 'PDF', color: '#e74c3c' };
      case 'doc':
      case 'docx': return { extension: 'DOC', color: '#2b579a' };
      case 'xls':
      case 'xlsx': return { extension: 'XLS', color: '#217346' };
      case 'ppt':
      case 'pptx': return { extension: 'PPT', color: '#d04423' };
      case 'zip':
      case 'rar': return { extension: 'ZIP', color: '#f39c12' };
      default: return { extension: ext.toUpperCase(), color: '#666' };
    }


}
// Add this property to the component class
  showUploadArea = false;

// Add this method to the component class
  toggleUploadArea(): void {
    this.showUploadArea = !this.showUploadArea;
  }

// Modify the handleFileUpload method to hide the upload area after successful upload

  // In component class

  // Add these new properties
  @ViewChild('uploadZone') uploadZone!: ElementRef;
  isDragging = false;

// Modify existing methods
  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files);
    }
  }

// Update handleFileUpload signature
  // Modify the handleFileUpload method
  // material-page.component.ts (update handleFileUpload)
  handleFileUpload(files: FileList | null): void {
    this.fileError = '';

    if (!files || files.length === 0) {
      this.fileError = 'Nijedan fajl nije odabran';
      return;
    }

    const file = files[0];
    if (this.selectedSubject) {
      this.isLoading = true;
      this.materialService.uploadMaterial(this.selectedSubject.id, file).subscribe({
        next: (uploadedMaterial) => {
          this.isLoading = false;
          this.showUploadArea = false;

          // If the API returns the complete material object
          if (uploadedMaterial) {
            // Add to user materials list
            this.userMaterials.push(uploadedMaterial);

            // If currently viewing the subject this was uploaded to
            if (this.selectedSubject && this.selectedSubject.id === uploadedMaterial.subjectId) {
              this.materials.push(uploadedMaterial);
              this.filterMaterials(); // Re-apply any active filters
            } else {
              this.selectSubject(this.selectedSubject!);
            }
          } else {
            // Fallback to refreshing the subject
            this.selectSubject(this.selectedSubject!);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.fileError = err.message || 'Upload failed';
        }
      });
    }
  }

// Add drag event handlers
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



  // Update the ownership check
  isMaterialOwner(material: Material): boolean {
    return this.userMaterials.some(m => m.id === material.id);
  }

  // Update the delete method
  deleteMaterial(materialId: number): void {
    if (confirm('Da li ste sigurni da želite obrisati ovaj materijal?')) {
      this.materialService.deleteMaterial(materialId).subscribe({
        next: () => {
          // Remove from all lists
          this.materials = this.materials.filter(m => m.id !== materialId);
          this.filteredMaterials = this.filteredMaterials.filter(m => m.id !== materialId);
          this.userMaterials = this.userMaterials.filter(m => m.id !== materialId);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.fileError = 'Brisanje nije uspjelo';
        }
      });
    }
  }

  // material-page.component.ts (add these new properties)
  showingUserMaterials: boolean = false;
  userMaterialsTitle: string = 'Moji materijali';

// Add these new methods
  showUserMaterials(): void {
    this.showingUserMaterials = true;
    this.selectedSubject = null;
    this.isLoading = true;

    this.materialService.getUserMaterials(this.currentUserId!).subscribe({
      next: (materials) => {
        this.userMaterials = materials;
        this.materials = materials;
        this.filteredMaterials = [...materials];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user materials:', err);
        this.isLoading = false;
      }
    });
  }

  // Add/modify these methods in your MaterialPageComponent class

// Replace the existing toggleViewMode or add it if it doesn't exist
  toggleViewMode(): void {
    if (this.showingUserMaterials) {
      // User just switched to "My Materials" view
      this.loadUserMaterials();
    } else {
      // User just switched to "By Subject" view
      // Reset the selected subject if needed and load subjects
      if (this.selectedSubject) {
        this.selectSubject(this.selectedSubject);
      } else {
        this.loadSubjects(this.selectedYear);
      }
    }
  }

// Update the loadUserMaterials method
  loadUserMaterials(): void {
    if (this.currentUserId) {
      this.isLoading = true;
      this.materialService.getUserMaterials(this.currentUserId).subscribe({
        next: (materials) => {
          this.userMaterials = materials;
          this.materials = materials;
          this.filteredMaterials = [...materials];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load user materials:', err);
          this.isLoading = false;
          this.filteredMaterials = [];
        }
      });
    } else {
      this.materials = [];
      this.filteredMaterials = [];
    }
  }

// You can remove or keep these methods as they won't be used with the toggle
// showUserMaterials(): void {...}
// showSubjectMaterials(): void {...}

  showSubjectMaterials(): void {
    this.showingUserMaterials = false;
    // If we had a selected subject previously, reload it
    if (this.selectedSubject) {
      this.selectSubject(this.selectedSubject);
    } else {
      // Otherwise just clear the materials list
      this.materials = [];
      this.filteredMaterials = [];
    }
  }
}
