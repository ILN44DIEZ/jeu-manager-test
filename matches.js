
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
    /* RÉCUPÉRER LE NOM D'UN JOUEUR */
    /* ================================================= */

    getPlayerName(player) {

        if (!player) {
            return null;
        }

        const firstName =
            player.prenom ||
            player.firstName ||
            player.firstname ||
            player.first_name ||
            "";

        const lastName =
            player.nom ||
            player.lastName ||
            player.lastname ||
            player.last_name ||
            "";

        const fullName =
            (
                String(firstName).trim() +
                " " +
                String(lastName).trim()
            ).trim();

        if (fullName) {
            return fullName;
        }

        const alternatives = [

            player.name,
            player.nomComplet,
            player.fullName,
            player.full_name,
            player.nom_complet

        ];

        for (const name of alternatives) {

            if (
                typeof name === "string" &&
                name.trim()
            ) {

                return name.trim();

            }

        }

        return null;

    }


    /* ================================================= */
    /* CHOISIR UN BUTEUR */
    /* ================================================= */

    getScorer(teamName) {

        const players =
            this.teamPlayers[teamName] || [];

        if (
            !Array.isArray(players) ||
            players.length === 0
        ) {

            return null;

        }

        // Postes privilégiés pour les buteurs
        const attackingPositions = [

            "BU",
            "AC",
            "AG",
            "AD",
            "AV",
            "MOC",
            "MC",
            "MG",
            "MD"

        ];

        const attackingPlayers =
            players.filter(player => {

                const position = String(

                    player.poste ||
                    player.position ||
                    player.pos ||
                    ""

                ).trim().toUpperCase();

                return attackingPositions.includes(position);

            });


        // Si aucun joueur offensif n'est disponible,
        // rechercher parmi tout l'effectif.
        const candidates =
            attackingPlayers.length > 0
                ? attackingPlayers
                : players;


        // Écarter les joueurs dont le nom est inexploitable.
        const namedPlayers =
            candidates.filter(player => {

                return this.getPlayerName(player) !== null;

            });


        if (namedPlayers.length === 0) {

            return null;

        }


        const player =
            namedPlayers[
                Math.floor(
                    Math.random() * namedPlayers.length
                )
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


        // Générer une minute unique entre 1 et 90.
        const getMinute = () => {

            let minute;

            do {

                minute =
                    Math.floor(Math.random() * 90) + 1;

            } while (usedMinutes.has(minute));

            usedMinutes.add(minute);

            return minute;

        };


        // Buts de l'équipe à domicile
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
                    scorer
                        ? "⚽ But de " + scorer
                        : "⚽ But (buteur inconnu)"

            });

        }


        // Buts de l'équipe à l'extérieur
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
                    scorer
                        ? "⚽ But de " + scorer
                        : "⚽ But (buteur inconnu)"

            });

        }


        // Classer les événements chronologiquement.
        events.sort((a, b) => a.minute - b.minute);


        // Calculer le score après chaque but.
        let currentHomeGoals = 0;

        let currentAwayGoals = 0;


        events.forEach(event => {

            if (event.team === homeTeam) {

                currentHomeGoals++;

            } else if (event.team === awayTeam) {

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
    /* SIMULER UN MATCH */
    /* ================================================= */

    getTeamFatiguePenalty(teamName) {
        const players = this.teamPlayers[teamName] || [];
        if (!Array.isArray(players) || players.length === 0) return 0;
        const fatigueValues = players.filter(player => player && Number.isFinite(Number(player.fatigue))).map(player => Math.max(0, Math.min(100, Number(player.fatigue))));
        if (fatigueValues.length === 0) return 0;
        const averageFatigue = fatigueValues.reduce((sum, value) => sum + value, 0) / fatigueValues.length;
        if (averageFatigue < 40) return 0;
        if (averageFatigue < 60) return 0.005;
        if (averageFatigue < 70) return 0.015;
        if (averageFatigue < 80) return 0.03;
        if (averageFatigue < 90) return 0.05;
        if (averageFatigue < 100) return 0.075;
        return 0.10;
    }

    applyFatigueToGoals(goals, penalty) {
        let effectiveGoals = 0;
        for (let i = 0; i < goals; i++) if (Math.random() >= penalty) effectiveGoals++;
        return effectiveGoals;
    }

    simulateMatch(homeTeam, awayTeam) {
        const rawHomeGoals = Math.floor(Math.random() * 5);
        const rawAwayGoals = Math.floor(Math.random() * 5);
        const homePenalty = this.getTeamFatiguePenalty(homeTeam);
        const awayPenalty = this.getTeamFatiguePenalty(awayTeam);
        const homeGoals = this.applyFatigueToGoals(rawHomeGoals, homePenalty);
        const awayGoals = this.applyFatigueToGoals(rawAwayGoals, awayPenalty);

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

            // Ne jamais simuler une deuxième fois
            // un match déjà enregistré.
            if (
                match.played === true &&
                match.result
            ) {

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
            /* ENREGISTRER LE RÉSULTAT */
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

            // Ne pas rejouer une journée terminée.
            if (
                matchday &&
                matchday.played === true
            ) {

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
