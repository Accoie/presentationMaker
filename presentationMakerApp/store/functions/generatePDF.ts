import { EditorType } from "../../../source/presentationMaker";
import { Dispatch } from "redux";
import { jsPDF } from "jspdf";
import { showPDFModalAction } from "../actions/editorActions";
import { AppThunk } from "../store";

export const generatePDF = (editor: EditorType): AppThunk => {
  return async (dispatch: Dispatch) => {
    const doc = new jsPDF({
      orientation: editor.presentation.sizeWorkspace.width > editor.presentation.sizeWorkspace.height ? "landscape" : "portrait",
      unit: "px",
      format: [editor.presentation.sizeWorkspace.width, editor.presentation.sizeWorkspace.height],
    });

    const addImageToPDF = (imgSrc: string, x: number, y: number, width: number, height: number) => {
      const img = new Image();
      img.src = imgSrc;

      return new Promise<void>((resolve, reject) => {
        console.log('asdf')
        img.onload = () => {
          try {
            doc.addImage(img.src, "PNG", x, y, width, height);
            resolve();
          } catch (e){
            alert('Ошибка при добавлении картинки в PDF')
            console.log(e);
          }
          
        };
        img.onerror = (err) => {reject(err)};
      });
    };

    const addTextToPDF = (text: string, fontSize: number, fontFamily: string, x: number, y: number, maxWidth: number) => {
      console.log(fontFamily)
      return new Promise<void>((resolve) => {
        console.log(doc.getFontList())
        doc.setFontSize(fontSize);
        
        doc.setFont(fontFamily);
        doc.text(text, x, y, { maxWidth });
        resolve();
      });
    };

    for (let index = 0; index < editor.presentation.slides.length; index++) {
      const slide = editor.presentation.slides[index];

      if (index > 0) doc.addPage();

      if (slide.background) {
        
        doc.setFillColor(slide.background);
        doc.rect(0, 0, editor.presentation.sizeWorkspace.width, editor.presentation.sizeWorkspace.height, "F");
      }

      for (const element of slide.elements) {
        try {
          if (element.type === "text") {
            const textObj = element;
            await addTextToPDF(
              textObj.src,
              textObj.fontSize,
              textObj.fontFamily,
              textObj.pos.x,
              textObj.pos.y,
              textObj.size.width
            );
          } else if (element.type === "image") {
            const imgObj = element;
            await addImageToPDF(
              imgObj.src,
              imgObj.pos.x,
              imgObj.pos.y,
              imgObj.size.width,
              imgObj.size.height
            );
          }
        } catch (err) {
          console.error(`Error rendering element on slide ${index + 1}:`, err);
          alert(`Произошла ошибка при добавлении элемента на слайде ${index + 1}`);
        }
      }
    }
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    dispatch(showPDFModalAction(pdfURL));
  };
};
