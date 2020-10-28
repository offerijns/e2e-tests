// Dependencies
import { After, Before, Status } from 'cucumber'

import { openBrowser, closeBrowser, takeScreenshot } from './support/browser-actions'
import { CentrifugeWorld } from './support/world'

Before(async function(this: CentrifugeWorld, scenario) {
  this.clearContext()

  await openBrowser(this)
  await this.metamaskInit()
})

After(async function(this: CentrifugeWorld, scenario) {
  this.clearContext()

  if (scenario.result.exception || scenario.result.status === Status.FAILED) {
    console.log('exception or failure – will take a screenshot')

    await takeScreenshot(this, `./screenshots/scenario-${scenario.pickle.name}-failed.png`)

    // return if not on CI, which keeps the browser open for debugging
    if (!process.env.CI) {
      console.log('skipping close browser')
      return
    }
  }
  console.log('closing browser')

  await closeBrowser(this)
})