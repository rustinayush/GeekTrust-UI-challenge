import React from "react";

const Pagination = ({ users,page, itemPerPage, selectPageHandle }) => {
  return (
    <>
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
    </>
  );
};

export default Pagination;
