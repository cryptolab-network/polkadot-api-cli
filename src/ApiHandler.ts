import { ApiPromise, WsProvider } from '@polkadot/api';

class ApiHandler {
  private _api: ApiPromise;
  private _endpoints: string[];
  
  constructor(api: ApiPromise, endpoints: string[]) {
    this._api = api;
    this._endpoints = endpoints;
  }

  static async create(endpoints: string[]): Promise<ApiHandler> {
    const apiPromise = new ApiPromise({
      provider: new WsProvider(endpoints[0], 1000),
    })
    await apiPromise.isReadyOrError;
    const api = new ApiHandler(apiPromise, endpoints);
    return api;
  }

  async getApi(): Promise<ApiPromise> {
    return this._api;
  }
}

export default ApiHandler;