import { width, height, resizeConfig } from "../config.js"

const resize = canvas => {
  resizeHandler(canvas)
  document.body.addEventListener("resize", () => {
    resizeHandler(canvas)
    resizeConfig()
  })
}

const resizeHandler = (canvas) => {
  Object.assign(canvas, {
    width, 
    height
  })
}

export default resize