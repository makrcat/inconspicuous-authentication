//@ts-check

import { BODIES_INIT, WORLD_INIT } from "./index.js";


let selectedAminoAcid = "";
export const red_color = "pink";
export const green_color = "lightgreen";


const aminoAcids = {
    "tyrosine": "https://upload.wikimedia.org/wikipedia/commons/d/d3/TyrosineZwitterion3D.png",
    "cysteine": `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cysteine-from-xtal-3D-bs-17.png/1920px-Cysteine-from-xtal-3D-bs-17.png`,
    "tryptophan": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Tryptophan-from-xtal-3D-bs-17.png"
};


function validate(fieldName, value, el) {
    console.log(fieldName + "  \ " + value, el);
    const FN = fieldName.toLowerCase();

    switch (FN) {
        case 'username':
            if (value.length < 3) return 'Username must be at least 3 characters.';
            return null;

        case 'password':
            if (!/\d/.test(value)) return 'Password must contain at least one number.';
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character.';
            return null;


        case 'birthday':
            const month = value.slice(5, 7);
            if (month !== '04') return 'Birthday must be in April :3';
            return null;


        case "verify email":
            if (!/[@]/.test(value)) return 'Email must be valid.';
            return null;


        case 'last four digits of ssn':
            if (value == '6969') return 'Nuhuh.';
            return null;

        case 'terms of affliction':
            if (value == 'false') return 'You must accept the terms of affliction.';
            return null;

        case 'publicity policy':
            if (value == 'false') return 'You must accept the publicity policy. there is no going back now.';
            return null;

        case 'pet rock??':
            if (value == 'false') return 'You must have a pet rock.';
            return null;

        case "mother's maiden name":
            if (value.trim().length === 0) return "Please enter your mother's maiden name.";
            return null;

        case 'grass touched today':
            if (isNaN(value) || Number(value) < 1999) return 'Did not touch grass enough. Go do it';
            return null;

        case 'forfeit newborn':
            if (value == 'false') return 'give';
            return null;

        case 'pipe bomb':
            if (value == 'so cool') return null;
            return 'security failed: miku is disappointed';

         case 'how many roads does a man walk down':
            if (value == '42') return null;
            return 'what is 6 x 9 (this is a reference)';

        case 'codons of this amino acid':
            if (value === selectedAminoAcid) return null;
            return 'No...';

        case 'the bee movie script':
            if (value == 'According to all known laws of aviation, there is no way that a bee should be able to fly') return null;
            return 'According to all known laws of aviation,..';

        default:
            return 'error?';
    }
}


export const spawn_info = {
    "verify email": "textbox",
    "last four digits of SSN": "number",
    "terms of affliction": "checkbox",
    "publicity policy": "checkbox",

    "pet rock??": "checkbox",
    "mother's maiden name": "textbox",
    "grass touched today": "number",
    "forfeit newborn": "checkbox",

    "pipe bomb": "textbox",
    "the bee movie script": "textbox",
    "codons of this amino acid": "custom",
    "how many roads does a man walk down": "number",
}

export const SPAWN_ORDER = [

    "verify email",
    "last four digits of SSN",
    "terms of affliction",
    "publicity policy",

    "pet rock??",
    "mother's maiden name",
    "grass touched today",
    "forfeit newborn",

    "pipe bomb",
    "the bee movie script",
    "codons of this amino acid",
    "how many roads does a man walk down"
]


export function checkThis(fieldName, inputEl) {

    console.log("HI");
    let FN = fieldName.toLowerCase();
    let INPUT = String(inputEl.value);
    if (inputEl.type === 'checkbox') {
        INPUT = String(inputEl.checked);
    }
    // PROBLEM:?

    const valid = validate(FN, INPUT, inputEl);
    inputEl.style.backgroundColor = valid == null ? green_color : red_color;
    inputEl.style.borderRadius = '2px';
    inputEl.style.border = '1px solid black';

    createNotif(valid);
}

export function createPhysBody(elem) {
    const rect = elem.getBoundingClientRect();
    const body = BODIES_INIT.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        Math.max(rect.width, 20),
        Math.max(rect.height, 20),
        { restitution: 0.5, friction: 0.1, frictionAir: 0.02 }
    );


    WORLD_INIT.add(window.world, body);
    elem.style.position = 'absolute';
    return { elem, body };
}

export function createRoundBody(elem) {
    const rect = elem.getBoundingClientRect();
    const radius = Math.max(rect.width, rect.height) / 2;

    const body = BODIES_INIT.circle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        radius,
        { restitution: 0.5, friction: 0.1, frictionAir: 0.02 }
    );

    WORLD_INIT.add(window.world, body);
    elem.style.position = 'absolute';
    elem.style.opacity = 0.75;
    elem.style.border = 'none';

    return { elem, body };
}



export function createTextbox(labelText, top, left) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chaos');
    Object.assign(wrapper.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,

        boxSizing: 'border-box',
        border: '1px dashed gray',

        userSelect: 'none',
        display: 'inline-block'
    });

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.type = 'text';
    input.style.padding = '6px';
    input.style.boxSizing = 'border-box';

    input.addEventListener('input', () => checkThis(labelText, input));

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    document.body.appendChild(wrapper);

    return createPhysBody(wrapper);
}




