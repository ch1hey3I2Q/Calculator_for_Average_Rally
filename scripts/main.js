const datas = {};

const inputs = document.getElementsByClassName("inputs");
for (let i = 0; i < inputs.length; i++) {
    datas[inputs[i].name] = null;

    inputs[i].addEventListener('change', (e) => {
        e.target.value = Number(e.target.value.replace(/[^(0-9|.)]+/g, ''));
        switch (e.target.name) {
            case "time1":
            case "time2":
                e.target.value = to_hhmmss(to_Sec(e.target.value), "hhmmss");
                datas[e.target.name] = to_Sec(e.target.value);
                break;
            case "time3":
                e.target.value = to_hhmmss(to_Sec(e.target.value), "mmss");
                datas[e.target.name] = to_Sec(e.target.value);
                break;
            case "distance":
                datas[e.target.name] = e.target.value;
                break;
            case "speed1":
            case "speed2":
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

function to_hhmmss(sec, mode="split") {
    const hour = Math.floor(sec / 3600);
    const minute = Math.floor(sec % 3600 / 60);
    const second = sec % 60;
    if (mode === "split") {
        return [hour, minute, second];
    } else if (mode === "hhmmss") {
        return ('00' + hour).slice(-2) + ('00' + minute).slice(-2) + ('00' + second).slice(-2);
    } else if (mode === "mmss") {
        return ('00' + minute).slice(-2) + ('00' + second).slice(-2);
    }
}

function output(name) {
    switch (name) {
        case "time1":
        case "time2":
        case "time3":
            const output = document.getElementById("output1");
            if (datas["time1"] !== null && datas["time2"] !== null) {
                let result = datas["time1"] - datas["time2"] - datas["time3"];
                let text = '';

                if (result >= 0) {
                    output.style.color = "blue";
                } else {
                    result = result * -1;
                    output.style.color = "red";
                    text += '-';
                }

                const [hour, minute, second] = to_hhmmss(result);

                if (hour !== 0) {
                    text += hour + "時間";
                }
                text += minute + "分" + second + "秒";
                
                output.textContent = text;
            }
        case "distance":
        case "speed1":
        case "speed2":
            const output1 = document.getElementById("output2-1");
            const output2 = document.getElementById("output2-2");
            const output3 = document.getElementById("output2-3");
            if (datas["distance"] !== null) {
                console.log(datas["speed1"] != '');
                if (datas["speed1"] !== null && datas["speed1"] !== 0) {
                    const [hour, minute, second] = to_hhmmss(Math.floor(datas["distance"] / (datas["speed1"] / 3600)));
                    
                    let text = '';
                    if (hour !== 0) {
                        text += hour + "時間";
                    }
                    text += minute + "分" + second + "秒";
                    
                    output1.textContent = text;
                } else {
                    output1.textContent = '--';
                }

                if (datas["speed2"] !== null && datas["speed2"] !== 0) {
                    const [hour, minute, second] = to_hhmmss(Math.floor(datas["distance"] / (datas["speed2"] / 3600)));
                    
                    let text = '';
                    if (hour !== 0) {
                        text += hour + "時間";
                    }
                    text += minute + "分" + second + "秒";
                    
                    output2.textContent = text;
                } else {
                    output2.textContent = '--';
                }

                if (output1.textContent !== '--' && output2.textContent !== '--') {
                    let result = Math.floor(datas["distance"] / (datas["speed1"] / 3600)) - Math.floor(datas["distance"] / (datas["speed2"] / 3600));
                    let text = '';

                    if (result >= 0) {
                        output3.style.color = "blue";
                    } else {
                        result = result * -1;
                        output3.style.color = "red";
                        text += '-';
                    }

                    const [hour, minute, second] = to_hhmmss(result);
                    
                    if (hour !== 0) {
                        text += hour + "時間";
                    }
                    text += minute + "分" + second + "秒";
                    
                    output3.textContent = text;
                } else {
                    output3.textContent = '--';
                }
            }
    }
}
