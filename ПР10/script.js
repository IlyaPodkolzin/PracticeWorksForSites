"use strict";

let drawComets = false;

function showAdminPrompt() {
    let adminPassword = prompt("Введите пароль для доступа к правам Администратора");

    if (adminPassword === "Я главный") {
        alert("Здравствуйте!");
    }
    else if (!adminPassword && adminPassword !== "") {
        alert("Отменено");
    }
    else {
        alert("Неверный пароль");
    }
}

function setButtonColor(button) {
    if (button.style.backgroundColor.includes("rgba(25, 28, 27, 0.8)")) {
        if (button.style.color.includes("rgb(52, 76, 68)")) {
            button.style.color = "#cde9de";
            window.onmousemove = currentPosition => drawComet(currentPosition);
            drawComets = false;
            window.onclick = switchNecessityOfDrawingComet;
        } else {
            button.style.color = "#344c44";
        }
    }
    else if (button.style.backgroundColor.includes("rgba(70, 81, 84, 0.8)")) {
        if (button.style.color.includes("rgb(205, 233, 222)")) {
            button.style.color = "#344c44";
            window.onmousemove = currentPosition => drawComet(currentPosition);
            drawComets = false;
            window.onclick = switchNecessityOfDrawingComet;
        } else {
            button.style.color = "#cde9de";
        }
    }
}

function drawComet(position) {
    let comet = document.createElement("comet");

    comet.style.position = 'absolute';
    comet.style.left = position.pageX.toString() + "px";
    comet.style.top = position.pageY.toString() + "px";
    comet.innerHTML = "🌠";
    comet.style.fontSize = "larger";
    comet.style.zIndex = "990";
    comet.style.pointerEvents = "none"

    document.body.appendChild(comet);

}

function switchNecessityOfDrawingComet() {
    if (!drawComets) {
        drawComets = true;
    } else {
        window.onmousemove = null;
        drawComets = false;
        window.onclick = null;
    }
}

function createCaptcha() {
    let alphabet_nums = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    while (result.length < 5) {
        result += alphabet_nums[Math.floor(Math.random() * alphabet_nums.length)];
    }
    return result;
}

function createEquation() {
    let result = '';
    let first_num = (Math.random() * 100).toFixed(0);
    let second_num = (Math.random() * 100).toFixed(0);
    answer_to_equation = +first_num + +second_num;
    result += first_num + " + " + second_num;
    return result;
}

function Accumulator(startingValue) {
    this.value = startingValue;

    this.read = function() {
        this.value += +prompt("Сколько звёзд Вы увидели сегодня на небе?");
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}

function truncate(str, maxlength) {
    if (str.length > maxlength)
        return str.slice(0, maxlength-3) + '...';
    return str;
}

var accumulator = new Accumulator(Math.floor(Math.random() * 30));
var stars_amounter = document.getElementById("stars_amount")
stars_amounter.innerHTML = accumulator.value;
var answer_to_equation = 13;
var usual_captcha = true;
var captcha_object = {}
var submit_button = document.getElementById("subbutton");
// submit_button.disabled = true;
submit_button.style.filter = "brightness(0.8)";
var captcha_element = document.getElementById("captcha");
captcha_element.innerHTML = createCaptcha();
captcha_element.style.fontSize = "xx-large";

debugger

document.getElementById("captcha_answer").onchange = function() {

    let captcha_text = captcha_element.innerText;
    let captcha_answer = document.getElementById("captcha_answer").value

    captcha_object = {};

    if (captcha_answer !== "") {
        captcha_object = {
            text: captcha_text,
            answer: captcha_answer,
        }
    }

    if (captcha_object.text === captcha_object.answer && usual_captcha
        || captcha_object.answer == answer_to_equation && !usual_captcha) {
        //submit_button.disabled = false;
        submit_button.style.filter = "brightness(1)";
    } else {
        //submit_button.disabled = true;
        submit_button.style.filter = "brightness(0.8)";
    }
}

document.getElementById("starcount").onclick = function () {
    accumulator.read();
    stars_amounter.innerHTML = accumulator.value;
}

submit_button.onclick = function () {
    if (isEmpty(captcha_object)) alert("Перед отправкой формы необходимо ввести капчу.");
    else if (!(captcha_object.text === captcha_object.answer && usual_captcha
        || captcha_object.answer == answer_to_equation && !usual_captcha)) {
        alert("Капча не пройдена, попробуйте ещё раз.");
        usual_captcha = 1 - usual_captcha;

        if (usual_captcha) {
            captcha_element.innerHTML = createCaptcha();
        }
        else {
            captcha_element.innerHTML = createEquation();
        }
    }
}

let counter = 0;
for (let button of document.querySelectorAll('.primary > button')) {
    button.onclick = function () {
        setButtonColor(button);
    }
    if (counter % 2 === 0) {
        button.style.backgroundColor = "rgba(70, 81, 84, 0.8)";
        button.style.color = "#cde9de"
    }
    else {
        button.style.backgroundColor = "rgba(25, 28, 27, 0.8)";
        button.style.color = "#344c44";
    }
    counter++;
}

for (let p of document.querySelectorAll('.box > .content > p')) {
    p.innerHTML = truncate(p.innerHTML, 70);
}