const datas = {};
const output_sec = {"output1":null, "output2-1":null, "output2-2":null, "output2-3":null};
const input_errer = {"output1":false, "output2-1":false, "output2-2":false, "output2-3":false};

const inputs = document.getElementsByClassName("inputs");
for (let i = 0; i < inputs.length; i++) {
    datas[inputs[i].name] = null;

    inputs[i].addEventListener('change', (e) => {
        switch (e.target.name) {
            case "time1":
            case "time2":
            case "time3":
                if (e.target.value !== '') {
                    e.target.value = ('000000' + Number(e.target.value.replace(/[^(0-9)]+/g, ''))).slice(-6);
                    const hour = Number(String(e.target.value.substring(0, 2))) <= 23;
                    const minute = Number(String(e.target.value.substring(2, 4))) <= 59;
                    const second = Number(String(e.target.value.substring(4, 6))) <= 59;
                    
                    if (hour && minute && second) {
                        input_errer["output1"] = false;
                        datas[e.target.name] = to_Sec(e.target.value);
                        e.target.style.color = "black";
                    } else {
                        input_errer["output1"] = true;
                        datas[e.target.name] = null;
                        e.target.style.color = "red";
                    }
                } else {
                    datas[e.target.name] = null;
                }
                break;
            case "distance":
                e.target.value = Number(e.target.value.replace(/[^(0-9|.)]+/g, ''));
                datas[e.target.name] = e.target.value;
                break;
            case "speed1":
            case "speed2":
                e.target.value = Number(e.target.value.replace(/[^(0-9|.)]+/g, ''));
                if (e.target.value > 0){
                    datas[e.target.name] = e.target.value;
                } else {
                    e.target.value = '';
                    datas[e.target.name] = null;
                }
                break;
        }
        
        output(e.target.name);
    })
}

function to_Sec(hour=null, minute=null, second=null) {
    if (minute === null) {
        hour = ('000000' + hour).slice(-6);
        second = Number(String(hour.substring(4, 6)));
        minute = Number(String(hour.substring(2, 4)));
        hour = Number(String(hour.substring(0, 2)));
    }
    return hour * 3600 + minute * 60 + second;
}

function to_hhmmss(sec, mode="h,m,s") {
    if (mode === "h,m,s" || mode === "hhmmss") {
        const hour = Math.floor(sec / 3600);
        const minute = Math.floor(sec % 3600 / 60);
        const second = sec % 60;
        if (mode === "h,m,s") {
            return [hour, minute, second];
        } else if (mode === "hhmmss") {
            return ('00' + hour).slice(-2) + ('00' + minute).slice(-2) + ('00' + second).slice(-2);
        }
    } else if (mode === "m,s" || mode === "mmss") {
        const minute = Math.floor(sec / 60);
        const second = sec % 60;
        if (mode === "m,s") {
            return [minute, second];
        } else if (mode === "mmss") {
            return ('00' + minute).slice(-2) + ('00' + second).slice(-2);
        }
    }
}

function output(name) {
    switch (name) {
        case "time1":
        case "time2":
        case "time3":
            const output = document.getElementById("output1");
            if (datas["time1"] !== null && datas["time2"] !== null && input_errer["output1"] === false) {
                output_sec["output1"] = datas["time1"] - datas["time2"] - datas["time3"];
                let text = '';

                if (output_sec["output1"] >= 0) {
                    output.style.color = "blue";
                } else {
                    output_sec["output1"] = output_sec["output1"] * -1;
                    output.style.color = "red";
                    text += '-';
                }

                const [minute, second] = to_hhmmss(output_sec["output1"], "m,s");
                text += minute + "分" + second + "秒";
                
                output.textContent = text;
            } else {
                output.textContent = '--';
                output.style.color = "blue";
            }
        case "distance":
        case "speed1":
        case "speed2":
            const output1 = document.getElementById("output2-1");
            const output2 = document.getElementById("output2-2");
            const output3 = document.getElementById("output2-3");
            if (datas["distance"] !== null) {
                if (name !== "speed2") {
                    if (datas["speed1"] !== null && datas["speed1"] !== 0) {
                        output_sec["output2-1"] = Math.round(datas["distance"] / (datas["speed1"] / 3600));
                        const [minute, second] = to_hhmmss(output_sec["output2-1"], "m,s");
                        
                        const text = minute + "分" + second + "秒";
                        output1.textContent = text;
                    } else {
                        output_sec["output2-1"] = null;
                        output1.textContent = '--';
                    }
                }

                if (name !== "speed1") {
                    if (datas["speed2"] !== null && datas["speed2"] !== 0) {
                        output_sec["output2-2"] = Math.round(datas["distance"] / (datas["speed2"] / 3600));
                        const [minute, second] = to_hhmmss(output_sec["output2-2"], "m,s");
                        
                        const text = minute + "分" + second + "秒";
                        
                        output2.textContent = text;
                    } else {
                        output_sec["output2-2"] = null;
                        output2.textContent = '--';
                    }
                }

                if (output_sec["output2-1"] !== null && output_sec["output2-2"] !== null) {
                    output_sec["output2-3"] = output_sec["output2-1"] - output_sec["output2-2"];
                    let text = '';

                    if (output_sec["output2-3"] >= 0) {
                        output3.style.color = "blue";
                    } else {
                        output_sec["output2-3"] = output_sec["output2-3"] * -1;
                        output3.style.color = "red";
                        text += '-';
                    }

                    const [minute, second] = to_hhmmss(output_sec["output2-3"], "m,s");
                    
                    text += minute + "分" + second + "秒";
                    output3.textContent = text;
                } else {
                    output3.textContent = '--';
                    output3.style.color = "blue";
                }
            }
    }
}

const input = document.querySelectorAll("input");
for (let i = 0; i < input.length; i++) {
    input[i].addEventListener("keydown", (e) => {
        document.getElementById("output1").textContent = e.code;
        switch (e.code) {
            case "ArrowUp":
            case "ArrowDown":
                e.preventDefault();
            case "Enter":
                if (e.target.id === "input_time3") {
                    // e.preventDefault();
                    e.target.focus();
                }
        }
    })
}


