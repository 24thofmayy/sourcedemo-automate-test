import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";

test.describe("Inventory Page", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test.describe("TS_SD_007: Verify product list display", () => {
    test("TC_SD_home_001: Verify that all products are displayed", async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });

  test.describe("TS_SD_008: Verify product sorting functionality", () => {
    test("TC_SD_home_002: Sort products by Name (Z to A)", async ({ page }) => {
      await inventoryPage.sortBy("Name (Z to A)");

      const names = await page.locator(".inventory_item_name").allInnerTexts();

      const expectedNames = [...names].sort().reverse();

      expect(names).toEqual(expectedNames);
    });

    test("TC_SD_home_003: Sort products by Price (low to high)", async ({
      page,
    }) => {
      await inventoryPage.sortBy("Price (low to high)");

      const priceTexts = await page
        .locator(".inventory_item_price")
        .allInnerTexts();

      const prices = priceTexts.map((price) =>
        parseFloat(price.replace("$", ""))
      );

      const expectedPrices = [...prices].sort((a, b) => a - b);

      expect(prices).toEqual(expectedPrices);
    });

    test("TC_SD_home_004: Sort products by Price (high to low)", async ({
      page,
    }) => {
      await inventoryPage.sortBy("Price (high to low)");

      const priceTexts = await page
        .locator(".inventory_item_price")
        .allInnerTexts();

      const prices = priceTexts.map((price) =>
        parseFloat(price.replace("$", ""))
      );

      const expectedPrices = [...prices].sort((a, b) => b - a);

      expect(prices).toEqual(expectedPrices);
    });
  });

  test.describe("TS_SD_009: Verify 'Add to cart' functionality", () => {
    test("TC_SD_home_005: Add a product to cart", async ({ page }) => {
      const itemName = "Sauce Labs Backpack";
      await inventoryPage.addItemByName(itemName);
      const itemButton = page
        .locator(".inventory_item")
        .filter({ hasText: itemName })
        .getByRole("button");
      await expect(itemButton).toHaveText("Remove");
      await expect(inventoryPage.shoppingCartBadge).toHaveText("1");
    });
  });

  test.describe("TS_SD_010: Verify 'Remove' functionality", () => {
    test("TC_SD_home_006: Remove a product from cart", async ({ page }) => {
      const itemName = "Sauce Labs Backpack";
      await inventoryPage.addItemByName(itemName);
      await inventoryPage.removeItemByName(itemName);

      const itemButton = page
        .locator(".inventory_item")
        .filter({ hasText: itemName })
        .getByRole("button");
      await expect(itemButton).toHaveText("Add to cart");
      await expect(inventoryPage.shoppingCartBadge).toBeHidden();
    });
  });

  test.describe("TS_SD_011: Verify navigation to product details", () => {
    test("TC_SD_home_007: Click on product name to view details", async ({
      page,
    }) => {
      const targetProduct = "Sauce Labs Backpack";

      await page
        .locator(".inventory_item_name")
        .filter({ hasText: targetProduct })
        .click();

      await expect(page).toHaveURL(/.*inventory-item.html/);

      await expect(page.locator(".inventory_details_name")).toHaveText(
        targetProduct
      );
    });
  });

  test.describe("TS_SD_012: Verify product card content", () => {
    test("TC_SD_home_008: Verify UI elements of random product card", async () => {
      const firstItem = inventoryPage.inventoryItems.first();

      await expect(firstItem.locator(".inventory_item_name")).toBeVisible();
      await expect(firstItem.locator(".inventory_item_desc")).toBeVisible();
      await expect(firstItem.locator(".inventory_item_price")).toBeVisible();
      const img = firstItem.locator("img");
      const width = await img.evaluate(
        (node: HTMLImageElement) => node.naturalWidth
      );
      expect(width).toBeGreaterThan(0);
    });
  });

  test.describe("TS_SD_013: Verify header navigation", () => {
    test("TC_SD_home_010: Verify navigation to Cart page", async ({ page }) => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/.*cart.html/);
    });
  });

  test.describe("TS_SD_014: Verify hamburger menu functionality", () => {
    test("TC_SD_home_011: Verify Logout functionality", async ({ page }) => {
      await inventoryPage.openMenu();
      await inventoryPage.logoutLink.click();
      await expect(page).toHaveURL("https://www.saucedemo.com/");
    });

    test("TC_SD_home_012: Verify About functionality", async ({ page }) => {
      await inventoryPage.openMenu();
      await inventoryPage.aboutLink.click();
      await expect(page).toHaveURL(/.*saucelabs.com.*/);
    });

    test("TC_SD_home_013: Verify Reset App State functionality", async () => {
      await inventoryPage.addItemByName("Sauce Labs Backpack"); 
      await inventoryPage.openMenu();
      await inventoryPage.resetAppStateLink.click();
      await expect(inventoryPage.shoppingCartBadge).toBeHidden(); 
    });
  });

  test("TC_SD_home_014: Verify Footer Social Links (Twitter)", async ({ page }) => {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        inventoryPage.twitterLink.click(), 
      ]);
      await expect(newPage).toHaveURL(/.*twitter.com|.*x.com/);
    });

    test("TC_SD_home_015: Verify Footer Social Links (Facebook)", async ({ page }) => {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        inventoryPage.facebookLink.click(),
      ]);
      await expect(newPage).toHaveURL(/.*facebook.com.*/);
    });

    test("TC_SD_home_016: Verify Footer Social Links (LinkedIn)", async ({ page }) => {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        inventoryPage.linkedinLink.click(),
      ]);
      await expect(newPage).toHaveURL(/.*linkedin.com.*/);
    });
});
