import React, { useCallback, useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { Form } from "./Form";

const intervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

function timeSince(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  if (!interval) {
    return "Just now";
  }

  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
}

export function Comment({
  comment: { seed, author, createdAt, text, uuid, upvotes, children, parent },
  postComment,
  upvoted = [],
  upvote,
}) {
  const [isReplying, setReplying] = useState(false);

  const reply = useCallback((e) => {
    // post the comment
    console.log(e);
  }, []);

  const escapeKeyListener = useCallback((e) => {
    if (e.code === "Escape") {
      setReplying(false);
    }
  }, []);

  useEffect(() => {
    if (isReplying) {
      window.addEventListener("keydown", escapeKeyListener);
      return () => {
        window.removeEventListener("keydown", escapeKeyListener);
      };
    }
  }, [isReplying]);

  return (
    <div className="flex flex-row">
      {!parent && !!children?.length && (
        <div className="flex items-stretch relative">
          <span className="bg-gray-200 h-full block flex-grow w-1 absolute ml-4"></span>
        </div>
      )}
      <div className="flex flex-row gap-2 z-10 flex-grow">
        <Avatar src={`https://i.pravatar.cc?u=${seed}`} />
        <div className="ml-2 flex-grow">
          <div className="flex gap-2 items-center">
            <span className="font-bold">{author}</span>
            <span className="w-0.5 h-0.5 bg-gray-500 rounded-full inline-block"></span>
            <span className="text-gray-500 text-sm">
              {timeSince(new Date(Date.parse(createdAt)))}
            </span>
          </div>
          <p className="mt-1">{text}</p>
          <div className="flex mt-4 gap-8 text-gray-600 text-sm">
            <button
              className={`font-semibold flex items-center outline-none ${
                upvoted.includes(uuid) ? "text-green-500" : ""
              }`}
              disabled={upvoted.includes(uuid) ? true : false}
              onClick={upvote}
            >
              <div className="w-4 overflow-hidden inline-block">
                <div
                  className={`h-2 w-2 ${
                    upvoted.includes(uuid) ? "bg-green-500" : "bg-gray-600"
                  } rotate-45 transform origin-bottom-left`}
                ></div>
              </div>
              <span>{upvotes > 0 ? upvotes : "Upvote"}</span>
            </button>
            {!parent && (
              <button
                className="font-semibold outline-none"
                onClick={() => setReplying(!isReplying)}
              >
                {isReplying ? "Close" : "Reply"}
              </button>
            )}
          </div>
          {isReplying && (
            <div className="mt-4 flex">
              <Form
                placeholder={`What are your thoughts about this comment?`}
                postComment={(values, actions) => {
                  (async () => {
                    const success = await postComment(uuid)(values, actions);
                    if (success) {
                      setReplying(false);
                    }
                  })();
                }}
              />
            </div>
          )}
          {!parent && (
            <div className="flex flex-col gap-6 pt-6">
              {children?.map((comment) => (
                <Comment
                  key={comment.uuid}
                  comment={{ ...comment, parent: uuid }}
                  upvoted={upvoted}
                  upvote={upvote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
