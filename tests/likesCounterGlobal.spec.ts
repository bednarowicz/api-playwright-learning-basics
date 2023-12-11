import test, { expect } from "@playwright/test";

test('Like counter', async ({page}) => {
    //due to cors .auth method is not proper ; it is not possible to log in using the same slug which was used for api calls
    await page.goto('https://angular.realworld.io/');
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: "Email"}).fill("raf@com.pl")
    await page.getByRole('textbox', { name: "Password"}).fill("1111")
    await page.getByRole('button').click()


    await page.getByText('Global Feed').click()
    const firstLikeButton = await page.locator('app-article-preview').first().locator('button')

    await expect(firstLikeButton).toContainText('0')
    await firstLikeButton.click()
    await expect(firstLikeButton).toContainText('1')
}
)