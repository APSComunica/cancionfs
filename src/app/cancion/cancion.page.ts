import { Component, OnInit } from '@angular/core';
//Añadimos el router
import { ActivatedRoute } from "@angular/router";
import { Cancion } from '../cancion';
import { FirestoreService } from '../firestore.service';

import { Router } from "@angular/router";

import { AlertController } from '@ionic/angular';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-cancion',
  templateUrl: './cancion.page.html',
  styleUrls: ['./cancion.page.scss'],
})
export class CancionPage implements OnInit {
  id = null;
  quotes :any;

//ultimo
  document: any = {
    id: "",
    data: {} as Cancion
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, public alertCtrl: AlertController,
    private LoadingController: LoadingController,
    private ToastController: ToastController,
    private ImagePicker: ImagePicker,
    private socialSharing: SocialSharing,) {}

  ngOnInit() {
    //Recoge el id y el tipo de acción que realizamos
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    console.log(this.id);

    this.firestoreService.consultarPorId("canciones", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        console.log("datos encontrados");
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Cancion;
        console.log("datos no encontrados");
      } 
    });
  } 


  

  clicBotonModificar() {
    //Modificamos la cancion seleccionado
    this.firestoreService.actualizar("canciones", this.id, this.document.data).then(() => {
      // Limpiar datos de pantalla
      this.document.data = {} as Cancion;
    })
  }

  clicBotonInsertar() {
    //Inserta un objeto de tipo cancion en la base de datos, llamando al método insertar (en el archivo firestore.service.ts)
    this.firestoreService.insertar("canciones", this.document.data).then(() => {
      console.log('Cancion creada correctamente!');
      //Limpiamos el contenido de la cancion que se estaba editando en el navegador
      this.document.data= {} as Cancion;
    }, (error) => {
      console.error(error);//Si da error
    });
    //Cuando creemos el artículo volvemos a home
    this.router.navigate(["/home"]); 
  }



  clicBotonBorrar() {
    this.deleteFile(this.document.data.imagen);
    //Borramos
    this.firestoreService.borrar("canciones", this.id).then(() => {
      // Limpiar datos de pantalla
      this.document.data = {} as Cancion;
      //Cuando eliminemos el artículo volvemos a home
      this.router.navigate(["/home"]); 
    })
  }

  async showConfirm() {  
    const confirm = await this.alertCtrl.create({  
      header: 'Confirm!',  
      message: 'Do you agree to use this Alert option',  
      buttons: [  
        {  
          text: 'Cancel',  
          role: 'cancel',  
          handler: () => {  
            console.log('Confirm Cancel');  
          }  
        },  
        {  
          text: 'Okay',  
          handler: () => {  
            // this.firestoreService.borrar("canciones", this.id).then(() => {
            //   // Limpiar datos de pantalla
            //   this.document.data = {} as Cancion;
            //   //Cuando eliminemos el artículo volvemos a home
            //   this.router.navigate(["/home"]); 
            // })
            this.clicBotonBorrar();
            console.log('Confirm Okay.');  
          }  
        }  
      ]  
    });  
    await confirm.present();  
  }  
 


  async uploadImagePicker() {
    const loading = await this.LoadingController.create({
      message: 'Please wait...'
    });
      
    //Mensaje de finalización de subida de la imagen 
    const toast = await this.ToastController.create({
      message:'Image was update successfully',
      duration: 3000
    });

    //Comprobar si la aplicación tiene permisos de lectura
    this.ImagePicker.hasReadPermission().then(
      (result) => {

        //Si no tiene permiso de lectura se solicita al usuario
        if(result ==false){
          this.ImagePicker.requestReadPermission();
        }
        else{
          //Abrir selector de imágenes (IMagePicker)
          this.ImagePicker.getPictures({
            maximumImagesCount: 1, //Permitir sólo 1 imagen
            outputType: 1 //1=Base64
          }).then (
            (results) => { //En la variable results se tienen las imagenes seleccionadas
              //Carpeta del Storage donde se almacenará la imagen
              console.log("Hola, esta entrando");
              let imagenes = "imagenes";
              //Recorrer todas las imagenes que haya seleccionado el usuario
              //aunque realmente solo será 1 como se ha indicado en las opciones
              for (var i=0; i<results.length; i++) {
                //mostrar el mensaje de espera
                loading.present();
                //Asignar el nombre de la imagen en función de la hora actual para 
                //evitar duplicados de nombres
                let imagen = `${new Date().getTime()}`;
                //Llamar al método que se sube la imagen al Storage
                this.firestoreService.uploadImage(imagenes,imagen,results[i])
                .then(snapshot => {
                  snapshot.ref.getDownloadURL()
                  .then(downloadURL => {
                    console.log("downloadURL:"+downloadURL);
                    if(this.document.data.imagen!= null){
                      this.deleteFile(this.document.data.imagen);
                    }
                    //Aquí guardamos la url en el campo que nos interesa
                    this.document.data.imagen = downloadURL;
                    toast.present();
                    loading.dismiss();
                  })
                })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
    
  }


    async deleteFile(fileURL){
      const toast = await this.ToastController.create({
        message: 'File was deleted seccessfully',
        duration: 3000
      });
      this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
    }


    regularShare() {
      this.socialSharing.share("La canción que me ha gustado es la siguiente: " + "\n" + "Titulo: " + this.document.data.titulo + "\n" + "Autor: " + this.document.data.autor, null, null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }

    whatsappShare(){
       this.socialSharing.shareViaWhatsApp("La canción que me ha gustado es la siguiente: " + "\n" + "Titulo: " + this.document.data.titulo + "\n" + "Autor: " + this.document.data.autor,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
     }

     twitterShare(){
      this.socialSharing.shareViaTwitter("La canción que me ha gustado es la siguiente: " + "\n" + "Titulo: " + this.document.data.titulo + "\n" + "Autor: " + this.document.data.autor,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }
    
    facebookShare(){
       this.socialSharing.shareViaFacebook("La canción que me ha gustado es la siguiente: " + "\n" + "Titulo: " + this.document.data.titulo + "\n" + "Autor: " + this.document.data.autor,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
     }


}