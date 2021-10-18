

export abstract class User {
    static idd : number = 1;
    id  !: number;
    nom  !: string;
    prenom  !: string;
    naissance  !: Date;
    email  !: string;
    password  !: string;
}

export class President extends User {

    // constructor(email:string, password:string){
    //     super();
    //     super.id = User.idd++;
    //     // super.id = id;
    //     super.email = email;
    //     super.password=password;
    // }

    constructor(nom:string,prenom:string,naissance:Date,email:string,password:string){
        super();
        super.id = User.idd++;
        super.nom = nom;
        super.prenom=prenom;
        super.naissance=naissance;
        super.email=email;
        super.password=password;
    }
}

export class Coach  extends User {
    statut !: string;
    constructor(nom:string,prenom:string,naissance:Date,email:string,password:string, statut:string){
        super();
        super.id = User.idd++;
        super.nom = nom;
        super.prenom=prenom;
        super.naissance=naissance;
        super.email=email;
        super.password=password;
        this.statut = statut;
    }
}

export class Joueur extends User {
    poste !: number;
    isBlesse !: boolean;
    constructor(nom:string,prenom:string,naissance:Date,email:string,password:string, poste:number, isBlesse:boolean){
        super();
        super.id = User.idd++;
        super.nom = nom;
        super.prenom=prenom;
        super.naissance=naissance;
        super.email=email;
        super.password=password;
        this.poste=poste;
        this.isBlesse=isBlesse;
    }
}