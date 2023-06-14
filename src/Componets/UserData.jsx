import "./UserData.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import SearchBar from "./SearchBar";
import DeleteSelectedButton from "./DeleteSelectedButton";
import Pagination from "./Pagination";

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

  const handleEdit = (id, field, value) => {
    const user = users.find((user) => user.id === id);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setEditID(id);

    switch (field) {
      case "name":
        setUserName(value);
        break;
      case "email":
        setUserEmail(value);
        break;
      case "role":
        setUserRole(value);
        break;
      default:
        break;
    }
  };
  // const handleSelectAll = (event) => {
  //   const isChecked = event.target.checked;
  //   const pageStart = (page - 1) * itemPerPage;
  //   const pageEnd = pageStart + itemPerPage;
  //   const pageRows = users.slice(pageStart, pageEnd);
  //   const updatedPageRows = pageRows.map((row) => ({
  //     ...row,
  //     isChecked,
  //   }));
  //   const updatedUsers = [...users];
  //   updatedUsers.splice(pageStart, itemPerPage, ...updatedPageRows);
  //   setUsers(updatedUsers);
  //   setIsMainChecked(isChecked);
  //   if (isChecked) {
  //     setSelectedRows(pageRows.map((row) => row.id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };
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

  // const handleCheck = (event) => {
  //   const { name, checked } = event.target;
  //   const updatedUsers = users.map((user) =>
  //     user.id === name ? { ...user, isChecked: checked } : user
  //   );
  //   setUsers(updatedUsers);
  //   if (checked) {
  //     setSelectedRows((prevSelectedRows) => [...prevSelectedRows, name]);
  //   } else {
  //     setSelectedRows((prevSelectedRows) =>
  //       prevSelectedRows.filter((rowId) => rowId !== name)
  //     );
  //   }
  // };
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

    const isAllChecked = updatedUsers.every((user) => user.isChecked);
    setIsMainChecked(isAllChecked);
  };
  // Apply grayish background color to selected rows
  const isRowSelected = (id) => selectedRows.includes(id);

  const handleAllDelete = () => {
    // const pageStart = (page - 1) * itemPerPage;
    // const pageEnd = pageStart + itemPerPage;
    const checkedUserIds = users
      // .slice(pageStart, pageEnd)
      .filter((user) => user.isChecked)
      .map((user) => user.id);
    const updatedUsers = users.filter(
      (user) => !checkedUserIds.includes(user.id)
    );
    setUsers(updatedUsers);
    setIsMainChecked(false);
  };

  const handleUpdate = () => {
    //const user = users.find((user) => user.id === id);
    setNameError("");
    setEmailError("");
    setRoleError("");

    if (uname === "") {
      setNameError("Name is required");
      return;
    }
    if (uemail === "") {
      setEmailError("Email is required");
      return;
    }
    if (urole === "") {
      setRoleError("Role is required");
      return;
    }

    setEditID(-1);
    setUserName("");
    setUserEmail("");
    setUserRole("");
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
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

  return (
    <div>
      <SearchBar search={search} handleSearch={handleSearch} />
      <UserTable
        page={page}
        itemPerPage={itemPerPage}
        search={search}
        users={users}
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
        isRowSelected={isRowSelected}
        ismainChecked={ismainChecked}
        setIsMainChecked={setIsMainChecked}
        handleSelectAll={handleSelectAll}
      />

      <DeleteSelectedButton handleAllDelete={handleAllDelete} />

      <Pagination
        users={users}
        page={page}
        itemPerPage={itemPerPage}
        selectPageHandle={selectPageHandle}
      />
    </div>
  );
};

export default UserData;
