import { setWorldConstructor, setDefaultTimeout } from 'cucumber'
import { Browser, Page } from 'puppeteer'
import { ITinlake } from '@centrifuge/tinlake-js'
import * as dappeteer from 'dappeteer'

import { ensureTinlakeInit } from './tinlake-actions'
import { config } from '../config'

export class CentrifugeWorld {
  browser: null | Browser = null
  currentPage: null | Page = null
  // wrap all Dappeteer metamask actions so we can bring the current page back to front after interacting with metamask
  private metamask: null | dappeteer.Dappeteer = null
  tinlake: null | ITinlake = null
  context: { [key: string]: any } = {}

  constructor() {}

  async initializedTinlake() {
    return await ensureTinlakeInit(this)
  }

  clearContext() {
    this.context = {}
  }

  async metamaskInit() {
    this.metamask = await dappeteer.getMetamask(this.browser)
  }

  async metamaskImportAdminPK() {
    await this.metamask.importPK(config.ethAdminPrivateKey)
  }

  async metamaskImportBorrowerPK() {
    await this.metamask.importPK(config.ethBorrowerPrivateKey)
  }

  async metamaskSwitchNetwork() {
    await this.metamask.switchNetwork(config.ethNetwork)
  }

  // wrap Dappeteer metamask actions so we can bring the current page back to front after interacting with metamask
  async metamaskApprove() {
    await this.metamask.approve()
    await this.currentPage.bringToFront()
  }

  // wrap Dappeteer metamask actions so we can bring the current page back to front after interacting with metamask
  async metamaskConfirmTransaction(options: dappeteer.TransactionOptions) {
    await this.metamask.confirmTransaction(options)
    await this.currentPage.bringToFront()
  }
}

setDefaultTimeout(100 * 1000)
setWorldConstructor(CentrifugeWorld)
