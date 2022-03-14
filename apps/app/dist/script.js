const comments = [];
const upvotes = [];

// generate random seed for user currently using the page
const seed = (Math.random() + 1).toString(36).substring(3);
document.querySelector("#avatar").src = `https://i.pravatar.cc?u=${seed}`;

const intervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

// formatting date for comment
function timeSince(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  if (!interval) {
    return "Just now";
  }

  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
}

// on page load, fetch comments
(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { items: apiComments } = await (await fetch("/comments")).json();
  apiComments.forEach((comment) => comments.push(comment));
  renderComments();
})();

const renderComments = () => {
  const commentsDiv = document.querySelector("#comments");
  // clearing the innerHtml
  commentsDiv.innerHTML = "";

  // sorting them by date desc
  comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  comments.forEach((comment) => addComment(comment));
};

const addComment = (comment) => {
  const commentsDiv = document.querySelector("#comments");
  commentsDiv.insertAdjacentHTML(
    "beforeend",
    `<div class="flex flex-row gap-2">
      <img src="https://i.pravatar.cc?u=${
        comment.seed
      }" alt="profile picture" class="rounded-full w-10 h-10" />
      <div class="ml-2">
        <div class="flex gap-2 items-center">
          <span class="font-bold">${comment.author}</span>
          <span class="w-0.5 h-0.5 bg-gray-500 rounded-full inline-block"></span>
          <span class="text-gray-500 text-sm">${timeSince(
            new Date(Date.parse(comment.createdAt))
          )}</span>
        </div>
        <p class="mt-1">${comment.text}</p>
        <div class="flex mt-6 gap-8 text-gray-600 text-sm">
          <button class="font-semibold flex items-center ${
            upvotes.includes(comment.uuid) ? "text-green-500" : ""
          }" ${
      upvotes.includes(comment.uuid) ? "disabled" : ""
    } onclick="upvoteComment('${comment.uuid}')">
            <div class="w-4 overflow-hidden inline-block">
              <div class="h-2 w-2 ${
                upvotes.includes(comment.uuid) ? "bg-green-500" : "bg-black"
              } rotate-45 transform origin-bottom-left"></div>
            </div>
            <span>${comment.upvotes > 0 ? comment.upvotes : "Upvote"}</span>
          </button>
          <button class="font-semibold" onclick="alert('Not implemented')">Reply</button>
        </div>
      </div>
    </div>`
  );
};

const postComment = async (e) => {
  // make sure the page does not refresh
  e.preventDefault();

  // get form data out of form
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);

  // check if text was inserted
  if (!formProps.text) {
    return;
  }

  const comment = await (
    await fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formProps,
        seed,
      }),
    })
  ).json();

  // push comment to local array
  comments.push(comment);
  // reset the form
  e.target.reset();
  // render the comments (not really performant)
  renderComments();
};

const upvoteComment = async (commentId) => {
  if (upvotes.includes(commentId)) {
    return;
  }

  await fetch(`/comments/${commentId}/upvotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // find the comment and upvote it client side (since 204)
  comments.find((comment) => comment.uuid === commentId).upvotes++;
  // add the comment to the upvotes array
  upvotes.push(commentId);

  // render the comments again (not really performant)
  renderComments();
};

// bind them to the window
window.postComment = postComment;
window.upvoteComment = upvoteComment;
