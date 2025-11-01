// =========================================================================
// === JAVASCRIPT MASTER LOADER ===
// This function ensures ALL code runs after the HTML structure is loaded.
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {

    // --- VANILLA JAVASCRIPT CODE (CSS Selector Lab) ---
    // This checks if the #all-challenges div exists on the current page.
    // It will only run on css-selectors.html.
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
            { selector: "button#login-primary", explanation: "This uses the tag name and the ID. Since IDs are already unique, adding the tag name is redundant but valid. It increases specificity unnecessarily, which is often avoided in production." }
        ],
        trivia: "The ID selector is the most powerful in terms of specificity (100 points). It should be used sparingly for major, unique page elements.",
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
            { selector: "li.task-urgent", explanation: "This is a great technique: combining the tag name (li) with the class. It increases specificity slightly and clearly scopes the selection to only list items, improving readability." },
            { selector: ".task-urgent.list-item", explanation: "This chains two class selectors together. This is useful if you want to ensure an element has *both* classes. It also increases specificity (20 points) which can be helpful if you need to override other styles." }
        ],
        trivia: "Class selectors contribute 10 points to specificity. You can chain multiple classes without a space, like `.classA.classB`.",
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
            { selector: "#settings-modal button.btn-save", explanation: "This is highly specific. It combines the ID of the container, the tag name, and the class name. This clearly states that the selector should target a button with the class `.btn-save` inside the ID `#settings-modal`." },
            { selector: "div#settings-modal button.btn-save", explanation: "This is the most explicit form, using the tag name for the container (div) as well as its ID. It makes the selector very rigid but ensures zero ambiguity." }
        ],
        trivia: "A single space is the Descendant Combinator. It selects elements nested at *any* depth, making it the most flexible but potentially the least performant of the combinators.",
        html: `
            <div id="settings-modal" style="padding: 10px; border: 1px solid #ccc;">
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
            { selector: ".card-header>h2", explanation: "This is identical to the primary answer; whitespace around the '>' operator is optional and doesn't affect selection, though many prefer spaces for readability." },
            { selector: ".card > .card-header > h2", explanation: "This chains multiple Child Combinators, ensuring that the selection only occurs if `.card-header` is a direct child of `.card` AND `h2` is a direct child of `.card-header`." }
        ],
        trivia: "The Child Combinator (`>`) ensures the relationship is direct (one level deep). This makes the CSS rule more robust against future changes in nested markup.",
        html: `
            <div class="card" style="border: 1px solid #ccc; padding: 10px;">
                <div class="card-header">
                    <h2>Card Title</h2>
                    <span>
                        <h2>Nested Title (Not Target)</h2>
                    </span>
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
            { selector: "li.first-element + li.list-item", explanation: "A highly specific version. It requires that both the preceding element and the target element are list items (li) and have their respective classes, ensuring precision." }
        ],
        trivia: "The Adjacent Sibling Combinator (`+`) only selects the *one* element that immediately follows the first selector. It's great for applying spacing after a specific element.",
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
        targetSelector: "h3 ~ button.comments",
        type: "General Sibling Combinator",
        alternatives: [
            { selector: "h3 ~ .comments", explanation: "Less specific than the one provided. It selects any element with the class `.comments` that follows an `h3` in the same parent. This is correct but risks selecting a non-button element." },
            { selector: "button.like ~ button.comments", explanation: "This targets the Comments button based on a different preceding sibling, the Like button. It demonstrates the flexibility of the General Sibling Combinator." }
        ],
        trivia: "The General Sibling Combinator (`~`) selects all siblings that follow the first selector. Unlike the Adjacent Sibling (`+`), it can skip over non-matching siblings.",
        html: `
            <button class="share">Share</button>
            <h3>Post Title</h3>
            <p>Post content...</p>
            <button class="like">Like</button>
            <button class="comments">Comments</button>
        `
    },
    {
        id: 7,
        prompt: "Target the input field whose name attribute contains the word 'user'.",
        targetSelector: "input[name*='user']",
        type: "Attribute Selector (Substring Match)",
        alternatives: [
            { selector: "input[name~='data-username']", explanation: "Uses the tilde operator (`~=`), which matches a whole word in a space-separated list of values. This would work if the name value was 'data-username other', but fails on 'data-username' as one contiguous string." }
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
            { selector: "ol li:nth-child(3)", explanation: "More specific by scoping the selection to `li` elements inside an ordered list (`ol`). This is generally safer than using just the pseudo-class alone." },
            { selector: "li:nth-of-type(3)", explanation: "This selects the third item *of its type* (the third `li` element) among its siblings. It works here because all siblings are list items." }
        ],
        trivia: "`:nth-child(n)` counts elements based on their position among *all* siblings, regardless of tag name. It is commonly used for things like zebra-striping rows in a table (`:nth-child(odd)`).",
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
            { selector: ".btn-save:not(.disabled)", explanation: "This targets any element with the class `.btn-save` that is not disabled. This is less specific but often clearer when writing component-based CSS." },
            { selector: "button.btn-save:not(.disabled)", explanation: "The most specific option. Combines tag name, class name, and the negation pseudo-class, clearly defining the exact criteria." }
        ],
        trivia: "The Negation Pseudo-class (`:not`) is often called the 'structural pseudo-class.' It is non-inclusive, meaning styles applied by it cannot be overridden by other styles of the same specificity *if* the negation is the only difference.",
        html: `
            <button class="btn-save disabled">Save (Disabled)</button>
            <button class="btn-save">Save (Enabled)</button>
            <button class="btn-cancel">Cancel</button>
        `
    },
    {
        id: 10,
        prompt: "Target the checkbox that is currently checked.",
is      targetSelector: "input:checked",
        type: "UI State Pseudo-class (:checked)",
        alternatives: [
            { selector: "input[type='checkbox']:checked", explanation: "This adds the attribute selector for `type='checkbox'`, ensuring the selector only applies to checkbox inputs, not radio buttons or other checked inputs." }
        ],
        trivia: "The UI State Pseudo-class (`:checked`) selects radio buttons or checkboxes that are currently selected. You often use the Adjacent Sibling Combinator (`+`) to style a custom label based on the checked state.",
        html: `
            <label>
                <input type="checkbox"> Unchecked
            </label>
            <label>
s              <input type="checkbox" checked> Checked
            </label>
        `
    },
];

