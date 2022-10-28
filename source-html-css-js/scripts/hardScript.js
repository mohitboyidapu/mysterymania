const gridItems = document.querySelectorAll(".card");
const backDrop = document.getElementById("blurWindow");
const gameOverModal = document.getElementById("gameOverWindow");
const gameFinishText = document.getElementById("gameFinishText");
const playerScore = document.getElementById("player-score");
const currScore = document.getElementById("score");
const highScore = document.getElementById("highscore");
const restartBtn = document.getElementById("restart-btn");
const Mbody = document.getElementById("main-body");

const gameOverSFX = document.getElementById("game-over-sfx");
const goalSFX = document.getElementById("goal-sfx");
const missSFX = document.getElementById("miss-sfx");
const successSFX = document.getElementById("success-sfx");
// Adjusting Volume of Audio files
missSFX.volume = 0.4;
goalSFX.volume = 0.4;
gameOverSFX.volume = 0.4;
successSFX.volume = 0.6;


const congratsImg = document.getElementById("congrats-img");
const lostImg = document.getElementById("lost-img");

const gameMatrix = [
   [0, 0, 0, 0, 0], 
   [0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0], 
   [0, 0, 0, 0, 0], 
   [0, 0, 0, 0, 0]];

let score = 250, high_score = 0, cnt = 0;

function initialiseGame(){
   // Disappear backdrop and modal
   backDrop.style.display = "none";
   gameOverModal.style.display = "none";
   congratsImg.style.display = "none";
   lostImg.style.display = "none";
   // Define Variables for scores
   score = 250;
   currScore.innerHTML = score;
   cnt = 0;
   // Make a set to store random places for goals and mines 
   const places = new Set();
   // Assign goals to 3 unique places in grid
   while(places.size < 4){
      let randPlace = Math.floor(Math.random()*16);
      places.add(randPlace);
   }
   // Take elements out of Set and add them to Array
   const randomPlaces = [];
   for (const item of places) {
      randomPlaces.push(item);
   }
   console.log(gameMatrix);
   for(let i=0; i<5; i++){
      for(let j=0; j<5; j++){
         gameMatrix[i][j] = 0;
      }
   }
   // assign mine to a random box in grid
   const mineBox = randomPlaces[0];
   const mineRow = Math.floor(mineBox / 5);
   const mineCol = mineBox % 5;
   gameMatrix[mineRow][mineCol] = -1;
   
   for(let i=1; i<=3; i++){
      const box = randomPlaces[i];
      const row = Math.floor(box / 5);
      const col = box % 5;
      gameMatrix[row][col] = 1;
   }
   gridItems.forEach(block => {
      block.classList.remove("flip-card");
   });
   for(let i=0; i<25; i++){
      let frontBox = "", backBox ="", missBox = "";
      frontBox = frontBox + i + "front";
      backBox = backBox + i + "back";
      missBox = missBox + i + "miss";

      let tempcardFront = document.getElementById(frontBox);
      let tempcardBack = document.getElementById(backBox);
      let tempcardMiss = document.getElementById(missBox);

      tempcardFront.style.display = "none";
      tempcardBack.style.display = "none";
      tempcardMiss.style.display = "none";

   }
}

// Start Game Initially
initialiseGame();

// Game Logic
gridItems.forEach(item => {
   item.addEventListener("click", function(event){
      event.target.classList.add("flip-card");
      console.log("I'm Clicked");

      const pressedBlock = Number(event.target.getAttribute('data-value'));
      const row = Math.floor(pressedBlock / 5);
      const col = pressedBlock % 5;
      console.log(pressedBlock)
      console.log(gameMatrix)
      
      if(gameMatrix[row][col] == -100){
         console.log("Do Nothing");
      }
      else if(gameMatrix[row][col] == -1){
         gameOverSFX.play();
         lostImg.style.display = "flex";

         console.log("GameOber");
         score = 0;
         let backBox = "";
         backBox = backBox + pressedBlock + "back";
         let backcard = document.getElementById(backBox);
         // backcard.classList.remove('hide');
         backcard.style.display = "flex";
         gameFinishText.innerHTML = "Game Over";         
         playerScore.innerHTML = score;
         setTimeout(function(){
            backDrop.style.display = "flex";
            gameOverModal.style.display = "flex";
         }, 1000);
      }

      else if(gameMatrix[row][col] == 1){
         goalSFX.play();
         cnt += 1;

         gameMatrix[row][col] = -100; // denotion that the box is already clicked

         let frontBox = "";
         frontBox = frontBox + pressedBlock + "front";
         console.log(frontBox);
         let tempcard = document.getElementById(frontBox);
         // tempcard.classList.remove('hide');
         tempcard.style.display = "flex";
         
         if(cnt == 3){
            setTimeout(function(){
               playerScore.innerHTML = score;
               congratsImg.style.display = "flex";
               successSFX.play();

               highScore.innerHTML = Math.max(score, high_score);
               gameFinishText.innerHTML = "Congratulations";
               backDrop.style.display = "flex";
               gameOverModal.style.display = "flex";
            }, 300);
            
         }
      }
      else if(gameMatrix[row][col] == 0) {
         missSFX.play();
         gameMatrix[row][col] = -100;
         score -= 10;
         let missBox = "";
         missBox = missBox + pressedBlock + "miss";
         let missCard = document.getElementById(missBox);
         // missCard.classList.remove('hide');
         missCard.style.display = "flex";
      }
      currScore.innerHTML = score;
   });
});

restartBtn.addEventListener('click', function(){
   gameOverModal.classList.add('hide');
   backDrop.classList.add('hide');
   initialiseGame();
});

