describe('Factory Management System - End-to-End Flow', () => {
  
  beforeEach(() => {
    cy.visit('/');
  });

  it('should manage lifecycle and production logic with dynamic selects', () => {
    cy.visit('/materials');
    
    // Create Wood (30 units)
    cy.contains('Add Material').click();
    cy.get('input[placeholder*="Aluminum"]').type('Wood');
    cy.get('input[placeholder="0"]').type('30');
    cy.contains('button', 'Save').click();

    // Create Metal (10 units)
    cy.contains('Add Material').click();
    cy.get('input[placeholder*="Aluminum"]').type('Metal');
    cy.get('input[placeholder="0"]').type('10');
    cy.contains('button', 'Save').click();

    // PRODUCT CREATION
    cy.visit('/products');
    cy.contains('Create Product').click();
    cy.get('input[placeholder*="Office Chair"]').type('Premium Chair');
    cy.get('input[placeholder="0.00"]').type('100');

    cy.get('select').contains('option', 'Wood').invoke('text').then((text) => {
      cy.get('select').select(text);
    });
    cy.get('input[placeholder="Qty"]').type('5');
    cy.contains('button', 'Add').click();

    cy.get('select').contains('option', 'Metal').invoke('text').then((text) => {
      cy.get('select').select(text);
    });
    cy.get('input[placeholder="Qty"]').type('2');
    cy.contains('button', 'Add').click();

    cy.contains('button', 'Save Product').click();
    cy.contains('Premium Chair').should('be.visible');

    // DASHBOARD VALIDATION AND PRODUCTION
    cy.visit('/');

    // Check if the suggestion calculated 5 units (limited by Metal).
    cy.contains('5 units').should('be.visible');
    cy.contains('$500.00').should('be.visible');

    // Confirm actual production.
    cy.on('window:confirm', () => true);
    cy.contains('Confirm Production').click();

    // FINAL STOCK CHECK
    cy.visit('/materials');
    
    // Wood must have 5 units (30 - 25).
    cy.contains('tr', 'Wood').should('contain', '5 units');
    // Metal must have 0 units (10 - 10).
    cy.contains('tr', 'Metal').should('contain', '0 units');
  });
});