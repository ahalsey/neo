(function() {
  // 1) Remove the difficulty form if it exists
  const difficultyForm = document.getElementById("difficultyForm");
  if (difficultyForm) {
    difficultyForm.remove();
  }

  // 2) Safely get the #pageDesc element
  const pageDesc = document.querySelector("#pageDesc");
  if (!pageDesc) {
    console.warn("#pageDesc not found; script will not modify the page.");
    return;
  }

  // 3) Function to play audio after a short delay
  function kikoplay() {
    const audioEl = document.querySelector("#kikopop");
    if (audioEl) {
      audioEl.play();
    }
  }
  setTimeout(kikoplay, 1500);

  // 4) Create the container for difficulty buttons
  const diffButtonsContainer = document.createElement("div");
  diffButtonsContainer.id = "diffbuttons";

  // 5) Build each difficulty button (EASY, MEDIUM, HARD) in code
  const difficulties = [
    { label: "EASY",    value: 1 },
    { label: "MEDIUM",  value: 2 },
    { label: "HARD",    value: 3 }
  ];

  difficulties.forEach(difObj => {
    const btn = document.createElement("div");
    btn.className = "buttonfix difficulty-btn"; // add any classes you want
    btn.textContent = difObj.label;
    btn.addEventListener("click", () => {
      removeDifficultyButtons();
      createPrizeButton(difObj.value);
    });
    diffButtonsContainer.appendChild(btn);
  });

  pageDesc.appendChild(diffButtonsContainer);

  /**
   * Removes the difficulty buttons from the page.
   */
  function removeDifficultyButtons() {
    const el = document.getElementById("diffbuttons");
    if (el) el.remove();
  }

  /**
   * Creates the final "GET PRIZE" button and appends it.
   * @param {number} difficulty
   */
  function createPrizeButton(difficulty) {
    const kikofix = document.createElement("div");
    kikofix.id = "kikofix";
    
    const prizeBtn = document.createElement("div");
    prizeBtn.className = "buttonfix prizebutton";
    prizeBtn.textContent = "GET PRIZE";
    prizeBtn.addEventListener("click", () => {
      // Remove our own button (if desired)
      prizeBtn.remove();
      // Execute the result-fix logic
      getResultFix(difficulty);
    });

    kikofix.appendChild(prizeBtn);
    pageDesc.appendChild(kikofix);
  }

  /**
   * Calls the server with the chosen difficulty, then alerts based on the response.
   * Using fetch() as a modern replacement for $.ajax().
   * @param {number} difficulty 
   */
  function getResultFix(difficulty) {
    // Example with GET query. Adjust if the server expects POST data.
    fetch(`ajax/prize.php?difficulty=${encodeURIComponent(difficulty)}`, {
      method: "GET", 
      headers: { "Accept": "application/json" }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Example: reveal some prize info in the DOM
        document.getElementById("prizeButton")?.style.setProperty("display", "block");
      } else {
        alert("Not today.");
      }
    })
    .catch(err => {
      console.error("Failed to fetch prize data:", err);
      alert("An error occurred. Please try again later.");
    });
  }

  // 6) Append style via <style> element
  const style = document.createElement("style");
  style.type = "text/css";
  style.textContent = `
    /* Shared button style */
    .buttonfix {
      width: 190px;
      height: 30px;
      font-family: Verdana, Arial, Helvetica, sans-serif;
      font-size: 9pt;
      background: url(https://images.neopets.com/games/dart/buttons/bg.png) -560px 0 no-repeat;
      cursor: pointer;
      margin: 0 auto 10px;
      text-align: center;
      line-height: 30px;
    }

    /* Container for difficulty buttons */
    #diffbuttons {
      position: relative;
      top: 300px;
      left: 500px;
      z-index: 9;
      width: 190px;
      height: 39px;
      margin: 0 auto;
      text-align: center;
    }

    .difficulty-btn {
      margin-top: 10px;
    }

    /* Container for "GET PRIZE" button */
    #kikofix {
      position: relative;
      z-index: 9;
      width: 190px;
      height: 39px;
      top: 300px;
      left: 500px;
      margin: 0 auto;
      text-align: center;
    }

    .prizebutton {
      margin-top: 10px;
      line-height: 30px;
    }

    /* Force black text on b elements inside these containers */
    #kikofix b, #diffbuttons b {
      color: black !important;
    }
  `;
  document.head.appendChild(style);

})();
