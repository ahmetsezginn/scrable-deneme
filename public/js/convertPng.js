export function createImageGrid(dataOutput, imageFolder, canvasElement) {
    const lines = dataOutput.trim().split('\n');
    const gridHeight = lines.length;
    const gridWidth = Math.max(...lines.map(line => line.trim().split(/\s+/).length));
    const charsUsed = new Set();
    lines.forEach(line => {
        line.trim().split(/\s+/).forEach(char => {
            if (char !== '-') {
                charsUsed.add(char);
            }
        });
    });

    function loadImages(charsUsed, imageFolder) {
        const promises = [];
        charsUsed.forEach(char => {
            const img = new Image();
            const imgPromise = new Promise((resolve) => {
                img.onload = () => resolve({ char, img });
                img.onerror = () => {
                    console.warn(`Warning: Image for character '${char}' not found at ${imageFolder}/${char}.png`);
                    resolve({ char, img: null });
                };
            });
            img.src = `${imageFolder}/${char}.png`;
            promises.push(imgPromise);
        });
        return Promise.all(promises);
    }

    loadImages(charsUsed, imageFolder).then(results => {
        const images = {};
        results.forEach(({ char, img }) => {
            images[char] = img;
        });

        let imageWidth = 0, imageHeight = 0;
        for (let char in images) {
            if (images[char]) {
                imageWidth = images[char].width;
                imageHeight = images[char].height;
                break;
            }
        }

        if (imageWidth === 0 || imageHeight === 0) {
            console.error('Could not determine image dimensions.');
            return;
        }

        // Calculate original canvas size
        const originalWidth = gridWidth * imageWidth;
        const originalHeight = gridHeight * imageHeight;

        // Scale the canvas if it's too big
        const maxWidth = 800;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight, 1);

        canvasElement.width = originalWidth * scale;
        canvasElement.height = originalHeight * scale;

        const ctx = canvasElement.getContext('2d');
        ctx.scale(scale, scale);

        // Draw the images onto the canvas
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            const chars = line.trim().split(/\s+/);
            for (let x = 0; x < chars.length; x++) {
                const char = chars[x];
                if (char !== '-' && images[char]) {
                    ctx.drawImage(images[char], x * imageWidth, y * imageHeight, imageWidth, imageHeight);
                }
            }
        }

        // Get the image data from the canvas
        const imageDataURL = canvasElement.toDataURL('image/png');

        // Save the image to the server
        fetch('/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageData: imageDataURL })
        })
        .catch(error => {
            console.error('Error saving image:', error);
        });
    }).catch(error => {
        console.error('Error loading images:', error);
    });
}