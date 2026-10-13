
class MatchEngine {

    constructor(standings = null) {

        this.history = [];

        this.standings = standings;

        // Effectifs associés à chaque club.
        this.teamPlayers = {};

        // Onze réellement utilisés pour la simulation du match en cours.
        // Les clubs IA ont un onze automatique ; le club du joueur reçoit son onze tactique.
        this.activePlayersByTeam = {};

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


    setActiveLineup(teamName, players) {
        if (!teamName || !Array.isArray(players)) return false;
        this.activePlayersByTeam[teamName] = players;
        return true;
    }


    getEligibleMatchPlayers(teamName) {
        const squad = Array.isArray(this.teamPlayers[teamName]) ? this.teamPlayers[teamName] : [];
        const selected = this.activePlayersByTeam[teamName];

        // Si un onze est fourni, seuls ses joueurs peuvent marquer ou faire une passe.
        // Sinon, choisir automatiquement jusqu'à 11 joueurs aptes pour les clubs IA.
        const source = Array.isArray(selected)
            ? selected
            : squad.filter(player => !this.isInjured(player))
                .sort((a, b) => this.getPlayerRating(b) - this.getPlayerRating(a))
                .slice(0, 11);

        const resolveToSquad = candidate => {
            if (!candidate) return null;
            if (candidate.id != null) {
                const byId = squad.find(player => player && player.id != null &&
                    String(player.id) === String(candidate.id));
                if (byId) return byId;
            }
            const key = String(this.getPlayerName(candidate) || "").trim().toLowerCase();
            return key ? squad.find(player =>
                String(this.getPlayerName(player) || "").trim().toLowerCase() === key
            ) || null : null;
        };

        const seen = new Set();
        return source.map(resolveToSquad).filter(player => {
            if (!player || seen.has(player)) return false;
            seen.add(player);
            return !this.isInjured(player);
        });
    }


    isInjured(player) {
        const injury = String(player && (player.blessure ?? player.injury) || "").trim().toLowerCase();
        const days = Math.max(0, Number(player && (player.joursBlessure ?? player.injuryDays)) || 0);
        const hasInjuryText = injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury);
        return days > 0 || hasInjuryText;
    }


