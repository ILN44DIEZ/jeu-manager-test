class DataManager {

    constructor() {

        this.clubs = [];

        this.players = [];

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

            const response =
                await fetch("data/players.json");


            this.players =
                await response.json();


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



    async loadAllData() {

        await this.loadClubs();

        await this.loadPlayers();


        this.loaded = true;


        console.log(
            "✅ Toutes les données sont chargées"
        );

    }



    getLeagues() {

        let leagues =
            [];


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


}