const cardContainer = document.querySelector(".card-container");

const updateStreakNumber = (id, number) => {
    fetch(`/api/habits/streak/${id}/${number}`, {
        method: "PUT",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
}

const fetchComments = async id => {
    const data = await fetch(`/api/comments/${id}`);
    return await data.json();
}

const deleteComments = id => {
    fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
}

const postComment = (id, text) => {
    fetch(`/api/comments/add`, {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            text: text,
            habitId: id
        })
    })
}

const updateCardClass = (id, color) => {
    const habitCard = document.getElementById(`card-${id}`);
    if (!color) {
        habitCard.attributes.value.value === "positive" ? color = "positive" : color = "negative";
    }
    habitCard.className = `habit-card m-4 rounded shadow ${color}`;
}

const updateStorageNumber = (id, number) => {
    const dataObj = JSON.parse(sessionStorage.getItem(`${id}`));
    dataObj.streakNumber = number;
    sessionStorage.setItem(`${id}`, JSON.stringify(dataObj));
}

const updateStorageObj = (id, text) => {
    const dataObj = JSON.parse(sessionStorage.getItem(`${id}`));
    dataObj.comments.unshift(text);
    dataObj.dates.unshift(todaysDate());
    sessionStorage.setItem(`${id}`, JSON.stringify(dataObj));
    return dataObj;
}

const modifyNumber = (type, numberElement) => {
    if (type === "plus" || type === "minus") {
        let number = parseInt(numberElement.innerText);
        type === "plus" ? number++ : number--;
        return number < 0 ? 0 : number;
    }
    return 0;
}

const modifyStreakNumber = (id, type) => {
    const streakElement = document.getElementById(`streak-${id}`);
    const number = modifyNumber(type, streakElement);
    streakElement.innerText = number;
    return number;
}

const todaysDate = () => {
    const today = (new Date()).toJSON();
    return today.slice(5, 7) + "/" + today.slice(8, 10);
}

const renderComments = (cardElement, dataObj, habitId) => {
    const color = document.getElementById(`card-${habitId}`).className.split(" ").at(-1);
    const html = [`
    <div class="comments-list">
        <form class="mx-2 py-1" value="${habitId}">
            <label for="commentInput">${todaysDate()} - </label>
            <input class="rounded ${color}" type="text" name="comment" id="commentInput" placeholder="Add comment here...">
        </form>`];
    for (let idx = 0; idx < dataObj.dates.length; idx++) {
        html.push(`
            <div class="comment py-1 mx-2">
                <span class="date-span">${dataObj.dates[idx]} - </span>
                <p class="ms-1 mb-0">${dataObj.comments[idx]}</p>
            </div>`)
    }
    html.push(`
        </div>
        <div class="row-buttons">
            <button value="${habitId}" class="btn btn-primary m-1">Clear</button>
            <button value="${habitId}" class="btn btn-primary m-1">Streak</button>
        </div>`);
    cardElement.innerHTML = html.join("");
}

const renderCardFront = (cardElement, dataObj, habitId) => {
    const html = `
    <div class="row-buttons">
        <button value="${habitId}" class="btn-primary click-btn m-1">-</button>
        <button value="${habitId}" class="btn-primary click-btn m-1">+</button>
    </div>
    <p id="streak-${habitId}" class="streak-number display-3">${dataObj.streakNumber}</p>
    <div class="row-buttons">
        <button value="${habitId}" class="btn btn-primary m-1">Reset</button>
        <button value="${habitId}" class="btn btn-primary m-1">Comments</button>
    </div>`;
    cardElement.innerHTML = html;
}

const parseCommentsData = (data, dates, comments) => {
    data.forEach(comment => {
        comments.push(comment.text);
        dates.push(comment.createdAt.slice(5, 7) + "/" + comment.createdAt.slice(8, 10));
    })
    return { dates, comments };
}

cardContainer.addEventListener("click", async event => {
    if (event.target.attributes && event.target.attributes.value) {
        if (event.target.innerText === "-") {
            const number = modifyStreakNumber(event.target.value, "minus");
            if (number === 0) updateCardClass(event.target.value, "neutral");
            updateStorageNumber(event.target.value, number);
            updateStreakNumber(event.target.value, number);
        } else if (event.target.innerText === "+") {
            const number = modifyStreakNumber(event.target.value, "plus");
            if (number === 1) updateCardClass(event.target.value, false);
            updateStorageNumber(event.target.value, number);
            updateStreakNumber(event.target.value, number);
        } else if (event.target.innerText === "Reset") {
            modifyStreakNumber(event.target.value, "reset");
            updateCardClass(event.target.value, "neutral");
            updateStorageNumber(event.target.value, 0);
            updateStreakNumber(event.target.value, 0);
        } else if (event.target.innerText === "Comments") {
            const habitCardMain = document.querySelector(`#card-${event.target.value} .habit-main`);
            const data = JSON.parse(sessionStorage.getItem(`${event.target.value}`));
            renderComments(habitCardMain, data, event.target.value);
        } else if (event.target.innerText === "Clear") {
            const data = JSON.parse(sessionStorage.getItem(`${event.target.value}`));
            data.dates.length = 0;
            data.comments.length = 0;
            sessionStorage.setItem(`${event.target.value}`, JSON.stringify(data));
            renderComments(document.querySelector(`#card-${event.target.value} .habit-main`), data, event.target.value);
            deleteComments(event.target.value);
        } else if (event.target.innerText === "Streak") {
            renderCardFront(
                document.querySelector(`#card-${event.target.value} .habit-main`),
                JSON.parse(sessionStorage.getItem(`${event.target.value}`)),
                event.target.value
            );
        }
    }
})

cardContainer.addEventListener("submit", async event => {
    event.preventDefault();
    const data = updateStorageObj(event.target.attributes.value.value, event.target.children[1].value);
    renderComments(document.querySelector(`#card-${event.target.attributes.value.value} .habit-main`), data, event.target.attributes.value.value);
    postComment(event.target.attributes.value.value, event.target.children[1].value);
})

const onPageVisit = async () => {
    const cardElements = document.querySelectorAll(".habit-card");
    cardElements.forEach(async card => {
        const comments = await fetchComments(card.id.slice(5));
        const storageObj = parseCommentsData(comments, [], []);
        storageObj.streakNumber = document.getElementById(`streak-${card.id.slice(5)}`).innerText;
        sessionStorage.setItem(`${card.id.slice(5)}`, JSON.stringify(storageObj));
    })
}

onPageVisit();


/*
Habit card comments html layout
<div class="habit-main">
    <div class="comments-list">
        <form class="mx-2 py-1">
            <label for="commentInput">04/06 - </label>
            <input class="rounded" type="text" name="comment" id="commentInput" placeholder="Add comment here...">
        </form>
        <div class="comment py-1 mx-2">
            <span class="date-span">04/10 - </span>
            <p class="ms-1 mb-0">Read 12 Pages Read 12 Pages Read 12 Pages Read 12 Pages</p>
        </div>
    </div>
    <div class="row-buttons">
        <button value="<%= habit.id %>" class="btn btn-primary m-1">Clear</button>
        <button value="<%= habit.id %>" class="btn btn-primary m-1">Streak</button>
    </div>
</div>
*/