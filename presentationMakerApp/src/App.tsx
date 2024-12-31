import { EditorView } from './view/editorview/EditorView.tsx';
import Player from './view/playerview/PlayerView.tsx'
import { BrowserRouter, Routes, Route } from 'react-router';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EditorView />} />
        <Route path='/player' element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;