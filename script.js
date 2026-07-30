let game = {};

game.club = null;



function chooseClub(club) {


    console.log(
        "Club sélectionné :",
        club.nom
    );



    // Création du vrai club de carrière

    game.club = {

    name: club.nom,

    country: club.pays,

    league: club.ligue,

    level: club.niveau,

    reputation: club.niveau,

    budget: club.budget

};



    // Création de la carrière

    game.manager.startCareer(

        "Nouvel Entraîneur",

        game.club

    );



    // Marché des transferts lié au vrai club

    game.market =
        new TransferMarket(

            game.club.name,

            game.club.budget

        );



    // Affichage fiche manager

    game.ui.showManager({

        managerName:
            game.manager.managerName,


        clubName:
            game.manager.getClubName(),


        budget:
            game.manager.budget,

        country:
            game.club.country,

        league:
            game.club.league,

        level:
            game.club.level,

        reputation:
            game.manager.reputation,


        season:
            game.manager.season,


        objectives:
            game.manager.objectives

    });



    console.log(
        "Carrière créée avec :",
        game.club
    );

}





async function startGame() {


    console.log(
        "⚽ Manager Career démarré"
    );



    // Interface

    game.ui =
        new UI();



    // Chargement des données

    game.data =
        new DataManager();



    await game.data.loadClubs();



    console.log(
        "Ligues disponibles :",
        game.data.getLeagues()
    );



    // Création du manager

    game.manager =
        new ManagerCareer();



    // Effectif

    game.squad =
        new Squad(
            "Premier effectif"
        );



    // Tactique

    game.tactics =
        new Tactics();



    // Sauvegarde

    game.save =
        new SaveManager();



    // Première étape : choisir une ligue

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