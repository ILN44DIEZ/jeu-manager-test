class UI {

    constructor() {

        this.container =
            document.getElementById("game");


        this.flags = {

            "Premier League": "🇬🇧",
            "Liga": "🇪🇸",
            "Serie A": "🇮🇹",
            "Bundesliga": "🇩🇪",
            "Ligue 1": "🇫🇷"

        };


        this.squadUI =
            new SquadUI(this);


        this.tacticsUI =
            new TacticsUI(this);

    }



    clear() {

        this.container.innerHTML = "";

    }



    showTitle(title) {

        const h2 =
            document.createElement("h2");


        h2.textContent = title;


        this.container.appendChild(h2);

    }



    showMessage(message) {

        const p =
            document.createElement("p");


        p.textContent = message;


        this.container.appendChild(p);

    }



    createButton(text, action) {

        const button =
            document.createElement("button");


        button.textContent = text;


        button.addEventListener(
            "click",
            action
        );


        this.container.appendChild(button);


        return button;

    }



    showManager(manager) {

        this.clear();



        if (manager.logo) {

            const img =
                document.createElement("img");


            img.src =
                "assets/logos/" +
                manager.logo;


            img.width = 120;


            img.style.display = "block";

            img.style.margin = "auto";


            this.container.appendChild(img);

        }



        this.showTitle(
            "🎴 Carrière Manager"
        );



        this.showMessage(
            "🏟️ Club : " +
            manager.clubName
        );



        if (manager.country) {

            this.showMessage(
                "🌍 Pays : " +
                manager.country
            );

        }



        if (manager.league) {

            this.showMessage(
                "🏆 Ligue : " +
                manager.league
            );

        }



        if (manager.level) {

            this.showMessage(
                "⭐ Niveau : " +
                manager.level
            );

        }



        this.showTitle(
            "👔 Manager"
        );



        this.showMessage(
            "Nom : " +
            manager.managerName
        );



        this.showMessage(
            "📅 Saison : " +
            manager.season
        );



        this.showTitle(
            "💰 Gestion"
        );



        this.showMessage(
            "Budget : " +
            manager.budget.toLocaleString()
            +
            " €"
        );



        this.showMessage(
            "⭐ Réputation : " +
            manager.reputation
        );



        this.showTitle(
            "🎯 Objectifs"
        );



        manager.objectives.forEach(objective => {

            this.showMessage(
                "• " +
                objective
            );

        });



        this.createButton(

            "👥 Effectif",

            () => {

                this.squadUI.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );



        this.createButton(

            "🧠 Tactiques",

            () => {

                this.tacticsUI.show(

                    game.tactics,

                    manager

                );

            }

        );



        this.createButton(

            "🏠 Menu carrière",

            () => {

                console.log(
                    "Retour menu"
                );

            }

        );

    }



    showPlayers(squad) {

        this.clear();


        this.showTitle(
            "👥 Effectif"
        );


        squad.players.forEach(player => {

            this.showMessage(

                player.getFullName()
                +
                " - "
                +
                player.position
                +
                " - "
                +
                player.overall

            );

        });

    }



    showLeagueSelection(dataManager) {

        this.clear();


        this.showTitle(
            "🏆 Choisir une ligue"
        );


        const leagues =
            dataManager.getLeagues();



        leagues.forEach(league => {

            this.createButton(

                this.flags[league]
                +
                " "
                +
                league,

                () => {

                    this.showClubSelection(
                        dataManager,
                        league
                    );

                }

            );

        });

    }



    showClubSelection(dataManager, league) {

        this.clear();


        this.showTitle(
            "🏟️ " +
            league
        );


        const clubs =
            dataManager.getClubsByLeague(
                league
            );



        clubs.forEach(club => {

            this.createButton(

                "🏟️ " +
                club.nom,

                () => {

                    this.showClubDetails(

                        club,

                        dataManager,

                        league

                    );

                }

            );

        });

    }



    showClubDetails(club, dataManager, league) {

        this.clear();


        this.showTitle(
            "🏟️ " +
            club.nom
        );



        this.showMessage(
            "⭐ Niveau : " +
            club.niveau
        );



        this.showMessage(
            "💰 Budget : " +
            club.budget.toLocaleString()
            +
            " €"
        );



        this.createButton(

            "✅ Choisir ce club",

            () => {

                chooseClub(club);

            }

        );



        this.createButton(

            "⬅️ Retour",

            () => {

                this.showClubSelection(

                    dataManager,

                    league

                );

            }

        );

    }

}