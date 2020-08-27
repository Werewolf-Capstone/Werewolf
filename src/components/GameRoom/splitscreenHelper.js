export async function handleMedic() {
    const player = await this.props.firebase.db
      .collection('rooms')
      .doc(this.state.gameId)
      .get();
  
    const medicChoice = player.data().medicChoice;
  
    if (medicChoice === '') return;
    else {
      console.log('setting checkMedic to true');
      this.props.firebase.db
        .collection('rooms')
        .doc(this.state.gameId)
        .update({ checkMedic: true });
  
      // also have to update local state
      await this.setState({checkMedic: true})
    }
  }