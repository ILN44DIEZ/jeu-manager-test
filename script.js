// ==================================
// FOOTBALL MANAGER GAME
// VERSION CARRIERE
// ==================================


// =======================
// DONNEES DU MANAGER
// =======================

let manager = {

    club: "",
    ligue: "",
    saison: 1,
    budget: 0,
    reputation: 50,

    journee: 0,
    saisonTerminee: false

};



// =======================
// DONNEES GENERALES
// =======================

let clubs = [];

let calendrier = [];

let resultats = [];




// =======================
// CHARGEMENT CLUBS.JSON
// =======================

async function chargerClubs(){


    try{


        let reponse = await fetch("data/clubs.json");


        clubs = await reponse.json();



        initialiserClubs();



        afficherChoixClub();


    }

    catch(erreur){


        document.getElementById("result").innerHTML = `

        <h2>❌ Erreur chargement clubs</h2>

        <p>
        Vérifie que le fichier clubs.json est bien dans :
        data/clubs.json
        </p>

        `;


        console.log(erreur);


    }


}



chargerClubs();





// =======================
// INITIALISATION CLUBS
// =======================

function initialiserClubs(){


    clubs.forEach(club=>{


        club.points = 0;

        club.victoires = 0;

        club.nuls = 0;

        club.defaites = 0;

        club.butsPour = 0;

        club.butsContre = 0;

        club.matchsJoues = 0;


    });


}




// =======================
// CHOIX DU CLUB
// =======================

function startGame(nomClub){



    if(manager.club !== ""){


        afficherCalendrier();

        return;


    }



    let club = clubs.find(

        c => c.nom === nomClub

    );



    if(!club) return;




    manager.club = club.nom;


    manager.ligue = club.ligue;


    manager.budget = club.budget;




    creerCalendrier();



    afficherCalendrier();



}






// =======================
// AFFICHAGE DES CLUBS
// =======================

function afficherChoixClub(){



    if(manager.club !== ""){


        afficherCalendrier();

        return;


    }



    let html = `


    <h2>⚽ Nouvelle carrière</h2>


    <p>
    Choisis ton club
    </p>


    `;



    clubs.forEach(club=>{


        html += `


        <button onclick="startGame('${club.nom}')">


        ${club.nom}


        <br>


        <small>${club.ligue}</small>


        </button>


        `;


    });




    document.getElementById("result").innerHTML = html;



}






// =======================
// CREATION DU CALENDRIER
// =======================

function creerCalendrier(){


    calendrier = [];

    resultats = [];



    let equipes = clubs.filter(

        club => club.ligue === manager.ligue

    );



    equipes = equipes.filter(

        club => club.nom !== manager.club

    );



    // MATCHS ALLER


    equipes.forEach(club=>{


        calendrier.push({

            adversaire: club.nom,

            domicile:true

        });



    });




    // MATCHS RETOUR


    equipes.forEach(club=>{


        calendrier.push({

            adversaire:club.nom,

            domicile:false

        });



    });



}// =======================
// AFFICHAGE CALENDRIER
// =======================

function afficherCalendrier(){


    let html = `


    <h2>🏟 Saison ${manager.saison}</h2>


    <p>
    Club : <strong>${manager.club}</strong>
    </p>


    <p>
    Championnat : ${manager.ligue}
    </p>


    <p>
    Budget : ${manager.budget.toLocaleString()} €
    </p>


    <p>
    Réputation : ${manager.reputation}/100
    </p>


    <hr>


    <h3>
    Journée ${manager.journee + 1}/${calendrier.length}
    </h3>


    `;



    if(manager.journee < calendrier.length){



        let match = calendrier[manager.journee];



        html += `


        <p>

        ${manager.club}

        🆚

        ${match.adversaire}

        </p>



        <button onclick="jouerJournee()">

        ▶ Jouer le match

        </button>


        `;



    }

    else{


        html += `


        <h3>
        🏁 Saison terminée
        </h3>


        <button onclick="afficherClassement()">

        Voir classement

        </button>


        `;


    }




    html += `


    <br><br>


    <button onclick="afficherClassement()">

    🏆 Classement

    </button>


    `;



    document.getElementById("result").innerHTML = html;


}





// =======================
// JOUER UNE JOURNEE
// =======================

function jouerJournee(){



    if(manager.journee >= calendrier.length){


        finDeSaison();


        return;


    }



    let match = calendrier[manager.journee];



    // Match du joueur

    jouerMatch(

        manager.club,

        match.adversaire

    );



    // Simulation des autres matchs

    simulerAutresMatchs();




    manager.journee++;



    afficherCalendrier();



}




// =======================
// JOUER UN MATCH
// =======================

