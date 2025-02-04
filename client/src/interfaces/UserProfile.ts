
export interface UserProfile {
    username: string;
    bio: string;
    profilePictureCid: string;
    profilePictureUrl: string;
}

export const userProfileKeys: (keyof UserProfile)[] = ['username', 'bio', 'profilePictureCid'];