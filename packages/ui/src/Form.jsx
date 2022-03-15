import React, { useCallback } from "react";
import { Button } from "./Button";
import { useFormik } from "formik";

export function Form({ placeholder = "What are your thoughts?", postComment }) {
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: postComment,
  });

  return (
    <form className="flex gap-4 grow" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col grow">
        <input
          id="text"
          type="text"
          name="text"
          value={formik.values.text}
          placeholder={placeholder}
          onChange={formik.handleChange}
          className="px-4 py-2 w-full border border-gray-200 outline-none rounded"
        />
        {formik.errors.text && formik.touched.text && (
          <div className="relative">
            <span className="absolute text-red-500 text-xs">
              {formik.errors.text}
            </span>
          </div>
        )}
      </div>
      <Button
        type={"submit"}
        label="Comment"
        color={"#7e34f6"}
        loading={formik.isSubmitting}
      >
        Comment
      </Button>
    </form>
  );
}
