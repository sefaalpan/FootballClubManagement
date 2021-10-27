import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Club } from '../models/club.model';
import { Equipe } from '../models/equipe.model';
import { President, Joueur } from '../models/iuser.model';
import { ClubService } from '../services/club.service';
import { EquipeService } from '../services/equipe.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  presidents: President[] = [];
  clubs: Club[] = [];
  equipes: Equipe[] = [];
  joueurs: Joueur[] = [];

  constructor(private us: UserService, private cs: ClubService, private es: EquipeService) { }

  ngOnInit(): void {

    this.us.getPresidents()
      .subscribe(datas => this.presidents = datas);

    this.cs.getClubs()
      .subscribe(datas => this.clubs = datas);

    this.es.getEquipesConfondues()
      .subscribe(datas => this.equipes = datas);

    this.us.getJoueurs()
      .subscribe(e => this.joueurs = e);
  }

  supprimer(id: number) {
    this.us.deletePresident(id as number)
      .pipe(
        mergeMap(datas => this.us.getPresidents())
      )
      .subscribe(datas => this.presidents = datas);
  }

  supprimerClub(id: number) {
    this.cs.deleteClub(id)
      .pipe(
        mergeMap(() => this.cs.getClubs())
      )
      .subscribe(datas => this.clubs = datas)
  }

  supprimerEquipe(categorie: string) {
    this.es.deleteEquipeByCategorie(categorie)
      .pipe(
        mergeMap(() => this.es.getEquipesConfondues())
      )
      .subscribe(datas => this.equipes = datas);
  }

  supprimerJoueur(id: number) {
    this.us.deleteJoueur(id)
      .pipe(
        mergeMap(() => this.us.getJoueurs())
      )
      .subscribe(datas => this.joueurs = datas)
  }
}