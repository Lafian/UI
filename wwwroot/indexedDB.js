window.readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

window.saveImageToIndexedDB = (base64Image) => {
    const dbRequest = indexedDB.open("ImageGalleryDB", 1);

    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("images", { autoIncrement: true });
    };

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        store.add(base64Image);
    };

    dbRequest.onerror = (event) => {
        console.error("Failed to open IndexedDB:", event);
    };
};

window.loadImagesFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open("ImageGalleryDB", 1);

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("images", "readonly");
            const store = transaction.objectStore("images");
            const images = [];

            store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    images.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(images);
                }
            };
        };

        dbRequest.onerror = (event) => {
            reject("Failed to load images from IndexedDB:", event);
        };
    });
};

window.sendImageToSurrealDB = (base64Image) => {
    console.log("Sending image to SurrealDB:", base64Image);
};