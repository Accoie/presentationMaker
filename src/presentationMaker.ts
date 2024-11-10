type Presentation = {
    title: string;
    slides: Slide[];
    selection: PresentationSelection;
  }
type PresentationSelection = {
    elementId: string;
    slideId: string;
}
type Color = {
    type: 'solid';
    color: string;
};

type ImgObj = BaseSlideObj &{
    type: 'image';
    src: string;
};
type TextObj = BaseSlideObj &{
    type: 'text';
    src: string;
    fontSize: number;
    fontFamily: string;
};
type Slide = {
    id: string;
    elements: (SlideObj)[];
    background: string;
}  

type SlideObj = TextObj | ImgObj;
type Size = {
    width: number;
    heigth: number;
}
type Pos  = {
    x: number;
    y: number;
}
type BaseSlideObj = {
    size: Size;
    pos: Pos;
    id: string;
};

enum ElementType {
    text = 'text',
    image = 'image',
};

function changePresentationName(presentation: Presentation, newTitle: string): Presentation { 
    return {...presentation, title: newTitle};
}

function addSlide(presentation: Presentation, newSlide: Slide): Presentation {
    return {...presentation, slides: [...presentation.slides, newSlide]};
}

function removeSlide(presentation: Presentation, slideId: string): Presentation {
    return {...presentation, slides: presentation.slides.filter(slide => slide.id !== slideId)};

}

function changeSlidePosition(presentation: Presentation, slideId: string, newPosition: number): Presentation {
    return {
        ...presentation, 
        slides: presentation.slides.map(slide => slide.id === slideId ? {...slide, position: newPosition} : slide)
    };
}

function addElementToSlide(presentation: Presentation, slideId: string, newElement: SlideObj): Presentation {
    return {
        ...presentation, 
        slides: presentation.slides.map(slide => slide.id === slideId ? {...slide, elements: [...slide.elements, newElement]} : slide)
    };
}  

function removeElementFromSlide(presentation: Presentation, slideId: string, elementId: string): Presentation {
    return {
        ...presentation, 
        slides: presentation.slides.map(slide => slide.id === slideId ? {...slide, elements: slide.elements.filter(element => element.id !== elementId)} : slide)
  }
}

function changeElementPosition(presentation: Presentation, slideId: string, elementId: string, newPosition: Pos): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === elementId ? {...element, pos: newPosition} : element)}: slide )
    };
}

function changeElementSize(presentation: Presentation, slideId:string, elementId: string, newSize: Size): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === elementId ? {...element, size: newSize} : element)}: slide )
    };
}

function changeTextContent(presentation: Presentation, slideId: string, textElementId: string, newText: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, src: newText} : element)}: slide )
    };
}

function changeTextSize(presentation: Presentation, slideId: string, textElementId: string, newSize: number): Presentation {
    return {
      ...presentation,
      slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, fontSize: newSize} : element)}: slide )
    };
}

function changeFontFamily(presentation: Presentation, slideId: string, textElementId: string, newFontFamily: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
          {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, fontFamily: newFontFamily} : element)}: slide )
      };
}
 
function changeSlideBackground(presentation: Presentation, newBackground: string, slideId: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(element => element.id === slideId ? {...element, background: newBackground} : element)
    };
}