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

function checkWhatToDoNext(id) {
    if (id.includes("btnBuy")) {
        incrementCount(id.at(-1));
        if (buy_amounts[id.at(-1)] === 1)
            createBuyItem(id.at(-1));
    }
    // else if (id.includes("btnBuy") && buy_amounts[id.at(-1)] !== 0)
    //     increaseBuyItem(id.at(-1));
    else if (id.includes("btnSell")) {
        decrementCount(id.at(-1));
        if (buy_amounts[id.at(-1)] === 0)
            removeShoplistElement(id.at(-1));
    }

    for (let item of shoplist) {
        updateShoplistItem(item);
    }

    if (sorting_method === -1) {
        sortInDescendingOrder();
    }
    else if (sorting_method === 1) {
        sortInAscendingOrder();
    }

    updateTotal();
    checkIfRequiredToShowShoplist();
}

// создание элемента списка корзины (наименование товара - количество - цена)
function setupElement(item_id) {
    var new_buy_item = document.createElement("div");
    new_buy_item.id = "shoplist_item" + item_id;
    new_buy_item.style.display = "grid";
    new_buy_item.style.gridTemplateColumns = "6fr 1fr 2fr 2fr";
    new_buy_item.style.justifyContent = "space-between";
    new_buy_item.style.padding = "3px";
    var buy_name = document.createElement("span");
    var buy_cost = document.createElement("span");
    buy_cost.id = "shoplist_buycost" + item_id;
    switch (item_id) {
        case '1':
            buy_name.innerHTML = "AстероИд-1";
            buy_cost.innerHTML = "=150 руб";
            break;

        case '2':
            buy_name.innerHTML = "AстероИд-2";
            buy_cost.innerHTML = "=50 руб";
            break;

        case '3':
            buy_name.innerHTML = "AстероИд-3";
            buy_cost.innerHTML = "=100 руб";
            break;

        case '4':
            buy_name.innerHTML = "AстероИд-4";
            buy_cost.innerHTML = "=70 руб";
            break;

        case '5':
            buy_name.innerHTML = "Комета-1";
            buy_cost.innerHTML = "=130 руб";
            break;

        case '6':
            buy_name.innerHTML = "Комета-2";
            buy_cost.innerHTML = "=200 руб";
            break;

        case '7':
            buy_name.innerHTML = "Комета-3";
            buy_cost.innerHTML = "=180 руб";
            break;

        default:
            buy_name.innerHTML = "DEFAULT_ELEMENT";
            buy_cost.innerHTML = "=0 руб";
            break;
    }

    new_buy_item.appendChild(buy_name);

    var count = document.createElement("span");
    count.id = "shoplist_buycount" + item_id;
    count.innerHTML = "X1";
    var delete_button = document.createElement("button");
    delete_button.innerHTML = "🗑️";
    new_buy_item.appendChild(delete_button);
    new_buy_item.appendChild(count);
    new_buy_item.appendChild(buy_cost);
    count.style.justifySelf = "end";
    buy_cost.style.justifySelf = "end";

    shoplist.push(new_buy_item);

    delete_button.onclick = function () {
        buy_amounts[item_id] = 0;
        removeShoplistElement(item_id);

        for (let item of shoplist) {
            updateShoplistItem(item);
        }
        updateTotal();
        checkIfRequiredToShowShoplist();
    }

    return new_buy_item;
}

function createBuyItem(item_id) {
    var new_buy_item = setupElement(item_id);
    shoplist_scroll.appendChild(new_buy_item)
}

function incrementCount(item_id) {
    if (buy_amounts[item_id] != 5) {
        buy_amounts[item_id]++;
    }
}

function decrementCount(item_id) {
    if (buy_amounts[item_id] > 0) {
        buy_amounts[item_id]--;
    }
}

function removeShoplistElement(item_id) {
    var removedItemIndex = shoplist.indexOf(document.getElementById("shoplist_item" + item_id));
    if (removedItemIndex !== -1) {
        shoplist[removedItemIndex].remove();
        shoplist.splice(removedItemIndex, 1);
        return true;
    }
    return false;
}

function removeAllShoplistElements() {
    for (let i=0; i<shoplist.length;) {
        if (!removeShoplistElement(shoplist[i].id.at(-1))) i++;
    }
}

function checkIfRequiredToShowShoplist() {
    if (shoplist.length !== 0) {
        empty.style.display = "none";
        shoplist_scroll.style.display = "initial";
    }
    else {
        empty.style.display = "initial";
        shoplist_scroll.style.display = "none";
    }
}

function updateShoplistItem(item) {
    if (shoplist.indexOf(item) === -1) {
        item.remove();
    }
    else {
        var buycount = document.getElementById("shoplist_buycount" + item.id.at(-1));
        buycount.innerHTML = "X" + buy_amounts[item.id.at(-1)];
        var buycost = document.getElementById("shoplist_buycost" + item.id.at(-1));
        buycost.innerHTML = "=" + +buy_costs[item.id.at(-1)] * +buy_amounts[item.id.at(-1)] + " РУБ";
    }
}

function updateTotal() {
    var total_sum = 0;
    for (let i=0; i<8; i++) {
        total_sum += +buy_amounts[i] * +buy_costs[i];
    }
    total.innerHTML = "Итого: " + total_sum + " РУБ";
}

