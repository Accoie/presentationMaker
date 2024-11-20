export type EditorType = {
    presentation: Presentation;
    selection: PresentationSelection;
}
export type Presentation = {
    title: string;
    slides: Slide[];
    sizeWorkspace: Size;
  }
export type PresentationSelection = {
    elementId: string;
    slideId: string;
}
export type Color = {
    type: 'solid';
    color: string;
};

export type ImgObj = BaseSlideObj &{
    type: ElementType.image;
    src: string;
};
export type TextObj = BaseSlideObj &{
    type: ElementType.text;
    src: string;
    fontSize: number;
    fontFamily: string;
};
export type Slide = {
    id: string;
    elements: (SlideObj)[];
    background: string;
}  

export type SlideObj = TextObj | ImgObj;
export type Size = {
    width: number;
    height: number;
}
export type Pos  = {
    x: number;
    y: number;
}
export type BaseSlideObj = {
    size: Size;
    pos: Pos;
    id: string;
};

export enum ElementType {
    text = 'text',
    image = 'image',
};

export function changePresentationName(presentation: Presentation, newTitle: string): Presentation { 
    return {...presentation, title: newTitle};
}

export function addSlide(presentation: Presentation, newSlide: Slide): Presentation {
    return {...presentation, slides: [...presentation.slides, newSlide]};
}

export function removeSlide(presentation: Presentation, slideId: string): Presentation {
    return {...presentation, slides: presentation.slides.filter(slide => slide.id !== slideId)};

}


export function addElementToSlide(presentation: Presentation, slideId: string, newElement: SlideObj): Presentation {
    return {
        ...presentation, 
        slides: presentation.slides.map(slide => slide.id === slideId ? {...slide, elements: [...slide.elements, newElement]} : slide)
    };
}  

export function removeElementFromSlide(presentation: Presentation, slideId: string, elementId: string): Presentation {
    return {
        ...presentation, 
        slides: presentation.slides.map(slide => slide.id === slideId ? {...slide, elements: slide.elements.filter(element => element.id !== elementId)} : slide)
  }
}

export function changeElementPosition(presentation: Presentation, slideId: string, elementId: string, newPosition: Pos): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === elementId ? {...element, pos: newPosition} : element)}: slide )
    };
}

export function changeElementSize(presentation: Presentation, slideId:string, elementId: string, newSize: Size): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === elementId ? {...element, size: newSize} : element)}: slide )
    };
}

export function changeTextContent(presentation: Presentation, slideId: string, textElementId: string, newText: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, src: newText} : element)}: slide )
    };
}

export function changeTextSize(presentation: Presentation, slideId: string, textElementId: string, newSize: number): Presentation {
    return {
      ...presentation,
      slides: presentation.slides.map(slide => slide.id === slideId ? 
        {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, fontSize: newSize} : element)}: slide )
    };
}

export function changeFontFamily(presentation: Presentation, slideId: string, textElementId: string, newFontFamily: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? 
          {...slide, elements: slide.elements.map(element => element.id === textElementId && element.type === ElementType.text ? {...element, fontFamily: newFontFamily} : element)}: slide )
      };
}
 
export function changeSlideBackground(presentation: Presentation, newBackground: string, slideId: string): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map(element => element.id === slideId ? {...element, background: newBackground} : element)
    };
}