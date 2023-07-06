document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterButton = document.getElementById("good-dog-filter");

  let filterOn = false; // Variable to track the filter status

  // Step 2: Fetch and display all pups in the dog bar
  fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(pups => {
      pups.forEach(pup => {
        const pupSpan = document.createElement("span");
        pupSpan.textContent = pup.name;
        pupSpan.addEventListener("click", () => showPupInfo(pup));
        dogBar.appendChild(pupSpan);
      });
    });

  // Step 3: Show more info about each pup
  function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}" />
      <h2>${pup.name}</h2>
      <button>${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;
    const toggleButton = dogInfo.querySelector("button");
    toggleButton.addEventListener("click", () => toggleGoodness(pup));
  }

  // Step 4: Toggle good dog status
  function toggleGoodness(pup) {
    pup.isGoodDog = !pup.isGoodDog;
    const toggleButton = dogInfo.querySelector("button");
    toggleButton.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";

    // Update the dog's status in the database
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isGoodDog: pup.isGoodDog })
    });
  }

  // Bonus! Step 5: Filter good dogs
  filterButton.addEventListener("click", () => {
    filterOn = !filterOn;
    filterButton.textContent = filterOn ? "Filter good dogs: ON" : "Filter good dogs: OFF";
    dogBar.innerHTML = ""; // Clear the dog bar

    // Fetch and display pups based on filter status
    fetch("http://localhost:3000/pups")
      .then(response => response.json())
      .then(pups => {
        if (filterOn) {
          pups = pups.filter(pup => pup.isGoodDog);
        }
        pups.forEach(pup => {
          const pupSpan = document.createElement("span");
          pupSpan.textContent = pup.name;
          pupSpan.addEventListener("click", () => showPupInfo(pup));
          dogBar.appendChild(pupSpan);
        });
      });
  });
});
