import { Timestamp, FieldValue } from "firebase/firestore";


export interface Comment {
    id: string; 
    text: string;
    authorId: string; 
    createdAt?: Timestamp | FieldValue; 
}