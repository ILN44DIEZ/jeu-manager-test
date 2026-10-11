class SquadUI {

    constructor(ui) {

        this.ui = ui;

        this.container =
            ui.container;

        this.currentManager = null;

    }



    /* ================================================= */
    /* NETTOYAGE */
    /* ================================================= */

    clear() {

        this.container.innerHTML = "";

    }



    /* ================================================= */
    /* AFFICHAGE EFFECTIF */
    /* ================================================= */

    showClubPlayers(players, manager) {

        this.currentManager = manager;
        this.clear();
        this.ui.showTitle("👥 Effectif " + manager.clubName);

        if (!Array.isArray(players) || players.length === 0) {
            this.ui.showMessage("Aucun joueur trouvé.");
            this.ui.createButton("⬅️ Retour carrière", () => this.ui.showManager(manager));
            return;
        }

        const toolbar = document.createElement("div");
        toolbar.style.display = "grid";
        toolbar.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
        toolbar.style.gap = "10px";
        toolbar.style.margin = "15px 0";
        toolbar.style.padding = "0 5px";

        const search = document.createElement("input");
        search.type = "search";
        search.placeholder = "🔎 Rechercher un joueur...";
        search.setAttribute("aria-label", "Rechercher un joueur");
        search.style.boxSizing = "border-box";
        search.style.width = "100%";
        search.style.minWidth = "0";
        search.style.padding = "12px";
        search.style.borderRadius = "8px";
        search.style.border = "1px solid #666";
        search.style.fontSize = "16px";

        const positionFilter = document.createElement("select");
        positionFilter.setAttribute("aria-label", "Filtrer par poste");
        positionFilter.style.width = "100%";
        positionFilter.style.minWidth = "0";
        positionFilter.style.padding = "12px";
        positionFilter.style.borderRadius = "8px";
        positionFilter.style.fontSize = "16px";

        [
            ["all", "Tous les postes"],
            ["GB", "Gardiens"],
            ["DEF", "Défenseurs"],
            ["MIL", "Milieux"],
            ["ATT", "Attaquants"],
            ["OTHER", "Autres"]
        ].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            positionFilter.appendChild(option);
        });

        const sortSelect = document.createElement("select");
        sortSelect.setAttribute("aria-label", "Trier les joueurs");
        sortSelect.style.width = "100%";
        sortSelect.style.minWidth = "0";
        sortSelect.style.padding = "12px";
        sortSelect.style.borderRadius = "8px";
        sortSelect.style.fontSize = "16px";

        [
            ["default", "Tri : poste"],
            ["note", "Meilleure note"],
            ["potential", "Meilleur potentiel"],
            ["age", "Âge : du plus jeune"],
            ["value", "Valeur marchande"]
        ].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            sortSelect.appendChild(option);
        });

        toolbar.appendChild(search);
        toolbar.appendChild(positionFilter);
        toolbar.appendChild(sortSelect);
        this.container.appendChild(toolbar);

        const count = document.createElement("p");
        count.style.margin = "8px 0 15px";
        count.style.color = "#bbb";
        this.container.appendChild(count);

        const resultsContainer = document.createElement("div");
        resultsContainer.className = "squad-results";
        this.container.appendChild(resultsContainer);

        const getPositionGroup = player => {
            const position = String(player.poste || player.position || "").trim().toUpperCase();

            if (["GB", "GK"].includes(position)) return "GB";
            if (["DC", "DCD", "DCG", "DD", "DG", "DLD", "DLG", "DDG", "DL", "DF", "DCDG"].includes(position)) return "DEF";
            if (["MDC", "MC", "MCD", "MCG", "MD", "MG", "MOC", "MOCD", "MOCG", "MR", "ML", "MIL"].includes(position)) return "MIL";
            if (["BU", "AC", "AD", "AG", "AT", "AV", "SA"].includes(position)) return "ATT";

            return "OTHER";
        };

        const renderPlayers = () => {
            const query = search.value.trim().toLocaleLowerCase("fr");
            const selectedPosition = positionFilter.value;
            const sortBy = sortSelect.value;

            let filtered = players.filter(player => {
                const fullName = [player.prenom || "", player.nom || ""]
                    .join(" ").toLocaleLowerCase("fr");
                const position = String(player.poste || player.position || "")
                    .toLocaleLowerCase("fr");
                const nationality = String(player.nationalite || "").toLocaleLowerCase("fr");

                const matchesSearch =
                    fullName.includes(query) ||
                    position.includes(query) ||
                    nationality.includes(query);

                const matchesPosition =
                    selectedPosition === "all" ||
                    getPositionGroup(player) === selectedPosition;

                return matchesSearch && matchesPosition;
            });

            if (sortBy === "note") {
                filtered.sort((a, b) => (Number(b.note) || 0) - (Number(a.note) || 0));
            } else if (sortBy === "potential") {
                filtered.sort((a, b) => (Number(b.potentiel) || 0) - (Number(a.potentiel) || 0));
            } else if (sortBy === "age") {
                filtered.sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0));
            } else if (sortBy === "value") {
                filtered.sort((a, b) => (Number(b.valeur) || 0) - (Number(a.valeur) || 0));
            }

            resultsContainer.innerHTML = "";
            count.textContent = filtered.length + " joueur" +
                (filtered.length > 1 ? "s" : "") + " affiché" +
                (filtered.length > 1 ? "s" : "");

            if (filtered.length === 0) {
                const empty = document.createElement("p");
                empty.textContent = "Aucun joueur ne correspond à ta recherche.";
                empty.style.padding = "15px";
                resultsContainer.appendChild(empty);
                return;
            }

            [
                { key: "GB", title: "🧤 Gardiens" },
                { key: "DEF", title: "🛡️ Défenseurs" },
                { key: "MIL", title: "⚙️ Milieux" },
                { key: "ATT", title: "⚡ Attaquants" },
                { key: "OTHER", title: "👤 Autres" }
            ].forEach(group => {
                const groupPlayers = filtered.filter(player => getPositionGroup(player) === group.key);
                if (groupPlayers.length > 0) {
                    this.showPlayerCategory(group.title, groupPlayers, resultsContainer);
                }
            });
        };

        search.addEventListener("input", renderPlayers);
        positionFilter.addEventListener("change", renderPlayers);
        sortSelect.addEventListener("change", renderPlayers);
        renderPlayers();

        this.ui.createButton("⬅️ Retour carrière", () => this.ui.showManager(manager));
    }


    /* ================================================= */
    /* CATÉGORIE DE JOUEURS */
    /* ================================================= */

    showPlayerCategory(
        title,
        players,
        targetContainer = this.container
    ) {

        if (
            players.length === 0
        ) {

            return;

        }


        this.ui.showTitle(
            title
        );


        /* ================================================= */
        /* GRILLE */
        /* ================================================= */

        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "players-grid";


        grid.style.display =
            "grid";


        grid.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(125px, 1fr))";


        grid.style.gap =
            "10px";


        grid.style.width =
            "100%";


        grid.style.boxSizing =
            "border-box";


        players.forEach(
            player => {

                const card =
                    this.createPlayerCard(
                        player
                    );


                grid.appendChild(
                    card
                );

            }
        );


        targetContainer.appendChild(
            grid
        );

    }



    /* ================================================= */
    /* CARTE JOUEUR */
    /* ================================================= */

    createPlayerCard(player) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "player-card";


        card.style.border =
            "1px solid #ccc";


        card.style.borderRadius =
            "10px";


        card.style.padding =
            "10px";


        card.style.margin =
            "0";


        card.style.cursor =
            "pointer";


        card.style.textAlign =
            "center";


        card.style.boxSizing =
            "border-box";


        card.style.minWidth =
            "0";


        card.style.transition =
            "transform 0.15s";


        /* ================================================= */
        /* CONTENU */
        /* ================================================= */

        card.innerHTML = `

            <strong>
                ${player.prenom}
                ${player.nom}
            </strong>

            <br>

            ${player.poste}
            • ⭐ ${player.note}

            <br>

            🎂 ${player.age} ans

            <br>

            💶 ${player.valeur.toLocaleString()} €

        `;


        /* ================================================= */
        /* EFFET SOURIS */
        /* ================================================= */

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "scale(1.02)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "scale(1)";

            }
        );


        /* ================================================= */
        /* CLIC */
        /* ================================================= */

        card.addEventListener(

            "click",

            () => {

                this.showPlayerProfile(

                    player,

                    this.currentManager

                );

            }

        );


        return card;

    }



    /* ================================================= */
    /* FICHE JOUEUR */
    /* ================================================= */

    showPlayerProfile(
        player,
        manager
    ) {

        this.clear();


        this.ui.showTitle(
            player.prenom +
            " " +
            player.nom
        );


        this.ui.showMessage(
            "🌍 Nationalité : " +
            player.nationalite
        );


        this.ui.showMessage(
            "📍 Poste : " +
            player.poste
        );


        this.ui.showMessage(
            "⭐ Note : " +
            player.note
        );


        this.ui.showMessage(
            "📈 Potentiel : " +
            player.potentiel
        );


        this.ui.showMessage(
            "🎂 Âge : " +
            player.age +
            " ans"
        );


        this.ui.showMessage(
            "📏 Taille : " +
            player.taille +
            " cm"
        );


        this.ui.showMessage(
            "⚖️ Poids : " +
            player.poids +
            " kg"
        );


        this.ui.showMessage(
            "👟 Pied : " +
            player.pied
        );


        this.ui.showMessage(
            "🔢 Numéro : " +
            player.numero
        );


        this.ui.showMessage(
            "💶 Valeur : " +
            player.valeur.toLocaleString() +
            " €"
        );


        this.ui.showMessage(
            "💰 Salaire : " +
            player.salaire.toLocaleString() +
            " €"
        );


        this.ui.showMessage(
            "📄 Contrat : " +
            player.contratFin
        );


        this.ui.showMessage(
            "😊 Forme : " +
            player.forme
        );


        this.ui.showMessage(
            "💪 Moral : " +
            player.moral
        );


        this.ui.showMessage(
            "😴 Fatigue : " +
            player.fatigue
        );


        this.ui.showMessage(
            "🏥 Blessure : " +
            (
                player.blessure
                    ? "Oui"
                    : "Non"
            )
        );


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.ui.createButton(

            "⬅️ Retour",

            () => {

                this.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );

    }

}
