import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/puzzle', async (req, res) => {
  const names = req.body.names;
  const namesArray = names.split('\n').map(name => name.trim()).filter(name => name.length > 0);

  // Dinamik kodu oluştur
  let postData = "submit=Rearrange&PuzType=FFCW&";
  namesArray.forEach((name, index) => {
    const indexStr = index.toString().padStart(2, '0');
    postData += `Answer${indexStr}=${encodeURIComponent(name)}&`;
  });
  postData += "WordsAndClues=-*-_Multiline_-*-.";
  namesArray.forEach(name => {
    postData += `${encodeURIComponent(name)}++%2F++%250a`;
  });

  try {
    // curl komutunu konsola yazdır
    const curlCommand = `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "${postData}" https://puzzle-maker.customwallarts.com/crossword_Options.cgi`;
    console.log('Curl Command:', curlCommand);

    // fetch ile post işlemi
    const response = await fetch('https://puzzle-maker.customwallarts.com/crossword_Options.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData
    });

    const data = await response.text();
    console.log('Veri:', data);
    const outputLines = [];
    let dumpTraceLine = "";

    const dataLines = data.split('\n');
    dataLines.forEach(line => {
      line = line.trim();
      if (line.startsWith('<!-- DumpTrace_BestPuzzleAsComments')) {
        dumpTraceLine = line.replace('<!-- ', '').replace('-->', '').trim();
      } else if (line.startsWith('<!-- y=')) {
        outputLines.push(line.replace('<!-- ', '').replace('-->', '').trim());
      }
    });

    if (dumpTraceLine) {
      outputLines.unshift(dumpTraceLine);
    }

    let capture = false;
    let finalOutputLines = [];

    outputLines.forEach(line => {
      if (line.startsWith('DumpTrace_BestPuzzleAsComments')) {
        capture = true;
      } else if (capture && line.startsWith('y=')) {
        const cleanedLine = line.split(':')[1].trim();
        finalOutputLines.push(cleanedLine);
      }
    });

    res.json({ output: finalOutputLines.join('\n') });
  } catch (error) {
    console.error('Hata oluştu:', error);
    res.status(500).send('Bir hata oluştu. Lütfen tekrar deneyin.');
  }
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
