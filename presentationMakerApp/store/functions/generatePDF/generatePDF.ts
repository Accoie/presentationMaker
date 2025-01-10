import { EditorType } from '../../../../types/presentationMaker';
import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { AppThunk } from '../../store';
import { showPDFModal } from './showPDFModal.ts';
import { createSmoothGradient } from './createSmoothGradient.ts';
import { parseColor } from './parseColor.ts';

async function fromStringToPDFImage(image: string, pdfDoc: PDFDocument) {
  const base64Data = image.split(',')[1];
  const sanitizedBase64Data = base64Data.replace(/[\s)(]+.*$/, '');
  let pdfImage;
  if (image.startsWith('url(data:image/png') || image.startsWith('data:image/png')) {
    pdfImage = await pdfDoc.embedPng(sanitizedBase64Data);
  } else if (
    image.startsWith('url(data:image/jpeg') ||
    image.startsWith('url(data:image/jpg') ||
    image.startsWith('data:image/jpeg') ||
    image.startsWith('data:image/jpg')
  ) {
    pdfImage = await pdfDoc.embedJpg(sanitizedBase64Data);
  }
  return pdfImage;
}

export const generatePDF = (editor: EditorType): AppThunk => {
  const sizeSlide = editor.presentation.sizeWorkspace;
  return async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const fontCache: Record<string, PDFFont> = {};
    async function getFont(fontFamily: string) {
      if (!fontCache[fontFamily]) {
        try {
          const fontPath = `../../../fonts/${fontFamily}.ttf`;
          const fontBytes = await fetch(fontPath).then((res) => res.arrayBuffer());
          fontCache[fontFamily] = await pdfDoc.embedFont(fontBytes);
        } catch (error) {
          console.error(`Не удалось загрузить шрифт ${fontFamily}:`, error);
          alert(`Шрифт ${fontFamily} недоступен. Используется шрифт по умолчанию.`);
          fontCache[fontFamily] = font;
        }
      }
      return fontCache[fontFamily];
    }

    const defaultFontBytes = await fetch('../../../fonts/Arial.ttf').then((res) =>
      res.arrayBuffer()
    );
    const font = await pdfDoc.embedFont(defaultFontBytes);

    for (let index = 0; index < editor.presentation.slides.length; index++) {
      const slide = editor.presentation.slides[index];
      const page = pdfDoc.addPage([sizeSlide.width, sizeSlide.height]);

      if (slide.background.includes('data:image')) {
        try {
          const image = await fromStringToPDFImage(slide.background, pdfDoc);
          if (image) {
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: sizeSlide.width,
              height: sizeSlide.height,
            });
          }
        } catch (error) {
          console.error('Ошибка при обработке base64 изображения:', error);
          alert('Не удалось загрузить фон: некорректные данные изображения.');
        }
      } else if (slide.background.includes('http')) {
        const imageBytes = await fetch(slide.background).then((res) => res.arrayBuffer());
        let image;
        if (slide.background.endsWith('.png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (
          slide.background.endsWith('.jpg') ||
          slide.background.endsWith('.jpeg')
        ) {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        if (image) {
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: sizeSlide.width,
            height: sizeSlide.height,
          });
        }
      } else {
        const colors = parseColor(slide.background);

        if (colors.length > 1) {
          createSmoothGradient(
            page,
            sizeSlide.width,
            sizeSlide.height,
            colors
          );
        } else {
          const [r, g, b] = colors[0];
          page.drawRectangle({
            x: 0,
            y: 0,
            width: sizeSlide.width,
            height: sizeSlide.height,
            color: rgb(r / 255, g / 255, b / 255),
          });
        }
      }

      for (const element of slide.elements) {
        try {
          if (element.type === 'text') {
            const textObj = element;

            const elementFont = textObj.fontFamily
              ? await getFont(textObj.fontFamily)
              : font;

            const textColorArray = parseColor(textObj.color || '#000000')[0];
            const [r, g, b] = textColorArray;

            page.drawText(textObj.src, {
              x: textObj.pos.x,
              y: sizeSlide.height - textObj.pos.y,
              size: textObj.fontSize,
              font: elementFont,
              color: rgb(r / 255, g / 255, b / 255),
              maxWidth: textObj.size.width,
            });
          } else if (element.type === 'image') {
            const imgObj = element;
            const image = await fromStringToPDFImage(element.src, pdfDoc);

            if (image) {
              page.drawImage(image, {
                x: imgObj.pos.x,
                y: sizeSlide.height - imgObj.pos.y - imgObj.size.height,
                width: imgObj.size.width,
                height: imgObj.size.height,
              });
            }
          }
        } catch (err) {
          console.error(`Error rendering element on slide ${index + 1}:`, err);
          alert(`Произошла ошибка при добавлении элемента на слайде ${index + 1}`);
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);
    showPDFModal(pdfURL, editor.presentation.title || 'Presentation');
  };
};
