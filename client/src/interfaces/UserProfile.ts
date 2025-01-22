
export interface UserProfile {
    username: string;
    bio: string;
    profilePictureCid: string;
}

export const userProfileKeys: (keyof UserProfile)[] = ['username', 'bio', 'profilePictureCid'];