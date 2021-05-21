let fps = 75
let frame = 0
let interval, start, now, then, elapsed, update

const startAnimation = () => {
  interval = 1000 / fps
  then = Date.now()
  start = then
  animationLoop()
}

const animationLoop = () => {
  requestAnimationFrame(animationLoop)
  now = Date.now()
  elapsed = now - then

  if (elapsed > interval) {
    then = now - (elapsed % interval)
    update(frame++ % (Number.MAX_SAFE_INTEGER - 1))
  }
}

const animate = (loop) => {
  update = loop
  startAnimation()
}

export default animate