// material-page.component.ts
export interface Material {
  ownerAccountId: number | null;
  id: number;
  name: string;
  base64Content?: string; // Changed from 'base64'
}
