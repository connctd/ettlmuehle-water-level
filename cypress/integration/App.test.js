const ENDPOINT = Cypress.env('ENDPOINT') || 'http://127.0.0.1:3000';

describe('App', () => {
  describe('Current Status', () => {
    it('shows normal status properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_normal.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-status').should('have.text', 'Wasserstände befinden sich im normalen Bereich');
    });

    it('shows lowest status properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_lowest.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-status').should('have.text', 'Akuter Wassermangel: Beide Messstellen');
    });

    it('shows low status properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_low.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-status').should('have.text', 'Geringer Pegel: Messstelle 1');
    });

    it('shows high status properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_high.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-status').should('have.text', 'Hoher Pegel: Messstelle 2');
    });

    it('shows highest status properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_highest.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-status').should('have.text', 'Hochwasser: Beide Messstellen');
    });

    it('shows error message when request failed', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ statusCode: 500 });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 500);

      cy.getByCy('error-message-current').should(
        'have.text',
        'Die aktuellen Wasserstände konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
      );
    });
  });

  describe('Current Levels', () => {
    it('shows current water levels properly', () => {
      cy.intercept('GET', '/api/currentValues', (req) => {
        req.reply({ fixture: '../fixtures/currentValues_normal.json' });
      }).as('currentValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@currentValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('current-level-1').should('have.text', '44.8 cm');
      cy.getByCy('current-level-2').should('have.text', '44.9 cm');
    });
  });

  describe('Quarterly Levels', () => {
    it('shows quarter-hourly water levels properly', () => {
      cy.intercept('GET', '/api/quarterly*', (req) => {
        req.reply({ fixture: '../fixtures/quarterlyValues.json' });
      }).as('quarterlyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@quarterlyValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('quarterHourly-table-row-1').should('includes.text', '03.09.2021 - 22:15');
      cy.getByCy('quarterHourly-table-row-1').should('includes.text', '36.8 cm');
      cy.getByCy('quarterHourly-table-row-1').should('includes.text', '37.1 cm');
    });

    it('shows error message when request failed', () => {
      cy.intercept('GET', '/api/quarterly*', (req) => {
        req.reply({ statusCode: 500 });
      }).as('quarterlyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@quarterlyValues').its('response.statusCode').should('eq', 500);

      cy.getByCy('error-message-quarterly').should(
        'have.text',
        'Die viertelstündlichen Wasserstände konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
      );
    });
  });

  describe('Weekly Levels', () => {
    it('shows weekly average water levels properly', () => {
      cy.intercept('GET', '/api/weeks*', (req) => {
        req.reply({ fixture: '../fixtures/weeklyValues.json' });
      }).as('weeklyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@weeklyValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('weekly-table-row-1').should('includes.text', '10.09.21 - 17.09.21');
      cy.getByCy('weekly-table-row-1').should('includes.text', '44.7 cm');
      cy.getByCy('weekly-table-row-1').should('includes.text', '44.7 cm');
    });

    it('shows error message when request failed', () => {
      cy.intercept('GET', '/api/weeks*', (req) => {
        req.reply({ statusCode: 500 });
      }).as('weeklyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@weeklyValues').its('response.statusCode').should('eq', 500);

      cy.getByCy('error-message-weekly').should(
        'have.text',
        'Die wöchentlichen Wasserstände konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
      );
    });
  });

  describe('Monthly Levels', () => {
    it('shows monthly average water levels properly', () => {
      cy.intercept('GET', '/api/month*', (req) => {
        req.reply({ fixture: '../fixtures/monthlyValues.json' });
      }).as('monthlyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@monthlyValues').its('response.statusCode').should('eq', 200);

      cy.getByCy('monthly-table-row-1').should('includes.text', '09.2021');
      cy.getByCy('monthly-table-row-1').should('includes.text', '39.4 cm');
      cy.getByCy('monthly-table-row-1').should('includes.text', '39.4 cm');
    });

    it('shows error message when request failed', () => {
      cy.intercept('GET', '/api/month*', (req) => {
        req.reply({ statusCode: 500 });
      }).as('monthlyValues');

      cy.visit(`${ENDPOINT}/`);

      cy.wait('@monthlyValues').its('response.statusCode').should('eq', 500);

      cy.getByCy('error-message-monthly').should(
        'have.text',
        'Die monatlichen Wasserstände konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
      );
    });
  });
});
