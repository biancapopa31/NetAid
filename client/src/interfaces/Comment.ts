export interface Comment {
    id: number;
    text: string;
    timestamp: number;
    creator: string;
}

export const commentKeys: (keyof Comment)[] = ['id', 'text', 'timestamp', 'creator'];