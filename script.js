let game = {};

game.club = null;

game.currentSaveSlot = null;

game.currentMatchday = 0;



/* ================================================= */
/* CHOIX DU CLUB */
/* ================================================= */

function chooseClub(club) {

    game.currentSaveSlot = null;

    game.currentMatchday = 0;


    console.log(
        "Club sélectionné :",
        club.nom
    );


    // =========================
    // CLUB
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
    // MANAGER
    // =========================

    game.manager.startCareer(

        "Nouvel Entraîneur",

        game.club

    );


    // =========================
    // EFFECTIF
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
    // TACTIQUES
    // =========================

    game.tactics.initializeSquad(
        game.players
    );


    // =========================
    // CALENDRIER
    // =========================

    const leagueClubs =
        game.data.getClubsByLeague(
            game.club.league
        );


    const teams =
        leagueClubs.map(
            club => club.nom
        );


    game.calendar =
        new ChampionshipCalendar(
            teams
        );


    game.calendar.generateFullCalendar();


    console.log(
        "📅 Calendrier généré :",
        game.calendar.matchdays
    );


    // =========================
    // CLASSEMENT
    // =========================

    game.standings =
        new Standings(
            teams
        );


    // =========================
    // MATCH ENGINE
    // =========================

    game.matchEngine =
        new MatchEngine(
            game.standings
        );


    // =========================
    // TRANSFERTS
    // =========================

    game.market =
        new TransferMarket(

            game.club.name,

            game.club.budget

        );


    // =========================
    // AFFICHAGE
    // =========================

    game.ui.showManager({

        managerName:
            game.manager.managerName,

        clubName:
            game.club.name,

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


    /* ================================================= */
    /* DONNÉES DE LA PARTIE */
    /* ================================================= */

    const gameData = {

        /* ========================= */
        /* CLUB */
        /* ========================= */

        club:
            game.club,


        /* ========================= */
        /* MANAGER */
        /* ========================= */

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


        /* ========================= */
        /* JOUEURS */
        /* ========================= */

        players:
            game.players,


        /* ========================= */
        /* TACTIQUES */
        /* ========================= */

        tactics:
            game.save.getTacticsData(
                game.tactics
            ),


        /* ========================= */
        /* CALENDRIER */
        /* ========================= */

        calendar:
            game.calendar
                ? game.calendar.matchdays
                : null,


        /* ========================= */
        /* JOURNÉE ACTUELLE */
        /* ========================= */

        currentMatchday:
            game.currentMatchday,


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        standings:
            game.standings
                ? game.standings.table
                : null,


        /* ========================= */
        /* HISTORIQUE DES MATCHS */
        /* ========================= */

        matchHistory:
            game.matchEngine
                ? game.matchEngine.getHistory()
                : []

    };


    /* ================================================= */
    /* SAUVEGARDE */
    /* ================================================= */

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


    /* ================================================= */
    /* SLOT */
    /* ================================================= */

    game.currentSaveSlot =
        slot;


    /* ================================================= */
    /* CLUB */
    /* ================================================= */

    if (
        data.club
    ) {

        game.club =
            data.club;

    }


    /* ================================================= */
    /* MANAGER */
    /* ================================================= */

    if (
        data.manager
    ) {

        Object.assign(

            game.manager,

            data.manager

        );

    }


    /* ================================================= */
    /* JOUEURS */
    /* ================================================= */

    if (
        Array.isArray(
            data.players
        )
    ) {

        game.players =
            data.players;

    }


    /* ================================================= */
    /* TACTIQUES */
    /* ================================================= */

    if (
        data.tactics
    ) {

        game.save.loadTacticsData(

            game.tactics,

            data.tactics

        );

    }


    /* ================================================= */
    /* CALENDRIER */
    /* ================================================= */

    if (
        game.club
    ) {

        const leagueClubs =
            game.data.getClubsByLeague(
                game.club.league
            );


        const teams =
            leagueClubs.map(
                club => club.nom
            );


        /*
         * On recrée seulement
         * l'objet calendrier.
         *
         * On NE génère PAS
         * un nouveau calendrier.
         */

        game.calendar =
            new ChampionshipCalendar(
                teams
            );


        if (
            Array.isArray(
                data.calendar
            )
        ) {

            game.calendar.matchdays =
                data.calendar;

        } else {

            /*
             * Ancienne sauvegarde
             * sans calendrier.
             */

            game.calendar.generateFullCalendar();

        }


        console.log(
            "📅 Calendrier restauré."
        );

    }


    /* ================================================= */
    /* JOURNÉE ACTUELLE */
    /* ================================================= */

    if (
        typeof data.currentMatchday ===
        "number"
    ) {

        game.currentMatchday =
            data.currentMatchday;

    } else {

        game.currentMatchday =
            0;

    }


    /* ================================================= */
    /* CLASSEMENT */
    /* ================================================= */

    if (
        game.club
    ) {

        const leagueClubs =
            game.data.getClubsByLeague(
                game.club.league
            );


        const teams =
            leagueClubs.map(
                club => club.nom
            );


        game.standings =
            new Standings(
                teams
            );


        /*
         * On restaure le classement
         * exactement comme il était.
         */

        if (
            Array.isArray(
                data.standings
            )
        ) {

            game.standings.table =
                data.standings;

        }


        console.log(
            "🏆 Classement restauré :",
            game.standings.getTable()
        );

    }


    /* ================================================= */
    /* MATCH ENGINE */
    /* ================================================= */

    game.matchEngine =
        new MatchEngine(
            game.standings
        );


    /* ================================================= */
    /* HISTORIQUE MATCHS */
    /* ================================================= */

    if (
        Array.isArray(
            data.matchHistory
        )
    ) {

        game.matchEngine.history =
            data.matchHistory;

    }


    /* ================================================= */
    /* MARCHÉ DES TRANSFERTS */
    /* ================================================= */

    if (
        game.club
    ) {

        game.market =
            new TransferMarket(

                game.club.name,

                game.club.budget

            );

    }


    /* ================================================= */
    /* AFFICHAGE */
    /* ================================================= */

    game.ui.showManager({

        managerName:
            game.manager.managerName,

        clubName:
            game.club.name,

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
        "🏟️ Club chargé :",
        game.club.name
    );


    console.log(
        "📅 Journée actuelle :",
        game.currentMatchday
    );


    console.log(
        "⚽ Matchs joués :",
        game.matchEngine.getHistory().length
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
    // Données
    // =========================

    game.data =
        new DataManager();


    await game.data.loadAllData();


    console.log(
        "Ligues disponibles :",
        game.data.getLeagues()
    );


    // =========================
    // Manager
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
    // Tactiques
    // =========================

    game.tactics =
        new Tactics();


    game.tactics.setDataManager(
        game.data
    );


    // =========================
    // Sauvegarde
    // =========================

    game.save =
        new SaveManager();


    // =========================
    // MENU
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
