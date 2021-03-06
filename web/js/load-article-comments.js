const uriStart = '/team-java_blogaholic/';
let currentArticleID;
let currentAuthorID;
let currentLoggedUserID;
let currentEditedComment;

function sendDeleteArticleRequest(articleID) {
    const request = new XMLHttpRequest();
    request.open("POST", `${uriStart}delete-article`, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`articleID=${articleID}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            window.location.replace(`${uriStart}blog-view?authorID=${currentAuthorID}`);
        }
    }
}

async function deleteArticle(articleID) {
    if (window.confirm("You cannot undo this operation. \nAre you sure you want to delete the current article?")) {
        sendDeleteArticleRequest(articleID);
    }
}

async function loadCommentList(articleID, authorID, loggedUserID) {
    currentArticleID = articleID;
    currentAuthorID = authorID;
    currentLoggedUserID = loggedUserID;
    currentEditedComment = null;
    const commentContainer = document.querySelector("#all-comments-container");
    let response = await fetch(`${uriStart}load-comments?articleID=${articleID}`);
    let commentList = await response.json();
    commentContainer.innerHTML = "";

    await commentList.forEach(comment => {
            let rootCommentDiv = getCommentDiv(comment, authorID);
            rootCommentDiv.classList.add("root-comment-div");
            commentContainer.appendChild(rootCommentDiv);
        }
    );
    const parsedUrl = window.location.href.split('#comment');
    if (parsedUrl.length > 0) {
        const commentID = parsedUrl[1];
        const newCommentDiv = document.querySelector(`#comment${commentID}`);
        if (newCommentDiv !== null) {
            await newCommentDiv.scrollIntoView({behavior: "smooth", block: "center"});
            newCommentDiv.style.boxShadow = "0 0 3px var(--theme-color)";
            newCommentDiv.style.transition = "1s ease-in-out";
            setTimeout(() => {
                newCommentDiv.style.boxShadow = "none";
            }, 1500);
        }
    }

}

function getCommentDiv(comment, authorID) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-div", "page-item-div");
    commentDiv.id = "comment" + comment.commentID;

    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("block-avatar-div");
    avatarDiv.innerHTML = `<a href="${uriStart}user-profile?user-id=${comment.commenterID}"><img src="${uriStart}images/avatar/${comment.avatarPath}" class="block-avatar comment-avatar" alt=""></a>`;

    const commentInfoDiv = document.createElement("div");
    commentInfoDiv.classList.add("comment-info-div");
    const commentInfo = document.createElement("p");
    commentInfo.classList.add("comment-info");
    commentInfo.innerText = `${comment.commenterUsername} · ${timestampToLocaleString(comment.timeCreated)}`;
    commentInfoDiv.appendChild(commentInfo);

    const commentBodyDiv = document.createElement("div");
    commentBodyDiv.classList.add("comment-body-div");
    const commentBody = document.createElement("p");
    commentBody.classList.add("comment-body");
    commentBody.innerText = comment.commentBody;
    commentBodyDiv.appendChild(commentBody);

    const commentOptionsDiv = document.createElement("div");
    commentOptionsDiv.classList.add("comment-options-div");
    const commentLikeDislikeSpan = document.createElement("span");
    commentLikeDislikeSpan.classList.add("comment-like-dislike-span");
    commentLikeDislikeSpan.innerHTML = `<span id="like-comment-${comment.commentID}-count" class="count-span">${comment.likesCount}</span>
<i class="far fa-thumbs-up like-empty-button like-comment" id="like-comment-${comment.commentID}"></i>· 
<span id="dislike-comment-${comment.commentID}-count" class="count-span">${comment.dislikesCount}</span>
<i class="far fa-thumbs-down dislike-empty-button dislike-comment" id="dislike-comment-${comment.commentID}"></i>`;
    commentOptionsDiv.appendChild(commentLikeDislikeSpan);
    appendEditButton(commentOptionsDiv, authorID, comment);
    appendDeleteButton(commentOptionsDiv, comment.commentID, comment.commenterID);
    appendCommentButton(commentOptionsDiv, comment.commentID);

    commentDiv.appendChild(avatarDiv);
    commentDiv.appendChild(commentInfoDiv);
    commentDiv.appendChild(commentBodyDiv);
    commentDiv.appendChild(commentOptionsDiv);

    const childCommentsContainer = document.createElement("div");
    childCommentsContainer.classList.add("child-comments-container");

    comment.childComments.forEach(
        childComment => {
            const childCommentDiv = getCommentDiv(childComment);
            childCommentDiv.classList.add("child-comment-div");
            childCommentsContainer.appendChild(childCommentDiv);
        }
    );
    commentDiv.appendChild(childCommentsContainer);

    return commentDiv;
}

