class ChampionshipCalendar {

    constructor(teams) {

        this.teams = [
            ...teams
        ];

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


        const totalRounds =
            teams.length - 1;


        const matchesPerRound =
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

            const matches = [];


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
                    home === "Exempt" ||
                    away === "Exempt"
                ) {

                    continue;

                }


                matches.push({

                    home:
                        home,

                    away:
                        away,

                    played:
                        false,

                    result:
                        null

                });

            }


            this.matchdays.push({

                day:
                    round + 1,

                matches:
                    matches,

                played:
                    false,

                results:
                    []

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
    /* MÉLANGE DOMICILE / EXTÉRIEUR */
    /* ================================================= */

    randomizeHomeAway() {

        for (
            let i = 0;
            i < this.matchdays.length;
            i++
        ) {

            const day =
                this.matchdays[i];


            day.matches.forEach(
                match => {

                    if (
                        Math.random() < 0.5
                    ) {

                        const oldHome =
                            match.home;


                        match.home =
                            match.away;


                        match.away =
                            oldHome;

                    }

                }
            );

        }


        return this.matchdays;

    }



    /* ================================================= */
    /* ÉQUILIBRAGE DOMICILE / EXTÉRIEUR */
    /* ================================================= */

    balanceHomeAway() {

        const maxConsecutive =
            2;


        const teamState = {};


        this.teams.forEach(
            team => {

                teamState[team] = {

                    last:
                        null,

                    consecutive:
                        0

                };

            }
        );


        /*
         * On ne travaille que sur les
         * journées aller ici.
         */

        const firstHalf =
            this.matchdays.slice(
                0,
                this.teams.length - 1
            );


        firstHalf.forEach(
            day => {

                day.matches.forEach(
                    match => {

                        const homeState =
                            teamState[
                                match.home
                            ];


                        const awayState =
                            teamState[
                                match.away
                            ];


                        if (
                            homeState &&
                            homeState.last === "home" &&
                            homeState.consecutive >=
                                maxConsecutive
                        ) {

                            this.swapMatch(
                                match
                            );

                        }

                        else if (
                            awayState &&
                            awayState.last === "away" &&
                            awayState.consecutive >=
                                maxConsecutive
                        ) {

                            this.swapMatch(
                                match
                            );

                        }


                        this.updateTeamState(

                            teamState[
                                match.home
                            ],

                            "home"

                        );


                        this.updateTeamState(

                            teamState[
                                match.away
                            ],

                            "away"

                        );

                    }
                );

            }
        );


        return this.matchdays;

    }



    /* ================================================= */
    /* INVERSER DOMICILE / EXTÉRIEUR */
    /* ================================================= */

    swapMatch(match) {

        const oldHome =
            match.home;


        match.home =
            match.away;


        match.away =
            oldHome;

    }



    /* ================================================= */
    /* ÉTAT D'UNE ÉQUIPE */
    /* ================================================= */

    updateTeamState(
        state,
        location
    ) {

        if (!state) {

            return;

        }


        if (
            state.last ===
            location
        ) {

            state.consecutive++;

        }

        else {

            state.last =
                location;

            state.consecutive =
                1;

        }

    }



    /* ================================================= */
    /* GÉNÉRATION DES MATCHS RETOUR */
    /* ================================================= */

    generateReturnMatches() {

        const firstHalf =
            this.matchdays.slice();


        const returnMatches =
            firstHalf.map(
                day => ({

                    day:
                        day.day,

                    matches:
                        day.matches.map(
                            match => ({

                                home:
                                    match.away,

                                away:
                                    match.home,

                                played:
                                    false,

                                result:
                                    null

                            })
                        ),

                    played:
                        false,

                    results:
                        []

                })
            );


        /*
         * Mélange uniquement les journées
         * retour.
         *
         * Elles resteront toutes après
         * la 19e journée.
         */

        for (
            let i =
                returnMatches.length - 1;

            i > 0;

            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            const temp =
                returnMatches[i];


            returnMatches[i] =
                returnMatches[
                    randomIndex
                ];


            returnMatches[
                randomIndex
            ] =
                temp;

        }


        const firstHalfLength =
            firstHalf.length;


        returnMatches.forEach(
            (day, index) => {

                day.day =
                    firstHalfLength +
                    index +
                    1;

            }
        );


        this.matchdays = [

            ...firstHalf,

            ...returnMatches

        ];


        return this.matchdays;

    }



    /* ================================================= */
    /* CALENDRIER COMPLET */
    /* ================================================= */

    generateFullCalendar() {

        /*
         * 1. Générer les 19 journées aller
         */

        this.generateCalendar();


        /*
         * 2. Mélanger les domiciles/extérieurs
         *    de l'aller
         */

        this.randomizeHomeAway();


        /*
         * 3. Éviter les longues séries
         */

        this.balanceHomeAway();


        /*
         * 4. Créer les retours
         *    puis les mélanger
         */

        this.generateReturnMatches();


        /*
         * Numérotation finale
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
    /* OBTENIR UNE JOURNÉE */
    /* ================================================= */

    getMatchday(dayNumber) {

        return this.matchdays.find(
            day =>
                day.day ===
                dayNumber
        );

    }



    /* ================================================= */
    /* PROCHAINE JOURNÉE NON JOUÉE */
    /* ================================================= */

    getNextMatchday() {

        return this.matchdays.find(
            day =>
                day.played !== true
        );

    }



    /* ================================================= */
    /* MATCHS D'UN CLUB */
    /* ================================================= */

    getClubMatches(clubName) {

        const matches = [];


        this.matchdays.forEach(
            day => {

                day.matches.forEach(
                    match => {

                        if (
                            match.home ===
                            clubName ||

                            match.away ===
                            clubName
                        ) {

                            matches.push({

                                day:
                                    day.day,

                                home:
                                    match.home,

                                away:
                                    match.away,

                                played:
                                    match.played,

                                result:
                                    match.result

                            });

                        }

                    }
                );

            }
        );


        return matches;

    }



    /* ================================================= */
    /* TOTAL JOURNÉES */
    /* ================================================= */

    getTotalMatchdays() {

        return this.matchdays.length;

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

                        if (
                            match.played &&
                            match.result
                        ) {

                            console.log(

                                match.home +
                                " " +
                                match.result.homeGoals +
                                " - " +
                                match.result.awayGoals +
                                " " +
                                match.away

                            );

                        }

                        else {

                            console.log(

                                match.home +
                                " - " +
                                match.away

                            );

                        }

                    }
                );

            }
        );

    }

}
