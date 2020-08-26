import React, { useRef, useEffect } from 'react';

export const Participant = ({ userStreamTuple, handleVillagerVoteButton }) => {
  console.log('Inside participant component', userStreamTuple);
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = userStreamTuple[1];
  }, []);

  //userStreamTuple[peerjsId, streamId]
  return (
    <div className='participant'>
      <h3>{userStreamTuple[0]}</h3>
      <video ref={videoRef} autoPlay={true} muted={true} />
      <button onClick={() => handleVillagerVoteButton(userStreamTuple[0])}>
        Kill
      </button>
    </div>
  );
};
