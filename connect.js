const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const app = express();
const PORT = 3000;
app.use(express.static('./public'));

async function drawTextOnTemplate(templatePath, text, align) {
  const imageBuffer = fs.readFileSync(templatePath);
  const image = await loadImage(imageBuffer);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = align;
  const startX = align === 'right' ? 650 : 120;
  const startY = 150;
  const lineHeight = 35;
  const words = text.split(' ');
  let line = '';
  let y = startY;
  words.forEach((word) => {
    const testLine = line + word + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > 400) {
      ctx.fillText(line, startX, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, startX, y);
  return canvas.toBuffer('image/png');
}

app.get('/nuliskanan', async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ message: 'Parameter "text" harus disertakan!' });
  }

  const templatePath = './image/template_kanan.jpg';
  try {
    const buffer = await drawTextOnTemplate(templatePath, text, 'right');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error memproses gambar');
  }
});

app.get('/nuliskiri', async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ message: 'Parameter "text" harus disertakan!' });
  }

  const templatePath = './image/template_kiri.jpg';
  try {
    const buffer = await drawTextOnTemplate(templatePath, text, 'left');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error memproses gambar');
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});