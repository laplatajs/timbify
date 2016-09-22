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

    if (speed > 400) {
        process.stdout.write(`Tenemos un ganador!!!! => ${winner.Nombre} ${winner.Apellido}`);
        process.stdout.write('\n\n');
        return;
    }

    process.stdout.write(`${winner.Nombre} ${winner.Apellido}`);

    speed = speed + 5;
    setTimeout(start, speed);
}

process.stdout.write('\n');
start();
