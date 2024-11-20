import {editor} from './data.ts'
import { EditorType } from '../../source/presentationMaker.ts'
let _editor = editor

let _handler: (() => void) | null = null;
_handler = null;
export function getEditor() {
    return _editor
}

export function setEditor(newEditor: EditorType) {
    _editor = newEditor
}

export function dispatch(modifyFn: Function, payload?: Object): void {
    console.log('Dispatch payload:', payload);
    const newEditor = modifyFn(_editor, payload)
    setEditor(newEditor)
    console.log('New editor:', newEditor); 
    if (_handler) {
        _handler()
    }
}

export function addEditorChangeHandler(handler: Function): void {
    _handler = handler
}
