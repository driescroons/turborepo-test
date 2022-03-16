import { useState } from "react";
import { Avatar, Form, Comment } from "ui";
import { useApiCalls } from "./useApiCalls";

function App() {
  const [seed] = useState((Math.random() + 1).toString(36).substring(3));
  const [upvoted, setUpvoted] = useState([]);
  const [comments, setComments] = useState([]);

  const [upvote, postComment] = useApiCalls(
    comments,
    setComments,
    upvoted,
    setUpvoted,
    seed
  );

  return (
    <div className="container px-4 py-8 sm:mx-auto">
      <h1 className="text-3xl font-bold">Discussion</h1>
      <div className="flex border-b-2 border-gray-200 py-12 gap-4 items-center">
        <Avatar src={`https://i.pravatar.cc?u=${seed}`} />
        <Form postComment={postComment()} />
      </div>
      <div className="flex flex-col gap-6 pt-12">
        {comments.map((comment) => (
          <Comment
            key={comment.uuid}
            comment={comment}
            upvote={upvote}
            upvoted={upvoted}
            postComment={postComment}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
