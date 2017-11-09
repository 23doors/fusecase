const HOST = 'syncano.space'
const DEFAULT_HEADERS = {'Content-Type': 'application/json'}
class Client{
  constructor(instanceName,token){
    this.url = `https://${instanceName}.${host}/`
    this.token = token
  }
  async post(endpoint,args={}){
    let res = await fetch(`${this.url}/${endpoint}`,args)
    return res
  }
}