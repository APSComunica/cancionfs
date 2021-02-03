import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from "@angular/router";
import { Cancion } from '../cancion';
import { FirestoreService } from '../firestore.service';

import { Router } from "@angular/router";


@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  id = null;


  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {
  }

}
