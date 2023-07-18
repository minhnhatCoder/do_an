import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const Editor = ({ title, value, onChange, classname, required, disabled }) => {
  return (
    <div className={classname}>
      {title && (
        <p className="mb-2">
          {title}
          {required && <span className="ml-2 text-red-500">(*)</span>}
        </p>
      )}

      <CKEditor
        editor={ClassicEditor}
        disabled={disabled}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
      />
    </div>
  );
};

export default Editor;
