import { useCallback, useEffect, useState } from "react";
import { Avatar, Form, Comment } from "ui";

function App() {
  const [seed] = useState((Math.random() + 1).toString(36).substring(3));
  const [upvoted, setUpvoted] = useState([]);
  const [comments, setComments] = useState([]);

  const upvote = useCallback((e) => {
    console.log("upvote some stuff");
  }, []);

  const postComment = useCallback(
    (parent) => async (values, actions) => {
      const res = await fetch("http://localhost:3000/comments", {
        method: "POST",
        body: JSON.stringify({
          ...(parent ? { parent } : {}),
          seed,
          ...values,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      let success = false;

      if (!res.ok) {
        actions.setErrors(
          Object.keys(body.payload).reduce((acc, key) => {
            acc[key] = body.payload[key].join(", ");
            return acc;
          }, {})
        );
      } else {
        success = true;
        if (!parent) {
          setComments([body, ...comments]);
        } else {
          const parentComment = comments.find((c) => c.uuid === parent);
          parentComment.children = [body, ...parentComment.children];
          // insert the comment at position
          const index = comments.findIndex((c) => c.uuid === parent);
          setComments([
            ...comments.slice(0, index),
            parentComment,
            ...comments.slice(index + 1),
          ]);
        }
        actions.resetForm();
      }

      return success;
    },
    [comments]
  );

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/comments");
      const { items } = await res.json();
      setComments(items);
    })();
  }, []);

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
