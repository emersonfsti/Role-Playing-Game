let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick", "dagger", "sword"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: "bastão", power: 5 },
  { name: "punhal", power: 30 },
  { name: "martelo", power: 50 },
  { name: "espada", power: 100 },
];

const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 },
];

const locations = [
  {
    name: "town square",
    "button text": [
      "Vá para a loja",
      "Vá para a caverna",
      "Lute contra o dragão",
    ],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Você está na praça da cidade. Você vê uma placa que diz "Loja".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na loja.",
  },
  {
    name: "cave",
    "button text": [
      "Lute contra o Slime",
      "Lute contra a Fera",
      "Vá para a Praça",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Voce entrou na carvena. Voce viu um monstro.",
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Voce esta lutando com um monstro.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, goTown],
    text: "The monster screams Arg! as it dies. You gain experience points and find gold.",
  },
  {
    name: "lose",
    "button text": ["Reiniciar?", "Reiniciar?", "Reiniciar?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️",
  },
  {
    name: "win",
    "button text": ["Reiniciar?", "Reiniciar?", "Reiniciar?"],
    "button functions": [restart, restart, restart],
    text: "Voce derretou o Dragao! VOCE VENCEU O JOGO! 🎉",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  text.innerText = location.text;
}
function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;

    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente para comprar saúde.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Você agora tem uma " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Em seu inventário você tem: " + inventory;
    } else {
      text.innerText = "Você não tem ouro suficiente para comprar uma arma.";
    }
  } else {
    text.innerText = "Você já tem a arma mais poderosa!";
    button2.innerText = "Venda arma por 15 ouro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    let currentWeapon = inventory.shift();
    gold += 15;
    goldText.innerText = gold;

    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";

  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsters[fighting].health;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= monsters[fighting].level;
  monsterHealth -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];

  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;

  goTown();
}
