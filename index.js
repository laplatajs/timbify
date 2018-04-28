'use strict';

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');

if (!process.argv[2]) throw 'dame un archivo csv!!';
const filepath = process.argv[2];

const list = csvParse(fs.readFileSync(filepath), {
  columns: true
});

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
});

const logo = contrib.picture({
  file: './logo.png',
  cols: 25,
  onReady() {
    screen.render();
  }
});
screen.append(logo);

// Create a box perfectly centered horizontally and vertically.
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: '{center}{black-bg}La timba de LaPlataJS{/black-bg}{/center}',
  tags: true,
  padding: 5,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: '#f0f0f0'
    }
  }
});

const text = blessed.text({
  top: 'center',
  left: 'center',
  parent: box,
  style: {
    bg: 'black',
    fg: 'white'
  }
});

// Append our box to the screen.
screen.append(box);
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let speed = 1;
let block = false;

function start() {
  const current = getRandom(0, list.length);
  const winner = list[current];

  if (speed > 200) {
    box.style.bg = 'cyan';
    box.setContent(
      '{center}{black-bg}Tenemos un ganador!!{/black-bg}{/center}'
    );
    text.setContent(`${winner.Nombre} ${winner.Apellido}\n${winner.Email}`);
    list.splice(current, 1);

    screen.render();
    speed = 1;
    block = false;
    return;
  }

  text.setContent(`${winner.Nombre} ${winner.Apellido}`);
  screen.render();
  speed += 5;
  setTimeout(start, speed);
}

// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', (ch, key) => {
  if (block) return;
  box.style.bg = 'blue';
  text.setContent('Comenzando sorteo...');
  screen.render();

  block = true;

  setTimeout(() => {
    start();
  }, 1500);
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();
