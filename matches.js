class MatchEngine {
    constructor() {
        this.history = [];
    }

    simulateMatch(homeTeam, awayTeam) {
        const homeGoals = Math.floor(Math.random() * 5);
        const awayGoals = Math.floor(Math.random() * 5);

        const result = {
            homeTeam,
            awayTeam,
            homeGoals,
            awayGoals,
            date: new Date().toLocaleDateString()
        };

        this.history.push(result);

        return result;
    }

    displayResult(match) {
        console.log(
            `${match.homeTeam} ${match.homeGoals} - ${match.awayGoals} ${match.awayTeam}`
        );
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
    }
}