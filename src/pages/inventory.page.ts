import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly aboutLink: Locator;
  readonly closeMenuButton: Locator;

  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item'); 

    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');

    this.twitterLink = page.locator('a[href*="twitter.com"]');
    this.facebookLink = page.locator('a[href*="facebook.com"]');
    this.linkedinLink = page.locator('a[href*="linkedin.com"]');
  }

  async sortBy(option: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)') {
    await this.sortDropdown.selectOption({ label: option });
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async addItemByName(productName: string) {
    await this.page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeItemByName(productName: string) {
    await this.page.locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async openMenu() {
    await this.burgerMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' }); 
  }
}