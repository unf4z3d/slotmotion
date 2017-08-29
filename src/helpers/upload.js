import { firebaseStorage } from '../config/constants'

export function uploadFile (folder, key) {
    return firebaseStorage().ref(`${folder}/${key}`).put();
}