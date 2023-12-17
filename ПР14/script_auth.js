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