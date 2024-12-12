import { editor } from './data.ts';
import { EditorType } from '../../source/presentationMaker.ts';
import Ajv from 'ajv';

let _editor = editor;

let _handler: (() => void) | null = null;


const LOCAL_STORAGE_KEY = 'editorState';

const ajv = new Ajv();

export const editorSchema = {
    type: "object",
    properties: {
      presentation: {
        type: "object",
        properties: {
          title: { type: "string" },
          sizeWorkspace: {
            type: "object",
            properties: {
              width: { type: "number", minimum: 0 },
              height: { type: "number", minimum: 0 },
            },
            required: ["width", "height"],
          },
          slides: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                background: { type: "string" },
                elements: {
                  type: "array",
                  items: {
                    type: "object",
                    oneOf: [
                      {
                        type: "object",
                        properties: {
                          type: { const: "text" },
                          id: { type: "string" },
                          src: { type: "string" },
                          fontSize: { type: "number", minimum: 1 },
                          fontFamily: { type: "string" },
                          size: {
                            type: "object",
                            properties: {
                              width: { type: "number", minimum: 0 },
                              height: { type: "number", minimum: 0 },
                            },
                            required: ["width", "height"],
                          },
                          pos: {
                            type: "object",
                            properties: {
                              x: { type: "number" },
                              y: { type: "number" },
                            },
                            required: ["x", "y"],
                          },
                        },
                        required: ["type", "id", "src", "fontSize", "fontFamily", "size", "pos"],
                      },
                      {
                        type: "object",
                        properties: {
                          type: { const: "image" },
                          id: { type: "string" },
                          src: { type: "string" },
                          size: {
                            type: "object",
                            properties: {
                              width: { type: "number", minimum: 0 },
                              height: { type: "number", minimum: 0 },
                            },
                            required: ["width", "height"],
                          },
                          pos: {
                            type: "object",
                            properties: {
                              x: { type: "number" },
                              y: { type: "number" },
                            },
                            required: ["x", "y"],
                          },
                        },
                        required: ["type", "id", "src", "size", "pos"],
                      },
                    ],
                  },
                },
              },
              required: ["id", "background", "elements"],
            },
          },
        },
        required: ["title", "slides", "sizeWorkspace"],
      },
      selection: {
        type: "object",
        properties: {
          elementId: { type: "string" },
          slideId: { type: "string" },
        },
        required: ["elementId", "slideId"],
      },
    },
    required: ["presentation", "selection"],
  };
  
const validateEditor = ajv.compile(editorSchema);


export function getEditor() {
    return _editor;
}

export function setEditor(newEditor: EditorType) {
    _editor = newEditor;
}

function saveEditorStateToLocalStorage(editorState: EditorType): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editorState));
}

function loadEditorStateFromLocalStorage(): EditorType | null {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : null;
}

function validateEditorState(editorState: EditorType): boolean  {
    const valid = validateEditor(editorState) as boolean;
    if (!valid) {
        console.error('Validation errors:', validateEditor.errors);
    }
    return valid;
}

export function dispatch(modifyFn: Function, payload?: object|string): void {
    console.log('Dispatch payload:', payload);
    let newEditor;
    try {
        // Попытка изменения состояния редактора с использованием modifyFn
        newEditor = modifyFn(_editor, payload);
        
        // Дополнительная валидация нового состояния редактора (при необходимости)
        if (!newEditor || typeof newEditor !== 'object') {
            throw new Error('Получено некорректное состояние редактора');
        }

        // Установка нового состояния редактора
        setEditor(newEditor);

        // Сохранение состояния редактора в локальное хранилище
        saveEditorStateToLocalStorage(newEditor);

        console.log('New editor:', newEditor);
    } catch (error) {
        // Логирование ошибок и предотвращение дальнейших действий
        console.error('Ошибка при обновлении состояния редактора:', error);

        // Можно добавить дополнительную логику обработки ошибки (например, сброс состояния)
        // setEditor(_editor); // Возврат к старому состоянию редактора, если необходимо

        // Выводим сообщение об ошибке пользователю (или не выводим, в зависимости от ситуации)
        alert('Произошла ошибка при обновлении состояния редактора.');
    }

    if (_handler) {
        _handler();
    }
}

export function addEditorChangeHandler(handler: Function): void {
    _handler = handler;
}


export function exportEditorState(): void {
    const editor =  JSON.stringify(_editor, null, 2);
    const blob = new Blob([editor], { type: 'application/json' });

    // Генерация ссылки для скачивания
    const url = URL.createObjectURL(blob);

    // Создание временной ссылки для загрузки файла
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editorState.json'; // Имя файла по умолчанию
    document.body.appendChild(a);

    // Инициирование загрузки
    a.click();

    // Удаление временной ссылки и освобождение ресурсов
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Editor state has been exported to JSON.');
}

const savedState = loadEditorStateFromLocalStorage();
if (savedState) {
    if (validateEditorState(savedState)) {
        setEditor(savedState);
    } else {
        console.error('Invalid saved state in Local Storage. Ignoring.');
    }
}
export function importEditorState(editor: EditorType, jsonString: string): EditorType {
        
    if (typeof jsonString === 'string') {
        // Если jsonString - это строка, продолжаем с JSON.parse
        try {
            const importedState: EditorType = JSON.parse(jsonString);
            if (validateEditorState(importedState)) {
                console.log('Импортирован и прошел валидацию:', importedState);
                return importedState;
            } else {
                console.error('editor state не прошел валидацию.');
                return editor;
            }
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            return editor;
        }
    } else { return editor }

}

