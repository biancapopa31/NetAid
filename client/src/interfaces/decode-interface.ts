import {Post, postKeys} from "./Post";

export default function decodeInterface<T>(keys: (keyof T)[], data: any[]) {
    let result: T = {} as T;

    for(let i = 0; i < keys.length; i++){
        result[keys[i]] = data[i];
    }

    return result;
}

// const y = result.map((data) => decodeInterface<Post>(postKeys, data));

// const x = decodeInterface<Post>(postKeys, result);