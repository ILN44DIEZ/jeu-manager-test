class Standings {

    constructor(teams) {

        this.table =
            teams.map(
                team => ({

                    team:
                        team,

                    played:
                        0,

                    wins:
                        0,

                    draws:
                        0,

                    losses:
                        0,

                    goalsFor:
                        0,

                    goalsAgainst:
                        0,

                    goalDifference:
                        0,

                    points:
                        0,

                    form:
                        []

                })
            );

    }



    /* ================================================= */
    /* MISE À JOUR APRÈS UN MATCH */
    /* ================================================= */

    update(match) {
        // Refuser les résultats incomplets ou incohérents pour éviter de
        // contaminer le classement avec des valeurs NaN ou un match fictif.
        if (!match ||
            typeof match.homeTeam !== "string" ||
            typeof match.awayTeam !== "string" ||
            !match.homeTeam.trim() ||
            !match.awayTeam.trim() ||
            match.homeTeam === match.awayTeam) {
            return false;
        }

        const homeGoals = Number(match.homeGoals);
        const awayGoals = Number(match.awayGoals);
        if (!Number.isInteger(homeGoals) || homeGoals < 0 ||
            !Number.isInteger(awayGoals) || awayGoals < 0) {
            return false;
        }

        const home = this.table.find(team => team.team === match.homeTeam);
        const away = this.table.find(team => team.team === match.awayTeam);
        if (!home || !away || home === away) {
            return false;
        }

        home.played++;
        away.played++;

        home.goalsFor += homeGoals;
        home.goalsAgainst += awayGoals;
        away.goalsFor += awayGoals;
        away.goalsAgainst += homeGoals;

        home.goalDifference = home.goalsFor - home.goalsAgainst;
        away.goalDifference = away.goalsFor - away.goalsAgainst;

        if (homeGoals > awayGoals) {
            home.wins++;
            home.points += 3;
            away.losses++;
            home.form.push("V");
            away.form.push("D");
        } else if (homeGoals < awayGoals) {
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
        return true;
    }



    /* ================================================= */
    /* TRI DU CLASSEMENT */
    /* ================================================= */

    sortTable() {

        this.table.sort(
            (a, b) => {

                /* Points */

                if (
                    b.points !==
                    a.points
                ) {

                    return (
                        b.points -
                        a.points
                    );

                }


                /* Différence de buts */

                if (
                    b.goalDifference !==
                    a.goalDifference
                ) {

                    return (
                        b.goalDifference -
                        a.goalDifference
                    );

                }


                /* Buts marqués */

                if (
                    b.goalsFor !==
                    a.goalsFor
                ) {

                    return (
                        b.goalsFor -
                        a.goalsFor
                    );

                }


                /* Nom du club */

                return a.team.localeCompare(
                    b.team
                );

            }
        );

    }



    /* ================================================= */
    /* RÉINITIALISER LE CLASSEMENT */
    /* ================================================= */

    reset() {

        this.table.forEach(
            team => {

                team.played = 0;

                team.wins = 0;

                team.draws = 0;

                team.losses = 0;

                team.goalsFor = 0;

                team.goalsAgainst = 0;

                team.goalDifference = 0;

                team.points = 0;

                team.form = [];

            }
        );


        this.sortTable();

    }



    /* ================================================= */
    /* RÉCUPÉRER LE CLASSEMENT */
    /* ================================================= */

    getTable() {

        return this.table;

    }



    /* ================================================= */
    /* RÉCUPÉRER UNE ÉQUIPE */
    /* ================================================= */

    getTeam(teamName) {

        return this.table.find(
            team =>
                team.team ===
                teamName
        );

    }



    /* ================================================= */
    /* POSITION D'UNE ÉQUIPE */
    /* ================================================= */

    getPosition(teamName) {

        const index =
            this.table.findIndex(
                team =>
                    team.team ===
                    teamName
            );


        if (
            index === -1
        ) {

            return null;

        }


        return index + 1;

    }

}
