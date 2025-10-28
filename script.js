$(document).ready(function() {

    // ----------------------------------------------------
    // --- SELECTORS FOR index.html (Home Page) ---
    // ----------------------------------------------------

    // 1. ID Selector (#): Targets a single, specific element.
    // ACTION: Change the text of the paragraph with the ID 'target-p'.
    $('#target-p').text('--- SUCCESSFULLY CHANGED BY ID SELECTOR (#target-p) ---');


    // 2. Element Selector (p): Targets all elements of a specific tag type.
    // ACTION: Add a class and border to ALL <p> elements on the page.
    $('p').addClass('highlight'); 


    // ----------------------------------------------------
    // --- SELECTORS FOR about.html (About Page) ---
    // ----------------------------------------------------
    
    // 3. Class Selector (.): Targets all elements sharing a specific class.
    // ACTION: Change the background color of all elements with the class 'highlight-me'.
    $('.highlight-me').css('background-color', 'lightgreen');
    
    
    // 4. Attribute Selector ([attr=value]): Targets elements based on a specific attribute value.
    // ACTION: Change the text of the paragraph where the attribute data-status is "pending".
    $('p[data-status="pending"]').text('STATUS UPDATED: Review is IN PROGRESS (Targeted by Attribute)');
    
    // ACTION: Hide the elements where data-status is "complete".
    $('p[data-status="complete"]').hide();


    // ----------------------------------------------------
    // --- TRAVERSING / COMBINATION SELECTOR ---
    // ----------------------------------------------------

    // 5. Hierarchy Selector (Descendant): Targets specific elements nested inside another.
    // ACTION: Find the navigation links inside the header on all pages and give them a font size.
    $('header a').css('font-size', '18px');

});