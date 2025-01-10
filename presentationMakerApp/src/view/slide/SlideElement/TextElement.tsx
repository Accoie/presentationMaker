import React from 'react';
import { useDispatch } from 'react-redux';
import { TextObj } from '../../../../../types/presentationMaker';
import { CSSProperties } from 'react';
import { updateElementAction } from '../../../../store/actions/editorSlideElementsActions';

interface TextElementProps {
  element: TextObj;
  scale: number;
  isEditorView: boolean;
  isWorkspace: boolean
}

export const TextElement = ({ element, scale, isEditorView, isWorkspace }: TextElementProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [text, setText] = React.useState(element.src);
  const dispatch = useDispatch();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const textElementStyles: CSSProperties = {
    fontSize: `${element.fontSize * scale}px`,
    fontFamily: element.fontFamily || 'Arial',
    width: '100%',
    height: '100%',
    overflowWrap: 'break-word',
    cursor: isEditing ? 'text' : 'auto',
    color: element.color || 'black'
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== element.src) {
      const updatedElement = { ...element, src: text };
      dispatch(updateElementAction(updatedElement));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

    }
  }, [isEditing]);

  if (!isWorkspace) {
    return <div style={textElementStyles}>{element.src}</div>
  }

  return isEditing ? (
    <textarea
      ref={textareaRef}
      style={{ ...textElementStyles, resize: 'none', border: '1px solid #ccc', padding: '4px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : isEditorView ? (
    <div style={textElementStyles} onDoubleClick={handleDoubleClick}>
      {element.src}
    </div>
  ) : <div style={textElementStyles}>{element.src}</div>;
    
};


