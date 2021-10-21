import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './components/club/club.component';
import { CreateClubComponent } from './components/create-club/create-club.component';
import { HomeComponent } from './components/home/home.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { GestionCoachsComponent } from './components/president/gestion-coachs/gestion-coachs.component';
import { GestionEquipesComponent } from './components/president/gestion-equipes/gestion-equipes.component';
import { GestionJoueursComponent } from './components/president/gestion-joueurs/gestion-joueurs.component';
import { PresidentComponent } from './components/president/president.component';
import { RegisterComponent } from './components/register/register.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { PresidentGuard } from './guards/president.guard';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:email', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'club', component: ClubComponent, canActivate: [PresidentGuard] },
  { path: 'create-club/:user_id/:matricule', component: CreateClubComponent },
  { path: 'president', component: PresidentComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestionjoueurs', component: GestionJoueursComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestioncoachs', component: GestionCoachsComponent, canActivate: [PresidentGuard] },
  { path: 'president/gestionequipes', component: GestionEquipesComponent, canActivate: [PresidentGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
