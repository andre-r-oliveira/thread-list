let data = []
let currentUser
const threadList = document.querySelector('.thread__list')
const textArea = document.querySelector('.thread__footer textarea')
let commentCount = 1
getData()
async function getData() {
    const res = await fetch('/data.json');
    const jsonData = await res.json();
    data = jsonData.comments;

    currentUser = jsonData.currentUser;

    data.forEach(comment => {
        createComment(comment);
        commentCount++
        comment.replies.forEach(reply => {
            createComment(reply);
            commentCount++
        })
    });

    document.querySelector('.thread__footer .avatar').src = currentUser.image.png;

}

function addComment() {

    const auxComment = {
        id: commentCount,
        content: textArea.value,
        createdAt: "just now",
        score: 0,
        user: currentUser,
        replies: [],
    }

    createComment(auxComment);
    commentCount++

    textArea.value = ""
}

function increaseRating(id) {
    let elem = document.getElementById(id).querySelector('.card__rating p');
    elem.innerHTML = Number(elem.innerHTML) + 1
}

function decreaseRating(id) {
    let elem = document.getElementById(id).querySelector('.card__rating p');
    elem.innerHTML = Number(elem.innerHTML) - 1
}

function deleteComment(id) {
    document.getElementById(id).remove()
}

function addReply(id) {

    const replyingUser = document.getElementById(id).querySelector('.user-name').innerHTML
    const auxReply = {
        id: commentCount,
        content: textArea.value,
        createdAt: "just now",
        score: 0,
        user: currentUser,
        replyingTo: replyingUser
    }

    createComment(auxReply, id);
    commentCount++

}

function createComment(comment, id) {

    const isOwner = currentUser.username === comment.user.username ? ' is--owner' : '';
    const level = comment.replyingTo ? ' first-level' : '';
    let card = `<div class="card ${isOwner} ${level}" id="${comment.id}">
    <div class="card__rating">
        <div class="rating-button"><input type="button" onClick="increaseRating(${comment.id})">
            <img src="images/icon-plus.svg" alt="icon-plus">
        </div>
        <p>${comment.score}</p>
        <div class="rating-button"><input type="button" onClick="decreaseRating(${comment.id})">
            <img src="images/icon-minus.svg" alt="icon-minus">
        </div>
    </div>
    <div class="card__content">
        <div class="card__content--title">
            <div class="user--banner">
                <img class="avatar" src="${comment.user.image.png}">
                <div class="user-name">${comment.user.username}</div>
                <div class="tag">You</div>
                <div class="time-stamp">${comment.createdAt}</div>
            </div>
            <div class="user--actions">
                <div class="user--actions__owner">
                    <div class="action --delete" onClick="deleteComment(${comment.id})">
                        <img src="images/icon-delete.svg">Delete
                    </div>
                    <div class="action --edit">
                        <img src="images/icon-edit.svg">Edit
                    </div>
                </div>
                <div class="user--actions__not-owner">
                    <div class="action --reply" onClick="addReply(${comment.id})">
                        <img src="images/icon-reply.svg">Reply
                    </div>
                </div>
            </div>
        </div>
        <div class="card__content--main">${comment.content}</div>
    </div>
</div>`

    if (id) {
        document.getElementById(id).closest('.card').insertAdjacentHTML("afterend", card)
    } else {
        threadList.innerHTML = threadList.innerHTML + card
    }

}