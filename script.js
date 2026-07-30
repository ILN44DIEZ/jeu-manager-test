let game = {};



function startGame() {


    console.log(
        "⚽ Manager Career démarré"
    );


    // Création interface

    game.ui = new UI();



    // Création manager

    game.manager = {

        clubName: "Nouveau Club",

        budget: 10000000,

        reputation: 50,

        season: 1,

        objectives: []

    };



    // Création effectif

    game.squad = new Squad(
        "Premier effectif"
    );



    // Création tactique

    game.tactics = new Tactics();



    // Marché des transferts

    game.market =
        new TransferMarket(
            game.manager.clubName,
            game.manager.budget
        );



    // Sauvegarde

    game.save =
        new SaveManager();



    // Affichage

    game.ui.showManager(
        game.manager
    );



    console.log(
        "Jeu prêt"
    );

}



// Lancement automatique

window.onload = () => {

    startGame();

};