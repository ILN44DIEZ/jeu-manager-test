// =======================
// MANAGER
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
// INITIALISER LES CLUBS
// =======================

function initialiserClubs() {

    clubs.forEach(club => {
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

function startGame(nomClub) {

    if (manager.club !== "") {
        afficherCalendrier();
        return;
    }

    let club = clubs.find(c => c.nom === nomClub);

    if (!club) return;

    manager.club = club.nom;
    manager.ligue = club.ligue;
    manager.budget = club.budget || 0;

    creerCalendrier();
    afficherCalendrier();

}