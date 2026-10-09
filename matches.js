
class MatchEngine {

    constructor(standings = null) {

        this.history = [];

        this.standings = standings;

        // Effectifs associés à chaque club
        this.teamPlayers = {};

    }


    /* ================================================= */
    /* CONNECTER LE CLASSEMENT */
    /* ================================================= */

    setStandings(standings) {

        this.standings = standings;

    }


    /* ================================================= */
    /* CONNECTER LES EFFECTIFS */
    /* ================================================= */

    setTeamPlayers(teamName, players) {

        if (!teamName || !Array.isArray(players)) {
            return false;
        }

        this.teamPlayers[teamName] = players;

        return true;

    }


    setSquads(squads) {

        if (!squads || typeof squads !== "object") {
            return false;
        }

        Object.keys(squads).forEach(teamName => {

            if (Array.isArray(squads[teamName])) {
                this.teamPlayers[teamName] = squads[teamName];
            }

        });

        return true;

    }


    /* ================================================= */
    /* OUTILS JOUEURS */
    /* ================================================= */

    getPlayerName(player) {

        if (!player) {
            return null;
        }

        const firstName =
            player.prenom ||
            player.firstName ||
            player.firstname ||
            "";

        const lastName =
            player.nom ||
            player.lastName ||
            player.lastname ||
            "";

        const fullName =
            (firstName + " " + lastName).trim();

        if (fullName) {
            return fullName;
        }

        if (player.name) {
            return player.name;
        }

        return null;

    }


    getScorer(teamName) {

        const players =
            this.teamPlayers[teamName] || [];

        if (!Array.isArray(players) || players.length === 0) {
            return null;
        }

        // Privilégier les joueurs offensifs
        const attackingPlayers = players.filter(player => {

            const position = String(
                player.poste ||
                player.position ||
                ""
            ).toUpperCase();

            return [
                "BU", "AC", "AG", "AD", "AV",
                "MOC", "MC", "MG", "MD"
            ].includes(position);

        });

        const candidates =
            attackingPlayers.length > 0
                ? attackingPlayers
                : players;

        const player =
            candidates[
                Math.floor(Math.random() * candidates.length)
            ];

        return this.getPlayerName(player);

    }


    /* ================================================= */
    /* GÉNÉRER LES ÉVÉNEMENTS DE BUTS */
    /* ================================================= */

    generateGoalEvents(
        homeTeam,
        awayTeam,
        homeGoals,
        awayGoals
    ) {

        const events = [];
        const usedMinutes = new Set();

        const getMinute = () => {

            let minute;

            do {

                minute =
                    Math.floor(Math.random() * 90) + 1;

            } while (usedMinutes.has(minute));

            usedMinutes.add(minute);

            return minute;

        };


        // Générer les buts de l'équipe à domicile
        for (let i = 0; i < homeGoals; i++) {

            const scorer =
                this.getScorer(homeTeam);

            events.push({

                minute: getMinute(),

                type: "goal",

                team: homeTeam,

                scorer:
                    scorer || "Buteur non renseigné",

                description:
                    "⚽ But de " +
                    (scorer || "buteur non renseigné")

            });

        }


        // Générer les buts de l'équipe à l'extérieur
        for (let i = 0; i < awayGoals; i++) {

            const scorer =
                this.getScorer(awayTeam);

            events.push({

                minute: getMinute(),

                type: "goal",

                team: awayTeam,

                scorer:
                    scorer || "Buteur non renseigné",

                description:
                    "⚽ But de " +
                    (scorer || "buteur non renseigné")

            });

        }


        // Classer les événements par minute
        events.sort((a, b) => a.minute - b.minute);


        // Calculer le score après chaque but
        let currentHomeGoals = 0;
        let currentAwayGoals = 0;

        events.forEach(event => {

            if (event.team === homeTeam) {

                currentHomeGoals++;

            } else {

                currentAwayGoals++;

            }

            event.score =
                currentHomeGoals +
                " - " +
                currentAwayGoals;

        });

        return events;

    }


