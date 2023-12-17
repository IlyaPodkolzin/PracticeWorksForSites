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


debugger
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

document.getElementById("submitAuth").onclick = function() {
    let result = document.getElementById("askForRegistration").value;
    let login = document.getElementById("login").value;

    if (result === "Да") {
        document.getElementById("react").innerHTML = "Круто!";
        document.getElementById("react").style.opacity = '1';
    }
    else {
        document.getElementById("react").innerHTML = "Попробуйте ещё раз (или нет, если регистрация не требуется)";
        document.getElementById("react").style.opacity = '1';
    }

    if (login === "Админ") {
        showAdminPrompt();
    }
    else if (!login ?? login === "") {
        alert("Отменено")
    }
    else {
        alert("Такой пользователь не зарегистрирован. Проверьте написание логина и пароля.")
    }
}