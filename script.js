// Variables
let pokemonDropdown1 = document.querySelector("#pokemon-dropdown1");
let pokemonDropdown2 = document.querySelector("#pokemon-dropdown2");
let dropdownSelect = document.querySelectorAll("select");
const poke1 = document.querySelector(".pokemon1-results");
const poke2 = document.querySelector(".pokemon2-results");
const compareBtn = document.querySelector(".compare-btn");
const combatBtn = document.querySelector(".combat-btn");
const tryAgainBtn = document.querySelector(".try-again-btn");

// Pokemon class
class Pokemon {
  constructor(imageUrl, name, type, weight, height, stats, hp, moves) {
    this.imageUrl = imageUrl;
    this.name = name;
    this.type = type;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.hp = hp;
    this.moves = moves;
  }
}

// Render pokemon
const renderPokemon = (pokemon, container) => {
  container.dataset.pokemon = JSON.stringify(pokemon); // Set the data-pokemon attribute
  container.innerHTML = `
    <div class="pokeImg">
        <img src="${pokemon.imageUrl}" alt="${pokemon.name}" />
    </div>
    <div class="pokeDetails">
      <div class="pokeInfo">
        <h2>${pokemon.name}</h2>
        <p>type: ${pokemon.type.join(", ")}</p>
        <p>weight: ${pokemon.weight} kg</p>
        <p>height: ${pokemon.height} m</p>
      </div>
      <div class="pokeStats">
        <h2>stats:</h2>
        <ul class="nes-list">
          <li>HP: ${pokemon.stats.hp}</li>
          <li>attack: ${pokemon.stats.attack}</li>
          <li>special attack: ${pokemon.stats["special-attack"]}</li>
          <li>defense: ${pokemon.stats.defense}</li>
          <li>special defense: ${pokemon.stats["special-defense"]}</li>
          <li>speed: ${pokemon.stats.speed}</li>
        </ul>
      </div>
    </div>
    `;
};

// Fetch pokemon data
let getPokeData = async (pokemonName) => {
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon data");
    }
    let data = await response.json();
    console.log(data);
    let stats = {};
    data.stats.forEach((stat) => {
      stats[stat.stat.name] = stat.base_stat;
    });
    let moves = data.moves.map((move) => move.move.name);
    return new Pokemon(
      data.sprites.front_default,
      data.name,
      data.types.map((type) => type.type.name),
      data.weight,
      data.height,
      stats,
      data.stats[0].base_stat,
      moves
    );
  } catch (error) {
    console.log(error);
  }
};

// Handle dropdown change
dropdownSelect.forEach((dropdown) => {
  dropdown.addEventListener("change", async () => {
    const winnerContainer = document.querySelector(".winner");
    winnerContainer.innerHTML = "";
    let selectedPokemon = dropdown.value;
    if (!selectedPokemon) return;
    let pokemonData = await getPokeData(selectedPokemon);

    renderPokemon(pokemonData, dropdown.parentElement.nextElementSibling);
  });
});

// Add pokemons to dropdown
let pokeToDropdown = async (dropdown) => {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=151";
  let response = await fetch(url);
  let { results } = await response.json();
  results.forEach((pokemon, index) => {
    let option = document.createElement("option");
    option.value = pokemon.name;
    option.text = pokemon.name;
    dropdown.appendChild(option);
  });
  //   console.log(pokemonDropdown1);
};

// Initialize dropdowns
pokeToDropdown(pokemonDropdown1);
pokeToDropdown(pokemonDropdown2);

// Function for comparing and colouring
const compareValues = (value1, value2, element1, element2) => {
  if (value1 > value2) {
    element1.style.color = "green";
    element2.style.color = "red";
  } else if (value1 < value2) {
    element1.style.color = "red";
    element2.style.color = "green";
  } else {
    element1.style.color = "orange";
    element2.style.color = "orange";
  }
};

const displayWinner = (winner, container, message) => {
  container.innerHTML = "";

  let winnerMsg;
  if (message === "regular") {
    winnerMsg = `the winner is ${winner.name}`;
  } else if (message === "combat") {
    winnerMsg = `${winner.name} is the champion!`;
  }

  const winnerInfo = document.createElement("div");
  winnerInfo.classList.add("winner-info");
  container.appendChild(winnerInfo);

  // Function for appending gradually
  const appendWinnerText = (text, index) => {
    if (index < text.length) {
      setTimeout(() => {
        winnerInfo.innerHTML += text[index];
        appendWinnerText(text, index + 1);
      }, 70);
    }
  };

  appendWinnerText(winnerMsg, 0);

  // Img after text
  setTimeout(() => {
    const winnerImg = document.createElement("img");
    winnerImg.src = winner.imageUrl;
    winnerImg.alt = winner.name;
    container.appendChild(winnerImg);
  }, 70 * winnerMsg.length);
};

