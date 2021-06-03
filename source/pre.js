const createElement = (id, tagName) => {
  const doc = document.createElement(tagName)
  doc.id = id
  return doc
}

const root = createElement('__CHROME_COIN_ROOT', 'div')
document.body.appendChild(root)
