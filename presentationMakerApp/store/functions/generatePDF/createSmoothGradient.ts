import {rgb, PDFPage} from "pdf-lib";

export function createSmoothGradient(page: PDFPage, width: number, height: number, colors: [number, number, number][]) {
  const numSteps = 400; 
  const stepWidth = width / numSteps;

  for (let i = 0; i < numSteps; i++) {
    const colorIndex = (i / numSteps) * (colors.length - 1);
    const startColorIndex = Math.floor(colorIndex);
    const endColorIndex = Math.min(startColorIndex + 1, colors.length - 1);
    
    const startColor = colors[startColorIndex];
    const endColor = colors[endColorIndex];

    const ratio = colorIndex - startColorIndex;
    const r = startColor[0] + (endColor[0] - startColor[0]) * ratio;
    const g = startColor[1] + (endColor[1] - startColor[1]) * ratio;
    const b = startColor[2] + (endColor[2] - startColor[2]) * ratio;

    page.drawRectangle({
      x: i * stepWidth, 
      y: 0,              
      width: stepWidth, 
      height: height,   
      color: rgb(r / 255, g / 255, b / 255), 
    });
  }
}