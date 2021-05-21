let width, height

const resizeConfig = () => {
  width = window.innerWidth
  height = window.innerHeight
}

resizeConfig()

export {
  width,
  height,
  resizeConfig
}