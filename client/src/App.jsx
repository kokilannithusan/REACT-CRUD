import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  //Search Function

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUser = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUser);
  };

  // Delete user function

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure You want to delte this user ?"
    );
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
    }
  };

  // Close model

  const closeModel = () => {
    setIsModelOpen(false);
    getAllUsers();
  };

  // Add user details
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModelOpen(true);
  };

  // Handel input
  const handelData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios
        .patch(`http://localhost:8000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios.post("http://localhost:8000/users", userData).then((res) => {
        console.log(res);
      });
    }
    closeModel();
    setUserData({ name: "", age: "", city: "" });
  };

  // Update user

  const handleUpdateRecord = (users) => {
    setUserData(users);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3> CRUD Application with React.js Frontend and Node.js Backend </h3>
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Text Here"
            onChange={handleSearchChange}
          />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.Number </th>
              <th>Name </th>
              <th>Age </th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete </th>
            </tr>
          </thead>

          <tbody>
            {filterUsers &&
              filterUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td>
                      <button
                        className="btn green"
                        onClick={() => handleUpdateRecord(user)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn red"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={closeModel}>
                &times;
              </span>
              <h2> {userData.id ? "Update Record" : "Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  value={userData.name}
                  name="name"
                  id="name"
                  onChange={handelData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="name">Age</label>
                <input
                  type="number"
                  value={userData.age}
                  name="age"
                  id="age"
                  onChange={handelData}
                />
              </div>
              <div className="input-group">
                <label htmlFor="name">City</label>
                <input
                  type="text"
                  value={userData.city}
                  name="city"
                  id="city"
                  onChange={handelData}
                />
              </div>
              <button className="btn green" onClick={handleSubmit}>
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
