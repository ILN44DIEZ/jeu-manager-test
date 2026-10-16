class PlayerUI {
    constructor(ui) {
        this.ui = ui;
        this.container = ui.container;
    }

    showProfile(player, manager, onBack, options = {}) {
        this.ui.clear();
        const tacticsUI = this.ui?.tacticsUI;
        player = tacticsUI?.getCanonicalPlayer ? tacticsUI.getCanonicalPlayer(player) : player;
        const fullName = [player.prenom || player.firstName || "", player.nom || player.lastName || ""].join(" ").trim() || player.name || "Fiche joueur";
        const sharedCondition = tacticsUI?.getPlayerConditionValues ? tacticsUI.getPlayerConditionValues(player) : null;
        const injured = sharedCondition ? sharedCondition.injured : (Number(player.joursBlessure ?? player.injuryDays ?? 0) > 0 || (player.blessure && !["false", "aucune", "aucun", "0"].includes(String(player.blessure).toLowerCase())));
        const number = value => value === undefined || value === null || value === "" ? "—" : String(value);
        const money = value => value == null ? "—" : Number(value).toLocaleString("fr-FR") + " €";
        const form = sharedCondition?.form ?? Math.max(0, Math.min(100, Number(player.forme ?? player.form ?? player.moral ?? 70)));
        const fatigue = sharedCondition?.fatigue ?? Math.max(0, Math.min(100, Number(player.fatigue ?? 0)));
        const energy = sharedCondition?.energy ?? Math.max(0, Math.min(100, Number(player.energy ?? player.energie ?? (100 - Number(player.fatigue ?? 0)))));        const overall = player.note ?? player.overall ?? "—";
        const potential = player.potentiel ?? player.potential ?? "—";
        const value = player.valeur ?? player.marketValue;

        const overlay = document.createElement("div");
        overlay.className = "player-profile-overlay";
        overlay.style.cssText = "position:relative;width:100%;max-width:700px;margin:16px auto;padding:12px;box-sizing:border-box;background:linear-gradient(145deg,#202020,#101010);border:1px solid #383838;border-radius:22px;text-align:left;color:#f7f7f7;";
        const closeX = document.createElement("button");
        closeX.type = "button";
        closeX.textContent = "×";
        closeX.setAttribute("aria-label", "Fermer la fiche");
        closeX.style.cssText = "display:block;margin:0 0 8px auto;padding:0;width:34px;height:34px;border:0;border-radius:50%;background:#303030;color:#aaa;font-size:27px;line-height:1;";
        const close = () => {
            if (typeof onBack === "function") onBack();
            else if (manager) this.ui.showManager(manager);
        };
        closeX.addEventListener("click", close);
        overlay.appendChild(closeX);

        const header = document.createElement("div");
        header.style.cssText = "display:block;width:100%;margin-bottom:16px;";
        const identity = document.createElement("div");
        identity.style.cssText = "width:100%;min-width:0;";
        const name = document.createElement("h2");
        name.textContent = fullName;
        name.style.cssText = "margin:0 0 4px;font-size:clamp(20px,5vw,27px);text-align:left;";
        const position = document.createElement("div");
        position.textContent = player.posteLong || player.posteNom || player.poste || player.position || "Poste inconnu";
        position.style.cssText = "font-size:14px;color:#ddd;margin-bottom:6px;";
        const nationality = document.createElement("div");
        nationality.textContent = (player.drapeau || "") + (player.nationalite ? (player.drapeau ? " " : "") + player.nationalite : "Nationalité inconnue") + " · " + number(player.age) + " ans";
        nationality.style.cssText = "font-size:14px;color:#ddd;margin-bottom:10px;";
        identity.append(name, position, nationality);

        const ratings = document.createElement("div");
        ratings.style.cssText = "display:grid;grid-template-columns:1.1fr 1fr 1fr;border:1px solid #454545;border-radius:12px;overflow:hidden;";
        const ratingCell = (label, val, highlight) => {
            const cell = document.createElement("div");
            cell.style.cssText = "padding:8px 5px;text-align:center;background:" + (highlight ? "#102818" : "#191919") + ";border-right:1px solid #444;";
            const caption = document.createElement("div");
            caption.textContent = label;
            caption.style.cssText = "font-size:11px;color:#bbb;margin-bottom:5px;";
            const amount = document.createElement("strong");
            amount.textContent = val;
            amount.style.cssText = "font-size:" + (highlight ? "22px" : "15px") + ";";
            cell.append(caption, amount);
            return cell;
        };
        ratings.append(ratingCell("⭐ Note", String(overall), true), ratingCell("Potentiel", String(potential), false), ratingCell("Valeur", value == null ? "—" : (Number(value) >= 1000000 ? (Number(value)/1000000).toLocaleString("fr-FR",{maximumFractionDigits:1})+" M€" : money(value)), false));
        identity.appendChild(ratings);
        header.appendChild(identity);
        overlay.appendChild(header);

        // La négociation est disponible uniquement pour les joueurs d'un autre club.
        const belongsToManager = Boolean(manager && player.club === manager.clubName);
        if (manager && !belongsToManager && options.allowNegotiation !== false) {
            const negotiationSection = document.createElement("section");
            negotiationSection.className = "player-transfer-negotiation";
            negotiationSection.style.cssText = "margin:12px 0 16px;padding:12px;border:1px solid #344656;border-radius:14px;background:#121f2a;";
            const negotiateButton = document.createElement("button");
            negotiateButton.type = "button";
            negotiateButton.textContent = "🤝 Négocier avec le club";
            negotiateButton.style.cssText = "width:100%;margin:0;padding:12px;border-radius:10px;font-weight:700;";
            const negotiationForm = document.createElement("div");
            negotiationForm.style.cssText = "display:none;margin-top:12px;";
            const offerLabel = document.createElement("label");
            offerLabel.textContent = "Montant de l'offre (€)";
            offerLabel.style.cssText = "display:block;margin-bottom:6px;color:#d5e0e8;";
            const offerInput = document.createElement("input");
            offerInput.type = "number";
            offerInput.min = "1";
            offerInput.step = "50000";
            offerInput.value = String(Math.round(Math.max(0, Number(player.valeur ?? player.marketValue) || 0) * 0.75));
            offerInput.style.cssText = "width:100%;box-sizing:border-box;padding:11px;border-radius:8px;margin-bottom:8px;";
            const sendOffer = document.createElement("button");
            sendOffer.type = "button";
            sendOffer.textContent = "Envoyer l'offre";
            sendOffer.style.cssText = "width:100%;margin:0;padding:11px;border-radius:8px;";
            const negotiationMessage = document.createElement("p");
            negotiationMessage.style.cssText = "font-size:13px;line-height:1.45;margin:10px 0 0;color:#d8e3ea;white-space:pre-line;";
            let negotiationRound = 0;
            let negotiationClosed = false;
            const marketValue = Math.max(0, Number(player.valeur ?? player.marketValue) || 0);
            const overallRating = Math.max(1, Math.min(99, Number(player.note ?? player.overall) || 70));
            const potentialRating = Math.max(overallRating, Math.min(99, Number(player.potentiel ?? player.potential) || overallRating));
            negotiateButton.addEventListener("click", () => {
                negotiationForm.style.display = negotiationForm.style.display === "none" ? "block" : "none";
            });
            sendOffer.addEventListener("click", () => {
                if (negotiationClosed) return;
                const offer = Math.floor(Number(offerInput.value));
                if (!Number.isFinite(offer) || offer <= 0) {
                    negotiationMessage.textContent = "Entre un montant supérieur à 0 €.";
                    return;
                }
                if (offer > Number(manager.budget || 0)) {
                    negotiationMessage.textContent = "Cette offre dépasse ton budget actuel.";
                    return;
                }
                if (player.club === manager.clubName) {
                    negotiationMessage.textContent = "Ce joueur appartient déjà à ton club.";
                    negotiationClosed = true;
                    return;
                }
                negotiationRound++;
                if (!Array.isArray(this.ui.transferMarketOffers)) this.ui.transferMarketOffers = [];
                const playerId = player.id ?? fullName;
                let trackedOffer = this.ui.transferMarketOffers.find(item => item.playerId === playerId && item.managerClub === manager.clubName);
                if (!trackedOffer) {
                    trackedOffer = { playerId, managerClub: manager.clubName, playerName: fullName, status: "En négociation", amount: offer };
                    this.ui.transferMarketOffers.push(trackedOffer);
                }
                trackedOffer.amount = offer;
                trackedOffer.status = "En négociation";
                let acceptanceRatio;
                if (overallRating < 70) acceptanceRatio = 0.78;
                else if (overallRating < 75) acceptanceRatio = 0.83;
                else if (overallRating < 80) acceptanceRatio = 0.90;
                else if (overallRating < 85) acceptanceRatio = 1;
                else if (overallRating < 90) acceptanceRatio = 1.08;
                else acceptanceRatio = 1.18;
                const potentialResistance = 1 + Math.min(0.20, Math.max(0, potentialRating - overallRating) * 0.01);
                const minimumAcceptable = Math.round(marketValue * acceptanceRatio * potentialResistance);
                if (offer >= minimumAcceptable || (marketValue === 0 && offer > 0)) {
                    const previousClub = player.club || "Sans club";
                    manager.budget = Number(manager.budget || 0) - offer;
                    if (game.club) game.club.budget = manager.budget;
                    player.club = manager.clubName;
                    if (!Array.isArray(game.players)) game.players = [];
                    if (!game.players.some(existing => existing === player || (existing.prenom === player.prenom && existing.nom === player.nom))) game.players.push(player);
                    if (game.tactics && typeof game.tactics.initializeSquad === "function") game.tactics.initializeSquad(game.players);
                    negotiationClosed = true;
                    trackedOffer.status = "Acceptée";
                    offerInput.disabled = true;
                    sendOffer.disabled = true;
                    negotiateButton.disabled = true;
                    negotiationMessage.textContent = "✅ Transfert conclu pour " + offer.toLocaleString("fr-FR") + " € ! " + fullName + " rejoint " + manager.clubName + ".";
                    return;
                }
                if (negotiationRound >= 3) {
                    negotiationClosed = true;
                    trackedOffer.status = "Refusée";
                    offerInput.disabled = true;
                    sendOffer.disabled = true;
                    negotiationMessage.textContent = "❌ " + (player.club || "Le club") + " refuse l'offre finale de " + offer.toLocaleString("fr-FR") + " €.";
                    return;
                }
                let counterRatio;
                if (overallRating < 70) counterRatio = 0.88;
                else if (overallRating < 75) counterRatio = 0.92;
                else if (overallRating < 80) counterRatio = 0.97;
                else if (overallRating < 85) counterRatio = 1.05;
                else if (overallRating < 90) counterRatio = 1.12;
                else counterRatio = 1.22;
                const counterOffer = Math.max(offer + 1, Math.ceil((marketValue * counterRatio) / 100000) * 100000);
                negotiationMessage.textContent = "🤝 " + (player.club || "Le club") + " refuse cette offre et propose " + counterOffer.toLocaleString("fr-FR") + " €. Il te reste " + (3 - negotiationRound) + " tentative(s).";
                offerInput.value = String(Math.min(counterOffer, Number(manager.budget || 0)));
                sendOffer.textContent = negotiationRound === 2 ? "Envoyer l'offre finale" : "Répondre à la contre-offre";
            });
            negotiationForm.append(offerLabel, offerInput, sendOffer, negotiationMessage);
            negotiationSection.append(negotiateButton, negotiationForm);
            overlay.appendChild(negotiationSection);
        }

        const tabs = document.createElement("div");
        tabs.style.cssText = "display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:18px 0 12px;";
        const content = document.createElement("div");
        content.style.cssText = "padding:14px 12px;background:#1b1b1d;border:1px solid #3b3b3f;border-radius:17px;min-height:230px;";
        const tabNames = ["Général", "Stats", "Contrat", "Historique"];
        const tabButtons = {};
        const makeRow = (label, val) => {
            const row = document.createElement("div");
            row.style.cssText = "display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:9px 0;font-size:14px;border-bottom:1px solid #303034;";
            const left = document.createElement("span"); left.textContent = label; left.style.color = "#ccc";
            const right = document.createElement("strong"); right.textContent = number(val); right.style.textAlign = "right"; right.style.maxWidth = "55%";
            row.append(left,right); return row;
        };
        const bar = (label, val, color) => {
            const wrap = document.createElement("div");
            wrap.style.cssText = "display:grid;grid-template-columns:92px minmax(0,1fr) 28px;gap:8px;align-items:center;margin:14px 0;font-size:14px;";
            const caption = document.createElement("span"); caption.textContent=label;
            const track = document.createElement("div"); track.style.cssText="height:13px;background:#343439;border-radius:20px;overflow:hidden;";
            const fill = document.createElement("div"); fill.style.cssText="height:100%;width:"+val+"%;background:"+color+";border-radius:20px;";
            track.appendChild(fill);
            const score = document.createElement("strong"); score.textContent=String(val); score.style.textAlign="right";
            wrap.append(caption,track,score); return wrap;
        };
        const renderTab = tab => {
            content.innerHTML = "";
            Object.entries(tabButtons).forEach(([key, button]) => {
                button.style.background = key === tab ? "#287cff" : "#28282c";
                button.style.color = key === tab ? "#fff" : "#ccc";
            });
            if (tab === "Général") {
                [["Poste préféré", player.poste || player.position],["Postes secondaires", player.postesSecondaires || player.secondaryPositions],["Pied fort", player.pied || player.foot],["Taille", player.taille == null ? null : player.taille+" cm"],["Poids", player.poids == null ? null : player.poids+" kg"],["Style de jeu", player.styleJeu || player.playStyle]].forEach(([l,v])=>content.appendChild(makeRow(l,v)));
                const divider=document.createElement("div");divider.style.cssText="height:1px;background:#414146;margin:12px 0;";content.appendChild(divider);
                if (injured) {
                    const injury=document.createElement("div");injury.textContent="🤕 Joueur blessé"+(Number(player.joursBlessure ?? player.injuryDays)>0 ? " · "+Number(player.joursBlessure ?? player.injuryDays)+" jour(s) restant(s)" : "");injury.style.cssText="padding:12px;color:#ff8585;font-weight:bold;";content.appendChild(injury);
                } else {
                    content.append(bar("Forme",form,"#16c75b"));
                    content.append(bar("Énergie",energy,tacticsUI?.getEnergyColor ? tacticsUI.getEnergyColor(energy) : (energy >= 70 ? "#35C759" : energy >= 40 ? "#F5C542" : energy >= 20 ? "#FF8C42" : "#FF453A")));
                }
            } else if (tab === "Stats") {
                [["⚽ Buts",player.buts ?? player.goals],["🎯 Passes décisives",player.passes ?? player.assists],["🕒 Matchs joués",player.matchs ?? player.matchesPlayed],["⏱️ Minutes jouées",player.minutes ?? player.minutesPlayed],["🟨 Cartons jaunes",player.cartonsJaunes],["🟥 Cartons rouges",player.cartonsRouges]].forEach(([l,v])=>content.appendChild(makeRow(l,v)));
            } else if (tab === "Contrat") {
                [["💶 Valeur marchande",value == null ? null : money(value)],["💰 Salaire",player.salaire == null ? null : money(player.salaire)+" / semaine"],["📄 Fin de contrat",player.contratFin || player.contractEnd],["🏟️ Club",player.club || (manager && manager.clubName)]].forEach(([l,v])=>content.appendChild(makeRow(l,v)));
            } else {
                [["Saison",player.saison || player.season],["Progression",player.progression],["Potentiel",potential],["Âge",player.age == null ? null : player.age+" ans"]].forEach(([l,v])=>content.appendChild(makeRow(l,v)));
                const note=document.createElement("p");note.textContent="L’historique détaillé sera disponible lorsque les données de saison seront enregistrées.";note.style.cssText="font-size:12px;color:#999;margin-top:16px;";content.appendChild(note);
            }
        };
        tabNames.forEach(tab => {
            const button=document.createElement("button");button.type="button";button.textContent=tab;
            button.style.cssText="margin:0;padding:10px 2px;border:1px solid #3b3b40;border-radius:10px;font-size:clamp(10px,2.8vw,14px);background:#28282c;color:#ccc;";
            button.addEventListener("click",()=>renderTab(tab));tabButtons[tab]=button;tabs.appendChild(button);
        });
        overlay.append(tabs,content);
        const closeButton=document.createElement("button");closeButton.type="button";closeButton.textContent="Fermer";
        closeButton.style.cssText="display:block;width:100%;margin:14px 0 0;padding:14px;background:#287cff;color:white;border:0;border-radius:12px;font-weight:bold;";
        closeButton.addEventListener("click",close);overlay.appendChild(closeButton);
        this.container.appendChild(overlay);
        renderTab("Général");
    }
}
