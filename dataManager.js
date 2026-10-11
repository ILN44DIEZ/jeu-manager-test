class DataManager {

    constructor() {
        this.clubs = [];
        this.players = [];
        this.formations = [];
        this.tactics = [];
        this.loaded = false;
    }

    async loadClubs() {
        try {
            const response = await fetch("data/clubs.json");

            if (!response.ok) {
                throw new Error("Impossible de charger data/clubs.json");
            }

            this.clubs = await response.json();
            console.log("✅ Clubs chargés :", this.clubs.length);
        } catch (error) {
            console.error("❌ Erreur chargement clubs", error);
        }
    }

    async loadPlayers() {
        try {
            const response = await fetch("data/players.json");

            if (!response.ok) {
                throw new Error("Impossible de charger data/players.json");
            }

            const players = await response.json();

            if (!Array.isArray(players)) {
                throw new Error("data/players.json doit contenir une liste JSON de joueurs.");
            }

            this.players = players;

            const clubNames = new Set(this.clubs.map(club => club.nom));
            const unmatched = this.players.filter(player => !clubNames.has(player.club));

            if (unmatched.length > 0) {
                console.error(
                    "❌ Joueurs liés à un club absent de clubs.json :",
                    unmatched.map(player => player.prenom + " " + player.nom + " — " + player.club)
                );
            } else {
                console.log("✅ Tous les joueurs sont liés à un club existant.");
            }

            const requiredFields = [
                "prenom", "nom", "club", "poste", "age", "nationalite",
                "taille", "poids", "numero", "pied", "note", "potentiel",
                "forme", "moral", "fatigue", "blessure", "joursBlessure",
                "valeur", "salaire", "contratFin", "role", "experience",
                "cartonsJaunes", "cartonsRouges", "buts", "passes",
                "matchs", "minutes", "cleanSheets", "centreFormation",
                "retraite", "pret", "clubPret", "suspendu", "joursSuspension"
            ];

            const missingFields = this.players.filter(player =>
                requiredFields.some(field => !(field in player))
            );

            const validPositions = new Set([
                "GB", "G", "DD", "DG", "DC", "DCD", "DCG", "MDC",
                "MC", "MOC", "MD", "MG", "AD", "AG", "BU"
            ]);

            const invalidPositions = this.players.filter(
                player => !validPositions.has(player.poste)
            );

            const clubsWithoutPlayers = this.clubs
                .filter(club => !this.players.some(player => player.club === club.nom))
                .map(club => club.nom);

            console.log(
                "✅ Joueurs chargés :", this.players.length,
                "| Clubs sans effectif :", clubsWithoutPlayers.length,
                "| Liens club invalides :", unmatched.length,
                "| Joueurs avec champs manquants :", missingFields.length,
                "| Postes invalides :", invalidPositions.length
            );

            if (clubsWithoutPlayers.length) {
                console.warn("⚠️ Clubs sans joueur :", clubsWithoutPlayers);
            }
            if (missingFields.length) {
                console.warn("⚠️ Joueurs avec champs manquants :", missingFields);
            }
            if (invalidPositions.length) {
                console.warn("⚠️ Joueurs avec poste invalide :", invalidPositions);
            }
        } catch (error) {
            console.error("❌ Erreur chargement joueurs", error);
        }
    }

    async loadFormations() {
        try {
            const response = await fetch("data/formations.json");

            if (!response.ok) {
                throw new Error("Impossible de charger data/formations.json");
            }

            this.formations = await response.json();
            console.log("✅ Formations chargées :", this.formations.length);
        } catch (error) {
            console.error("❌ Erreur chargement formations", error);
        }
    }

    async loadTactics() {
        try {
            const response = await fetch("data/tactics.json");

            if (!response.ok) {
                throw new Error("Impossible de charger data/tactics.json");
            }

            this.tactics = await response.json();
            console.log("✅ Styles tactiques chargés :", this.tactics.length);
        } catch (error) {
            console.error("❌ Erreur chargement tactiques", error);
        }
    }

    async loadAllData() {
        await this.loadClubs();
        await this.loadPlayers();
        await this.loadFormations();
        await this.loadTactics();

        this.loaded = true;
        console.log("✅ Toutes les données sont chargées");
    }

    getLeagues() {
        const leagues = [];

        this.clubs.forEach(club => {
            if (!leagues.includes(club.ligue)) {
                leagues.push(club.ligue);
            }
        });

        return leagues;
    }

    getClubsByLeague(league) {
        return this.clubs.filter(club => club.ligue === league);
    }

    getClub(name) {
        return this.clubs.find(club => club.nom === name);
    }

    getPlayersByClub(clubName) {
        return this.players.filter(player => player.club === clubName);
    }

    getFormation(name) {
        console.log("Toutes les formations :", this.formations);
        console.log("Recherche :", name);
        return this.formations.find(formation => formation.nom === name);
    }

    getAllFormations() {
        return this.formations;
    }

    getTactic(name) {
        return this.tactics.find(tactic => tactic.nom === name);
    }

    getAllTactics() {
        return this.tactics;
    }

}