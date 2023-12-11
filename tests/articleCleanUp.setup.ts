import { test as setup, expect} from '@playwright/test';

setup('delete article', async ({request}) => {
    const deleteArticleResponse = await request.delete(`https://api.realworld.io/api/articles/${process.env.SLUGID}`, {
        // headers: {
        //   Authorization: `Token ${accessToken}`
        // }
      })
      expect(deleteArticleResponse.status()).toEqual(204)
})