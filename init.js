//@ts-check
import * as game from './gameUtils.js';
import * as main from './index.js';

export function backgroundText() {

    const el = document.querySelector("#my-text");
    if (el == null || el.textContent == null) {
        console.log("background text configured badly");
        return;
    }

    el.innerHTML = el.textContent
        .split('')
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');

}
export function runAttachValidation() {
    document.querySelectorAll('.chaos').forEach(wrapper => {
        if (wrapper.tagName === 'FIELDSET') return;
        if (wrapper.tagName === 'INPUT') return;

        const label = wrapper.querySelector('label');
        const input = wrapper.querySelector('input');

        if (!label || !input || !label.textContent) { 
            console.log("initial form stuff was configured badly (this error comes from runAttach");
            return;
        }
        input.addEventListener('input', () => game.checkThis(label.textContent, input));
    });
}

export function attachButtonListener() {
    //@ts-ignore
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        main.MORE();
    });
}