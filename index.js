const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const exIcon = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

import API_KEY from "./apikey.js"

[fromCur, toCur].forEach((select, i) => {
    for (let curCode in Country_List) {
        const selected = (i === 0 && curCode === "USD") || (i === 1 && curCode === "INR") ? "selected" : "";
        select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
    }
    select.addEventListener("change", () => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
});

// Function to get exchange rate from api

async function getExchangeRate(fresult) {
    const amountVal = amount.value || 1;
    exRateTxt.innerText = "Getting exchange rate...";
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/66232df450c9de58f5112549/latest/${fromCur.value}`);
        const result = await response.json();
        const exchangeRate = result.conversion_rates[toCur.value];
        const totalExRate = (amountVal * exchangeRate).toFixed(2);
        const fresult = `${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}`
        console.log(fresult)
        exRateTxt.innerText = fresult;
            const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                {
                    role: 'user',
                    content: `You are an financial expect who can predict the decrease or increase in exchange rates using the current exchange rate, If current exchange rate is ${amountVal} ${fromCur.value} = ${totalExRate} ${toCur.value}, then Give me some suggestion weather to currency exchange right now, or wait for the value to increase?`
                }
                ],
                max_tokens: 200,
                prompt_truncate_len: 1500,
                temperature: 1,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                n: 1,
                stop: null,
                response_format: {type: 'text'},
                stream: false,
                model: 'accounts/fireworks/models/mistral-7b-instruct-4k'
            })
        };

            fetch('https://api.fireworks.ai/inference/v1/chat/completions', options)
            .then(response => response.json())
                .then(response => document.getElementById("ai").innerText=response.choices[0].message.content)
                .catch(err => console.error(err));
        
            } catch (error) {
                exRateTxt.innerText = "Something went wrong...";
            }
        }


window.addEventListener("load", getExchangeRate);
getBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});

exIcon.addEventListener("click", () => {
    [fromCur.value, toCur.value] = [toCur.value, fromCur.value];
    [fromCur, toCur].forEach((select) => {
        const code = select.value;
        const imgTag = select.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${Country_List[code].toLowerCase()}.png`;
    });
    getExchangeRate();
});