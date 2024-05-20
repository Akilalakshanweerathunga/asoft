


document.addEventListener("DOMContentLoaded", function () {
  let loading = true;
  const circles = document.querySelectorAll(".circle");
  const handPointer = document.getElementById("handPointer");
  let lastCircle = null; // To keep track of the last circle with a red border
  let isPaused = false; // To pause hand animation during the 5-second countdown

  function animatePointer() {
    if (!isPaused) {
      console.log("isPaused", isPaused);
      circles.forEach((circle, index) => {
        setTimeout(() => {
          if (!isPaused) {
            handPointer.style.display = "block";
            if (lastCircle) {
              lastCircle.classList.remove("red-border"); // Remove the red border from the last circle
            }

            const circleRect = circle.getBoundingClientRect();
            const handPointerRect = handPointer.getBoundingClientRect();

            // Calculate center positions
            const circleCenterX = circleRect.left + circleRect.width / 2;
            const circleCenterY = circleRect.top + circleRect.height / 2;
            const handPointerCenterX = handPointerRect.width / 2;
            const handPointerCenterY = handPointerRect.height / 2;

            // Adjust hand pointer to circle center
            const moveX = circleCenterX - handPointerCenterX;
            const moveY = circleCenterY - handPointerCenterY;

            handPointer.style.transform = `translate(${moveX}px, ${moveY}px)`;

            // Change border after the hand pointer has moved
            setTimeout(() => {
              circle.classList.add("red-border");
              lastCircle = circle; // Update the lastCircle to the current one
            }, 500); // Adjust this time to match the duration of the pointer movement
          } else {
            handPointer.style.display = "none";
            circles.forEach(function (circle) {
              circle.classList.remove("red-border");
            });
          }
        }, index * 1000);
      });

      // Restart the animation to loop continuously
      setTimeout(animatePointer, circles.length * 1000 + 1000); // Loops the animation
    }
  }

  const countdownElement = document.getElementById("countdownTimer");
  var time = 0;
  initialGame().then((timez) => {
    var providedDate = new Date(timez["lastUpdateTime"] + "Z");
    var currentDate = new Date();
    var difference = currentDate - providedDate;
    var differenceInSeconds = Math.floor(difference / 1000);
    if (differenceInSeconds < 39) {
      time = timez["timer"]; // 30 seconds for the countdown
    } else {
      time = timez["timer"];
    }
    console.log("gameStarted", differenceInSeconds, time);
    loading = false;
    animatePointer();
    updateCountdown();
  });
  

  function updateCountdown() {
    if (time > 0) {
      document.querySelectorAll(".circle").forEach(function (element) {
        element.classList.remove("disabled");
      });

      countdownElement.textContent = time;
      time--;
      setTimeout(updateCountdown, 1000);
    } else if (time === 0) {
      document.querySelectorAll(".circle").forEach(function (element) {
        element.classList.add("disabled");
      });
      countdownElement.textContent = "Time's up!";
      isPaused = true; // Pause the hand animation
      setTimeout(() => {
        // Start a new 5-second countdown
        time = 5;
        countdownElement.textContent = time;
        updateShortCountdown();
      }, 1000);

      document.getElementById("countdownCircle").style.backgroundColor =
        "black";
      document.getElementById("countdownCircle").style.opacity = "0.5";
      document.getElementById("pleasebet").innerHTML = "";

      function animateDivs() {
        const circles = document.querySelectorAll(".circle");

        circles.forEach((circle, index) => {
          setTimeout(() => {
            circle.style.backgroundColor = "black";
            circle.style.opacity = "0.5";

            // Reset to default background color and opacity after animation
            setTimeout(() => {
              circle.style.backgroundColor = ""; // Set to default background color
              circle.style.opacity = ""; // Set to default opacity
            }, 50); // Reset after one second
          }, index * 50); // Set a delay of one second for each div
        });

        // Call animateDivs function recursively to loop the animation
        animationTimeout = setTimeout(animateDivs, 50 * circles.length);
      }

      // Start the animation
      animateDivs();
    }
  }

  function updateShortCountdown() {
    if (time > 0) {
      countdownElement.textContent = time;
      time--;
      setTimeout(updateShortCountdown, 1000);
    } else {
      countdownElement.textContent = "Go!";
      isPaused = false; // Resume hand animation
      animatePointer(); // Restart pointer animation
      clearTimeout(animationTimeout);
      openreslutmodel();
      setTimeout(function () {
        location.reload(true);
      }, 5000);
    }
  }
});