// Function for comparing
let compareStats = (pokemon1, pokemon2) => {
  const statValues1 = Object.values(pokemon1.stats);
  const statValues2 = Object.values(pokemon2.stats);

  let winner = null;

  statValues1.forEach((statValue1, index) => {
    const statValue2 = statValues2[index];

    let statElement1 = document.querySelector(
      `.pokemon1-results .pokeStats ul li:nth-child(${index + 1})`
    );
    let statElement2 = document.querySelector(
      `.pokemon2-results .pokeStats ul li:nth-child(${index + 1})`
    );

    compareValues(statValue1, statValue2, statElement1, statElement2);
  });

  // Compare height and weight
  let height1 = document.querySelector(
    ".pokemon1-results .pokeInfo p:nth-child(4)"
  );
  let height2 = document.querySelector(
    ".pokemon2-results .pokeInfo p:nth-child(4)"
  );
  compareValues(pokemon1.height, pokemon2.height, height1, height2);

  let weight1 = document.querySelector(
    ".pokemon1-results .pokeInfo p:nth-child(3)"
  );
  let weight2 = document.querySelector(
    ".pokemon2-results .pokeInfo p:nth-child(3)"
  );
  compareValues(pokemon1.weight, pokemon2.weight, weight1, weight2);

  console.log(
    "Pokemon 1 stats:",
    pokemon1.height,
    pokemon1.weight,
    statValues1
  );
  console.log(
    "Pokemon 2 stats:",
    pokemon2.height,
    pokemon2.weight,
    statValues2
  );

  const pokemon1Total = statValues1.reduce((acc, val) => acc + val, 0);
  const pokemon2Total = statValues2.reduce((acc, val) => acc + val, 0);

  if (pokemon1Total > pokemon2Total) {
    winner = pokemon1;
  } else if (pokemon1Total < pokemon2Total) {
    winner = pokemon2;
  }

  const winnerContainer = document.querySelector(".winner");
  winnerContainer.innerHTML = "";

  if (winner) {
    displayWinner(winner, winnerContainer, "regular");
  } else {
    winnerContainer.textContent = "it's a tie...";
  }
};

// Handle compare btn
compareBtn.addEventListener("click", async () => {
  // Get pokemon data
  let pokemon1Data = document.querySelector("#pokemon1-info").dataset.pokemon;
  let pokemon2Data = document.querySelector("#pokemon2-info").dataset.pokemon;

  if (!pokemon1Data || !pokemon2Data) {
    alert("you have to choose two pokémon to compare!");
    return;
  }

  // Parse pokemon data from dataset
  let pokemon1 = JSON.parse(pokemon1Data);
  let pokemon2 = JSON.parse(pokemon2Data);

  if (pokemon1.name === pokemon2.name) {
    alert("you can't compare a pokemon with itself...");
    return;
  }

  // Compare and update
  compareStats(pokemon1, pokemon2);
});

function renderPokemonCombat(pokemon, container, maxHP) {
  container.innerHTML = `
  <div class="combat-pokemon">
    <img src="${pokemon.imageUrl}" alt="${pokemon.name}" />
    <p class="pokemon-name">${pokemon.name}</p>
    <div class="hp-bar-container">
    <p class="hp">HP: ${Math.max(Math.round(pokemon.hp), 0)} / ${maxHP}</p>
    <progress class="hp-bar nes-progress is-success" value="${Math.max(
      Math.round(pokemon.hp),
      0
    )}" max="${maxHP}"></progress>
    </div>
  </div>
  `;
}

// Function for updating hp bar
function updateHPBar(pokemon, container) {
  const hpText = container.querySelector(".hp");
  const hpBar = container.querySelector(".hp-bar");
  const currentHP = Math.max(Math.ceil(pokemon.hp), 0);

  // Rounding up to closest integer
  hpText.textContent = `HP: ${currentHP} / ${pokemon.stats.hp}`;
  hpBar.value = currentHP;

  // If bar lower than 15 set red color
  if (currentHP <= 15) {
    hpBar.classList.add("is-error");
  } else {
    hpBar.classList.remove("is-error");
  }
}

// Loading type text written out
const appendPokemons = (text, index) => {
  const combatResults = document.querySelector(".combat-results");
  if (index < text.length) {
    setTimeout(() => {
      combatResults.innerHTML += text[index];

      // Check if character is period . and then add line break
      if (text[index] === ".") {
        combatResults.innerHTML += "<br>";
      }
      appendPokemons(text, index + 1);
    }, 70);
  }
  combatResults.scrollIntoView({ behavior: "smooth" });
};

// Getting attack text
const attackText = (
  attackerName,
  move,
  damage,
  defenderName,
  defenderRemainingHP
) => {
  // Round to closest integer. And for remaining hp, never a negative number
  damage = Math.round(damage);
  defenderRemainingHP = Math.max(Math.ceil(defenderRemainingHP), 0);

  console.log(defenderName, defenderRemainingHP);

  const attackMsg = document.createElement("p");
  attackMsg.innerHTML = `${attackerName} used ${move} and did ${damage} damage. ${defenderName} remaining HP: ${defenderRemainingHP}.`;
  attackMsg.classList.add = "attack-text";

  // Display gradually
  appendPokemons(attackMsg.innerHTML, 0);
};

