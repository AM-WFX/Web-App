// =========================================================================
// === JAVASCRIPT MASTER LOADER & AUTH GATEKEEPER ===
// This function ensures ALL code runs after the HTML structure is loaded.
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. FIREBASE AUTHENTICATION SETUP ---
    if (typeof firebase === 'undefined') {
        console.error("Firebase is not loaded. Make sure the SDK scripts are in your HTML before script.js.");
        const authLoading = document.getElementById('auth-loading');
        const loginPrompt = document.getElementById('login-prompt');
        if(authLoading) authLoading.style.display = 'none';
        if(loginPrompt) {
            loginPrompt.style.display = 'flex';
            loginPrompt.innerHTML = "<h1>Error: Could not load login services. Please refresh.</h1>";
        }
        return; 
    }
    
    const auth = firebase.auth();

    const authLoading = document.getElementById('auth-loading');
    const loginPrompt = document.getElementById('login-prompt');
    const labContent = document.getElementById('page-content'); 
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const welcomeMessage = document.getElementById('welcome-message');

    let labInitialized = false; 

    // --- 2. AUTH FUNCTIONS ---
    function signIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch((error) => {
                console.error("Sign-in error:", error.message);
            });
    }

    function signOut() {
        localStorage.removeItem('labIntroCompleted');
        localStorage.removeItem('css_lab_user'); 
        auth.signOut();
    }

    if(loginButton) loginButton.addEventListener('click', signIn);
    if(logoutButton) logoutButton.addEventListener('click', signOut);

    // --- 3. THE "GATEKEEPER" ---
    auth.onAuthStateChanged((user) => {
        
        if (authLoading) authLoading.style.display = 'none';

        if (user) {
            // --- USER IS LOGGED IN ---
            if(loginPrompt) loginPrompt.style.display = 'none';
            if(labContent) labContent.style.display = 'flex'; // Use 'flex' for sticky footer

            if(logoutButton) logoutButton.style.display = 'inline-flex';
            if(welcomeMessage) welcomeMessage.textContent = `Hello, ${user.displayName}`;
            
            localStorage.setItem('css_lab_user', user.displayName);

            const mainPageContainer = document.querySelector('.container');
            const instructionsBox = document.querySelector('.instructions-box');
            const challengesGrid = document.getElementById('all-challenges');
            
            if (mainPageContainer && instructionsBox && challengesGrid && !labInitialized) {
                
                const introCompleted = localStorage.getItem('labIntroCompleted');

                if (introCompleted) {
                    // USER HAS ALREADY DONE THE INTRO
                    mainPageContainer.style.display = 'block';
                    initializeChallenges();
                } else {
                    // NEW USER: Show the "choice" screen
                    mainPageContainer.style.display = 'none';
                    showExperienceLevelChoice(labContent, mainPageContainer); 
                }
                labInitialized = true;
            }
            
        } else {
            // --- USER IS LOGGED OUT ---
            if(loginPrompt) loginPrompt.style.display = 'flex';
            if(labContent) labContent.style.display = 'none';

            if(logoutButton) logoutButton.style.display = 'none';
            if(welcomeMessage) welcomeMessage.textContent = '';
            
            localStorage.removeItem('css_lab_user');
            localStorage.removeItem('labIntroCompleted');
            labInitialized = false; 
        }
    });

}); // End of DOMContentLoaded

// -------------------------------------------------
// 💡 --- NEW GAMIFIED INTRO FUNCTIONS --- 💡
// -------------------------------------------------

/**
* Creates the "Challenge 0" container and inserts it *after* the navbar.
*/
function showExperienceLevelChoice(labContent, mainPageContainer) {
    
    const introChallengeDiv = document.createElement('div');
    introChallengeDiv.id = 'challenge-0-container';
    introChallengeDiv.classList.add('container'); 
    // This style forces the container to fill the screen and center its content
    introChallengeDiv.style = "flex-grow: 1; display: flex; align-items: center; width: 100%; padding: 30px;"; 
    
    // Phase 1 UI: The Choice (A simple white box)
    introChallengeDiv.innerHTML = `
        <div class="main-content" style="text-align: center; max-width: 600px; margin: auto;">
            <h2 style="margin-top: 0;">Welcome to the CSS Lab!</h2>
            <p>How would you like to start?</p>
            
            <button id="start-guided" class="cta-button" style="margin: 10px 5px !important;">
                "I'm new to this. Guide me!"
            </button>
            <button id="start-expert" class="cta-button" style="margin: 10px 5px !important;">
                "I know CSS. Let's go!"
            </button>
        </div>
    `;
    
    const navbar = labContent.querySelector('.navbar');
    if (navbar) {
        navbar.after(introChallengeDiv);
    }
    
    document.getElementById('start-guided').addEventListener('click', startGuidedTour);
    document.getElementById('start-expert').addEventListener('click', () => startExpertTest(mainPageContainer));
}

