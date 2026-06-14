const datas = {};
const output_sec = {"output1-1":null, "output1-2":null, "output2-1":null, "output2-2":null, "output2-3":null};
const input_error = {"time1":false, "time2":false, "time3":false, "time4":false, "distance":false, "speed1":false, "speed2":false};

const inputs = document.getElementsByClassName("inputs");
for (let i = 0; i < inputs.length; i++) {
    datas[inputs[i].name] = null;

    inputs[i].addEventListener('change', (e) => {
        switch (e.target.name) {
            case "time1":
            case "time2":
            case "time3":
            case "time4":
                if (e.target.value !== '') {
                    const value = ('000000' + Number(e.target.value.replace(/[^(0-9)]+/g, ''))).slice(-6);
                    const hour = e.target.name === "time1" || e.target.name === "time2" ? Number(String(value.substring(0, 2))) <= 23 : Number(String(value.substring(0, 2))) === 0;
                    const minute = e.target.name === "time1" || e.target.name === "time2" ? Number(String(value.substring(2, 4))) <= 59 : true;
                    const second = Number(String(value.substring(4, 6))) <= 59;
                    
                    if (hour && minute && second) {
                        input_error[e.target.name] = false;
                        datas[e.target.name] = to_Sec(value);
                        e.target.style.color = "black";
                        if (e.target.name === "time1" || e.target.name === "time2") {
                            e.target.value = value;
                        } else {
                            e.target.value = String(value.substring(2, 6));
                        }
                    } else {
                        input_error[e.target.name] = true;
                        datas[e.target.name] = null;
                        e.target.style.color = "red";
                    }
                } else {
                    datas[e.target.name] = null;
                }
                break;
            case "distance":
                e.target.value = Number(e.target.value.replace(/[^(0-9|.)]+/g, ''));
                if (e.target.value > 0){
                    datas[e.target.name] = e.target.value;
                } else {
                    e.target.value = '';
                    datas[e.target.name] = null;
                }
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
            if (second % 1 === 0) {
                return ('00' + minute).slice(-2) + ('00' + second).slice(-2);
            } else {
                return ('00' + minute).slice(-2) + ('00' + Math.floor(second)).slice(-2) + (second % 1);
            }
        }
    }
}

const output1_1 = document.getElementById("output1-1");
const output1_2 = document.getElementById("output1-2");

function output(name) {
    switch (name) {
        case "reset":
        case "time1":
        case "time2":
        case "time3":
            // const output1_1 = document.getElementById("output1-1");
            // const output1_2 = document.getElementById("output1-2");
            if (datas["time1"] !== null && datas["time2"] !== null && !(input_error["time1"] || input_error["time2"] || input_error["time3"])) {
                output_sec["output1-1"] = datas["time1"] - datas["time2"] - datas["time3"];
                let text = '';

                if (output_sec["output1-1"] >= 0) {
                    output1_1.style.color = "blue";
                } else {
                    output_sec["output1-1"] = output_sec["output1-1"] * -1;
                    output1_1.style.color = "red";
                    text += '-';
                }

                const [minute, second] = to_hhmmss(output_sec["output1-1"], "m,s");
                text += minute + "分" + second + "秒";
                
                output1_1.textContent = text;
            } else {
                output_sec["output1-1"] = null;
                if (input_error["time1"] || input_error["time2"] || input_error["time3"]) {
                    output1_1.textContent = 'Error';
                    output1_1.style.color = "red";
                    if (datas["time4"] !== null) {
                        // const output1_2 = document.getElementById("output1-2");
                        output1_2.textContent = 'Error';
                        output1_2.style.color = "red";
                    }
                } else {
                    output1_1.textContent = '--';
                    output1_1.style.color = "blue";
                }
            } 
                
        case "time4":
            // const output1_2 = document.getElementById("output1-2");
            if (datas["time4"] !== null && !input_error["time4"] && output_sec["output1-1"] !== null) {
                output_sec["output1-2"] = Math.abs(output_sec["output1-1"] - datas["time4"]);
                let text = '';

                const [minute, second] = to_hhmmss(output_sec["output1-2"], "m,s");
                text += minute + "分" + second + "秒";
                
                output1_2.textContent = text;
            } else {
                if (input_error["time4"]) {
                    output1_2.textContent = 'Error';
                    output1_2.style.color = "red";
                } else {
                    output1_2.textContent = '--';
                    output1_2.style.color = "blue";
                }
            }
            break;
        case "distance":
        case "speed1":
        case "speed2":
            const output2_1 = document.getElementById("output2-1");
            const output2_2 = document.getElementById("output2-2");
            const output2_3 = document.getElementById("output2-3");
            if (datas["distance"] !== null) {
                if (name !== "speed2") {
                    if (datas["speed1"] !== null && datas["speed1"] !== 0) {
                        output_sec["output2-1"] = Math.floor(datas["distance"] / (datas["speed1"] / 3600) * 10) / 10;
                        const [minute, second] = to_hhmmss(output_sec["output2-1"], "m,s");
                        
                        const text = minute + "分" + second + "秒";
                        output2_1.textContent = text;
                    } else {
                        output_sec["output2-1"] = null;
                        output2_1.textContent = '--';
                    }
                }

                if (name !== "speed1") {
                    if (datas["speed2"] !== null && datas["speed2"] !== 0) {
                        output_sec["output2-2"] = Math.floor(datas["distance"] / (datas["speed2"] / 3600) * 10) / 10;
                        const [minute, second] = to_hhmmss(output_sec["output2-2"], "m,s");
                        
                        const text = minute + "分" + second + "秒";
                        
                        output2_2.textContent = text;
                    } else {
                        output_sec["output2-2"] = null;
                        output2_2.textContent = '--';
                    }
                }

                if (output_sec["output2-1"] !== null && output_sec["output2-2"] !== null) {
                    output_sec["output2-3"] = output_sec["output2-1"] - output_sec["output2-2"];
                    let text = '';

                    if (output_sec["output2-3"] >= 0) {
                        output2_3.style.color = "blue";
                    } else {
                        output_sec["output2-3"] = output_sec["output2-3"] * -1;
                        output2_3.style.color = "red";
                        text += '-';
                    }

                    const [minute, second] = to_hhmmss(output_sec["output2-3"], "m,s");
                    
                    text += minute + "分" + second + "秒";
                    output2_3.textContent = text;
                } else {
                    output2_3.textContent = '--';
                    output2_3.style.color = "blue";
                }
            }
            break;
    }
}

const btn_next = document.getElementById("btn_next");
btn_next.addEventListener('click', () => {
    if (!(input_error["time1"] || input_error["time2"] || input_error["time3"] || input_error["time4"])) {
        const input_time1 = document.getElementById("input_time1");
        const input_time2 = document.getElementById("input_time2");
        const input_time3 = document.getElementById("input_time3");
        const input_time4 = document.getElementById("input_time4");

        input_time2.value = input_time1.value;
        input_time1.value = '';
        input_time3.value = '';
        input_time4.value = '';

        datas["time2"] = datas["time1"];
        datas["time1"] = null;
        datas["time3"] = null;
        datas["time4"] = null;

        output("reset");
    }
})

const input = document.querySelectorAll("input");
for (let i = 0; i < input.length; i++) {
    input[i].addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
                e.preventDefault();
        }
    })
}


// レスコンカード入力でEnterで次へ行かないように できてる...?
