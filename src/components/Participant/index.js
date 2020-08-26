import React, { useRef, useEffect } from 'react';

export const Participant = ({ userStreamTuple }) => {
  console.log('Inside participant component', userStreamTuple);
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.srcObject = userStreamTuple[1];
  }, []);

  return (
    <div className='participant'>
      <h3>{userStreamTuple[0]}</h3>
      <video ref={videoRef} autoPlay={true} muted={true} />
    </div>
  );
};
