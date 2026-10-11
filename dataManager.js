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

        try {

            const [response, ligue1Response] = await Promise.all([
                fetch("data/players.json"),
                fetch("data/players_ligue1.json").catch(() => null)
            ]);

            this.players = await response.json();

            if (ligue1Response && ligue1Response.ok) {
                const ligue1Players = await ligue1Response.json();
                this.players = this.players.concat(ligue1Players);
            }


            console.log(
                "✅ Joueurs chargés :",
                this.players.length
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