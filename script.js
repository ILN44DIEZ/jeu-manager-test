let game = {};



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