combatBtn.addEventListener("click", () => {
  console.log("Combat started!!!!!");

  const winnerContainer = document.querySelector(".combat-winner");
  winnerContainer.innerHTML = "";

  // Just for error handling an alert
  const pokeInfo1 = document.querySelector("#pokemon1-info").dataset.pokemon;
  const pokeInfo2 = document.querySelector("#pokemon2-info").dataset.pokemon;

  if (!pokeInfo1 || !pokeInfo2) {
    alert("you have to choose two pokémon to combat!");
    return;
  }

  // Get pokemon data
  const pokemon1Data = JSON.parse(
    document.querySelector("#pokemon1-info").dataset.pokemon
  );
  const pokemon2Data = JSON.parse(
    document.querySelector("#pokemon2-info").dataset.pokemon
  );

  const pokemon1 = new Pokemon(
    pokemon1Data.imageUrl,
    pokemon1Data.name,
    pokemon1Data.type,
    pokemon1Data.weight,
    pokemon1Data.height,
    pokemon1Data.stats,
    pokemon1Data.hp,
    pokemon1Data.moves
  );
  const pokemon2 = new Pokemon(
    pokemon2Data.imageUrl,
    pokemon2Data.name,
    pokemon2Data.type,
    pokemon2Data.weight,
    pokemon2Data.height,
    pokemon2Data.stats,
    pokemon2Data.hp,
    pokemon2Data.moves
  );

  if (pokemon1.name === pokemon2.name) {
    alert("a pokémon can't combat itself...");
    return;
  }

  const combatResults = document.querySelector(".combat-results");
  combatResults.innerHTML = "";

  const combatContainer = document.querySelector(".combat-container");

  const maxHP1 = pokemon1.stats.hp;
  const maxHP2 = pokemon2.stats.hp;

  renderPokemonCombat(
    pokemon1,
    combatContainer.querySelector(".pokemon1-combat"),
    maxHP1
  );
  renderPokemonCombat(
    pokemon2,
    combatContainer.querySelector(".pokemon2-combat"),
    maxHP2
  );

  // Set max attribute for progress bar
  combatContainer
    .querySelector(".pokemon1-combat .hp-bar")
    .setAttribute("max", maxHP1);
  combatContainer
    .querySelector(".pokemon2-combat .hp-bar")
    .setAttribute("max", maxHP2);

  // Calculate who starts combat
  let attacker, defender;
  if (pokemon1.stats.speed >= pokemon2.stats.speed) {
    attacker = pokemon1;
    defender = pokemon2;
  } else {
    attacker = pokemon2;
    defender = pokemon1;
  }

  const attackDelay = 3500; // Delay 3.5 sec
  let combatIndex = 0;

  // Combat function
  const timeToCombat = () => {
    console.log(`Combat iteration: ${combatIndex}`);

    if (attacker.hp > 0 && defender.hp > 0) {
      const damage = Math.max(
        10,
        Math.floor(
          attacker.stats.attack +
            attacker.stats["special-attack"] -
            (defender.stats.defense + defender.stats["special-defense"])
        ) * 0.8
      );

      defender.hp -= damage;

      attackText(
        attacker.name,
        attacker.moves[0],
        damage,
        defender.name,
        defender.hp
      );

      // Update after attack
      setTimeout(() => {
        // Update HP bars, based on attacker/defender
        const defenderContainer =
          attacker === pokemon1 ? ".pokemon2-combat" : ".pokemon1-combat";
        updateHPBar(defender, document.querySelector(defenderContainer));

        // Swap attacker/defender
        [attacker, defender] = [defender, attacker];

        // Increment and delayed text
        combatIndex++;
        setTimeout(timeToCombat, attackDelay);
      }, attackDelay);
    } else {
      // Decide winner
      const winner = pokemon1.hp > 0 ? pokemon1 : pokemon2;
      const loser = winner === pokemon1 ? pokemon2 : pokemon1;

      displayWinner(winner, winnerContainer, "combat");

      // Add try again btn
      setTimeout(() => {
        tryAgainBtn.style.display = "block";
      }, 3000);

      console.log(`${winner.name} wins the combat!`);
    }
  };

  timeToCombat();
});

tryAgainBtn.addEventListener("click", () => {
  // Clear dropdown
  pokemonDropdown1.selectedIndex = 0;
  pokemonDropdown2.selectedIndex = 0;

  // Clear rendered pokemon
  poke1.innerHTML = "";
  poke2.innerHTML = "";

  const compareWinner = document.querySelector(".winner");
  compareWinner.innerHTML = "";

  // Clear combat
  const combatResults = document.querySelector(".combat-results");
  combatResults.innerHTML = "";

  const combatWinner = document.querySelector(".combat-winner");
  combatWinner.innerHTML = "";

  const pokemon1Combat = document.querySelector(".pokemon1-combat");
  const pokemon2Combat = document.querySelector(".pokemon2-combat");
  pokemon1Combat.innerHTML = "";
  pokemon2Combat.innerHTML = "";

  tryAgainBtn.style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
});
