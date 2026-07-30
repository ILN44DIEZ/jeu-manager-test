class Standings {
    constructor(teams) {
        this.table = teams.map(team => ({
            team: team,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            form: []
        }));
    }

    update(match) {
        const home = this.table.find(t => t.team === match.homeTeam);
        const away = this.table.find(t => t.team === match.awayTeam);

        if (!home || !away) return;

        home.played++;
        away.played++;

        home.goalsFor += match.homeGoals;
        home.goalsAgainst += match.awayGoals;

        away.goalsFor += match.awayGoals;
        away.goalsAgainst += match.homeGoals;

        home.goalDifference = home.goalsFor - home.goalsAgainst;
        away.goalDifference = away.goalsFor - away.goalsAgainst;

        if (match.homeGoals > match.awayGoals) {
            home.wins++;
            home.points += 3;

            away.losses++;

            home.form.push("V");
            away.form.push("D");

        } else if (match.homeGoals < match.awayGoals) {
            away.wins++;
            away.points += 3;

            home.losses++;

            away.form.push("V");
            home.form.push("D");

        } else {
            home.draws++;
            away.draws++;

            home.points++;
            away.points++;

            home.form.push("N");
            away.form.push("N");
        }

        home.form = home.form.slice(-5);
        away.form = away.form.slice(-5);

        this.sortTable();
    }

    sortTable() {
        this.table.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }

            return b.goalsFor - a.goalsFor;
        });
    }

    getTable() {
        return this.table;
    }
}