    /* ================================================= */
    /* SIMULATION D'UN MATCH */
    /* ================================================= */

    simulateMatch(homeTeam, awayTeam) {

        const homeGoals =
            Math.floor(Math.random() * 5);

        const awayGoals =
            Math.floor(Math.random() * 5);


        const events =
            this.generateGoalEvents(
                homeTeam,
                awayTeam,
                homeGoals,
                awayGoals
            );


        const result = {

            homeTeam: homeTeam,

            awayTeam: awayTeam,

            homeGoals: homeGoals,

            awayGoals: awayGoals,

            events: events,

            date: new Date().toLocaleDateString()

        };


        /* ========================= */
        /* HISTORIQUE */
        /* ========================= */

        this.history.push(result);


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        if (this.standings) {

            this.standings.update(result);

        }

        return result;

    }


    /* ================================================= */
    /* SIMULER UNE JOURNÉE */
    /* ================================================= */

    simulateMatchday(matchday) {

        const results = [];

        if (
            !matchday ||
            !Array.isArray(matchday.matches)
        ) {

            return results;

        }


        /* ========================= */
        /* JOURNÉE DÉJÀ JOUÉE */
        /* ========================= */

        if (matchday.played === true) {

            console.log(
                "⚠️ Cette journée a déjà été jouée."
            );

            if (Array.isArray(matchday.results)) {

                return matchday.results;

            }

            return [];

        }


        /* ========================= */
        /* SIMULATION DES MATCHS */
        /* ========================= */

        matchday.matches.forEach(match => {

            // Ne jamais simuler une deuxième fois un match joué
            if (match.played === true && match.result) {

                results.push({

                    homeTeam: match.home,

                    awayTeam: match.away,

                    homeGoals:
                        match.result.homeGoals,

                    awayGoals:
                        match.result.awayGoals,

                    events:
                        Array.isArray(match.result.events)
                            ? match.result.events
                            : [],

                    date:
                        match.result.date || null

                });

                return;

            }


            /* ========================= */
            /* NOUVEAU MATCH */
            /* ========================= */

            const result =
                this.simulateMatch(
                    match.home,
                    match.away
                );


            /* ========================= */
            /* ENREGISTREMENT CALENDRIER */
            /* ========================= */

            match.result = {

                homeGoals: result.homeGoals,

                awayGoals: result.awayGoals,

                events: result.events,

                date: result.date

            };

            match.played = true;

            results.push(result);

        });


        /* ========================= */
        /* JOURNÉE TERMINÉE */
        /* ========================= */

        matchday.results = results;

        matchday.played = true;

        return results;

    }


    /* ================================================= */
    /* SIMULER PLUSIEURS JOURNÉES */
    /* ================================================= */

    simulateMatchdays(matchdays) {

        const results = [];

        if (!Array.isArray(matchdays)) {
            return results;
        }

        matchdays.forEach(matchday => {

            // Ne pas rejouer une journée terminée
            if (matchday && matchday.played === true) {
                return;
            }

            const dayResults =
                this.simulateMatchday(matchday);

            results.push(...dayResults);

        });

        return results;

    }


    /* ================================================= */
    /* AFFICHER UN RÉSULTAT */
    /* ================================================= */

    displayResult(match) {

        if (!match) {
            return;
        }

        console.log(
            `${match.homeTeam} ` +
            `${match.homeGoals} - ` +
            `${match.awayGoals} ` +
            `${match.awayTeam}`
        );

        if (Array.isArray(match.events)) {

            match.events.forEach(event => {

                console.log(
                    `${event.minute}' — ` +
                    `${event.description} ` +
                    `(${event.score})`
                );

            });

        }

    }


    /* ================================================= */
    /* AFFICHER UNE JOURNÉE */
    /* ================================================= */

    displayMatchday(results) {

        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {

            return;

        }

        console.log("=== RÉSULTATS ===");

        results.forEach(match => {

            this.displayResult(match);

        });

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
