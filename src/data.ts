export type Data = {
  event?: string
  arg: { channel: 'tickers'; instId: 'BTC-USD-SWAP' }
  data?: [
    {
      /**
       * 产品类型
       */
      instType: string
      /**
       * 产品ID
       */
      instId: string
      /**
       * 最新成交价
       */
      last: string
      /**
       * 最新成交的数量
       */
      lastSz: string
      /**
       * 卖一价
       */
      askPx: string
      /**
       * 卖一价的挂单数数量
       */
      askSz: string
      /**
       * 买一价
       */
      bidPx: string
      /**
       * 买一价的挂单数量
       */
      bidSz: string
      /**
       * 24小时开盘价
       */
      open24h: string
      /**
       * 24小时最高价
       */
      high24h: string
      /**
       * 24小时最低价
       */
      low24h: string
      /**
       * UTC 0 时开盘价
       */
      sodUtc0: string
      /**
       * UTC+8 时开盘价
       */
      sodUtc8: string
      /**
       * 24小时成交量，以币为单位
       * 如果是衍生品合约，数值为结算货币的数量。
       * 如果是币币/币币杠杆，数值为计价货币的数量。
       */
      volCcy24h: string
      /**
       * 24小时成交量，以张为单位
       * 如果是衍生品合约，数值为合约的张数。
       * 如果是币币/币币杠杆，数值为交易货币的数量。
       */
      vol24h: string
      /**
       * ticker数据产生时间，Unix时间戳的毫秒数格式，如 1597026383085
       */
      ts: string
    }
  ]
}

let socket: WebSocket | null
const instId = 'BTC-USD-SWAP'

/**
 * 本地开发调试获取数据用
 */
export const startWebSocket = (onRes: (res: Data) => void) => {
  socket = new WebSocket('wss://ws.okex.com:8443/ws/v5/public')

  socket.onopen = () => {
    console.log('connected')
    socket?.send(
      JSON.stringify({
        op: 'subscribe',
        args: [
          {
            channel: 'tickers',
            instId,
          },
        ],
      })
    )
  }

  socket.onmessage = async (e) => {
    const data: Data = JSON.parse(e.data)
    if (data.event === 'unsubscribe') {
      console.log('disconnect')
    }
    if (data.event === 'subscribe') {
      console.log('subscribed')
    }
    onRes(data)
  }

  socket.onclose = () => {
    console.log('closed')
    socket = null
    setTimeout(() => {
      startWebSocket(onRes)
    }, 3e3)
  }
}
