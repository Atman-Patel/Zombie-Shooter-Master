let keymap = []

window.addEventListener("keydown", e => {
  let { key } = e
  if(!keymap.includes(key)) {
    keymap.push(key)
  }
})

window.addEventListener("keyup", e => {
  let { key } = e
  if(keymap.includes(key)) {
    keymap.splice(keymap.indexOf(key), 1)
  }
})

const key = (x) => {
  return keymap.includes(x)
}

export default key