import EntityInstance from './EntityInstance'
const HOST = 'syncano.space'
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }
import { IRemoteServer } from './RemoteServer'
declare var fetch: any
declare var console: any
export default class Server implements IRemoteServer {
  url: String
  token: String
  sentTransactions = new Set()
  constructor(instanceName: String, token?: String) {
    this.url = `https://${instanceName}.syncano.space/`
    this.token = token
  }
  async notifyNewTransactions(instance: EntityInstance<any>) {
    let latestTid = undefined
    var transaction
    console.log(instance.transactions.length)
    for (var i = 0; i < instance.transactions.length; i++) {
      console.log("step1")
      transaction = instance.transactions[i]
      console.log("step2")
      if (i > 0) {
        latestTid = instance.transactions[i - 1].localId
      }
      console.log("step3")
      if (this.sentTransactions.has(transaction.localId)) {
        break;
      }
      console.log("step4")


      let response = await this.sync(instance, {
        latestTid,
        tid: transaction.localId,
        action: transaction.method.name,
        payload: JSON.stringify(transaction.args || {}),
      })
    }
  }

  async sync(instance: EntityInstance<any>, {
    tid,
    action,
    payload,
    latestTid
  }) {
    console.log(
      JSON.stringify({
        tid,
        action,
        payload,
        latestTid
      })
    )
    const response = await this.post('sync-state/sync', {
      tid,
      action,
      payload,
      latestTid,
      appid: 'todolist',
      entity: instance.id,
    })
    return response
  }
  subscribe(instance: EntityInstance<any>) {
    this.post('sync-state/list', {
      appid: 'todolist',
      entity: instance.id
    })
  }
  async post(endpoint: String, args = {}) {
    let res
    try {
      debugger;
      res = await fetch(`${this.url}${endpoint}/`, { body: JSON.stringify(args), headers: DEFAULT_HEADERS, method:'post' })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
    console.log("SDADSDS",res)
    return res
  }
}