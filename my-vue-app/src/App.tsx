import './App.css'
import * as tools from '/Frontend/presentationMaker/source/presentationMaker.ts'
const maximalPresentation: tools.Presentation = {
  title: 'Super Presentation',
  background: 'white',
  slides: [
    {
      id: 'slide1',
      elements: [
        {
          id: 'text1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 1000, height: 400},
          pos: { x: 10, y: 20 },
        } as tools.TextObj,
        {
          id: 'img1',
          type: tools.ElementType.image,
          src: 'https://avatars.mds.yandex.net/i?id=0eaa142d7202ac9bbd26ac279e7ae159_l-4898876-images-thumbs&n=27&h=480&w=480',
          size: { width: 200, height: 100 },
          pos: { x: 15, y: 30 },
        } as tools.ImgObj
      ],
      background: 'red',
      position: 1
    },
    {
      id: 'slide2',
      elements: [
        {
          id: 'text2',
          type: tools.ElementType.text,
          src: 'Another Text',
          fontSize: 20,
          fontFamily: 'Times New Roman',
          size: { width: 80, height: 40 },
          pos: { x: 5, y: 15 },
        } as tools.TextObj,
        {
          id: 'img2',
          type: tools.ElementType.image,
          src: 'https://png.pngtree.com/thumb_back/fw800/background/20230527/pngtree-phoenix-bird-in-flames-wallpapers-wallpapershd-image_2697352.jpg',
          size: { width: 120, height: 80 },
          pos: { x: 10, y: 25 },
        } as tools.ImgObj
      ],
      background: 'blue',
      position: 2
    },
    {
      id: 'slide1',
      elements: [
        {
          id: 'text1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 100, height: 100},
          pos: { x: 10, y: 20 },
        } as tools.TextObj,
        {
          id: 'img1',
          type: tools.ElementType.image,
          src: 'https://avatars.mds.yandex.net/i?id=0eaa142d7202ac9bbd26ac279e7ae159_l-4898876-images-thumbs&n=27&h=480&w=480',
          size: { width: 200, height: 100 },
          pos: { x: 15, y: 30 },
        } as tools.ImgObj
      ],
      background: 'red',
      position: 1
    },
    {
      id: 'slide1',
      elements: [
        {
          id: 'text1',
          type: tools.ElementType.text,
          src: 'Hello World',
          fontSize: 20,
          fontFamily: 'Impact',
          size: { width: 100, height: 100},
          pos: { x: 10, y: 20 },
        } as tools.TextObj,
        {
          id: 'img1',
          type: tools.ElementType.image,
          src: 'https://avatars.mds.yandex.net/i?id=0eaa142d7202ac9bbd26ac279e7ae159_l-4898876-images-thumbs&n=27&h=480&w=480',
          size: { width: 200, height: 100 },
          pos: { x: 15, y: 30 },
        } as tools.ImgObj
      ],
      background: 'red',
      position: 1
    }
  ],
  selection: {
    elementId: 'text1',
    slideId: 'slide1',
  }
};
const SlidesList = ({presentationData} : {presentationData: tools.Presentation}) => {
  return (
    <div className='slides-list'>
      {presentationData.slides.map((slide) => (
        <div className = 'slide' key={slide.id}>
          <h2>Slide #{slide.position}</h2>
          <div style={{ background: slide.background }}>
            {slide.elements.map((element) => (
              <div key={element.id}>
                {element.type === tools.ElementType.text ? (
                  <p>{element.src}</p>
                ) : element.type === tools.ElementType.image ? (
                  <img className='slide-list-image'src={element.src} alt={element.id} />
                ) : (
                    null
                  )
                }
              </div>
            ))}
          </div>
        </div>
    ))}
    </div>
  );
};
const WorkSpace = ({presentationData} : {presentationData: tools.Presentation}) => {
  const selectedSlide = presentationData.slides.find((slide) => slide.id === presentationData.selection.slideId);
  if (!selectedSlide) {
    return <div>There isn't selected slide</div>
  }
  return (
        <div className='work-space' key={selectedSlide.id}>
          <h2>Slide #{selectedSlide.position}</h2>
          <div style={{ background: selectedSlide.background }}>
            {selectedSlide.elements.map((element) => (
              <div key={element.id}>
                {element.type === tools.ElementType.text ? (
                  <div style={{fontSize: `${element.fontSize}px`, fontFamily: element.fontFamily || 'Arial', 
                    width: `${element.size.width}px`, height: `${element.size.height}px`}}>{element.src}</div>
                ) : element.type === tools.ElementType.image ? (
                  <img src={element.src} alt={element.id} style = {{width: `${element.size.width}px`, height: `${element.size.height}px`}}/>
                ) : (
                    null
                  )
                }
              </div>
            ))}
          </div>
        </div>
  );
};
const Presentations = ({ presentationData } : {presentationData : tools.Presentation}) => {
  return (
    <div className='presentation'>
      <h2 style ={{color: 'black', margin: 0, paddingBottom: 40}}>{presentationData.title}</h2>
      <div className='presentation-container'>
          <SlidesList presentationData={maximalPresentation} />
          <WorkSpace presentationData={maximalPresentation} />
      </div>
    </div>
  );
};
function App() {
  return (
    <Presentations presentationData={maximalPresentation} />
  )
}

export default App
