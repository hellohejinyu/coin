import cn from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import s from './app.scss'
import { Data, startWebSocket } from './data'

function App() {
  const [current, setCurrent] = useState<Data>()
  const [mouseOver, setMouseOver] = useState(false)

  const noData = useMemo(() => !current || !current.data, [current])

  const active = useMemo(() => {
    if (noData) return false
    return mouseOver
  }, [current, mouseOver])

  const upAndDownsPercent = useMemo(() => {
    if (noData) return null
    const num =
      ((parseFloat(current?.data?.[0].last ?? '0') -
        parseFloat(current?.data?.[0].open24h ?? '0')) /
        parseFloat(current?.data?.[0].open24h ?? '0')) *
      100
    return {
      num,
      str: (num >= 0 ? '+' : '') + num.toFixed(2) + '%',
    }
  }, [current])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      startWebSocket((res) => {
        setCurrent(res)
      })
    }
    if (process.env.NODE_ENV === 'production') {
      chrome?.runtime?.onMessage?.addListener(
        (req: Data, _: any, sendResponse: any) => {
          setCurrent(req)
          sendResponse({ status: 'ok' })
        }
      )
    }
  }, [])

  return (
    <>
      <div
        className={cn(s.container, {
          [s.hidden]: noData,
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
          }, 1e3)
        }}
      >
        <ul>
          <li>
            {current?.data && (
              <>
                {new Date(parseInt(current.data[0].ts))
                  .getHours()
                  .toString()
                  .padStart(2, '0')}
                :
                {new Date(parseInt(current.data[0].ts))
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}
                :
                {new Date(parseInt(current.data[0].ts))
                  .getSeconds()
                  .toString()
                  .padStart(2, '0')}
              </>
            )}
          </li>
          <li>
            <span>最新：</span>
            {current?.data && (
              <span>${parseFloat(current.data[0].last).toFixed(1)}</span>
            )}
          </li>
          <li>
            <span>24H最高：</span>
            {current?.data && (
              <span>${parseFloat(current.data[0].high24h).toFixed(1)}</span>
            )}
          </li>
          <li>
            <span>24H最低：</span>
            {current?.data && (
              <span>${parseFloat(current.data[0].low24h).toFixed(1)}</span>
            )}
          </li>
        </ul>
      </div>
      <div
        className={cn(s.tips, {
          [s.hidden]: noData,
          [s.positive]: (upAndDownsPercent?.num ?? 0) > 0,
          [s.nagtive]: (upAndDownsPercent?.num ?? 0) < 0,
        })}
      >
        {upAndDownsPercent?.str}
      </div>
    </>
  )
}

export default App
