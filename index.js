'use strict';

const blessed = require('blessed');
const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');

if (!process.argv[2]) throw 'dame un archivo csv!!';
const filepath = process.argv[2];

const list = csvParse(fs.readFileSync(filepath), { columns: true });

// Create a screen object.
const screen = blessed.screen({
    smartCSR: true
});

// Create a box perfectly centered horizontally and vertically.
const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: '{center}{cyan-bg}La timba de LaPlataJS{/cyan-bg}{/center}',
    tags: true,
    padding: 5,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'magenta',
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
    bg: 'magenta'
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
    const current = getRandom(0, list.length)
    const winner = list[current];

    if (speed > 200) {
        box.style.bg = 'green';
        box.setContent('{center}Tenemos un ganador!!{/center}');
        text.setContent(`${winner.Nombre} ${winner.Apellido}`);
        list.splice(current,1)
        text.style.bold = true;

        screen.render();
        speed = 1;
        block = false;
        return;
    }

    text.setContent(`${winner.Nombre} ${winner.Apellido}`);
    screen.render();
    speed = speed + 5;
    setTimeout(start, speed);
}

// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', function (ch, key) {
    if (block) return;

    text.setContent('Comenzando sorteo...');
    screen.render();

    block = true;

    setTimeout(() => {
        start();
    }, 1500);
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();
