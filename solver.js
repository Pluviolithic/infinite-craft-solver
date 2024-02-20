function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }

    return values;
}

function getPairs(foundElements) {
    let elements = [...foundElements]
    let pairs = [];
    elements.push({
        text: "Earth",
        emoji: "🌍",
        discovered: false
    })
    elements.push({
        text: "Fire",
        emoji: "🔥",
        discovered: false
    })
    elements.push({
        text: "Water",
        emoji: "💧",
        discovered: false
    })
    elements.push({
        text: "Wind",
        emoji: "🌬️",
        discovered: false
    })
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            pairs.push([elements[i].text, elements[j].text]);
        }
    }
    return pairs;
}

function hasObjectWithSameFields(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
        const arrayObj = arr[i];

        if (Object.keys(arrayObj).length === Object.keys(obj).length) {
            let sameFields = true;
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && !arrayObj.hasOwnProperty(key)) {
                    sameFields = false;
                    break;
                }
            }
            if (sameFields) {
                return true;
            }
        }
    }
    return false;
}

var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

async function test() {

    var elementIndex = -1;
    // figure out the index in allstorage that has element
    for (let i = 0; i < allStorage().length; i++) {
        if (allStorage()[i].includes("elements")) {
            elementIndex = i;
        }
    }

    var elements = JSON.parse(allStorage()[elementIndex]).elements;
    for (let pair of getPairs(elements)) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://neal.fun/api/infinite-craft/pair?first=${pair[0]}&second=${pair[1]}`);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const data = xhr.response;
                console.log(data);

                const exists = elements.some(element =>
                    element.text === data.result &&
                    element.emoji === data.emoji &&
                    element.discovered === data.isNew
                );

                if (!exists && data.text != 'Nothing' && data.emoji != '') {
                    elements.push({ text: data.result, emoji: data.emoji, discovered: data.isNew });
                    localStorage.setItem("infinite-craft-data", JSON.stringify({ elements: elements }));
                }
            }
        };
        await sleep(300);
    }
}


test();
