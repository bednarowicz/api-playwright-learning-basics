import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'
//raf
//raf@com.pl
//1111
test.beforeEach('log to site', async ({page}) => {
 

  await page.goto('https://angular.realworld.how/')
  // await page.getByText('Sign in').click()
  // await page.getByRole('textbox', { name: "Email"}).fill("raf@com.pl")
  // await page.getByRole('textbox', { name: "Password"}).fill("1111")
  // await page.getByRole('button').click()
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
  // const response = await request.post('https://api.realworld.io/api/users/login', {
  //   data: {
  //     'user': {email: "raf@com.pl", password: "1111"}
  //   }
  // })
  // const responseBody = await response.json()
  // const accessToken = responseBody.user.token
  // console.log(responseBody)
  // console.log(responseBody.user.token)

  const articleResponse = await request.post('https://api.realworld.io/api/articles/', {
    data: {
      article : {title: "test6", description: "tset", body: "test", tagList: ["test"]}
    }//,
    // headers : {
    //   Authorization: `Token ${accessToken}`
    //}
  })
  expect(articleResponse.status()).toEqual(201)
  await page.getByText('Global Feed').click()
  await page.getByText('test6').click()
  await page.getByRole('button', { name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('test6')

})

test("create article", async ({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: "Article Title"}).fill("Testing in playwright title4")
  await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('Playwright is awesome')
  await page.getByRole('textbox', {name: "Write your article (in markdown)"}).fill("Some text inside article \n bla bla bla")

  await page.getByRole('button').click()
  const articleResponse = await page.waitForResponse('https://api.realworld.io/api/articles/')
 const articleResponseBody = await articleResponse.json() 
 const slugId = articleResponseBody.article.slug


 await expect(page.locator('app-article-page h1')).toContainText("Testing in playwright title4")
  await page.getByText('Home').first().click()
  await page.getByText('Global Feed').click()

  //await expect(page.locator('app-article-list h1').first()).not.toContainText("Testing in playwright title")

  // const response = await request.post('https://api.realworld.io/api/users/login', {
  //   data: {
  //     'user': {email: "raf@com.pl", password: "1111"}
  //   }
  // })
  // const responseBody = await response.json()
  // const accessToken = responseBody.user.token

  const deleteArticleResponse = await request.delete(`https://api.realworld.io/api/articles/${slugId}`, {
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })
  expect(deleteArticleResponse.status()).toEqual(204)
  page.reload()
  await expect(page.locator('app-article-list h1').first()).not.toContainText("Testing in playwright title4")
})