/**
* (Beginner Path) "Morphs" the intro box into the tutorial.
*/
function startGuidedTour() {
    const challengeBox = document.getElementById('challenge-0-container');
    
    // We must *preserve* flex-grow and display:flex
    // We only change align-items to 'flex-start' (top).
    challengeBox.style.cssText = "flex-grow: 1; display: flex; align-items: flex-start; width: 100%; padding: 30px 0;";
    
    // Phase 2 UI: The Tutorial (Morphs into a challenge container)
    challengeBox.innerHTML = `
        <div class="challenge-container" style="max-width: 600px; margin: 0 auto;">
            <h3 id="challenge-title-0" style="margin:0; text-align: center;">Guided Tour: Learn the UI</h3>
            <span id="status-0" style="color: grey;">(Tutorial)</span>
            
            <p id="prompt-0">
                Welcome! Let's learn the UI.
            </p>
            
            <div id="target-area-0" class="challenge-target-area">
                <button id="start-button">Click me to start!</button>
            </div>
            
            <div class="challenge-ui">
                <input type="text" id="selector-input-0" placeholder="Type your selector here...">
                <button class="cta-button" onclick="validateTutorial()">Validate</button>
            </div>
            <div id="feedback-0" class="validation-feedback"></div>
        </div>
    `;
    
    // Start the spotlight tour
    startSpotlightTour();
}

/**
* (Expert Path) Hides the intro and shows the real lab.
*/
function startExpertTest(mainPageContainer) {
    localStorage.setItem('labIntroCompleted', 'true');

    const introBox = document.getElementById('challenge-0-container');
    if (introBox) introBox.remove(); 
    
    if (mainPageContainer) mainPageContainer.style.display = 'block';
    
    initializeChallenges(); 
}

/**
* Special validation function just for the "Challenge 0" tutorial.
*/
function validateTutorial() {
    const inputField = document.getElementById('selector-input-0');
    const feedbackElement = document.getElementById('feedback-0');
    const userInput = inputField.value.trim();

    if (userInput === '#start-button') {
        localStorage.setItem('labIntroCompleted', 'true');
        
        feedbackElement.className = 'validation-feedback success';
        feedbackElement.innerHTML = `
            🎉 <b>PERFECT!</b> You got it.
            <br><br>
            Loading the real challenges now...
        `;

        setTimeout(() => {
            const introBox = document.getElementById('challenge-0-container');
            if (introBox) introBox.remove();

            const mainPageContainer = document.querySelector('.container');
            if (mainPageContainer) mainPageContainer.style.display = 'block';
            
            initializeChallenges();
        }, 1500); 

    } else {
        feedbackElement.className = 'validation-feedback error';
        feedbackElement.innerHTML = `Not quite! Try typing the exact selector <code>#start-button</code> into the input box.`;
    }
}

// -------------------------------------------------
// 💡 --- SPOTLIGHT TOUR FUNCTIONS (ALL NEW) --- 💡
// -------------------------------------------------
let currentTourStep = 0;

