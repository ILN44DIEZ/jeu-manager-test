class UI {

    constructor() {

        this.container =
            document.getElementById("game");

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



    showMessage(message) {

        const p =
            document.createElement("p");


        p.textContent = message;


        this.container.appendChild(p);

    }



    showManager(manager) {

        this.clear();


        this.showTitle(
            "Carrière Manager"
        );


        this.showMessage(
            "Club : " +
            manager.clubName
        );


        this.showMessage(
            "Budget : " +
            manager.budget +
            " €"
        );


        this.showMessage(
            "Réputation : " +
            manager.reputation
        );

    }



    showPlayers(squad) {

        this.clear();


        this.showTitle(
            "Effectif"
        );


        squad.players.forEach(player => {


            const p =
                document.createElement("p");


            p.textContent =
                player.getFullName()
                +
                " - "
                +
                player.position
                +
                " - "
                +
                player.overall;


            this.container.appendChild(p);


        });

    }



    showTactics(tactics) {

        this.clear();


        this.showTitle(
            "Tactique"
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



}