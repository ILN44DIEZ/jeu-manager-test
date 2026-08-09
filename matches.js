class MatchEngine {

    constructor(standings = null) {

        this.history = [];

        this.standings =
            standings;

    }



    /* ================================================= */
    /* CONNECTER LE CLASSEMENT */
    /* ================================================= */

    setStandings(standings) {

        this.standings =
            standings;

    }



    /* ================================================= */
    /* SIMULATION D'UN MATCH */
    /* ================================================= */

    simulateMatch(
        homeTeam,
        awayTeam
    ) {

        const homeGoals =
            Math.floor(
                Math.random() * 5
            );


        const awayGoals =
            Math.floor(
                Math.random() * 5
            );


        const result = {

            homeTeam:
                homeTeam,

            awayTeam:
                awayTeam,

            homeGoals:
                homeGoals,

            awayGoals:
                awayGoals,

            date:
                new Date().toLocaleDateString()

        };


        /* ========================= */
        /* HISTORIQUE */
        /* ========================= */

        this.history.push(
            result
        );


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        if (
            this.standings
        ) {

            this.standings.update(
                result
            );

        }


        return result;

    }



    /* ================================================= */
    /* SIMULER UNE JOURNÉE */
    /* ================================================= */

    simulateMatchday(
        matchday
    ) {

        const results = [];


        if (
            !matchday ||
            !matchday.matches
        ) {

            return results;

        }


        matchday.matches.forEach(
            match => {

                const result =
                    this.simulateMatch(

                        match.home,

                        match.away

                    );


                results.push(
                    result
                );

            }
        );


        return results;

    }



    /* ================================================= */
    /* SIMULER PLUSIEURS JOURNÉES */
    /* ================================================= */

    simulateMatchdays(
        matchdays
    ) {

        const results = [];


        if (
            !Array.isArray(
                matchdays
            )
        ) {

            return results;

        }


        matchdays.forEach(
            matchday => {

                const dayResults =
                    this.simulateMatchday(
                        matchday
                    );


                results.push(
                    ...dayResults
                );

            }
        );


        return results;

    }



    /* ================================================= */
    /* AFFICHER UN RÉSULTAT */
    /* ================================================= */

    displayResult(match) {

        console.log(

            `${match.homeTeam} ` +
            `${match.homeGoals} - ` +
            `${match.awayGoals} ` +
            `${match.awayTeam}`

        );

    }



    /* ================================================= */
    /* AFFICHER UNE JOURNÉE */
    /* ================================================= */

    displayMatchday(
        results
    ) {

        if (
            !results ||
            results.length === 0
        ) {

            return;

        }


        console.log(
            "=== RÉSULTATS ==="
        );


        results.forEach(
            match => {

                this.displayResult(
                    match
                );

            }
        );

    }



    /* ================================================= */
    /* HISTORIQUE */
    /* ================================================= */

    getHistory() {

        return this.history;

    }



    /* ================================================= */
    /* EFFACER L'HISTORIQUE */
    /* ================================================= */

    clearHistory() {

        this.history = [];

    }

}
