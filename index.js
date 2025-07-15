// === State ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-ChristianO"; // Make sure to change this!
const API = BASE + COHORT;
let players = [];
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

const playerDetails = () => {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Select a player to see details";
    return $p;
  }
  const $section = document.createElement("section");
  $section.innerHTML = `
        <h2>Name: ${selectedPlayer.name}</h2>
        <p>ID: ${selectedPlayer.id}</p>
        <p>Breed: ${selectedPlayer.breed}</p>
        <p>Team: ${selectedPlayer.teamId}</p>
        <p>Status: ${selectedPlayer.status}</p>
        <img src = "${selectedPlayer.imageUrl}" alt = "${selectedPlayer.name}"/>
        `;
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
  } catch (error) {
    console.error("Failed to add player", error);
  }
};

const inviteForm = () => {
  const $form = document.createElement("form");
  $form.innerHTML = `
        <h2>Invite a Player</h2>
        <form id="form">
            <label>Name</label>
            <input name="name" required placeholder = "Enter player name"/>
            <label>Breed</label>
            <input name="breed" required placeholder = "Enter player breed"/>
            <label>Status</label>
            <input name="status" required placeholder = "Enter player status"/>
            <label>Profile Picture</label>
            <input name="imageUrl" required placeholder = "Enter image url"/>
            <button>Invite artist</button>
        </form>
        `;
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
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
            <section>
                <inviteForm></inviteForm>
            </section>
        </main>
    `;
  $app.querySelector("playerList").replaceWith(playerList());
  $app.querySelector("playerDetails").replaceWith(playerDetails());
  $app.querySelector("inviteForm").replaceWith(inviteForm());
};

render();

const init = async () => {
  await getPlayers();
  render();
};

init();
