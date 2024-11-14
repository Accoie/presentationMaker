import * as tools from '../source/presentationMaker.ts';

describe('Presentation Functions with min data', () => {
    let minimalPresentation: tools.Presentation;
    

    beforeEach(() => {
        minimalPresentation = {
            background: '',
            title: '',
            slides: [],
            selection: {
                elementId: '',
                slideId: '',
            },
        };
    });

    test('Change presentation name', () => {
        const newTitle = 'New Minimal Title';
        const updatedPresentation = tools.changePresentationName(minimalPresentation, newTitle);
        expect(updatedPresentation.title).toEqual(newTitle);
    });

    test('Add slide', () => {
        const newSlide: tools.Slide = {
            id: '',
            position: 0,
            elements: [],
            background: '',
        };
        const updatedPresentation = tools.addSlide(minimalPresentation, newSlide);
        expect(updatedPresentation.slides).toHaveLength(1);
    });
    test('Remove slide', () => {

        const newPresentation = tools.removeSlide(minimalPresentation, '');
        expect(newPresentation.slides).toHaveLength(0); 
        expect(newPresentation.slides).toEqual(expect.arrayContaining([])); 
    });
    test('Change slide position', () => {
        const newPresentation = tools.changeSlidePosition(minimalPresentation, '', 2);
        expect(newPresentation.slides.find(slide => slide.id === '')?.position).toBe(undefined);
    });
    test('Add element to slide', () => {
        const imgElement: tools.ImgObj = {
            id: '',
            type: tools.ElementType.image,
            src: '',
            size: {width: 0, height: 0},
            pos: {x: 0, y: 0}
        };
        const slideElement: tools.SlideObj = imgElement;
        const newPresentation = tools.addElementToSlide(minimalPresentation, '', slideElement);
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements).toBe(undefined);
    });
    test('Remove element', () => {
        const newPresentation = tools.removeElementFromSlide(minimalPresentation, '', '');
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements).toBe(undefined);
    });
    test('Change element position', () => {
        const newPresentation = tools.changeElementPosition(minimalPresentation, '', '', {x: 0, y: 0});
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements.find(element => element.id === '')).toBe(undefined);
        
    });
    test('Change element size', () => {
        const newPresentation = tools.changeElementSize(minimalPresentation, '', '', {width: 0, height: 0});
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements.find(element => element.id === '')).toBe(undefined);
        
    });
    test('Change text content', () => {
        const newPresentation = tools.changeTextContent(minimalPresentation, '', '', '');
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements.find(element => element.id === '')).toBe(undefined);
        
    });
    test('Change text size', () => {
        const newPresentation = tools.changeTextSize(minimalPresentation, '', '', 0);
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements.find(element => element.id === '')).toBe(undefined);
        
    });
    test('Change Font Family', () => {
        const newPresentation = tools.changeFontFamily(minimalPresentation, '', '', '');
        expect(newPresentation.slides.find(slide => slide.id === '')?.elements.find(element => element.id === '')).toBe(undefined);
        
    });
    test('Change Slide Background', () => {
        const newPresentation = tools.changeSlideBackground(minimalPresentation, '', '');
        expect(newPresentation.slides.find(slide => slide.id === '')?.background).toBe(undefined);
        
    });
});

