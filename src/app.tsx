import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import s from './app.scss'

type Data = {
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

const mockData: Data = {
  arg: { channel: 'tickers', instId: 'BTC-USD-SWAP' },
  data: [
    {
      instType: 'SWAP',
      instId: 'BTC-USD-SWAP',
      last: '38691.6',
      lastSz: '3',
      askPx: '38700',
      askSz: '10',
      bidPx: '38699.9',
      bidSz: '2350',
      open24h: '37121.2',
      high24h: '39039.5',
      low24h: '36864.7',
      sodUtc0: '37578.4',
      sodUtc8: '38037.8',
      volCcy24h: '17620.5293',
      vol24h: '6653271',
      ts: '1622704340482',
    },
  ],
}

function App() {
  const [current, setCurrent] = useState<Data>()
  const [mouseOver, setMouseOver] = useState(false)

  const active = useMemo(() => {
    if (!current || !current.data) return false
    return mouseOver
  }, [current, mouseOver])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setCurrent(mockData)
      }, 2e3)
    }
    chrome?.runtime?.onMessage?.addListener(
      (req: Data, _: any, sendResponse: any) => {
        setCurrent(req)
        sendResponse({ status: 'ok' })
      }
    )
  }, [])

  return (
    <div
      className={cn(s.container, {
        [s.hidden]: !current || !current.data,
        [s.active]: active,
      })}
      onMouseOver={() => {
        if (!mouseOver) {
          setMouseOver(true)
        }
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          if (mouseOver) {
            setMouseOver(false)
          }
        }, 400)
      }}
    >
      <ul>
        <li>
          {current?.data &&
            new Date(parseInt(current.data[0].ts)).toLocaleTimeString()}
        </li>
        <li>
          <span>最新：</span>
          <span>${current?.data?.[0].last}</span>
        </li>
        <li>
          <span>24H最高：</span>
          <span>${current?.data?.[0].high24h}</span>
        </li>
        <li>
          <span>24H最低：</span>
          <span>${current?.data?.[0].low24h}</span>
        </li>
        <li>
          <span>24H涨跌：</span>
          <span>
            {(
              ((parseInt(current?.data?.[0].last ?? '0') -
                parseInt(current?.data?.[0].open24h ?? '0')) /
                parseInt(current?.data?.[0].open24h ?? '0')) *
              100
            ).toFixed(2)}
            %
          </span>
        </li>
      </ul>
    </div>
  )
}

export default App
