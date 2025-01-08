export function showPDFModal(url: string, name: string): void {
    // Создание модального окна
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.zIndex = "9999";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
  
    // Создание iframe для отображения PDF
    const iframe = document.createElement("iframe");
    iframe.id = "pdf-preview";
    iframe.style.width = "80%";
    iframe.style.height = "80%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";
    iframe.src = url;
    
  
    // Создание кнопки закрытия
    const closeButton = document.createElement("button");
    closeButton.textContent = "Закрыть";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.padding = "10px";
    closeButton.style.backgroundColor = "#ff0000";
    closeButton.style.color = "#ffffff";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
  
    // Действие при нажатии на кнопку закрытия
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
  
    // Создание кнопки скачивания
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Скачать PDF";
    downloadButton.style.position = "absolute";
    downloadButton.style.bottom = "10px";
    downloadButton.style.right = "10px";
    downloadButton.style.padding = "10px";
    downloadButton.style.backgroundColor = "#007bff";
    downloadButton.style.color = "#ffffff";
    downloadButton.style.border = "none";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.fontSize = "16px";
  
    // Действие при нажатии на кнопку скачивания
    downloadButton.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`; // Указание имени файла для загрузки
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  
    // Добавление iframe, кнопок закрытия и скачивания в модальное окно
    modal.appendChild(iframe);
    modal.appendChild(closeButton);
    modal.appendChild(downloadButton);
  
    // Добавление модального окна на страницу
    document.body.appendChild(modal);
  }
  