var betamount = 1;
var selec = -1;
let circleArr = [10, 15, 20, 25, 30, 35, 40, 45];
var imgvalue;
var balanceVal = 0;
var userID = 1;
var circleSelected = false;

var selectedCount = 6;
var selection = {
  selections: [],
};


async function getUserBalance() {
  const apiUrl = `http://34.143.224.236:8080/api/v1/game/user/balance/${userID}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return null;
  }
}


async function initialGame() {
  try {
    const response = await fetch(
      "http://34.143.224.236:8080/api/v1/game/gameState"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game outcome");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game outcome:", error.message);
    return null;
  }
}

getUserBalance()
  .then((balance) => {
    balanceVal = balance;
    document.getElementById("blance").innerHTML = `Balance : ${balance}`;
    console.log("User balance:", balance);
  })
  .catch((error) => {
    console.error("Error getting user balance:", error);
  });

function sumMultipliers(jsonObj) {
  let sum = 0;
  // Check if the 'selection' property exists in the JSON object
  if (jsonObj.selections) {
    // Loop through each object in the 'selection' array
    for (let i = 0; i < jsonObj.selections.length; i++) {
      // Add the multiplier of the current object to the sum
      sum += jsonObj.selections[i].multiplier;
    }
  }
  return sum;
}

var newObj = {};
var btnClicked = false;
function betbutton(count) {
  if(!btnClicked){
    btnClicked = true;
    betamount = count ? count : 1;
    getUserBalance()
    .then((balance) => {
      if (selec >= 0) {
        var foundSelection = selection.selections.find(function (item) {
          return item.id === selec;
        });
        console.log("selec", selec);

        if (foundSelection) {
          foundSelection.multiplier += betamount;
          document.getElementById(`bamount${selec}`).innerHTML =
            "$ " + foundSelection.multiplier;
        } else {
          newObj = { id: selec, multiplier: betamount };
          document.getElementById(`bamount${selec}`).innerHTML =
            "$ " + betamount;
          selection.selections.push(newObj);
        }

        let amount = betamount;

        let totalMultiplier = sumMultipliers(selection);
        document.getElementById(
          "betAmountDiv"
        ).innerHTML = `Bet Amount : ${totalMultiplier}`;

        console.log(amount, balanceVal);
        if (balance >= amount) {
          updateUserBalance(userID, balanceVal - amount);
          const dataToAdd = {
            userId: userID,
            round: Math.floor(Math.random() * 1000) + 1,
            betAmount: amount,
          };
          addbettinghistory(dataToAdd);
          const dataToAddLeaderBoard = { userId: userID, winAmount: amount*selec };
          addLeaderBoard(dataToAddLeaderBoard);
        } else {
          alert("Insuffience Balance");
        }
      } else {
        alert("select a circle first");
      }
      btnClicked = false;
    })
    .catch((error) => {
      console.error("Error getting user balance:", error);
    });

  }
  
}

function seletectimg(img) {
  selec = img;

  var selectedDiv = document.getElementById(img.toString());
  var selectedDivs = document.querySelectorAll('.circle[style*="lightgreen"]');

  if (selectedDivs.length >= 6 && !selectedDiv.style.backgroundColor) {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    return;
  }

  if (selectedDiv.style.backgroundColor !== "lightgreen") {
    selectedDiv.style.backgroundColor = "lightgreen";
    selectedCount--;
  } else {
    selectedDiv.style.backgroundColor = "";
    selectedCount++;
  }

  if (selectedCount < 0) {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }

  imgvalue = img;
}

function checkJsonArray(jsonArray) {
  jsonArray.forEach((item) => {
    if (item === "10") {
      document.getElementById("rimg").src = "./image1.png";
    } else if (item === "15") {
      document.getElementById("rimg").src = "./image2.png";
    } else if (item === "20") {
      document.getElementById("rimg").src = "./image3.png";
    } else if (item === "25") {
      document.getElementById("rimg").src = "./image4.png";
    } else if (item === "30") {
      document.getElementById("rimg").src = "./image5.png";
    } else if (item === "35") {
      document.getElementById("rimg").src = "./image6.png";
    } else if (item === "40") {
      document.getElementById("rimg").src = "./image7.png";
    } else if (item === "45") {
      document.getElementById("rimg").src = "./image8.png";
    }

    if (jsonArray.includes(imgvalue)) {
      var tottalpoint = betamount * imgvalue;

      document.getElementById("totalpoint").innerHTML = tottalpoint;
    }

    // Add more else if conditions for other values as needed
  });
}

async function getGameOutcome() {
  try {
    const response = await fetch(
      "http://34.143.224.236:8080/api/v1/game/gameState"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game outcome");
    }
    const data = await response.json();
    return data.roundRandomNumber;
  } catch (error) {
    console.error("Error fetching game outcome:", error.message);
    return null;
  }
}

function findIdAndMultiplier(jsonObj, idToFind) {
  if (jsonObj.selections) {
    for (let i = 0; i < jsonObj.selections.length; i++) {
      console.log(jsonObj.selections[i].id, ":", idToFind);
      if (jsonObj.selections[i].id === idToFind) {
        return {
          id: jsonObj.selections[i].id,
          multiplier: jsonObj.selections[i].multiplier,
        };
      }
    }
  }
  return null;
}

async function addbettinghistory(data) {
  const apiUrl = `http://34.143.224.236:8080/api/v1/game/user/add/getbettinghistory`;

  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiUrl, requestData);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error adding data:", error);
    return null;
  }
}

