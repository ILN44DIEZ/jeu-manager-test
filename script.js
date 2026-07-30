// =======================
// MANAGER
// =======================

let manager = {
    club: "",
    saison: 1,
    budget: 0,
    reputation: 50,
    matchActuel: 0,
    saisonTerminee: false
};



// =======================
// CLUBS
// =======================

let clubs = [];



// =======================
// CHARGEMENT DES CLUBS JSON
// =======================

async function chargerClubs(){

    let reponse = await fetch("data/clubs.json");

    clubs = await reponse.json();


    clubs.forEach(club => {

        club.points = 0;
        club.victoires = 0;
        club.nuls = 0;
        club.defaites = 0;
        club.buts = 0;

    });


    afficherChoixClub();

}


chargerClubs();




// =======================
// CALENDRIER
// =======================

let calendrier = [
    "Olympique de Marseille",
    "AS Monaco",
    "Olympique Lyonnais",
    "Lille OSC",
    "RC Lens",
    "OGC Nice",
    "Stade Rennais",
    "Toulouse FC"
];




// =======================
// CHOIX DU CLUB
// =======================

function startGame(clubChoisi){


    // Empêche de changer de club

    if(manager.club !== ""){

        afficherCalendrier();

        return;

    }



    manager.club = clubChoisi;



    let clubSelectionne = clubs.find(

        club => club.nom === clubChoisi

    );



    if(clubSelectionne){

        manager.budget = clubSelectionne.budget;

    }



    afficherCalendrier();

}




// =======================
// AFFICHER LES CLUBS
// =======================

function afficherChoixClub(){


    // Si club déjà choisi,
    // on ne montre plus les autres

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
// CALENDRIER
// =======================

function afficherCalendrier(){


    let html = `

    <h2>🏟 Saison ${manager.saison}</h2>

    <p>Club : ${manager.club}</p>

    <p>Budget : ${manager.budget.toLocaleString()} €</p>

    <p>Réputation : ${manager.reputation}/100</p>


    <h3>Calendrier</h3>

    `;



    calendrier.forEach((adversaire,index)=>{


        let statut = index < manager.matchActuel

        ? "✅ Terminé"

        : "⏳ À jouer";



        html += `

        <p>

        Journée ${index+1}

        :

        ${manager.club}

        - 

        ${adversaire}

        ${statut}

        </p>

        `;


    });



    html += `

    <button onclick="jouerMatch()">

    Jouer le prochain match

    </button>


    <button onclick="afficherClassement()">

    Voir classement

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



    let adversaire = calendrier[manager.matchActuel];



    let monClub = clubs.find(

        club => club.nom === manager.club

    );



    let scoreMoi = Math.floor(Math.random()*5);

    let scoreAdverse = Math.floor(Math.random()*5);



    monClub.buts += scoreMoi;



    let texte = `

    <h3>

    ${manager.club}

    ${scoreMoi}

    -

    ${scoreAdverse}

    ${adversaire}

    </h3>

    `;



    if(scoreMoi > scoreAdverse){


        monClub.points += 3;

        monClub.victoires++;

        manager.reputation += 2;


        texte += "✅ Victoire";


    }

    else if(scoreMoi < scoreAdverse){


        monClub.defaites++;

        manager.reputation -= 1;


        texte += "❌ Défaite";


    }

    else{


        monClub.points++;

        monClub.nuls++;


        texte += "🤝 Match nul";


    }



    manager.matchActuel++;



    document.getElementById("result").innerHTML = texte;



    setTimeout(afficherCalendrier,1500);


}




// =======================
// CLASSEMENT
// =======================

function afficherClassement(){


    clubs.sort((a,b)=> b.points - a.points);



    let html = `

    <h2>🏆 Classement</h2>

    `;



    clubs.slice(0,20).forEach((club,index)=>{


        html += `

        <p>

        ${index+1}. ${club.nom}

        - ${club.points} pts

        </p>

        `;


    });



    document.getElementById("result").innerHTML = html;


}




// =======================
// FIN DE SAISON
// =======================

function finDeSaison(){


    manager.saisonTerminee = true;


    let club = clubs.find(

        c => c.nom === manager.club

    );



    document.getElementById("result").innerHTML = `


    <h2>🏁 Fin de saison</h2>


    <p>

    ${manager.club}

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


    afficherCalendrier();


}