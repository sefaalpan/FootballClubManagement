import { Equipe } from "./equipe.model";

export interface User {
    id  ?: number;
    nom  ?: string;
    prenom  ?: string;
    naissance  ?: Date;
    email  ?: string;
    password  ?: string;
    role ?: string;
    club_id ?: number;
}

export interface President extends User{}

export interface Coach extends User{
    statut ?: string;
    equipe_id ?: number;
}

export interface Joueur extends User{
    poste ?: string;
    isBlesse ?: boolean;
    equipe_id ?: number;
}