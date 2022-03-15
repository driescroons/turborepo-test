import { useCallback, useState } from "react";
import { Avatar, Form, Comment } from "ui";

function App() {
  const [seed] = useState((Math.random() + 1).toString(36).substring(3));

  const [upvoted, setUpvoted] = useState([]);

  const upvote = useCallback((e) => {
    console.log("upvote some stuff");
  }, []);

  const [comments, setComments] = useState(
    Array(10).fill({
      text: "123",
      createdAt: new Date().toDateString(),
      author: "John Doe",
      seed,
      uuid: "12345",
      upvotes: 0,
      comments: [
        {
          text: "123",
          createdAt: new Date().toDateString(),
          author: "John Doe",
          seed,
          uuid: "12345",
          upvotes: 0,
        },
      ],
    })
  );

  return (
    <div className="container px-4 py-8 sm:mx-auto">
      <h1 className="text-3xl font-bold">Discussion</h1>
      <div className="flex border-b-2 border-gray-200 py-12 gap-4 items-center">
        <Avatar src={`https://i.pravatar.cc?u=${seed}`} />
        <Form />
      </div>
      <div className="flex flex-col gap-6 pt-12">
        {comments.map((comment) => (
          <Comment comment={comment} upvote={upvote} upvoted={upvoted} />
        ))}
      </div>
    </div>
  );
}

export default App;
