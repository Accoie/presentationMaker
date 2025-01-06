import * as tools from '../../source/presentationMaker'

 const maximalPresentation: tools.Presentation = {
  title: 'Super Presentation',
  sizeWorkspace: {width: 935, height: 525},
  slides: [
    {
      id: 'slide1',
      elements: [
        {
          id: 'tex23t1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 800, height: 400},
          pos: { x: 10, y: 100 },
        } as tools.TextObj,
        
        {
          id: 'tex54t1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 800, height: 400},
          pos: { x: 100, y: 20 },
        } as tools.TextObj
      ],
      background: '#AA21AA',
    },
    {
      id: 'slide2',
      elements: [
        {
          id: 'te45xt2',
          type: tools.ElementType.text,
          src: 'Another Text',
          fontSize: 20,
          fontFamily: 'Times New Roman',
          size: { width: 80, height: 40 },
          pos: { x: 5, y: 15 },
        } as tools.TextObj,
       
      ],
      background: 'blue',
    },
  ],
};
export const minimalPresentation: tools.Presentation = {
    sizeWorkspace: {width: 1000, height: 400},
    title: '',
    slides: [],
};
export const editor: tools.EditorType = {
  presentation: maximalPresentation,
  selection: [{
    elementId: '',
    slideId: maximalPresentation.slides[0].id,
  }]
};  