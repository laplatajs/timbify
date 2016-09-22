'use strict';

const blessed = require('blessed');
const csvParse = require('csv-parse/lib/sync');
const uniq = require('uniq');
const fs = require('fs');

if (!process.argv[2]) throw 'dame un archivo csv!!';
const filepath = process.argv[2];

const list = csvParse(fs.readFileSync(filepath), { columns: true });

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let speed = 1;

// remove dupes
/*console.log('list: ', list.length)
const dedupeList = uniq(list, (data1, data2) => {
    return (data1.Nombre.toLowerCase() !== data2.Nombre.toLowerCase() &&
    data1.Apellido.toLowerCase() !== data2.Apellido.toLowerCase() );
}, false);
console.log('dedupeList: ', dedupeList.length)*/

function start() {

    const winner = list[getRandom(0, list.length)];

    if (speed > 300) {

        //box.setContent( '{center}Tenemos un ganador!!!! =>{/center}' );
        box.style.bg = 'green';
        box.setText( `{center}${winner.Nombre} ${winner.Apellido}{/center}` );
        screen.render();
        return;
    }

    box.setText(`{center}${winner.Nombre} ${winner.Apellido}{/center}`);
    screen.render();
    speed = speed + 5;
    setTimeout(start, speed);
}


// Create a screen object.
var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'La timba de LaPlataJS';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
    top: 'center',
    left: 'center',
    align: 'center',
    width: '50%',
    height: '50%',
    content: '{center}La timba de LaPlataJS{/center}\n',
    tags: true,
    padding: 5,
    border: {
        type: 'line'
    },
    cursor: {
        artificial: false
    },
    style: {
        fg: 'white',
        bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        }
    }
});


// Append our box to the screen.
screen.append(box);

// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', function (ch, key) {
    box.setContent(' {right}Comenzando sorteo...{/black-fg}.{/right}\n');
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