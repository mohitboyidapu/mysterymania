// global variables
const gridItems = document.querySelectorAll(".card");
const backDrop = document.getElementById("blurWindow");
const gameOverModal = document.getElementById("gameOverWindow");
const gameFinishText = document.getElementById("gameFinishText");
const playerScore = document.getElementById("player-score");
const currScore = document.getElementById("score");
const highScore = document.getElementById("highscore");
const restartBtn = document.getElementById("restart-btn");

const gameOverSFX = document.getElementById("game-over-sfx");
const goalSFX = document.getElementById("goal-sfx");
const missSFX = document.getElementById("miss-sfx");
const successSFX = document.getElementById("success-sfx");

// Adjusting Volume of Audio files
missSFX.volume = 0.6;
goalSFX.volume = 0.6;
gameOverSFX.volume = 0.6;
successSFX.volume = 0.6;

const congratsImg = document.getElementById("congrats-img");
const lostImg = document.getElementById("lost-img");


const gameMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

let score = 250, high_score = 0, cnt = 0;
function initialiseGame(){
   // Disappear backdrop and modal
   backDrop.style.display = "none";
   gameOverModal.style.display = "none";
   congratsImg.style.display = "none";
   lostImg.style.display = "none";

   // Define Variables for scores
   score = 100;
   currScore.innerHTML = "100";
   cnt = 0;
   
   // Make a set to store random places for goals and mines 
   const places = new Set();
   
   // Assign goals to 3 unique places in grid
   while(places.size < 4){
      let randPlace = Math.floor(Math.random()*9);
      places.add(randPlace);
   }

   // Take elements out of Set and add them to Array
   const randomPlaces = [];
   for (const item of places) {
      randomPlaces.push(item);
   }
   console.log(gameMatrix);
   for(let i=0; i<3; i++){
      for(let j=0; j<3; j++){
         gameMatrix[i][j] = 0;
      }
   }
   // assign mine to a random box in grid
   const mineBox = randomPlaces[0];
   const mineRow = Math.floor(mineBox / 3);
   const mineCol = mineBox % 3;
   gameMatrix[mineRow][mineCol] = -1;
   
   for(let i=1; i<=3; i++){
      const box = randomPlaces[i];
      const row = Math.floor(box / 3);
      const col = box % 3;
      gameMatrix[row][col] = 1;
   }
   for(let i=0; i<9; i++){
      let frontBox = "", backBox ="", missBox = "";
      frontBox = frontBox + i + "front";
      backBox = backBox + i + "back";
      missBox = missBox + i + "miss";

      let tempcardFront = document.getElementById(frontBox);
      let tempcardBack = document.getElementById(backBox);
      let tempcardMiss = document.getElementById(missBox);
      tempcardFront.classList.add('hide');
      tempcardBack.classList.add('hide');
      tempcardMiss.classList.add('hide');
   }
   gridItems.forEach(item => {
      item.classList.remove("flip-card");
   });
}

// Start Game Initially
initialiseGame();

// Game Logic
gridItems.forEach(item => {
   item.addEventListener("click", function(event){
      // let cnt = 0;
      event.target.classList.add("flip-card");
      const pressedBlock = Number(event.target.getAttribute('data-value'));
      const row = Math.floor(pressedBlock / 3);
      const col = pressedBlock % 3;
      
      if(gameMatrix[row][col] == -1){
         lostImg.style.display = "flex";
         gameOverSFX.play();
         console.log("GameOber");
         gameFinishText.innerHTML = "Game Over";
         score = 0;
         let backBox = "";
         backBox = backBox + pressedBlock + "back";
         let backcard = document.getElementById(backBox);
         backcard.classList.remove('hide');
         
         playerScore.innerHTML = score;
         setTimeout(function(){
            // backDrop.classList.remove('hide');
            // gameOverModal.classList.remove('hide');
            backDrop.style.display = "flex";
            gameOverModal.style.display = "flex";
         }, 500);
      }
      else if(gameMatrix[row][col] == 1){
         goalSFX.play();
         cnt += 1;

         gameMatrix[row][col] = 9;

         let frontBox = "";
         frontBox = frontBox + pressedBlock + "front";
         console.log(frontBox);
         let tempcard = document.getElementById(frontBox);
         tempcard.classList.remove('hide');


         if(cnt == 3){
            setTimeout(function(){
               playerScore.innerHTML = score;
               successSFX.play();
               congratsImg.style.display = "flex";
               highScore.innerHTML = Math.max(score, high_score);
               gameFinishText.innerHTML = "Congratulations";
               backDrop.style.display = "flex";
               gameOverModal.style.display = "flex";
            }, 300);
         }
      }
      else if(gameMatrix[row][col] == 0) {
         missSFX.play();
         score -= 10;
         let missBox = "";
         missBox = missBox + pressedBlock + "miss";
         let missCard = document.getElementById(missBox);
         missCard.classList.remove('hide');
      }
      currScore.innerHTML = score;
   });
});

restartBtn.addEventListener('click', function(){
   gameOverModal.classList.add('hide');
   backDrop.classList.add('hide');
   initialiseGame();
});





