'use strict';

const blessed = require('blessed');
const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');

if (!process.argv[2]) throw 'dame un archivo csv!!';
const filepath = process.argv[2];

const list = csvParse(fs.readFileSync(filepath), { columns: true });

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let speed = 1;

function start() {
    const winner = list[getRandom(0, list.length)];

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (speed > 200) {

        box.setContent( `Tenemos un ganador!!!! =>
            ${winner.Nombre} ${winner.Apellido}`
        );
        screen.render();

        return;
    }

    // process.stdout.write(`${winner.Nombre} ${winner.Apellido}`);

    box.setContent(`${winner.Nombre} ${winner.Apellido}`);
    screen.render();
    speed = speed + 5;
    setTimeout(start, speed);
}


// Create a screen object.
var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    content: 'La timba de LaPlataJS',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});

// Append our box to the screen.
screen.append(box);

// Add a png icon to the box
var icon = blessed.image({
    parent: box,
    top: 0,
    left: 0,
    type: 'overlay',
    width: 'shrink',
    height: 'shrink',
    search: false
});

// If our box is clicked, change the content.
/*box.on('click', function (data) {
    box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}');
    screen.render();
});*/

// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', function (ch, key) {
    box.setContent('{right}Comenzando sorteo...{/black-fg}.{/right}\n');
    //box.setLine(1, 'bar');
    //box.insertLine(1, 'foo');
    start();
    screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();