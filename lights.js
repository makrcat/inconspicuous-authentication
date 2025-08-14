
import * as main from './index.js';
const SIZE = 5;


// 5x5 boolean grid to track light states
const lightsArray = [
    [false, false, true, false, true],
    [false, true, false, false, false],
    [true, true, false, false, true],
    [false, false, false, false, false],
    [false, false, false, false, false]
]

// Toggle neighbors (up, down, left, right)
function toggleNeighbors(row, col) {
    const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
    ];

    neighbors.forEach(([r, c]) => {
        if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
            lightsArray[r][c] = !lightsArray[r][c];
        }
    });
}

function allDark() {
    let allTrue = true;
    for (const line of lightsArray) {
        for (const light of line) {
            if (!light) allTrue = false;
        }
    }
    return allTrue;
}


function updateCheckboxes() {


    const checkboxes = document.querySelectorAll('#lightsOutGrid input[type="checkbox"]');
    const rects = document.querySelectorAll('#container .rect');

    Array.from(checkboxes).forEach((checkbox, idx) => {
        const row = Math.floor(idx / SIZE);
        const col = idx % SIZE;

        checkbox.checked = lightsArray[row][col];

        if (rects[idx]) {
            if (lightsArray[row][col]) {
                rects[idx].style.visibility = 'visible'; // show rect
            } else {
                rects[idx].style.visibility = 'hidden';  // hide rect
            }
        }
    });





    if (allDark()) {
        setTimeout(function () {
            window.running = false;


            const rects = document.querySelectorAll('#container .rect');
            rects.forEach(r => r.remove());


            const crt = document.getElementById('crt');
            if (crt) {

                crt.style.backgroundImage = 'none';
                crt.style.backdropFilter = 'none';
                crt.style.backgroundColor = 'transparent';

                document.getElementById("visiblethis").display = 'block';

                document.body.style.backgroundImage =
                    "conic-gradient(white 0% 25%, #f1e4e4 25% 50%, white 50% 75%, #f1e4e4 75% 100%)";
                document.body.style.backgroundSize = "50px 50px";
                document.body.style.backgroundRepeat = "repeat";
                document.body.style.animation = "moveCheckerboard 90s linear infinite";
            }

            main.clearit();
            document.getElementById("log").innerHTML = "c on g r atu l ations!!!"

        }, 2000);
    }
}

// Main function to create the grid and wire up events
export function LIGHTS() {
    const fieldset = document.getElementsByTagName("fieldset")[0];
    if (!fieldset) return;


    const grid = document.createElement('div');
    grid.id = 'lightsOutGrid';
    grid.style.display = 'grid';


    grid.style.gridTemplateColumns = `repeat(${SIZE}, 25px)`;
    grid.style.gridTemplateRows = `repeat(${SIZE}, 25px)`;

    grid.style.width = `${SIZE * 25 + (SIZE - 1) * 5}px`;
    grid.style.height = `${SIZE * 25 + (SIZE - 1) * 5}px`;


    grid.style.gap = '5px';
    grid.style.position = 'relative';

    grid.style.border = '2px dashed black';

    grid.style.margin = 'auto';

    for (let i = 0; i < SIZE * SIZE; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.style.cursor = 'pointer';
        checkbox.style.display = 'block';

        checkbox.style.width = '14px';
        checkbox.style.height = '14px';
        checkbox.style.margin = 'auto';
        checkbox.style.padding = 'auto';


        const row = Math.floor(i / SIZE);
        const col = i % SIZE;

        checkbox.addEventListener('click', () => {
            lightsArray[row][col] = checkbox.checked;
            toggleNeighbors(row, col);
            updateCheckboxes();
        });

        grid.appendChild(checkbox);
    }

    fieldset.appendChild(grid);
    updateCheckboxes();
}






const container = document.getElementById('container');

for (let i = 0; i < 25; i++) {
    const rect = document.createElement('div');
    rect.classList.add('rect');
    container.appendChild(rect);
}