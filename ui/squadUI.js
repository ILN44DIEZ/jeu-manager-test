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

        // Résumé rapide de l'effectif
        const summary = document.createElement("div");
        summary.style.display = "grid";
        summary.style.gridTemplateColumns = "repeat(auto-fit, minmax(130px, 1fr))";
        summary.style.gap = "10px";
        summary.style.margin = "15px 0";
        
        const average = key => players.length
            ? players.reduce((sum, player) => sum + (Number(player[key]) || 0), 0) / players.length
            : 0;
        
        const totalValue = players.reduce((sum, player) => sum + (Number(player.valeur) || 0), 0);
        const summaryItems = [
            ["👥 Joueurs", players.length],
            ["⭐ Note moyenne", average("note").toFixed(1) + "/100"],
            ["🎂 Âge moyen", average("age").toFixed(1) + " ans"],
            ["💶 Valeur totale", totalValue.toLocaleString("fr-FR") + " €"]
        ];
        
        summaryItems.forEach(([label, value]) => {
            const card = document.createElement("div");
            card.style.padding = "12px";
            card.style.border = "1px solid #555";
            card.style.borderRadius = "10px";
            card.style.background = "rgba(255,255,255,0.04)";
            card.style.textAlign = "center";
            
            const title = document.createElement("div");
            title.textContent = label;
            title.style.fontSize = "13px";
            title.style.color = "#bbb";
            
            const number = document.createElement("strong");
            number.textContent = value;
            number.style.display = "block";
            number.style.marginTop = "5px";
            number.style.fontSize = "18px";
            
            card.append(title, number);
            summary.appendChild(card);
        });
        
        this.container.appendChild(summary);

        const injuryButton = this.ui.createButton(
            "🏥 Infirmerie",
            () => this.showInfirmary(players, manager)
        );
        const injuredCount = players.filter(player => {
            const days = Math.max(0, Number(player.joursBlessure ?? player.injuryDays) || 0);
            const injury = String(player.blessure ?? player.injury ?? "").trim().toLowerCase();
            return days > 0 || (injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury));
        }).length;
        injuryButton.textContent = "🏥 Infirmerie (" + injuredCount + ")";
        injuryButton.style.margin = "0 0 12px";

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
    /* INFIRMERIE ET HISTORIQUE DES BLESSURES */
    /* ================================================= */

    showInfirmary(players, manager, historyPage = 1) {
        this.clear();
        this.ui.showTitle("🏥 Infirmerie");

        const isInjured = player => {
            const days = Math.max(0, Number(player.joursBlessure ?? player.injuryDays) || 0);
            const injury = String(player.blessure ?? player.injury ?? "").trim().toLowerCase();
            return days > 0 || (injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury));
        };
        const nameOf = player => [player.prenom || player.firstName || "", player.nom || player.lastName || ""].filter(Boolean).join(" ") || "Joueur sans nom";
        const injured = players.filter(isInjured);

        this.ui.showMessage(injured.length
            ? injured.length + " joueur" + (injured.length > 1 ? "s" : "") + " actuellement blessé" + (injured.length > 1 ? "s" : "") + "."
            : "✅ Aucun joueur blessé.");

        injured.forEach(player => {
            const card = document.createElement("div");
            card.style.border = "1px solid #b94a48";
            card.style.borderRadius = "10px";
            card.style.padding = "12px";
            card.style.margin = "10px 0";
            const days = Math.max(0, Number(player.joursBlessure ?? player.injuryDays) || 0);
            const title = document.createElement("strong");
            title.textContent = "🩹 " + nameOf(player) + " · " + (player.poste || player.position || "Poste inconnu");
            const details = document.createElement("p");
            details.textContent = (player.blessure || player.injury || "Blessure") + " — " +
                (days > 0 ? days + " journée" + (days > 1 ? "s" : "") + " restante" + (days > 1 ? "s" : "") : "retour à vérifier");
            card.append(title, details);
            this.container.appendChild(card);
        });

        this.ui.showTitle("📋 Historique des blessures");
        const history = players.flatMap(player =>
            (Array.isArray(player.historiqueBlessures) ? player.historiqueBlessures : []).map(item => ({
                name: nameOf(player),
                item
            }))
        ).sort((a, b) => (Number(b.item.jour) || 0) - (Number(a.item.jour) || 0));

        if (!history.length) {
            this.ui.showMessage("Aucune blessure passée enregistrée pour le moment.");
        } else {
            const pageSize = 10;
            const pageCount = Math.max(1, Math.ceil(history.length / pageSize));
            const currentPage = Math.max(1, Math.min(pageCount, Number(historyPage) || 1));
            const visibleHistory = history.slice((currentPage - 1) * pageSize, currentPage * pageSize);

            this.ui.showMessage("Page " + currentPage + " / " + pageCount + " · " + history.length + " blessure(s) cette saison");
            visibleHistory.forEach(({ name, item }) => {
                const line = document.createElement("p");
                line.textContent = "• " + name + " — " + (item.type || "Blessure") +
                    " · Journée " + (item.jour || "?") +
                    " · " + (item.duree || "?") + " journée(s)";
                this.container.appendChild(line);
            });

            if (pageCount > 1) {
                const pagination = document.createElement("div");
                pagination.style.display = "flex";
                pagination.style.flexWrap = "wrap";
                pagination.style.gap = "6px";
                pagination.style.margin = "12px 0";
                for (let page = 1; page <= pageCount; page++) {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.textContent = String(page);
                    button.disabled = page === currentPage;
                    button.setAttribute("aria-label", "Page " + page + " de l'historique des blessures");
                    button.addEventListener("click", () => this.showInfirmary(players, manager, page));
                    pagination.appendChild(button);
                }
                this.container.appendChild(pagination);
            }
        }

        this.ui.createButton("⬅️ Retour effectif", () => this.showClubPlayers(players, manager));
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


        // Le titre doit être ajouté au conteneur des résultats,
        // pas à la racine de l'interface, sinon il reste en bas
        // et se répète à chaque changement de filtre ou de tri.
        const heading = document.createElement("h2");
        heading.textContent = title;
        targetContainer.appendChild(heading);


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
        const current = this.ui?.tacticsUI?.getCanonicalPlayer ? this.ui.tacticsUI.getCanonicalPlayer(player) : player;
        const status = this.ui?.tacticsUI?.getPlayerConditionValues ? this.ui.tacticsUI.getPlayerConditionValues(current) : {
            injured: Number(current.joursBlessure ?? current.injuryDays) > 0 || !!current.blessure,
            injuryDays: Number(current.joursBlessure ?? current.injuryDays) || 0,
            form: Math.max(0, Math.min(100, Number(current.forme ?? current.form ?? current.moral ?? 70))),
            fatigue: Math.max(0, Math.min(100, Number(current.fatigue) || 0)),
            fitness: Math.max(0, Math.min(100, Number(current.conditionPhysique ?? current.fitness ?? current.condition ?? 100)))
        };
        const card = document.createElement("div"); card.className = "player-card";
        Object.assign(card.style, { border: status.injured ? "2px solid #e05252" : "1px solid #ccc", background: status.injured ? "rgba(224,82,82,.12)" : "", borderRadius: "10px", padding: "10px", margin: "0", cursor: "pointer", textAlign: "center", boxSizing: "border-box", minWidth: "0", transition: "transform .15s" });
        const name = [current.prenom ? current.prenom + " " : "", current.nom || current.lastName || "Joueur sans nom"].join("");
        card.innerHTML = "<strong>" + name + "</strong><br>" + (current.poste || current.position || "?") + " • ⭐ " + (current.note ?? current.overall ?? current.rating ?? "—") + "<br>🎂 " + (current.age ?? "—") + " ans<br>💶 " + Number(current.valeur ?? current.value ?? 0).toLocaleString("fr-FR") + " €<br>" + (status.injured ? "🤕 Blessé" + (status.injuryDays ? " · " + status.injuryDays + " j" : "") : "✅ Disponible") + "<br>";
        const indicators = document.createElement("span"); indicators.className = "player-condition-indicators";
        indicators.style.cssText = "display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:3px 7px;border:1px solid rgba(141,255,173,.25);border-radius:6px;background:rgba(10,45,20,.55);font-weight:800;white-space:nowrap";
        const form = document.createElement("span"); form.style.color = "#8dffad"; form.textContent = "▰ " + status.form;
        const energy = document.createElement("span"); energy.style.color = status.energyColor || this.ui?.tacticsUI?.getEnergyColor?.(status.energy) || "#35C759"; energy.textContent = "⚡ " + status.energy;
        indicators.append(form, energy); card.append(indicators, document.createElement("br"));
        card.addEventListener("mouseenter", () => { card.style.transform = "scale(1.02)"; });
        card.addEventListener("mouseleave", () => { card.style.transform = "scale(1)"; });
        card.addEventListener("click", () => this.showPlayerProfile(current, this.currentManager));
        return card;
    }

    /* ================================================= */
    /* FICHE JOUEUR */
    /* ================================================= */

    showPlayerProfile(player, manager) {
        this.ui.playerUI.showProfile(
            player,
            manager,
            () => this.showClubPlayers(game.players, manager)
        );
    }

}
