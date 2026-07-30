class ChampionshipCalendar {
    constructor(teams) {
        this.teams = teams;
        this.matchdays = [];
    }

    generateCalendar() {
        let teams = [...this.teams];

        if (teams.length % 2 !== 0) {
            teams.push("Exempt");
        }

        let totalRounds = teams.length - 1;
        let matchesPerRound = teams.length / 2;

        let rotation = [...teams];

        for (let round = 0; round < totalRounds; round++) {
            let matches = [];

            for (let i = 0; i < matchesPerRound; i++) {
                let home = rotation[i];
                let away = rotation[rotation.length - 1 - i];

                if (home !== "Exempt" && away !== "Exempt") {
                    matches.push({
                        home: home,
                        away: away
                    });
                }
            }

            this.matchdays.push({
                day: round + 1,
                matches: matches
            });

            rotation.splice(1, 0, rotation.pop());
        }

        return this.matchdays;
    }


    generateReturnMatches() {
        let returnMatches = this.matchdays.map(day => {
            return {
                day: day.day + this.matchdays.length,
                matches: day.matches.map(match => {
                    return {
                        home: match.away,
                        away: match.home
                    };
                })
            };
        });

        this.matchdays = [
            ...this.matchdays,
            ...returnMatches
        ];

        return this.matchdays;
    }


    displayCalendar() {
        console.log("=== CALENDRIER ===");

        this.matchdays.forEach(day => {
            console.log("Journée " + day.day);

            day.matches.forEach(match => {
                console.log(
                    match.home + " - " + match.away
                );
            });
        });
    }
}