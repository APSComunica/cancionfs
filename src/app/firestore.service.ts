import { Injectable } from '@angular/core';
//Importamos el firestore
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  //Hacemos el metodo constructor
  constructor(private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage) { 
  }
  //Creamos un metodo publico para insertar los datos con el metodo add
  public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos);
  } 

  //Creamos el metodo consultar
  public consultar(coleccion) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  //Creamos el metodo borrar
  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  //Creamos el metodo actualizar
  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
   }

   public consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public uploadImage(imagenes, imagen, imagenBase64){
    let storageRef = 
    this.angularFireStorage.ref(imagenes).child(imagen);
      return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  public deleteFileFromURL (fileURL) {

    return this.angularFireStorage.storage.refFromURL(fileURL).delete();

  }

}
