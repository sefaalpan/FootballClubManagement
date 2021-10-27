import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './components/club/club.component';
import { ManagePlayersComponent } from './components/coach/manage-players/manage-players.component';
import { CompteComponent } from './components/compte/compte.component';
import { CreateClubComponent } from './components/create-club/create-club.component';
import { HomeComponent } from './components/home/home.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { PlayerComponent } from './components/player/player.component';
import { GestionCoachsComponent } from './components/president/gestion-coachs/gestion-coachs.component';
import { GestionEquipesComponent } from './components/president/gestion-equipes/gestion-equipes.component';
import { GestionJoueursComponent } from './components/president/gestion-joueurs/gestion-joueurs.component';
import { PresidentComponent } from './components/president/president.component';
import { AuthGuard } from './guards/auth.guard';
import { CoachGuard } from './guards/coach.guard';
import { PresidentGuard } from './guards/president.guard';
import { IndexComponent } from './index/index.component';

const routes: Routes = [

  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'index', component: IndexComponent },
  { path: 'compte', component: CompteComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login/:email', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'player/:id', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
  { path: 'create-club/:user_id/:matricule', component: CreateClubComponent },
  { path: 'president', component: PresidentComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestionjoueurs', component: GestionJoueursComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestioncoachs', component: GestionCoachsComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestionequipes', component: GestionEquipesComponent, canActivate: [PresidentGuard] },
  { path: 'manage-players', component: ManagePlayersComponent, canActivate: [CoachGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
