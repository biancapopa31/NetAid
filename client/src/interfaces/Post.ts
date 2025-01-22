// uint256 id;
// string text;
// string photoCid;
// uint256 timestamp;
// address creator;

export interface Post {
    id: bigint;
    text: string;
    photoCid: string;
    timestamp: bigint;
    creator: string;
}

export const postKeys: (keyof Post)[] = ["id", "text", "photoCid", "timestamp", "creator"];