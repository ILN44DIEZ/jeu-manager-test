let game = {};



function chooseClub(club) {


    console.log(
        "Club sélectionné :",
        club.nom
    );


    let selectedClub = {

        name: club.nom,

        budget: club.budget,

        reputation: club.niveau

    };


    game.manager.startCareer(

        "Nouvel Entraîneur",

        selectedClub

    );


    game.ui.showManager({

        managerName:
            game.manager.managerName,

        clubName:
            game.manager.getClubName(),

        budget:
            game.manager.budget,

        reputation:
            game.manager.reputation,

        season:
            game.manager.season,

        objectives:
            game.manager.objectives

    });

}

async function startGame() {


    console.log(
        "⚽ Manager Career démarré"
    );


    // Interface

    game.ui = new UI();



    // Données

    game.data =
        new DataManager();


    await game.data.loadClubs();



    console.log(
        "Ligues disponibles :",
        game.data.getLeagues()
    );



    // Création carrière manager

    game.manager =
        new ManagerCareer();



    // Club temporaire

    let club = {

        name: "Nouveau Club",

        budget: 10000000,

        reputation: 50

    };



    game.manager.startCareer(

        "Nouvel Entraîneur",

        club

    );



    // Effectif

    game.squad =
        new Squad(
            "Premier effectif"
        );



    // Tactique

    game.tactics =
        new Tactics();



    // Marché transferts

    game.market =
        new TransferMarket(

            game.manager.getClubName(),

            game.manager.budget

        );



    // Sauvegarde

    game.save =
        new SaveManager();



    // Affichage actuel : choix de ligue

    game.ui.showLeagueSelection(
        game.data
    );



    console.log(
        "Jeu prêt"
    );

}



window.onload = () => {

    startGame();

};