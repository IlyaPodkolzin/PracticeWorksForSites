"use strict";

let shoplist = [];
let chooselist = Array.from(document.getElementsByClassName("scroller_item"));
let filtered_chooselist = chooselist.slice();

let min_value_input = document.getElementById("minimum_input");
let max_value_input = document.getElementById("maximum_input");

let min_value = 0;
let max_value = 999;

let no_match_text = document.getElementById("no_match");

let shoplist_scroll = document.getElementById("shoplist_scroll");
let buy_amounts = [0, 0, 0, 0, 0, 0, 0, 0];
let buy_costs = [0, 150, 50, 100, 70, 130, 200, 180];

let buttonBuys = [document.getElementById("btnBuy1"), document.getElementById("btnBuy2"),
    document.getElementById("btnBuy3"), document.getElementById("btnBuy4"),
    document.getElementById("btnBuy5"), document.getElementById("btnBuy6"),
    document.getElementById("btnBuy7")];

let buttonSells = [document.getElementById("btnSell1"), document.getElementById("btnSell2"),
    document.getElementById("btnSell3"), document.getElementById("btnSell4"),
    document.getElementById("btnSell5"), document.getElementById("btnSell6"),
    document.getElementById("btnSell7")];

let sort_info = document.getElementById("sort_info");
let sort_button = document.getElementById("sort_shoplist");

let empty = document.getElementById("empty");
let total = document.getElementById("total");
let sorting_method = undefined;

let accumulator = new Accumulator(Math.floor(Math.random() * 30));

let answer_to_equation = 13;

let usual_captcha = true;
let captcha_object = {}

let submit_button = document.getElementById("subbutton");
let submit_form = document.getElementById("form_post");
if (submit_button) submit_button.style.filter = "brightness(0.8)";

let captcha_element = document.getElementById("captcha");
if (captcha_element) {
    captcha_element.innerHTML = createCaptcha();
    captcha_element.style.fontSize = "xx-large";
}

let notification_button = document.querySelector('[for=notif]')
let notification_list = document.querySelector('[for=notif] > ul');
let notification_counter = document.getElementsByClassName("icon-button__badge")[0];