    clearActiveLineups() {
        this.activePlayersByTeam = {};
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

    isGoalkeeper(player) {
        const position = String(player && (player.poste || player.position || player.pos) || "").trim().toUpperCase();
        return ["GB", "GK", "G", "GARDIEN", "GOALKEEPER"].includes(position);
    }

    seasonGoalContributions(player) {
        return Math.max(0, Number(player && (player.butsSaison ?? player.seasonGoals)) || 0) +
            Math.max(0, Number(player && (player.passesDecisivesSaison ?? player.seasonAssists)) || 0);
    }

    recordSeasonContribution(teamName, playerName, field) {
        const target = String(playerName || "").trim().toLowerCase();
        if (!target) return;
        const squad = this.teamPlayers[teamName] || [];
        const player = squad.find(candidate => String(this.getPlayerName(candidate) || "").trim().toLowerCase() === target);
        if (!player) return;
        if (field === "goal") {
            player.butsSaison = (Number(player.butsSaison ?? player.seasonGoals) || 0) + 1;
            player.seasonGoals = player.butsSaison;
        } else {
            player.passesDecisivesSaison = (Number(player.passesDecisivesSaison ?? player.seasonAssists) || 0) + 1;
            player.seasonAssists = player.passesDecisivesSaison;
        }
    }


    chooseWithRareGoalkeeperContribution(outfieldPlayers, goalkeeperPlayers) {
        const outfield = (outfieldPlayers || []).filter(player => this.getPlayerName(player));
        const goalkeepers = (goalkeeperPlayers || []).filter(player => this.getPlayerName(player));
        if (goalkeepers.length && Math.random() < 0.01) {
            return goalkeepers[Math.floor(Math.random() * goalkeepers.length)];
        }
        if (outfield.length) return outfield[Math.floor(Math.random() * outfield.length)];
        return null;
    }


    getScorer(teamName) {

        const players = this.getEligibleMatchPlayers(teamName);

        if (!players.length) {
            return null;
        }

        const eligiblePlayers = players.filter(player => {
            const goalkeeperBlocked = this.isGoalkeeper(player) && this.seasonGoalContributions(player) >= 2;
            return !goalkeeperBlocked;
        });

        if (players.length === 0) return null;

        // Les gardiens restent éligibles, mais seulement avec une probabilité de 1 %.
        const outfieldPlayers = eligiblePlayers.filter(player => !this.isGoalkeeper(player));
        const goalkeeperPlayers = eligiblePlayers.filter(player => this.isGoalkeeper(player));
        const attackingPositions = ["BU", "AC", "AG", "AD", "AV", "MOC", "MC", "MG", "MD"];
        const attackingPlayers = outfieldPlayers.filter(player => {
            const position = String(player.poste || player.position || player.pos || "").trim().toUpperCase();
            return attackingPositions.includes(position);
        });
        const fieldCandidates = attackingPlayers.length ? attackingPlayers : outfieldPlayers;
        const player = this.chooseWithRareGoalkeeperContribution(fieldCandidates, goalkeeperPlayers);
        return player ? this.getPlayerName(player) : null;

    }


    getAssist(teamName, scorerName) {
        const scorer = String(scorerName || "").trim().toLowerCase();
        if (!scorerName || scorerName === "Buteur non renseigné") return null;
        const candidates = this.getEligibleMatchPlayers(teamName).filter(player => {
            const name = this.getPlayerName(player);
            if (!name || name.toLowerCase() === scorer) return false;
            const goalkeeperBlocked = this.isGoalkeeper(player) && this.seasonGoalContributions(player) >= 2;
            return !goalkeeperBlocked;
        });
        const outfieldPlayers = candidates.filter(player => !this.isGoalkeeper(player));
        const goalkeeperPlayers = candidates.filter(player => this.isGoalkeeper(player));
        const assister = this.chooseWithRareGoalkeeperContribution(outfieldPlayers, goalkeeperPlayers);
        return assister ? this.getPlayerName(assister) : null;
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

            const scorer = this.getScorer(homeTeam);
            if (scorer) this.recordSeasonContribution(homeTeam, scorer, "goal");
            const assist = this.getAssist(homeTeam, scorer);
            if (assist) this.recordSeasonContribution(homeTeam, assist, "assist");

            events.push({

                minute: getMinute(),

                type: "goal",

                team: homeTeam,

                scorer:
                    scorer || "Buteur non renseigné",

                assist: assist,

                description:
                    scorer
                        ? "⚽ But de " + scorer + (assist ? " (passe décisive : " + assist + ")" : "")
                        : "⚽ But (buteur inconnu)"

            });

        }


        // Buts de l'équipe à l'extérieur
        for (let i = 0; i < awayGoals; i++) {

            const scorer = this.getScorer(awayTeam);
            if (scorer) this.recordSeasonContribution(awayTeam, scorer, "goal");
            const assist = this.getAssist(awayTeam, scorer);
            if (assist) this.recordSeasonContribution(awayTeam, assist, "assist");

            events.push({

                minute: getMinute(),

                type: "goal",

                team: awayTeam,

                scorer:
                    scorer || "Buteur non renseigné",

                assist: assist,

                description:
                    scorer
                        ? "⚽ But de " + scorer + (assist ? " (passe décisive : " + assist + ")" : "")
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

    getPlayerRating(player) {
        const rating = Number(player && (player.note ?? player.rating ?? player.overall));
        return Number.isFinite(rating) && rating > 0 ? Math.max(1, Math.min(99, rating)) : 60;
    }

    getTeamStrength(teamName) {
        const players = this.getEligibleMatchPlayers(teamName);
        if (!players.length) return 60;
        const ratings = players.map(player => this.getPlayerRating(player));
        return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    }

    getExpectedGoals(teamName, opponentName, isHome) {
        const strength = this.getTeamStrength(teamName);
        const opponentStrength = this.getTeamStrength(opponentName);
        // L'écart de niveau influence nettement les occasions, sans rendre le résultat certain.
        const difference = Math.max(-30, Math.min(30, strength - opponentStrength));
        const homeBonus = isHome ? 0.12 : 0;
        const fatiguePenalty = this.getTeamFatiguePenalty(teamName);
        const expected = 1.25 * Math.exp(difference / 40) + homeBonus;
        return Math.max(0.25, Math.min(2.80, expected * (1 - fatiguePenalty)));
    }

    sampleGoals(expectedGoals) {
        // Approximation de Poisson : les scores restent variables, mais les équipes fortes
        // obtiennent en moyenne davantage de buts et de chances de gagner.
        const limit = Math.exp(-Math.max(0.05, expectedGoals));
        let product = 1;
        let goals = 0;
        do {
            goals++;
            product *= Math.random();
        } while (product > limit && goals < 8);
        return Math.max(0, goals - 1);
    }

    simulateMatch(homeTeam, awayTeam) {
        const expectedHomeGoals = this.getExpectedGoals(homeTeam, awayTeam, true);
        const expectedAwayGoals = this.getExpectedGoals(awayTeam, homeTeam, false);
        const homeGoals = this.sampleGoals(expectedHomeGoals);
        const awayGoals = this.sampleGoals(expectedAwayGoals);

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