function sortInAscendingOrder() {
    for (let i = 0; i < shoplist.length - 1; i++) {
        for (let j = i + 1; j < shoplist.length; j++) {
            let id1 = shoplist[i].id.at(-1);
            let id2 = shoplist[j].id.at(-1);

            let sum1 = +buy_amounts[id1] * +buy_costs[id1];
            let sum2 = +buy_amounts[id2] * +buy_costs[id2];
            if (sum1 > sum2 || sum1 === sum2 && +buy_amounts[id1] < +buy_amounts[id2]) {
                shoplist_scroll.insertBefore(shoplist[j], shoplist[i]);
                shoplist_scroll.insertBefore(shoplist[i], shoplist[j + 1]);
                [shoplist[i], shoplist[j]] = [shoplist[j], shoplist[i]];
            }
        }
    }
}

function sortInDescendingOrder() {
    for (let i = 0; i < shoplist.length - 1; i++) {
        for (let j = i + 1; j < shoplist.length; j++) {
            let id1 = shoplist[i].id.at(-1);
            let id2 = shoplist[j].id.at(-1);

            let sum1 = +buy_amounts[id1] * +buy_costs[id1];
            let sum2 = +buy_amounts[id2] * +buy_costs[id2];
            if (sum1 < sum2 || sum1 === sum2 && +buy_amounts[id1] > +buy_amounts[id2]) {
                shoplist_scroll.insertBefore(shoplist[j], shoplist[i]);
                shoplist_scroll.insertBefore(shoplist[i], shoplist[j + 1]);
                [shoplist[i], shoplist[j]] = [shoplist[j], shoplist[i]];
            }
        }
    }
}

function checkIfIsGoodForFilter(item) {
    let span_with_price = item.querySelectorAll('span')[1].innerText.slice(0, -4);
    return min_value <= span_with_price && max_value >= span_with_price;
}

var shoplist = [];
var chooselist = Array.from(document.getElementsByClassName("scroller_item"));
var filtered_chooselist = chooselist.slice();

var min_value_input = document.getElementById("minimum_input");
var max_value_input = document.getElementById("maximum_input");

var min_value = 0;
var max_value = 999;

var no_match_text = document.getElementById("no_match");

min_value_input.onchange = function () {

    if (min_value_input.value != "") {
        min_value = +min_value_input.value;
    }
    else {
        min_value = 0;
    }
    filtered_chooselist = chooselist.filter(function(item) {
        return checkIfIsGoodForFilter(item);
    });

    for (let chooselist_item of chooselist) {
        if (!filtered_chooselist.includes(chooselist_item)) {
            chooselist_item.style.display = "none";
        }
        else {
            chooselist_item.style.display = "flex";
        }
    }

    if (filtered_chooselist.length === 0) {
        no_match_text.style.display = "initial";
    }
    else {
        no_match_text.style.display = "none";
    }
}

max_value_input.onchange = function () {

    if (max_value_input.value != "") {
        max_value = +max_value_input.value;
    }
    else {
        max_value = 999;
    }
    filtered_chooselist = chooselist.filter(function(item) {
        return checkIfIsGoodForFilter(item);

    });

    for (let chooselist_item of chooselist) {
        if (!filtered_chooselist.includes(chooselist_item)) {
            chooselist_item.style.display = "none";
        }
        else {
            chooselist_item.style.display = "flex";
        }
    }

    if (filtered_chooselist.length === 0) {
        no_match_text.style.display = "initial";
    }
    else {
        no_match_text.style.display = "none";
    }
}

var shoplist_scroll = document.getElementById("shoplist_scroll");
var buy_amounts = [0, 0, 0, 0, 0, 0, 0, 0];
var buy_costs = [0, 150, 50, 100, 70, 130, 200, 180];

var buttonBuys = [document.getElementById("btnBuy1"), document.getElementById("btnBuy2"),
    document.getElementById("btnBuy3"), document.getElementById("btnBuy4"),
    document.getElementById("btnBuy5"), document.getElementById("btnBuy6"),
    document.getElementById("btnBuy7")];

var buttonSells = [document.getElementById("btnSell1"), document.getElementById("btnSell2"),
    document.getElementById("btnSell3"), document.getElementById("btnSell4"),
    document.getElementById("btnSell5"), document.getElementById("btnSell6"),
    document.getElementById("btnSell7")];

for (let buttonBuy of buttonBuys) {
    buttonBuy.onclick = function () {
        checkWhatToDoNext(buttonBuy.id);
    }
}

for (let buttonSell of buttonSells) {
    buttonSell.onclick = function () {
        checkWhatToDoNext(buttonSell.id)
    }
}

document.getElementById("delete_shoplist").onclick = function () {
    for (let i=0; i<8; i++) {
        buy_amounts[i] = 0;
    }
    removeAllShoplistElements();

    for (let item of shoplist) {
        updateShoplistItem(item);
    }

    updateTotal();
    checkIfRequiredToShowShoplist();

    sorting_method = undefined;
    sort_button.innerHTML = ">";
    sort_info.innerHTML = "(не отсортировано)";
}

var sort_info = document.getElementById("sort_info");
var sort_button = document.getElementById("sort_shoplist");
sort_button.onclick = function () {
    if (this.innerText == ">") {
        sorting_method = 1;
        sortInAscendingOrder();
        sort_info.innerHTML = "(сначала дешёвые)"
        this.innerHTML = "<";
    }
    else {
        sorting_method = -1;
        sortInDescendingOrder();
        sort_info.innerHTML = "(сначала дорогие)"
        this.innerHTML = ">";
    }
}

var empty = document.getElementById("empty");
var total = document.getElementById("total");
var sorting_method = undefined;

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

debugger