function showAdminPrompt() {
    let adminPassword = prompt("Введите пароль для доступа к правам Администратора");

    if (adminPassword === "Я главный") {
        alert("Здравствуйте!");
    } else if (!adminPassword && adminPassword !== "") {
        alert("Отменено");
    } else {
        alert("Неверный пароль");
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

    this.read = function () {
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

function checkWhatToDoNext(id) {
    if (id.includes("btnBuy")) {
        incrementCount(id.at(-1));
        if (buy_amounts[id.at(-1)] === 1)
            createBuyItem(id.at(-1));
    }

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
    } else if (sorting_method === 1) {
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

    let count = document.createElement("span");
    count.id = "shoplist_buycount" + item_id;
    count.innerHTML = "X1";
    let delete_button = document.createElement("button");
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
    for (let i = 0; i < shoplist.length;) {
        if (!removeShoplistElement(shoplist[i].id.at(-1))) i++;
    }
}

function checkIfRequiredToShowShoplist() {
    if (shoplist.length !== 0) {
        empty.style.display = "none";
        shoplist_scroll.style.display = "initial";
    } else {
        empty.style.display = "initial";
        shoplist_scroll.style.display = "none";
    }
}

function updateShoplistItem(item) {
    if (shoplist.indexOf(item) === -1) {
        item.remove();
    } else {
        var buycount = document.getElementById("shoplist_buycount" + item.id.at(-1));
        buycount.innerHTML = "X" + buy_amounts[item.id.at(-1)];
        var buycost = document.getElementById("shoplist_buycost" + item.id.at(-1));
        buycost.innerHTML = "=" + +buy_costs[item.id.at(-1)] * +buy_amounts[item.id.at(-1)] + " РУБ";
    }
}

function updateTotal() {
    var total_sum = 0;
    for (let i = 0; i < 8; i++) {
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

function addNotification(text) {
    if (text && text !== "") {
        let new_notification = document.createElement('li');
        let delete_notification = document.createElement("button")

        new_notification.innerText = text;
        delete_notification.innerHTML = "X";
        delete_notification.style.color = "var(--text_dark)";

        new_notification.style.position = "relative";
        delete_notification.style.position = "absolute";

        new_notification.appendChild(delete_notification);
        delete_notification.style.right = "10px";

        if (!it_needs_to_stop) {
            let circle_new = document.createElement("div");
            circle_new.style.position = "absolute";
            circle_new.style.backgroundColor = "var(--accent_text)";
            circle_new.style.borderRadius = "50%";
            circle_new.style.width = "16px";
            circle_new.style.height = "16px";
            circle_new.style.right = "-8px";
            circle_new.style.top = "-8px";
            new_notification.appendChild(circle_new)
        }

        notification_list.appendChild(new_notification);
        notification_list.scrollBy(0, 50);
        /* if (!it_needs_to_stop) */
        incrementNotificationCounter();
    }
}

function incrementNotificationCounter() {
    notification_counter.innerHTML++;
}

function decrementNotificationCounter() {
    notification_counter.innerHTML--;
}

function onClickDelayer(func) {
    return function () {
        if (it_needs_to_stop) {
            setTimeout(() => {
                it_needs_to_stop = false;
            }, 10000);
        } else {
            func();
        }
    }
}

function addNotificationViaUser() {
    let textToUseInNotification = "ok";
    while (textToUseInNotification && textToUseInNotification !== "") {
        textToUseInNotification = prompt("Введите текст для нового уведомления...");
        addNotification(textToUseInNotification);
    }
}

function showNotification(options) {
    let newNotification = document.createElement("div");
    newNotification.className = "notification";
    document.body.appendChild(newNotification);
    newNotification.style.top = 0.3 * document.documentElement.clientHeight + 'px';
    newNotification.style.left = "0";

    newNotification.appendChild(document.createElement("p"));
    newNotification.firstElementChild.innerHTML = "Уведомление от сайта";

    newNotification.appendChild(document.createElement("p"));
    newNotification.firstElementChild.nextElementSibling.innerHTML = options;

    setTimeout(() => document.body.removeChild(newNotification), 3200);
}

function parallax(event) {
    this.querySelectorAll('.layer').forEach(layer => {
        let acc = layer.getAttribute('data-acceleration');
        layer.style.transform = `translateX(${event.clientX * acc / 1000}px)`;
    });
}

function parallaxMobile(event) {
    const touch = event.touches[0];
    this.querySelectorAll('.layer').forEach(layer => {
        let acc = layer.getAttribute('data-acceleration');
        layer.style.transform = `translateX(${touch.clientX * acc / 1000}px)`;
    });
}

function resizeParallax() {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.height = `${window.innerWidth * 0.8}px`;
    });
}

if (min_value_input) min_value_input.onchange = function () {

    if (min_value_input.value != "") {
        min_value = +min_value_input.value;
    } else {
        min_value = 0;
    }
    filtered_chooselist = chooselist.filter(function (item) {
        return checkIfIsGoodForFilter(item);
    });

    for (let chooselist_item of chooselist) {
        if (!filtered_chooselist.includes(chooselist_item)) {
            chooselist_item.style.display = "none";
        } else {
            chooselist_item.style.display = "flex";
        }
    }

    if (filtered_chooselist.length === 0) {
        no_match_text.style.display = "initial";
    } else {
        no_match_text.style.display = "none";
    }
}

if (max_value_input) max_value_input.onchange = function () {

    if (max_value_input.value != "") {
        max_value = +max_value_input.value;
    } else {
        max_value = 999;
    }
    filtered_chooselist = chooselist.filter(function (item) {
        return checkIfIsGoodForFilter(item);

    });

    for (let chooselist_item of chooselist) {
        if (!filtered_chooselist.includes(chooselist_item)) {
            chooselist_item.style.display = "none";
        } else {
            chooselist_item.style.display = "flex";
        }
    }

    if (filtered_chooselist.length === 0) {
        no_match_text.style.display = "initial";
    } else {
        no_match_text.style.display = "none";
    }
}

if (document.getElementById("delete_shoplist")) document.getElementById("delete_shoplist").onclick = function () {
    for (let i = 0; i < 8; i++) {
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

if (sort_button) sort_button.onclick = function () {
    if (this.innerText == ">") {
        sorting_method = 1;
        sortInAscendingOrder();
        sort_info.innerHTML = "(сначала дешёвые)"
        this.innerHTML = "<";
    } else {
        sorting_method = -1;
        sortInDescendingOrder();
        sort_info.innerHTML = "(сначала дорогие)"
        this.innerHTML = ">";
    }
}

if (document.getElementById("captcha_answer")) document.getElementById("captcha_answer").onchange = function () {

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
        submit_button.style.filter = "brightness(1)";
    } else {
        submit_button.style.filter = "brightness(0.8)";
    }
}

debugger
if (submit_form) submit_form.onsubmit = function (event) {
    event.preventDefault();

    if (isEmpty(captcha_object)) {
        alert("Перед отправкой формы необходимо ввести капчу.");
    }
    else if (!(captcha_object.text === captcha_object.answer && usual_captcha
        || captcha_object.answer == answer_to_equation && !usual_captcha)) {
        event.preventDefault();
        alert("Капча не пройдена, попробуйте ещё раз.");
        usual_captcha = 1 - usual_captcha;

        if (usual_captcha) {
            captcha_element.innerHTML = createCaptcha();
        } else {
            captcha_element.innerHTML = createEquation();
        }
    }

    else {
        document.getElementById("captcha_answer").value = "";
        captcha_object.answer = "";

        submit_form.reset();
        showNotification("Форма отправлена!");
    }
}

let counter = 0;
for (let button of document.querySelectorAll('.primary > button')) {
    button.onclick = function () {
        setButtonColor(button);
    }

    button.style.backgroundColor = "var(--background_bright)";
    button.style.color = "var(--background)";
    counter++;
}

for (let buttonBuy of buttonBuys) {
    if (buttonBuy) buttonBuy.onclick = function () {
        checkWhatToDoNext(buttonBuy.id);
    }
}

for (let buttonSell of buttonSells) {
    if (buttonSell) buttonSell.onclick = function () {
        checkWhatToDoNext(buttonSell.id)
    }
}

function accentElements(group) {
    for (let elem of group) {
        if (elem) {
            if (elem.getBoundingClientRect().y <= document.documentElement.clientHeight / 2) {
                elem.style.color = "var(--accent_text)";
            } else {
                elem.style.color = "var(--text)";
            }
        }
    }
}

function appearSmooth() {
    for (let popular_asteroid_card of document.querySelectorAll(".smooth_appear")) {
        if (popular_asteroid_card) {
            if (popular_asteroid_card.getBoundingClientRect().y <= 4 * document.documentElement.clientHeight / 5) {
                popular_asteroid_card.style.translate = "0";
            } else {
                popular_asteroid_card.style.translate = "-90%";
            }
        }
    }
}

function centerElement(element_to_center, centerX, centerY) {
    if (centerX) element_to_center.style.left = (element_to_center.parentElement.clientWidth - element_to_center.offsetWidth) / 2 + "px";
    if (centerY) element_to_center.style.top = (element_to_center.parentElement.clientHeight - element_to_center.offsetHeight) / 2 + "px";
}

document.addEventListener("DOMContentLoaded", function (event) {
    accentElements(document.querySelectorAll("ol > li"));
    appearSmooth();
});

document.addEventListener("scroll", function (event) {
    accentElements(document.querySelectorAll("ol > li"));
    accentElements(document.querySelectorAll("dl > dt"));
    appearSmooth();
});

document.addEventListener('mousemove', parallax);
document.addEventListener('touchmove', parallaxMobile);
window.addEventListener('resize', resizeParallax);
document.addEventListener('DOMContentLoaded', resizeParallax);

if (notification_button) {

    notification_button.onmouseover = function () {
        it_needs_to_stop = true;
    }

    notification_button.onmouseout = function () {
        it_needs_to_stop = false;
    }
}

notification_list.onclick = function (event) {
    let target = event.target;
    if (target.tagName !== 'BUTTON' && target.tagName !== 'LI') return;

    if (target.tagName === 'LI') {
        if (target.lastElementChild.tagName === "DIV") {
            target.removeChild(target.lastElementChild);
            decrementNotificationCounter();
        }
    } else {
        if (target.parentElement.lastElementChild.tagName === "DIV")
            decrementNotificationCounter();
        target.parentElement.parentElement.removeChild(target.parentElement);
    }
}
document.querySelectorAll('.word-photo').forEach(word => {
    let word_photo = word.firstElementChild;
    word.onmousemove = function () {
        if (!word_photo.classList.contains("is-visible")) {
            word_photo.classList.add("is-visible");
            word_photo.classList.remove("is-hidden");
        }
    }

    word.onmouseleave = function () {
        if (word_photo.classList.contains("is-visible")) {
            word_photo.classList.add("is-hidden");
            window.setTimeout(function () {
                word_photo.classList.remove("is-visible");
            }, 400);
        }
    }
});

if (submit_button) submit_button.addEventListener("submit", function (event) {
    event.preventDefault();
});

window.addEventListener("resize", function () {
    document.querySelectorAll('#warning_COPYRIGHT').forEach(copyright => {
        centerElement(copyright, true, false);
    })
});
document.querySelectorAll('#warning_COPYRIGHT').forEach(copyright => {
    centerElement(copyright, true, false);
})

let menu = document.querySelector('#main_nav > ul');
menu.onclick = function (event) {
    if (event.target.closest('a')) {
        if (!confirm("Вы действительно хотите покинуть страницу?")) event.preventDefault();
    }
}

let selected_picture = document.querySelector('#selected_mid_picture');
let mid_pictures_block = document.querySelector('#mid_pictures');

if (mid_pictures_block && selected_picture) {

    centerElement(selected_picture.firstElementChild, true, true);
    window.addEventListener("resize", function () {
        centerElement(selected_picture.firstElementChild, true, true);
    });

    mid_pictures_block.onclick = function (event) {
        let image_to_select = event.target.closest("div:not(#mid_pictures)");
        if (image_to_select) {
            let src = image_to_select.querySelector("img").getAttribute("src");
            let alt = image_to_select.querySelector("img").getAttribute("alt");

            selected_picture.firstElementChild.setAttribute("src", src);
            selected_picture.firstElementChild.setAttribute("alt", alt);
        }
    }
}

let figure_article = document.querySelector(".text-picture_block > .secondary");
if (figure_article) {
    figure_article.oncopy = null;
    figure_article.onclick = function(event) {

        let targeted_figure = event.target.closest("figure");

        for (let figurine of figure_article.querySelectorAll("figure")) {
            if (targeted_figure === figurine) {
                if (figurine.classList.contains('selected') && (event.ctrlKey || event.metaKey)) figurine.classList.remove('selected');
                else figurine.classList.add('selected');
            }
            else if (!event.ctrlKey && !event.metaKey) {
                figurine.classList.remove('selected');
            }
        }
    }
}

let scroller_slider = document.querySelector("#scroller");
let scroller_thingy = document.querySelector("#scroller > div");

if (scroller_thingy) {

    scroller_thingy.onmousedown = function (event) {
        let shiftX = event.clientX - scroller_thingy.getBoundingClientRect().left + scroller_slider.getBoundingClientRect().left;

        moveAt(event.pageX,
            0,
            scroller_slider.getBoundingClientRect().right - scroller_thingy.getBoundingClientRect().width - scroller_slider.getBoundingClientRect().left);

        function moveAt(pageX, minX, maxX) {
            scroller_thingy.style.left = pageX - shiftX + 'px';
            if (pageX - shiftX > maxX) scroller_thingy.style.left = maxX + 'px';
            if (pageX - shiftX < minX) scroller_thingy.style.left = minX + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX,
                0,
                scroller_slider.getBoundingClientRect().right - scroller_thingy.getBoundingClientRect().width - scroller_slider.getBoundingClientRect().left);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
        };
    };

    scroller_thingy.ondragstart = function () {
        return false;
    }

}

debugger
let items = document.querySelector(".scroller_wrapper");
if (items) {
    let coords_to_drop = document.querySelector(".shoplist_wrapper").getBoundingClientRect();
    let isInDroppable = false;

    items.onmousedown = function (event) {

        let shoplist_wrapper = document.querySelector(".shoplist_wrapper");
        coords_to_drop = shoplist_wrapper.getBoundingClientRect();
        let item = event.target;

        if (item.tagName === "BUTTON") return;

        item = item.closest(".scroller_item");
        if (item) {

            let shiftX = event.clientX - item.getBoundingClientRect().left;
            let shiftY = event.clientY - item.getBoundingClientRect().top;

            let item_clone = item.cloneNode(true);
            let item_to_add_id = item.querySelectorAll('button')[1].id;
            item_clone.removeChild(item_clone.lastChild);
            item_clone.removeChild(item_clone.lastChild);
            item_clone.removeChild(item_clone.lastChild);
            item_clone.removeChild(item_clone.lastChild);
            item_clone.style.position = 'absolute';
            item_clone.style.zIndex = 1000;
            document.body.append(item_clone);

            moveAt(event.pageX,event.pageY);

            function moveAt(pageX, pageY) {
                item_clone.style.left = pageX - shiftX + 'px';
                item_clone.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX,event.pageY);

                coords_to_drop = document.querySelector(".shoplist_wrapper").getBoundingClientRect();
                isInDroppable = coords_to_drop.left <= event.clientX &&
                    coords_to_drop.right >= event.clientX &&
                    coords_to_drop.top <= event.clientY &&
                    coords_to_drop.bottom >= event.clientY;
                console.log(isInDroppable);

                if (!isInDroppable) {
                    leaveDroppable(shoplist_wrapper);
                }
                else {
                    enterDroppable(shoplist_wrapper);
                }
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function () {
                document.body.removeChild(document.body.lastChild);
                leaveDroppable(shoplist_wrapper);
                if (isInDroppable) checkWhatToDoNext(item_to_add_id);
                document.removeEventListener('mousemove', onMouseMove);
            };
        }

        item.ondragstart = function () {
            return false;
        }

        item.querySelector('img').ondragstart = function () {
            return false;
        }

    }
}

function leaveDroppable(currentDroppable) {
    currentDroppable.classList.remove("selected");
}

function enterDroppable(currentDroppable) {
    currentDroppable.classList.add("selected");
}

let notificationTimerId;
let it_needs_to_stop = false;

let comet = document.body.querySelector('#comet_animation');

function animate({timing, draw, duration}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);
        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });

}

animate({duration: 10000,
                            timing(timeFraction) {
                                return timeFraction;
                            },
                            draw(progress) {
                                if (comet) {
                                    comet.style.right = (progress * window.innerWidth) + 'px';
                                    comet.style.top = Math.pow((progress * window.innerWidth) / 30, 2) + 'px';
                                }
                            }
                           });


debugger

notificationTimerId = setInterval(addNotification, 5000, "Не забудьте купить сувениры!");
incrementNotificationCounter = onClickDelayer(incrementNotificationCounter);

debugger