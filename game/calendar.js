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

                let home =
                    rotation[i];


                let away =
                    rotation[
                        rotation.length - 1 - i
                    ];


                /* ========================= */
                /* EXEMPT */
                /* ========================= */

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
                        index +
                        firstHalfLength +
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
    /* MÉLANGE DOMICILE / EXTÉRIEUR */
    /* ================================================= */

    balanceHomeAway() {

        /*
         * Pour chaque équipe, on essaie d'éviter
         * une longue série de matchs à domicile
         * ou à l'extérieur.
         *
         * On échange les domiciles des affiches
         * lorsque cela permet d'améliorer
         * l'équilibre.
         */


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
                         * Si les deux équipes ont déjà
                         * trop souvent la même position,
                         * on inverse domicile/extérieur.
                         */

                        if (
                            homeState &&
                            awayState
                        ) {

                            if (
                                homeState.last === "home" &&
                                homeState.consecutive >= maxConsecutive
                            ) {

                                this.swapMatch(
                                    match
                                );

                            } else if (
                                awayState.last === "away" &&
                                awayState.consecutive >= maxConsecutive
                            ) {

                                this.swapMatch(
                                    match
                                );

                            }

                        }


                        /* ========================= */
                        /* MISE À JOUR */
                        /* ========================= */

                        const finalHome =
                            match.home;

                        const finalAway =
                            match.away;


                        this.updateTeamState(
                            teamState[finalHome],
                            "home"
                        );


                        this.updateTeamState(
                            teamState[finalAway],
                            "away"
                        );

                    }
                );

            }
        );


        return this.matchdays;

    }



    /* ================================================= */
    /* INVERSER UN MATCH */
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

        } else {

            state.last =
                location;

            state.consecutive =
                1;

        }

    }



    /* ================================================= */
    /* RÉINITIALISER LES ÉTATS */
    /* ================================================= */

    resetBalanceState() {

        /*
         * Cette fonction est volontairement
         * disponible si le calendrier doit
         * être recalculé.
         */

        return true;

    }



    /* ================================================= */
    /* CALENDRIER COMPLET */
    /* ================================================= */

    generateFullCalendar() {

        this.generateCalendar();


        this.generateReturnMatches();


        /*
         * Mélange intelligent des domiciles
         * et extérieurs.
         */

        this.balanceHomeAway();


        /*
         * On renumérote toujours les journées
         * dans l'ordre.
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
    /* NOMBRE DE JOURNÉES */
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
