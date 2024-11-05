document.getElementById('runButton').addEventListener('click', function() {
    const inputText = document.getElementById('namesInput').value;
    const names = inputText.split('\n').map(name => name.trim().toUpperCase()).filter(name => name);

    if (names.length === 0) {
        alert('Lütfen en az bir isim girin.');
        return;
    }

    // İsimleri POST verisi olarak hazırlayalım
    const formData = new URLSearchParams();
    formData.append('submit', 'Rearrange');
    formData.append('PuzType', 'FFCW');

    // İsimleri Answer00, Answer01 şeklinde ekleyelim
    names.forEach((name, index) => {
        const key = 'Answer' + index.toString().padStart(2, '0');
        formData.append(key, name);
    });

    // WordsAndClues verisini hazırlayalım
    const wordsAndClues = '-*-_Multiline_-*-.' + names.join('  /  %0a');
    formData.append('WordsAndClues', wordsAndClues);

    // Fetch API ile proxy sunucusuna POST isteği gönderelim
    fetch('/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    })
    .then(response => response.text())
    .then(data => {
        // Yanıtı işleyelim
        parseAndDisplayGrid(data);
    })
    .catch(error => {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    });
});

function parseAndDisplayGrid(data) {
    // Yorum satırlarını bulalım
    const gridLines = [];
    const lines = data.split('\n');
    let capturing = false;

    lines.forEach(line => {
        if (line.includes('DumpTrace_BestPuzzleAsComments')) {
            capturing = true;
            return;
        }
        if (capturing) {
            if (line.startsWith('<!-- y=')) {
                // Satır numarasını ve içeriği alalım
                const match = line.match(/<!-- y=\d{2}: *(.*)-->/);
                if (match && match[1]) {
                    gridLines.push(match[1].trim());
                }
            } else if (line.startsWith('<!--')) {
                // Başka bir yorum satırına geçtik, duralım
                capturing = false;
            }
        }
    });

    if (gridLines.length > 0) {
        // Izgarayı ekranda gösterelim
        const gridElement = document.getElementById('grid');
        gridElement.textContent = gridLines.join('\n');
    } else {
        alert('Bulmaca ızgarası bulunamadı.');
    }
}