// --- CORE STATE MANAGEMENT & INITIALIZATION (All functions follow) ---

function initializeChallenges() {
    // Check if the container element exists on this page
    const container = document.getElementById('all-challenges');
    if (!container) {
        // If #all-challenges doesn't exist, we are not on the css-selectors.html page.
        // Silently exit to avoid errors on index.html or about.html
        return;
    }

    let htmlContent = '';

    challengeDefinitions.forEach(def => {
        challengeStates[def.id] = {
            id: def.id,
Indented        attempts: 0,
            isSolved: false,
            isRevealed: false,
            correctTarget: def.targetSelector,
            baseHTML: def.html,
            currentHTML: def.html,
            successfulSelectors: [],
            originalPrompt: def.prompt
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
                
s              <div class="challenge-ui">
                    <input type="text" id="selector-input-${def.id}" placeholder="Enter your selector here (e.g., .class-name)" data-id="${def.id}">
                    
                    <!-- ❗❗ BUG FIX: Added class="cta-button" to the generated button ❗❗ -->
                    <button class="cta-button" onclick="validateChallenge(${def.id})">Validate</button>
                </div>
                <div id="feedback-${def.id}" class="validation-feedback"></div>
            </div>
        `;
    });

    // Replace the container's content with the dynamically generated challenges
    container.innerHTML = htmlContent;
    // No longer need to apply highlighting, as it's removed.
    // challengeDefinitions.forEach(def => applyHighlighting(def.id));
}

function applyHighlighting(challengeId) {
    // This function is now only used to clean up highlights during a reset.
    const targetArea = document.getElementById(`target-area-${challengeId}`);
    if (!targetArea) return;

    try {
        // Find any highlights (from the old placeholder HTML) and remove them.
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

    feedbackElement.className = 'validation-feedback';
    // ❗❗ FIX: Show the feedback element when validating ❗❗
    // feedbackElement.style.display = 'block'; 
    // This will be handled by adding a class instead, which is cleaner.

    if (userInput === '') {
        feedbackElement.textContent = 'Please enter a selector to validate.';
        feedbackElement.classList.add('error');
        return;
    }

    try {
        const targetArea = document.getElementById(`target-area-${challengeId}`);
        const correctTarget = targetArea.querySelector(state.correctTarget);

        if (!correctTarget) {
            feedbackElement.textContent = 'Internal Error: Target element missing.';
            feedbackElement.classList.add('error');
            return;
        }
        
        // --- Highlighting logic is removed ---
        
        // Query the DOM using the user's selector
        const selectedElements = targetArea.querySelectorAll(userInput);
        
        const isCorrect = selectedElements.length === 1 && selectedElements[0] === correctTarget;

        if (isCorrect) {
            handleSuccess(challengeId, userInput);
        } else {
            handleFailure(challengeId, userInput, selectedElements, correctTarget);
        }

    } catch (e) {
        // Check for the specific Attribute Equals error that caused the issue
        const isAttributeEqualsClass = userInput.includes('[class=');

        if (isAttributeEqualsClass) {
             // Provide targeted, actionable feedback for the specific mistake
            feedbackElement.innerHTML = `
                ❌ Syntax Error (Specific): Your selector <code>${userInput}</code> is failing.s
                <br>
                <strong>The Attribute Equals Selector ([attr="value"]) requires the class value to be an EXACT match.</strong> 
                <br>Since your target element has multiple classes, the exact match fails. You should use the **Class Selector (.)** or the **Attribute Contains Selector ([attr~="value"] or [attr*="value"])** instead.
s          `;
            feedbackElement.classList.add('error');
        } else {
             feedbackElement.textContent = `🚫 Syntax Error: "${userInput}" is not a valid CSS selector. Check for typos or invalid characters.`;
s            feedbackElement.classList.add('error');
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

  D if (isNewSuccess) {
        state.successfulSelectors.push(normalizedSelector);
    }
    
    if (!state.isSolved) {
        statusElement.textContent = "(SOLVED!)";
        statusElement.style.color = '#155724';
        // Highlighting removal no longer needed
    }

    state.isSolved = true;
    
    let allAlternatives = [...challengeDef.alternatives];
    
    state.successfulSelectors.forEach(sel => {
        if (!allAlternatives.some(alt => alt.selector.toLowerCase().trim() === sel) && sel !== normalizedSelector) {
            allAlternatives.push({ selector: sel, explanation: "You found this alternative! It works because it selects the specific target element with precision." });
s      }
    });

    const alternativesHtml = allAlternatives
        .filter(alt => alt.selector.toLowerCase().trim() !== normalizedSelector)
        .map((alt, index) => `
            <button class="accordion" onclick="toggleAccordion(this)">
                Alternative ${index + 1}: <code>${alt.selector}</code>
            </button>
            <div class="panel">
                <!-- ❗❗ FIX: Added inner panel-content div ❗❗ -->
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
s      <div class="hint-message">${challengeDef.trivia}</div>
        
        <p>Explore other ways to solve this challenge:</p>
        ${alternativesHtml}
    `;
    
    state.attempts = 0;
}

function handleFailure(challengeId, userInput, selectedElements, correctTarget) {
    const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
    state.attempts++;

    let message = '';
    feedbackElement.classList.add('error');
    
    if (state.attempts === 1) {
        let nudge;
        if (selectedElements.length === 0) {
            nudge = `Incorrect. Your selector selected <b>no elements</b>. Check your basic syntax (e.g., did you miss a '.' or '#')?`;
        } else if (Array.from(selectedElements).includes(correctTarget)) {
            nudge = `Close! Your selector selected <b>${selectedElements.length} elements</b>, including the target. Try to be more specific to select *only* the target.`;
        } else {
            nudge = `Incorrect. Your selector selected <b>${selectedElements.length} element(s)</b>, but the target was not among them. Check the attributes of the highlighted element!`;
        }
        message = `${nudge}`;
    } 
    
    else if (state.attempts === 2) {
        message = `Still incorrect.s
            <br><div class="hint-message info">🚨 <b>Hint 2:</b> The type of selector you need to master here is a <b>${challengeDef.type}</b>. Focus your learning on that concept!</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
    
    else if (state.attempts === 3) {
        const hintType = challengeDef.type.includes('Combinator') ? 'Combinator' : challengeDef.type.includes('Pseudo') ? 'Pseudo-class' : 'Attribute Selector';
s      message = `Three strikes. 
            <br><div class="hint-message info">💡 <b>Hint 3:</b> This challenge requires a <b>${hintType}</b>. Look for relationships (parent/sibling) or a specific state (checked/disabled) in the HTML structure.</div>`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
   s
    else if (state.attempts === 4) {
        let operatorHint = '';
        if (challengeDef.type.includes('Descendant')) operatorHint = 'Use a <b>space</b> between selectors.';
        else if (challengeDef.type.includes('Child')) operatorHint = 'Use the <b>&gt;</b> operator.';
        else if (challengeDef.type.includes('Adjacent')) operatorHint = 'Use the <b>+</b> operator.';
        else if (challengeDef.type.includes('General')) operatorHint = 'Use the <b>~</b> operator.';
        else if (challengeDef.type.includes('Attribute')) operatorHint = 'Use brackets <b>[ ]</b> and an operator like <b>[*=]</b>.';
Z      else if (challengeDef.type.includes('Pseudo')) operatorHint = 'Use the colon <b>:</b> followed by the selector name.';
        
        message = `Final attempt nudge. 
          . <br><div class="hint-message info">🧠 <b>Hint 4 (Deep Dive):</b> ${operatorHint}</div>`;
s      feedbackElement.classList.remove('error');
        feedbackElement.classList.add('info');
    } 
    
    else if (state.attempts >= 5 && !state.isRevealed) {
        message = `🛑 <b>5 Failed Attempts.</b> It's time to learn! Would you like to reveal the solution for this specific challenge and then immediately try a new, related challenge to ensure the lesson sticks?
            <br><button class="reveal-button" onclick="revealSolution(${challengeId})">Yes, Reveal Solution & Try New Challenge</button>`;
section       feedbackElement.classList.remove('info');
        feedbackElement.classList.add('error');
    }
    
    feedbackElement.innerHTML = message;
}

function revealSolution(challengeId) {
    const state = challengeStates[challengeId];
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
s    const statusElement = document.getElementById(`status-${challengeId}`);

    state.isRevealed = true;
    statusElement.textContent = "(Solution Revealed)";
    inputField.value = state.correctTarget;
s    
    feedbackElement.classList.remove('error', 'info');
s    feedbackElement.classList.add('success');
    feedbackElement.innerHTML = `
        ✅ <b>Solution Revealed:</b> The correct selector was <code>${state.correctTarget}</code>.
        <br>
        <p style="margin-top: 10px;">Please study the solution, then click the button below to solidify your understanding with a <b>fresh challenge</b> of the same selector type.</p>
G      <button class="accordion" style="background-color: #007bff; color: white; margin-right: 5px;" onclick="resetChallenge(${challengeId})">🔄 Try New ${def.type} Challenge</button>
    `;
    // Highlighting removal no longer needed
}

function resetChallenge(challengeId) {
    const state = challengeStates[challengeId];
    const challengeDef = challengeDefinitions.find(d => d.id === challengeId);
CSS    const targetArea = document.getElementById(`target-area-${challengeId}`);
    const inputField = document.getElementById(`selector-input-${challengeId}`);
    const feedbackElement = document.getElementById(`feedback-${challengeId}`);
s    const statusElement = document.getElementById(`status-${challengeId}`);
    const promptElement = document.getElementById(`prompt-${challengeId}`);
    
  s const { html: newHtml, newTargetSelector: newTarget, newPrompt: updatedPrompt } = generateNewChallengeHTML(challengeDef);
    
    state.correctTarget = newTarget;
    state.attempts = 0;
    state.isRevealed = false;
    state.isSolved = false;
s    state.successfulSelectors = [];
    
    targetArea.innerHTML = newHtml;
    inputField.value = '';
    inputField.disabled = false;
Z   inputField.nextElementSibling.disabled = false;
    feedbackElement.className = 'validation-feedback';
    
    promptElement.textContent = updatedPrompt; 
    
    feedbackElement.innerHTML = `🌟 <b>New Challenge!</b> Apply the <b>${challengeDef.type}</b> logic to this new structure.`;
s    // ❗❗ FIX: This line makes the "New Challenge!" message visible ❗❗
    feedbackElement.classList.add('info');
    
    statusElement.textContent = "(Unsolved)";
    statusElement.style.color = 'grey';

  D // Call applyHighlighting to clean up any old highlights from the previous attempt
    applyHighlighting(challengeId);
}

