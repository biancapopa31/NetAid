// uint256 id;
// string text;
// string photoCid;
// uint256 timestamp;
// address creator;

export interface Post {
    id: number;
    text: string;
    photoCid: string;
    timestamp: number;
    creator: string;
    photoUrl: string;
}

export const postKeys: (keyof Post)[] = ["id", "text", "photoCid", "timestamp", "creator"];