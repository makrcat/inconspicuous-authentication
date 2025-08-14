//@ts-check

import * as game from './gameUtils.js';
import * as init from './init.js';
import * as lights from './lights.js';
let debug_override = false;

//@ts-ignore
export const { Engine: ENGINE_INIT, Bodies: BODIES_INIT, World: WORLD_INIT, Mouse: MOUSE_INIT, MouseConstraint } = Matter;

let baby = null;
// @ts-ignore
let fieldset = document.getElementsByTagName('fieldset')[0];
let fieldsetBg = 'unchanged';


window.engine = ENGINE_INIT.create();
window.world = window.engine.world;


window.engine = ENGINE_INIT.create();
window.world = window.engine.world;


let physicsObjects = [];

let spawn_info = game.spawn_info;

// run some errands
init.runAttachValidation();
init.attachButtonListener();
init.backgroundText();

let fieldsetBody = null;
let batteryBody = null;

function runAttachPhysics() {
    console.log("is this the problem");
    document.querySelectorAll('.chaos').forEach(elem => {
        const obj = game.createPhysBody(elem);

        if (elem.tagName === 'FIELDSET') {
            const { elem, body } = obj;
            fieldsetBody = body;
        }
        console.log(obj);
        console.log("still goin");
        physicsObjects.push(obj);
    });
}

runAttachPhysics();


let battery = document.getElementById("battery");

let batteryToRemove = false;
function checkBatterySnap() {

    if (!(fieldsetBg === 'changed')) return false;


    if (!batteryBody || !fieldsetBody || !battery) return false;

    //@ts-ignore
    const collision = Matter.SAT.collides(batteryBody, fieldsetBody);
    if (collision && collision.collided) {

        batteryToRemove = true;
        return true;

    }

    return false;


}


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


let nextIndex = 0;
let step = document.getElementById("step");

function incrementIndex() {
    console.log(nextIndex);
    nextIndex++;
    console.log("incremented,", nextIndex);

    //
    if (step == null) {
        console.log("couldn't find");
        return;
    }
    step.innerHTML = nextIndex.toString();
}

function noMoreMarbles() {
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

}


export function MORE() {

    console.log("okok");

    const startX = window.innerWidth / 2 - 330;


    if (nextIndex < 12) {
        // ha ok fix uh
        // ;..


        for (const obj of physicsObjects) {
            const input = obj.elem.querySelector('input');
            if (!input) continue;

            const bg = input.style.backgroundColor;
            if (bg !== game.green_color) {
                return false;
            }
        }


        console.log(game.SPAWN_ORDER);

        for (let i = 0; i < 4; i++) {

            console.log("I spawned")
            const labelText = game.SPAWN_ORDER[nextIndex + i];
            console.log("this one", labelText, nextIndex + i);
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

         
            

        }

incrementIndex();
incrementIndex();
incrementIndex();
incrementIndex();


    } else if (nextIndex == 12) {
        itsmarbletime();
        incrementIndex();
    } else if (nextIndex == 13) {
        console.log(marblesok, debug_override);

        if (marblesok || debug_override) {
            game.createNotif("Thanks.. I'll take those now", "darkgray");
            setTimeout(function () {
                game.createNotif("Whew. I've had enough of this for a day, haven't you?");
            }, 4000);
            setTimeout(function () {
                game.createNotif("I'm gonna pop out for a bit. Keep yourself comfortable.");
            }, 8000);

            setTimeout(function () {

                for (let i = physicsObjects.length - 1; i >= 0; i--) {
                    const { elem, body } = physicsObjects[i];
                    if (!elem) {
                        console.log(`Skipping physicsObjects[${i}] because element is missing`);
                        continue;
                    }

                    const tag = elem.tagName.toLowerCase();
                    console.log(`Inspecting element[${i}]: <${tag}>`);

                    if (
                        tag === 'fieldset'
                    ) {
                        console.log(`Skipping <${tag}> at index ${i} (fieldset)`);
                        continue;
                    }

                    console.log(`Removing element at index ${i}: <${tag}>`);


                    elem.remove();
                    WORLD_INIT.remove(window.world, body);

                    physicsObjects.splice(i, 1);
                }


            }, 9000);

            setTimeout(function () {
                const thingggg = document.getElementById("thingy");
                // @ts-ignore
                thingggg.style.display = "block";

                const obj = game.createPhysBody(thingggg);
                physicsObjects.push(obj);

            }, 10000)



            setTimeout(function () {
                baby = document.createElement('img');
                baby.src = 'idle1.png';
                baby.alt = 'weird baby';

                baby.classList.add('baby');
                baby.style.border = '1px dashed black';
                baby.style.width = '123px';
                baby.style.height = '121px';
                baby.draggable = false;
                baby.addEventListener('dragstart', e => e.preventDefault());
                baby.style.display = 'block';
                document.body.appendChild(baby);
            }, 15000);





            setTimeout(function () { 
                dialogue();
            }, 18000);

            ///1000)

            noMoreMarbles();

            incrementIndex();


        } else {
            game.createNotif("Hey, there're still marbles on the floor.");
        }
    }
}



