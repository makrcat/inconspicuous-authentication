const host = document.getElementById('thingy');
const shadow = host.attachShadow({ mode: 'open' });

// This stays a plain HTML string
const thingyHTML = `
        <div style="position: absolute; width: 300px; bottom: 20px;">
        </div>

        <div style="width: 100%; height: 20px; 
    position: absolute; bottom: 0;
    background-color: rgb(183, 170, 126)"></div>

        <svg id="ui" viewBox="20 -310 500 365"
 role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"
            aria-valuenow="50" aria-label="Snake slider" class="snake-slider" style="position: absolute; bottom: 22px;">

            <!-- track border path -->
            <path id="track-border"
                d="M 39 43 C 42 -135 42 -159 44 -238 S 140 -325 142 -240 S 235 -154 235 -239 S 321 -323 323 -238 S 414 -158 415 -238 S 502 -320 502 -237 S 501 -158 505 45"
                stroke="#b2b2b2" stroke-width="12" fill="none" stroke-linecap="round" />

            <path id="track"
                d="M 39 43 C 42 -135 42 -159 44 -238 S 140 -325 142 -240 S 235 -154 235 -239 S 321 -323 323 -238 S 414 -158 415 -238 S 502 -320 502 -237 S 501 -158 505 45"
                stroke="#efefef" stroke-width="8" fill="none" stroke-linecap="round" />


            <path id="progress" class="progress-red" d="" />
            <circle id="thumb" r="12" cx="0" cy="0" class="thumb-red"></circle>


        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="62 -250 390 310" class="snake-slider" data-label-id="val1"
            role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
            aria-label="Snake slider" style="position: absolute; bottom: 12px; left: 20px; width: 230px;">

            <!-- Track path -->
            <path id="track-border"
                d="M 75 42 C 80 -137 82 -179 178 -223 S 390 -224 261 -171 S 185 -197 258 -206 S 362 -137 254 -99 S 213 -148 284 -146 S 434 -101 436 41"
                stroke="#b2b2b2" stroke-width="12" fill="none" stroke-linecap="round" />

            <path id="track"
                d="M 75 42 C 80 -137 82 -179 178 -223 S 390 -224 261 -171 S 185 -197 258 -206 S 362 -137 254 -99 S 213 -148 284 -146 S 434 -101 436 41"
                stroke="#efefef" stroke-width="8" fill="none" stroke-linecap="round" />

            <!-- Progress path -->
            <path id="progress" d="" class="progress-green more-segments" stroke-width="8" fill="none"
                stroke-linecap="round" />

            <!-- Thumb -->
            <circle id="thumb" r="12" cx="0" cy="0" class="thumb-green" />

        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 -75 290 130"
 class="snake-slider" data-label-id="val2"
            role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
            aria-label="Snake slider" style="position: absolute; bottom: 18px; left: 35px; width: 170px">

            <!-- Track path -->
            <path id="track-border" d="M 75 40 C 78 -66 147 -68 162 -27 S 220 12 233 -29 S 330 -71 334 39"
                stroke="#b2b2b2" stroke-width="12" fill="none" stroke-linecap="round" />

            <path id="track" d="M 75 40 C 78 -66 147 -68 162 -27 S 220 12 233 -29 S 330 -71 334 39" stroke="#efefef"
                stroke-width="8" fill="none" stroke-linecap="round" />

            <!-- Progress path -->
            <path id="progress" d="" class="progress-orange" stroke-width="8" fill="none" stroke-linecap="round" />

            <!-- Thumb -->
            <circle id="thumb" r="12" cx="0" cy="0" class="thumb-orange" />

        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="112 -132 125 185" class="snake-slider" data-label-id="val2"
            role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
            aria-label="Snake slider" style="position: absolute; bottom: 19px; left: 215px; width: 70px">

            <!-- Track path -->
            <path id="track-border" d="M 124 40 C 123 -74 129 -115 166 -117 S 216 -89 220 40" stroke="#b2b2b2"
                stroke-width="12" fill="none" stroke-linecap="round" />

            <path id="track" d="M 124 40 C 123 -74 129 -115 166 -117 S 216 -89 220 40" stroke="#efefef" stroke-width="8"
                fill="none" stroke-linecap="round" />

            <!-- Progress path -->
            <path id="progress" d="" class="progress-blue" stroke-width="8" fill="none" stroke-linecap="round" />

            <!-- Thumb -->
            <circle id="thumb" r="12" cx="0" cy="0" class="thumb-blue" />

        </svg>





    </div>
`;

// Fetch and inject CSS + HTML
fetch('thingy.css')
    .then(res => res.text())
    .then(css => {
        shadow.innerHTML = `<style>${css}</style>${thingyHTML}`;
        shadow.querySelectorAll('.snake-slider').forEach(svg => makeTrackable(svg));
    });

function makeTrackable(svg) {
    const track = svg.querySelector('#track');
    const progress = svg.querySelector('#progress');
    const thumb = svg.querySelector('#thumb');
    const pathLen = track.getTotalLength();
    const MIN = 0;
    const MAX = 80;

    function valueToLength(v) {
        return ((v - MIN) / (MAX - MIN)) * pathLen;
    }
    function lengthToValue(len) {
        return Math.round(MIN + (len / pathLen) * (MAX - MIN));
    }
    function placeThumbByValue(v) {
        const len = valueToLength(v);
        const p = track.getPointAtLength(len);
        thumb.setAttribute('cx', p.x);
        thumb.setAttribute('cy', p.y);
        updateProgressPath(len);
        svg.setAttribute('aria-valuenow', v);
    }


    function updateProgressPath(len) {
        let d = '';
        let sampleCount = MAX;
        if (track.classList.contains("more-segments")) {
            sampleCount = 230
        }
        for (let i = 0; i <= sampleCount; i++) {
            const sampleLen = (i / sampleCount) * len;
            const pt = track.getPointAtLength(sampleLen);
            d += (i === 0 ? `M${pt.x} ${pt.y}` : ` L${pt.x} ${pt.y}`);
        }
        progress.setAttribute('d', d);
    }

    function nearestLengthToPoint(x, y, samples = 40) {
        let best = 0, bestDist = Infinity;
        for (let i = 0; i <= samples; i++) {
            const pos = track.getPointAtLength((i / samples) * pathLen);
            const dx = pos.x - x, dy = pos.y - y;
            const d = dx * dx + dy * dy;
            if (d < bestDist) { bestDist = d; best = (i / samples) * pathLen; }
        }
        return best;
    }


    function updateFromPointer(e) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        const nearestLen = nearestLengthToPoint(svgP.x, svgP.y);
        placeThumbByValue(lengthToValue(nearestLen));
    }

    let dragging = false;

    let rafId = null;
    let latestEvent = null;

    function onUpdate() {
        if (latestEvent) {
            updateFromPointer(latestEvent);
            latestEvent = null;
            rafId = requestAnimationFrame(onUpdate);
        } else {
            rafId = null;
        }
    }

    svg.addEventListener('pointerdown', (e) => {
        progress.classList.add('darker');
        thumb.classList.add('darker');
        svg.setPointerCapture(e.pointerId);
        dragging = true;
        updateFromPointer(e);
    });

    svg.addEventListener('pointerup', (e) => {
        progress.classList.remove('darker');
        thumb.classList.remove('darker');
        dragging = false;
        svg.releasePointerCapture(e.pointerId);
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });

    svg.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        latestEvent = e;
        if (!rafId) {
            rafId = requestAnimationFrame(onUpdate);
        }
    });

    placeThumbByValue(60);
}


