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


        this.playerUI =
            new PlayerUI(this);


        this.squadUI =
            new SquadUI(this);


        this.tacticsUI =
            new TacticsUI(this);


        this.currentLeagueMatchday =
            0;

        this.currentManagerView = null;
        this.initBottomNavigation();

    }



    /* ================================================= */
    /* BASE UI */
    /* ================================================= */

    clear() {

        this.container.innerHTML = "";
        this.container.classList.remove("manager-dashboard", "manager-welcome", "manager-saves-screen");

    }



    showTitle(title) {

        const h2 =
            document.createElement("h2");


        h2.textContent =
            title;


        this.container.appendChild(h2);

    }



    showMessage(message) {

        const p =
            document.createElement("p");


        p.textContent =
            message;


        this.container.appendChild(p);

    }



    createButton(text, action) {

        const button =
            document.createElement("button");


        button.textContent =
            text;

        if (/jouer le prochain match/i.test(text)) {
            button.classList.add("dashboard-primary");
        } else if (/retour au menu/i.test(text)) {
            button.classList.add("dashboard-back");
        } else if (/effectif|entraînement|marché des transferts|tactiques|championnat|calendrier|sauvegarder/i.test(text)) {
            button.classList.add("dashboard-action");
        }

        button.addEventListener(
            "click",
            action
        );

        // Tous les boutons de retour restent au même endroit :
        // en haut à gauche, comme dans le marché des transferts.
        if (/retour|←|⬅️/i.test(text)) {

            button.type = "button";
            button.style.width = "auto";
            button.style.display = "block";
            button.style.padding = "6px 10px";
            button.style.fontSize = "13px";
            button.style.borderRadius = "8px";
            button.style.margin = "0";
            button.style.textAlign = "left";
            // Le bouton suit le défilement, puis reste visible quand le haut de l'écran l'atteint.
            button.classList.add("manager-return-sticky");
            button.style.position = "sticky";
            button.style.top = "calc(env(safe-area-inset-top, 0px) + 8px)";
            button.style.left = "auto";
            button.style.zIndex = "100";
            button.style.width = "auto";
            button.style.maxWidth = "100%";
            button.style.boxShadow = "none";
            button.style.margin = "0 0 12px";
            button.style.justifySelf = "start";

            this.container.insertBefore(
                button,
                this.container.firstChild
            );

        } else {

            this.container.appendChild(
                button
            );

        }


        return button;

    }



    /* ================================================= */
    /* NAVIGATION MOBILE */
    /* ================================================= */

    initBottomNavigation() {
        if (this.bottomNav) return;

        const style = document.createElement("style");
        style.id = "manager-bottom-nav-styles";
        style.textContent = `
            #manager-bottom-nav {
                position: fixed;
                z-index: 10000;
                left: 10px;
                right: 10px;
                bottom: calc(8px + env(safe-area-inset-bottom, 0px));
                display: none;
                grid-template-columns: repeat(5, minmax(0, 1fr));
                gap: 2px;
                padding: 7px 5px 6px;
                border: 1px solid rgba(126, 151, 170, .22);
                border-radius: 17px;
                background: rgba(10, 24, 35, .96);
                box-shadow: 0 8px 28px rgba(0, 0, 0, .35);
                backdrop-filter: blur(18px);
                -webkit-backdrop-filter: blur(18px);
                box-sizing: border-box;
            }
            #manager-bottom-nav {
                position: fixed;
                isolation: isolate;
            }
            #manager-bottom-nav .manager-nav-indicator {
                position: absolute;
                z-index: 0;
                top: 7px;
                bottom: 6px;
                left: 5px;
                width: 0;
                border-radius: 10px;
                background: rgba(36, 214, 127, .14);
                box-shadow: inset 0 0 0 1px rgba(53, 230, 138, .12);
                opacity: 0;
                pointer-events: none;
                transition: left .34s cubic-bezier(.22, 1, .36, 1), width .34s cubic-bezier(.22, 1, .36, 1), opacity .15s ease;
                will-change: left, width;
            }
            #manager-bottom-nav .manager-nav-item {
                appearance: none;
                -webkit-appearance: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                min-width: 0;
                width: 100%;
                min-height: 48px;
                margin: 0;
                padding: 5px 1px;
                border: 0;
                border-radius: 10px;
                background: transparent;
                color: #91a4b3;
                font: inherit;
                box-shadow: none;
                line-height: 1;
                cursor: pointer;
                position: relative;
                z-index: 1;
                transition: color .2s ease;
            }
            #manager-bottom-nav .manager-nav-icon {
                display: block;
                font-size: 19px;
                line-height: 1;
            }
            #manager-bottom-nav .manager-nav-label {
                display: block;
                max-width: 100%;
                white-space: nowrap;
                word-break: keep-all;
                overflow-wrap: normal;
                font-size: clamp(9px, 2.55vw, 11px);
                line-height: 1.1;
                font-weight: 600;
                letter-spacing: -.15px;
            }
            #manager-bottom-nav .manager-nav-item.is-active {
                color: #35e68a;
                background: transparent;
            }
            #manager-bottom-nav .manager-nav-item:focus-visible,
            #manager-plus-panel button:focus-visible {
                outline: 2px solid #35e68a;
                outline-offset: 2px;
            }
            #manager-plus-panel {
                position: fixed;
                z-index: 10001;
                right: 12px;
                bottom: calc(78px + env(safe-area-inset-bottom, 0px));
                display: none;
                width: min(220px, calc(100vw - 24px));
                padding: 7px;
                border: 1px solid #2b4050;
                border-radius: 13px;
                background: #10202c;
                box-shadow: 0 8px 28px rgba(0, 0, 0, .4);
                box-sizing: border-box;
            }
            #manager-plus-panel button {
                display: block;
                width: 100%;
                margin: 0;
                padding: 12px;
                border: 0;
                border-radius: 8px;
                background: transparent;
                color: #e5eef4;
                text-align: left;
                font-size: 13px;
                box-shadow: none;
            }
            #manager-plus-panel button + button {
                border-top: 1px solid rgba(126, 151, 170, .13);
            }
            body.manager-has-bottom-nav #game {
                padding-bottom: calc(150px + env(safe-area-inset-bottom, 0px)) !important;
            }
            @media (max-width: 360px) {
                #manager-bottom-nav {
                    left: 6px;
                    right: 6px;
                    padding-left: 3px;
                    padding-right: 3px;
                }
                #manager-bottom-nav .manager-nav-icon { font-size: 18px; }
                #manager-bottom-nav .manager-nav-label { font-size: 9px; letter-spacing: -.3px; }
            }
        `;
        document.head.appendChild(style);

        const nav = document.createElement("nav");
        nav.id = "manager-bottom-nav";
        nav.setAttribute("aria-label", "Navigation principale");

        const indicator = document.createElement("span");
        indicator.className = "manager-nav-indicator";
        indicator.setAttribute("aria-hidden", "true");
        nav.appendChild(indicator);
        this.bottomNavIndicator = indicator;

        const items = [
            { id: "home", icon: "⌂", label: "Accueil", action: () => {
                this.closeBottomMoreMenu();
                if (this.currentManagerView) {
                    this.setBottomNavigationVisible(true, "home");
                    this.showManager(this.currentManagerView);
                    this.resetPageScroll();
                }
            }},
            { id: "squad", icon: "♟", label: "Effectif", action: () => {
                this.closeBottomMoreMenu();
                if (this.currentManagerView) {
                    this.setBottomNavigationVisible(true, "squad");
                    this.squadUI.showClubPlayers(game.players, this.currentManagerView);
                    this.resetPageScroll();
                }
            }},
            { id: "matches", icon: "▣", label: "Matchs", action: () => {
                this.closeBottomMoreMenu();
                this.setBottomNavigationVisible(true, "matches");
                this.showCalendar();
                this.resetPageScroll();
            }},
            { id: "competitions", icon: "🏆", label: "Compétitions", action: () => {
                this.closeBottomMoreMenu();
                this.setBottomNavigationVisible(true, "competitions");
                this.showChampionship();
                this.resetPageScroll();
            }},
            { id: "more", icon: "•••", label: "Plus", action: () => {
                this.toggleBottomMoreMenu();
            }}
        ];

        items.forEach(item => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "manager-nav-item";
            button.dataset.nav = item.id;
            button.setAttribute("aria-label", item.label);
            button.innerHTML = '<span class="manager-nav-icon" aria-hidden="true"></span><span class="manager-nav-label"></span>';
            button.querySelector(".manager-nav-icon").textContent = item.icon;
            button.querySelector(".manager-nav-label").textContent = item.label;
            button.addEventListener("click", item.action);
            nav.appendChild(button);
        });

        document.body.appendChild(nav);
        this.bottomNav = nav;

        const panel = document.createElement("div");
        panel.id = "manager-plus-panel";
        panel.setAttribute("aria-label", "Autres fonctions de la carrière");
        const plusActions = [
            ["🧠 Tactiques", () => {
                if (this.currentManagerView) this.tacticsUI.show(game.tactics, this.currentManagerView);
                this.setBottomNavigationVisible(true, "more");
                this.resetPageScroll();
            }],
            ["🏋️ Entraînement", () => {
                if (this.currentManagerView) this.showTraining(this.currentManagerView);
                this.setBottomNavigationVisible(true, "more");
                this.resetPageScroll();
            }],
            ["↔️ Marché des transferts", () => {
                if (this.currentManagerView) this.showTransferMarket(this.currentManagerView);
                this.setBottomNavigationVisible(true, "more");
                this.resetPageScroll();
            }],
            ["💾 Sauvegarder", () => {
                if (this.currentManagerView) this.saveCurrentCareer(this.currentManagerView);
                this.setBottomNavigationVisible(true, "more");
                this.resetPageScroll();
            }]
        ];
        plusActions.forEach(([label, action]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.addEventListener("click", () => {
                this.closeBottomMoreMenu();
                action();
            });
            panel.appendChild(button);
        });
        document.body.appendChild(panel);
        this.bottomMorePanel = panel;
        this.initBottomNavigationScrollBehavior();
    }

    closeBottomMoreMenu() {
        if (this.bottomMorePanel) this.bottomMorePanel.style.display = "none";
    }

    resetPageScroll() {
        // Revenir en haut après le rendu de la nouvelle page.
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }

    initBottomNavigationScrollBehavior() {
        if (this.bottomNavScrollListenerInstalled) return;
        this.bottomNavScrollListenerInstalled = true;

        document.addEventListener("scroll", () => {
            // La barre reste toujours visible. Seul le menu déroulant Plus se ferme.
            if (this.bottomMorePanel && this.bottomMorePanel.style.display === "block") {
                this.bottomMorePanel.style.display = "none";
            }
        }, { passive: true, capture: true });
    }

    setBottomNavigationVisible(visible, active = null) {
        if (!this.bottomNav) return;
        this.bottomNav.style.display = visible ? "grid" : "none";
        if (this.bottomMorePanel && (!visible || (active && active !== "more"))) {
            this.closeBottomMoreMenu();
        }
        document.body.classList.toggle("manager-has-bottom-nav", Boolean(visible));
        if (active) {
            const buttons = Array.from(this.bottomNav.querySelectorAll(".manager-nav-item"));
            buttons.forEach(button => {
                const selected = button.dataset.nav === active;
                button.classList.toggle("is-active", selected);
                if (selected) button.setAttribute("aria-current", "page");
                else button.removeAttribute("aria-current");
            });

            const selectedButton = buttons.find(button => button.dataset.nav === active);
            if (selectedButton && this.bottomNavIndicator) {
                this.bottomNavIndicator.style.left = selectedButton.offsetLeft + "px";
                this.bottomNavIndicator.style.width = selectedButton.offsetWidth + "px";
                this.bottomNavIndicator.style.opacity = "1";
            }
        }
    }

    toggleBottomMoreMenu() {
        if (!this.bottomMorePanel || !this.bottomNav || this.bottomNav.style.display === "none") return;
        const opening = this.bottomMorePanel.style.display !== "block";
        this.bottomMorePanel.style.display = opening ? "block" : "none";
        this.setBottomNavigationVisible(true, "more");
    }


    /* ================================================= */
    /* MENU PRINCIPAL */
    /* ================================================= */

    showMainMenu() {

        this.setBottomNavigationVisible(false);
        this.clear();
        this.container.classList.add("manager-welcome");


        this.showTitle(
            "⚽ Manager Career"
        );


        this.showMessage(
            "Bienvenue dans Manager Career !"
        );


        this.createButton(

            "🆕 Nouvelle carrière",

            () => {

                game.currentSaveSlot =
                    null;

                game.club =
                    null;

                game.currentMatchday =
                    0;

                this.showLeagueSelection(
                    game.data
                );

            }

        );


        this.createButton(

            "💾 Sauvegardes",

            () => {

                this.showMainSaveMenu();

            }

        );

        // Version visible pour confirmer que la dernière version est chargée.
        const buildLabel = document.createElement("small");
        buildLabel.textContent = "Build #" + (window.MANAGER_BUILD_NUMBER || "local");
        buildLabel.style.position = "fixed";
        buildLabel.style.left = "10px";
        buildLabel.style.bottom = "8px";
        buildLabel.style.fontSize = "10px";
        buildLabel.style.opacity = "0.65";
        buildLabel.style.color = "inherit";
        buildLabel.style.zIndex = "1000";
        buildLabel.style.pointerEvents = "none";
        buildLabel.setAttribute("aria-label", "Version du jeu");
        this.container.appendChild(buildLabel);

    }



    /* ================================================= */
    /* SAUVEGARDES DU MENU PRINCIPAL */
    /* ================================================= */

    showMainSaveMenu() {

        this.clear();
        this.container.classList.add("manager-saves-screen");


        this.showTitle(
            "💾 Sauvegardes"
        );


        this.showMessage(
            "Choisis une sauvegarde à charger."
        );


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            this.createMainSaveSlot(
                slot
            );

        }


        this.createButton(

            "⬅️ Retour",

            () => {

                this.showMainMenu();

            }

        );

    }



    /* ================================================= */
    /* SLOT DU MENU PRINCIPAL */
    /* ================================================= */

    createMainSaveSlot(slot) {

        const saves =
            game.save.getSaveList();


        const saveInfo =
            saves.find(
                item =>
                    item.slot === slot
            );


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "save-slot";


        box.style.margin =
            "15px 0";


        box.style.padding =
            "10px";


        box.style.border =
            "1px solid #ccc";


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            "💾 Slot " +
            slot;


        box.appendChild(
            title
        );


        if (!saveInfo) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.textContent =
                "🟢 Emplacement vide";


            box.appendChild(
                empty
            );


            this.container.appendChild(
                box
            );


            return;

        }


        const save =
            game.save.loadGame(
                slot
            );


        if (
            save &&
            save.game
        ) {

            const gameData =
                save.game;


            if (
                gameData.club &&
                gameData.club.name
            ) {

                const club =
                    document.createElement(
                        "p"
                    );


                club.textContent =
                    "🏟️ " +
                    gameData.club.name;


                box.appendChild(
                    club
                );

            }


            if (
                gameData.manager &&
                gameData.manager.season
            ) {

                const season =
                    document.createElement(
                        "p"
                    );


                season.textContent =
                    "📅 Saison " +
                    gameData.manager.season;


                box.appendChild(
                    season
                );

            }

        }


        const date =
            new Date(
                saveInfo.date
            );


        const saveDate =
            document.createElement(
                "p"
            );


        saveDate.textContent =
            "💾 Sauvegardée le " +
            date.toLocaleDateString() +
            " à " +
            date.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        box.appendChild(
            saveDate
        );


        const loadButton =
            document.createElement(
                "button"
            );


        loadButton.textContent =
            "📂 Charger";


        loadButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "📂 Charger la carrière du slot " +
                        slot +
                        " ?"
                    );


                if (!confirmed) {

                    return;

                }


                loadCareer(
                    slot
                );

            }
        );


        box.appendChild(
            loadButton
        );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.textContent =
            "🗑️ Supprimer";


        deleteButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "⚠️ Supprimer définitivement la sauvegarde du slot " +
                        slot +
                        " ?"
                    );


                if (!confirmed) {

                    return;

                }


                deleteCareer(
                    slot
                );


                this.showMainSaveMenu();

            }
        );


        box.appendChild(
            deleteButton
        );


        this.container.appendChild(
            box
        );

    }



    /* ================================================= */
    /* FICHE MANAGER */
    /* ================================================= */

    showManager(manager) {

        this.container.style.removeProperty("display");
        this.container.style.removeProperty("grid-template-columns");
        this.currentManagerView = manager;
        this.setBottomNavigationVisible(true, "home");
        this.clear();
        this.container.classList.add("manager-dashboard");


        if (manager.logo) {

            const img =
                document.createElement("img");


            img.src =
                "assets/logos/" +
                manager.logo;


            img.width =
                120;


            img.style.display =
                "block";


            img.style.margin =
                "auto";


            this.container.appendChild(
                img
            );

        }


        this.showTitle(
            manager.clubName + " · " + manager.season
        );

        // Date de la carrière : date de la prochaine journée non jouée.
        const careerCalendar = game.calendar;
        const nextDatedMatchday = careerCalendar?.matchdays?.find(day => day.played !== true && day.date);
        const careerDate = nextDatedMatchday?.date ||
            careerCalendar?.matchdays?.find(day => day.date)?.date;
        if (careerDate) {
            this.showMessage(
                "📅 " + careerCalendar.formatDate(careerDate)
            );
        }

        this.showMessage(
            "👔 " + manager.managerName +
            (manager.league ? " · " + manager.league : "")
        );

        this.showMessage(
            "💰 " + Number(manager.budget || 0).toLocaleString("fr-FR") +
            " €  ·  ⭐ " + (manager.reputation ?? manager.level ?? 0)
        );

        if (manager.objectives && manager.objectives.length) {
            this.showMessage(
                "🎯 " + manager.objectives.join(" · ")
            );
        }


        /* ================================================= */
        /* PROCHAIN MATCH */
        /* ================================================= */

        this.createButton(

            "▶️ Jouer le prochain match",

            () => {

                this.playNextMatch();

            }

        );


        /* ================================================= */
        /* EFFECTIF */
        /* ================================================= */

        this.createButton(

            "👥 Effectif",

            () => {

                this.squadUI.showClubPlayers(

                    game.players,

                    manager

                );

            }

        );


        /* ================================================= */
        /* ENTRAÎNEMENT */
        /* ================================================= */

        this.createButton(
            "🏋️ Entraînement",
            () => this.showTraining(manager)
        );


        /* ================================================= */
        /* TRANSFERTS */
        /* ================================================= */

        this.createButton(
            "💰 Marché des transferts",
            () => this.showTransferMarket(manager)
        );


        /* ================================================= */
        /* TACTIQUES */
        /* ================================================= */

        this.createButton(

            "🧠 Tactiques",

            () => {

                this.tacticsUI.show(

                    game.tactics,

                    manager

                );

            }

        );


        /* ================================================= */
        /* CHAMPIONNAT */
        /* ================================================= */

        this.createButton(

            "🏆 Championnat",

            () => {

                this.showChampionship();

            }

        );


        /* ================================================= */
        /* CALENDRIER */
        /* ================================================= */

        this.createButton(

            "📅 Calendrier",

            () => {

                this.showCalendar();

            }

        );


        /* ================================================= */
        /* SAUVEGARDER */
        /* ================================================= */

        this.createButton(

            "💾 Sauvegarder",

            () => {

                this.saveCurrentCareer(
                    manager
                );

            }

        );


        /* ================================================= */
        /* RETOUR MENU */
        /* ================================================= */

        this.createButton(

            "🏠 Retour au menu",

            () => {

                this.showMainMenu();

            }

        );

    }



    updateClubPlayerMatchStats(matchResult) {
        if (!matchResult || !game.club || !Array.isArray(game.players)) return;
        const normalize = value => String(value || "")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .trim().toLowerCase().replace(/\s+/g, " ");
        const aliases = player => {
            if (!player) return [];
            const values = [
                [player.prenom || player.firstName || player.firstname || player.first_name || "", player.nom || player.lastName || player.lastname || player.last_name || ""].filter(Boolean).join(" "),
                player.name, player.nomComplet, player.fullName, player.full_name
            ].map(normalize).filter(Boolean);
            return [...new Set(values)];
        };
        if (matchResult.homeTeam !== game.club.name && matchResult.awayTeam !== game.club.name) return;

        const playerById = new Map();
        const playerByName = new Map();
        game.players.forEach(player => {
            if (player.id !== undefined && player.id !== null) playerById.set(String(player.id), player);
            aliases(player).forEach(name => {
                if (!playerByName.has(name)) playerByName.set(name, player);
            });
        });
        const resolve = candidate => {
            if (!candidate) return null;
            if (candidate.id !== undefined && candidate.id !== null && playerById.has(String(candidate.id))) {
                return playerById.get(String(candidate.id));
            }
            for (const name of aliases(candidate)) if (playerByName.has(name)) return playerByName.get(name);
            return null;
        };

        // Les identifiants sont prioritaires ; les noms servent de secours pour les anciennes tactiques sauvegardées.
        const starters = game.tactics && Array.isArray(game.tactics.lineup) ? game.tactics.lineup : [];
        const counted = new Set();
        starters.forEach(starter => {
            const player = resolve(starter);
            if (!player) return;
            const key = player.id != null ? "id:" + player.id : aliases(player)[0];
            if (counted.has(key)) return;
            counted.add(key);
            player.matchs = (Number(player.matchs ?? player.matchsJoues ?? player.matchesPlayed) || 0) + 1;
            player.matchsJoues = player.matchs;
            player.matchesPlayed = player.matchs;
            player.minutes = (Number(player.minutes ?? player.minutesJouees ?? player.minutesPlayed) || 0) + 90;
            player.minutesJouees = player.minutes;
            player.minutesPlayed = player.minutes;
        });

        (Array.isArray(matchResult.events) ? matchResult.events : []).forEach(event => {
            if (event.team !== game.club.name) return;
            const scorerName = normalize(event.scorer);
            const scorer = scorerName ? playerByName.get(scorerName) : null;
            if (scorer && scorerName !== normalize("Buteur non renseigné")) {
                scorer.buts = (Number(scorer.buts ?? scorer.goals) || 0) + 1;
                scorer.goals = scorer.buts;
            }
            const assisterName = normalize(event.assist);
            const assister = assisterName ? playerByName.get(assisterName) : null;
            if (assister && assister !== scorer) {
                assister.passes = (Number(assister.passes ?? assister.passesDecisives ?? assister.assists) || 0) + 1;
                assister.passesDecisives = assister.passes;
                assister.assists = assister.passes;
            }
        });
    }


    updatePlayerMarketValue(player) {
        if (!player) return 0;

        const rating = Math.max(1, Math.min(99, Number(player.note) || 1));
        const potential = Math.max(rating, Math.min(99, Number(player.potentiel) || rating));
        const age = Math.max(15, Number(player.age) || 18);

        // Conserver la valeur existante comme point de départ, pour éviter
        // de bouleverser les prix des joueurs déjà présents dans la sauvegarde.
        if (!Number.isFinite(Number(player.valeurReference)) || Number(player.valeurReference) <= 0) {
            player.valeurReference = Math.max(100000, Number(player.valeur) || 100000);
            player.noteValeurReference = rating;
            player.ageValeurReference = age;
            player.potentielValeurReference = potential;
        }

        const baseValue = Number(player.valeurReference);
        const referenceRating = Math.max(1, Number(player.noteValeurReference) || rating);
        const referenceAge = Math.max(15, Number(player.ageValeurReference) || age);
        // La note actuelle détermine la base de valeur ; le potentiel ajoute
        // une prime réelle, même pour les joueurs déjà présents en sauvegarde.
        // Chaque point de potentiel au-dessus de la note ajoute 2,5 %, plafonné à 60 %.
        const ratingFactor = Math.pow(rating / referenceRating, 2);
        const potentialBonus = 1 + Math.min(0.60, Math.max(0, potential - rating) * 0.025);

        const ageFactor = currentAge => {
            if (currentAge < 23) return 1.15;
            if (currentAge < 28) return 1.00;
            if (currentAge < 32) return 0.85;
            if (currentAge < 34) return 0.70;
            if (currentAge < 36) return 0.60;
            if (currentAge < 38) return 0.45;
            return 0.30;
        };

        const ageRatio = ageFactor(age) / ageFactor(referenceAge);
        player.valeur = Math.max(50000, Math.round(baseValue * ratingFactor * potentialBonus * ageRatio));
        return player.valeur;
    }


    startNewSeason() {
        if (!game.club || !game.data || !game.manager) return;

        const leagueClubs = game.data.getClubsByLeague(game.club.league);
        const teams = leagueClubs.map(club => club.nom);
        if (!teams.length) {
            alert("Impossible de créer une nouvelle saison : aucun club trouvé pour ce championnat.");
            return;
        }

        // Le vieillissement a déjà été appliqué à la fin de la saison précédente.
        // L'historique des blessures est saisonnier : repartir sur une liste vide.
        const seasonPlayers = new Set([
            ...(Array.isArray(game.data.players) ? game.data.players : []),
            ...(Array.isArray(game.players) ? game.players : [])
        ]);
        seasonPlayers.forEach(player => {
            if (!player) return;
            player.historiqueBlessures = [];
            player.butsSaison = 0;
            player.seasonGoals = 0;
            player.passesDecisivesSaison = 0;
            player.seasonAssists = 0;
            player.derniereBlessureJour = null;
            player.derniereBlessureSaison = null;
        });
        game.manager.season = (Number(game.manager.season) || 1) + 1;
        game.currentMatchday = 0;
        this.currentLeagueMatchday = 0;

        game.calendar = new ChampionshipCalendar(teams);
        game.calendar.generateFullCalendar();

        game.standings = new Standings(teams);
        game.matchEngine = new MatchEngine(game.standings);

        leagueClubs.forEach(club => {
            const squad = club.nom === game.club.name && Array.isArray(game.players)
                ? game.players
                : game.data.getPlayersByClub(club.nom);
            game.matchEngine.setTeamPlayers(club.nom, squad);
        });

        game.lastAgedSeason = String(Number(game.manager.season) - 1);

        this.showTitle("🏆 Nouvelle saison " + game.manager.season);
        this.showMessage("📅 Nouveau calendrier créé. Le classement et l'historique des matchs de la saison sont repartis à zéro.");
        this.showMessage("👴 Le vieillissement, les baisses de niveau et les retraites ont été appliqués à la saison précédente.");

        if (game.currentSaveSlot != null && typeof saveCareer === "function") {
            const saved = saveCareer(game.currentSaveSlot);
            this.showMessage(saved
                ? "💾 Nouvelle saison sauvegardée automatiquement dans le slot " + game.currentSaveSlot + "."
                : "⚠️ La sauvegarde automatique a échoué. Pense à sauvegarder manuellement.");
        }

        this.createButton("▶️ Commencer la saison", () => this.returnToManager());
        this.createButton("📅 Voir le calendrier", () => this.showCalendar());
        this.createButton("🏆 Voir le classement", () => this.showStandings());
    }



    createRegensForRetirees(retirees) {
        if (!Array.isArray(retirees) || !retirees.length) return 0;
        const players = game.data?.players;
        if (!Array.isArray(players)) return 0;
        const clubs = Array.isArray(game.data.clubs) ? game.data.clubs : [];
        const firstNames = Array.isArray(Names?.firstNames) ? Names.firstNames : ["Alex", "Sam", "Noah"];
        const lastNames = Array.isArray(Names?.lastNames) ? Names.lastNames : ["Martin", "Bernard", "Petit"];
        const positions = ["GB", "DD", "DG", "DC", "MDC", "MC", "MOC", "MD", "MG", "AD", "AG", "BU"];
        let created = 0;

        retirees.forEach(oldPlayer => {
            if (!oldPlayer || oldPlayer.regenCree) return;
            const oldPotential = Math.max(55, Math.min(99, Number(oldPlayer.potentiel) || Number(oldPlayer.note) || 65));
            const potential = Math.max(55, Math.min(99, oldPotential + Math.floor(Math.random() * 7) - 3));
            const overall = 44 + Math.floor(Math.random() * 14);
            const oldClub = clubs.find(club => club.nom === oldPlayer.club);
            const sameLeague = oldClub ? clubs.filter(club => club.league === oldClub.league && club.nom !== oldPlayer.club) : [];
            const alternatives = sameLeague.length ? sameLeague : clubs.filter(club => club.nom !== oldPlayer.club);
            const destination = alternatives.length ? alternatives[Math.floor(Math.random() * alternatives.length)] : null;
            const pick = list => list[Math.floor(Math.random() * list.length)];
            const regen = {
                id: "regen-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
                prenom: pick(firstNames),
                nom: pick(lastNames),
                club: destination ? destination.nom : (oldPlayer.club || ""),
                poste: pick(positions),
                age: 16 + Math.floor(Math.random() * 4),
                nationalite: oldPlayer.nationalite || "Française",
                taille: 165 + Math.floor(Math.random() * 26),
                poids: 58 + Math.floor(Math.random() * 25),
                numero: 1 + Math.floor(Math.random() * 99),
                pied: Math.random() < 0.5 ? "Droit" : "Gauche",
                note: Math.min(overall, potential),
                potentiel: potential,
                valeur: 100000 + overall * overall * 1000,
                forme: 100,
                moral: 75,
                fatigue: 0,
                blessure: false,
                joursBlessure: 0,
                retraite: false,
                regen: true,
                regenDe: (oldPlayer.prenom || "") + " " + (oldPlayer.nom || ""),
                matchs: 0,
                buts: 0,
                passesDecisives: 0
            };
            players.push(regen);
            oldPlayer.regenCree = true;
            if (game.club && regen.club === game.club.name && Array.isArray(game.players) && !game.players.some(p => String(p.id) === String(regen.id))) {
                game.players.push(regen);
            }
            created++;
        });
        return created;
    }

    processEndOfSeasonPlayerAging() {
        const dataPlayers = Array.isArray(game.data?.players) ? game.data.players : [];
        const squadPlayers = Array.isArray(game.players) ? game.players : [];
        const all = [...dataPlayers, ...squadPlayers].filter(Boolean);
        if (!all.length) return { aged: 0, retired: 0, declined: 0, regens: 0 };

        const seasonKey = String(game.manager?.season ?? game.manager?.seasonName ?? game.currentMatchday ?? "season");
        if (String(game.lastAgedSeason) === seasonKey) return { aged: 0, retired: 0, declined: 0, regens: 0 };

        const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
        const groups = new Map();
        all.forEach(player => {
            const identity = player.id != null
                ? "id:" + String(player.id)
                : "name:" + normalize((player.prenom || player.firstName || "") + " " + (player.nom || player.lastName || "")) + "|club:" + normalize(player.club);
            if (!groups.has(identity)) groups.set(identity, []);
            if (!groups.get(identity).includes(player)) groups.get(identity).push(player);
        });

        let aged = 0;
        let retired = 0;
        let declined = 0;
        const newRetirees = [];

        groups.forEach(copies => {
            // Préférer la copie de l'effectif actif pour que la fiche du joueur se mette à jour.
            const player = copies.find(p => squadPlayers.includes(p)) || copies[0];
            if (player.retraite === true || player.retraite === "true") return;

            player.age = Math.max(15, Number(player.age) || 18) + 1;
            aged++;

            const age = player.age;
            let decline = 0;
            if (age >= 34 && age <= 35) decline = 1;
            else if (age >= 36 && age <= 37) decline = 2;
            else if (age >= 38 && age <= 39) decline = 3;

            if (decline > 0) {
                const oldRating = Math.max(1, Number(player.note) || 1);
                player.note = Math.max(1, oldRating - decline);
                if (player.note < oldRating) declined++;
            }

            if (age >= 40) {
                player.retraite = true;
                retired++;
                newRetirees.push(player);
            }

            this.updatePlayerMarketValue(player);
            // Certaines parties chargent une copie distincte pour l'effectif et la base générale.
            copies.forEach(copy => {
                if (copy === player) return;
                copy.age = player.age;
                copy.note = player.note;
                copy.retraite = player.retraite;
                copy.valeur = player.valeur;
                copy.valeurReference = player.valeurReference;
                copy.noteValeurReference = player.noteValeurReference;
                copy.ageValeurReference = player.ageValeurReference;
                copy.potentielValeurReference = player.potentielValeurReference;
            });
        });

        const regens = this.createRegensForRetirees(newRetirees);
        game.lastAgedSeason = seasonKey;
        return { aged, retired, declined, regens };
    }


    applyPostMatchPlayerProgression() {
        const players = Array.isArray(game.players) ? game.players : [];
        const lineup = Array.isArray(game.tactics?.lineup) ? game.tactics.lineup : [];
        if (!players.length || !lineup.length) return 0;

        const getKey = player => {
            if (!player) return "";
            if (player.id !== undefined && player.id !== null) return String(player.id);
            return [player.prenom || player.firstName || "", player.nom || player.lastName || "", player.numero ?? player.number ?? ""].join("_");
        };
        const playedKeys = new Set(lineup.map(getKey).filter(Boolean));
        let progressed = 0;

        players.forEach(player => {
            if (!playedKeys.has(getKey(player))) return;
            const rating = Math.max(0, Number(player.note) || 0);
            const potential = Math.max(rating, Math.min(99, Number(player.potentiel) || rating));
            if (rating >= potential) return;

            // Partage la jauge avec l'entraînement : la progression cumulée reste lente.
            if (!Number.isFinite(Number(player.progressionEntrainement))) {
                const oldCount = Math.max(0, Number(player.entrainementsDepuisProgression) || 0);
                const oldThreshold = Math.max(5, Number(player.seuilProgression) || 10);
                player.progressionEntrainement = Math.min(0.95, oldCount / oldThreshold);
            }

            // Chaque match apporte aléatoirement entre 0,01 et 0,05 au maximum.
            const impact = (1 + Math.floor(Math.random() * 5)) / 100;
            player.progressionEntrainement = Math.min(1, Number(player.progressionEntrainement) + impact);

            if (player.progressionEntrainement >= 1) {
                player.note = Math.min(potential, rating + 1);
                player.progressionEntrainement = 0;
                player.entrainementsDepuisProgression = 0;
                player.seuilProgression = null;
                this.updatePlayerMarketValue(player);
                progressed++;
            }
        });

        return progressed;
    }


    applyPostMatchPlayerCondition(matchResult = null) {
        this.lastMatchInjuries = [];
        const players = Array.isArray(game.players) ? game.players : [];
        if (!players.length) return;

        const getKey = player => {
            if (!player) return "";
            if (player.id !== undefined && player.id !== null) return String(player.id);
            return [player.prenom || player.firstName || "", player.nom || player.lastName || "", player.numero ?? player.number ?? ""].join("_");
        };

        const starters = new Set(
            (game.tactics && Array.isArray(game.tactics.lineup) ? game.tactics.lineup : [])
                .map(getKey).filter(Boolean)
        );

        players.forEach(player => {
            const played = starters.has(getKey(player));
            const injuryField = Object.prototype.hasOwnProperty.call(player, "joursBlessure") ? "joursBlessure" : "injuryDays";
            const injuryText = String(player.blessure ?? player.injury ?? "").trim().toLowerCase();
            const wasInjured = (Number(player[injuryField]) || 0) > 0 ||
                (injuryText !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injuryText));

            // La récupération et la durée des blessures avancent après chaque journée jouée.
            const injuryDays = Math.max(0, Number(player[injuryField]) || 0);
            if (injuryDays > 0) {
                player[injuryField] = injuryDays - 1;
                if (player[injuryField] === 0) {
                    player.blessure = "";
                    player.injury = null;
                }
            }

            const fatigue = Math.max(0, Math.min(100, Number(player.fatigue) || 0));
            const form = Math.max(0, Math.min(100, player.forme == null ? 70 : Number(player.forme)));
            const energy = Math.max(0, Math.min(100, player.energy == null ? 100 : Number(player.energy)));
            let resultFormChange = 0;
            if (matchResult && game.club) {
                const clubIsHome = matchResult.homeTeam === game.club.name;
                const clubGoals = Number(clubIsHome ? matchResult.homeGoals : matchResult.awayGoals) || 0;
                const opponentGoals = Number(clubIsHome ? matchResult.awayGoals : matchResult.homeGoals) || 0;
                resultFormChange = clubGoals > opponentGoals ? 5 : (clubGoals === opponentGoals ? 2 : -4);
            }

            if (played) {
                player.fatigue = Math.min(100, fatigue + 10 + Math.floor(Math.random() * 11));
                // Perte d'énergie réduite de 25 % : 15 devient environ 11 points.
                player.energy = Math.max(0, energy - 11.25);
                // La forme suit le résultat collectif et une performance individuelle légère.
                const individualChange = (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3));
                player.forme = Math.max(0, Math.min(100, form + resultFormChange + individualChange));
            } else {
                // Les remplaçants récupèrent davantage que les titulaires.
                player.fatigue = Math.max(0, fatigue - (wasInjured ? 18 : 15));
                player.energy = Math.min(100, energy + (wasInjured ? 18 : 20));
                // Pas de variation automatique de forme au repos.
                player.forme = form;
            }

            // Une journée jouée autorise à nouveau une séance individuelle ou collective.
            player.entrainementEnAttenteMatch = false;

            // Petit risque de blessure pour les titulaires, augmenté par une fatigue élevée.
            // Les blessures durent de 1 à 4 journées de championnat.
            if (played && !wasInjured) {
                const currentFatigue = Number(player.fatigue) || 0;
                const currentSeason = String(game.manager?.season ?? 1);
                const lastInjurySeason = String(player.derniereBlessureSaison ?? "");
                const lastInjuryDay = Number(player.derniereBlessureJour);
                const injuryCooldownActive = lastInjurySeason === currentSeason &&
                    Number.isFinite(lastInjuryDay) && lastInjuryDay > 0 &&
                    (Number(game.currentMatchday) || 0) - lastInjuryDay < 4;
                // La forme influence le risque : à 100, réduction de 25 % ;
                // à 0, pas de réduction. La fatigue conserve son effet habituel.
                const currentForm = Math.max(0, Math.min(100, Number(player.forme) || 0));
                const formRiskMultiplier = 1 - (0.25 * currentForm / 100);
                const injuryChance = Math.min(0.07, 0.015 + Math.max(0, currentFatigue - 55) * 0.0007) * formRiskMultiplier;
                if (!injuryCooldownActive && Math.random() < injuryChance) {
                    const duration = 1 + Math.floor(Math.random() * 4);
                    player.derniereBlessureJour = Number(game.currentMatchday) || 0;
                    player.derniereBlessureSaison = currentSeason;
                    player[injuryField] = duration;
                    player.blessure = "Blessure";
                    player.injury = "Injured";

                    if (!Array.isArray(player.historiqueBlessures)) {
                        player.historiqueBlessures = [];
                    }
                    player.historiqueBlessures.push({
                        type: "Blessure",
                        jour: Number(game.currentMatchday) || 0,
                        duree: duration
                    });
                    this.lastMatchInjuries.push({
                        player: [player.prenom || player.firstName || "", player.nom || player.lastName || ""].filter(Boolean).join(" ") || player.name || player.fullName || "Joueur inconnu",
                        duration,
                        team: game.club && game.club.name ? game.club.name : ""
                    });
                }
            }
        });
    }


    /* ================================================= */
    /* JOUER LE PROCHAIN MATCH */
    /* ================================================= */

    playNextMatch() {

        if (
            !game.calendar ||
            !game.calendar.matchdays
        ) {

            alert(
                "❌ Calendrier indisponible."
            );

            return;

        }


        if (
            !game.matchEngine
        ) {

            alert(
                "❌ Moteur des matchs indisponible."
            );

            return;

        }


        /* ========================= */
        /* RECHERCHE PROCHAINE JOURNÉE */
        /* ========================= */

        let matchdayIndex =
            -1;


        for (
            let i = 0;
            i < game.calendar.matchdays.length;
            i++
        ) {

            const day =
                game.calendar.matchdays[i];


            if (
                !day.played
            ) {

                matchdayIndex =
                    i;

                break;

            }

        }


        /* ========================= */
        /* FIN DE SAISON */
        /* ========================= */

        if (
            matchdayIndex === -1
        ) {

            this.clear();


            this.showTitle(
                "🏆 Saison terminée"
            );


            const aging = this.processEndOfSeasonPlayerAging();

            this.showMessage(
                "Félicitations ! Tu as terminé la saison."
            );

            if (aging.regens > 0) {
                this.showMessage("🌱 " + aging.regens + " jeune(s) regen généré(s) après une retraite.");
            }

            if (aging.aged > 0) {
                this.showMessage(
                    "📅 Fin de saison : " + aging.aged + " joueurs ont pris un an. " +
                    aging.declined + " joueurs ont perdu du niveau et " +
                    aging.retired + " joueur(s) ont pris leur retraite."
                );
            }


            this.createButton(

                "📊 Voir le classement",

                () => {

                    this.showStandings();

                }

            );


            this.createButton(
                "🆕 Démarrer la saison suivante",
                () => this.startNewSeason()
            );

            this.createButton(

                "📅 Voir le calendrier",

                () => {

                    this.showCalendar();

                }

            );


            this.createButton(

                "⬅️ Retour carrière",

                () => {

                    this.returnToManager();

                }

            );


            return;

        }


        const matchday =
            game.calendar.matchdays[
                matchdayIndex
            ];

        // Refuser de lancer le match si un joueur blessé figure dans le onze OU sur le banc.
        // On compare à l'effectif réel pour tenir compte des anciennes copies sauvegardées.
        if (game.tactics) {
            const normalize = value => String(value || "").normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
            const isInjured = player => {
                const days = Math.max(0, Number(player && (player.joursBlessure ?? player.injuryDays)) || 0);
                const injury = String(player && (player.blessure ?? player.injury) || "").trim().toLowerCase();
                return days > 0 || (injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury));
            };
            const injured = (game.players || []).filter(isInjured);
            const matchesPlayer = (candidate, realPlayer) => {
                if (!candidate || !realPlayer) return false;
                if (candidate.id != null && realPlayer.id != null && String(candidate.id) === String(realPlayer.id)) return true;
                const full = player => normalize([
                    player.prenom || player.firstName || player.firstname || "",
                    player.nom || player.lastName || player.lastname || ""
                ].filter(Boolean).join(" ") || player.name || player.fullName || player.nomComplet || "");
                const a = full(candidate), b = full(realPlayer);
                return !!a && a === b;
            };
            const starters = Array.isArray(game.tactics.lineup) ? game.tactics.lineup : [];
            const substitutes = Array.isArray(game.tactics.substitutes) ? game.tactics.substitutes : [];
            const injuredSelected = [
                ...starters.map(player => ({ player, role: "titulaire" })),
                ...substitutes.map(player => ({ player, role: "remplaçant" }))
            ].filter(entry => injured.some(realPlayer => matchesPlayer(entry.player, realPlayer)));

            if (injuredSelected.length) {
                const names = [...new Set(injuredSelected.map(({ player }) => {
                    const real = injured.find(candidate => matchesPlayer(player, candidate)) || player;
                    return [real.prenom || real.firstName || "", real.nom || real.lastName || ""].filter(Boolean).join(" ") ||
                        real.name || real.fullName || "Joueur inconnu";
                }))];
                alert(
                    "⛔ Match impossible à lancer : un ou plusieurs joueurs blessés sont sélectionnés.\n\n" +
                    names.map(name => "• " + name).join("\n") +
                    "\n\nRetire ces joueurs du onze de départ et du banc, puis réessaie."
                );
                return;
            }
        }

        /* ========================= */
        /* COMPOSITIONS POUR LE MATCH */
        /* ========================= */

        // Le onze tactique du joueur est la seule composition active connue.
        // Les autres équipes recevront automatiquement 11 joueurs aptes dans le moteur.
        if (typeof game.matchEngine.clearActiveLineups === "function") {
            game.matchEngine.clearActiveLineups();
        }

        const userMatch = matchday.matches.find(match =>
            match.home === game.club.name || match.away === game.club.name
        );

        if (userMatch && game.tactics && Array.isArray(game.tactics.lineup)) {
            const userStarters = game.tactics.lineup.filter(Boolean).slice(0, 11);
            game.matchEngine.setActiveLineup(game.club.name, userStarters);
        }

        /* ========================= */
        /* SIMULATION */
        /* ========================= */

        const results =
            game.matchEngine.simulateMatchday(
                matchday
            );


        if (
            !results ||
            results.length === 0
        ) {

            alert(
                "❌ Impossible de jouer cette journée."
            );

            return;

        }


        /* ========================= */
        /* PROGRESSION */
        /* ========================= */

        game.currentMatchday =
            matchdayIndex + 1;

        // Sécuriser l'état de la journée pour que le calendrier
        // puisse retrouver cette journée même avec une ancienne sauvegarde.
        matchday.played = true;
        matchday.results = results;

        // Le calendrier de ligue s'ouvrira sur la journée qui vient d'être jouée.
        this.currentLeagueMatchday =
            matchdayIndex;

        // Mettre à jour les statistiques individuelles du club après le match.
        const playedClubMatch = results.find(match =>
            match.homeTeam === game.club.name || match.awayTeam === game.club.name
        );
        if (playedClubMatch) this.updateClubPlayerMatchStats(playedClubMatch);

        // Les joueurs alignés progressent aussi grâce au match, sans dépasser 0,05 par rencontre.
        this.applyPostMatchPlayerProgression();

        // Gérer l'énergie, la fatigue et la forme selon le résultat du match.
        this.applyPostMatchPlayerCondition(playedClubMatch);

        // Sauvegarder automatiquement après chaque journée si la carrière
        // est déjà associée à un emplacement de sauvegarde.
        if (game.currentSaveSlot != null && typeof saveCareer === "function") {
            const autoSaved = saveCareer(game.currentSaveSlot);
            if (!autoSaved) console.error("⚠️ La sauvegarde automatique après match a échoué.");
        }


        /* ========================= */
        /* MATCH DU CLUB */
        /* ========================= */

        const clubResult =
            results.find(
                match =>

                    match.homeTeam ===
                    game.club.name ||

                    match.awayTeam ===
                    game.club.name
            );


        /* ========================= */
        /* AFFICHAGE DU MATCH */
        /* ========================= */

        this.clear();


        this.showTitle(
            "⚽ Journée " +
            matchday.day
        );


        if (
            clubResult
        ) {

            const isHome =
                clubResult.homeTeam ===
                game.club.name;


            /* ========================= */
            /* CONTENEUR DU MATCH */
            /* ========================= */

            const matchBox =
                document.createElement(
                    "div"
                );


            matchBox.style.textAlign =
                "center";


            matchBox.style.margin =
                "25px 0";


            matchBox.style.padding =
                "20px";


            matchBox.style.border =
                "1px solid #ccc";


            matchBox.style.borderRadius =
                "10px";


            /* ========================= */
            /* DOMICILE */
            /* ========================= */

            const homeTitle =
                document.createElement(
                    "h2"
                );


            homeTitle.textContent =
                "🏠 " +
                clubResult.homeTeam;


            homeTitle.style.margin =
                "10px 0";


            matchBox.appendChild(
                homeTitle
            );


            /* ========================= */
            /* SCORE */
            /* ========================= */

            const score =
                document.createElement(
                    "div"
                );


            score.textContent =

                clubResult.homeGoals +
                "  -  " +
                clubResult.awayGoals;


            score.style.fontSize =
                "42px";


            score.style.fontWeight =
                "bold";


            score.style.margin =
                "15px 0";


            matchBox.appendChild(
                score
            );


            /* ========================= */
            /* EXTÉRIEUR */
            /* ========================= */

            const awayTitle =
                document.createElement(
                    "h2"
                );


            awayTitle.textContent =
                "✈️ " +
                clubResult.awayTeam;


            awayTitle.style.margin =
                "10px 0";


            matchBox.appendChild(
                awayTitle
            );


            this.container.appendChild(
                matchBox
            );


            /* ========================= */
            /* RÉSULTAT */
            /* ========================= */

            let resultTitle =
                "";


            if (
                clubResult.homeGoals >
                clubResult.awayGoals
            ) {

                resultTitle =
                    isHome
                        ? "🟢 VICTOIRE"
                        : "🔴 DÉFAITE";

            }

            else if (
                clubResult.homeGoals <
                clubResult.awayGoals
            ) {

                resultTitle =
                    isHome
                        ? "🔴 DÉFAITE"
                        : "🟢 VICTOIRE";

            }

            else {

                resultTitle =
                    "🟡 MATCH NUL";

            }


            const result =
                document.createElement(
                    "h2"
                );


            result.textContent =
                resultTitle;


            result.style.textAlign =
                "center";


            result.style.margin =
                "20px 0";


            this.container.appendChild(
                result
            );


            /* ========================= */
            /* INFORMATIONS */
            /* ========================= */

            this.showMessage(
                "🏟️ " +
                clubResult.homeTeam +
                " contre " +
                clubResult.awayTeam
            );


            this.showMessage(
                "⚽ Score final : " +
                clubResult.homeGoals +
                " - " +
                clubResult.awayGoals
            );


            this.showMessage(
                "📅 Journée " +
                matchday.day
            );


            /* ========================= */
            /* ÉVÉNEMENTS */
            /* ========================= */

            
const eventsTitle =
    document.createElement("h3");

eventsTitle.textContent =
    "📋 Événements du match";

eventsTitle.style.marginTop = "25px";

this.container.appendChild(eventsTitle);


// Récupérer les événements générés par matches.js
const events =
    Array.isArray(clubResult.events)
        ? clubResult.events
        : (
            clubResult.result &&
            Array.isArray(clubResult.result.events)
                ? clubResult.result.events
                : []
        );

if (events.length > 0) {

    events.forEach(event => {

        const eventLine =
            document.createElement("p");

        const minute =
            event.minute != null
                ? event.minute + "'"
                : "";

        const description =
    event.description ||
    (
        event.scorer
            ? "⚽ " + event.scorer
            : "⚽ But"
    );

const equipe =
    event.team
        ? " — " + event.team
        : "";

        eventLine.textContent =
    minute + " " + description + equipe;

        eventLine.style.padding = "8px";
        eventLine.style.margin = "5px 0";
        eventLine.style.borderBottom =
            "1px solid #ddd";

        this.container.appendChild(eventLine);

    });

} else {

    this.showMessage(
        "Aucun détail de but disponible pour ce match."
    );

}

// Blessures survenues pendant le match : les afficher dans le récapitulatif.
if (Array.isArray(this.lastMatchInjuries) && this.lastMatchInjuries.length > 0) {
    const injuriesTitle = document.createElement("h3");
    injuriesTitle.textContent = "🚑 Blessures pendant le match";
    injuriesTitle.style.marginTop = "20px";
    this.container.appendChild(injuriesTitle);

    this.lastMatchInjuries.forEach(injury => {
        const line = document.createElement("p");
        line.textContent = "🚑 " + injury.player + " s'est blessé" +
            (injury.duration ? " — indisponible environ " + injury.duration + " journée(s)." : ".");
        line.style.padding = "8px";
        line.style.margin = "5px 0";
        line.style.borderBottom = "1px solid #ddd";
        this.container.appendChild(line);
    });
}

this.showMessage(
    "✅ Match terminé."
);

this.showMessage(
    "📊 Les statistiques détaillées seront ajoutées ultérieurement."
);


        }


        /* ========================= */
        /* JOURNÉE TERMINÉE */
        /* ========================= */

        this.showMessage(
            "✅ Journée " +
            matchday.day +
            " terminée."
        );


        /* ========================= */
        /* VOIR LES AUTRES RÉSULTATS */
        /* ========================= */

        this.createButton(

            "📋 Résultats de la journée",

            () => {

                this.openLatestLeagueMatchday();

            }

        );


        /* ========================= */
        /* CLASSEMENT */
        /* ========================= */

        this.createButton(

            "📊 Voir le classement",

            () => {

                this.showStandings();

            }

        );


        /* ========================= */
        /* CALENDRIER */
        /* ========================= */

        this.createButton(

            "📅 Calendrier de la ligue",

            () => {

                this.openLatestLeagueMatchday();

            }

        );


        /* ========================= */
        /* RETOUR CARRIÈRE */
        /* ========================= */

        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.returnToManager();

            }

        );

    }


    /* ================================================= */
    /* MENU CHAMPIONNAT */
    /* ================================================= */

    showChampionship() {

        this.setBottomNavigationVisible(true, "competitions");
        this.clear();


        this.showTitle(
            "🏆 Championnat"
        );


        this.createButton(

            "📊 Classement",

            () => {

                this.showStandings();

            }

        );


        this.createButton(

            "📅 Calendrier de la ligue",

            () => {

                this.openLatestLeagueMatchday();

            }

        );


        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.showManager({

                    managerName:
                        game.manager.managerName,

                    clubName:
                        game.club.name,

                    logo:
                        game.club.logo,

                    budget:
                        game.manager.budget,

                    country:
                        game.club.country,

                    league:
                        game.club.league,

                    level:
                        game.club.level,

                    reputation:
                        game.manager.reputation,

                    season:
                        game.manager.season,

                    objectives:
                        game.manager.objectives

                });

            }

        );

    }



    /* ================================================= */
    /* CLASSEMENT */
    /* ================================================= */

    showStandings() {
        this.clear();
        this.container.classList.add("manager-standings-screen");

        const leagueName = game.club?.league || game.manager?.league || "Championnat";
        const season = game.manager?.season;
        const leagueHeader = document.createElement("div");
        leagueHeader.className = "standings-league-header";

        const leagueFlag = document.createElement("div");
        leagueFlag.className = "standings-league-flag";
        leagueFlag.textContent = this.flags[leagueName] || "🏆";
        leagueHeader.appendChild(leagueFlag);

        const leagueInfo = document.createElement("div");
        leagueInfo.className = "standings-league-info";
        const leagueTitle = document.createElement("h2");
        leagueTitle.textContent = leagueName;
        const seasonLabel = document.createElement("p");
        seasonLabel.textContent = season ? "Saison " + season : "Classement du championnat";
        leagueInfo.append(leagueTitle, seasonLabel);
        leagueHeader.appendChild(leagueInfo);
        this.container.appendChild(leagueHeader);

        if (!game.standings) {
            this.showMessage("❌ Classement indisponible.");
            this.createButton("⬅️ Retour championnat", () => this.showChampionship());
            return;
        }

        const table = game.standings.getTable();
        const tableWrap = document.createElement("div");
        tableWrap.className = "standings-table-wrap";
        const tableElement = document.createElement("table");
        tableElement.className = "standings-table";
        tableElement.setAttribute("aria-label", "Classement du championnat");

        const colgroup = document.createElement("colgroup");
        ["8%", "minmax(0, 1fr)", "12%", "15%", "12%"].forEach((width, index) => {
            const col = document.createElement("col");
            if (index === 1) col.style.width = "auto";
            else col.style.width = width;
            colgroup.appendChild(col);
        });
        tableElement.appendChild(colgroup);

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["#", "Équipe", "J", "+/−", "Pts"].forEach(label => {
            const th = document.createElement("th");
            th.textContent = label;
            th.scope = "col";
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        tableElement.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.forEach((team, index) => {
            const row = document.createElement("tr");
            const isMyClub = Boolean(game.club && team.team === game.club.name);
            if (isMyClub) {
                row.classList.add("is-my-club");
                row.setAttribute("aria-label", team.team + ", votre club");
            }

            const values = [
                index + 1,
                team.team,
                team.played,
                (team.goalDifference > 0 ? "+" : "") + team.goalDifference,
                team.points
            ];

            values.forEach((value, cellIndex) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                if (cellIndex === 1) {
                    cell.className = "standings-team-name";
                    cell.title = team.team;
                } else {
                    cell.className = "standings-number";
                }
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
        tableElement.appendChild(tbody);
        tableWrap.appendChild(tableElement);
        this.container.appendChild(tableWrap);

        this.createButton("⬅️ Retour championnat", () => this.showChampionship());
    }

    /* ================================================= */
    /* OUVRIR LA DERNIÈRE JOURNÉE JOUÉE */
    /* ================================================= */

    openLatestLeagueMatchday() {

        const matchdays =
            game.calendar && Array.isArray(game.calendar.matchdays)
                ? game.calendar.matchdays
                : [];

        // Chercher la dernière journée jouée ou contenant déjà des résultats.
        let latestPlayedIndex = -1;

        for (let i = matchdays.length - 1; i >= 0; i--) {
            const day = matchdays[i];

            if (
                day &&
                (
                    day.played === true ||
                    (Array.isArray(day.results) && day.results.length > 0)
                )
            ) {
                latestPlayedIndex = i;
                break;
            }
        }

        // Repli pour les anciennes sauvegardes dont le statut "played"
        // et la liste des résultats ne sont pas renseignés correctement.
        if (latestPlayedIndex === -1 && game.currentMatchday > 0) {
            latestPlayedIndex = Math.min(
                game.currentMatchday - 1,
                matchdays.length - 1
            );
        }

        this.currentLeagueMatchday = Math.max(0, latestPlayedIndex);
        this.showLeagueCalendar();

    }



    /* ================================================= */
    /* CALENDRIER DE LA LIGUE */
    /* ================================================= */

    showLeagueCalendar() {

        this.clear();


        this.showTitle(
            "📅 Calendrier de la ligue"
        );


        if (
            !game.calendar ||
            !game.calendar.matchdays ||
            game.calendar.matchdays.length === 0
        ) {

            this.showMessage(
                "❌ Calendrier de la ligue indisponible."
            );


            this.createButton(

                "⬅️ Retour championnat",

                () => {

                    this.showChampionship();

                }

            );


            return;

        }


        const matchdays =
            game.calendar.matchdays;


        if (
            this.currentLeagueMatchday < 0
        ) {

            this.currentLeagueMatchday =
                0;

        }


        if (
            this.currentLeagueMatchday >=
            matchdays.length
        ) {

            this.currentLeagueMatchday =
                matchdays.length - 1;

        }


        const currentDay =
            matchdays[
                this.currentLeagueMatchday
            ];


        if (!currentDay) {

            this.currentLeagueMatchday =
                0;

            this.showLeagueCalendar();

            return;

        }


        /* ================================================= */
        /* NAVIGATION */
        /* ================================================= */

        const navigation =
            document.createElement(
                "div"
            );


        navigation.style.display =
            "flex";


        navigation.style.justifyContent =
            "center";


        navigation.style.alignItems =
            "center";


        navigation.style.gap =
            "15px";


        navigation.style.margin =
            "15px 0";


        const previousButton =
            document.createElement(
                "button"
            );


        previousButton.textContent =
            "◀️";


        previousButton.disabled =
            this.currentLeagueMatchday === 0;


        previousButton.addEventListener(
            "click",
            () => {

                if (
                    this.currentLeagueMatchday > 0
                ) {

                    this.currentLeagueMatchday--;

                    this.showLeagueCalendar();

                }

            }
        );


        navigation.appendChild(
            previousButton
        );


        const dayTitle =
            document.createElement(
                "strong"
            );


        dayTitle.textContent =
            "Journée " +
            currentDay.day +
            " / " +
            matchdays.length +
            (currentDay.date ? " · " + game.calendar.formatDate(currentDay.date) : "");


        navigation.appendChild(
            dayTitle
        );


        const nextButton =
            document.createElement(
                "button"
            );


        nextButton.textContent =
            "▶️";


        nextButton.disabled =
            this.currentLeagueMatchday ===
            matchdays.length - 1;


        nextButton.addEventListener(
            "click",
            () => {

                if (
                    this.currentLeagueMatchday <
                    matchdays.length - 1
                ) {

                    this.currentLeagueMatchday++;

                    this.showLeagueCalendar();

                }

            }
        );


        navigation.appendChild(
            nextButton
        );


        this.container.appendChild(
            navigation
        );


        if (currentDay.date) {
            const dateLine = document.createElement("p");
            dateLine.textContent = "📅 " + game.calendar.formatDate(currentDay.date);
            dateLine.style.textAlign = "center";
            dateLine.style.opacity = "0.85";
            this.container.appendChild(dateLine);

            const events = game.calendar.getEventsForDate(currentDay.date);
            events.forEach(event => {
                const eventLine = document.createElement("p");
                eventLine.textContent = "🗓️ " + event.title;
                eventLine.title = event.description || "";
                eventLine.style.textAlign = "center";
                this.container.appendChild(eventLine);
            });
        }

        /* ================================================= */
        /* STATUT */
        /* ================================================= */

        if (
            currentDay.played
        ) {

            this.showMessage(
                "✅ Journée terminée"
            );

        } else {

            this.showMessage(
                "⏳ Journée à jouer"
            );

        }


        /* ================================================= */
        /* MATCHS */
        /* ================================================= */

        currentDay.matches.forEach(
            match => {

                const matchBox =
                    document.createElement(
                        "div"
                    );


                matchBox.style.border =
                    "1px solid #ccc";


                matchBox.style.borderRadius =
                    "8px";


                matchBox.style.padding =
                    "10px";


                matchBox.style.margin =
                    "8px 0";


                matchBox.style.textAlign =
                    "center";


                let icon = "";


                if (
                    game.club &&
                    match.home ===
                    game.club.name
                ) {

                    icon =
                        "🏠 ";

                } else if (
                    game.club &&
                    match.away ===
                    game.club.name
                ) {

                    icon =
                        "✈️ ";

                }


                if (
                    match.played &&
                    match.result
                ) {

                    matchBox.textContent =

                        icon +

                        match.home +

                        " " +

                        match.result.homeGoals +

                        " - " +

                        match.result.awayGoals +

                        " " +

                        match.away;

                } else {

                    matchBox.textContent =

                        icon +

                        match.home +

                        " - " +

                        match.away;

                }


                if (
                    game.club &&
                    (
                        match.home ===
                        game.club.name ||

                        match.away ===
                        game.club.name
                    )
                ) {

                    matchBox.style.fontWeight =
                        "bold";

                }


                this.container.appendChild(
                    matchBox
                );

/* ================================================= */
/* BUTEURS DU MATCH */
/* ================================================= */

if (match.played && match.result) {

    const events = Array.isArray(match.result.events)
        ? match.result.events
        : [];

    const goalEvents = events
        .filter(event => event.type === "goal")
        .sort((a, b) => a.minute - b.minute);

    if (goalEvents.length > 0) {

        const scorersBox = document.createElement("div");

        scorersBox.style.margin = "0 0 15px 0";
        scorersBox.style.padding = "0 10px";

        goalEvents.forEach(event => {

            const scorerLine = document.createElement("p");

            const minute = event.minute != null
                ? event.minute + "' "
                : "";

            const scorer = event.scorer || "Buteur non renseigné";
            const team = event.team || "Équipe inconnue";

            scorerLine.textContent =
                "⚽ " + minute + scorer + " — " + team;

            scorerLine.style.margin = "5px 0";
            scorerLine.style.fontSize = "0.9em";

            scorersBox.appendChild(scorerLine);

        });

        this.container.appendChild(scorersBox);

    }

}


            }
        );

        

        /* ================================================= */
        /* CLASSEMENT */
        /* ================================================= */

        if (
            currentDay.played
        ) {

            this.createButton(

                "📊 Voir le classement",

                () => {

                    this.showStandings();

                }

            );

        }


        /* ================================================= */
        /* RETOUR */
        /* ================================================= */

        this.createButton(

            "⬅️ Retour championnat",

            () => {

                this.showChampionship();

            }

        );

    }



    /* ================================================= */
    /* CALENDRIER DU CLUB */
    /* ================================================= */

    showCalendar() {

        this.setBottomNavigationVisible(true, "matches");
        this.clear();


        this.showTitle(
            "📅 Calendrier"
        );


        if (
            !game.calendar ||
            !game.calendar.matchdays
        ) {

            this.showMessage(
                "❌ Calendrier indisponible."
            );


            this.createButton(

                "⬅️ Retour carrière",

                () => {

                    this.returnToManager();

                }

            );


            return;

        }


        game.calendar.matchdays.forEach(
            day => {

                const clubMatches =
                    day.matches.filter(
                        match =>

                            match.home ===
                            game.club.name ||

                            match.away ===
                            game.club.name
                    );


                if (
                    clubMatches.length === 0
                ) {

                    return;

                }


                this.showTitle(
                    "Journée " +
                    day.day +
                    (day.date ? " · " + game.calendar.formatDate(day.date) : "")
                );

                if (day.date) {
                    game.calendar.getEventsForDate(day.date).forEach(event => {
                        this.showMessage("🗓️ " + event.title);
                    });
                }


                clubMatches.forEach(
                    match => {

                        let matchText;


                        if (
                            match.home ===
                            game.club.name
                        ) {

                            if (
                                match.played &&
                                match.result
                            ) {

                                matchText =

                                    "🏠 " +

                                    game.club.name +

                                    " " +

                                    match.result.homeGoals +

                                    " - " +

                                    match.result.awayGoals +

                                    " " +

                                    match.away;

                            } else {

                                matchText =

                                    "🏠 " +

                                    game.club.name +

                                    " - " +

                                    match.away;

                            }

                        } else {

                            if (
                                match.played &&
                                match.result
                            ) {

                                matchText =

                                    "✈️ " +

                                    game.club.name +

                                    " " +

                                    match.result.awayGoals +

                                    " - " +

                                    match.result.homeGoals +

                                    " " +

                                    match.home;

                            } else {

                                matchText =

                                    "✈️ " +

                                    game.club.name +

                                    " - " +

                                    match.home;

                            }

                        }


                        this.showMessage(
                            matchText
                        );

                    }
                );

            }
        );


        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.returnToManager();

            }

        );

    }



    /* ================================================= */
    /* RETOUR FICHE MANAGER */
    /* ================================================= */

    returnToManager() {

        this.showManager({

            managerName:
                game.manager.managerName,

            clubName:
                game.club.name,

            logo:
                game.club.logo,

            budget:
                game.manager.budget,

            country:
                game.club.country,

            league:
                game.club.league,

            level:
                game.club.level,

            reputation:
                game.manager.reputation,

            season:
                game.manager.season,

            objectives:
                game.manager.objectives

        });

    }



    /* ================================================= */
    /* SAUVEGARDER LA CARRIÈRE */
    /* ================================================= */

    saveCurrentCareer(manager) {

        if (
            game.currentSaveSlot
        ) {

            const success =
                saveCareer(
                    game.currentSaveSlot
                );


            if (success) {

                alert(
                    "✅ Carrière sauvegardée !"
                );

            }


            return;

        }


        this.showSaveChoice(
            manager
        );

    }



    /* ================================================= */
    /* CHOIX DU SLOT */
    /* ================================================= */

    showSaveChoice(manager) {

        this.clear();


        this.showTitle(
            "💾 Sauvegarder la carrière"
        );


        this.showMessage(
            "Choisis un emplacement pour cette carrière."
        );


        const saves =
            game.save.getSaveList();


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            const save =
                saves.find(
                    item =>
                        item.slot === slot
                );


            const button =
                document.createElement(
                    "button"
                );


            if (save) {

                const date =
                    new Date(
                        save.date
                    );


                button.textContent =
                    "💾 Slot " +
                    slot +
                    " — " +
                    date.toLocaleString();

            } else {

                button.textContent =
                    "💾 Slot " +
                    slot +
                    " — Vide";

            }


            button.addEventListener(
                "click",
                () => {

                    if (save) {

                        const confirmed =
                            confirm(
                                "⚠️ Le slot " +
                                slot +
                                " contient déjà une carrière.\n\n" +
                                "Veux-tu la remplacer ?"
                            );


                        if (!confirmed) {

                            return;

                        }

                    }


                    const success =
                        saveCareer(
                            slot
                        );


                    if (success) {

                        game.currentSaveSlot =
                            slot;


                        alert(
                            "✅ Carrière sauvegardée dans le slot " +
                            slot +
                            " !"
                        );


                        this.showManager(
                            manager
                        );

                    }

                }
            );


            this.container.appendChild(
                button
            );

        }


        this.createButton(

            "⬅️ Retour",

            () => {

                this.showManager(
                    manager
                );

            }

        );

    }



    /* ================================================= */
    /* MENU SAUVEGARDES CARRIÈRE */
    /* ================================================= */

    showSaveMenu(manager) {

        this.clear();


        this.showTitle(
            "💾 Sauvegardes"
        );


        this.showMessage(
            "Choisis un emplacement de sauvegarde."
        );


        for (
            let slot = 1;
            slot <= 3;
            slot++
        ) {

            this.createSaveSlot(
                slot,
                manager
            );

        }


        this.createButton(

            "⬅️ Retour carrière",

            () => {

                this.showManager(
                    manager
                );

            }

        );

    }



    /* ================================================= */
    /* CRÉATION D'UN SLOT */
    /* ================================================= */

    createSaveSlot(
        slot,
        manager
    ) {

        const saves =
            game.save.getSaveList();


        const save =
            saves.find(
                item =>
                    item.slot === slot
            );


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "save-slot";


        box.style.margin =
            "15px 0";


        box.style.padding =
            "10px";


        box.style.border =
            "1px solid #ccc";


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            "💾 Slot " +
            slot;


        box.appendChild(
            title
        );


        const info =
            document.createElement(
                "p"
            );


        if (save) {

            const date =
                new Date(
                    save.date
                );


            info.textContent =
                "📅 " +
                date.toLocaleString();

        } else {

            info.textContent =
                "🟢 Emplacement vide";

        }


        box.appendChild(
            info
        );


        const saveButton =
            document.createElement(
                "button"
            );


        saveButton.textContent =
            "💾 Sauvegarder";


        saveButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    !save ||
                    confirm(
                        "⚠️ Ce slot contient déjà une sauvegarde.\n\n" +
                        "Veux-tu la remplacer ?"
                    );


                if (!confirmed) {

                    return;

                }


                const success =
                    saveCareer(
                        slot
                    );


                if (success) {

                    alert(
                        "✅ Partie sauvegardée dans le slot " +
                        slot +
                        " !"
                    );


                    this.showSaveMenu(
                        manager
                    );

                }

            }
        );


        box.appendChild(
            saveButton
        );


        const loadButton =
            document.createElement(
                "button"
            );


        loadButton.textContent =
            "📂 Charger";


        loadButton.disabled =
            !save;


        loadButton.addEventListener(
            "click",
            () => {

                if (!save) {

                    return;

                }


                const confirmed =
                    confirm(
                        "📂 Charger la sauvegarde du slot " +
                        slot +
                        " ?\n\n" +
                        "La carrière actuelle sera remplacée."
                    );


                if (!confirmed) {

                    return;

                }


                loadCareer(
                    slot
                );

            }
        );


        box.appendChild(
            loadButton
        );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.textContent =
            "🗑️ Supprimer";


        deleteButton.disabled =
            !save;


        deleteButton.addEventListener(
            "click",
            () => {

                if (!save) {

                    return;

                }


                const confirmed =
                    confirm(
                        "⚠️ Supprimer définitivement la sauvegarde du slot " +
                        slot +
                        " ?"
                    );


                if (!confirmed) {

                    return;

                }


                deleteCareer(
                    slot
                );


                this.showSaveMenu(
                    manager
                );

            }
        );


        box.appendChild(
            deleteButton
        );


        this.container.appendChild(
            box
        );

    }



    /* ================================================= */
    /* EFFECTIF */
    /* ================================================= */

    showPlayers(squad) {

        this.clear();


        this.showTitle(
            "👥 Effectif"
        );


        squad.players.forEach(
            player => {

                this.showMessage(

                    player.getFullName() +
                    " - " +
                    player.position +
                    " - " +
                    player.overall

                );

            }
        );

    }



    /* ================================================= */
    /* CHOIX LIGUE */
    /* ================================================= */

    showLeagueSelection(dataManager) {

        this.clear();


        this.showTitle(
            "🏆 Choisir une ligue"
        );


        const leagues =
            dataManager.getLeagues();


        this.createButton(
            "← Retour",
            () => this.showMainMenu()
        );

        // Identité de l'entraîneur, choisie avant le championnat et le club.
        const identityForm = document.createElement("div");
        identityForm.style.maxWidth = "560px";
        identityForm.style.margin = "18px auto";
        identityForm.style.padding = "16px";
        identityForm.style.border = "1px solid #555";
        identityForm.style.borderRadius = "12px";
        identityForm.style.textAlign = "left";
        identityForm.style.boxSizing = "border-box";

        const identityTitle = document.createElement("h3");
        identityTitle.textContent = "👔 Identité de l'entraîneur";
        identityForm.appendChild(identityTitle);

        const firstNameLabel = document.createElement("label");
        firstNameLabel.textContent = "Prénom";
        firstNameLabel.style.display = "block";
        firstNameLabel.style.marginTop = "10px";
        const firstNameInput = document.createElement("input");
        firstNameInput.type = "text";
        firstNameInput.autocomplete = "given-name";
        firstNameInput.placeholder = "Ton prénom";
        firstNameInput.maxLength = 40;
        firstNameInput.style.width = "100%";
        firstNameInput.style.boxSizing = "border-box";
        firstNameInput.style.padding = "12px";
        firstNameInput.style.marginTop = "5px";
        firstNameInput.style.borderRadius = "8px";
        firstNameInput.style.fontSize = "16px";
        firstNameInput.value = game.pendingManagerFirstName || "";
        identityForm.append(firstNameLabel, firstNameInput);

        const lastNameLabel = document.createElement("label");
        lastNameLabel.textContent = "Nom";
        lastNameLabel.style.display = "block";
        lastNameLabel.style.marginTop = "12px";
        const lastNameInput = document.createElement("input");
        lastNameInput.type = "text";
        lastNameInput.autocomplete = "family-name";
        lastNameInput.placeholder = "Ton nom";
        lastNameInput.maxLength = 40;
        lastNameInput.style.width = "100%";
        lastNameInput.style.boxSizing = "border-box";
        lastNameInput.style.padding = "12px";
        lastNameInput.style.marginTop = "5px";
        lastNameInput.style.borderRadius = "8px";
        lastNameInput.style.fontSize = "16px";
        lastNameInput.value = game.pendingManagerLastName || "";
        identityForm.append(lastNameLabel, lastNameInput);

        const saveIdentity = () => {
            game.pendingManagerFirstName = firstNameInput.value.trim();
            game.pendingManagerLastName = lastNameInput.value.trim();
        };
        firstNameInput.addEventListener("input", saveIdentity);
        lastNameInput.addEventListener("input", saveIdentity);
        this.container.appendChild(identityForm);

        leagues.forEach(
            league => {

                this.createButton(

                    this.flags[league] +
                    " " +
                    league,

                    () => {

                        this.showClubSelection(
                            dataManager,
                            league
                        );

                    }

                );

            }
        );

    }



    /* ================================================= */
    /* ENTRAÎNEMENT DES JOUEURS */
    /* ================================================= */

    showTraining(manager) {
        this.clear();
        this.showTitle("🏋️ Centre d'entraînement");
        this.showMessage("Les séances sont limitées à une par joueur entre deux journées jouées. Une progression de note demande au moins 5 entraînements, parfois jusqu'à 20.");

        const players = Array.isArray(game.players) ? game.players : [];
        if (!players.length) {
            this.showMessage("Aucun joueur disponible pour l'entraînement.");
            this.createButton("⬅️ Retour carrière", () => this.returnToManager());
            return;
        }

        const isInjured = player => {
            const injury = String(player.blessure ?? player.injury ?? "").trim().toLowerCase();
            const days = Math.max(0, Number(player.joursBlessure ?? player.injuryDays) || 0);
            return days > 0 || (injury !== "" && !["false", "aucune", "aucun", "null", "0"].includes(injury));
        };
        const getName = player => [player.prenom || "", player.nom || ""].filter(Boolean).join(" ") || "Joueur sans nom";
        const getPositionGroup = player => {
            const position = String(player.poste || player.position || "").trim().toUpperCase();
            if (["GB", "GK"].includes(position)) return "GB";
            if (["DC", "DCD", "DCG", "DD", "DG", "DLD", "DLG", "DDG", "DL", "DF", "DCDG"].includes(position)) return "DEF";
            if (["MDC", "MC", "MCD", "MCG", "MD", "MG", "MOC", "MOCD", "MOCG", "MR", "ML", "MIL"].includes(position)) return "MIL";
            if (["BU", "AC", "AD", "AG", "AT", "AV", "SA"].includes(position)) return "ATT";
            return "OTHER";
        };

        const form = document.createElement("div");
        form.style.maxWidth = "560px";
        form.style.margin = "20px auto";
        form.style.padding = "15px";
        form.style.border = "1px solid #555";
        form.style.borderRadius = "12px";
        form.style.textAlign = "left";

        const makeLabel = text => {
            const label = document.createElement("label");
            label.textContent = text;
            label.style.display = "block";
            label.style.marginBottom = "6px";
            return label;
        };
        const makeSelect = () => {
            const select = document.createElement("select");
            select.style.width = "100%";
            select.style.boxSizing = "border-box";
            select.style.padding = "12px";
            select.style.marginBottom = "14px";
            select.style.fontSize = "16px";
            return select;
        };

        const modeLabel = makeLabel("Format de la séance");
        const modeSelect = makeSelect();
        [["individuel", "👤 Entraînement individuel"], ["collectif", "👥 Entraînement de groupe"]].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            modeSelect.appendChild(option);
        });

        const playerLabel = makeLabel("Joueur à entraîner");
        const playerSelect = makeSelect();
        players.forEach((player, index) => {
            const option = document.createElement("option");
            option.value = String(index);
            const rating = Number(player.note) || 0;
            const potential = Math.max(rating, Number(player.potentiel) || rating);
            let status = "";
            if (isInjured(player)) {
                status = " · Blessé";
                option.disabled = true;
            } else if (player.entrainementEnAttenteMatch) {
                status = " · Déjà Entraîné";
                option.disabled = true;
            } else if ((Number(player.fatigue) || 0) >= 90) {
                status = " · INDISPONIBLE (fatigue élevée)";
                option.disabled = true;
            }
            option.textContent = getName(player) + " · " + (player.poste || player.position || "?") +
                " · Note " + rating + " · Potentiel " + potential +
                " · Fatigue " + (Number(player.fatigue) || 0) + "%" + status;
            playerSelect.appendChild(option);
        });

        const groupLabel = makeLabel("Groupe à entraîner");
        const groupSelect = makeSelect();
        [["TOUS", "Effectif entier"], ["GB", "Gardiens"], ["DEF", "Défenseurs"], ["MIL", "Milieux"], ["ATT", "Attaquants"], ["OTHER", "Autres postes"]].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            groupSelect.appendChild(option);
        });

        const focusLabel = makeLabel("Type de séance");
        const focusSelect = makeSelect();
        [["technique", "⚽ Technique"], ["physique", "💪 Physique"], ["tactique", "🧠 Tactique"], ["mental", "🔥 Mental"]].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            focusSelect.appendChild(option);
        });

        const info = document.createElement("p");
        info.style.color = "#bbb";
        info.style.fontSize = "13px";
        info.textContent = "Chaque joueur ne peut participer qu'à une séance avant le prochain match. Les séances collectives entraînent tous les joueurs éligibles du groupe choisi. Chaque entraînement compte dans une progression variable de 5 à 20 séances.";
        const trainButton = document.createElement("button");
        trainButton.type = "button";
        trainButton.textContent = "Lancer la séance";
        trainButton.style.width = "100%";

        const refreshAvailability = () => {
            const individual = modeSelect.value === "individuel";
            playerLabel.style.display = individual ? "block" : "none";
            playerSelect.style.display = individual ? "block" : "none";
            groupLabel.style.display = individual ? "none" : "block";
            groupSelect.style.display = individual ? "none" : "block";
        };
        modeSelect.addEventListener("change", refreshAvailability);
        refreshAvailability();

        const trainPlayer = (player, focus) => {
            const rating = Math.max(0, Number(player.note) || 0);
            const potential = Math.max(rating, Number(player.potentiel) || rating);
            const fatigue = Math.max(0, Math.min(100, Number(player.fatigue) || 0));
            const currentForm = Math.max(0, Math.min(100, player.forme == null ? 70 : Number(player.forme)));
            player.entrainementEnAttenteMatch = true;
            player.fatigue = Math.min(100, fatigue + (focus === "physique" ? 12 : 6 + Math.floor(Math.random() * 3)));
            player.forme = Math.max(0, currentForm - (focus === "physique" ? 4 : 2));

            if (rating >= potential) {
                return { player, progressed: false, message: "⭐ " + getName(player) + " · Potentiel atteint (" + rating + ")" };
            }

            // Migration douce des anciennes sauvegardes vers une progression décimale.
            if (!Number.isFinite(Number(player.progressionEntrainement))) {
                const oldCount = Math.max(0, Number(player.entrainementsDepuisProgression) || 0);
                const oldThreshold = Math.max(5, Number(player.seuilProgression) || 10);
                player.progressionEntrainement = Math.min(0.95, oldCount / oldThreshold);
            }

            // Impact aléatoire par séance : de 0,05 à 0,20, soit au moins
            // 5 séances et au maximum 20 séances pour atteindre le point suivant.
            const impact = (5 + Math.floor(Math.random() * 16)) / 100;
            player.progressionEntrainement = Math.min(1, Number(player.progressionEntrainement) + impact);

            if (player.progressionEntrainement >= 1) {
                player.note = Math.min(potential, rating + 1);
                this.updatePlayerMarketValue(player);
                player.progressionEntrainement = 0;
                player.entrainementsDepuisProgression = 0;
                player.seuilProgression = null;
                return { player, progressed: true, message: "⭐ " + getName(player) + " · Note " + rating + " → " + player.note };
            }

            return {
                player,
                progressed: false,
                message: "✓ " + getName(player) + " · Séance effectuée · Progression " + Number(player.progressionEntrainement).toFixed(2)
            };
        };

        trainButton.addEventListener("click", () => {
            const focus = focusSelect.value;
            let targets = [];
            if (modeSelect.value === "individuel") {
                const player = players[Number(playerSelect.value)];
                if (player) targets = [player];
            } else {
                const group = groupSelect.value;
                targets = players.filter(player => group === "TOUS" || getPositionGroup(player) === group);
            }

            const eligible = targets.filter(player =>
                !isInjured(player) &&
                !player.entrainementEnAttenteMatch &&
                (Number(player.fatigue) || 0) < 90
            );

            if (!eligible.length) {
                this.showTrainingResult(manager, "Aucun joueur disponible pour cette séance. Les joueurs blessés, déjà entraînés ou trop fatigués doivent attendre la prochaine journée jouée ou récupérer.");
                return;
            }

            const results = eligible.map(player => trainPlayer(player, focus));
            const successes = results.filter(result => result.progressed).length;
            const title = modeSelect.value === "collectif" ? "Séance collective" : "Séance individuelle";
            // Afficher tous les joueurs entraînés, sans révéler le nombre de séances restant.
            const details = results.map(result => result.message);
            const summary = "👥 " + title + " terminée : " + eligible.length +
                " joueur(s) entraîné(s), " + successes + " progression(s).";
            this.showTrainingResult(manager, summary + "\n\n" + details.join("\n"));
        });

        form.append(modeLabel, modeSelect, playerLabel, playerSelect, groupLabel, groupSelect, focusLabel, focusSelect, info, trainButton);
        this.container.appendChild(form);
        this.createButton("⬅️ Retour carrière", () => this.returnToManager());
    }

    showTrainingResult(manager, message) {
        this.clear();
        this.showTitle("🏋️ Résultat de l'entraînement");
        const resultText = document.createElement("p");
        resultText.style.whiteSpace = "pre-line";
        resultText.textContent = message;
        this.container.appendChild(resultText);
        this.createButton("🔁 Nouvelle séance", () => this.showTraining(manager));
        this.createButton("⬅️ Retour carrière", () => this.returnToManager());
    }


    /* ================================================= */
    /* MARCHÉ DES TRANSFERTS */
    /* ================================================= */

    showTransferMarket(manager) {
        this.clear();
        this.container.classList.add("manager-transfer-screen");

        const topBar = document.createElement("div");
        topBar.style.display = "flex";
        topBar.style.alignItems = "center";
        topBar.style.justifyContent = "flex-start";
        topBar.style.margin = "0 0 12px";
        topBar.style.position = "sticky";
        topBar.style.top = "0";
        topBar.style.zIndex = "5";
        topBar.style.padding = "4px 0";
        topBar.style.background = "inherit";

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.textContent = "← Retour";
        backButton.style.width = "auto";
        backButton.style.padding = "6px 10px";
        backButton.style.fontSize = "13px";
        backButton.style.borderRadius = "8px";
        backButton.style.margin = "0";
        backButton.addEventListener("click", () => { this.transferMarketFilters = null; this.showManager(manager); });
        topBar.appendChild(backButton);
        this.container.appendChild(topBar);

        this.showTitle("Marché des transferts");
        const marketSummary = document.createElement("p");
        marketSummary.className = "transfer-market-summary";
        marketSummary.textContent = manager.clubName + " · Budget : " + Number(manager.budget || 0).toLocaleString("fr-FR") + " €";
        this.container.appendChild(marketSummary);

        const marketTabs = document.createElement("div");
        marketTabs.className = "transfer-market-tabs";
        const savedFilters = this.transferMarketFilters || {};
        let activeMarketTab = savedFilters.activeMarketTab || "all";
        const filterPanelPlaceholder = null;
        const tabConfig = [["all", "Tout"], ["search", "Recherche"], ["offers", "Mes offres"]];
        const marketTabButtons = {};
        tabConfig.forEach(([key, label]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.className = activeMarketTab === key ? "is-active" : "";
            button.addEventListener("click", () => {
                activeMarketTab = key;
                Object.entries(marketTabButtons).forEach(([tab, btn]) => btn.classList.toggle("is-active", tab === key));
                filters.hidden = key !== "search";
                render();
            });
            marketTabButtons[key] = button;
            marketTabs.appendChild(button);
        });
        this.container.appendChild(marketTabs);

        const savedFilters2 = this.transferMarketFilters || {};
        const clubs = game.data?.clubs || [];
        const leagues = [...new Set(clubs.map(club => club.ligue).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
        const filters = document.createElement("div");
        filters.style.display = "grid";
        filters.style.gap = "10px";
        filters.style.margin = "12px 0";
        filters.hidden = activeMarketTab !== "search";
        this.container.appendChild(filters);

        const leagueLabel = document.createElement("label");
        leagueLabel.textContent = "🏆 Championnat";
        leagueLabel.style.fontWeight = "bold";
        filters.appendChild(leagueLabel);

        const leagueSelect = document.createElement("select");
        leagueSelect.style.width = "100%";
        leagueSelect.style.boxSizing = "border-box";
        leagueSelect.style.padding = "12px";
        leagueSelect.style.borderRadius = "8px";
        const allLeagues = document.createElement("option");
        allLeagues.value = "";
        allLeagues.textContent = "Tous les championnats";
        leagueSelect.appendChild(allLeagues);
        leagues.forEach(league => {
            const option = document.createElement("option");
            option.value = league;
            option.textContent = league;
            leagueSelect.appendChild(option);
        });
        leagueSelect.value = savedFilters.league || "";
        filters.appendChild(leagueSelect);

        const search = document.createElement("input");
        search.type = "search";
        search.placeholder = "🔎 Rechercher un joueur ou un club...";
        search.setAttribute("aria-label", "Rechercher un joueur ou un club");
        search.style.width = "100%";
        search.style.boxSizing = "border-box";
        search.style.padding = "12px";
        search.style.borderRadius = "8px";
        search.style.fontSize = "16px";
        search.value = savedFilters.search || "";
        filters.appendChild(search);

        const ageToggle = document.createElement("button");
        ageToggle.type = "button";
        ageToggle.textContent = "🎂 Filtrer par âge ▾";
        ageToggle.style.width = "100%";
        filters.appendChild(ageToggle);

        const agePanel = document.createElement("div");
        agePanel.style.display = "none";
        agePanel.style.padding = "12px";
        agePanel.style.border = "1px solid #555";
        agePanel.style.borderRadius = "8px";
        agePanel.style.gap = "8px";
        filters.appendChild(agePanel);

        let minAge = Number.isFinite(Number(savedFilters.minAge)) ? Number(savedFilters.minAge) : 15;
        let maxAge = Number.isFinite(Number(savedFilters.maxAge)) ? Number(savedFilters.maxAge) : 40;
        minAge = Math.max(15, Math.min(40, minAge));
        maxAge = Math.max(minAge, Math.min(40, maxAge));
        const ageValue = document.createElement("strong");
        ageValue.textContent = "Âge : " + minAge + "–" + maxAge + " ans";
        agePanel.appendChild(ageValue);

        const minLabel = document.createElement("label");
        minLabel.textContent = "Âge minimum : 15 ans";
        agePanel.appendChild(minLabel);
        const minSlider = document.createElement("input");
        minSlider.type = "range";
        minSlider.min = "15";
        minSlider.max = "40";
        minSlider.value = String(minAge);
        minSlider.style.width = "100%";
        agePanel.appendChild(minSlider);

        const maxLabel = document.createElement("label");
        maxLabel.textContent = "Âge maximum : 40 ans";
        agePanel.appendChild(maxLabel);
        const maxSlider = document.createElement("input");
        maxSlider.type = "range";
        maxSlider.min = "15";
        maxSlider.max = "40";
        maxSlider.value = String(maxAge);
        maxSlider.style.width = "100%";
        agePanel.appendChild(maxSlider);

        const resetFiltersButton = document.createElement("button");
        resetFiltersButton.type = "button";
        resetFiltersButton.textContent = "↺ Réinitialiser les filtres";
        resetFiltersButton.style.display = "block";
        resetFiltersButton.style.width = "auto";
        resetFiltersButton.style.margin = "8px auto 0";
        resetFiltersButton.style.padding = "8px 14px";
        resetFiltersButton.style.fontSize = "14px";
        resetFiltersButton.style.borderRadius = "8px";
        filters.appendChild(resetFiltersButton);

        const agePanelOpen = Boolean(savedFilters.agePanelOpen);
        agePanel.style.display = agePanelOpen ? "grid" : "none";
        ageToggle.textContent = agePanelOpen ? "🎂 Filtrer par âge ▴" : "🎂 Filtrer par âge ▾";
        ageToggle.addEventListener("click", () => {
            const isHidden = agePanel.style.display === "none";
            agePanel.style.display = isHidden ? "grid" : "none";
            ageToggle.textContent = isHidden ? "🎂 Filtrer par âge ▴" : "🎂 Filtrer par âge ▾";
            saveFilters();
        });

        resetFiltersButton.addEventListener("click", () => {
            leagueSelect.value = "";
            search.value = "";
            minAge = 15;
            maxAge = 40;
            minSlider.value = "15";
            maxSlider.value = "40";
            minLabel.textContent = "Âge minimum : 15 ans";
            maxLabel.textContent = "Âge maximum : 40 ans";
            ageValue.textContent = "Âge : 15–40 ans";
            agePanel.style.display = "none";
            ageToggle.textContent = "🎂 Filtrer par âge ▾";
            render();
        });

        const tableHeader = document.createElement("div");
        tableHeader.className = "transfer-market-header-row";
        ["Poste", "Nom", "Âge", "Note", "Valeur"].forEach(label => {
            const cell = document.createElement("span");
            cell.textContent = label;
            tableHeader.appendChild(cell);
        });
        this.container.appendChild(tableHeader);

        const results = document.createElement("div");
        results.className = "transfer-market-results";
        this.container.appendChild(results);

        const saveFilters = () => {
            this.transferMarketFilters = {
                league: leagueSelect.value,
                search: search.value,
                minAge,
                maxAge,
                agePanelOpen: agePanel.style.display !== "none",
                activeMarketTab
            };
        };

        const render = () => {
            saveFilters();
            results.innerHTML = "";
            const query = search.value.trim().toLocaleLowerCase("fr");
            const players = (game.data?.players || []).filter(player => {
                const fullNameForOffer = [player.prenom || "", player.nom || ""].join(" ").trim();
                const offerKey = player.id ?? fullNameForOffer;
                const hasOffer = Array.isArray(this.transferMarketOffers) && this.transferMarketOffers.some(offer => offer.playerId === offerKey && offer.managerClub === manager.clubName);
                if (activeMarketTab === "offers") return hasOffer;
                const playerClub = String(player.club || "");
                const clubData = clubs.find(club => club.nom === playerClub);
                const playerLeague = clubData?.ligue || "";
                const fullName = [player.prenom || "", player.nom || ""].join(" ");
                const age = Number(player.age) || 0;
                const available = playerClub !== manager.clubName &&
                    player.retraite !== true && player.retraite !== "true";
                if (!available) return false;
                if (activeMarketTab !== "search") return true;
                return (!leagueSelect.value || playerLeague === leagueSelect.value) &&
                    age >= minAge && age <= maxAge &&
                    [fullName, playerClub, player.poste || "", player.nationalite || ""]
                        .join(" ").toLocaleLowerCase("fr").includes(query);
            });

            const count = document.createElement("p");
            count.style.gridColumn = "1 / -1";
            count.style.color = "#bbb";
            count.textContent = players.length + " joueur" + (players.length > 1 ? "s" : "") + " trouvé" + (players.length > 1 ? "s" : "");
            results.appendChild(count);

            if (!players.length) {
                const empty = document.createElement("p");
                empty.textContent = "Aucun joueur ne correspond à ces filtres.";
                results.appendChild(empty);
                return;
            }

            players.slice(0, 100).forEach(player => {
                const card = document.createElement("div");
                card.className = "transfer-player-row";

                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
                card.setAttribute("aria-label", "Voir la fiche de " + [player.prenom || "", player.nom || ""].join(" ").trim());
                card.addEventListener("click", () => {
                    this.playerUI.showProfile(
                        player,
                        manager,
                        () => this.showTransferMarket(manager),
                        { hidePotential: true, backLabel: "← Retour au marché" }
                    );
                });
                card.addEventListener("keydown", event => {
                    if (event.target === card && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        this.playerUI.showProfile(
                            player,
                            manager,
                            () => this.showTransferMarket(manager),
                            { hidePotential: true, backLabel: "← Retour au marché" }
                        );
                    }
                });

                const playerLine = document.createElement("div");
                playerLine.className = "transfer-player-main-row";
                const position = document.createElement("span");
                position.className = "transfer-player-position";
                position.textContent = player.poste || "—";
                const name = document.createElement("strong");
                name.className = "transfer-player-name";
                name.textContent = [player.prenom || "", player.nom || ""].join(" ").trim();
                const age = document.createElement("span");
                age.className = "transfer-player-age";
                age.textContent = player.age ?? "—";
                const rating = document.createElement("strong");
                rating.className = "transfer-player-rating";
                rating.textContent = player.note ?? "—";
                const valuePrice = Math.max(0, Number(player.valeur) || 0);
                const value = document.createElement("strong");
                value.className = "transfer-player-value";
                value.textContent = valuePrice.toLocaleString("fr-FR") + " €";
                playerLine.append(position, name, age, rating, value);

                const negotiate = document.createElement("button");
                negotiate.type = "button";
                negotiate.className = "transfer-negotiate-button";
                negotiate.textContent = "🤝 Négocier avec le club";
                negotiate.style.width = "100%";
                negotiate.style.padding = "10px";
                negotiate.style.marginTop = "10px";
                negotiate.style.borderRadius = "8px";

                const negotiationBox = document.createElement("div");
                negotiationBox.style.display = "none";
                negotiationBox.style.marginTop = "10px";
                negotiationBox.style.textAlign = "left";

                let negotiationRound = 0;
                let negotiationClosed = false;
                const overall = Math.max(1, Math.min(99, Number(player.note) || 70));
                const potential = Math.max(overall, Math.min(99, Number(player.potentiel) || overall));
                const offerLabel = document.createElement("label");
                offerLabel.textContent = "Ton offre (€)";
                offerLabel.style.display = "block";
                const offerInput = document.createElement("input");
                offerInput.type = "number";
                offerInput.min = "1";
                offerInput.step = "50000";
                offerInput.value = Math.round(valuePrice * 0.75);
                offerInput.style.width = "100%";
                offerInput.style.boxSizing = "border-box";
                offerInput.style.padding = "9px";
                offerInput.style.margin = "6px 0";
                const stepLabel = document.createElement("strong");
                stepLabel.textContent = "Étape 1/3 — Première offre";
                stepLabel.style.display = "block";
                const submitOffer = document.createElement("button");
                submitOffer.type = "button";
                submitOffer.textContent = "Envoyer l'offre";
                submitOffer.style.width = "100%";
                const response = document.createElement("p");
                response.style.fontSize = "13px";
                response.style.lineHeight = "1.4";

                negotiate.addEventListener("click", event => {
                    event.stopPropagation();
                    negotiationBox.style.display = negotiationBox.style.display === "none" ? "block" : "none";
                });

                offerInput.addEventListener("click", event => event.stopPropagation());

                submitOffer.addEventListener("click", event => {
                    event.stopPropagation();
                    if (negotiationClosed) return;

                    const offer = Math.floor(Number(offerInput.value));
                    if (!Number.isFinite(offer) || offer <= 0) {
                        response.textContent = "Entre un montant supérieur à 0 €.";
                        return;
                    }
                    if (offer > Number(manager.budget || 0)) {
                        response.textContent = "❌ Cette offre dépasse ton budget actuel.";
                        return;
                    }
                    if (player.club === manager.clubName) {
                        response.textContent = "Ce joueur appartient déjà à ton club.";
                        return;
                    }

                    negotiationRound++;
                    if (!Array.isArray(this.transferMarketOffers)) this.transferMarketOffers = [];
                    const offerPlayerId = player.id ?? [player.prenom || "", player.nom || ""].join(" ").trim();
                    let trackedOffer = this.transferMarketOffers.find(item => item.playerId === offerPlayerId && item.managerClub === manager.clubName);
                    if (!trackedOffer) {
                        trackedOffer = { playerId: offerPlayerId, managerClub: manager.clubName, playerName: name.textContent, status: "En négociation", amount: offer };
                        this.transferMarketOffers.push(trackedOffer);
                    }
                    trackedOffer.amount = offer;
                    trackedOffer.status = "En négociation";
                    stepLabel.textContent = "Étape " + negotiationRound + "/3 — " +
                        (negotiationRound === 3 ? "Offre finale" : "Négociation en cours");

                    // Les clubs sont plus souples pour les joueurs sous 80 de général.
                    // Les joueurs très cotés peuvent au contraire coûter plus que leur valeur estimée.
                    let acceptanceRatio;
                    if (overall < 70) acceptanceRatio = 0.78;
                    else if (overall < 75) acceptanceRatio = 0.83;
                    else if (overall < 80) acceptanceRatio = 0.90;
                    else if (overall < 85) acceptanceRatio = 1.00;
                    else if (overall < 90) acceptanceRatio = 1.08;
                    else acceptanceRatio = 1.18;

                    // Un potentiel élevé rend le club plus réticent à vendre :
                    // +1 % par point de potentiel au-dessus de la note, plafonné à +20 %.
                    const potentialResistance = 1 + Math.min(0.20, Math.max(0, potential - overall) * 0.01);
                    const minimumAcceptable = Math.round(valuePrice * acceptanceRatio * potentialResistance);
                    if (offer >= minimumAcceptable || (valuePrice === 0 && offer > 0)) {
                        const previousClub = player.club;
                        manager.budget = Number(manager.budget || 0) - offer;
                        if (game.club) game.club.budget = manager.budget;
                        player.club = manager.clubName;
                        if (!Array.isArray(game.players)) game.players = [];
                        if (!game.players.some(existing => existing === player || (existing.prenom === player.prenom && existing.nom === player.nom))) {
                            game.players.push(player);
                        }
                        if (game.tactics && typeof game.tactics.initializeSquad === "function") {
                            game.tactics.initializeSquad(game.players);
                        }
                        negotiationClosed = true;
                        if (trackedOffer) trackedOffer.status = "Acceptée";
                        response.textContent = "✅ " + player.club + " accepte " + offer.toLocaleString("fr-FR") + " €. Transfert conclu !";
                        submitOffer.disabled = true;
                        offerInput.disabled = true;
                        negotiate.disabled = true;
                        this.showTransferMarket(manager);
                        this.showMessage("✅ Transfert conclu : " + name.textContent + " rejoint " + manager.clubName + " depuis " + previousClub + " pour " + offer.toLocaleString("fr-FR") + " €.");
                        return;
                    }

                    if (negotiationRound >= 3) {
                        negotiationClosed = true;
                        stepLabel.textContent = "Étape 3/3 — Négociation terminée";
                        response.textContent = "❌ " + player.club + " refuse ton offre finale de " + offer.toLocaleString("fr-FR") + " €. Le club ne souhaite pas aller plus bas.";
                        submitOffer.disabled = true;
                        offerInput.disabled = true;
                        return;
                    }

                    // Contre-offre adaptée à la note générale : les joueurs très cotés sont moins négociables.
                    let counterRatio;
                    if (overall < 70) counterRatio = 0.88;
                    else if (overall < 75) counterRatio = 0.92;
                    else if (overall < 80) counterRatio = 0.97;
                    else if (overall < 85) counterRatio = 1.05;
                    else if (overall < 90) counterRatio = 1.12;
                    else counterRatio = 1.22;

                    const counterOffer = Math.max(offer + 1, Math.ceil((valuePrice * counterRatio) / 100000) * 100000);
                    const clubName = player.club || "Le club";
                    response.textContent = "🤝 " + clubName + " refuse cette offre de " + offer.toLocaleString("fr-FR") +
                        " €, mais fait un effort et propose " + counterOffer.toLocaleString("fr-FR") +
                        " €. Tu as encore " + (3 - negotiationRound) + " étape(s) pour trouver un accord.";
                    offerInput.value = Math.min(counterOffer, Number(manager.budget || 0));
                    if (Number(manager.budget || 0) < counterOffer) {
                        response.textContent += " Attention : cette contre-offre dépasse ton budget.";
                    }
                    submitOffer.textContent = negotiationRound === 2 ? "Envoyer l'offre finale" : "Répondre à la contre-offre";
                });

                negotiationBox.append(stepLabel, offerLabel, offerInput, submitOffer, response);
                card.append(playerLine);
                if (activeMarketTab === "offers") {
                    const tracked = this.transferMarketOffers?.find(item => item.playerId === (player.id ?? [player.prenom || "", player.nom || ""].join(" ").trim()) && item.managerClub === manager.clubName);
                    const offerStatus = document.createElement("p");
                    offerStatus.className = "transfer-offer-status";
                    offerStatus.textContent = (tracked?.status || "En attente") + (tracked?.amount ? " · " + Number(tracked.amount).toLocaleString("fr-FR") + " €" : "");
                    card.appendChild(offerStatus);
                }
                results.appendChild(card);
            });

            if (players.length > 100) {
                const note = document.createElement("p");
                note.style.gridColumn = "1 / -1";
                note.textContent = "Affichage limité aux 100 premiers résultats. Utilise les filtres pour affiner.";
                results.appendChild(note);
            }
        };

        const updateAge = () => {
            minAge = Math.min(Number(minSlider.value), Number(maxSlider.value));
            maxAge = Math.max(Number(minSlider.value), Number(maxSlider.value));
            minLabel.textContent = "Âge minimum : " + minAge + " ans";
            maxLabel.textContent = "Âge maximum : " + maxAge + " ans";
            ageValue.textContent = "Âge : " + minAge + "–" + maxAge + " ans";
            minSlider.value = String(minAge);
            maxSlider.value = String(maxAge);
            render();
        };

        leagueSelect.addEventListener("change", render);
        search.addEventListener("input", render);
        minSlider.addEventListener("input", updateAge);
        maxSlider.addEventListener("input", updateAge);
        render();

    }

    /* ================================================= */
    /* CHOIX CLUB */
    /* ================================================= */

    showClubSelection(
        dataManager,
        league
    ) {

        this.clear();


        this.showTitle(
            "🏟️ " +
            league
        );


        const clubs =
            dataManager.getClubsByLeague(
                league
            );


        clubs.forEach(
            club => {

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

            }
        );

    }



    /* ================================================= */
    /* DÉTAIL CLUB */
    /* ================================================= */

    showClubDetails(
        club,
        dataManager,
        league
    ) {

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
            club.budget.toLocaleString() +
            " €"
        );


        this.createButton(

            "✅ Choisir ce club",

            () => {
                const firstName = String(game.pendingManagerFirstName || "").trim();
                const lastName = String(game.pendingManagerLastName || "").trim();
                if (!firstName || !lastName) {
                    alert("Renseigne ton prénom et ton nom avant de choisir un club.");
                    this.showLeagueSelection(dataManager);
                    return;
                }

                chooseClub(club, firstName + " " + lastName);

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