import React from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';
import { BsTrashFill } from 'react-icons/bs';

const UsersList = ({ data, setEditing, handleDelete }) => (
  <div className="users-list">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Country</th>
          <th>City</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      {data.map((user) => (
        <tr key={user.id}>
          <td>{`${user.first_name} ${user.last_name ? user.last_name : ''}`}</td>
          <td>{user.email}</td>
          <td>{user.country || '-'}</td>
          <td>{user.city || '-'}</td>
          <td>{user.phone || '-'}</td>
          <td className="actions">
            <button type="button" onClick={() => setEditing(user)}>
              <FaPencilAlt />
            </button>
            <button type="button" onClick={() => handleDelete(user.id)}>
              <BsTrashFill />
            </button>
          </td>
        </tr>
      ))}
    </table>
  </div>
);

UsersList.propTypes = {
  data: PropTypes.arrayOf({
    first_name: PropTypes.string, last_name: PropTypes.string, email: PropTypes.string, phone_number: PropTypes.string,
  }),
  setEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
UsersList.defaultProps = {
  data: [],
};

export default UsersList;
