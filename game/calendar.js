class ChampionshipCalendar {

    constructor(teams, seasonStartDate = "2026-08-15") {

        this.teams = [
            ...teams
        ];

        this.matchdays = [];
        this.seasonStartDate = seasonStartDate;
        // Infrastructure commune pour les futures fenêtres de transferts,
        // trêves internationales, coupes et autres événements.
        this.events = [];

    }

    formatDate(dateValue) {
        if (!dateValue) return "";
        const date = new Date(dateValue + "T12:00:00");
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }

    assignMatchdayDates() {
        const start = new Date(this.seasonStartDate + "T12:00:00");
        this.matchdays.forEach((day, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index * 7);
            day.date = date.getFullYear() + "-" +
                String(date.getMonth() + 1).padStart(2, "0") + "-" +
                String(date.getDate()).padStart(2, "0");
            if (!Array.isArray(day.events)) day.events = [];
        });
        return this.matchdays;
    }

    addEvent(event) {
        if (!event || !event.title || !event.startDate) return false;
        const normalized = {
            id: event.id || "event-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
            title: String(event.title),
            type: event.type || "other",
            startDate: event.startDate,
            endDate: event.endDate || event.startDate,
            description: event.description || ""
        };
        this.events = (this.events || []).filter(item => item.id !== normalized.id);
        this.events.push(normalized);
        this.events.sort((a, b) => a.startDate.localeCompare(b.startDate));
        return true;
    }

    getEventsForDate(dateValue) {
        return (this.events || []).filter(event =>
            event.startDate <= dateValue && (event.endDate || event.startDate) >= dateValue
        );
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
        const firstHalf = this.matchdays;
        if (!firstHalf.length || !this.teams.length) return this.matchdays;

        const maxConsecutive = 2;
        const teamIndex = new Map(this.teams.map((team, index) => [team, index]));
        const originalOrientations = firstHalf.map(day =>
            day.matches.map(match => [match.home, match.away])
        );

        const scoreSchedule = (days, returnDays = []) => {
            const runs = new Map(this.teams.map(team => [team, { last: null, count: 0 }]));
            let totalPenalty = 0;
            let worstRun = 0;
            let teamsWithLongRuns = 0;
            const teamsOverLimit = new Set();
            const evaluateDay = day => {
                day.matches.forEach(match => {
                    for (const [team, venue] of [[match.home, "H"], [match.away, "A"]]) {
                        const state = runs.get(team);
                        if (!state) continue;
                        state.count = state.last === venue ? state.count + 1 : 1;
                        state.last = venue;
                        worstRun = Math.max(worstRun, state.count);
                        if (state.count > maxConsecutive) {
                            teamsOverLimit.add(team);
                            // Priorité aux séries les plus longues, puis au nombre
                            // total de journées excédentaires.
                            totalPenalty += (state.count - maxConsecutive) ** 2 * 10;
                        }
                    }
                });
            };
            days.forEach(evaluateDay);
            returnDays.forEach(evaluateDay);
            teamsWithLongRuns = teamsOverLimit.size;
            return totalPenalty * 10000 + teamsWithLongRuns * 100 + worstRun;
        };

        const applyOrientations = orientations => {
            firstHalf.forEach((day, dayIndex) => {
                day.matches.forEach((match, matchIndex) => {
                    const [home, away] = orientations[dayIndex][matchIndex];
                    match.home = home;
                    match.away = away;
                });
            });
        };

        const makeReturnDays = () => firstHalf.map(day => ({
            day: day.day,
            matches: day.matches.map(match => ({
                home: match.away,
                away: match.home,
                played: false,
                result: null
            })),
            played: false,
            results: []
        }));

        const orderReturns = returnDays => {
            const state = new Map(this.teams.map(team => [team, { last: null, count: 0 }]));
            const applyDay = day => day.matches.forEach(match => {
                for (const [team, venue] of [[match.home, "H"], [match.away, "A"]]) {
                    const item = state.get(team);
                    if (!item) continue;
                    item.count = item.last === venue ? item.count + 1 : 1;
                    item.last = venue;
                }
            });
            firstHalf.forEach(applyDay);
            const remaining = [...returnDays];
            const ordered = [];
            while (remaining.length) {
                let bestIndex = 0;
                let bestPenalty = Infinity;
                remaining.forEach((day, index) => {
                    let penalty = 0;
                    day.matches.forEach(match => {
                        const homeState = state.get(match.home);
                        const awayState = state.get(match.away);
                        if (homeState?.last === "H") penalty += Math.max(0, homeState.count + 1 - maxConsecutive) ** 2;
                        if (awayState?.last === "A") penalty += Math.max(0, awayState.count + 1 - maxConsecutive) ** 2;
                    });
                    penalty += Math.random() * 0.01;
                    if (penalty < bestPenalty) {
                        bestPenalty = penalty;
                        bestIndex = index;
                    }
                });
                const [chosen] = remaining.splice(bestIndex, 1);
                ordered.push(chosen);
                applyDay(chosen);
            }
            return ordered;
        };

        // Recherche multi-départs : on conserve la meilleure orientation des matchs
        // aller selon le score des séries sur l'ensemble aller + retour.
        let bestOrientations = originalOrientations.map(day => day.map(pair => [...pair]));
        let bestReturnOrder = null;
        let bestScore = Infinity;
        const attempts = 24;
        const flipsPerAttempt = Math.max(120, this.teams.length * 10);

        for (let attempt = 0; attempt < attempts; attempt++) {
            const candidate = originalOrientations.map(day => day.map(pair => [...pair]));
            if (attempt > 0) {
                candidate.forEach(day => day.forEach(pair => {
                    if (Math.random() < 0.5) [pair[0], pair[1]] = [pair[1], pair[0]];
                }));
            }

            applyOrientations(candidate);
            let candidateReturns = orderReturns(makeReturnDays());
            let candidateScore = scoreSchedule(firstHalf, candidateReturns);

            // Évaluer aussi l'état initial de chaque départ : une bonne solution
            // ne doit pas être ignorée si aucune mutation ne l'améliore ensuite.
            if (candidateScore < bestScore) {
                bestScore = candidateScore;
                bestOrientations = candidate.map(day => day.map(pair => [...pair]));
                bestReturnOrder = candidateReturns.map(day => day.day);
            }

            for (let iteration = 0; iteration < flipsPerAttempt; iteration++) {
                // Tester des inversions simples, doubles et triples. Les matchs
                // choisis sont distincts pour éviter les mouvements qui s'annulent.
                const moves = [];
                const moveCount = iteration % 12 === 11 ? 3 : iteration % 4 === 3 ? 2 : 1;
                const available = [];
                candidate.forEach((day, dayIndex) => day.forEach((match, matchIndex) => {
                    available.push([dayIndex, matchIndex]);
                }));
                for (let move = 0; move < moveCount && available.length; move++) {
                    const picked = Math.floor(Math.random() * available.length);
                    moves.push(available.splice(picked, 1)[0]);
                }
                if (!moves.length) continue;

                moves.forEach(([dayIndex, matchIndex]) => {
                    [candidate[dayIndex][matchIndex][0], candidate[dayIndex][matchIndex][1]] =
                        [candidate[dayIndex][matchIndex][1], candidate[dayIndex][matchIndex][0]];
                });

                applyOrientations(candidate);
                const trialReturns = orderReturns(makeReturnDays());
                const trialScore = scoreSchedule(firstHalf, trialReturns);

                // Recuit simulé également sur les orientations aller :
                // accepter parfois une solution moins bonne aide à sortir
                // des minima locaux. La température suit l'échelle du score.
                const orientationTemperature = Math.max(
                    1000,
                    250000 * (1 - iteration / Math.max(1, flipsPerAttempt))
                );
                const acceptTrial = trialScore <= candidateScore ||
                    Math.random() < Math.exp((candidateScore - trialScore) / orientationTemperature);

                if (acceptTrial) {
                    candidateReturns = trialReturns;
                    candidateScore = trialScore;
                } else {
                    moves.forEach(([dayIndex, matchIndex]) => {
                        [candidate[dayIndex][matchIndex][0], candidate[dayIndex][matchIndex][1]] =
                            [candidate[dayIndex][matchIndex][1], candidate[dayIndex][matchIndex][0]];
                    });
                }

                if (candidateScore < bestScore) {
                    bestScore = candidateScore;
                    bestOrientations = candidate.map(day => day.map(pair => [...pair]));
                    bestReturnOrder = candidateReturns.map(day => day.day);
                }
            }
        }

        applyOrientations(bestOrientations);

        // Optimisation dédiée de l'ordre des journées retour. La recherche
        // gloutonne fournit un point de départ, puis des échanges de journées
        // entières sont testés et seule la meilleure solution est conservée.
        const returnDays = makeReturnDays();
        const returnDayByNumber = new Map(returnDays.map(day => [day.day, day]));
        let orderedReturns = Array.isArray(bestReturnOrder) && bestReturnOrder.length === returnDays.length
            ? bestReturnOrder.map(dayNumber => returnDayByNumber.get(dayNumber)).filter(Boolean)
            : orderReturns(returnDays);

        // Repli défensif si un numéro de journée est absent ou dupliqué.
        if (orderedReturns.length !== returnDays.length) {
            orderedReturns = orderReturns(returnDays);
        }

        let returnOrderScore = scoreSchedule(firstHalf, orderedReturns);
        let bestOptimizedReturnOrder = orderedReturns.map(day => day.day);
        let currentOrder = [...orderedReturns];
        let currentScore = returnOrderScore;
        const returnOrderAttempts = Math.max(1800, this.teams.length * 180);

        for (let iteration = 0; iteration < returnOrderAttempts; iteration++) {
            if (currentOrder.length < 2) break;

            const trialOrder = [...currentOrder];
            const moveType = Math.random();
            const firstIndex = Math.floor(Math.random() * trialOrder.length);
            let secondIndex = Math.floor(Math.random() * trialOrder.length);
            while (secondIndex === firstIndex) {
                secondIndex = Math.floor(Math.random() * trialOrder.length);
            }

            if (moveType < 0.55) {
                // Échange de deux journées.
                [trialOrder[firstIndex], trialOrder[secondIndex]] =
                    [trialOrder[secondIndex], trialOrder[firstIndex]];
            } else if (moveType < 0.85) {
                // Déplacer une journée à une autre position.
                const [movedDay] = trialOrder.splice(firstIndex, 1);
                trialOrder.splice(secondIndex, 0, movedDay);
            } else {
                // Inverser un segment complet de journées.
                const start = Math.min(firstIndex, secondIndex);
                const end = Math.max(firstIndex, secondIndex);
                const segment = trialOrder.slice(start, end + 1).reverse();
                trialOrder.splice(start, segment.length, ...segment);
            }

            const trialScore = scoreSchedule(firstHalf, trialOrder);
            const temperature = Math.max(1000, 500000 * (1 - iteration / returnOrderAttempts));
            const acceptWorse = Math.random() < Math.exp((currentScore - trialScore) / temperature);

            if (trialScore < returnOrderScore) {
                returnOrderScore = trialScore;
                bestOptimizedReturnOrder = trialOrder.map(day => day.day);
            }

            if (trialScore <= currentScore || acceptWorse) {
                currentOrder = trialOrder;
                currentScore = trialScore;
            }
        }

        // Recherche conjointe : l'orientation des matchs aller et l'ordre
        // des retours sont optimisés ensemble. Les deux décisions s'influencent :
        // changer seulement l'une d'elles peut bloquer la recherche dans un minimum local.
        let jointOrientations = bestOrientations.map(day => day.map(pair => [...pair]));
        let jointOrder = bestOptimizedReturnOrder.map(dayNumber => returnDayByNumber.get(dayNumber));
        let jointScore = scoreSchedule(firstHalf, jointOrder);
        let bestJointScore = jointScore;
        let bestJointOrientations = jointOrientations.map(day => day.map(pair => [...pair]));
        let bestJointOrder = jointOrder.map(day => day.day);
        const jointAttempts = Math.max(1600, this.teams.length * 100);

        for (let iteration = 0; iteration < jointAttempts; iteration++) {
            const trialOrientations = jointOrientations.map(day => day.map(pair => [...pair]));
            const trialOrderNumbers = jointOrder.map(day => day.day);
            const fixtureCount = iteration % 5 === 4 ? 2 : 1;
            const fixtures = [];
            const allFixtures = [];
            trialOrientations.forEach((day, dayIndex) =>
                day.forEach((pair, matchIndex) => allFixtures.push([dayIndex, matchIndex]))
            );
            for (let i = 0; i < fixtureCount && allFixtures.length; i++) {
                fixtures.push(allFixtures.splice(
                    Math.floor(Math.random() * allFixtures.length), 1
                )[0]);
            }
            fixtures.forEach(([dayIndex, matchIndex]) => {
                [trialOrientations[dayIndex][matchIndex][0],
                 trialOrientations[dayIndex][matchIndex][1]] =
                [trialOrientations[dayIndex][matchIndex][1],
                 trialOrientations[dayIndex][matchIndex][0]];
            });

            // Échange, déplacement ou inversion d'un segment de journées retour.
            if (trialOrderNumbers.length > 1) {
                let a = Math.floor(Math.random() * trialOrderNumbers.length);
                let b = Math.floor(Math.random() * trialOrderNumbers.length);
                while (b === a) b = Math.floor(Math.random() * trialOrderNumbers.length);
                const move = Math.random();
                if (move < 0.5) {
                    [trialOrderNumbers[a], trialOrderNumbers[b]] =
                        [trialOrderNumbers[b], trialOrderNumbers[a]];
                } else if (move < 0.8) {
                    const [moved] = trialOrderNumbers.splice(a, 1);
                    trialOrderNumbers.splice(b, 0, moved);
                } else {
                    const start = Math.min(a, b);
                    const end = Math.max(a, b);
                    const segment = trialOrderNumbers.slice(start, end + 1).reverse();
                    trialOrderNumbers.splice(start, segment.length, ...segment);
                }
            }

            applyOrientations(trialOrientations);
            const trialReturnByNumber = new Map(makeReturnDays().map(day => [day.day, day]));
            const trialReturns = trialOrderNumbers.map(dayNumber =>
                trialReturnByNumber.get(dayNumber)
            ).filter(Boolean);
            const trialScore = scoreSchedule(firstHalf, trialReturns);
            const temperature = Math.max(0.5, 80 * (1 - iteration / jointAttempts));
            const accept = trialScore <= jointScore ||
                Math.random() < Math.exp((jointScore - trialScore) / temperature);

            if (accept) {
                jointOrientations = trialOrientations;
                jointOrder = trialReturns;
                jointScore = trialScore;
            } else {
                applyOrientations(jointOrientations);
            }

            if (trialScore < bestJointScore) {
                bestJointScore = trialScore;
                bestJointOrientations = trialOrientations.map(day => day.map(pair => [...pair]));
                bestJointOrder = trialOrderNumbers.slice();
            }
        }

        // Réparation ciblée : repérer les équipes qui dépassent la limite,
        // puis modifier en priorité l'orientation d'un match appartenant à leur série.
        // Cela explore des mouvements utiles au lieu de retourner des matchs au hasard.
        let repairOrientations = bestJointOrientations.map(day => day.map(pair => [...pair]));
        let repairOrder = bestJointOrder.slice();
        let repairScore = bestJointScore;
        let bestRepairScore = repairScore;
        let bestRepairOrientations = repairOrientations.map(day => day.map(pair => [...pair]));
        let bestRepairOrder = repairOrder.slice();
        const repairAttempts = Math.max(1200, this.teams.length * 90);

        const findLongRunFixtures = (orientations, returnOrderNumbers) => {
            const venueHistory = new Map(this.teams.map(team => [team, []]));
            const appendDay = day => day.matches.forEach(match => {
                venueHistory.get(match.home)?.push({ venue: "H", dayNumber: day.day });
                venueHistory.get(match.away)?.push({ venue: "A", dayNumber: day.day });
            });
            applyOrientations(orientations);
            firstHalf.forEach(appendDay);
            const returnMap = new Map(makeReturnDays().map(day => [day.day, day]));
            returnOrderNumbers.forEach(dayNumber => {
                const day = returnMap.get(dayNumber);
                if (day) appendDay(day);
            });
            const candidates = [];
            venueHistory.forEach((history, team) => {
                let start = 0;
                while (start < history.length) {
                    let end = start + 1;
                    while (end < history.length && history[end].venue === history[start].venue) end++;
                    if (end - start > maxConsecutive) {
                        for (let index = start + maxConsecutive; index < end; index++) {
                            const item = history[index];
                            const firstHalfDay = firstHalf.find(day => day.day === item.dayNumber);
                            const sourceDay = firstHalfDay || returnMap.get(item.dayNumber);
                            if (!sourceDay) continue;
                            const fixtureIndex = sourceDay.matches.findIndex(match =>
                                match.home === team || match.away === team
                            );
                            if (fixtureIndex >= 0) {
                                const originalDayNumber = firstHalfDay
                                    ? firstHalfDay.day
                                    : sourceDay.day;
                                candidates.push([originalDayNumber, fixtureIndex]);
                            }
                        }
                    }
                    start = end;
                }
            });
            return candidates;
        };

        for (let iteration = 0; iteration < repairAttempts; iteration++) {
            applyOrientations(repairOrientations);
            const candidates = findLongRunFixtures(repairOrientations, repairOrder);
            if (!candidates.length) {
                bestRepairScore = 0;
                bestRepairOrientations = repairOrientations.map(day => day.map(pair => [...pair]));
                bestRepairOrder = repairOrder.slice();
                break;
            }

            const trialOrientations = repairOrientations.map(day => day.map(pair => [...pair]));
            const [dayNumber, fixtureIndex] = candidates[Math.floor(Math.random() * candidates.length)];
            const dayIndex = firstHalf.findIndex(day => day.day === dayNumber);
            if (dayIndex < 0 || !trialOrientations[dayIndex]?.[fixtureIndex]) continue;
            [trialOrientations[dayIndex][fixtureIndex][0],
             trialOrientations[dayIndex][fixtureIndex][1]] =
            [trialOrientations[dayIndex][fixtureIndex][1],
             trialOrientations[dayIndex][fixtureIndex][0]];

            let trialOrderNumbers = repairOrder.slice();
            // Parfois déplacer une journée retour en même temps permet de casser
            // une série sans dégrader l'équilibre des autres clubs.
            if (Math.random() < 0.35 && trialOrderNumbers.length > 1) {
                const from = Math.floor(Math.random() * trialOrderNumbers.length);
                let to = Math.floor(Math.random() * trialOrderNumbers.length);
                while (to === from) to = Math.floor(Math.random() * trialOrderNumbers.length);
                const [moved] = trialOrderNumbers.splice(from, 1);
                trialOrderNumbers.splice(to, 0, moved);
            }

            applyOrientations(trialOrientations);
            const trialMap = new Map(makeReturnDays().map(day => [day.day, day]));
            const trialReturns = trialOrderNumbers.map(number => trialMap.get(number)).filter(Boolean);
            const trialScore = scoreSchedule(firstHalf, trialReturns);
            const temperature = Math.max(0.25, 30 * (1 - iteration / repairAttempts));
            const accept = trialScore <= repairScore ||
                Math.random() < Math.exp((repairScore - trialScore) / temperature);

            if (accept) {
                repairOrientations = trialOrientations;
                repairOrder = trialOrderNumbers;
                repairScore = trialScore;
            }

            if (trialScore < bestRepairScore) {
                bestRepairScore = trialScore;
                bestRepairOrientations = trialOrientations.map(day => day.map(pair => [...pair]));
                bestRepairOrder = trialOrderNumbers.slice();
            }
        }

        // Descente locale déterministe : tester toutes les inversions simples
        // et tous les échanges de journées retour, sans accepter de régression.
        let finalOrientations = bestRepairOrientations.map(day => day.map(pair => [...pair]));
        let finalOrder = bestRepairOrder.slice();
        applyOrientations(finalOrientations);
        const scoreOrder = numbers => {
            const returnMap = new Map(makeReturnDays().map(day => [day.day, day]));
            return scoreSchedule(firstHalf, numbers.map(number => returnMap.get(number)).filter(Boolean));
        };
        let finalScore = scoreOrder(finalOrder);
        for (let pass = 0; pass < 30 && finalScore > 0; pass++) {
            let improved = false;
            for (let d = 0; d < finalOrientations.length && !improved; d++) {
                for (let m = 0; m < finalOrientations[d].length && !improved; m++) {
                    const trial = finalOrientations.map(day => day.map(pair => [...pair]));
                    [trial[d][m][0], trial[d][m][1]] = [trial[d][m][1], trial[d][m][0]];
                    applyOrientations(trial);
                    const score = scoreOrder(finalOrder);
                    if (score < finalScore) {
                        finalOrientations = trial;
                        finalScore = score;
                        improved = true;
                    } else {
                        applyOrientations(finalOrientations);
                    }
                }
            }
            if (improved) continue;
            outerSwap:
            for (let a = 0; a < finalOrder.length; a++) {
                for (let b = a + 1; b < finalOrder.length; b++) {
                    const trialOrder = finalOrder.slice();
                    [trialOrder[a], trialOrder[b]] = [trialOrder[b], trialOrder[a]];
                    const score = scoreOrder(trialOrder);
                    if (score < finalScore) {
                        finalOrder = trialOrder;
                        finalScore = score;
                        improved = true;
                        break outerSwap;
                    }
                }
            }
            if (!improved) break;
        }

        // Restaurer le meilleur état trouvé et transmettre son ordre retour.
        applyOrientations(finalOrientations);
        bestOptimizedReturnOrder = finalOrder;
        this._optimizedReturnDayOrder = bestOptimizedReturnOrder;
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


        // Si l'optimiseur a calculé un ordre global, réutiliser cet ordre exact
        // au lieu de le recalculer avec une heuristique différente.
        if (Array.isArray(this._optimizedReturnDayOrder) &&
            this._optimizedReturnDayOrder.length === returnMatches.length) {
            const orderIndex = new Map(
                this._optimizedReturnDayOrder.map((dayNumber, index) => [dayNumber, index])
            );
            returnMatches.sort((a, b) =>
                (orderIndex.get(a.day) ?? Infinity) - (orderIndex.get(b.day) ?? Infinity)
            );
            this._optimizedReturnDayOrder = null;

            const firstHalfLength = firstHalf.length;
            returnMatches.forEach((day, index) => {
                day.day = firstHalfLength + index + 1;
            });
            this.matchdays = [...firstHalf, ...returnMatches];
            return this.matchdays;
        }

        /*
         * Ordonner les journées retour en limitant les séries de
         * plus de deux matchs consécutifs à domicile ou à l'extérieur.
         * Les affiches restent inversées par rapport à l'aller : seul
         * l'ordre des journées retour change.
         */
        const teamState = {};
        this.teams.forEach(team => {
            teamState[team] = { last: null, consecutive: 0 };
        });

        const updateStateForDay = day => {
            day.matches.forEach(match => {
                this.updateTeamState(teamState[match.home], "home");
                this.updateTeamState(teamState[match.away], "away");
            });
        };

        firstHalf.forEach(updateStateForDay);
        const orderedReturns = [];
        const remainingReturns = [...returnMatches];

        while (remainingReturns.length) {
            let bestIndex = 0;
            let bestPenalty = Infinity;

            remainingReturns.forEach((day, index) => {
                let penalty = 0;
                day.matches.forEach(match => {
                    const homeState = teamState[match.home];
                    const awayState = teamState[match.away];
                    if (homeState?.last === "home") {
                        penalty += Math.max(0, homeState.consecutive + 1 - 2) ** 2;
                    }
                    if (awayState?.last === "away") {
                        penalty += Math.max(0, awayState.consecutive + 1 - 2) ** 2;
                    }
                });
                // Départager les journées équivalentes de manière aléatoire.
                penalty += Math.random() * 0.25;
                if (penalty < bestPenalty) {
                    bestPenalty = penalty;
                    bestIndex = index;
                }
            });

            const [chosenDay] = remainingReturns.splice(bestIndex, 1);
            orderedReturns.push(chosenDay);
            updateStateForDay(chosenDay);
        }

        const firstHalfLength = firstHalf.length;


        orderedReturns.forEach(
            (day, index) => {

                day.day =
                    firstHalfLength +
                    index +
                    1;

            }
        );


        this.matchdays = [

            ...firstHalf,

            ...orderedReturns

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


        this.assignMatchdayDates();

        return this.matchdays;

    }



    /* ================================================= */
    /* VALIDATION DE L'INTÉGRITÉ DU CALENDRIER */
    /* ================================================= */

    validateCalendar() {
        const errors = [];
        const warnings = [];
        const teams = Array.isArray(this.teams) ? this.teams : [];
        const teamSet = new Set(teams);
        const teamCount = teams.length;
        const expectedFirstHalfRounds = teamCount % 2 === 0
            ? teamCount - 1
            : teamCount;
        const expectedMatchdays = expectedFirstHalfRounds * 2;
        const expectedMatches = teamCount * (teamCount - 1);
        const expectedMatchesPerDay = Math.floor(teamCount / 2);
        const pairCounts = new Map();
        const homeAwayCounts = new Map();
        const seenMatchdayNumbers = new Set();
        const seenDates = new Set();
        let totalMatches = 0;

        if (teamCount < 2) {
            errors.push("Il faut au moins deux équipes pour générer un championnat.");
        }

        if (teamSet.size !== teamCount) {
            errors.push("La liste des équipes contient des noms en double.");
        }

        if (teams.some(team => typeof team !== "string" || !team.trim())) {
            errors.push("La liste des équipes contient un nom vide ou invalide.");
        }

        if (teams.includes("Exempt")) {
            errors.push('Le nom réservé "Exempt" ne doit pas être une vraie équipe.');
        }

        if (!Array.isArray(this.matchdays)) {
            errors.push("La liste des journées est invalide.");
            return {
                valid: false,
                errors,
                warnings,
                summary: {
                    teams: teamCount,
                    matchdays: 0,
                    matches: 0,
                    expectedMatchdays,
                    expectedMatches
                }
            };
        }

        if (this.matchdays.length !== expectedMatchdays) {
            errors.push(
                `Nombre de journées incorrect : ${this.matchdays.length} trouvées, ${expectedMatchdays} attendues.`
            );
        }

        this.matchdays.forEach((day, index) => {
            const expectedDayNumber = index + 1;

            if (day.day !== expectedDayNumber) {
                errors.push(
                    `Numérotation incorrecte à l'index ${index} : journée ${day.day}, attendu ${expectedDayNumber}.`
                );
            }

            if (seenMatchdayNumbers.has(day.day)) {
                errors.push(`La journée ${day.day} apparaît plusieurs fois.`);
            }
            seenMatchdayNumbers.add(day.day);

            if (!Array.isArray(day.matches)) {
                errors.push(`La journée ${day.day} ne contient pas une liste de matchs valide.`);
                return;
            }

            if (day.matches.length !== expectedMatchesPerDay) {
                errors.push(
                    `Journée ${day.day} : ${day.matches.length} matchs, ${expectedMatchesPerDay} attendus.`
                );
            }

            const teamsInDay = new Set();

            day.matches.forEach((match, matchIndex) => {
                totalMatches++;

                if (!match || typeof match.home !== "string" || typeof match.away !== "string") {
                    errors.push(`Match invalide à la journée ${day.day}, position ${matchIndex + 1}.`);
                    return;
                }

                const { home, away } = match;

                if (!teamSet.has(home) || !teamSet.has(away)) {
                    errors.push(
                        `Journée ${day.day} : équipe inconnue dans le match "${home} - ${away}".`
                    );
                    return;
                }

                if (home === away) {
                    errors.push(`Journée ${day.day} : ${home} ne peut pas jouer contre elle-même.`);
                    return;
                }

                for (const team of [home, away]) {
                    if (teamsInDay.has(team)) {
                        errors.push(`Journée ${day.day} : ${team} apparaît dans plusieurs matchs.`);
                    }
                    teamsInDay.add(team);
                }

                const pair = [home, away].sort().join("|||");
                pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);

                const direction = home + ">>>" + away;
                homeAwayCounts.set(direction, (homeAwayCounts.get(direction) || 0) + 1);
            });

            if (typeof day.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
                errors.push(`La date de la journée ${day.day} est absente ou invalide.`);
            } else {
                const parsedDate = new Date(day.date + "T12:00:00");
                if (Number.isNaN(parsedDate.getTime()) ||
                    parsedDate.toISOString().slice(0, 10) !== day.date) {
                    errors.push(`La date "${day.date}" de la journée ${day.day} n'existe pas.`);
                }

                if (seenDates.has(day.date)) {
                    errors.push(`La date ${day.date} est attribuée à plusieurs journées.`);
                }
                seenDates.add(day.date);

                if (index > 0 && this.matchdays[index - 1]?.date &&
                    day.date <= this.matchdays[index - 1].date) {
                    errors.push("Les dates des journées ne sont pas strictement croissantes.");
                }
            }
        });

        if (totalMatches !== expectedMatches) {
            errors.push(
                `Nombre total de matchs incorrect : ${totalMatches} trouvés, ${expectedMatches} attendus.`
            );
        }

        if (teamCount >= 2) {
            for (let i = 0; i < teams.length; i++) {
                for (let j = i + 1; j < teams.length; j++) {
                    const teamA = teams[i];
                    const teamB = teams[j];
                    const pair = [teamA, teamB].sort().join("|||");
                    const pairCount = pairCounts.get(pair) || 0;
                    const aHome = homeAwayCounts.get(teamA + ">>>" + teamB) || 0;
                    const bHome = homeAwayCounts.get(teamB + ">>>" + teamA) || 0;

                    if (pairCount !== 2) {
                        errors.push(
                            `${teamA} et ${teamB} se rencontrent ${pairCount} fois au lieu de 2.`
                        );
                    }

                    if (aHome !== 1 || bHome !== 1) {
                        errors.push(
                            `${teamA} et ${teamB} doivent se rencontrer une fois dans chaque stade (domicile/extérieur).`
                        );
                    }
                }
            }
        }

        if (errors.length > 0) {
            warnings.push("Le calendrier doit être corrigé avant d'être considéré comme valide.");
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            summary: {
                teams: teamCount,
                matchdays: this.matchdays.length,
                matches: totalMatches,
                expectedMatchdays,
                expectedMatches
            }
        };
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
