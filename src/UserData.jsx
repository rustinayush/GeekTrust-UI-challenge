import React from "react";
import "./UserData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "antd";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
const UserData = ({ api }) => {
  //states
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditID] = useState(-1);
  const [uname, usetName] = useState("");
  const [uemail, usetEmail] = useState("");
  const [urole, usetRole] = useState("");
  const [page, setPage] = useState(1);
  const [ismainChecked, setIsMainChecked] = useState(false);
  const [singlecheck, setSinglecheck] = useState(false);
  const itemPerPage = 10;
  const fetchdata = async (api) => {
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
  useEffect(() => {
    fetchdata(api);
  }, []);
  // for value edit
  useEffect(() => {
    const userIndex = users.findIndex((user) => user.id === editId);
    const newusers = [...users];
    newusers[userIndex] = {
      id: editId,
      name: uname,
      email: uemail,
      role: urole,
    };
    setUsers(newusers);
  }, [uname, uemail, urole]);
  //Edit user data on click
  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);

    usetName(user.name);
    usetEmail(user.email);
    usetRole(user.role);
    setEditID(id);
  };
  // -----------pagination handle-----------------
  const selectpagehandle = (selectedpage) => {
    if (
      selectedpage >= 1 &&
      selectedpage <= Math.ceil(users.length / 10) &&
      selectedpage !== page
    )
      setPage(selectedpage);
    const updatedPageRows = users.map((row) => {
      return { ...row, isChecked: false };
    });
    setUsers(updatedPageRows);
    setIsMainChecked(false);
  };
  // --------------checkbox pupose function create---------------
  function handleSelectAll(event) {
    const isChecked = event.target.checked;
    const pageStart = (page - 1) * itemPerPage;
    const pageEnd = pageStart + itemPerPage;
    const pageRows = users.slice(pageStart, pageEnd);

    const pageRowIds = pageRows.map((row) => row.id);

    const updatedPageRows = pageRows.map((row) => {
      return { ...row, isChecked };
    });
    const updatedUsers = [...users];
    updatedUsers.splice(pageStart, itemPerPage, ...updatedPageRows);

    setUsers(updatedUsers);
  }
  // -----------single checkbox---------------------
  function handlecheck(event) {
    const { name, checked } = event.target;
    const newdata = users.map((user) => {
      return user.id === name ? { ...user, isChecked: checked } : user;
    });

    setUsers(newdata);
  }
  // -----------handleAllDelete----------------------
  const handlealldelete = () => {
    const checkinputvalue = [];
    const pageStart = (page - 1) * itemPerPage;
    const pageEnd = pageStart + itemPerPage;

    for (let i = pageStart; i < pageEnd && i < users.length; i++) {
      if (users[i].isChecked === true) {
        checkinputvalue.push(users[i].id);
      }
    }

    const userAfterDeletion = users.filter(
      (user) => !checkinputvalue.includes(user.id)
    );

    setUsers(userAfterDeletion);
    setIsMainChecked(false);
  };

  // -------------edit a table data---------------------
  const handleUpdate = (id) => {
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
  };
  //delete user data
  const deleteUser = (selectedUserid) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUserid;
    });
    setUsers(userAfterDeletion);
  };
  return (
    <div className="container">
      <br />
      <input
        name="name"
        type="text"
        placeholder="search by name email role"
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
                onClick={(e) => {
                  setIsMainChecked(e.target.checked);
                }}
                onChange={handleSelectAll}
              />{" "}
            </th>
            <th>Name </th>
            <th>Email </th>
            <th> Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => {
              if (search === "") return user;
              else if (
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase())
              ) {
                return user;
              }
            })
            .slice(page * 10 - 10, page * 10)
            .map((user) =>
              user.id === editId ? (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      name={user.id}
                      checked={user.isChecked}
                      onClick={(e) => {
                        setSinglecheck(e.target.checked);
                      }}
                      onChange={handlecheck}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => {
                        usetName(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.email}
                      onChange={(e) => {
                        usetEmail(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={user.role}
                      onChange={(e) => {
                        usetRole(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Update</button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      name={user.id}
                      checked={user.isChecked}
                      onClick={(e) => {
                        setSinglecheck(e.target.checked);
                      }}
                      onChange={handlecheck}
                    />
                  </td>
                  <td> {user.name} </td>
                  <td> {user.email} </td>
                  <td> {user.role} </td>
                  <td className="btn">
                    <button onClick={() => handleEdit(user.id)}>
                      <AiFillEdit />
                    </button>
                    <button onClick={() => deleteUser(user.id)}>
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
      <br />
      <br />
      <div className="footer">
        <button
          className="deleteall"
          type="button"
          onClick={() => {
            handlealldelete();
          }}
        >
          Delete Selected
        </button>
        {/* pagination start */}
        {users.length > 0 && (
          <div className="pagination">
            <span
              onClick={() => selectpagehandle(1)}
              className={page > 1 ? "" : "pagination-disable"}
            >
              ◀️◀️
            </span>
            <span
              onClick={() => selectpagehandle(page - 1)}
              className={page > 1 ? "" : "pagination-disable"}
            >
              ◀️
            </span>
            {[...Array(Math.ceil(users.length / 10))].map((_, i) => {
              return (
                <span
                  className={page === i + 1 ? "pagination__selected" : ""}
                  onClick={() => {
                    selectpagehandle(i + 1);
                  }}
                  key={i}
                >
                  {i + 1}
                </span>
              );
            })}
            <span
              onClick={() => selectpagehandle(page + 1)}
              className={page < users.length / 10 ? "" : "pagination-disable"}
            >
              ▶️
            </span>
            <span
              onClick={() => selectpagehandle(Math.ceil(users.length / 10))}
              className={page < users.length / 10 ? "" : "pagination-disable"}
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
