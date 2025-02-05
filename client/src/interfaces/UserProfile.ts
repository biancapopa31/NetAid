
export interface UserProfile {
    username: string;
    bio: string;
    profilePictureCid: string;
    balance: number;
    profilePictureUrl: string;
}

export const userProfileKeys: (keyof UserProfile)[] = ['username', 'bio', 'profilePictureCid', "balance"];