// ❗ --- THIS IS THE FIX (Part 1) --- ❗
// Updated coordinates for Step 1
// Updated beakDirection for Step 5
const tourSteps = [
    {
        element: '#prompt-0',
        title: "Step 1: The Prompt",
        text: "<p>This is the <strong>Prompt</strong>. It tells you *what* element to find. In this case, it's the 'Start' button.</p>",
        top: "190px", 
        left: "1090px",
        beakTop: "35px",
        beakDirection: "left"
    },
    {
        element: '#target-area-0',
        title: "Step 2: The Target Area",
        text: "<p>This is the <strong>Target Area</strong>. The HTML elements you need to select are inside this box.</p>",
        top: "255px", 
        left: "1090px",
        beakTop: "111.5px",
        beakDirection: "left"
    },
    {
        element: '#target-area-0',
        title: "Step 3: How to Find the Selector",
        text: "<p>To find a selector, <strong>right-click</strong> the 'Click me to start!' button and choose <strong>'Inspect'</strong>.</p><p></p>",
        top: "269px", 
        left: "1090px",
        beakTop: "102px",
        beakDirection: "left"
    },
    {
        element: '#target-area-0',
        title: "Step 4: Using the Console",
        text: "<p>The <strong>Developer Console</strong> will open, showing you the HTML. Notice the button has an `id`? That's your answer!</p><p></p>",
        top: "255px", 
        left: "1090px",
        beakTop: "111.5px",
        beakDirection: "left"
    },
    {
        element: '#selector-input-0',
        title: "Step 5: The Input Field",
        text: "<p>Now, type your selector (<code>#start-button</code>) into the <strong>Input Field</strong>.</p>",
        // --- THIS IS THE ONLY CHANGE AS REQUESTED ---
        top: "350px", 
        left: "90px",
        beakTop: "167px",
        beakDirection: "right"
        // --- END OF CHANGE ---
    },
    {
        element: 'button[onclick="validateTutorial()"]',
        title: "Step 6: The Validate Button",
        text: "<p>Finally, click the <strong>Validate</strong> button to check your answer. Your turn!</p>",
        top: "340px", 
        left: "1070px",
        beakTop: "171.5px",
        beakDirection: "left" // ❗ Back to 'left' as requested
    }
];