async function addLeaderBoard(data) {
  const apiUrl = `http://34.143.224.236:8080/api/v1/game/add-leaderboard`;

  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiUrl, requestData);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error adding data:", error);
    return null;
  }
}

async function updateUserBalance(userId, amount) {
  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      amount: amount,
    }),
  };
  try {
    const response = await fetch(
      `http://34.143.224.236:8080/api/v1/game/user/balance/update?userId=${userId}&amount=${amount}`,
      requestData
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = response;
    getUserBalance()
      .then((balance) => {
        balanceVal = balance;
        document.getElementById("blance").innerHTML = `Balance : ${balance}`;
        console.log("User balance:", balance);
      })
      .catch((error) => {
        console.error("Error getting user balance:", error);
      });

    return data;
  } catch (error) {
    console.error("Error updating user balance:", error);
    return null;
  }
}

function calcLoss(jsonObj) {
  let loss = 0;
  if (jsonObj.selections) {
    for (let i = 1; i < jsonObj.selections.length + 1; i++) {
      console.log("aaa");
      console.log(10 + (i - 1) * 5);
      console.log((10 + (i - 1) * 5) * jsonObj.selections[i - 1].multiplier);
      loss += (10 + (i - 1) * 5) * jsonObj.selections[i - 1].multiplier;
    }
  }
  return loss;
}

function openreslutmodel() {
  var modal = document.getElementById("resultpop");
  modal.style.display = "block";

  getGameOutcome()
    .then((outcome) => {
      let toFind = 10 + (outcome - 1) * 5;
      console.log(`ID ${toFind} does not exist.`);

      var result = findIdAndMultiplier(selection, toFind);
      let bal = balanceVal;
      let wAmount = 0;
      if (result) {
        wAmount = toFind * result.multiplier;
        bal += toFind * result.multiplier;
        document.getElementById("wdAmount").innerHTML = `Win : ${wAmount}`;
        updateUserBalance(userID, bal);
        console.log(
          `ID ${result.id} exists with a multiplier of ${
            result.multiplier
          }. sum = ${toFind * result.multiplier}`
        );
      } else {
        console.log(`ID ${outcome} does not exist. loss = ${bal}`);
      }

      getTopPlayers()
        .then((players) => {
          console.log("User balance:", players);
          document.getElementById(
            "topscorename"
          ).innerHTML = `${players[0].name}<br>${players[0].winAmount}`;
          document.getElementById(
            "topscorename2"
          ).innerHTML = `${players[1].name}<br>${players[1].winAmount}`;
          document.getElementById(
            "topscorename3"
          ).innerHTML = `${players[2].name}<br>${players[2].winAmount}`;
        })
        .catch((error) => {
          console.error("Error getting user balance:", error);
        });

      const imgElement = document.getElementById("rimg");
      imgElement.src = `./image${outcome}.png`;
      console.log("Game outcome:", outcome);
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  var span = document.getElementsByClassName("close1")[0];

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";

      location.reload(true);
    }
  };
}