describe('Presentation Functions with max data', () => {
    const maximalPresentation: tools.Presentation = {
        title: 'Original Title',
        background: 'white',
        slides: [
          {
            id: 'slide1',
            elements: [
              {
                id: 'text1',
                type: tools.ElementType.text,
                src: 'Hello World',
                fontSize: 12,
                fontFamily: 'Arial',
                size: { width: 100, height: 50 },
                pos: { x: 10, y: 20 },
              } as tools.TextObj,
              {
                id: 'img1',
                type: tools.ElementType.image,
                src: 'http://example.com/image.png',
                size: { width: 100, height: 100 },
                pos: { x: 15, y: 30 },
              } as tools.ImgObj
            ],
            background: 'white',
            position: 1
          },
          {
            id: 'slide2',
            elements: [
              {
                id: 'text2',
                type: tools.ElementType.text,
                src: 'Another Text',
                fontSize: 14,
                fontFamily: 'Times New Roman',
                size: { width: 80, height: 40 },
                pos: { x: 5, y: 15 },
              } as tools.TextObj,
              {
                id: 'img2',
                type: tools.ElementType.image,
                src: 'http://example.com/another-image.png',
                size: { width: 120, height: 80 },
                pos: { x: 10, y: 25 },
              } as tools.ImgObj
            ],
            background: 'blue',
            position: 2
          }
        ],
        selection: {
          elementId: 'text1',
          slideId: 'slide1',
        }
      };
      test('Change presentation name', () => {
        const newTitle = 'New Presentation Title';
        const updatedPresentation = tools.changePresentationName(maximalPresentation, newTitle);
        expect(updatedPresentation.title).toBe(newTitle);
      });
      
      test('Add slide', () => {
        const newSlide: tools.Slide = {
          id: 'slide3',
          elements: [],
          background: 'green',
          position: 3
        };
        const updatedPresentation = tools.addSlide(maximalPresentation, newSlide);
        expect(updatedPresentation.slides.length).toBe(3);
        expect(updatedPresentation.slides[2]).toEqual(newSlide);
      });
    
      test('Remove slide', () => {
        const updatedPresentation = tools.removeSlide(maximalPresentation, 'slide1');
        expect(updatedPresentation.slides.length).toBe(1);
        expect(updatedPresentation.slides[0].id).toBe('slide2');
      });
    
      test('Change Slide Position', () => {
        const updatedPresentation = tools.changeSlidePosition(maximalPresentation, 'slide1', 2);
        const updatedSlide = updatedPresentation.slides.find(slide => slide.id === 'slide1');
        expect(updatedSlide?.position).toBe(2);
      });
    
      test('Add Element To Slide', () => {
        const newElement: tools.TextObj = {
          id: 'text2',
          type: tools.ElementType.text,
          src: 'New Text',
          fontSize: 16,
          fontFamily: 'Helvetica',
          size: { width: 50, height: 25 },
          pos: { x: 5, y: 10 },
        };
        const updatedPresentation = tools.addElementToSlide(maximalPresentation, 'slide1', newElement);
        const slide = updatedPresentation.slides.find(slide => slide.id === 'slide1');
        expect(slide?.elements.length).toBe(3);
        expect(slide?.elements[2]).toEqual(newElement);
      });
    
      test('Remove Element From Slide', () => {
        const updatedPresentation = tools.removeElementFromSlide(maximalPresentation, 'slide1', 'text1');
        const slide = updatedPresentation.slides.find(slide => slide.id === 'slide1');
        expect(slide?.elements.length).toBe(1);
        expect(slide?.elements[0].id).toBe('img1');
      });
    
      test('Change Element Position', () => {
        const newPosition: tools.Pos = { x: 20, y: 25 };
        const updatedPresentation = tools.changeElementPosition(maximalPresentation, 'slide1', 'text1', newPosition);
        const element = updatedPresentation.slides[0].elements.find(el => el.id === 'text1');
        expect(element?.pos).toEqual(newPosition);
      });
    
      test('Change Element Size', () => {
        const newSize: tools.Size = { width: 120, height: 60 };
        const updatedPresentation = tools.changeElementSize(maximalPresentation, 'slide1', 'text1', newSize);
        const element = updatedPresentation.slides[0].elements.find(el => el.id === 'text1');
        expect(element?.size).toEqual(newSize);
      });
    
      test('Change Text bContent', () => {
        const newText = 'Updated Text Content';
        const updatedPresentation = tools.changeTextContent(maximalPresentation, 'slide1', 'text1', newText);
        const element = updatedPresentation.slides[0].elements.find(el => el.id === 'text1');
        expect(element?.src).toBe(newText);
      });
    
      test('changeTextSize should update the font size of a text element', () => {
        const newSize = 18;
        const updatedPresentation = tools.changeTextSize(maximalPresentation, 'slide1', 'text1', newSize);
        const element = updatedPresentation.slides[0].elements.find(el => el.id ==='text1');
        expect((element as tools.TextObj).fontSize).toBe(newSize);
      });
    
      test('Change Font Family', () => {
        const newFontFamily = 'Courier';
        const updatedPresentation = tools.changeFontFamily(maximalPresentation, 'slide1', 'text1', newFontFamily);
        const element = updatedPresentation.slides[0].elements.find(el => el.id === 'text1');
        expect((element as tools.TextObj).fontFamily).toBe(newFontFamily);
      });
    
      test('Change Slide Background', () => {
        const newBackground = 'red';
        const updatedPresentation = tools.changeSlideBackground(maximalPresentation, newBackground, 'slide1');
        const slide = updatedPresentation.slides.find(slide => slide.id === 'slide1');
        expect(slide?.background).toBe(newBackground);
      });
    });