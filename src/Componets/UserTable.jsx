import React from "react";
import UserRow from "./UserRow";

const UserTable = ({
  users,
  search,
  page,
  itemPerPage,
  ismainChecked,
  setIsMainChecked,
  handleSelectAll,
  editId,
  uname,
  uemail,
  urole,
  handleEdit,
  handleCheck,
  deleteUser,
  handleUpdate,
  nameError,
  isRowSelected,
  emailError,
  roleError,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={ismainChecked}
              // onClick={(e) => setIsMainChecked(e.target.checked)}
              onChange={handleSelectAll}
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users
          .filter((user) =>
            search
              ? user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase())
              : true
          )
          .slice(page * itemPerPage - itemPerPage, page * itemPerPage)
          .map((user) => (
            <UserRow
              key={user.id}
              isRowSelected={isRowSelected}
              ismainChecked={ismainChecked}
              user={user}
              editId={editId}
              uname={uname}
              uemail={uemail}
              urole={urole}
              handleEdit={handleEdit}
              handleCheck={handleCheck}
              deleteUser={deleteUser}
              handleUpdate={handleUpdate}
              nameError={nameError}
              emailError={emailError}
              roleError={roleError}
            />
          ))}
      </tbody>
    </table>
  );
};

export default UserTable;