export function createCheckbox(labelText, top, left) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chaos');
    Object.assign(wrapper.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px dashed gray',
        width: 'unset',
    });

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.style.width = '20px';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.display = 'inline-block';

    input.addEventListener('input', () => checkThis(labelText, input));

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    document.body.appendChild(wrapper);

    return createPhysBody(wrapper);
}



export function createNumberSelector(labelText, top, left) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chaos');
    wrapper.style.display = 'inline-block';
    Object.assign(wrapper.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px dashed gray',
    });

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.type = 'number';
    label.style.display = 'block';
    input.style.width = '95%';

    input.style.padding = '6px';
    input.style.boxSizing = 'border-box';
    input.addEventListener('input', () => checkThis(labelText, input));

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    document.body.appendChild(wrapper);

    return createPhysBody(wrapper);
}



export function createCustom(name, top, left) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chaos');

    Object.assign(wrapper.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        backgroundColor: 'rgb(255, 255, 255, 0.5)',

        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px solid black',

        display: 'flex',
        flexDirection: 'column',
        width: '220px',
        height: '220px',
    });

    const label = document.createElement('label');
    label.textContent = name;
    label.style.display = 'block';
    label.style.marginBottom = '4px';
    wrapper.appendChild(label);

    if (name === "codons of this amino acid") {
        // pick a random amino acid key
        const keys = Object.keys(aminoAcids);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        selectedAminoAcid = randomKey;

        // show the image first
        const img = document.createElement('img');
        img.src = aminoAcids[randomKey];
        img.style.marginTop = '20px';
        img.setAttribute('draggable', 'false');

        img.style.maxWidth = '200px';
        img.style.maxHeight = '150px';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';

        wrapper.appendChild(img);

        // text input for user guess
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Guess the amino acid...';
        input.style.padding = '6px';
        input.style.width = '95%';
        wrapper.appendChild(input);

        input.addEventListener('input', () => {
            const guess = input.value.trim().toLowerCase();
            if (guess === randomKey) {
                input.style.backgroundColor = 'lightgreen';
            } else {
                input.style.backgroundColor = '#eeeeee';
            }
            checkThis(name, input);
        });


    } else if (name == "thingy") {

        const thingy = `<div id="thingy" style="position: absolute; bottom: 0;"></div>`;
        wrapper.innerHTML = thingy;
    } else {
        wrapper.style.height = "auto";
    }

    document.body.appendChild(wrapper);
    return createPhysBody(wrapper);
}


export function createNotif(s, color = red_color, img = "none") {
    // idk why can't use null

    const notification = document.getElementById('vm');
    if (!notification) throw new Error("didn't find notification");
    notification.classList.add("show");


    if (!s) {
        notification.classList.remove("show");
        return;
    }


    if (img === "none") {
        if (color != red_color) notification.style.backgroundColor = color;
        if (s == null) return;

        notification.textContent = s;
        notification.classList.add('show');

        setTimeout(function () {
            notification.classList.remove('show');
        }, 3000)
    } else {

        notification.style.backgroundColor = 'black';
        notification.style.color = 'white';

        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'flex-start';
        notification.style.padding = '10px';

        let imgElem; // string
        imgElem = document.createElement('img');
        imgElem.src = img;

        if (imgElem) {
            imgElem.style.width = '48px';
            imgElem.style.height = '48px';
            imgElem.style.objectFit = 'cover';
            imgElem.style.marginRight = '12px';
            imgElem.style.flexShrink = '0';

            notification.appendChild(imgElem);
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = s;
        notification.appendChild(textSpan);

        setTimeout(function () {
            notification.classList.remove('show');
        }, 3000)
    }
}




function makeButton(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #444;
    min-height: 20px;
    color: white;
    transition: background-color 0.2s;
  `;
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#666');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#444');
    btn.addEventListener('click', () => {
        onClick();
        const notification = document.getElementById('vm2');
        if (!notification) return;

        notification.classList.remove('show');
    });
    return btn;
}

export function createOption(s, color, img, choice1Text, choice1Fn, choice2Text, choice2Fn) {
    const notification = document.getElementById('vm2');
    if (!notification) throw new Error("didn't find notification");
    notification.classList.add("show");

    const notifPanel = document.getElementById('vm');
    if (notifPanel) {
        notifPanel.classList.remove('show');
        notifPanel.innerHTML = '';
    }


    notification.innerHTML = '';
    notification.style.backgroundColor = '';
    notification.style.color = '';
    notification.style.display = '';
    notification.style.alignItems = '';
    notification.style.justifyContent = '';
    notification.style.padding = '';

    if (img) {
        notification.style.backgroundColor = 'black';
        notification.style.color = 'white';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'flex-start';
        notification.style.padding = '10px';

        const imgElem = document.createElement('img');
        imgElem.src = img;
        imgElem.style.width = '48px';
        imgElem.style.height = '48px';
        imgElem.style.objectFit = 'cover';
        imgElem.style.marginRight = '12px';
        imgElem.style.flexShrink = '0';

        notification.appendChild(imgElem);
    } else {
        notification.style.backgroundColor = color;
        notification.style.color = 'inherit';
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = s;
    textSpan.style.flex = '1';
    notification.appendChild(textSpan);

    const btnContainer = document.createElement('div');
    btnContainer.style.marginLeft = '12px';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '8px';

    btnContainer.appendChild(makeButton(choice1Text, choice1Fn));
    btnContainer.appendChild(makeButton(choice2Text, choice2Fn));

    notification.appendChild(btnContainer);
    notification.classList.add('show');
}
