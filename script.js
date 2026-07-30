let game = {};



function startGame() {


    console.log(
        "⚽ Manager Career démarré"
    );


    // Interface

    game.ui = new UI();



    // Création carrière manager

    game.manager =
        new ManagerCareer();



    // Club temporaire (sera remplacé par clubs.json)

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



    // Affichage

    game.ui.showManager({

        clubName:
            game.manager.getClubName(),

        budget:
            game.manager.budget,

        reputation:
            game.manager.reputation

    });



    console.log(
        "Jeu prêt"
    );

}



window.onload = () => {

    startGame();

};