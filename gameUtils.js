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

        case 'codons of this amino acid':
            if (value === selectedAminoAcid) return null;
            return 'No...';

        case 'the bee movie script':
            if (value == 'According to all known laws of aviation, there is no way a bee should be able to fly') return null;
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
    "name this note": "custom",
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
    "name this note"
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


        padding: '1px 4px',
        paddingBottom: '30px',

        width: '200px',
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
    input.style.width = '93%';
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
        paddingRight: '25px',
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
        padding: '1px 4px',
        paddingBottom: '30px',
        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px dashed gray',
        width: 'unset',
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
        padding: '8px',
        backgroundColor: 'rgb(255, 255, 255, 0.5)',

        width: '220px',
        height: '220px',

        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1px solid black',

        display: 'flex',
        flexDirection: 'column',
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

    } else if (name == "name this note") {

    } else if (name == "thingy") {

        const thingy = `<div id="thingy" style="position: absolute; bottom: 0;"></div>`;
        wrapper.innerHTML = thingy;
    } else {
        wrapper.style.height = "auto";
    }

    document.body.appendChild(wrapper);
    return createPhysBody(wrapper);
}


/** @param s { string | null } */
export function createNotif(s, color = red_color) {
    /** @type {HTMLElement | null} */
    const notification = document.getElementById('vm');
    if (!notification) throw new Error("didn't find notification");


    if (color != red_color) notification.style.backgroundColor = color;
    if (s == null) return;


    notification.textContent = s;
    notification.classList.add('show');

    setTimeout(function () {
        notification.classList.remove('show');
    }, 4000)

}


