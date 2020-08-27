import React, { useRef, useEffect } from 'react';

export const Participant = ({
  userStreamTuple,
  handleVillagerVoteButton,
  night,
  ourDocId,
  role,
}) => {
  const videoRef = useRef();
  const [userPeerId, stream] = userStreamTuple;

  useEffect(() => {
    videoRef.current.srcObject = stream;
  }, []);

  //need to put in logic for closing video if disconnection

  return (
    <div className='participant'>
      <h3>{userPeerId}</h3>
      <video ref={videoRef} autoPlay={true} muted={true} />
      <button onClick={() => handleVillagerVoteButton(userPeerId)}>Kill</button>
    </div>
  );
};
