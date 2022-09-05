import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Modal, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEdit } from '@fortawesome/free-solid-svg-icons'
import request from './request'
import useDataEvent from './hooks/useDataEvent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editar, setEditar] = useState(false)
  const [error, setError] = useState(false)
  const [errorLabel, setErrorLabel] = useState('')
  const [data, setData, resetData] = useDataEvent({
    name: '',
    username: '',
    email: '',
    phone: ''
  })
  const [dataEdit, setDataEdit] = useState({})

  const getUsers = () => {
    setLoading(true)
    setError(false)
    setErrorLabel('')

    request.Get('/users', {}, r => {
      setUsers(r)
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }, e => {
      setError(true)
      setErrorLabel(e)
    })
  }

  const showForm = (edit = false, user = null) => {
    setEditar(edit)

    edit ? setData(user) : resetData()

    setShow(true)
  }

  const deleteUser = id => {
    request.Delete('/users', id, r => {
      const i = users.findIndex(u => u.id === id)

      const array = users.slice(0)

      array.splice(i, 1)
      
      setUsers(array)
    })
  }

  const done = () => {
    if (!data.name || !data.username || !data.email || !data.phone) {
      alert('You must complete all fields to continue')
      return
    }

    setShow(false)

    const method = editar ? 'Put' : 'Post'

    request[method]('/users', { ...data }, r => {
      if (editar) {
        const id = data.id
        const i = users.findIndex(u => u.id === id)

        const array = users.slice(0)

        array.splice(i, 1, data)
        
        setUsers(array)
      } else {
        const id = r.id

        const array = users.slice(0)

        array.push({ id , ...data })

        setUsers(array)
      }
    })
  }

  useEffect(() => {
    getUsers()
  }, [])

  return <div className='p-4'>
    {!loading && <Button variant="success" onClick={e => showForm()}>Add New</Button>}

    {loading
      ?<div className='full-width pt-4 d-flex justify-content-center'>
        <div className="spinner-border" role="status" />
      </div>
      : <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => 
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <OverlayTrigger
                    placement='top'
                    overlay={
                      <Tooltip>
                        Edit
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon className='mx-2 cursor-pointer' onClick={e => showForm(true, u)} icon={faEdit} color="green" />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement='top'
                    overlay={
                      <Tooltip>
                        Delete
                      </Tooltip>
                    }
                  >
                    <FontAwesomeIcon className='mx-2 cursor-pointer' onClick={e => deleteUser(u.id)} icon={faCancel} color="red" />
                  </OverlayTrigger>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    }

    <Modal show={show} onHide={e => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{editar ? 'Edit' : 'Add New'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control className='mt-2' type="text" placeholder="Name" defaultValue={data.name} name="name" onChange={setData} />
        <Form.Control className='mt-2' type="text" placeholder="User" defaultValue={data.username} name="username" onChange={setData} />
        <Form.Control className='mt-2' type="text" placeholder="Email" defaultValue={data.email} name="email" onChange={setData} />
        <Form.Control className='mt-2' type="text" placeholder="Phone" defaultValue={data.phone} name="phone" onChange={setData} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={done}>Done</Button>
      </Modal.Footer>
    </Modal>
  </div>
}

export default App;
