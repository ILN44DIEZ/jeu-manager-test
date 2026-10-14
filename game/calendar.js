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

        // Une ligue paire a N-1 journées aller ; une ligue impaire
        // ajoute une équipe fictive et en compte N.
        const firstHalfLength = this.matchdays.length;
        const firstHalf = this.matchdays.slice(0, firstHalfLength);


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
                    if (homeState?.last === "home" && homeState.consecutive >= 2) penalty += 1;
                    if (awayState?.last === "away" && awayState.consecutive >= 2) penalty += 1;
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
