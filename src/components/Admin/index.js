import React, { useEffect, useState } from "react";
import * as ROLES from "../../constants/roles";
import { withFirebase } from "../Firebase";
import "firebase/firestore";
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const getUsers = async () => {
    await props.firebase.users();
  };
  useEffect(() => {
    setLoading(true);
    const userList = [];
    props.firebase.users().then((snapshot) =>
      snapshot.forEach((doc) => {
        userList.push(doc.data().username);
      })
    );
    console.log(userList);
    setLoading(false);
    setUsers(userList);
  }, []);
  return (
    <div>
      <h1>Admin</h1>
      <p>Restricted area! Only users with the admin role are authorized.</p>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        console.log(users) //users.length > 0 && users.map((user) => console.log(users))
      )}
    </div>
  );
};
// const condition = authUser =>
//   authUser && !!authUser.roles[ROLES.ADMIN];
export default withFirebase(Admin);