# Cypress E2E Testing

## Setup en Gebruik

### Voorbereidingen

**BELANGRIJK:** Deze tests gebruiken échte authenticatie, geen mocking!

1. **Zorg dat je backend draait** (meestal op poort 3000)
2. **Zorg dat je Next.js app draait** op poort 4444:
   ```bash
   npm run dev
   ```
3. **Zorg dat de test gebruiker bestaat** in je database:
   - Email: `daan@frostup.com`
   - Password: `Test123!`

### Cypress starten

1. **Interactieve modus (aanbevolen voor ontwikkeling):**

   ```bash
   npm run cypress
   ```

2. **Headless modus (voor CI/CD):**

   ```bash
   npm run cypress:headless
   ```

3. **Component tests:**
   ```bash
   npm run cypress:component
   ```

### Herbruikbare Commands

De volgende custom commands zijn beschikbaar:

#### Authenticatie Commands (Echte API calls)

- `cy.visitLogin()` - Navigeert naar de login pagina
- `cy.login(email, password)` - Vult de login form in en klikt op login
- `cy.visitDashboard()` - **Complete echte login flow + navigatie naar dashboard**
- `cy.loginAPI(email, password)` - **Directe API login zonder UI**

#### Voorbeeld gebruik:

```typescript
// UI-based login test
cy.visitLogin();
cy.login("daan@frostup.com", "Test123!");

// Complete dashboard toegang (aanbevolen)
cy.visitDashboard(); // Doet echte login!

// Programmatische API login
cy.loginAPI("daan@frostup.com", "Test123!");
cy.visit("/dashboard");
```

### Echte Authenticatie

Het authenticatie systeem werkt met echte API calls:

1. **Login Process**: Echte POST naar `/api/auth/login`
2. **Token Storage**: Echte JWT token wordt opgeslagen in localStorage
3. **API Calls**: Alle volgende API calls gebruiken echte `Authorization: Bearer <token>` header
4. **401 Handling**: Bij 401 errors wordt automatisch naar `/login` geredirect

### Test Bestanden

- `cypress/e2e/login-e2e.cy.ts` - Echte login functionaliteit tests
- `cypress/e2e/dashboard.cy.ts` - Echte dashboard authenticatie tests
- `cypress/e2e/authenticated-api-example.cy.ts` - Voorbeelden van echte API calls

### Test Data Attributes

De volgende data-testid attributes zijn beschikbaar in de login pagina:

- `email-input` - Email invoerveld
- `password-input` - Wachtwoord invoerveld
- `login-button` - Login knop
- `error-message` - Foutmelding
- `forgot-password-button` - Wachtwoord vergeten knop
- `signup-link` - Registratie link
- `login-form` - Het complete login formulier

### Echte API Testing

```typescript
describe("Mijn API Test", () => {
  beforeEach(() => {
    cy.visitDashboard(); // Echte login
  });

  it("should call real API", () => {
    cy.request("GET", "/api/user/profile").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq("daan@frostup.com");
    });
  });
});
```

### Vereisten voor Tests

#### Backend moet draaien

- De backend API moet toegankelijk zijn
- Database moet de test gebruiker bevatten
- Alle API endpoints moeten functioneel zijn

#### Test Gebruiker

Zorg dat deze gebruiker bestaat in je database:

```json
{
  "email": "daan@frostup.com",
  "password": "Test123!", // (gehashed in database)
  "username": "daanverbeek"
}
```

### Voordelen van Echte Tests

✅ **Integratietests**: Test de complete flow  
✅ **Geen mocking**: Echte API responses  
✅ **Realistisch**: Exacte productie-gedrag  
✅ **Eenvoudiger**: Minder mock setup

### Nadelen

❌ **Backend dependency**: Backend moet draaien  
❌ **Database state**: Vereist test data  
❌ **Langzamer**: Echte network calls

### Troubleshooting

#### "User not found" error

**Probleem**: Test gebruiker bestaat niet  
**Oplossing**: Maak `daan@frostup.com` aan in je database

#### 401 Unauthorized errors

**Probleem**: Token is verlopen of ongeldig  
**Oplossing**: Check token expiry en database gebruiker

#### Connection refused

**Probleem**: Backend niet bereikbaar  
**Oplossing**: Start je backend op poort 3000

### Nieuwe tests toevoegen

1. Maak een nieuw bestand in `cypress/e2e/` met `.cy.ts` extensie
2. Gebruik `cy.visitDashboard()` voor geauthenticeerde tests
3. Maak echte API calls met `cy.request()`
4. Voeg data-testid attributes toe aan nieuwe UI elementen
5. Test zowel positieve als negatieve scenario's