function jouerMatch(equipe1,equipe2){



    let club1 = clubs.find(

        c=>c.nom === equipe1

    );


    let club2 = clubs.find(

        c=>c.nom === equipe2

    );



    if(!club1 || !club2) return;





    let force1 = club1.niveau || 70;

    let force2 = club2.niveau || 70;



    let score1 = Math.floor(

        Math.random()*4

    );


    let score2 = Math.floor(

        Math.random()*4

    );



    if(force1 > force2){


        if(Math.random()>0.5)

            score1++;


    }


    if(force2 > force1){


        if(Math.random()>0.5)

            score2++;


    }





    club1.matchsJoues++;

    club2.matchsJoues++;



    club1.butsPour += score1;

    club1.butsContre += score2;



    club2.butsPour += score2;

    club2.butsContre += score1;





    if(score1 > score2){


        club1.points += 3;

        club1.victoires++;

        club2.defaites++;


    }


    else if(score2 > score1){


        club2.points += 3;

        club2.victoires++;

        club1.defaites++;


    }


    else{


        club1.points++;

        club2.points++;


        club1.nuls++;

        club2.nuls++;


    }



    resultats.push({

        equipe1:equipe1,

        score1:score1,

        score2:score2,

        equipe2:equipe2

    });



}




// =======================
// SIMULATION DES AUTRES MATCHS
// =======================

function simulerAutresMatchs(){



    let equipes = clubs.filter(

        club=>club.ligue===manager.ligue

    );



    for(let i=0;i<equipes.length;i++){



        for(let j=i+1;j<equipes.length;j++){



            let a = equipes[i];

            let b = equipes[j];



            let dejaJoue = resultats.some(

                match =>

                (

                match.equipe1===a.nom &&

                match.equipe2===b.nom

                )

                ||

                (

                match.equipe1===b.nom &&

                match.equipe2===a.nom

                )

            );



            if(!dejaJoue){


                if(

                a.nom !== manager.club &&

                b.nom !== manager.club

                ){


                    jouerMatch(

                        a.nom,

                        b.nom

                    );


                }


            }



        }



    }



}// =======================
// CLASSEMENT
// =======================

function afficherClassement(){



    let classement = clubs.filter(

        club => club.ligue === manager.ligue

    );



    classement.sort((a,b)=>{



        if(b.points !== a.points){


            return b.points - a.points;


        }



        let differenceA = a.butsPour - a.butsContre;

        let differenceB = b.butsPour - b.butsContre;



        return differenceB - differenceA;



    });





    let html = `


    <h2>🏆 Classement ${manager.ligue}</h2>


    `;



    classement.forEach((club,index)=>{


        html += `


        <p>


        ${index+1}.

        ${club.nom}


        -

        ${club.points} pts


        |

        ⚽ ${club.butsPour}


        :


        ${club.butsContre}



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
// FIN DE SAISON
// =======================

function finDeSaison(){



    let classement = clubs.filter(

        club=>club.ligue===manager.ligue

    );



    classement.sort(

        (a,b)=>b.points-a.points

    );



    let position = classement.findIndex(

        club=>club.nom===manager.club

    ) + 1;





    if(position <= 4){


        manager.reputation += 10;


    }

    else if(position >= 17){


        manager.reputation -= 5;


    }





    document.getElementById("result").innerHTML = `



    <h2>🏁 Fin de saison</h2>


    <p>

    ${manager.club}

    termine

    ${position}e

    du championnat.

    </p>



    <p>

    Réputation :

    ${manager.reputation}/100

    </p>



    <button onclick="nouvelleSaison()">


    🔄 Nouvelle saison


    </button>


    `;




}




// =======================
// NOUVELLE SAISON
// =======================

function nouvelleSaison(){



    manager.saison++;


    manager.journee = 0;


    manager.saisonTerminee = false;



    initialiserClubs();



    creerCalendrier();



    afficherCalendrier();



}




// =======================
// SAUVEGARDE SIMPLE
// =======================

function sauvegarder(){


    localStorage.setItem(

        "carriere",

        JSON.stringify({

            manager:manager,

            clubs:clubs,

            calendrier:calendrier

        })

    );


    alert("💾 Carrière sauvegardée");


}





// =======================
// CHARGER SAUVEGARDE
// =======================

function chargerSauvegarde(){



    let sauvegarde = localStorage.getItem(

        "carriere"

    );



    if(!sauvegarde){


        alert("Aucune sauvegarde");


        return;


    }



    let data = JSON.parse(

        sauvegarde

    );



    manager = data.manager;


    clubs = data.clubs;


    calendrier = data.calendrier;



    afficherCalendrier();



}