import EntityInstance from './EntityInstance'
const HOST = 'syncano.space'
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }
import { IRemoteServer } from './RemoteServer'
import Transaction  from "./Transaction";
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
    const {
      transactions
    } = instance
    var transaction
    for (var i = 0; i < transactions.length; i++) {
      transaction = transactions[i]
      if (i > 0) {
        latestTid = transactions[i - 1].localId
      }
      if (this.sentTransactions.has(transaction.localId)) {
        break;
      }

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
  async subscribe(instance: EntityInstance<any>) {
    const obs = await this.post('sync-state/list', {
      appid: 'todolist',
      entity: instance.id
    })
    this.sentTransactions = new Set(obs)
    for(var t of obs){
      var transaction = new Transaction(t.tid, instance.obj[t.action], JSON.parse(t.payload));
      instance.transactions.push(transaction);
    }
    console.log(instance.transactions.length)
    console.log(instance.transactions.length)
    
    return obs
  }
  async post(endpoint: String, args = {}) {
    let res
    try {
      res = await fetch(`${this.url}${endpoint}/`, { body: JSON.stringify(args), headers: DEFAULT_HEADERS, method: 'post' })
      res = await res.json()
    } catch (error) {
    }
    return res
  }
}