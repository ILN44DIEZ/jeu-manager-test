// =====================================
// FOOTBALL MANAGER
// MOTEUR CARRIERE COMPLET
// PARTIE 1/4
// =====================================


// =======================
// DONNEES MANAGER
// =======================

let manager = {

    club: "",
    ligue: "",

    saison: 1,

    budget: 0,

    reputation: 50,

    journee: 0,

    sauvegardeExiste: false

};




// =======================
// DONNEES DU JEU
// =======================

let clubs = [];

let calendrier = [];

let historiqueMatchs = [];





// =======================
// CHARGEMENT CLUBS.JSON
// =======================

async function chargerClubs(){


    try{


        let reponse = await fetch("data/clubs.json");


        clubs = await reponse.json();



        initialiserClubs();



        afficherChoixClub();



    } catch(error){



        document.getElementById("result").innerHTML = `

        <h2>❌ Erreur</h2>

        <p>
        Impossible de charger clubs.json
        </p>

        `;


        console.log(error);



    }


}



chargerClubs();





// =======================
// INITIALISER LES CLUBS
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



    // Impossible de changer de club

    if(manager.club !== ""){


        afficherCalendrier();


        return;


    }



    let club = clubs.find(

        c=>c.nom === nomClub

    );



    if(!club){

        return;

    }





    manager.club = club.nom;


    manager.ligue = club.ligue;


    manager.budget = club.budget || 0;





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
    Choisis ton club :
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



}// =====================================
// PARTIE 2/4
// CREATION DU VRAI CALENDRIER
// =====================================



// =======================
// CREATION CHAMPIONNAT
// =======================

function creerCalendrier(){


    calendrier = [];

    historiqueMatchs = [];



    let equipes = clubs.filter(

        club => club.ligue === manager.ligue

    );



    // Création matchs aller

    let aller = genererJournees(equipes);



    // Création matchs retour

    let retour = aller.map(journee=>{


        return journee.map(match=>{


            return {


                domicile: match.exterieur,


                exterieur: match.domicile



            };


        });


    });




    calendrier = aller.concat(retour);



}






// =======================
// GENERATEUR DE JOURNEES
// =======================

function genererJournees(equipes){



    let liste = [...equipes];



    // Ajout équipe fictive si nombre impair

    if(liste.length % 2 !== 0){


        liste.push({

            nom:"Repos"

        });


    }




    let totalEquipes = liste.length;


    let nombreJournees = totalEquipes - 1;


    let matchsParJournee = totalEquipes / 2;



    let journees = [];




    for(let jour = 0; jour < nombreJournees; jour++){



        let matchs = [];



        for(

        let i = 0;

        i < matchsParJournee;

        i++

        ){



            let equipe1 = liste[i];

            let equipe2 = liste[totalEquipes - 1 - i];



            if(

            equipe1.nom !== "Repos"

            &&

            equipe2.nom !== "Repos"

            ){



                matchs.push({



                    domicile:equipe1.nom,


                    exterieur:equipe2.nom



                });



            }



        }





        journees.push(matchs);




        // Rotation type championnat

        let derniere = liste.pop();


        liste.splice(1,0,derniere);



    }




    return journees;



}







// =======================
// AFFICHAGE CALENDRIER
// =======================

function afficherCalendrier(){



    let html = `



    <h2>🏟 Saison ${manager.saison}</h2>


    <p>

    Club :

    <strong>${manager.club}</strong>

    </p>



    <p>

    Championnat :

    ${manager.ligue}

    </p>




    <p>

    Journée :

    ${manager.journee + 1}

    / ${calendrier.length}

    </p>




    <hr>



    <h3>

    📅 Prochaine journée

    </h3>



    `;





    let journeeActuelle = calendrier[manager.journee];





    if(journeeActuelle){



        journeeActuelle.forEach(match=>{



            html += `


            <p>


            ${match.domicile}


            🆚


            ${match.exterieur}


            </p>


            `;



        });






        html += `



        <button onclick="jouerJournee()">



        ▶ Jouer la journée



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



}// =====================================
// PARTIE 3/4
// MATCHS + CLASSEMENT EVOLUTIF
// =====================================



// =======================
// JOUER UNE JOURNEE
// =======================

function jouerJournee(){


    let matchs = calendrier[manager.journee];



    if(!matchs){


        finDeSaison();


        return;


    }




    matchs.forEach(match=>{


        jouerMatch(

            match.domicile,

            match.exterieur

        );


    });





    manager.journee++;





    afficherCalendrier();



}







// =======================
// GENERATION RESULTAT MATCH
// =======================

function jouerMatch(equipe1,equipe2){



    let club1 = clubs.find(

        c=>c.nom === equipe1

    );


    let club2 = clubs.find(

        c=>c.nom === equipe2

    );



    if(!club1 || !club2){

        return;

    }





    let niveau1 = club1.note || 75;

    let niveau2 = club2.note || 75;





    let score1 = Math.floor(

        Math.random()*4

    );


    let score2 = Math.floor(

        Math.random()*4

    );





    // Influence légère du niveau

    if(niveau1 > niveau2){


        if(Math.random() > 0.5){

            score1++;

        }


    }



    if(niveau2 > niveau1){


        if(Math.random() > 0.5){

            score2++;

        }


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





    historiqueMatchs.push({



        equipe1:equipe1,


        score1:score1,


        score2:score2,


        equipe2:equipe2



    });



}







// =======================
// CLASSEMENT
// =======================

function afficherClassement(){



    let classement = clubs.filter(

        club=>club.ligue === manager.ligue

    );





    classement.sort((a,b)=>{



        if(b.points !== a.points){



            return b.points - a.points;



        }





        let differenceA =

        a.butsPour - a.butsContre;




        let differenceB =

        b.butsPour - b.butsContre;




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



        <br>



        ⚽ ${club.butsPour}

        -


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



}// =====================================
// PARTIE 4/4
// FIN DE SAISON + SAUVEGARDE
// =====================================



// =======================
// FIN DE SAISON
// =======================

function finDeSaison(){



    let classement = clubs.filter(

        club=>club.ligue === manager.ligue

    );



    classement.sort((a,b)=>{


        if(b.points !== a.points){


            return b.points-a.points;


        }


        return (

            (b.butsPour-b.butsContre)

            -

            (a.butsPour-a.butsContre)

        );


    });





    let position = classement.findIndex(

        club=>club.nom === manager.club

    ) + 1;





    if(position <= 4){


        manager.reputation += 10;


    }

    else if(position >= classement.length-2){


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





    initialiserClubs();



    creerCalendrier();




    afficherCalendrier();



}






// =======================
// SAUVEGARDE
// =======================

function sauvegarder(){



    let sauvegarde = {



        manager:manager,


        clubs:clubs,


        calendrier:calendrier,


        historique:historiqueMatchs



    };





    localStorage.setItem(

        "football_manager_save",

        JSON.stringify(sauvegarde)

    );



    alert("💾 Carrière sauvegardée");



}







// =======================
// CHARGER UNE CARRIERE
// =======================

function chargerSauvegarde(){



    let sauvegarde = localStorage.getItem(

        "football_manager_save"

    );





    if(!sauvegarde){


        alert("Aucune sauvegarde trouvée");


        return;


    }





    let data = JSON.parse(

        sauvegarde

    );





    manager = data.manager;



    clubs = data.clubs;



    calendrier = data.calendrier;



    historiqueMatchs = data.historique || [];





    afficherCalendrier();



}