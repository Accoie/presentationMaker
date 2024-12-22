import { EditorType } from '../../../source/presentationMaker.ts';
import Ajv from 'ajv';


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
export function validateEditorState(editorState: EditorType): boolean  {
    const valid = validateEditor(editorState) as boolean;
    if (!valid) {
        console.error('Validation errors:', validateEditor.errors);
    }
    return valid;
}
export function importEditor(editor: EditorType, jsonString: string): EditorType {
        
    if (typeof jsonString === 'string') {
        try {
            const importedState: EditorType = JSON.parse(jsonString);
            if (validateEditorState(importedState)) {
                console.log('Импортирован и прошел валидацию:', importedState);
                return importedState;
            } else {
                alert('editor state не прошел валидацию.');
                return editor;
            }
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            return editor;
        }
    } else { return editor }

}