import React, { useEffect, useState } from 'react';
import {getToken, onMessage} from 'firebase/messaging';
import {  messaging } from './firebase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction" 
import './styles/App.css';
const App = () => {
  const [employees, setEmployees] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState({ title: '', body: '' });
  const [user, setUser] = useState({ name: '', email: '' ,password:''});
  const [newTicket, setNewTicket] = useState({ title: '', description: '', status: 'open' });
  const [events, setEvents] = useState([]);
  const [usertoken,setUseroken] = useState();
  const [logindata,setLogindata] = useState({ email: '',password:''});
  const [role,setRole] = useState(null)
  const [username,setUsername] = useState(null);
  const [notifications,setNotifications] = useState([])
  useEffect(()=>{
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('role');
    if(role){
      setRole(role);
    }

  },[])

   useEffect(() => { 
        
     fetch('http://localhost:3000/employees')
       .then(res => res.json())
       .then(setEmployees);
     fetch('http://localhost:3000/notifications')
       .then(res => res.json())
       .then(setNotifications);
    fetch('http://localhost:3000/tickets')
      .then(res => res.json())
      .then(setTickets);

      Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          return getToken(messaging, { vapidKey: 'BP42PZplLuo7WggvQ-u5B6pWfy6rERCxsgq1vvBR1yVphnkMf9RIAx7P2J-QXvn3WtIwfuknErZMQ1P4hZLZccI' });
        } else {
          throw new Error('Permission not granted');
        }
      })
      .then((token) => {
        console.log('FCM Token:', token);
        setUseroken(token);
        const localtoken = localStorage.getItem('localtoken');
        if(!localtoken){
          localStorage.setItem('localtoken',token)
          fetch('http://localhost:3000/tokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              {token}
            )
          }).then(() => console.log('success'));
        }
      })
      .catch((err) => {
        console.error('Unable to get permission to notify.', err.message);
      });
    


   
 }, []);
  const handleSendNotification = () => {
    fetch('http://localhost:3000/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminmessage:message.title,
        token:"dwwQjlseSI6ygQV-8w7dQv:APA91bHoWCJMgMLzW3AkfN-tqw3LYb0JD_rH-buIcMLP7V8VZ15oBBREEGRTvJ6KhTzxLZyQbBP8UF4xj2f8Le8NaD4BlsdzVBLuCtAx-ISP-aw9u_zBTlIY8XBAFaGbKqUdnwWQB0hp"
      })
    }).then(() => {setMessage({ title: '', body: '' });alert('Notification send successfully')});
  };

  const handleCreateTicket = () => {
    fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTicket)
    }).then(res => res.json()).then(newTicket => setTickets([...tickets, newTicket]));
  };
  const handleSenduser = () => {
    fetch('http://localhost:3000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()).then(()=> {setUser({name:'',email:'',password:''});alert('Add user successfully')});
  };
  const handleDateClick = (arg) => {

    const title = prompt('Enter Event Title:');
   
    if (title) {
      const newEvent = { title, start: arg.dateStr };
      setEvents([...events, newEvent]);
    }
  };
  const login = ()=>{
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logindata)
    }).then(res => res.json()).then((res)=>{if(!res.role){alert(res.message)}else{localStorage.setItem('role',res.role);setRole(res.role);setUsername(res.name)}});
  };
  return (
    <div style={{width:'100vw'}}>
    {role?<>  <header>
        <h1>Task Management System</h1>
      </header>
      <div className="container">
        {role == 'ADMIN'?
        <div className="panel">
          <div style={{display:'flex',justifyContent:'space-between'}}><h2>Admin Panel</h2><button onClick={()=>{localStorage.clear();window.location.reload()}} style={{backgroundColor:'black'}}>Logout</button></div>
          <h3>Employees</h3>
          <ul className="list">
            {employees.map(emp => (
             
              <li  className="list-item"> Name:<span style={{color:'gray'}}>{emp.name}</span>.   Email: <span style={{color:'gray'}}>{emp.email}</span></li>
              
            ))}
          </ul>
          <h3>Tickets</h3>
          <ul className="list">
            {tickets.map(ticket => (
              <li key={ticket._id} className="list-item">Title : <span style={{color:'gray'}}>{ticket.title} </span> 
              Description :<span style={{color:'gray'}}>   {ticket.description}</span></li>
            ))}
          </ul>
          <h3>Send Notification</h3>
          <input
            type="text"
            placeholder="Content"
            value={message.title}
            onChange={e => setMessage({ ...message, title: e.target.value })}
          />
      
          <button onClick={handleSendNotification} style={{backgroundColor:'black'}}>Send</button>
          <h3>Add new Employee</h3>
          <input
            type="name"
            placeholder="Name"
            value={user.name}
            onChange={e => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={e => setUser({ ...user, password: e.target.value })}
          />
      
          <button onClick={handleSenduser} style={{backgroundColor:'black'}}>Post</button>
          <h3>All notifications</h3>
          <ul className="list">
            {notifications.map(emp => (
             
              <li  className="list-item"> <span style={{color:'gray'}}>{emp.content}</span></li>
              
            ))}
          </ul>
          <h3>Calendar</h3>
          <FullCalendar   plugins={[dayGridPlugin,interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        className="fullcalendar" />
        </div>:
        <div className="panel">
                    <div style={{display:'flex',justifyContent:'space-between'}}><h2>Employee Panel</h2><div><h3>{username}</h3><button onClick={()=>{localStorage.clear();window.location.reload()}} style={{backgroundColor:'black'}}>Logout</button></div></div>

          <h3>Tickets</h3>
          <ul className="list">
            {tickets.map(ticket => (
              <li key={ticket._id} className="list-item">Title : <span style={{color:'gray'}}>{ticket.title} </span> 
              Description :<span style={{color:'gray'}}>   {ticket.description}</span></li>
            ))}
          </ul>
          <h3>Raise Ticket</h3>
          <input
            type="text"
            placeholder="Title"
            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
          />
          <button onClick={handleCreateTicket} style={{backgroundColor:'black'}}>Create Ticket</button>
          <h3>All notifications</h3>
          <ul className="list">
            {notifications.map(emp => (
             
              <li  className="list-item"> <span style={{color:'gray'}}>{emp.content}</span></li>
              
            ))}
          </ul>
        </div>}
      </div></>:
      <div style={{width:'20rem',margin:'auto',justifyContent:'center'}}>
      <p > Login into Task Management System</p>
          <input
            type="email"
            placeholder="Email"
            value={logindata.email}
            onChange={e => setLogindata({ ...logindata, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={logindata.password}
            onChange={e => setLogindata({ ...logindata, password: e.target.value })}
          />
      
          <button onClick={login} style={{backgroundColor:'black',width:'21rem'}}>Login</button>
      </div>
      }
    </div>
  );
};

export default App;
