import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'
//raf
//raf@com.pl
//1111
test.beforeEach('log to site', async ({page}) => {
 

  await page.goto('https://angular.realworld.how/')
  await page.getByText('Sign in').click()
  await page.getByRole('textbox', { name: "Email"}).fill("raf@com.pl")
  await page.getByRole('textbox', { name: "Password"}).fill("1111")
  await page.getByRole('button').click()
})

test('has title', async ({ page }) => {
  await page.route('*/**/api/tags', async route => { // last in path has to be ** rest may be *
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.route('*/**/api/articles?limit=10&offset=0', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = 'This is test title'
    responseBody.articles[0].description = "This is test description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  } )
  await page.goto('https://angular.realworld.how/')
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toHaveText('This is test title');
  await expect(page.locator('app-article-list p').first()).toHaveText('This is test description');
});

test('delete article', async ({page, request}) => {
  const response = await request.post('https://api.realworld.io/api/users/login', {
    data: {
      'user': {email: "raf@com.pl", password: "1111"}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token
  console.log(responseBody)
  console.log(responseBody.user.token)

  const articleResponse = await request.post('https://api.realworld.io/api/articles/', {
    data: {
      article : {title: "test6", description: "tset", body: "test", tagList: ["test"]}
    },
    headers : {
      Authorization: `Token ${accessToken}`
    }
  })
  expect(articleResponse.status()).toEqual(201)
  await page.getByText('Global Feed').click()
  await page.getByText('test6').click()
  await page.getByRole('button', { name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('test6')

})
