// const { toMatchImageSnapshot } = require("jest-image-snapshot")
const puppeteer = require("puppeteer")

// percy example
const { percySnapshot } = require("@percy/puppeteer")

// expect.extend({ toMatchImageSnapshot })

describe("jest-image-snapshot using an image from puppeteer", () => {
  let browser

  // puppeteer needs to scroooolllll
  const autoScroll = async page => {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0
        let distance = 100
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
  }

  beforeAll(async () => {
    browser = await puppeteer.launch()
  })

  //   test("landing page loads correctly", async () => {
  //     const page = await browser.newPage()
  //     await page.goto("http://localhost:8000")
  //     await autoScroll(page)
  //     const image = await page.screenshot({ fullPage: 1 })

  //     expect(image).toMatchImageSnapshot()
  //   })

  //   test("page-2 loads correctly", async () => {
  //     const page = await browser.newPage()
  //     await page.goto("http://localhost:8000/page-2")
  //     const image = await page.screenshot()

  //     expect(image).toMatchImageSnapshot()
  //   })

  test("landing page loads correctly using percy", async () => {
    const page = await browser.newPage()
    await page.goto("http://localhost:8000")
    await autoScroll(page)
    await percySnapshot(page, "landing page", {
      widths: [768, 992, 1200],
    })
  })

  test("page-2 loads correctly", async () => {
    const page = await browser.newPage()
    await page.goto("http://localhost:8000/page-2")
    await percySnapshot(page, "page-2", {
      widths: [768, 992, 1200],
    })
  })

  afterAll(async () => {
    await browser.close()
  })
})
