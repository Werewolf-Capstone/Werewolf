export async function addVideoStream(video, stream, userId) {
  let newTuple = [userId, stream];

  if (this.state.userStreamArr.includes(newTuple)) return;
  await this.setState({
    userStreamArr: [...this.state.userStreamArr, newTuple],
  });
  console.log('adding a user stream to', newTuple);
}

export function connectToNewUser(userId, stream, myPeer) {
  const call = myPeer.call(userId, stream);
  if (!call) {
    return;
  }
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    if (userId !== this.state.ourPeerId) {
      if (!this.peers.has(call.peer)) {
        this.addVideoStream(video, userVideoStream, userId);
      }
    }
  });
  call.on('close', () => {
    video.remove();
  });
}
