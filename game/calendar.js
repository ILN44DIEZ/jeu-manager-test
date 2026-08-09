class ChampionshipCalendar {

    constructor(teams) {

        this.teams = teams;

        this.matchdays = [];

    }



    /* ================================================= */
    /* GÉNÉRATION DU CALENDRIER ALLER */
    /* ================================================= */

    generateCalendar() {

        this.matchdays = [];


        let teams = [
            ...this.teams
        ];


        if (
            teams.length % 2 !== 0
        ) {

            teams.push(
                "Exempt"
            );

        }


        let totalRounds =
            teams.length - 1;


        let matchesPerRound =
            teams.length / 2;


        let rotation =
            [
                ...teams
            ];


        for (
            let round = 0;
            round < totalRounds;
            round++
        ) {

            let matches = [];


            for (
                let i = 0;
                i < matchesPerRound;
                i++
            ) {

                let home =
                    rotation[i];


                let away =
                    rotation[
                        rotation.length - 1 - i
                    ];


                if (
                    home !== "Exempt" &&
                    away !== "Exempt"
                ) {

                    matches.push({

                        home:
                            home,

                        away:
                            away

                    });

                }

            }


            this.matchdays.push({

                day:
                    round + 1,

                matches:
                    matches

            });


            rotation.splice(

                1,

                0,

                rotation.pop()

            );

        }


        return this.matchdays;

    }



    /* ================================================= */
    /* MATCHS RETOUR */
    /* ================================================= */

    generateReturnMatches() {

        const firstHalf =
            this.matchdays.map(
                day => ({
                    day:
                        day.day,

                    matches:
                        day.matches.map(
                            match => ({

                                home:
                                    match.away,

                                away:
                                    match.home

                            })
                        )

                })
            );


        const returnMatches =
            firstHalf.map(
                day => ({

                    day:
                        day.day +
                        this.matchdays.length,

                    matches:
                        day.matches

                })
            );


        this.matchdays = [

            ...this.matchdays,

            ...returnMatches

        ];


        return this.matchdays;

    }



    /* ================================================= */
    /* MÉLANGE DES JOURNÉES */
    /* ================================================= */

    shuffleMatchdays() {

        /*
         * Mélange les journées sans modifier
         * les matchs qui se trouvent à l'intérieur.
         */

        for (
            let i =
                this.matchdays.length - 1;

            i > 0;

            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            const temp =
                this.matchdays[i];


            this.matchdays[i] =
                this.matchdays[
                    randomIndex
                ];


            this.matchdays[
                randomIndex
            ] =
                temp;

        }


        /*
         * Renumérotation des journées
         */

        this.matchdays.forEach(
            (day, index) => {

                day.day =
                    index + 1;

            }
        );


        return this.matchdays;

    }



    /* ================================================= */
    /* CALENDRIER COMPLET */
    /* ================================================= */

    generateFullCalendar() {

        this.generateCalendar();

        this.generateReturnMatches();

        this.shuffleMatchdays();


        return this.matchdays;

    }



    /* ================================================= */
    /* AFFICHAGE CONSOLE */
    /* ================================================= */

    displayCalendar() {

        console.log(
            "=== CALENDRIER ==="
        );


        this.matchdays.forEach(
            day => {

                console.log(
                    "Journée " +
                    day.day
                );


                day.matches.forEach(
                    match => {

                        console.log(

                            match.home +
                            " - " +
                            match.away

                        );

                    }
                );

            }
        );

    }

}
