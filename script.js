
// -------- Periodic --------
const elements = ["H","He","Li","Be","B","C","N","O","F","Ne"];
const grid = document.getElementById("periodicGrid");
if (grid) {
    grid.style.display="grid";
    grid.style.gridTemplateColumns="repeat(auto-fit,minmax(60px,1fr))";
    grid.style.gap="8px";
    elements.forEach(el=>{
        let d=document.createElement("div");
        d.innerText=el;
        d.style.background="#1e293b";
        d.style.padding="15px";
        d.style.borderRadius="6px";
        d.style.cursor="pointer";
        d.onclick=()=>alert("Element: "+el);
        grid.appendChild(d);
    });
}

// -------- Body --------
function showOrgan(text){
    document.getElementById("organInfo").innerText=text;
}

// -------- Climate --------
const slider=document.getElementById("yearSlider");
if(slider){
    const temps={2000:14.1,2005:14.3,2010:14.5,2015:14.8,2020:15.1,2025:15.4};
    slider.oninput=function(){
        document.getElementById("yearValue").innerText=this.value;
        document.getElementById("tempDisplay").innerText="Global Temp: "+(temps[this.value]||"No Data")+" °C";
    };
}

// -------- Disease --------
const canvas=document.getElementById("simCanvas");
if(canvas){
    const ctx=canvas.getContext("2d");
    const slider=document.getElementById("popSlider");
    let particles=[];

    function init(pop){
        particles=[];
        for(let i=0;i<pop;i++){
            particles.push({
                x:Math.random()*canvas.width,
                y:Math.random()*canvas.height,
                dx:(Math.random()-0.5)*2,
                dy:(Math.random()-0.5)*2,
                infected:i===0
            });
        }
    }

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{
            p.x+=p.dx;
            p.y+=p.dy;
            if(p.x<0||p.x>canvas.width)p.dx*=-1;
            if(p.y<0||p.y>canvas.height)p.dy*=-1;
            particles.forEach(o=>{
                if(Math.hypot(p.x-o.x,p.y-o.y)<8 && p.infected){
                    o.infected=true;
                }
            });
            ctx.beginPath();
            ctx.arc(p.x,p.y,4,0,Math.PI*2);
            ctx.fillStyle=p.infected?"red":"lime";
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    slider.oninput=function(){
        document.getElementById("popVal").innerText=this.value;
        init(this.value);
    };

    init(slider.value);
    animate();
}
