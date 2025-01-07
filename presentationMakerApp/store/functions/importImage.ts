import { Dispatch } from "redux";
import { AppThunk } from "../store";
import {addImageToSlideAction} from  '../actions/editorSlideElementsActions'
import { changeSlideBackgroundAction } from "../actions/editorSlidesActions";
import { ImgObj } from "../../../source/presentationMaker";
import { v4 as uuidv4 } from 'uuid';

export const importImage = (isBackgroundChange: boolean): AppThunk => {
    return async(dispatch: Dispatch) => {

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.zIndex = "1000";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
  
    const container = document.createElement("div");
    container.style.backgroundColor = "white";
    container.style.padding = "20px";
    container.style.borderRadius = "8px";
    container.style.width = "80%";
    container.style.maxHeight = "80%";
    container.style.overflowY = "auto";
  
 
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите запрос...";
    input.style.width = "80%";
    input.style.padding = "10px";
    input.style.marginBottom = "10px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    container.appendChild(input);
  
   
    const searchButton = document.createElement("button");
    searchButton.textContent = "Искать";
    searchButton.style.padding = "10px";
    searchButton.style.marginLeft = "10px";
    searchButton.style.backgroundColor = "#007BFF";
    searchButton.style.color = "white";
    searchButton.style.border = "none";
    searchButton.style.borderRadius = "4px";
    searchButton.style.cursor = "pointer";
    container.appendChild(searchButton);
  
    const imagesContainer = document.createElement("div");
    imagesContainer.style.marginTop = "20px";
    imagesContainer.style.display = "grid";
    imagesContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))";
    imagesContainer.style.gap = "10px";
    container.appendChild(imagesContainer);
  
    const closeButton = document.createElement("button");
    closeButton.textContent = "Закрыть";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "10px";
    closeButton.style.backgroundColor = "#FF0000";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "4px";
    closeButton.style.cursor = "pointer";
    container.appendChild(closeButton);
  
    modal.appendChild(container);
    document.body.appendChild(modal);
  
    const UNSPLASH_ACCESS_KEY = '434iTsxJx-ErKsKKjalCRPyKeqL_4g66GbobZVNsTy0';
  
    const fetchImages = async (query: string) => {
        imagesContainer.innerHTML = "Загрузка...";
      
        async function convertToBase64(url: string): Promise<string> {
          const response = await fetch(url);
          const blob = await response.blob(); 
          return new Promise((resolve, reject) => {
            const reader = new FileReader(); 
            reader.onloadend = () => resolve(reader.result as string); 
            reader.onerror = reject; 
            reader.readAsDataURL(blob); 
          });
        }
      
        try {
          const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=9`;
          const response = await fetch(url);
          const data = await response.json();
          imagesContainer.innerHTML = "";
      
          for (const result of data.results) { 
            const img = document.createElement("img");
            img.src = await convertToBase64(result.urls.small);
      
            img.style.width = "100%";
            img.style.cursor = "pointer";
            img.style.borderRadius = "8px";
            img.onclick = () => {
              const image: ImgObj = {
                size: { width: 100, height: 100 },
                src: img.src,
                pos: { x: 10, y: 10 },
                id: uuidv4(),
                type: 'image'
              } as ImgObj;
              if (!isBackgroundChange) {
                dispatch(addImageToSlideAction(image));
              } else { dispatch(changeSlideBackgroundAction(`url(${image.src}) no-repeat center center / cover`))}

              document.body.removeChild(modal);
            };
            imagesContainer.appendChild(img);
          }
        } catch (error) {
          console.error("Ошибка загрузки изображений:", error);
          imagesContainer.innerHTML = "Ошибка загрузки.";
        }
      };

    searchButton.onclick = () => {
      if (input.value.trim()) {
        fetchImages(input.value.trim());
      }
    };

    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
  }
}