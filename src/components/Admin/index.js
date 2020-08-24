import React, { useEffect, useState } from "react";
import * as ROLES from "../../constants/roles";
import { withFirebase } from "../Firebase";
// import "firebase/firestore";
const Admin = (props) => {
 
  const [users, setUsers] = useState(null);
//   const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // setLoading(true);
    props.firebase.users()
    .then((snapshot) => {
        if (!snapshot) {
            setUsers([])
        } else {
            let userList = []
            snapshot.forEach( user => {
                // console.log(user.data())
                userList.push({ key: user.id, ...user.data() })
            })
            setUsers(userList)
        }
      })
      .catch(error => {
          //make an error handler
      })
  
  }, []);

  let displayList;
    if (users === null) {
      displayList = <li>LOADING...</li>
    } else if (users.length === 0) {
        displayList = <li>NO USERS FOUND</li>
    } else {
        displayList = users.map(user => {
        return <li key={user.key}><div>Username: {user.username} </div> <div>Email: {user.email}</div></li>
        })
    }

  return (
    <div>
      <h1>Admin</h1>
      <p>Restricted area! Only users with the admin role are authorized.</p>
  <ul>{displayList}</ul>
    </div>
  );
};
// const condition = authUser =>
//   authUser && !!authUser.roles[ROLES.ADMIN];
export default withFirebase(Admin);
