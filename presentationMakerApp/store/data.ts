import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'

 const maximalPresentation: tools.Presentation = {
  title: 'Super Presentation',
  sizeWorkspace: {width: 1000, height: 400},
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
          size: { width: 1000, height: 400},
          pos: { x: 10, y: 100 },
        } as tools.TextObj,
        {
          id: 'im1g1',
          type: tools.ElementType.image,
          src: 'https://avatars.mds.yandex.net/i?id=0eaa142d7202ac9bbd26ac279e7ae159_l-4898876-images-thumbs&n=27&h=480&w=480',
          size: { width: 200, height: 100 },
          pos: { x: 15, y: 10 },
        } as tools.ImgObj,
        {
          id: 'tex54t1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 1000, height: 400},
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
        {
          id: 'img2322',
          type: tools.ElementType.image,
          src: 'https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg',
          size: { width: 120, height: 80 },
          pos: { x: 10, y: 25 },
        } as tools.ImgObj
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
  selection: {
    elementId: '',
    slideId: maximalPresentation.slides[0].id,
  }
};  