function startSpotlightTour() {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    document.body.appendChild(overlay);

    const panel = document.createElement('div');
    panel.id = 'tour-panel'; 
    
    panel.innerHTML = `
        <button id="tour-skip" class="tour-skip-x">&times;</button>
        <div id="tour-content">
            <h3 id="tour-title"></h3>
            <div id="tour-text"></div>
            <div id="tour-buttons">
                <button id="tour-back" class="cta-skip">Back</button>
                <button id="tour-next" class="cta-button">Next</button>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('tour-next').addEventListener('click', nextTourStep);
    document.getElementById('tour-back').addEventListener('click', prevTourStep);
    document.getElementById('tour-skip').addEventListener('click', endSpotlightTour);

    currentTourStep = 0;
    showTourStep(currentTourStep);
}

function showTourStep(stepIndex) {
    const step = tourSteps[stepIndex];
    if (!step) {
        endSpotlightTour();
        return;
    }

    const popup = document.getElementById('tour-panel');
    const targetElement = document.querySelector(step.element);
    
    // Update popup content
    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-text').innerHTML = step.text;

    // Remove previous spotlight
    document.querySelector('.spotlight')?.classList.remove('spotlight');
    
    if (targetElement) {
        // Add new spotlight
        targetElement.classList.add('spotlight');
        
        // ❗ --- THIS IS THE FIX (Part 2) --- ❗
        // Removed all dynamic calculations.
        // We now read your exact values from the tourSteps array.
        // We add window.scrollY to ensure 'top' is correct if the page is scrolled.
        popup.style.top = `calc(${step.top} + ${window.scrollY}px)`;
        popup.style.left = step.left;
        popup.style.setProperty('--beak-top', step.beakTop);

        // This controls the beak direction
        popup.classList.remove('tour-beak-left', 'tour-beak-right');
        if (step.beakDirection === 'right') {
             popup.classList.add('tour-beak-right');
        } else {
             popup.classList.add('tour-beak-left');
        }
    }

    // Update Button Logic
    const backButton = document.getElementById('tour-back');
    const nextButton = document.getElementById('tour-next');

    backButton.style.visibility = (stepIndex === 0) ? 'hidden' : 'visible';

    if (stepIndex === tourSteps.length - 1) {
        nextButton.textContent = "Done!";
    } else {
        nextButton.textContent = "Next";
    }
}

function prevTourStep() {
    currentTourStep--;
    showTourStep(currentTourStep);
}

function nextTourStep() {
    currentTourStep++;
    showTourStep(currentTourStep);
}

function endSpotlightTour() {
    document.getElementById('tour-overlay')?.remove();
    document.getElementById('tour-panel')?.remove();
    document.querySelector('.spotlight')?.classList.remove('spotlight');
    
    const prompt = document.getElementById('prompt-0');
    if (prompt) {
        prompt.innerHTML = "Your turn! Select the 'Start' button. <br> Type <code>#start-button</code> and hit 'Validate'.";
    }
}


// =========================================================================
// === VANILLA JS CHALLENGE LOGIC (The bulk of the code) ===
// =========================================================================

// Store the state of each challenge
const challengeStates = {};
        
// Helper function to create a new challenge structure (used after reveal)
function generateNewChallengeHTML(def) {
    let html;
    let newTargetSelector;
    let newPrompt; 
    
    if (def.type.includes('ID Selector')) {
        html = `
            <button id="try-one" class="btn-group">Button One</button>
            <button id="try-two" class="btn-group new-target">Target Again</button>
            <button id="try-three" class="btn-group">Button Three</button>
        `;
        newTargetSelector = "#try-two";
        newPrompt = "Target the 'Target Again' button using its unique ID (`#try-two`).";
    } else if (def.type.includes('Class Selector')) {
        html = `
            <div class="data-item">Item A</div>
            <div class="data-item new-target">Item B</div>
            <div class="data-item">Item C</div>
      . `;
        newTargetSelector = ".new-target";
        newPrompt = "Target the element labeled 'Item B' using its class selector.";
    } else if (def.type.includes('Descendant Combinator')) {
        html = `
            <div id="project-list">
                <p>File A</p>
                <div class="folder">
                    <p class="new-target">File B</p>
                </div>
            </div>
        `;
        newTargetSelector = "#project-list p.new-target";
        newPrompt = "Target the element with the class `.new-target` that is a descendant of the `#project-list` div.";
    } else if (def.type.includes('Child Combinator')) {
        html = `
            <ul class="nav-menu">
                <li>Link 1</li>
                <li><span>Link 2</span></li>
                <li class="new-target">Link 3</li>
            </ul>
        `;
        newTargetSelector = "ul.nav-menu > li.new-target";
        newPrompt = "Target the list item with the class `.new-target` that is a direct child of the unordered list (`ul.nav-menu`).";
    } else if (def.type.includes('Adjacent Sibling Combinator')) {
        html = `
            <button id="prev-sibling">Previous</button>
            <p class="new-target">Target Paragraph</p>
            <p>Next Paragraph</p>
        `;
        newTargetSelector = "#prev-sibling + p";
        newPrompt = "Target the paragraph that immediately follows the `#prev-sibling` button.";
    }
     else {
        html = def.baseHTML.replace(def.targetSelector.replace(/[#\.\s>+~:]/g, ''), 'new-target');
        newTargetSelector = def.correctTarget.replace(def.correctTarget.replace(/[#\.\s>+~:]/g, ''), 'new-target');
        newPrompt = `Apply the ${def.type} logic to this new structure. The target element now has the class .new-target.`;
    }
    
    return { html: html, newTargetSelector: newTargetSelector, newPrompt: newPrompt };
}

// Definition of all challenges
const challengeDefinitions = [
    {
        id: 1,
        prompt: "Target the Primary Login Button using its unique ID.",
        targetSelector: "#login-primary",
        type: "ID Selector",
        alternatives: [
            { selector: "button#login-primary", explanation: "This uses the tag name and the ID. Since IDs are already unique, adding the tag name is redundant but valid." }
        ],
        trivia: "The ID selector is the most powerful in terms of specificity (100 points).",
        html: `
            <button id="login-primary" class="btn btn-primary">Primary Login Button</button>
            <button id="login-secondary" class="btn btn-secondary">Secondary Button</button>
        `
    },
    {
        id: 2,
        prompt: "Target the item marked Urgent using its class.",
        targetSelector: ".task-urgent",
        type: "Class Selector",
        alternatives: [
            { selector: "li.task-urgent", explanation: "This is a great technique: combining the tag name (li) with the class." },
            { selector: ".task-urgent.list-item", explanation: "This chains two class selectors together, ensuring an element has *both* classes." }
        ],
        trivia: "Class selectors contribute 10 points to specificity. You can chain multiple classes, like `.classA.classB`.",
        html: `
            <ul>
                <li class="list-item task-default">Normal Item</li>
                <li class="list-item task-urgent">Urgent Item</li>
                <li class="list-item task-default">Another Normal Item</li>
            </ul>
        `
    },
    {
        id: 3,
        prompt: "Target the Save button that is contained *anywhere* inside the #settings-modal.",
        targetSelector: "#settings-modal .btn-save",
        type: "Descendant Combinator",
        alternatives: [
            { selector: "#settings-modal button.btn-save", explanation: "This is highly specific. It combines the ID of the container, the tag name, and the class name." },
        ],
        trivia: "A single space is the Descendant Combinator. It selects elements nested at *any* depth.",
        html: `
            <div id="settings-modal">
                <button class="btn-cancel">Cancel</button>
                <div class="footer">
                    <button class="btn-save">Save</button>
                </div>
            </div>
        `
    },
    {
        id: 4,
        prompt: "Target the Title text that is a direct child of the .card-header.",
        targetSelector: ".card-header > h2:first-child",
        type: "Child Combinator",
        alternatives: [
            { selector: "[class=\"card-header\"] > h2:first-child", explanation: "This works perfectly! It uses the attribute selector to find the parent and `:first-child` to select the specific target." },
            { selector: ".card > .card-header > h2:first-child", explanation: "This chains multiple Child Combinators, ensuring a rigid structure." }
        ],
        trivia: "The Child Combinator (`>`) ensures the relationship is direct (one level deep). You often need pseudo-classes like `:first-child` to pick one specific element from a group.",
        html: `
            <div class="card">
                <div class="card-header">
                    <h2>Card Title</h2>
                    <h2>Subtitle</h2>
                </div>
                <p>Card Body</p>
OS       </div>
        `
    },
    {
        id: 5,
        prompt: "Target the Second Item that immediately follows the element with the class .first-element.",
        targetSelector: ".first-element + li",
        type: "Adjacent Sibling Combinator",
        alternatives: [
            { selector: "li.first-element + li.list-item", explanation: "A highly specific version that ensures both elements are list items." }
        ],
        trivia: "The Adjacent Sibling Combinator (`+`) only selects the *one* element that immediately follows.",
        html: `
            <ul>
                <li class="list-item">Zero Item</li>
Note           <li class="list-item first-element">First Item</li>
                <li class="list-item second-element">Second Item</li>
                <li class="list-item">Third Item</li>
            </ul>
        `
    },
    {
        id: 6,
        prompt: "Target the Comments button given in the area below, which appears somewhere after the h3 element.",
SESSION       targetSelector: "h3 ~ .comments",
        type: "General Sibling Combinator",
        alternatives: [
            { selector: "p ~ .comments", explanation: "This is also correct! It targets the .comments button as a sibling of the 'p' tag." },
            { selector: "h3 ~ button", explanation: "This is a valid, though less specific, selector that also works." }
        ],
        trivia: "The General Sibling Combinator (`~`) selects all siblings that follow, not just the immediate one.",
        html: `
            <h3>Post Title</h3>
            <p>Post content...</p>
            <button class="comments">Comments</button>
        `
    },
    {
        id: 7,
        prompt: "Target the input field whose name attribute contains the word 'user'.",
        targetSelector: "input[name*='user']",
        type: "Attribute Selector (Substring Match)",
        alternatives: [
        ],
        trivia: "The `*=` operator is the 'contains' attribute selector, which looks for the specified substring anywhere within the attribute's value. This is powerful when dealing with dynamic or auto-generated attributes.",
        html: `
            <input type="text" name="data-email" placeholder="Email">
            <input type="text" name="data-username" placeholder="Username">
            <input type="text" name="data-pass" placeholder="Password">
        `
    },
    {
        id: 8,
        prompt: "Target the third item in the list, regardless of its tag name, using :nth-child.",
        targetSelector: "li:nth-child(3)",
        type: "Structural Pseudo-class (:nth-child)",
        alternatives: [
            { selector: "ol li:nth-child(3)", explanation: "More specific by scoping the selection to `li` elements inside an ordered list (`ol`)." },
            { selector: "li:nth-of-type(3)", explanation: "This selects the third `li` element. It works here, but is a different selector." }
        ],
        trivia: "`:nth-child(n)` counts elements based on their position among *all* siblings, regardless of tag name.",
        html: `
            <ol>
                <li>First Item</li>
                <li>Second Item</li>
                <li>Third Item</li>
                <li>Fourth Item</li>
            </ol>
        `
    },
    {
        id: 9,
        prompt: "Target the Save button which does not have the class .disabled.",
s       targetSelector: "button:not(.disabled)",
        type: "Negation Pseudo-class (:not)",
        alternatives: [
            { selector: ".btn-save:not(.disabled)", explanation: "This targets any element with the class `.btn-save` that is not disabled." },
            { selector: "button.btn-save:not(.disabled)", explanation: "The most specific option. Combines tag name, class name, and the negation." }
        ],
        trivia: "The Negation Pseudo-class (`:not`) is often called the 'structural pseudo-class.'",
        html: `
            <button class="btn-save disabled">Save (Disabled)</button>
            <button class="btn-save">Save (Enabled)</button>
            <button class="btn-cancel">Cancel</button>
        `
    },
    {
        id: 10,
        prompt: "Target the checkbox that is currently checked.",
s       targetSelector: "input:checked",
        type: "UI State Pseudo-class (:checked)",
        alternatives: [
            { selector: "input[type='checkbox']:checked", explanation: "This adds the attribute selector for `type='checkbox'`, ensuring the selector only applies to checkbox inputs." }
        ],
        trivia: "The UI State Pseudo-class (`:checked`) selects radio buttons or checkboxes that are currently selected.",
        html: `
            <label>
                <input type="checkbox"> Unchecked
Note         </label>
            <label>
                <input type="checkbox" checked> Checked
            </label>
        `
    },
];

// --- CORE STATE MANAGEMENT & INITIALIZATION (All functions follow) ---

function initializeChallenges() {
    const container = document.getElementById('all-challenges');
    if (!container) return;

    let htmlContent = '';

    challengeDefinitions.forEach(def => {
        challengeStates[def.id] = {
            id: def.id,
            attempts: 0,
            isSolved: false,
            isRevealed: false,
            correctTarget: def.targetSelector,
            baseHTML: def.html,
            currentHTML: def.html,
            successfulSelectors: [],
            originalPrompt: def.prompt,
            type: def.type
        };

        htmlContent += `
            <div id="challenge-${def.id}" class="challenge-container">
                <h3 id="challenge-title-${def.id}">Challenge ${def.id}</h3>
                <span id="status-${def.id}" style="color: grey;">(Unsolved)</span>
s             <p id="prompt-${def.id}">${def.prompt}</p>
                
                <div id="target-area-${def.id}" class="challenge-target-area">
s                 ${def.html}
                </div>
                
                <div class="challenge-ui">
                    <input type="text" id="selector-input-${def.id}" placeholder="Enter your selector here..." data-id="${def.id}">
                    <button class="cta-button" onclick="validateChallenge(${def.id})">Validate</button>
                </div>
                <div id="feedback-${def.id}" class="validation-feedback"></div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}


function applyHighlighting(challengeId) {
    const targetArea = document.getElementById(`target-area-${challengeId}`);
    if (!targetArea) return;
    try {
        targetArea.querySelectorAll('.target-highlight').forEach(el => el.classList.remove('target-highlight'));
SESSION   } catch (e) {
        console.error(`Error cleaning up highlights for challenge ${challengeId}: ${e.message}`);
    }
}

function toggleAccordion(button) {
    button.classList.toggle("active-accordion");
    let panel = button.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + 100 + "px";
    } 
}

function validateChallenge(challengeId) {
    const state = challengeStates[challengeId];
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const userInput = inputField.value.trim();
    const challengeType = state.type; 

    feedbackElement.className = 'validation-feedback';

    if (userInput === '') {
        feedbackElement.textContent = 'Please enter a selector to validate.';
        feedbackElement.classList.add('error');
        return;
    }

    // --- 1. STRICT VALIDATION LOGIC ---
    let strictCheckPassed = true;
    let strictFailMessage = "";

    if (challengeType === "ID Selector" && !userInput.includes('#') && !userInput.includes('[id')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. For this challenge, you must use an <b>ID selector</b> (which starts with a <b>#</b>).";
    } else if (challengeType === "Class Selector" && !userInput.includes('.') && !userInput.includes('[class')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. For this challenge, you must use a <b>Class selector</b> (which starts with a <b>.</b>).";
    } else if (challengeType === "Descendant Combinator" && !userInput.includes(' ')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires a <b>Descendant Combinator</b> (a <b>space</b>).";
    } else if (challengeType === "Child Combinator" && !userInput.includes('>')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires a <b>Child Combinator</b> (the <b>&gt;</b> symbol).";
    } else if (challengeType === "Adjacent Sibling Combinator" && !userInput.includes('+')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires an <b>Adjacent Sibling Combinator</b> (the <b>+</b> symbol).";
SESSION   } else if (challengeType === "General Sibling Combinator" && !userInput.includes('~')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires a <b>General Sibling Combinator</b> (the <b>~</b> symbol).";
    } else if (challengeType.includes("Attribute") && !challengeType.includes("Substring Match") && !userInput.includes('[')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires an <b>Attribute selector</b> (e.g., <b>[attribute=value]</b>).";
    } else if (challengeType.includes("Pseudo") && !userInput.includes(':')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires a <b>Pseudo-class selector</b> (e.g., <b>:checked</b>).";
    }

    if (!strictCheckPassed) {
        feedbackElement.innerHTML = strictFailMessage;
        feedbackElement.classList.add('error');
        return; 
    }
    // --- END OF STRICT VALIDATION ---

    try {
        const targetArea = document.getElementById(`target-area-${challengeId}`);
        const correctTarget = targetArea.querySelector(state.correctTarget);

        if (!correctTarget) {
            feedbackElement.textContent = 'Internal Error: Target element missing.';
            feedbackElement.classList.add('error');
            return;
        }
        
        const selectedElements = targetArea.querySelectorAll(userInput);
        const isCorrect = selectedElements.length === 1 && selectedElements[0] === correctTarget;

        // Check for the special case in Challenge 7
        if (challengeId === 7 && isCorrect && !userInput.includes('*=')) {
            // The answer is technically right, but not the lesson.
            // Block them, but don't count it as a failure.
            feedbackElement.innerHTML = `
                That's a valid selector and it works! 
                <br><br>
                However, this challenge is about the <b>Substring Match ("contains")</b> operator.nbsp;
                <br>
                Try again using the <code>*=</code> symbol to match the prompt's hint.
            `;
            feedbackElement.className = 'validation-feedback info'; // Use 'info' blue
            return; // Exit without failing or succeeding
        }

        if (isCorrect) {
            handleSuccess(challengeId, userInput);
        } else {
            handleFailure(challengeId, userInput, selectedElements, correctTarget);
      . }

    } catch (e) {
        const isAttributeEqualsClass = userInput.includes('[class=');
        if (isAttributeEqualsClass) {
            feedbackElement.innerHTML = `
                ❌ Syntax Error (Specific): Your selector <code>${userInput}</code> is failing. 
                <br><strong>The Attribute Equals Selector ([attr="value"]) requires an EXACT match.</strong> 
                <br>Try the <b>Class Selector (.)</b> or the <b>Attribute Contains Selector ([attr~="value"])</b> instead.
            `;
            feedbackElement.classList.add('error');
        } else {
             feedbackElement.textContent = `🚫 Syntax Error: "${userInput}" is not a valid CSS selector.`;
             feedbackElement.classList.add('error');
        }
    }
}

function handleSuccess(challengeId, correctSelector) {
    const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const statusElement = document.getElementById(`status-${challengeId}`);
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    
    const normalizedSelector = correctSelector.toLowerCase().trim().replace(/\s+/g, ' ');
    const isNewSuccess = !state.successfulSelectors.includes(normalizedSelector);

    if (isNewSuccess) {
        state.successfulSelectors.push(normalizedSelector);
    }
    
    if (!state.isSolved) {
D       statusElement.textContent = "(SOLVED!)";
        statusElement.style.color = 'var(--wf-text-success)'; 
    }

    state.isSolved = true;
    let allAlternatives = [...challengeDef.alternatives];
    
    state.successfulSelectors.forEach(sel => {
        if (!allAlternatives.some(alt => alt.selector.toLowerCase().trim() === sel) && sel !== normalizedSelector) {
            allAlternatives.push({ selector: sel, explanation: "You found this alternative! It works because it selects the specific target element with precision." });
        }
    });

    const alternativesHtml = allAlternatives
        .filter(alt => alt.selector.toLowerCase().trim() !== normalizedSelector)
        .map((alt, index) => `
            <button class="accordion" onclick="toggleAccordion(this)">
                Alternative ${index + 1}: <code>${alt.selector}</code>
            </button>
            <div class="panel">
                <div class="panel-content">
                    <p><strong>How it works:</strong> ${alt.explanation}</p>
                </div>
            </div>
        `).join('');

    feedbackElement.classList.add('success');
    
    feedbackElement.innerHTML = `
        🎉 <b>PERFECT!</b> You successfully targeted the element with <code>${correctSelector}</code>.
        <br><br>
        <strong>Lesson Learned: ${challengeDef.type}</strong> 💡
        <div class="hint-message">${challengeDef.trivia}</div>
        <p>Explore other ways to solve this challenge:</p>
        ${alternativesHtml}
    `;
    
    state.attempts = 0;
}

function handleFailure(challengeId, userInput, selectedElements, correctTarget) {
    const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const challengeType = state.type; 
    state.attempts++;

    let message = '';
    feedbackElement.classList.add('error');
    
    if (state.attempts === 1) {
        // First failure: Just state the problem
        let nudge;
        if (selectedElements.length === 0) {
            nudge = `Incorrect. Your selector selected <b>no elements</b>. Check for typos.`;
        } else if (Array.from(selectedElements).includes(correctTarget)) {
            nudge = `Close! Your selector selected <b>${selectedElements.length} elements</b>, including the target. Try to be more specific.`;
        } else {
            nudge = `Incorrect. Your selector selected <b>${selectedElements.length} element(s)</b>, but the target was not among them.`;
        }
        message = `${nudge}`;
    } 
    else if (state.attempts === 2) {
    t   // Second failure: Simple, non-specific hint
        message = `Still incorrect. 
            <br><div class="hint-message info">💡 <b>Hint:</b> Check your spelling and syntax carefully. Remember, <code>#</code> is for IDs and <code>.</code> is for classes.</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
    else if (state.attempts === 3) {
        // Third failure: Now we give the challenge type
s       message = `Still incorrect. 
            <br><div class="hint-message info">🚨 <b>Hint:</b> This challenge requires a <b>${challengeType}</b>.</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
    else if (state.attempts === 4) {
        // Fourth failure: Deep dive hint (the operator)
        let operatorHint = '';
        if (challengeType.includes('ID Selector')) operatorHint = 'Use the <b>#</b> symbol followed by the ID name.';
        else if (challengeType.includes('Class Selector')) operatorHint = 'Use the <b>.</b> symbol followed by the class name.';
        else if (challengeType.includes('Descendant')) operatorHint = 'Use a <b>space</b> between selectors.';
        else if (challengeType.includes('Child')) operatorHint = 'Use the <b>&gt;</b> operator.';
Example       else if (challengeType.includes('Adjacent')) operatorHint = 'Use the <b>+</b> symbol.';
        else if (challengeType.includes('General')) operatorHint = 'Use the <b>~</b> operator.';
        else if (challengeType.includes('Substring Match')) operatorHint = 'Use the "contains" operator: <b>*=</b>';
        else if (challengeType.includes('Attribute')) operatorHint = 'Use brackets <b>[ ]</b>.';
        else if (challengeType.includes('Pseudo')) operatorHint = 'Use the colon <b>:</b> followed by the selector name.';
        
        message = `Still incorrect. 
            <br><div class="hint-message info">🧠 <b>Deep Dive Hint:</b> ${operatorHint}</div>`;
Note       feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    }
    else if (state.attempts >= 5 && !state.isRevealed) {
        // Fifth failure: Offer the reveal button
        message = `🛑 <b>5 Failed Attempts.</b> Would you like to reveal the solution and try a new, related challenge?
s           <br><button class="reveal-button" onclick="revealSolution(${challengeId})">Yes, Reveal Solution & Try New Challenge</button>`;
        feedbackElement.classList.remove('info');
        feedbackElement.classList.add('error');
    }
    
    feedbackElement.innerHTML = message;
}

function revealSolution(challengeId) {
D   const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    const statusElement = document.getElementById(`status-${challengeId}`);

    state.isRevealed = true;
    statusElement.textContent = "(Solution Revealed)";
    inputField.value = state.correctTarget;
  Failure 
    feedbackElement.classList.remove('error', 'info');
    feedbackElement.classList.add('success');
    feedbackElement.innerHTML = `
        ✅ <b>Solution Revealed:</b> The correct selector was <code>${state.correctTarget}</code>.
        <br>
        <p style="margin-top: 10px;">Please study the solution, then click the button below to try a new challenge of the same type.</p>
Remember         <button class="accordion" style="background-color: #007bff; color: white; margin-right: 5px;" onclick="resetChallenge(${challengeId})">🔄 Try New ${challengeDef.type} Challenge</button>
    `;
}

function resetChallenge(challengeId) {
    const state = challengeStates[challengeId];
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    const targetArea = document.getElementById(`target-area-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
  This const statusElement = document.getElementById(`status-${challengeId}`);
    const promptElement = document.getElementById(`prompt-${challengeId}`);
    
    const { html: newHtml, newTargetSelector: newTarget, newPrompt: updatedPrompt } = generateNewChallengeHTML(challengeDef);
    
    state.correctTarget = newTarget;
    state.attempts = 0;
    state.isRevealed = false;
    state.isSolved = false;
    state.successfulSelectors = [];
    
    targetArea.innerHTML = newHtml;
    inputField.value = '';
    inputField.disabled = false;
Note     inputField.nextElementSibling.disabled = false;
    feedbackElement.className = 'validation-feedback';
    
    promptElement.textContent = updatedPrompt; 
    feedbackElement.innerHTML = `🌟 <b>New Challenge!</b> Apply the <b>${challengeDef.type}</b> logic to this new structure.`;
    feedbackElement.classList.add('info'); 
    
    statusElement.textContent = "(Unsolved)";
    statusElement.style.color = 'grey';
}
