import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { ClubComponent } from './components/club/club.component';
import { PresidentComponent } from './components/president/president.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';
import { PresidentGuard } from './guards/president.guard';
import { GestionJoueursComponent } from './components/president/gestion-joueurs/gestion-joueurs.component';
import { GestionCoachsComponent } from './components/president/gestion-coachs/gestion-coachs.component';
import { GestionEquipesComponent } from './components/president/gestion-equipes/gestion-equipes.component';
import { CreateClubComponent } from './components/create-club/create-club.component';
import { IndexComponent } from './index/index.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { CompteComponent } from './components/compte/compte.component';
import { ManagePlayersComponent } from './components/coach/manage-players/manage-players.component';
import { PlayerComponent } from './components/player/player.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    HomeComponent,
    ClubComponent,
    PresidentComponent,
    GestionJoueursComponent,
    GestionCoachsComponent,
    GestionEquipesComponent,
    CreateClubComponent,
    IndexComponent,
    InscriptionComponent,
    CompteComponent,
    ManagePlayersComponent,
    PlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [UserService, AuthGuard, PresidentGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
