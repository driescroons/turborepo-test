import React, { useCallback } from "react";
import { Button } from "./Button";

export function Form({ parent, placeholder = "What are your thoughts?" }) {
  // formik?
  const postComment = useCallback((e) => {
    // post the comment
    // take into account parent
    console.log(e);
  }, []);

  return (
    <form className="flex gap-4 grow" onSubmit={postComment}>
      <input
        type="text"
        placeholder={placeholder}
        name="text"
        className="px-4 py-2 w-full border border-gray-200 outline-none rounded"
      />
      <Button type={"submit"} label="Comment" color={"#7e34f6"}></Button>
    </form>
  );
}
