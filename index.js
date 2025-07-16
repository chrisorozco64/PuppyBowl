// === State ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-CHRISTIAN"; // Make sure to change this!
const API = BASE + COHORT;
let players = [];
let teams = [];
let selectedPlayer;

// === Components ===
const getPlayers = async () => {
  try {
    const response = await fetch(API + "/players");
    const data = await response.json();
    players = data.data.players;
    console.log(players);
    render();
  } catch (error) {
    console.error("Failed to get players", error);
  }
};

const getTeams = async () => {
  try {
    const response = await fetch(API + "/teams")
    const data = await response.json();
    console.log(data.data.teams);
    teams = data.data.teams;
  } catch (error) {
    console.error("Failed to get teams", error)
  }
}

const removePlayer = async (id) => {
  try {
    const response = await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    if (response.ok) {
      players = players.filter((player) => player.id !== id);
      if (selectedPlayer && selectedPlayer.id === id) {
        selectedPlayer = null;
      }
      render();
    } else {
      console.error("Failed to remove player:", response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
};

const playerDetails = () => {
  if (!selectedPlayer) {
    const $h2 = document.createElement("h2");
    $h2.textContent = "Select a player to see details";
    return $h2;
  }
  const team = teams.find(t => t.id === selectedPlayer.teamId);
  const $section = document.createElement("section");
  $section.classList.add("player-details");
  $section.innerHTML = `
                 <img src = "${selectedPlayer.imageUrl}" alt = "${selectedPlayer.name}"/>

        <p id = "player-name"><b>Name:</b> ${selectedPlayer.name}</p>
        <p><b>ID:</b> ${selectedPlayer.id}</p>
        <p><b>Breed:</b> ${selectedPlayer.breed}</p>
        <p><b>Team:</b> ${team ? team.name : "No team"}</p>
        <p><b>Status:</b> ${selectedPlayer.status}</p>
        <button>Remove From Roster</button>
        `;
  $section.querySelector("button").addEventListener("click", (event) => {
    event.preventDefault();
    removePlayer(selectedPlayer.id);
  });
  return $section;
};

const playerListItem = (player) => {
  const $li = document.createElement("li");
  $li.innerHTML = `
        <a>${player.name}</a>
        `;
  $li.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();
    selectedPlayer = player;
    render();
  });
  return $li;
};

const playerList = () => {
  const $ul = document.createElement("ul");
  for (const player of players) {
    $ul.append(playerListItem(player));
  }
  return $ul;
};

const addPlayer = async (event) => {
  event.preventDefault();
  console.log(event);
  const playerData = {
    name: event.target[0].value,
    breed: event.target[1].value,
    status: event.target[2].value,
    imageUrl: event.target[3].value,
  };
  console.log(playerData);
  try {
    const response = await fetch(API + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerData),
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    await getPlayers();
  } catch (error) {
    console.error("Failed to add player", error);
  }
};

const inviteForm = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
        <h2>Add a Puppy</h2>
            <label>Name</label>
            <input name="name" required placeholder = "Enter player name"/>
            <label>Breed</label>
            <input name="breed" required placeholder = "Enter player breed"/>
            <label>Status</label>
            <input name="status" required placeholder = "Enter player status"/>
            <label>Profile Picture</label>
            <input name="imageUrl" required placeholder = "Enter image url"/>
            <button>Submit</button>
        `;
  $form.addEventListener("submit", (event) => {
    addPlayer(event);
  });
  $form.style.width = "75%";
  $form.style.margin = "0 auto";
  return $form;
};

// === Render ===
const render = () => {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl!</h1>
        <main>
            <section>
                <h2>Meet the Players</h2>
                <playerList></playerList>
            </section>
            <section>
                <playerDetails></playerDetails>
            </section>
        </main>
        <hr>
        <inviteForm></inviteForm>

    `;
  $app.querySelector("playerList").replaceWith(playerList());
  $app.querySelector("playerDetails").replaceWith(playerDetails());
  $app.querySelector("inviteForm").replaceWith(inviteForm());
};

render();

const init = async () => {
  await getPlayers();
  await getTeams();
  render();
};

init();
