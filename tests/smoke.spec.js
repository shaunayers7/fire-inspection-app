// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Fire Inspection App - Smoke Tests', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Fire Inspection App/);
    
    // Verify login form is visible
    await expect(page.locator('text=Electric Boyes')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('should show validation error for invalid login', async ({ page }) => {
    await page.goto('/');
    
    // Try to login with invalid credentials
    await page.getByPlaceholder('Email').fill('invalid@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show an error message
    await expect(page.locator('text=/error|invalid|wrong/i')).toBeVisible({ timeout: 5000 });
  });

  test('should toggle between login and signup modes', async ({ page }) => {
    await page.goto('/');
    
    // Click "Create Account" to switch to signup mode
    await page.getByText(/create account/i).click();
    
    // Verify signup form fields are visible
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm Password')).toBeVisible();
    
    // Switch back to login
    await page.getByText(/already have an account/i).click();
    
    // Verify we're back to login mode (no name field)
    await expect(page.getByPlaceholder('Full Name')).not.toBeVisible();
  });

  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if service worker is registered
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    await page.goto('/');
    
    // Verify mobile-friendly layout
    await expect(page.locator('body')).toBeVisible();
    
    // Check that the viewport meta tag is set correctly
    const viewport = await page.evaluate(() => {
      return document.querySelector('meta[name="viewport"]')?.getAttribute('content');
    });
    
    expect(viewport).toContain('user-scalable=no');
  });
});

test.describe('Fire Inspection App - Building Management', () => {
  // These tests would require authentication
  // For now, they're placeholders to guide future test development
  
  test.skip('should create a new building', async ({ page }) => {
    // TODO: Implement after setting up test authentication
    // 1. Login with test credentials
    // 2. Navigate to year view
    // 3. Click "Add Building"
    // 4. Fill in building details
    // 5. Verify building appears in list
  });

  test.skip('should copy building to another year', async ({ page }) => {
    // TODO: Implement after setting up test authentication
    // 1. Login
    // 2. Select a building
    // 3. Click copy button
    // 4. Select target year
    // 5. Verify building copied with N/A status preserved
  });

  test.skip('should export building as PDF', async ({ page }) => {
    // TODO: Implement after setting up test authentication
    // 1. Login
    // 2. Select a building
    // 3. Open building details
    // 4. Click export PDF
    // 5. Verify PDF download started
  });
});
