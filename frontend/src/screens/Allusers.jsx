import React, { useState } from 'react'
import Loader from '../components/Loader';
import { useGetUsersQuery } from '../slices/usersApiSlice';
import { Table, Button, FormControl, Pagination } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes,faInfo } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';

const Allusers = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const editHandler = (id) => {
    console.log('edit');
  }

  const filteredUsers = users?.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastuser = currentPage * usersPerPage;
  const indexOfFirstuser = indexOfLastuser - usersPerPage;
  const currentusers = filteredUsers?.slice(indexOfFirstuser, indexOfLastuser);

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 wow fadeInUp">All Users</h1>
      <FormControl
        type="text"
        placeholder="Search by name or email"
        className="mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table striped hover responsive className='table-sm wow fadeInUp'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {currentusers.map((user, index) => (
            <tr key={user._id} className={`wow fadeInUp`} data-wow-delay={`0.${index + 1}s`}>
              <td>{user._id}</td>
              <td>
  {user.avatar ? (
    <img 
      src={user.avatar} 
      alt={`${user.userName}'s avatar`} 
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  ) : (
    <div 
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {user.userName.charAt(0).toUpperCase()}
    </div>
  )}
</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                )}
              </td>
              <td>
                <LinkContainer to={`/show-user/${user._id}`}>
                  <Button variant="info">
                    <FontAwesomeIcon icon={faInfo} />
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default Allusers;