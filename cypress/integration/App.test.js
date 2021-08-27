const ENDPOINT = Cypress.env('ENDPOINT') || 'http://127.0.0.1:3000';

describe('App', () => {
  it('shows current water levels', () => {
    cy.visit(`${ENDPOINT}/`);

    cy.getByCy('current-level-1').should('have.text', '375 cm');
    cy.getByCy('current-level-2').should('have.text', '370 cm');
  });
});
