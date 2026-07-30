class TransferMarket {

    constructor(clubName = "", budget = 0) {

        this.clubName = clubName;

        this.budget = budget;

        this.availablePlayers = [];

        this.transferHistory = [];
    }



    addPlayerToMarket(player) {

        // Création d'un contrat si absent
        if (!player.contract) {

            player.contract = {

                years: 3,

                salary: player.salary || 5000
            };
        }


        this.availablePlayers.push(player);
    }



    removePlayerFromMarket(playerId) {

        this.availablePlayers =
            this.availablePlayers.filter(
                player => player.id !== playerId
            );
    }



    findPlayer(playerId) {

        return this.availablePlayers.find(
            player => player.id === playerId
        );
    }



    negotiateContract(player, years, salary) {

        if (!player) {
            return false;
        }


        let chance =
            Math.random();


        // Le joueur accepte
        if (chance > 0.3) {

            player.contract = {

                years: years,

                salary: salary
            };


            return true;
        }


        return false;
    }



    buyPlayer(player, squad) {

        if (!player) {
            return false;
        }


        if (this.budget < player.value) {

            console.log(
                "Budget insuffisant"
            );

            return false;
        }


        this.budget -= player.value;


        squad.addPlayer(player);


        this.removePlayerFromMarket(
            player.id
        );


        this.transferHistory.push({

            type: "achat",

            player:
                player.getFullName(),

            price:
                player.value,

            date:
                new Date()
        });


        return true;
    }



    sellPlayer(player, squad) {

        if (!player) {
            return false;
        }


        squad.removePlayer(
            player.id
        );


        this.budget += player.value;


        this.transferHistory.push({

            type: "vente",

            player:
                player.getFullName(),

            price:
                player.value,

            date:
                new Date()
        });


        return true;
    }



    loanPlayer(player, clubName, duration) {

        if (!player) {
            return false;
        }


        player.loan = {

            club: clubName,

            months: duration
        };


        this.transferHistory.push({

            type: "prêt",

            player:
                player.getFullName(),

            destination:
                clubName
        });


        return true;
    }



    getMarketPlayers() {

        return this.availablePlayers;
    }



    getHistory() {

        return this.transferHistory;
    }



    getBudget() {

        return this.budget;
    }

}