function populateHTML(jsonArray) {
  // Select the container element where you want to append the HTML
  var container = document.getElementById("container");

  // Iterate over the JSON array
  jsonArray.forEach((item) => {
    document.getElementById("topscoreimg").src = item.img;

    document.getElementById("topscorename").src = item.name;

    document.getElementById("topscoreimg2").src = item.img2;

    document.getElementById("topscorename2").src = item.name2;

    document.getElementById("topscoreimg3").src = item.img3;

    document.getElementById("topscorename3").src = item.name3;

    // Set inner HTML of the div to include image and name
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"> <p>${item.name}</p>`;

    // Append the div to the container
    container.appendChild(div);
  });
}

function leaderbord(jsonArray) {
  var container = document.getElementById("container");
  console.log(jsonArray);
  jsonArray.forEach((item) => {
    document.getElementById("lbp1").src = item.img;
    document.getElementById("lbn1").src = item.name;
    document.getElementById("lbs1").src = item.score;

    document.getElementById("lbp2").src = item.img2;
    document.getElementById("lbn2").src = item.name2;
    document.getElementById("lbs2").src = item.score2;

    document.getElementById("lbp3").src = item.img3;
    document.getElementById("lbn3").src = item.name3;
    document.getElementById("lbs3").src = item.score3;

    document.getElementById("lbp4").src = item.img4;
    document.getElementById("lbn4").src = item.name4;
    document.getElementById("lbs4").src = item.score4;

    document.getElementById("lbp5").src = item.img5;
    document.getElementById("lbn5").src = item.name5;
    document.getElementById("lbs5").src = item.score5;

    // Set inner HTML of the div to include image and name
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"> <p>${item.name}</p>`;

    // Append the div to the container
    container.appendChild(div);
  });
}

function resultlist(jsonArray) {
  // Select the container element where you want to append the HTML
  var container = document.getElementById("container");

  // Iterate over the JSON array
  jsonArray.forEach((item) => {
    document.getElementById("i1").src = item.img;

    document.getElementById("i2").src = item.img2;

    document.getElementById("i3").src = item.img3;

    document.getElementById("i4").src = item.img4;

    document.getElementById("i5").src = item.img5;

    // Set inner HTML of the div to include image and name
    div.innerHTML = `<img src="${item.img}" alt="${item.name}"> <p>${item.name}</p>`;

    // Append the div to the container
    container.appendChild(div);
  });
}

async function getTopPlayers() {
  try {
    const response = await fetch(
      "http://34.143.224.236:8080/api/v1/game/top-players"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game outcome");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game outcome:", error.message);
    return null;
  }
}

async function getTop5Players() {
  try {
    const response = await fetch(
      "http://34.143.224.236:8080/api/v1/game/top-players/5"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game outcome");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game outcome:", error.message);
    return null;
  }
}

async function displayLeaderBoard() {
  getTop5Players().then((leaderboard) => {
    console.log(leaderboard[0]);
    for (let i = 0; i < leaderboard.length; i++) {
      document.getElementById(`lbn${i + 1}`).innerHTML = leaderboard[i].name;
      document.getElementById(`lbs${i + 1}`).innerHTML =
        leaderboard[i].winAmount;
      document.getElementById(`lbp${i + 1}`).src =
        "https://picsum.photos/200/300";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var leaderboardModal = document.getElementById("leaderbordpop");
  var closeButton = document.querySelector(".close3");

  displayLeaderBoard();

  function openModal() {
    leaderboardModal.style.display = "block";
  }

  function closeModal() {
    leaderboardModal.style.display = "none";
  }

  if (closeButton) {
    closeButton.onclick = closeModal;
  }

  window.onclick = function (event) {
    if (event.target == leaderboardModal) {
      closeModal();
    }
  };

  // Move the openleaderbord function inside the DOMContentLoaded event listener
  function openleaderbord() {
    openModal();
  }

  // Get the button element for opening the leaderboard
  var openLeaderboardButton = document.getElementById("openLeaderboardButton");

  // Add event listener to the button
  if (openLeaderboardButton) {
    openLeaderboardButton.onclick = openleaderbord;
  }
});
