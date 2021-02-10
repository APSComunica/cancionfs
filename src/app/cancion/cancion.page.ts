import { Component, OnInit } from '@angular/core';
//Añadimos el router
import { ActivatedRoute } from "@angular/router";
import { Cancion } from '../cancion';
import { FirestoreService } from '../firestore.service';

import { Router } from "@angular/router";

import { AlertController } from '@ionic/angular';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-cancion',
  templateUrl: './cancion.page.html',
  styleUrls: ['./cancion.page.scss'],
})
export class CancionPage implements OnInit {
  id = null;

//ultimo
  document: any = {
    id: "",
    data: {} as Cancion
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router, public alertCtrl: AlertController,
    private LoadingController: LoadingController,
    private ToastController: ToastController,
    private ImagePicker: ImagePicker) {}

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
    //Borramos el bolso
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
            this.firestoreService.borrar("canciones", this.id).then(() => {
              // Limpiar datos de pantalla
              this.document.data = {} as Cancion;
              //Cuando eliminemos el artículo volvemos a home
              this.router.navigate(["/home"]); 
            })
            console.log('Confirm Okay.');  
          }  
        }  
      ]  
    });  
    await confirm.present();  
  }  
 


  async uploadImagePicker() {
    const loading = await this.LoadingController.create({  
      message: 'Por favor espere...'   
    });  
      
    const toast = await this.ToastController.create({  
      message: 'Imagen subida con exito',
      duration:3000   
    });

    this.ImagePicker.hasReadPermission().then(
      (result) => {

        if(result == false){
          this.ImagePicker.requestReadPermission();
        }
        else{

          this.ImagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then (
            (results) => {

              let nombreCarpeta = "imagenes";

              for (var i = 0; i > results.length; i++) {

                loading.present();

                let nombreImagen = `${new Date().getTime()}`;

                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                .then(snapshot => {
                  snapshot.ref.getDownloadURL()
                  .then(downloadURL => {

                    console.log("downloadURL:" + downloadURL);

                    toast.present();

                    loading.dismiss();
                  })
                })
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
    } 


    async deleteFile(fileURL) {  
      const toast = await this.ToastController.create({   
        message: 'Imagen borrada con éxito',  
       duration: 3000
      });
      this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
    }

}