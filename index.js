//@ts-check

import * as game from './gameUtils.js';
import * as init from './init.js';

//@ts-ignore
export const { Engine: ENGINE_INIT, Bodies: BODIES_INIT, World: WORLD_INIT, Mouse: MOUSE_INIT, MouseConstraint } = Matter;

window.engine = ENGINE_INIT.create();
window.world = window.engine.world;


window.engine = ENGINE_INIT.create();
window.world = window.engine.world;


const physicsObjects = [];

let spawn_info = game.spawn_info;

// run some errands
init.runAttachValidation();
init.attachButtonListener();
init.backgroundText();

function runAttachPhysics() {
    console.log("is this the problem");
    document.querySelectorAll('.chaos').forEach(elem => {
        const obj = game.createPhysBody(elem);
        console.log(obj);
        console.log("still goin");
        physicsObjects.push(obj);
    });
}

runAttachPhysics();



function losingMarbles(top, left, cdeg = 120) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chaos');

    Object.assign(wrapper.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '0px',


        width: '22px',
        height: '22px',

        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px solid black',

        borderRadius: '50%',
    });

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.style.width = '20px';
    radio.style.height = '20px';
    radio.style.cursor = 'pointer';
    radio.style.padding = '0px';
    radio.style.margin = '0px';
    radio.style.left = '0px';
    radio.style.right = '0px';
    radio.style.top = '0px';
    radio.style.bottom = '0px';
    radio.style.outline = 'none';
    radio.style.display = 'block';
    radio.style.verticalAlign = 'middle';
    radio.style.filter = `hue-rotate(${cdeg}deg)`;
    radio.checked = true;

    wrapper.appendChild(radio);
    document.body.appendChild(wrapper);

    // ROUND
    return game.createRoundBody(wrapper);
}

let marbles = [];
let marblesok = false;
let mel = null;

function itsmarbletime() {
    game.createNotif("I lost my marbles. Please pick them back up. Thanks");
    const startX = -20;
    const startY = -20;
    const count = 50;

    for (let i = 0; i < count; i++) {
        const x = startX + Math.random() * 100;
        const y = startY + Math.random() * 100;

        const color = Math.floor(Math.random() * 360);
        const marble = losingMarbles(y, x, color);

        marbles.push(marble);
        physicsObjects.push(marble);

        //@ts-ignore
        Matter.Body.setVelocity(marble.body, {
            x: 5 + Math.random() * 10,  // rightward velocity
            y: 5 + Math.random() * 10,   // downward velocity
        });
    }

    let marblechecker = game.createCustom("please pick up all the marbles off the floor", 300, 300);
    let { elem, body } = marblechecker;
    mel = elem;
    physicsObjects.push(marblechecker);




    physicsObjects.forEach(({ elem, body }) => {
        const { position, angle } = body;
        //@ts-ignore
        Matter.Body.setVelocity(body, { x: (Math.random() * 3 - 1.5), y: (Math.random() * 6 - 3) });
        //@ts-ignore
        Matter.Body.setAngularVelocity(body, angle + (Math.random() * 1 - 0.5) * Math.PI);

    });
}


function offFloor() {
    marblesok = true;
    for (const m of marbles) {
        const { elem, body } = m;
        //@ts-ignore yes yes depreciatedi know
        let collision = Matter.SAT.collides(body, ground);

        if (collision) {
            marblesok = false;
            elem.style.opacity = 0.25;
            elem.style.border = '1px solid red';
        } else {
            elem.style.opacity = 0.75;
            elem.style.border = 'none';
        }

    }

    if (marblesok) {
        mel.style.backgroundColor = game.green_color;
    } else {
        mel.style.backgroundColor = game.red_color;
    }
}


let curIndex = 0;

export function MORE() {

    for (const obj of physicsObjects) {
        const input = obj.elem.querySelector('input');
        if (!input) continue;

        const bg = input.style.backgroundColor;
        if (bg !== game.green_color) {
            return false;
        }
    }

    const keys = Object.keys(spawn_info);
    const startX = window.innerWidth / 2 - 330;


    if (curIndex < 12) {

        for (let i = 0; i < 4; i++) {

            const labelText = keys[curIndex + i];
            // maybe this is unordered.?? is that the bug? #bug
            const type = spawn_info[labelText];

            const x = startX + i * 180;
            const y = 50;

            let obj;
            if (type === 'textbox') obj = game.createTextbox(labelText, y, x);
            else if (type === 'checkbox') obj = game.createCheckbox(labelText, y, x);
            else if (type === 'number') obj = game.createNumberSelector(labelText, y, x);
            else if (type === 'custom') obj = game.createCustom(labelText, y, x);
            // else if (type === 'captcha') obj = createCaptcha(labelText, y, x);
            else continue; // skip if unknown type

            physicsObjects.push(obj);
            curIndex++;
        }
    } else if (curIndex == 12) {
        itsmarbletime();
        curIndex++;
    } else if (curIndex == 13) {
        if (marblesok) {
            game.createNotif("Thanks.. I'll take those now");

            for (const m of marbles) {
                const idx = physicsObjects.indexOf(m);
                // it should be in there.
                if (idx !== -1) {
                    physicsObjects.splice(idx, 1);
                } else {
                    console.log("somehow, while removing the marble, it doesn't exist?");
                }
                // remove from rendering lol


                let { elem, body } = m;
                WORLD_INIT.remove(window.world, body);
                elem.remove(); // remove from dom
            }

            curIndex++;
        }
    }
}


// Physics setup

const ground = BODIES_INIT.rectangle(
    window.innerWidth / 2,
    window.innerHeight - 25,
    window.innerWidth,
    50,
    { isStatic: true }
);
WORLD_INIT.add(window.world, ground);

// left wall
const leftWall = BODIES_INIT.rectangle(
    25, 
    window.innerHeight / 2, 
    50, 
    window.innerHeight,
    { isStatic: true }
);

// right wall
const rightWall = BODIES_INIT.rectangle(
    window.innerWidth - 25, 
    window.innerHeight / 2, 
    50, 
    window.innerHeight, 
    { isStatic: true }
);


WORLD_INIT.add(window.world, [leftWall, rightWall]);


const mouse = MOUSE_INIT.create(document.body);
const mouseConstraint = MouseConstraint.create(window.engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
});
WORLD_INIT.add(window.world, mouseConstraint);

let running = false;

function startPhysics() {
    if (running) return;
    running = true;
    ENGINE_INIT.run(window.engine);

    (function update() {

        if (curIndex == 13) {
            offFloor();
        }

        physicsObjects.forEach(({ elem, body }) => {
            const { position, angle } = body;
            // fell off
            if (position.y > window.innerHeight + 100 || position.x < -100 || position.x > window.innerWidth + 100) {
                //@ts-ignore
                Matter.Body.setPosition(body, {
                    x: Math.random() * window.innerWidth,
                    y: -50
                });
                //@ts-ignore
                Matter.Body.setVelocity(body, { x: 0, y: 0 });
                //@ts-ignore
                Matter.Body.setAngularVelocity(body, 0);
            }

            elem.style.left = `${position.x - elem.offsetWidth / 2}px`;
            elem.style.top = `${position.y - elem.offsetHeight / 2}px`;
            elem.style.transform = `rotate(${angle}rad)`;
        });
        requestAnimationFrame(update);
    })();
}

window.addEventListener('click', function onFirstClick() {
    startPhysics();
    window.removeEventListener('click', onFirstClick);
});