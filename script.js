let manager = {
    club: "",
    saison: 1,
    budget: 5000000,
    reputation: 50
};
function startGame(clubChoisi) {
    manager.club = clubChoisi;
    document.getElementById("result").innerHTML = `
        <h2>Bienvenue coach !</h2>
        <p>Club : ${manager.club}</p>
        <p>Saison : ${manager.saison}</p>
        <p>Budget : ${manager.budget.toLocaleString()} €</p>
        <p>Réputation : ${manager.reputation}/100</p>
        <button onclick="playMatch()">Jouer un match</button>
    `;
}
function playMatch(){
    let victoire = Math.random() > 0.5;
    if(victoire){
        manager.reputation += 3;
        document.getElementById("result").innerHTML += 
        "<p>✅ Victoire ! La réputation augmente.</p>";
    }
    else{
        manager.reputation -= 2;
        document.getElementById("result").innerHTML += 
        "<p>❌ Défaite... Les supporters sont déçus.</p>";
    }
}
