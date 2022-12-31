import { createStore } from "https://cdn.skypack.dev/redux@4.0.5";

// on trouve les éléments dans le document HTML
const score = document.getElementById("score");
const player1Button = document.getElementById("player-1");
const player2Button = document.getElementById("player-2");
const resetButton = document.getElementById("reset");
const pauseButton = document.getElementById("pause");

player1Button.addEventListener("click", () => {
  // Ce code s'exécute lorsque le bouton "Point Joueur 1" est cliqué
  store.dispatch(playerScores("player1"));
  console.log(store.getState());
});

player2Button.addEventListener("click", () => {
  // Ce code s'exécute lorsque le bouton "Point Joueur 2" est cliqué
  store.dispatch(playerScores("player2"));
  console.log(store.getState());
});

resetButton.addEventListener("click", () => {
  // Ce code s'exécute lorsque le bouton "Remettre à zéro" est cliqué
  store.dispatch(reset);
});

pauseButton.addEventListener("click", function () {
  // Ce code s'exécute lorsque le bouton "Pause / Reprendre" est cliqué
  store.dispatch(playPause());
  console.log(store.getState());
});

/**
 * Met à jour le text qui affiche le score
 * @param {boolean} playing
 * @param {'player1' | 'player2'} winner
 * @param {number} player1Score
 * @param {number} player2Score
 * @param {'player1' | 'player2'} advantage
 */
function updateScoreText(
  playing,
  winner = null,
  player1Score = 0,
  player2Score = 0,
  advantage = null
) {
  if (winner) {
    if (winner === "player1") {
      score.innerHTML = "Joueur 1 gagne";
    } else {
      score.innerHTML = "Joueur 2 gagne";
    }
  } else if (playing === false) {
    score.innerHTML = "C'est la pause";
  } else {
    let text = "Le score est: " + player1Score + " - " + player2Score;
    if (advantage) {
      if (advantage === "player1") {
        text += " avantage joueur 1";
      } else {
        text += " avantage joueur 2";
      }
    }
    score.innerHTML = text;
  }
}

//REDUX

const initialState = {
  player1: 0,
  player2: 0,
  advantage: null,
  winner: null,
  playing: true,
};

const playPause = () => ({
  type: "playPause",
});

const playerScores = (player) => ({
  type: "playerScores",
  payload: { player: player },
});

const reset = { type: "reset" };

function reducer(state, action) {
  if (action.type === "playPause") {
    return {
      ...state,
      playing: !state.playing,
    };
  }
  if (action.type === "playerScores") {
    const currentPlayer = action.payload.player;
    const otherPlayer = currentPlayer === "player1" ? "player2" : "player1";
    const currentPlayerScore = state[currentPlayer];
    const otherPlayerScore = state[otherPlayer];
    const winner = state.winner;
    const playing = state.playing;
    const advantage = state.advantage;

    if (winner || !playing) {
      return state;
    }
    if (currentPlayerScore < 30) {
      console.log(otherPlayer);
      return {
        ...state,
        [currentPlayer]: currentPlayerScore + 15,
      };
    }
    if (currentPlayerScore === 30) {
      return {
        ...state,
        [currentPlayer]: 40,
      };
    }
    if (currentPlayerScore === 40 && otherPlayerScore !== 40) {
      return {
        ...state,
        winner: currentPlayer,
      };
    } else {
      if (advantage === null) {
        return {
          ...state,
          advantage: currentPlayer,
        };
      } else {
        if (advantage === currentPlayer) {
          return {
            ...state,
            winner: currentPlayer,
          };
        } else {
          return {
            ...state,
            advantage: null,
          };
        }
      }
    }
  }

  if (action.type === "reset") {
    return initialState;
  }
  return state;
}

//on crée le store avec le state et le reducer
const store = createStore(reducer, initialState);

store.subscribe(() => {
  const state = store.getState();
  updateScoreText(
    state.playing,
    state.winner,
    state.player1,
    state.player2,
    state.advantage
  );
});
