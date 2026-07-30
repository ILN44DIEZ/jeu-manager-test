class DataManager {

    constructor() {

        this.clubs = [];

        this.loaded = false;

    }



    async loadClubs() {

        try {

            const response =
                await fetch("data/clubs.json");


            this.clubs =
                await response.json();


            this.loaded = true;


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


}