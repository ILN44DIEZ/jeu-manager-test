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

            const response =
                await fetch("data/clubs.json");


            this.clubs =
                await response.json();


            console.log(
                "✅ Clubs chargés :",
                this.clubs.length
            );

        } catch(error) {

            console.error(
                "❌ Erreur chargement clubs",
                error
            );

        }

    }



    async loadPlayers() {

        const files = [
            "data/players.json",
            "data/players_seriea_extra.json",
            "data/players_seriea_ligue1_extra.json",
            "data/players_leagues_complement.json"
        ];

        try {

            const responses = await Promise.all(
                files.map(path => fetch(path))
            );

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) {
                    throw new Error("Impossible de charger " + files[i]);
                }
            }

            const datasets = await Promise.all(
                responses.map(response => response.json())
            );

            this.players = datasets.flat();

            // Vérifie que chaque joueur est lié à un club existant
            // en utilisant le nom exact défini dans data/clubs.json.
            const clubNames = new Set(
                this.clubs.map(club => club.nom)
            );

            const unmatched = this.players.filter(
                player => !clubNames.has(player.club)
            );

            if (unmatched.length > 0) {
                console.error(
                    "❌ Joueurs liés à un club absent de clubs.json :",
                    unmatched.map(player => player.prenom + " " + player.nom + " — " + player.club)
                );
            } else {
                console.log(
                    "✅ Tous les joueurs sont liés à un club existant."
                );
            }

            const duplicateKeys = new Set();
            const seen = new Set();

            this.players.forEach(player => {
                const key = player.prenom + "|" + player.nom + "|" + player.club;
                if (seen.has(key)) duplicateKeys.add(key);
                seen.add(key);
            });

            if (duplicateKeys.size > 0) {
                console.warn(
                    "⚠️ Doublons exacts prénom/nom/club :",
                    [...duplicateKeys]
                );
            }

            const clubsWithoutPlayers = this.clubs
                .filter(club => !this.players.some(player => player.club === club.nom))
                .map(club => club.nom);

            if (clubsWithoutPlayers.length > 0) {
                console.warn(
                    "⚠️ Clubs sans joueur dans la base :",
                    clubsWithoutPlayers
                );
            } else {
                console.log("✅ Les 97 clubs possèdent au moins un joueur.");
            }

            console.log(
                "✅ Joueurs chargés :",
                this.players.length,
                "| Clubs sans effectif :",
                clubsWithoutPlayers.length,
                "| Liens club invalides :",
                unmatched.length,
                "| Doublons exacts :",
                duplicateKeys.size
            );

        } catch(error) {

            console.error(
                "❌ Erreur chargement joueurs",
                error
            );

        }

    }



    async loadFormations() {

        try {

            const response =
                await fetch("data/formations.json");


            this.formations =
                await response.json();


            console.log(
                "✅ Formations chargées :",
                this.formations.length
            );

        } catch(error) {

            console.error(
                "❌ Erreur chargement formations",
                error
            );

        }

    }



    async loadTactics() {

        try {

            const response =
                await fetch("data/tactics.json");


            this.tactics =
                await response.json();


            console.log(
                "✅ Styles tactiques chargés :",
                this.tactics.length
            );

        } catch(error) {

            console.error(
                "❌ Erreur chargement tactiques",
                error
            );

        }

    }



    async loadAllData() {

        await this.loadClubs();

        await this.loadPlayers();

        await this.loadFormations();

        await this.loadTactics();


        this.loaded = true;


        console.log(
            "✅ Toutes les données sont chargées"
        );

    }



    getLeagues() {

        let leagues = [];


        this.clubs.forEach(club => {

            if (!leagues.includes(club.ligue)) {

                leagues.push(
                    club.ligue
                );

            }

        });


        return leagues;

    }



    getClubsByLeague(league) {

        return this.clubs.filter(

            club =>
                club.ligue === league

        );

    }



    getClub(name) {

        return this.clubs.find(

            club =>
                club.nom === name

        );

    }



    getPlayersByClub(clubName) {

        return this.players.filter(

            player =>
                player.club === clubName

        );

    }



    getFormation(name) {

    console.log(
        "Toutes les formations :",
        this.formations
    );

    console.log(
        "Recherche :",
        name
    );

    return this.formations.find(

        formation =>
            formation.nom === name

    );

}



    getAllFormations() {

        return this.formations;

    }



    getTactic(name) {

        return this.tactics.find(

            tactic =>
                tactic.nom === name

        );

    }



    getAllTactics() {

        return this.tactics;

    }

}