import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = (req, res) => {
    const imageData = req.body.imageData.replace(/^data:image\/png;base64,/, '');
    const imagePath = path.join(__dirname, '../public/images/puzzle-board.png'); // Harflerin olduğu klasör

    fs.writeFile(imagePath, imageData, 'base64', (err) => {
        if (err) {
            console.error('Resim kaydedilirken hata oluştu:', err);
            return res.status(500).send('Hata oluştu');
        }
        res.status(200).send('Resim kaydedildi');
    });
};