class PlayerUI {

    constructor(ui) {
        this.ui = ui;
        this.container = ui.container;
    }

    showProfile(player, manager, onBack, options = {}) {
        this.ui.clear();

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.textContent = options.backLabel || "← Retour à l'effectif";
        backButton.style.width = "auto";
        backButton.style.padding = "6px 10px";
        backButton.style.fontSize = "13px";
        backButton.style.borderRadius = "8px";
        backButton.style.margin = "0 0 12px";
        backButton.addEventListener("click", () => {
            if (typeof onBack === "function") {
                onBack();
            } else if (typeof game !== "undefined" && game.ui && game.players) {
                game.ui.squadUI.showClubPlayers(game.players, manager);
            } else if (manager) {
                this.ui.showManager(manager);
            }
        });
        this.container.appendChild(backButton);

        const fullName = [player.prenom || "", player.nom || ""].join(" ").trim();
        this.ui.showTitle(fullName || "Fiche joueur");

        const overview = document.createElement("div");
        overview.style.maxWidth = "700px";
        overview.style.margin = "0 auto";
        overview.style.padding = "16px";
        overview.style.border = "1px solid #444";
        overview.style.borderRadius = "14px";
        overview.style.background = "#1c1c1c";
        overview.style.boxSizing = "border-box";

        const heading = document.createElement("div");
        heading.style.display = "grid";
        heading.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
        heading.style.gap = "10px";
        heading.style.marginBottom = "16px";

        const stat = (label, value, emphasis = false) => {
            const item = document.createElement("div");
            item.style.padding = "12px";
            item.style.borderRadius = "10px";
            item.style.background = "#292929";
            const caption = document.createElement("div");
            caption.textContent = label;
            caption.style.fontSize = "13px";
            caption.style.color = "#bbb";
            const number = document.createElement("strong");
            number.textContent = value === undefined || value === null || value === "" ? "—" : String(value);
            number.style.display = "block";
            number.style.marginTop = "5px";
            number.style.fontSize = emphasis ? "24px" : "17px";
            item.append(caption, number);
            heading.appendChild(item);
        };

        stat("⭐ Note", player.note, true);
        if (!options.hidePotential) {
            stat("📈 Potentiel", player.potentiel, true);
        }
        stat("🎂 Âge", player.age === undefined ? "—" : player.age + " ans");
        stat("📍 Poste", player.poste || player.position || "—");

        overview.appendChild(heading);

        const section = document.createElement("h3");
        section.textContent = "Informations du joueur";
        overview.appendChild(section);

        const details = [
            ["🌍 Nationalité", player.nationalite],
            ["🏟️ Club", player.club || (manager && manager.clubName)],
            ["📏 Taille", player.taille == null ? null : player.taille + " cm"],
            ["⚖️ Poids", player.poids == null ? null : player.poids + " kg"],
            ["👟 Pied préféré", player.pied],
            ["🔢 Numéro", player.numero],
            ["💶 Valeur marchande", player.valeur == null ? null : Number(player.valeur).toLocaleString("fr-FR") + " €"],
            ["💰 Salaire", player.salaire == null ? null : Number(player.salaire).toLocaleString("fr-FR") + " € / semaine"],
            ["📄 Fin de contrat", player.contratFin],
            ["😊 Forme", player.forme == null ? null : player.forme + " / 100"],
            ["💪 Moral", player.moral == null ? null : player.moral + " / 100"],
            ["😴 Fatigue", player.fatigue == null ? null : player.fatigue + " / 100"],
            ["🏥 Blessure", player.blessure ? "Oui" : "Non"],
            ["⏳ Jours de blessure", player.joursBlessure],
            ["🟨 Cartons jaunes", player.cartonsJaunes],
            ["🟥 Cartons rouges", player.cartonsRouges],
            ["⚽ Buts", player.buts],
            ["🎯 Passes décisives", player.passes],
            ["🕒 Matchs joués", player.matchs],
            ["⏱️ Minutes jouées", player.minutes]
        ];

        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
        grid.style.gap = "8px";

        details.forEach(([label, value]) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.gap = "12px";
            row.style.padding = "10px";
            row.style.borderBottom = "1px solid #333";

            const name = document.createElement("span");
            name.textContent = label;
            name.style.color = "#ccc";

            const valueElement = document.createElement("strong");
            valueElement.textContent = value === undefined || value === null || value === "" ? "—" : String(value);
            valueElement.style.textAlign = "right";

            row.append(name, valueElement);
            grid.appendChild(row);
        });

        overview.appendChild(grid);
        this.container.appendChild(overview);


    }
}
