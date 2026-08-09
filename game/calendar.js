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


        /* ========================= */
        /* NOMBRE IMPAIR */
        /* ========================= */

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

                const home =
                    rotation[i];


                const away =
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


            /* ========================= */
            /* ROTATION */
            /* ========================= */

            rotation.splice(

                1,

                0,

                rotation.pop()

            );

        }


        return this.matchdays;

    }



    /* ================================================= */
    /* MÉLANGE ALÉATOIRE DOMICILE / EXTÉRIEUR */
    /* ================================================= */

    randomizeHomeAway() {

        /*
         * On travaille uniquement sur
         * la première moitié du championnat.
         *
         * Le retour sera automatiquement
         * l'inverse.
         */


        for (
            let i = 0;
            i < this.matchdays.length;
            i++
        ) {

            const day =
                this.matchdays[i];


            day.matches.forEach(
                match => {

                    /*
                     * 50 % de chance d'inverser
                     * le domicile.
                     */

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


        this.matchdays.forEach(
            day => {

                day.matches.forEach(
                    match => {

                        const home =
                            match.home;


                        const away =
                            match.away;


                        const homeState =
                            teamState[home];


                        const awayState =
                            teamState[away];


                        /*
                         * Si l'équipe à domicile
                         * vient déjà d'avoir deux
                         * domiciles consécutifs,
                         * on inverse.
                         */

                        if (
                            homeState &&
                            homeState.last === "home" &&
                            homeState.consecutive >= maxConsecutive
                        ) {

                            this.swapMatch(
                                match
                            );

                        }


                        /*
                         * Même principe pour
                         * l'équipe extérieure.
                         */

                        else if (
                            awayState &&
                            awayState.last === "away" &&
                            awayState.consecutive >= maxConsecutive
                        ) {

                            this.swapMatch(
                                match
                            );

                        }


                        /* ========================= */
                        /* MISE À JOUR */
                        /* ========================= */

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
    /* MISE À JOUR ÉQUIPE */
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

        } else {

            state.last =
                location;

            state.consecutive =
                1;

        }

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


        const firstHalfLength =
            this.matchdays.length;


        const returnMatches =
            firstHalf.map(
                (day, index) => ({

                    day:
                        firstHalfLength +
                        index +
                        1,

                    matches:
                        day.matches,

                    played:
                        false,

                    results:
                        []

                })
            );


        this.matchdays = [

            ...this.matchdays,

            ...returnMatches

        ];


        return this.matchdays;

    }



    /* ================================================= */
    /* CALENDRIER COMPLET */
    /* ================================================= */

    generateFullCalendar() {

        /*
         * 1. Génération aller
         */

        this.generateCalendar();


        /*
         * 2. Mélange aléatoire
         *    domicile / extérieur
         */

        this.randomizeHomeAway();


        /*
         * 3. Équilibrage
         *    des séries
         */

        this.balanceHomeAway();


        /*
         * 4. Génération retour
         */

        this.generateReturnMatches();


        /*
         * 5. Numérotation finale
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

                        } else {

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
