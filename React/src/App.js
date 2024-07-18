import './App.css';
import React, {useState, useEffect} from 'react'
import api from './api';
import axios from 'axios';

function App() {
  const [task, setTask] = useState([]);
  const [editID, setEditID] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [created, setCreated] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    created: ""
  });

  const fetchTasks = async () => {
    const response = await api.get('/tasks/');
  
    setTask(response.data);
  }

  useEffect(()=>{
    fetchTasks();
  },[])

  const handelInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value
    });
  };

  const handelFormSubmit = async (event) => {
  event.preventDefault();
  await api.post('/tasks/', formData);
  fetchTasks();
  setFormData({
    name: "",
    description: "",
    status: "",
    created: ""
  })
}
function handelClick (event) {
  const id = event.target.id;
  console.log(id)
}

const handelEdit = async(id, task) => {
  setName(task.name)
  setDescription(task.description)
  setStatus(task.status)
  setCreated(task.created)
  setEditID(id);
}


const handelDelete = (id) => {
 api.delete('/tasks/'+id)
 fetchTasks();
  setFormData({
    name: "",
    description: "",
    status: "",
    created: ""
  })
  window.location.reload()
  }

  const handelUpdate = () => {

     api.put('/tasks/'+editID, {name: name, description: description, status: status, created: created})
    fetchTasks();
     setFormData({
       name: "",
      description: "",
       status: "",
       created: ""
     })
     setEditID(0)
     window.location.reload()
  }
  

  return (
    <div>
      <div className='bg-orange-50'>
       <h1 className='font font-bold text-2xl text-red-600 p-5 m-5 '> <center>Task List</center></h1>
      </div>

      <div>
        <form onSubmit={handelFormSubmit}>
          <div className='p-2 m-2'>

            <label className='font font-bold m-2 p-2'>Name:</label><br />
            <input className='border border-black rounded-md m-2' type='text' id='name' name='name' onChange={handelInputChange} value={formData.name}/><br />
            <label className='font font-bold m-2 p-2'>Description:</label><br />
            <input className='border border-black rounded-md m-2' type='text' id='description' name='description' onChange={handelInputChange} value={formData.description}/><br />
            <label className='font font-bold m-2 p-2'>Status:</label><br />
            <select
            className='border border-black rounded-md m-2'
          name="status"
        value={formData.status}
        onChange={handelInputChange}
        style={{ display: "block" }}
      >
        <option value={null} label="Select Status">
          Select Status{" "}
        </option>
        <option value="To Do" label="To Do">
          {" "}
          To Do
        </option>
        <option value="In Progress" label="In Progress">
            In Progress
        </option>
        <option value="Completed" label="Completed">
          {" "}
          Completed
        </option>

        
       
      </select>   


            <label className='font font-bold m-2 p-2'>Created At:</label><br />
            <input className='border border-black rounded-md m-2' type='date' id='created' name='created' onChange={handelInputChange} value={formData.created}/><br />


          




          
          </div>
         <center> <button type='submit' className='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>Add</button></center>
        </form>

        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Descriptin</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Created At</th>
            </tr>
          </thead>
          <tbody>

          
{
  task.map((task) => (
    task.id == editID?
    <tr>
      <td> <input className='border border-black rounded-md m-2' type='text' id='name' name='uname' onChange={(e)=> setName(e.target.value)} value={name}/><br /></td>
      <td> <input className='border border-black rounded-md m-2' type='text' id='description' name='udescription' onChange={(e) => setDescription(e.target.value)} value={description}/><br /></td>
      
      <select
            className='border border-black rounded-md m-2'
          name="ustatus"
        value={status}
        onChange={(e)=> setStatus(e.target.value)}
        style={{ display: "block" }}
      >
        <option value={null} label="Select Status">
          Select Status{" "}
        </option>
        <option value="To Do" label="To Do">
          {" "}
          To Do
        </option>
        <option value="In Progress" label="In Progress">
            In Progress
        </option>
        <option value="Completed" label="Completed">
          {" "}
          Completed
        </option>
      </select>

      <td> <input className='border border-black rounded-md m-2' type='date' id='created' name='ucreated' onChange={(e)=> setCreated(e.target.value)} value={created}/><br /></td>
      <button className='text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={()=> handelUpdate()}>Update</button>
    </tr> 
    :
    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
    <td className='px-6 py-4'>{task.name}</td>
    <td className='px-6 py-4'>{task.description}</td>
    <td className='px-6 py-4'>{task.status}</td>
    <td className='px-6 py-4'>{task.created}</td>
    <td>
    <button className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={() => handelEdit(task.id, task)}>Edit</button>
    <button className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={()=>handelDelete(task.id)}> Delete</button>
    </td>
    </tr>
  )
     )
     
}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
