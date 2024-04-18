# POKÉMON COMBAT

## Assignment - Pokemon Application G/VG

### Your task is to create an interface where you can get information about different Pokemon.

### API Endpoint: https://pokeapi.co/

#### Part 1 - Pokedex

Create a dropdown list with all your Pokemon. The user should be able to select a Pokemon to retrieve its data.
Create a class for each Pokemon that has the following values:
Name.
Picture of a Pokemon.
What type(s) your pokemon has (i.e. "types" in the API)
Weight
Length
All 6 of its stats - HP (Hit points), Attack, Special Attack, Defense, Special Defense, Speed.
Method for comparing two Pokemon with each other.
Display the selected Pokemon with all its associated values.

#### Part 2 - Compare Pokemon

Allow the user to select an additional Pokemon. Print all its values.
Users should be able to compare two Pokemon with each other.
Color-code which Pokemon has the highest value when comparing - compare weight, length and all its stats. Print in the DOM which Pokemon wins in the most categories.

#### Part 3 - Pokemon Battle (VG)

Allow the two selected Pokemon to fight each other and see who wins.

How it works:
Both Pokemon take turns attacking each other until one of their HP (Hit points) reaches 0.
The Pokemon with the highest speed starts.
The name of a Pokemon's attack is the first in its "moves" list.
Damage calculation formula:
Attacking Pokemon (red) - Defending Pokemon (blue)
(Attack+Special Attack) - (Defense+Special defense) \* 0.8 = Damage
Subtract the defending Pokemon's HP by the damage done.
Each attack must do at least 10 damage. For example, if the calculated damage is 4, change it to 10.

Print in the DOM how the fight is going.
E.g. "Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 10.
Bulbasaur used Razor Wind and did 10 damage. Mewtwo remaining HP: 180.
Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 0. Mewtwo wins!
