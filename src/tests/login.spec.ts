import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Login Page", () => {
  test.describe("TS_SD_001: Verify successful login with valid credentials", () => {
    test("TC_SD_login_001: Enter valid username & valid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user", "secret_sauce");

      await expect(page).toHaveURL(/.*inventory.html/);
    });
  });

  test.describe("TS_SD_002: Verify login fails with invalid credentials", () => {
    test("TC_SD_login_002: Enter invalid username & valid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user12", "secret_sauce");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Username and password do not match"
      );
    });

    test("TC_SD_login_003: Enter valid username & invalid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user", "1234");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Username and password do not match"
      );
    });

    test("TC_SD_login_004: Enter invalid username & invalid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user12", "1234");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Username and password do not match"
      );
    });
  });

  test.describe("TS_SD_003: Verify login fails with invalid credentials", () => {
    test("TC_SD_login_005: Enter valid username & leave password empty", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("standard_user", "");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Password is required"
      );
    });

    test("TC_SD_login_006: Leave username empty & Enter valid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("", "secret_sauce");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Username is required"
      );
    });

    test("TC_SD_login_007: Leave both username & password empty", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("", "");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        "Username is required"
      );
    });
  });

  test.describe("TS_SD_004: Verify login with locked out user", () => {
    test("TC_SD_login_008: Enter locked out username & valid password", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login("locked_out_user", "secret_sauce");

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText("locked out");
    });
  });

});
