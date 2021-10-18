export interface User {
    id  ?: number;
    nom  ?: string;
    prenom  ?: string;
    naissance  ?: Date;
    email  ?: string;
    password  ?: string;
}

export interface President extends User{}

export interface Coach extends User{
    statut ?: string;
}

export interface Joueur extends User{
    poste ?: number;
    isBlesse ?: boolean;
}