function dialogue() {



    game.createOption(
        "Yo lemme show you a magic trick", "black", "idle1.png",
        "Ok",
        () => {
            setTimeout(function () {
                game.createNotif("Ok cool", "black", "idle1.png")
            }, 1000);


            const imgsToPreload = ['battery1.png', 'battery2.png', 'sleep2.png', 'sleep3.png'];

            let loadedCount = 0;
            imgsToPreload.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === imgsToPreload.length) {

                        // All images loaded
                        setTimeout(() => {
                            baby.src = "battery1.png";
                            baby.classList.add('move-up');
                        }, 3000);

                        setTimeout(() => {
                            baby.src = "battery2.png";
                        }, 4000);

                        setTimeout(() => {
                            const battery = document.getElementById("battery");
                            if (!battery) {
                                console.log("nuh");
                                return;
                            }
                            battery.style.display = "block";
                            const babyRect = baby.getBoundingClientRect();

                            battery.style.position = 'absolute';
                            battery.style.left = `${babyRect.left + window.scrollX + 20}px`;
                            battery.style.top = `${babyRect.top + window.scrollY + 20}px`;
                            battery.draggable = false;
                            battery.addEventListener('dragstart', e => e.preventDefault());

                            const physBody = game.createPhysBody(battery);

                            physicsObjects.push(physBody);


                            batteryBody = physBody.body;
                            physicsObjects.push(physBody);


                            fieldset.style.cursor = "pointer";
                            fieldset.onclick = () => {
                                fieldsetBg = 'changed';

                                fieldset.style.backgroundColor = 'white';
                                fieldset.style.backgroundImage = `url('stripe-02.png')`;


                                const style = document.createElement('style');
                                style.textContent = `
                                        fieldset::after {
                                        content: none !important;
                                        }
                                        `;
                                document.head.appendChild(style);
                                // -------- wires 

                                const img = document.createElement('img');

                                img.src = 'wires_side.png';
                                img.style.position = 'absolute';
                                img.style.top = '20px';
                                img.style.right = '-50px';
                                img.style.width = '50px';
                                img.style.height = 'auto';


                                fieldset.appendChild(img);



                                fieldset.style.border = '1px solid red';

                                fieldset.onclick = null;

                                setTimeout(() => {
                                    const crt = document.getElementById("crt")
                                    if (crt) {
                                        crt.style.display = "block";
                                        crt.style.animation = "crtOn 1.5s ease-in forwards";
                                    }

                                })
                                // no more clicking :)

                            }



                            incrementIndex();

                        }, 5000);



                        setTimeout(() => {
                            baby.src = "sleep2.png";
                            baby.classList.remove('move-up');
                            baby.classList.add('move-down');
                        }, 9000);

                        setTimeout(() => {
                            baby.src = "sleep3.png";
                        }, 10000);
                    }
                };
                img.onerror = () => {
                    alert("ok the images dont load :/")
                }
            });

        },
        "No",
        () => {
            setTimeout(function () {
                game.createNotif("Eternal damnation.", "black", "idle1.png")
            }, 1000);

            setTimeout(function () {
                window.close()
            }, 5000)
        }
    );

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

window.running = false;





//// ----------- ahhuahauhauh
function startPhysics() {

    document.querySelectorAll('fieldset').forEach(fs => {
        fs.style.transition = 'none';
        fs.style.animation = 'none';
    });

    if (window.running) return;
    window.running = true;
    ENGINE_INIT.run(window.engine);

    (function update() {

        if (nextIndex == 13) {
            offFloor();
        }

        else if (nextIndex == 15 || debug_override) {
            if (checkBatterySnap()) {
                if (batteryToRemove && battery) {
                    batteryToRemove = false;

                    WORLD_INIT.remove(window.world, batteryBody);

                    battery.remove();

                    const newBattery = document.createElement("img");
                    newBattery.src = "battery.png";  // your path here
                    newBattery.alt = "Battery";
                    newBattery.style.position = "absolute";
                    newBattery.style.width = "40px";
                    newBattery.style.height = "auto";

                    newBattery.style.right = `-40px`;
                    newBattery.style.top = `115px`;

                    // fieldset.style.position = 'relative'; GRRR
                    fieldset.appendChild(newBattery);

                    const idx = physicsObjects.findIndex(o => o.body === batteryBody);
                    if (idx !== -1) physicsObjects.splice(idx, 1);

                    batteryBody = null;
                    battery = null;

                    lights.LIGHTS();
                    incrementIndex(); // stop this update loop now 

                }


            }


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




function debug(skip_to) {
    for (let i = 0; i < skip_to; i++) {

        document.querySelectorAll('.chaos').forEach(elem => {
            const input = elem.querySelector('input');
            if (input) {
                //@ts-ignore
                input.style.backgroundColor = game.green_color;
            }
        });
        MORE();
    }


    debug_override = true;

    console.log(`Ran MORE() ${skip_to} times.`);
}

//@ts-ignore
window.debug = debug;


export function clearit() {
    if (!physicsObjects || physicsObjects.length === 0) return;

    for (let i = physicsObjects.length - 1; i >= 0; i--) {
        const obj = physicsObjects[i];
        const { elem, body } = obj;

        if (elem && elem.parentElement) {
            elem.parentElement.removeChild(elem);
        }

        if (body) {
            WORLD_INIT.remove(window.world, body);
        }

        physicsObjects.splice(i, 1);
    }

    physicsObjects = [];
}