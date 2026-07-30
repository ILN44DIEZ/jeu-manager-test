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



        this.showMessage(

            "👔 Entraîneur : "
            +
            manager.managerName

        );



        this.showMessage(

            "🏟️ Club : "
            +
            manager.clubName

        );



        this.showMessage(

            "💰 Budget : "
            +
            manager.budget.toLocaleString()
            +
            " €"

        );



        this.showMessage(

            "⭐ Réputation : "
            +
            manager.reputation

        );



        this.showMessage(

            "📅 Saison : "
            +
            manager.season

        );



        this.showTitle(
            "🎯 Objectifs"
        );



        manager.objectives.forEach(objective => {


            this.showMessage(

                "• "
                +
                objective

            );


        });

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



    showTactics(tactics) {

        this.clear();


        this.showTitle(
            "🧠 Tactique"
        );


        this.showMessage(

            "Formation : "
            +
            tactics.formation

        );


        this.showMessage(

            "Mentalité : "
            +
            tactics.style.mentality

        );

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

    this.flags[league] + " " + league,

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
        "🏟️ " + league
    );


    const clubs =
        dataManager.getClubsByLeague(league);



    clubs.forEach(club => {


        this.createButton(

            "🏟️ " + club.nom,

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
        "🏟️ " + club.nom
    );


    this.showMessage(
        "⭐ Niveau : "
        + club.niveau
    );


    this.showMessage(
        "💰 Budget : "
        +
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