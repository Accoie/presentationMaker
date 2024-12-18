import { EditorType } from "../../source/presentationMaker";
import {editor} from '../store/data.ts'
import { legacy_createStore as createStore } from "redux";
import { rootReducer } from './reducers/rootReducer'; // Импортируем rootReducer из другого файла
import { TypedUseSelectorHook, useSelector } from "react-redux";
export const LOCAL_STORAGE_KEY = 'editorState';
// Создаем хранилище Redux
function loadEditorStateFromLocalStorage(): EditorType | null {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : null;
}
const preloadedState: EditorType = loadEditorStateFromLocalStorage() || editor as EditorType;
export const store = createStore(rootReducer, preloadedState);

// Типы для использования в селекторах и диспетчере
type RootState = ReturnType<typeof rootReducer>

// Используйте во всем приложении вместо `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
