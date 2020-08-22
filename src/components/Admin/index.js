import React, { useEffect, useState } from "react";
import * as ROLES from "../../constants/roles";
import { withFirebase } from "../Firebase";
// import "firebase/firestore";
const Admin = (props) => {
  //   constructor(props) {
  //     super(props);
  //     this.state = { users: [], isloading: true };
  //   }
  //   componentDidMount() {
  //     // this.setState({ isloading: true });
  //     const userList = [];
  //     this.props.firebase.users().then((snapshot) =>
  //       snapshot.forEach((doc) => {
  //         userList.push(doc.data().username);
  //       })
  //     );
  //     this.setState({ users: userList, isloading: false });
  //   }
  //   componentDidUpdate() {}
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
        return <li key={user.key}> {user.username}</li>
        })
    }

  return (
    <div>
      <h1>Admin</h1>
      <p>Restricted area! Only users with the admin role are authorized.</p>
  <ol>{displayList}</ol>
    </div>
  );
};
// const condition = authUser =>
//   authUser && !!authUser.roles[ROLES.ADMIN];
export default withFirebase(Admin);

//OLD SEMI-WORKING USE EFFECT
// setLoading(true);
//     const userList = [];
//     props.firebase.users()
//     .then((snapshot) => 
//       snapshot.forEach((doc) => {
//         userList.push(doc.data().username);
//       })
//     );
//     console.log(userList);
//     setLoading(false);
//     setUsers(userList);