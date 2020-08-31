import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function Rules() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickOpen}
        className="fadeIn3 animated"
      >
        Rules
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title" className="dialog">
          {/* RULES */}
        </DialogTitle>
        <DialogContent className="dialog">
          <DialogContentText>
            The game proceeds in alternating night and day rounds. beginning
            with nighttime.
          </DialogContentText>
          <DialogContentText>The Night</DialogContentText>
          <DialogContentText>
            At night, the moderator tells all the players, "Close your eyes."
            Everyone begins slapping their knees (or table) to cover up any
            noises of the night.{" "}
          </DialogContentText>
          <DialogContentText>
            The moderator says, "Werewolves, open your eyes." The werewolves do
            so, and look around to recognize each other. The moderator should
            also note who the werewolves are. The moderator says "Werewolves,
            pick someone to kill." The werewolves silently agree on one villager
            (It's critical that they remain silent). The other players are
            sitting there with their eyes closed, and the werewolves don't want
            to give themselves away. Sign language is appropriate, or just
            pointing, nodding, raising eyebrows, and so on.{" "}
          </DialogContentText>
          <DialogContentText>
            When the werewolves have agreed on a victim, and the moderator
            understands who they picked, the moderator says, "Werewolves, close
            your eyes."{" "}
          </DialogContentText>
          <DialogContentText>
            Now, the moderator awakens the Doctor and says, "Doctor, who would
            you like to heal?" The Doctor selects someone they'd like to heal.
            The person chosen (which could be himself) will survive if the
            werewolves chose to kill them. If someone was killed, and then saved
            by the Doctor, the moderator will let the village know by saying,
            "Someone has been saved", at the beginning of day time.{" "}
          </DialogContentText>
          <DialogContentText>
            The moderator says "Seer, open your eyes. Seer, pick someone to ask
            about." The seer opens their eyes and silently points at another
            player. (Again, it is critical that this be entirely silent --
            because the seer doesn't want to reveal his identity to the
            werewolves.){" "}
          </DialogContentText>
          <DialogContentText>
            The moderator silently signs thumbs-up if the seer pointed at a
            werewolf, and thumbs-down if the seer pointed at an innocent
            villager. The moderator then says, "Seer, close your eyes."
          </DialogContentText>
          <DialogContentText>
            The moderator says, "Everybody open your eyes; it's daytime." And
            let's the villager know who has been killed. That person is
            immediately dead and out of the game. They do not reveal their
            identity.{" "}
          </DialogContentText>
          <DialogContentText>
            Alternative rule: After you die, you reveal what role you had.{" "}
          </DialogContentText>
          <DialogContentText>The Day </DialogContentText>
          <DialogContentText>
            For the first day, go around and have everyone introduce themselves
            (Example: Hey, I'm Matt. I'm the baker here in town, and I'm a
            villager.{" "}
          </DialogContentText>
          <DialogContentText>
            Daytime is very simple; all the living players gather in the village
            and decide who to kill. As soon as a majority of players vote for a
            particular player to kill, the moderator says "Ok, you're dead."{" "}
          </DialogContentText>
          <DialogContentText>
            Alternative rule: To keep the game moving along, you can put a time
            limit to how long a day is, and if the village doesn't chose someone
            to kill, they miss the opportunity.{" "}
          </DialogContentText>
          <DialogContentText>
            There are no restrictions on speech. Any living player can say
            anything they want -- truth, misdirection, nonsense, or a barefaced
            lie. Dead players may not speak at all. Similarly, as soon as a
            majority vote indicates that a player has been chosen to be killed,
            they are dead. If they want to protest their innocence or reveal
            some information (like the seer's visions), they must do it before
            the vote goes through.{" "}
          </DialogContentText>
          <DialogContentText>
            Once a player is killed, night falls and the cycle repeats.{" "}
          </DialogContentText>
          <DialogContentText>
            Moderator note: Continue to wake up the Doctor and Seer even if they
            are no longer alive.
          </DialogContentText>
          <DialogContentText>Winning</DialogContentText>
          <DialogContentText>
            The villagers win if they kill both werewolves.
          </DialogContentText>
          <DialogContentText>
            The werewolves win if they kill enough villagers so that the numbers
            are even. (Example: Two werewolves and two villagers)
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog">
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
