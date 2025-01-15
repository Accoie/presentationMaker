import { EditorType } from '../../../types/presentationMaker';

export function exportEditor(editorState: EditorType): EditorType {
  const editor = JSON.stringify(editorState, null, 2);
  const blob = new Blob([editor], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${editorState.presentation.title}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('Editor state has been exported to JSON.');
  return editorState;
}
