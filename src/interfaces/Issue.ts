import { Timestamp, FieldValue } from "firebase/firestore";

export interface Issue {
    id: string; 
    title: string;
    description: string;
    status: 'Open' | 'Closed' | 'Pending';
    labels: string[]; 
    createdBy: string; 
    createdAt: Timestamp | FieldValue; 
    updatedAt: Timestamp | FieldValue; 
    commentsCount: number; 
    ImageUrls?: string[];
  }