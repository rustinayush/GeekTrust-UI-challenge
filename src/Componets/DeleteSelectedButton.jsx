import React from "react";

const DeleteSelectedButton = ({ handleAllDelete }) => {
  return (
    <button className="deleteall" type="button" onClick={handleAllDelete}>
      Delete Selected
    </button>
  );
};

export default DeleteSelectedButton;
