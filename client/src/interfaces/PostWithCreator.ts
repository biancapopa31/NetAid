import {Post} from "./Post";
import {UserProfile} from "./UserProfile";

export interface PostWithCreator extends Post, UserProfile {}
