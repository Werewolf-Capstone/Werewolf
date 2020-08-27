/**
 * Adds a user's stream to array of streams in local state (if it isn't in there already)
 * @param {*} stream - an MediaStream type object containing the user's webcam + mic stream
 * @param {*} userPeerId - the user's PeerJS ID
 */
export async function addVideoStream(stream, userPeerId) {
  let newTuple = [userPeerId, stream];
  if (this.state.userStreamArr.includes(newTuple)) return;
  await this.setState({
    userStreamArr: [...this.state.userStreamArr, newTuple],
  });
}

/**
 * When a new user connects, this function grabs their PeerJS object and stream, and connects the new user to pre-existing users
 * @param {*} userPeerId - the user's PeerJS ID
 * @param {*} stream - an MediaStream type object containing the user's webcam + mic stream
 * @param {*} myPeer - the user's PeerJS object
 */
export function connectToNewUser(userPeerId, stream, myPeer) {
  const call = myPeer.call(userPeerId, stream);
  if (!call) return;

  //const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    if (userPeerId !== this.state.ourPeerId) {
      if (!this.peers.has(call.peer)) {
        this.addVideoStream(userVideoStream, userPeerId);
      }
    }
  });

  //not sure hwo this works, as the video declared above doesn't really do anything.
  //we used to pass it into addVideoStream a while back, but we don't use it in that fucnction at all either
  // call.on('close', () => {
  //   video.remove();
  // });
}
