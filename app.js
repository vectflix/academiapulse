let myChart = null;
let currentAvatar = "👤";

// 1. INITIALIZE DASHBOARD & CHECK STORAGE
window.onload = () => {
    const savedData = localStorage.getItem('pulse_user_profile');
    if (savedData) {
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        const user = JSON.parse(savedData);
        
        document.getElementById('nav-name').innerText = user.name;
        document.getElementById('nav-avatar').innerText = user.avatar;
        
        initChart();
    }
};

// 2. USER REGISTRATION (LOCAL STORAGE)
function setAvatar(emoji) {
    currentAvatar = emoji;
    const btns = document.querySelectorAll('.av-btn');
    btns.forEach(b => b.style.borderColor = "#334155");
    event.target.style.borderColor = "#00d2ff";
}

function registerUser() {
    const name = document.getElementById('user-name').value;
    const school = document.getElementById('school-name').value;
    
    if(!name || !school) return alert("Please fill in your name and school!");

    const profile = {
        name: name,
        school: school,
        tier: document.getElementById('school-tier').value,
        system: document.getElementById('edu-system').value,
        class: document.getElementById('user-class').value,
        gender: document.getElementById('user-gender').value,
        avatar: currentAvatar
    };

    localStorage.setItem('pulse_user_profile', JSON.stringify(profile));
    location.reload(); // Refresh to launch dashboard
}

// 3. CHARTING ENGINE
function initChart() {
    const ctx = document.getElementById('pulseChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Math', 'English', 'Science', 'Humanity'],
            datasets: [{
                label: 'Performance %',
                data: [0, 0, 0, 0],
                borderColor: '#00d2ff',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00d2ff'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}

// 4. GRADING & POINTS LOGIC (12-POINT SCALE)
function calculateKCSE(score) {
    const aMin = Number(document.getElementById('scale-a').value);
    const cMin = Number(document.getElementById('scale-c').value);

    // Dynamic scale calculation based on user setting
    if (score >= aMin) return { g: 'A', p: 12 };
    if (score >= aMin - 5) return { g: 'A-', p: 11 };
    if (score >= aMin - 10) return { g: 'B+', p: 10 };
    if (score >= aMin - 15) return { g: 'B', p: 9 };
    if (score >= aMin - 20) return { g: 'B-', p: 8 };
    if (score >= cMin) return { g: 'C+', p: 7 };
    if (score >= cMin - 5) return { g: 'C', p: 6 };
    if (score >= cMin - 10) return { g: 'C-', p: 5 };
    if (score >= cMin - 15) return { g: 'D+', p: 4 };
    if (score >= cMin - 20) return { g: 'D', p: 3 };
    if (score >= cMin - 25) return { g: 'D-', p: 2 };
    return { g: 'E', p: 1 };
}

// 5. MAIN ANALYSIS RUNNER
function runAnalysis() {
    const scores = [
        Number(document.getElementById('s1').value || 0),
        Number(document.getElementById('s2').value || 0),
        Number(document.getElementById('s3').value || 0),
        Number(document.getElementById('s4').value || 0)
    ];

    // Update Visuals
    myChart.data.datasets[0].data = scores;
    myChart.update();

    // Calculate Points
    let totalPoints = 0;
    let gradesHTML = "";
    
    scores.forEach((s, i) => {
        const result = calculateKCSE(s);
        totalPoints += result.p;
        gradesHTML += `<span>Sub ${i+1}: <b>${result.g}</b> (${result.p}pts)</span> | `;
    });

    const meanPoints = totalPoints / 4;
    const target = meanPoints + 1.25;

    // Display Stats
    document.getElementById('stats-output').innerHTML = `
        <div class="grades-strip">${gradesHTML}</div>
        <hr style="border: 0.5px solid #334155; margin: 15px 0;">
        <p>Mean Score: <span style="color:#00d2ff; font-size: 1.5rem; font-weight: bold;">${meanPoints.toFixed(2)} Points</span></p>
        <p>Projected Target: <b>${target.toFixed(2)} Points</b></p>
        <p><small>Strategy: Focus on the subject with the lowest deviation.</small></p>
    `;
}

// 6. LOGOUT / RESET
function logout() {
    if(confirm("Are you sure? This will delete your profile data!")) {
        localStorage.removeItem('pulse_user_profile');
        location.reload();
    }
        }

