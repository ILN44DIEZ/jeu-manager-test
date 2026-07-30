class ManagerCareer {
    constructor(managerName, club) {
        this.managerName = managerName;
        this.club = club;

        this.season = "2026/2027";
        this.reputation = 50;
        this.budget = 10000000;

        this.objectives = [
            "Finir dans le top 5 du championnat",
            "Développer de jeunes joueurs",
            "Respecter le budget du club"
        ];
    }

    startCareer() {
        console.log("=== NOUVELLE CARRIÈRE ===");
        console.log("Manager :", this.managerName);
        console.log("Club :", this.club);
        console.log("Saison :", this.season);
        console.log("Réputation :", this.reputation);
        console.log("Budget :", this.budget + " €");

        console.log("Objectifs :");
        this.objectives.forEach(objective => {
            console.log("- " + objective);
        });
    }

    increaseReputation(points) {
        this.reputation += points;

        if (this.reputation > 100) {
            this.reputation = 100;
        }
    }

    decreaseReputation(points) {
        this.reputation -= points;

        if (this.reputation < 0) {
            this.reputation = 0;
        }
    }

    addBudget(amount) {
        this.budget += amount;
    }

    spendBudget(amount) {
        this.budget -= amount;

        if (this.budget < 0) {
            this.budget = 0;
        }
    }
}