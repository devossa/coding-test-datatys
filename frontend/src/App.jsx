import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import UsersForm from './components/UsersForm';
import axios from './tools/api';
import UsersList from './components/UsersList';

function App() {
  const [usersList, setUsersList] = useState(undefined);
  const [editing, setEditing] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const handleDelete = useCallback(async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure ?')) return;

    try {
      const response = await axios.delete(`/users/${id}`);
      if (response.status === 200) {
        setUsersList((old) => {
          const newData = [...old].filter((user) => user.id !== id);
          return newData;
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const editUser = useCallback((data) => setUsersList((old) => {
    const newData = [...old].map((user) => (user.id === data.id ? data : user));
    return newData;
  }));
  const addUser = useCallback((data) => setUsersList((old) => ({ ...old, data })));

  useEffect(() => {
    axios.get('/users').then((response) => {
      if (response.status === 200 && response.data.success) {
        setUsersList(response.data.data);
      } else {
        setIsError(true);
      }
    }).catch(console.log);
  }, []);

  return (
    <div className="root">
      {isError ? (<p>Something went wrong, please refresh the page.</p>) : (
        <>
          <UsersForm editing={editing} setEditing={setEditing} editUser={editUser} addUser={addUser} />
          <UsersList data={usersList} setEditing={setEditing} handleDelete={handleDelete} />
        </>
      )}
    </div>
  );
}

export default App;
