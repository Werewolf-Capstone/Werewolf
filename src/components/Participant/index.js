import React, { useRef, useEffect } from 'react';

export const Participant = ({
  userStreamTuple,
  handleVillagerVoteButton,
  night,
  ourDocId,
  role,
}) => {
  console.log('Inside participant component', userStreamTuple[1]);
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = userStreamTuple[1];
  }, []);

  //userStreamTuple[peerjsId, stream object]
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

//if night:
//      if role === 'villager':
//          userStreamTuple[1].active = false

// also add conditional button generation

// WW , Seer, Medic
