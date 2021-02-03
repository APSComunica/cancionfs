import { Component } from '@angular/core';
//Importamos el servicio firestore
import { FirestoreService } from '../firestore.service';
import { Cancion } from '../cancion';
//Servicio router
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

 export class HomePage {

  
   cancionEditando: Cancion; 
   idCancionSelec: string;
  
   //creamos el array de canciones
   arrayColeccionCanciones: any = [{
     id: "",
     data: {} as Cancion
    }];

   constructor(private firestoreService: FirestoreService, private router: Router) {
//     // Crear una cancion vacía
     this.cancionEditando = {} as Cancion;
//     //obtenemos la lista de canciones
     this.obtenerListaCanciones();
   }

   //Usamos esto para que vaya a la segunda página
   //Como tenemos que pasarle algo detrás para que nos envie a la segunda página, he decicido mandarle el texto "nuevo"
    navigateToCancion() {
      this.router.navigate(["/cancion", "nuevo"]); 
   }

   //Creamos para poder ir a las otras páginas
   navigateToInformacion() {
    this.router.navigate(["/informacion", "ver"]); 
  }

  navigateToConstruir() {
    this.router.navigate(["/construir", "verd"]); 
  }

// //Creamos el boton insertar
   clicBotonInsertar() {
     this.firestoreService.insertar("canciones", this.cancionEditando).then(() => {
       console.log('Cancion creada correctamente!');
       this.cancionEditando= {} as Cancion;
     }, (error) => {
       console.error(error);
     });
   }

//   // Aqui creamos el obtener la lista
   obtenerListaCanciones(){
     this.firestoreService.consultar("canciones").subscribe((resultadoConsultaCanciones) => {
       this.arrayColeccionCanciones = [];
       resultadoConsultaCanciones.forEach((datosCancion: any) => {
         this.arrayColeccionCanciones.push({
           id: datosCancion.payload.doc.id,
           data: datosCancion.payload.doc.data()
         });
       })
     });
   }

// //Aqui se crea para seleccionar y luego borrarla


   selecCancion(cancionSelec) {
     console.log("Cancion seleccionada: ");
     console.log(cancionSelec);
     this.idCancionSelec = cancionSelec.id;
     this.cancionEditando.titulo = cancionSelec.data.titulo;
     this.cancionEditando.autor = cancionSelec.data.autor;
     this.cancionEditando.duracion = cancionSelec.data.duracion;
     this.cancionEditando.imagen = cancionSelec.data.imagen;

     //Al seleccionar la cancion me manda a la segunda pantalla
     this.router.navigate(["/cancion", this.idCancionSelec]);
   }

   clicBotonBorrar() {
     this.firestoreService.borrar("canciones", this.idCancionSelec).then(() => {
       // Actualizar la lista completa
       this.obtenerListaCanciones();
       // Limpiar datos de pantalla
       this.cancionEditando = {} as Cancion;
     })
   }

//   //Aqui se crea para modificar
   clicBotonModificar() {
     this.firestoreService.actualizar("canciones", this.idCancionSelec, this.cancionEditando).then(() => {
       // Actualizar la lista completa
       this.obtenerListaCanciones();
       // Limpiar datos de pantalla
       this.cancionEditando = {} as Cancion;
     })
   }

 }
