let game = {};

game.club = null;

game.currentSaveSlot = null;



/* ================================================= */
/* CHOIX DU CLUB */
/* ================================================= */

function chooseClub(club) {

    /*
     * Nouvelle carrière :
     * aucun slot de sauvegarde associé.
     */

    game.currentSaveSlot = null;


    console.log(
        "Club sélectionné :",
        club.nom
    );


    // =========================
    // Création du vrai club
    // =========================

    game.club = {

        name: club.nom,

        country: club.pays,

        league: club.ligue,

        level: club.niveau,

        reputation: club.niveau,

        budget: club.budget,

        logo: club.logo

    };


    // =========================
    // Création de la carrière
    // =========================

    game.manager.startCareer(

        "Nouvel Entraîneur",

        game.club

    );


    // =========================
    // Chargement de l'effectif
    // =========================

    game.players =
        game.data.getPlayersByClub(
            game.club.name
        );


    console.log(
        "Effectif chargé :",
        game.players
    );


    // =========================
    // Composition initiale
    // =========================

    game.tactics.initializeSquad(
        game.players
    );


    console.log(
        "Composition initiale :",
        game.tactics.getData()
    );


    // =========================
    // Marché des transferts
    // =========================

    game.market =
        new TransferMarket(

            game.club.name,

            game.club.budget

        );


    // =========================
    // Affichage fiche manager
    // =========================

    game.ui.showManager({

        managerName:
            game.manager.managerName,

        clubName:
            game.manager.getClubName(),

        logo:
            game.club.logo,

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



/* ================================================= */
/* SAUVEGARDER LA PARTIE */
/* ================================================= */

function saveCareer(slot = 1) {

    if (
        !game.save
    ) {

        console.error(
            "❌ SaveManager non disponible."
        );

        return false;

    }


    /*
     * =========================
     * Données de la partie
     * =========================
     */

    const gameData = {

        club:
            game.club,

        manager: {

            managerName:
                game.manager.managerName,

            season:
                game.manager.season,

            reputation:
                game.manager.reputation,

            budget:
                game.manager.budget,

            objectives:
                game.manager.objectives

        },

        players:
            game.players,

        tactics:
            game.save.getTacticsData(
                game.tactics
            )

    };


    /*
     * =========================
     * Sauvegarde
     * =========================
     */

    const success =
        game.save.saveGame(
            slot,
            gameData
        );


    if (success) {

        game.currentSaveSlot =
            slot;


        console.log(
            "💾 Carrière sauvegardée.",
            "Slot :",
            slot
        );

    }


    return success;

}



/* ================================================= */
/* CHARGER UNE PARTIE */
/* ================================================= */

function loadCareer(slot = 1) {

    if (
        !game.save
    ) {

        console.error(
            "❌ SaveManager non disponible."
        );

        return false;

    }


    const save =
        game.save.loadGame(
            slot
        );


    if (!save) {

        console.log(
            "❌ Aucune sauvegarde dans le slot",
            slot
        );

        return false;

    }


    const data =
        save.game;


    if (!data) {

        console.error(
            "❌ Données de sauvegarde invalides."
        );

        return false;

    }


    /*
     * =========================
     * SLOT ACTUEL
     * =========================
     */

    game.currentSaveSlot =
        slot;


    /*
     * =========================
     * CLUB
     * =========================
     */

    if (
        data.club
    ) {

        game.club =
            data.club;

    }


    /*
     * =========================
     * MANAGER
     * =========================
     */

    if (
        data.manager
    ) {

        Object.assign(

            game.manager,

            data.manager

        );

    }


    /*
     * =========================
     * JOUEURS
     * ========================= */

    if (
        Array.isArray(
            data.players
        )
    ) {

        game.players =
            data.players;

    }


    /*
     * =========================
     * TACTIQUES
     * =========================
     */

    if (
        data.tactics
    ) {

        game.save.loadTacticsData(

            game.tactics,

            data.tactics

        );

    }


    /*
     * =========================
     * MARCHÉ DES TRANSFERTS
     * =========================
     */

    if (
        game.club
    ) {

        game.market =
            new TransferMarket(

                game.club.name,

                game.club.budget

            );

    }


    /*
     * =========================
     * AFFICHAGE
     * =========================
     */

    game.ui.showManager({

        managerName:
            game.manager.managerName,

        clubName:
            game.manager.getClubName(),

        logo:
            game.club.logo,

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
        "📂 Carrière chargée.",
        "Slot :",
        slot
    );


    console.log(
        "⚽ Tactiques restaurées :",
        game.tactics.getData()
    );


    return true;

}



/* ================================================= */
/* SUPPRIMER UNE SAUVEGARDE */
/* ================================================= */

function deleteCareer(slot = 1) {

    if (
        !game.save
    ) {

        return false;

    }


    return game.save.deleteSave(
        slot
    );

}



/* ================================================= */
/* LISTE DES SAUVEGARDES */
/* ================================================= */

function getCareerSaves() {

    if (
        !game.save
    ) {

        return [];

    }


    return game.save.getSaveList();

}



/* ================================================= */
/* DÉMARRAGE DU JEU */
/* ================================================= */

async function startGame() {

    console.log(
        "⚽ Manager Career démarré"
    );


    // =========================
    // Interface
    // =========================

    game.ui =
        new UI();


    // =========================
    // Chargement des données
    // =========================

    game.data =
        new DataManager();


    await game.data.loadAllData();


    console.log(
        "Ligues disponibles :",
        game.data.getLeagues()
    );


    // =========================
    // Création du manager
    // =========================

    game.manager =
        new ManagerCareer();


    // =========================
    // Effectif
    // =========================

    game.squad =
        new Squad(
            "Premier effectif"
        );


    // =========================
    // Tactique
    // =========================

    game.tactics =
        new Tactics();


    // Connexion du DataManager
    // aux tactiques

    game.tactics.setDataManager(
        game.data
    );


    // =========================
    // Sauvegarde
    // =========================

    game.save =
        new SaveManager();


    // =========================
    // MENU PRINCIPAL
    // =========================

    game.ui.showMainMenu();


    console.log(
        "Jeu prêt"
    );

}



/* ================================================= */
/* LANCEMENT */
/* ================================================= */

window.onload = () => {

    startGame();

};
