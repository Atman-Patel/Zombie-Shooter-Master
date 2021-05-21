const random = (min, max) => {
  return (Math.random() * (max - min)) + min
}

const distance = (x1, y1, x2, y2) => {
	let xx = Math.pow((x2 - x1), 2),
		yy = Math.pow((y2 - y1), 2)
	return Math.sqrt(xx + yy)
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export {
  scale,
  random,
  distance
}