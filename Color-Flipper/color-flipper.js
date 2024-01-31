function rgbToHex(rgb) {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    throw new Error("Invalid RGB format");
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  return hex;
}

document.querySelector('.js-color-button')
  .addEventListener('click', function colorChange() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    let color = `rgb(${red},${green},${blue})`;

    document.body.style.backgroundColor = color;

    const hexColor = rgbToHex(color);
    document.querySelector('.js-color').innerHTML = `The Color is ${hexColor}`;
  });