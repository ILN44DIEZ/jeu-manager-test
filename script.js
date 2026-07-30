// =======================
// MANAGER
// =======================

let manager = {
    club: "",
    ligue: "",
    saison: 1,
    budget: 0,
    reputation: 50,
    matchActuel: 0,
    saisonTerminee: false
};


// =======================
// DONNEES CLUBS
// =======================

let clubs = [];

let calendrier = [];


// =======================
// CHARGEMENT JSON
// =======================

async function chargerClubs(){

    const reponse = await fetch("data/clubs.json");

    clubs = await reponse.json();


    clubs.forEach(club => {

        club.points = 0;
        club.victoires = 0;
        club.nuls = 0;
        club.defaites = 0;
        club.butsPour = 0;
        club.butsContre = 0;

    });


    afficherChoixClub();

}


chargerClubs();




// =======================
// CHOIX CLUB
// =======================

function startGame(clubChoisi){


    if(manager.club !== ""){

        afficherCalendrier();

        return;

    }



    let club = clubs.find(

        c => c.nom === clubChoisi

    );


    if(!club) return;



    manager.club = club.nom;
    manager.ligue = club.ligue;
    manager.budget = club.budget;



    creerCalendrier();



    afficherCalendrier();

}



// =======================
// MENU CLUBS
// =======================

function afficherChoixClub(){


    if(manager.club !== ""){

        afficherCalendrier();

        return;

    }



    let html = `

    <h2>⚽ Nouvelle carrière</h2>

    <p>Choisis ton club</p>

    `;



    clubs.forEach(club => {


        html += `

        <button onclick="startGame('${club.nom}')">

        ${club.nom}

        <br>

        ${club.ligue}

        </button>

        `;


    });



    document.getElementById("result").innerHTML = html;

}



// =======================
// CREATION CALENDRIER
// =======================

function creerCalendrier(){


    calendrier = [];



    let clubsLigue = clubs.filter(

        club => club.ligue === manager.ligue

    );



    clubsLigue = clubsLigue.filter(

        club => club.nom !== manager.club

    );



    // Matchs aller

    clubsLigue.forEach(club => {

        calendrier.push({

            adversaire: club.nom,
            domicile: true

        });

    });



    // Matchs retour

    clubsLigue.forEach(club => {

        calendrier.push({

            adversaire: club.nom,
            domicile: false

        });

    });



}



// =======================
// AFFICHAGE CALENDRIER
// =======================

function afficherCalendrier(){


    let html = `

    <h2>🏟 Saison ${manager.saison}</h2>

    <p>Club : ${manager.club}</p>

    <p>Ligue : ${manager.ligue}</p>

    <p>Budget : ${manager.budget.toLocaleString()} €</p>

    <p>Réputation : ${manager.reputation}/100</p>


    <h3>Calendrier</h3>

    `;



    calendrier.forEach((match,index)=>{


        let statut = index < manager.matchActuel

        ? "✅"

        : "⏳";



        html += `

        <p>

        Journée ${index+1}

        :

        ${manager.club}

        -

        ${match.adversaire}

        ${statut}

        </p>

        `;


    });



    if(!manager.saisonTerminee){

        html += `

        <button onclick="jouerMatch()">

        Jouer le prochain match

        </button>

        `;

    }



    html += `

    <button onclick="afficherClassement()">

    🏆 Classement

    </button>

    `;



    document.getElementById("result").innerHTML = html;


}



// =======================
// MATCH
// =======================

function jouerMatch(){


    if(manager.matchActuel >= calendrier.length){

        finDeSaison();

        return;

    }



    let match = calendrier[manager.matchActuel];



    let monClub = clubs.find(

        c => c.nom === manager.club

    );



    let adversaire = clubs.find(

        c => c.nom === match.adversaire

    );



    let scoreMoi = Math.floor(Math.random()*5);

    let scoreAdverse = Math.floor(Math.random()*5);



    monClub.butsPour += scoreMoi;

    monClub.butsContre += scoreAdverse;



    adversaire.butsPour += scoreAdverse;

    adversaire.butsContre += scoreMoi;



    let resultat = "";



    if(scoreMoi > scoreAdverse){

        monClub.points += 3;

        monClub.victoires++;

        resultat = "✅ Victoire";

    }

    else if(scoreMoi < scoreAdverse){

        adversaire.points += 3;

        adversaire.victoires++;

        monClub.defaites++;

        resultat = "❌ Défaite";

    }

    else{

        monClub.points++;

        adversaire.points++;

        monClub.nuls++;

        adversaire.nuls++;

        resultat = "🤝 Match nul";

    }



    manager.matchActuel++;



    document.getElementById("result").innerHTML = `

    <h3>

    ${manager.club}

    ${scoreMoi}

    -

    ${scoreAdverse}

    ${adversaire.nom}

    </h3>

    <p>${resultat}</p>

    `;



    setTimeout(afficherCalendrier,1500);


}



// =======================
// CLASSEMENT
// =======================

function afficherClassement(){


    let classement = clubs.filter(

        club => club.ligue === manager.ligue

    );



    classement.sort((a,b)=>{

        if(b.points !== a.points)

            return b.points - a.points;


        return b.butsPour - b.butsContre -

               (a.butsPour - a.butsContre);

    });



    let html = `

    <h2>🏆 Classement ${manager.ligue}</h2>

    `;



    classement.forEach((club,index)=>{


        html += `

        <p>

        ${index+1}. ${club.nom}

        - ${club.points} pts

        </p>

        `;

    });



    html += `

    <button onclick="afficherCalendrier()">

    Retour

    </button>

    `;



    document.getElementById("result").innerHTML = html;


}



// =======================
// FIN SAISON
// =======================

function finDeSaison(){


    manager.saisonTerminee = true;



    let club = clubs.find(

        c => c.nom === manager.club

    );



    document.getElementById("result").innerHTML = `

    <h2>🏁 Fin de saison</h2>

    <p>

    ${club.nom}

    termine avec

    ${club.points}

    points.

    </p>


    <button onclick="nouvelleSaison()">

    Nouvelle saison

    </button>

    `;

}



// =======================
// NOUVELLE SAISON
// =======================

function nouvelleSaison(){


    manager.saison++;

    manager.matchActuel = 0;

    manager.saisonTerminee = false;


    clubs.forEach(club=>{

        club.points = 0;
        club.victoires = 0;
        club.nuls = 0;
        club.defaites = 0;
        club.butsPour = 0;
        club.butsContre = 0;

    });



    creerCalendrier();

    afficherCalendrier();

}