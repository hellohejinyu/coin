let socket
const instId = 'BTC-USD-SWAP'

const startWebSocket = () => {
  socket = new WebSocket('wss://ws.okex.com:8443/ws/v5/public')

  socket.onopen = () => {
    console.log('connected')
    socket.send(
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
    const data = JSON.parse(e.data)
    if (data.event === 'unsubscribe') {
      console.log('disconnect')
    }
    if (data.event === 'subscribe') {
      console.log('subscribed')
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (Array.isArray(tabs)) {
        const validTabs = tabs.filter(
          (t) =>
            !t.url.startsWith('chrome://') &&
            !t.url.includes('localhost') &&
            !t.url.includes('127.0.0.1')
        )
        if (validTabs.length > 0) {
          validTabs.forEach((tab) => {
            console.log(tab.url)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            chrome.tabs.sendMessage(tab.id, data, function (response) {
              // console.log(response)
            })
          })
        }
      }
    })
  }

  socket.onclose = () => {
    console.log('closed')
    socket = null
    setTimeout(() => {
      startWebSocket()
    }, 3e3)
  }
}

startWebSocket()
