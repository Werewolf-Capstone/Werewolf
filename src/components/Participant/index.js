import React, { useRef, useEffect } from 'react';

export const Participant = ({
  userStreamTuple,
  handleVillagerVoteButton,
  night,
  ourDocId,
  checkWerewolf,
  checkSeer,
  checkMedic,
  localRole,
  werewolfChoice,
  didSeerHit
}) => {
  const videoRef = useRef();
  const [userPeerId, stream] = userStreamTuple;

  const [videoOn, setVideoOn] = useState(true)




  useEffect(() => {
    videoRef.current.srcObject = stream;
  }, []);

  useEffect(() => {
    if(night && !checkWerewolf && localRole !== 'werewolf'){
      setVideoOn(false)
    }
        
  }, [role,night, checkWerewolf]);

  //need to put in logic for closing video if disconnection
  if(!night){
    return (
      <div>
        <h2>{werewolfChoice} was killed during the night</h2>
        <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={videoOn} muted={videoOn} />
        <button onClick={() => handleVillagerVoteButton(userPeerId)}>Kill</button>
      </div>

      </div>
      
    );
  }
  if(!night && localRole === 'seer'){
    return (
      <div>
        <h2>{werewolfChoice} was killed during the night</h2>
        <h2>{didSeerHit} is a werewolf</h2>
        <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={videoOn} muted={videoOn} />
        <button onClick={() => handleVillagerVoteButton(userPeerId)}>Kill</button>
      </div>

      </div>
      
    );
  }
  else if(night && !checkWerewolf && localRole === 'werewolf'){
    return (
      <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
      </div>
    );
  }
  else if(night && checkWerewolf && !checkSeer && localRole === 'seer'){
    return (
      <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleSeerCheckButton(userPeerId)}>Check Role</button>
      </div>
    );
  }
  else if(night && checkWerewolf && checkSeer && !checkMedic && localRole === 'medic'){
    return (
      <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={true} muted={true} />
        <button onClick={(e) => handleMedicSaveButton(userPeerId)}>Save Person</button>
      </div>
    );
  }
  else {
    return (
      <div className='participant'>
        <h3>{userPeerId}</h3>
        <video ref={videoRef} autoPlay={false} muted={false} />
      </div>
    );
  }

  
  
};
