# E2E Testing with Playwright

This directory contains end-to-end tests for the Fire Inspection App using [Playwright](https://playwright.dev/).

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

2. **Install browser binaries (if needed):**
   ```bash
   npx playwright install chromium firefox webkit
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test smoke.spec.js
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

- `smoke.spec.js` - Basic smoke tests covering critical user flows
  - Login page loads correctly
  - Form validation works
  - Service worker is registered
  - Mobile responsiveness

## Writing Tests

### Basic test template:
```javascript
const { test, expect } = require('@playwright/test');

test('should do something', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('selector')).toBeVisible();
});
```

### Key Playwright commands:
- `page.goto(url)` - Navigate to URL
- `page.click(selector)` - Click element
- `page.fill(selector, text)` - Fill input
- `expect(locator).toBeVisible()` - Assert element visible
- `page.waitForLoadState('networkidle')` - Wait for network

## Test Configuration

Tests are configured in `playwright.config.js`. Key settings:
- **Base URL**: `http://localhost:8080`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Dev Server**: Automatically starts Python HTTP server
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Traces**: Captured on first retry

## CI/CD Integration

To run tests in CI:
```bash
CI=true npm test
```

This will:
- Run tests in parallel with 1 worker
- Fail if `test.only` is found
- Retry failed tests up to 2 times
- Generate HTML report

## Future Test Coverage

Planned test scenarios:
- [ ] User authentication flow
- [ ] Building CRUD operations
- [ ] Inspection checklist toggling (4-state)
- [ ] Building copy functionality
- [ ] PDF export
- [ ] Cloud sync
- [ ] Multi-user collaboration
- [ ] Offline mode (PWA)
- [ ] Dark mode toggle

## Troubleshooting

### Tests fail to start
- Ensure port 8080 is not in use
- Check that Python 3 is installed
- Verify all dependencies are installed

### Service worker tests fail
- Service workers require HTTPS or localhost
- Clear browser cache between runs

### Mobile tests fail
- Ensure mobile browser binaries are installed
- Check viewport configuration

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