function appendEditButton(commentOptionsDiv, authorID, comment) {
    if (currentLoggedUserID < 0) return;
    if (currentLoggedUserID === comment.commenterID) {
        const editButton = document.createElement("button");
        editButton.classList.add("edit-comment-button", "tiny-comment-option-button");
        editButton.innerText = "Edit";
        editButton.addEventListener("click", function () {
            loadCommentEditingForm(commentOptionsDiv, comment);
        });
        commentOptionsDiv.appendChild(editButton);
    }
}

function appendDeleteButton(commentOptionsDiv, commentID, commenterID) {
    if (currentLoggedUserID < 0) return;
    if (currentLoggedUserID === commenterID || currentLoggedUserID === currentAuthorID) {
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-comment-button", "tiny-comment-option-button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", async function () {
            await deleteComment(commentID);
        });
        commentOptionsDiv.appendChild(deleteButton);
    }
}

async function deleteComment(commentID) {
    const request = new XMLHttpRequest();
    request.open("POST", `${uriStart}delete-comment`, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`commentID=${commentID}&articleID=${currentArticleID}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            loadCommentList(currentArticleID, currentAuthorID, currentLoggedUserID);
        }
    }

}

function timestampToLocaleString(timestamp) {
    const databaseTime = new Date(timestamp);
    return databaseTime.toLocaleString('en-NZ', {timeZone: 'Pacific/Auckland'});
}

function appendCommentButton(optionDiv, targetCommentID) {
    if (currentLoggedUserID < 0) return;
    const commentButton = document.createElement("button");
    commentButton.innerText = "Reply";
    commentButton.classList.add("tiny-comment-option-button", "add-comment-to-comment-button");
    commentButton.addEventListener("click", function () {
        loadCommentingForm(optionDiv, targetCommentID);
    });
    optionDiv.appendChild(commentButton);
}

function loadCommentingForm(optionDiv, targetCommentID) {
    cancelAddComment();
    recoverComment();
    const commentFormContainer = document.createElement("div");
    commentFormContainer.id = "add-comment-container";
    commentFormContainer.innerHTML = `
           <form id="add-comment-comment" action="${uriStart}add-comment" method="post">
                <label for="add-comment-to-comment" class="comment-info" style="font-size: 15px;">  </label><br>
                <textarea id="add-comment-to-comment" rows="4" maxlength="512" name="new-comment-body" placeholder="Reply to this comment" style="width: 95%; font-size: 15px; font-family:var(--primary-font)"></textarea>
                <input type="hidden" name="target-id" value="${targetCommentID}">
                <input type="hidden" name="article-id" value="${currentArticleID}">
                <input type="hidden" name="target-type" value="comment">
                <button id="submit-comment-to-comment" class="comment-option-button">Post</button>
            </form>`;
    commentFormContainer.style.gridArea = "add-comment";

    optionDiv.parentNode.insertBefore(commentFormContainer, optionDiv.nextSibling);
    document.querySelector("#add-comment-to-comment").focus();

}


function loadCommentEditingForm(commentOptionsDiv, comment) {

    cancelAddComment();
    recoverComment();
    currentEditedComment = comment;

    const oldCommentBodyDiv = document.querySelector("#comment" + comment.commentID + ">.comment-body-div");
    oldCommentBodyDiv.innerHTML = `
           <form id="${comment.commentID}" class="edit-comment-form" action="${uriStart}edit-comment" method="post">
                <label for="add-comment-to-comment" class="comment-info" style="font-size: 15px;">  </label><br>
                <textarea id="add-comment-to-comment" rows="4" maxlength="512" name="new-comment-body" style="width: 100%; font-size: 15px; font-family:var(--primary-font),serif">${comment.commentBody}</textarea>
                <input type="hidden" name="comment-id" value="${comment.commentID}">
                <input type="hidden" name="article-id" value="${currentArticleID}">
                <input type="hidden" name="target-type" value="comment">
                <button id="submit-comment-to-comment" class="comment-option-button" type="submit">Post</button>
                <button id="cancel-comment-to-comment" class="comment-option-button" type="button" onclick="recoverComment(${comment.commentID})">Cancel</button>
            </form>`;

}

function recoverComment() {
    if (currentEditedComment === null)
        return;
    const recoverCommentBodyDiv = document.querySelector("#comment" + currentEditedComment.commentID + ">.comment-body-div");
    recoverCommentBodyDiv.innerHTML = `<p class="comment-body">${currentEditedComment.commentBody}</p>`

}

function cancelAddComment() {
    const oldEditor = document.querySelector("#add-comment-container");
    if (oldEditor !== null)
        oldEditor.parentNode.removeChild(oldEditor);
}
