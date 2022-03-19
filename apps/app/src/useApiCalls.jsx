import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const host =
  process.env.NODE_ENV === "production"
    ? "https://turborepo.herokuapp.com"
    : "http://localhost:3000";

export function useApiCalls(comments, setComments, upvoted, setUpvoted, seed) {
  const appendComment = useCallback(({ parent, ...body }) => {
    setComments((stateComments) => {
      if (!parent && !stateComments.find((c) => c.uuid === body.uuid)) {
        return [body, ...stateComments];
      } else {
        const parentComment = stateComments.find((c) => c.uuid === parent);
        if (
          parentComment &&
          !parentComment.children.find((c) => c.uuid === body.uuid)
        ) {
          parentComment.children = [body, ...parentComment.children];
          return [...stateComments];
        }
      }
      return stateComments;
    });
  }, []);

  const appendUpvote = useCallback((comment) => {
    setComments((stateComments) => {
      if (comment.parent) {
        const parent = stateComments.find((c) => c.uuid === comment.parent);
        if (parent) {
          const foundComment = parent.children.find(
            (c) => c.uuid === comment.uuid
          );
          if (foundComment) {
            foundComment.upvotes = comment.upvotes;
          }
        }
      } else {
        const foundComment = stateComments.find((c) => c.uuid === comment.uuid);
        if (foundComment) {
          foundComment.upvotes = comment.upvotes;
        }
      }
      return [...stateComments];
    });
  }, []);

  useEffect(() => {
    const socket = io(host);
    socket.on("upvote", appendUpvote);
    socket.on("comment", appendComment);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${host}/comments`);
      const { items } = await res.json();
      setComments(items);
    })();
  }, []);

  const upvote = useCallback(
    async (uuid) => {
      await fetch(`${host}/comments/${uuid}/upvotes`, {
        method: "POST",
      });

      setUpvoted([...upvoted, uuid]);
    },
    [upvoted]
  );

  const postComment = useCallback(
    (parent) => async (values, actions) => {
      const res = await fetch(`${host}/comments`, {
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
        actions.resetForm();
      }

      return success;
    },
    [comments]
  );

  return [upvote, postComment];
}
