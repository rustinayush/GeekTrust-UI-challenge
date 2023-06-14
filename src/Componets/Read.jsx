import React, { useState, useEffect } from "react";
import "./UserData.css";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
const UserData = ({ api }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditID] = useState(-1);
  const [uname, setUserName] = useState("");
  const [uemail, setUserEmail] = useState("");
  const [urole, setUserRole] = useState("");
  const [page, setPage] = useState(1);
  const [ismainChecked, setIsMainChecked] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const itemPerPage = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(api);
        const data = res.data;
        if (data.length > 0) {
          setUsers(data);
        }
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [api]);
  useEffect(() => {
    if (editId !== -1) {
      const userIndex = users.findIndex((user) => user.id === editId);
      const newUsers = [...users];
      newUsers[userIndex] = {
        id: editId,
        name: uname,
        email: uemail,
        role: urole,
      };
      setUsers(newUsers);
    }
  }, [uname, uemail, urole, editId, users]);
  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setEditID(id);
  };
  const selectPageHandle = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(users.length / itemPerPage) &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
      setIsMainChecked(false);
    }
  };
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const pageStart = (page - 1) * itemPerPage;
    const pageEnd = pageStart + itemPerPage;
    const pageRows = users.slice(pageStart, pageEnd);
    const updatedPageRows = pageRows.map((row) => ({
      ...row,
      isChecked,
    }));
    const updatedUsers = [...users];
    updatedUsers.splice(pageStart, itemPerPage, ...updatedPageRows);
    setUsers(updatedUsers);
    setIsMainChecked(isChecked);
    if (isChecked) {
      setSelectedRows(pageRows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };
  const handleCheck = (event) => {
    const { name, checked } = event.target;
    const updatedUsers = users.map((user) =>
      user.id === name ? { ...user, isChecked: checked } : user
    );
    setUsers(updatedUsers);
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, name]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== name)
      );
    }
  };
  // Apply grayish background color to selected rows
  const isRowSelected = (id) => selectedRows.includes(id);

  const handleAllDelete = () => {
    const pageStart = (page - 1) * itemPerPage;
    const pageEnd = pageStart + itemPerPage;
    const checkedUserIds = users
      .slice(pageStart, pageEnd)
      .filter((user) => user.isChecked)
      .map((user) => user.id);
    const updatedUsers = users.filter(
      (user) => !checkedUserIds.includes(user.id)
    );
    setUsers(updatedUsers);
    setIsMainChecked(false);
  };
  const handleUpdate = () => {
    let isValid = true;
    // Validate name
    if (uname.trim() === "") {
      setNameError("Name cannot be empty");
      isValid = false;
    } else {
      setNameError("");
    }
    // Validate email
    if (uemail.trim() === "") {
      setEmailError("Email cannot be empty");
      isValid = false;
    } else {
      setEmailError("");
    }
    // Validate role
    if (urole.trim() === "") {
      setRoleError("Role cannot be empty");
      isValid = false;
    } else {
      setRoleError("");
    }
    if (isValid) {
      const userIndex = users.findIndex((user) => user.id === editId);
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        name: uname,
        email: uemail,
        role: urole,
      };
      setUsers(updatedUsers);
      setEditID(-1);
    }
  };
  const deleteUser = (Id) => {
    const updatedUsers = users.filter((user) => user.id !== Id);
    setUsers(updatedUsers);
  };
  return (
    <div className="container">
      <br />
      <input
        name="name"
        type="text"
        placeholder="Search by name, email, or role"
        onChange={(e) => setSearch(e.target.value)}
      />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={ismainChecked}
                onClick={(e) => setIsMainChecked(e.target.checked)}
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
                        onChange={(e) => setUserName(e.target.value)}
                      />
                      {nameError && (
                        <span className="error-message">{nameError}</span>
                      )}
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
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                      {emailError && (
                        <span className="error-message">{emailError}</span>
                      )}
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
                        onChange={(e) => setUserRole(e.target.value)}
                      />
                      {roleError && (
                        <span className="error-message">{roleError}</span>
                      )}
                    </>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="btn">
                  {user.id === editId ? (
                    <button onClick={() => handleUpdate(user.id)}>
                      Update
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user.id)}>
                        <AiFillEdit />
                      </button>
                      <button onClick={() => deleteUser(user.id)}>
                        <AiFillDelete />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      <br />
      <div className="footer">
        <button className="deleteall" type="button" onClick={handleAllDelete}>
          Delete Selected
        </button>
        {users.length > 0 && (
          <div className="pagination">
            <span
              onClick={() => selectPageHandle(1)}
              className={page > 1 ? "" : "pagination-disable"}
            >
              ◀️◀️
            </span>
            <span
              onClick={() => selectPageHandle(page - 1)}
              className={page > 1 ? "" : "pagination-disable"}
            >
              ◀️
            </span>
            {[...Array(Math.ceil(users.length / itemPerPage))].map((_, i) => (
              <span
                className={page === i + 1 ? "pagination__selected" : ""}
                onClick={() => selectPageHandle(i + 1)}
                key={i}
              >
                {i + 1}
              </span>
            ))}
            <span
              onClick={() => selectPageHandle(page + 1)}
              className={
                page < users.length / itemPerPage ? "" : "pagination-disable"
              }
            >
              ▶️
            </span>
            <span
              onClick={() =>
                selectPageHandle(Math.ceil(users.length / itemPerPage))
              }
              className={
                page < users.length / itemPerPage ? "" : "pagination-disable"
              }
            >
              ▶️▶️
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserData;