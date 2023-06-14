import React from "react";
import "./UserData.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const UserRow = ({
  isRowSelected,
  user,
  editId,
  uname,
  uemail,
  urole,
  handleEdit,
  handleCheck,
  deleteUser,
  handleUpdate,
  nameError,
  emailError,
  roleError,
}) => {
  return (
    <tr key={user.id} className={isRowSelected(user.id) ? "selected" : ""}>
      <td>
        <input
          type="checkbox"
          name={user.id}
          checked={user.isChecked || false}
          onChange={handleCheck}
        />
      </td>
      <td>
        {user.id === editId ? (
          <>
            <input
              type="text"
              value={uname}
              onChange={(e) => handleEdit(user.id, "name", e.target.value)}
            />
            {nameError && <span className="error-message">{nameError}</span>}
          </>
        ) : (
          user.name
        )}
      </td>
      <td>
        {user.id === editId ? (
          <>
            <input
              type="text"
              value={uemail}
              onChange={(e) => handleEdit(user.id, "email", e.target.value)}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </>
        ) : (
          user.email
        )}
      </td>
      <td>
        {user.id === editId ? (
          <>
            <input
              type="text"
              value={urole}
              onChange={(e) => handleEdit(user.id, "role", e.target.value)}
            />
            {roleError && <span className="error-message">{roleError}</span>}
          </>
        ) : (
          user.role
        )}
      </td>
      <td className="btn">
        {user.id === editId ? (
          <button onClick={() => handleUpdate(user.id)}>Update</button>
        ) : (
          <>
            <button onClick={() => handleEdit(user.id)}>
              <AiFillEdit />
            </button>
            <button
              className="deletesingle"
              onClick={() => deleteUser(user.id)}
            >
              <AiFillDelete />
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
