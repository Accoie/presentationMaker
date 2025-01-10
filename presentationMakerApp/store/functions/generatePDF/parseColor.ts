export function parseColor(color: string): [number, number, number][] {
  color = color.toLowerCase();
  if (!color.startsWith('linear-gradient')) {
    const rgb = singleColorToRgb(color);
    return [rgb];
  }
  const gradientMatch = color.match(
    /linear-gradient\([^,]+,\s*((rgba?\([^)]+\)\s*\d*%?\s*,?\s*)+)\)/
  );
  if (gradientMatch) {
    const gradientStops = gradientMatch[1]
      .split("%")
      .slice(0, -1)
      .map((stop) => stop.trim());

    const colors: [number, number, number][] = gradientStops.map((stop) => {
      const colorMatch = stop.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (colorMatch) {
        return singleColorToRgb(
          `rgb(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]})`
        );
      }
      return [255, 255, 255];
    });
    return colors;
  }
  console.error(`Неизвестный формат цвета: ${color}`);
  return [[255, 255, 255]];
}

function singleColorToRgb(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    return [r, g, b];
  }
  console.error(`Неизвестный формат одиночного цвета: ${color}`);
  return [255, 255, 255];
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace(/^#/, '');
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map((char) => char + char).join('')
    : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return [r, g, b];
}
