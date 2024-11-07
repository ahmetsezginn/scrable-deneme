import { createImageGrid } from './convertPng.js';

document.getElementById('submitButton').addEventListener('click', () => {
    const namesInput = document.getElementById('namesInput').value;
    
    fetch('/puzzle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `names=${encodeURIComponent(namesInput)}`
    })
    .then(response => response.json())
    .then(data => {
        // Aldığımız output'u kullanarak resmi oluşturuyoruz
        const canvas = document.getElementById('puzzleCanvas');
        if (canvas) {
            createImageGrid(data.output, '/images', canvas);
        } else {
            console.error('Canvas element not found');
        }
    })
    .catch(error => {
        console.error('Hata oluştu:', error);
    });
});
document.getElementById('downloadButton').addEventListener('click', () => {
    window.open('/images/puzzle-board.png', '_blank');
});
