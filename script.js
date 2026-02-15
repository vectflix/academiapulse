
// ---------- PERIODIC ----------
const elementData = [
"H","He","Li","Be","B","C","N","O","F","Ne",
"Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca"
];

const periodicDiv = document.getElementById("periodic");
if (periodicDiv) {
    elementData.forEach(el => {
        const div = document.createElement("div");
        div.className = "element";
        div.innerText = el;
        div.onclick = () => alert("Element: " + el);
        periodicDiv.appendChild(div);
    });
}

// ---------- HUMAN BODY ----------
function showOrgan(info) {
    document.getElementById("organInfo").innerText = info;
}

// ---------- CLIMATE ----------
const ctx = document.getElementById("climateChart");
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["2000","2005","2010","2015","2020","2025"],
            datasets: [{
                label: "Global Temp (°C)",
                data: [14.1,14.3,14.5,14.8,15.1,15.4],
                borderWidth: 2
            }]
        }
    });
}

// ---------- DISEASE SIMULATION ----------
let canvas = document.getElementById("simCanvas");
let particles = [];
let infectedCount = 1;

function initSim() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            dx: (Math.random()-0.5)*2,
            dy: (Math.random()-0.5)*2,
            infected: i === 0
        });
    }

    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

            particles.forEach(other => {
                let dist = Math.hypot(p.x-other.x, p.y-other.y);
                if (dist < 10 && p.infected) {
                    other.infected = true;
                }
            });

            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
            ctx.fillStyle = p.infected ? "red" : "lime";
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function resetSim() {
    initSim();
}

initSim();
