function parseAndDisplayGrid(data) {
    // Extract grid lines from the data
    const gridLines = [];
    const lines = data.split('\n');
    lines.forEach(line => {
        const match = line.match(/<!-- y=\d{2}: (.*?) -->/);
        if (match && match[1]) {
            gridLines.push(match[1].trim());
        }
    });
    if (gridLines.length > 0) {
        // Display the grid on the screen
        const gridElement = document.getElementById('grid');
        gridElement.textContent = gridLines.join('\n');
    } else {
        alert('Bulmaca ızgarası bulunamadı.');
    }
}