import { editor } from './data.ts';
import { EditorType } from '../../source/presentationMaker.ts';
import Ajv from 'ajv';

let _editor = editor;

let _handler: (() => void) | null = null;


const LOCAL_STORAGE_KEY = 'editorState';

const ajv = new Ajv();

const editorSchema = {
    type: "object",
    properties: {
        presentation: {
            type: "object",
            properties: {
                slides: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            elements: { type: "array" },
                        },
                        required: ["id", "elements"],
                    },
                },
            },
            required: ["slides"],
        },
        selection: {
            type: "object",
            properties: {
                slideId: { type: "string" },
                elementId: { type: "string" },
            },
            required: ["slideId"],
        },
    },
    required: ["presentation", "selection"],
    additionalProperties: false,
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

function validateEditorState(editorState: EditorType): boolean {
    const valid = validateEditor(editorState);
    if (!valid) {
        console.error('Validation errors:', validateEditor.errors);
    }
    return valid;
}

export function dispatch(modifyFn: Function, payload?: Object): void {
    console.log('Dispatch payload:', payload);
    const newEditor = modifyFn(_editor, payload);
    setEditor(newEditor);
    saveEditorStateToLocalStorage(newEditor); 
    console.log('New editor:', newEditor);

    if (_handler) {
        _handler();
    }
}

export function addEditorChangeHandler(handler: Function): void {
    _handler = handler;
}


export function exportEditorState(): string {
    return JSON.stringify(_editor, null, 2);
}


export function importEditorState(jsonString: string): void {
    try {
        const importedState: EditorType = JSON.parse(jsonString);
        if (validateEditorState(importedState)) {
            setEditor(importedState);
            saveEditorStateToLocalStorage(importedState);
            console.log('Imported and validated editor state:', importedState);
        } else {
            console.error('Invalid editor state. Import aborted.');
        }
    } catch (error) {
        console.error('Failed to import editor state:', error);
    }
}

const savedState = loadEditorStateFromLocalStorage();
if (savedState) {
    if (validateEditorState(savedState)) {
        setEditor(savedState);
    } else {
        console.error('Invalid saved state in Local Storage. Ignoring.');
    }
}