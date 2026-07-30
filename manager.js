class ManagerCareer {

    constructor() {

        this.managerName = "";

        this.club = null;

        this.season = 1;

        this.budget = 0;

        this.reputation = 0;

        this.objectives = [];

        this.history = [];

    }



    startCareer(managerName, club) {

        this.managerName = managerName;

        this.club = club;


        this.budget = club.budget || 0;

        this.reputation = club.reputation || 50;


        this.objectives = [

            "Terminer la saison avec succès",

            "Développer les joueurs",

            "Respecter le budget"

        ];


        this.history.push({

            season: this.season,

            club: club.name

        });


        return true;

    }



    getClubName() {

        if (!this.club) {

            return "Aucun club";

        }


        return this.club.name;

    }



    changeBudget(amount) {

        this.budget += amount;


        if (this.budget < 0) {

            this.budget = 0;

        }

    }



    changeReputation(amount) {

        this.reputation += amount;


        if (this.reputation < 0) {

            this.reputation = 0;

        }


        if (this.reputation > 100) {

            this.reputation = 100;

        }

    }



    nextSeason() {

        this.season++;

    }



    getData() {

        return {

            managerName: this.managerName,

            club: this.club,

            season: this.season,

            budget: this.budget,

            reputation: this.reputation,

            objectives: this.objectives,

            history: this.history

        };

    }

}