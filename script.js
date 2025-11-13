// =========================================================================
// === JAVASCRIPT MASTER LOADER ===
// This function ensures ALL code runs after the HTML structure is loaded.
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {

    // --- VANILLA JAVASCRIPT CODE (CSS Selector Lab) ---
    // This checks if the #all-challenges div exists on the current page.
    if (document.getElementById('all-challenges')) {
        initializeChallenges();
    }
});


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
    
    // Simple structure changes for different types
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
            <div class="data-item new-target">Item B (Target)</div>
            <div class="data-item">Item C</div>
        `;
        newTargetSelector = ".new-target";
        newPrompt = "Target the element labeled 'Item B (Target)' using its class selector.";
    } else if (def.type.includes('Descendant Combinator')) {
        html = `
            <div id="project-list">
                <p>File A</p>
                <div class="folder">
                    <p class="new-target">File B (Target)</p>
                </div>
            </div>
        `;
        newTargetSelector = "#project-list p.new-target";
        newPrompt = "Target the element with the class `.new-target` that is a descendant of the `#project-list` div.";
    } else if (def.type.includes('Child Combinator')) {
        html = `
            <ul class="nav-menu">
                <li>Link 1</li>
                <li><span>Link 2 (Not Target)</span></li>
                <li class="new-target">Link 3 (Target)</li>
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
        // Fallback for others - simple structure swap
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
        // ❗ FIX: Removed the border and padding style from the div
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
        targetSelector: ".card-header > h2",
        type: "Child Combinator",
        alternatives: [
            { selector: ".card-header>h2", explanation: "Whitespace around the '>' operator is optional." },
            { selector: ".card > .card-header > h2", explanation: "This chains multiple Child Combinators, ensuring a rigid structure." }
        ],
        trivia: "The Child Combinator (`>`) ensures the relationship is direct (one level deep).",
        // ❗ FIX: Removed the border and padding style from the div
        html: `
            <div class="card">
                <div class="card-header">
                    <h2>Card Title</h2>
                    <h2>Nested Title (Not Target)</h2>
                </div>
                <p>Card Body</p>
            </div>
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
                <li class="list-item first-element">First Item</li>
                <li class="list-item second-element">Second Item</li>
                <li class="list-item">Third Item</li>
            </ul>
        `
    },
    {
        id: 6,
        prompt: "Target the Comments button given in the area below, which appears somewhere after the h3 element.",
        targetSelector: "h3 ~ .challenge-action-buttons .comments", // This is the correct selector for your HTML
        type: "General Sibling Combinator",
        alternatives: [
            { selector: "h3 ~ div .comments", explanation: "A slightly less specific, but still correct, alternative." },
            { selector: ".like ~ .comments", explanation: "This is also correct! It targets the .comments button as a sibling of the .like button." }
        ],
        trivia: "The General Sibling Combinator (`~`) selects all siblings that follow, not just the immediate one.",
        html: `
            <h3>Post Title</h3>
            <p>Post content...</p>
            <div class="challenge-action-buttons"> 
                <button class="like">Like</button>
                <button class="comments">Comments</button>
            </div>
        `
    },
    {
        id: 7,
        prompt: "Target the input field whose name attribute contains the word 'user'.",
        targetSelector: "input[name*='user']",
        type: "Attribute Selector (Substring Match)",
        alternatives: [
            { selector: "input[name~='data-username']", explanation: "Uses the tilde operator (`~=`), which matches a whole word in a space-separated list. This would fail." }
        ],
        trivia: "The `*=` operator is the 'contains' attribute selector, looking for the substring anywhere in the value.",
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
        targetSelector: "button:not(.disabled)",
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
        targetSelector: "input:checked",
        type: "UI State Pseudo-class (:checked)",
        alternatives: [
            { selector: "input[type='checkbox']:checked", explanation: "This adds the attribute selector for `type='checkbox'`, ensuring the selector only applies to checkbox inputs." }
        ],
        trivia: "The UI State Pseudo-class (`:checked`) selects radio buttons or checkboxes that are currently selected.",
        html: `
            <label>
                <input type="checkbox"> Unchecked
            </label>
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
            type: def.type,
            // ❗ We no longer need the isComplex flag
        };

        htmlContent += `
            <div id="challenge-${def.id}" class="challenge-container">
                <div class="challenge-header">
                    <h3 id="challenge-title-${def.id}">Challenge ${def.id}</h3>
                    <span id="status-${def.id}" style="color: grey;">(Unsolved)</span>
                </div>
                <p id="prompt-${def.id}">${def.prompt}</p>
                
                <div id="target-area-${def.id}" class="challenge-target-area">
                    ${def.html}
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
    } catch (e) {
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
    } else if (challengeType === "General Sibling Combinator" && !userInput.includes('~')) {
        strictCheckPassed = false;
        strictFailMessage = "Incorrect. This challenge requires a <b>General Sibling Combinator</b> (the <b>~</b> symbol).";
    } else if (challengeType.includes("Attribute") && !userInput.includes('[')) {
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

        if (isCorrect) {
            handleSuccess(challengeId, userInput);
        } else {
            handleFailure(challengeId, userInput, selectedElements, correctTarget);
        }

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
        statusElement.textContent = "(SOLVED!)";
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
        let nudge;
        if (selectedElements.length === 0) {
            nudge = `Incorrect. Your selector selected <b>no elements</b>. Check your basic syntax (e.g., did you miss a '.' or '#')?`;
        } else if (Array.from(selectedElements).includes(correctTarget)) {
            nudge = `Close! Your selector selected <b>${selectedElements.length} elements</b>, including the target. Try to be more specific.`;
        } else {
            nudge = `Incorrect. Your selector selected <b>${selectedElements.length} element(s)</b>, but the target was not among them.`;
        }
        message = `${nudge}`;
    } 
    else if (state.attempts === 2) {
        message = `Still incorrect. 
            <br><div class="hint-message info">🚨 <b>Hint 2:</b> The type of selector you need is a <b>${challengeType}</b>.</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
    else if (state.attempts >= 5 && !state.isRevealed) {
        message = `🛑 <b>5 Failed Attempts.</b> Would you like to reveal the solution and try a new, related challenge?
            <br><button class="reveal-button" onclick="revealSolution(${challengeId})">Yes, Reveal Solution & Try New Challenge</button>`;
        feedbackElement.classList.remove('info');
        feedbackElement.classList.add('error');
    }
    else {
        // Fallback for attempts 3, 4, etc.
        message = `Still incorrect. 
            <br><div class="hint-message info"><b>Hint:</b> The type of selector you need is a <b>${challengeType}</b>.</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    }
    
    feedbackElement.innerHTML = message;
}

function revealSolution(challengeId) {
    const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    const statusElement = document.getElementById(`status-${challengeId}`);

    state.isRevealed = true;
    statusElement.textContent = "(Solution Revealed)";
    inputField.value = state.correctTarget;
    
    feedbackElement.classList.remove('error', 'info');
    feedbackElement.classList.add('success');
    feedbackElement.innerHTML = `
        ✅ <b>Solution Revealed:</b> The correct selector was <code>${state.correctTarget}</code>.
        <br>
        <p style="margin-top: 10px;">Please study the solution, then click the button below to try a new challenge of the same type.</p>
        <button class="accordion" style="background-color: #007bff; color: white; margin-right: 5px;" onclick="resetChallenge(${challengeId})">🔄 Try New ${challengeDef.type} Challenge</button>
    `;
}

function resetChallenge(challengeId) {
    const state = challengeStates[challengeId];
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    const targetArea = document.getElementById(`target-area-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const statusElement = document.getElementById(`status-${challengeId}`);
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
    inputField.nextElementSibling.disabled = false;
    feedbackElement.className = 'validation-feedback';
    
    promptElement.textContent = updatedPrompt; 
    feedbackElement.innerHTML = `🌟 <b>New Challenge!</b> Apply the <b>${challengeDef.type}</b> logic to this new structure.`;
    feedbackElement.classList.add('info'); 
    
    statusElement.textContent = "(Unsolved)";
    statusElement.style.color = 'grey';
}
