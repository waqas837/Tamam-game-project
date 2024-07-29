import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  PlusIcon as Add,
  MinusIcon as Remove,
} from "@heroicons/react/24/solid";

const CreateTeam = () => {
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Score, setTeam1Score] = useState(0);
  const [gameName, setGameName] = useState("");
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");

  const handleTeam1Increment = () => {
    setTeam1Score(team1Score + 1);
  };

  const handleTeam1Decrement = () => {
    if (team1Score > 0) {
      setTeam1Score(team1Score - 1);
    }
  };

  const handleTeam2Increment = () => {
    setTeam2Score(team2Score + 1);
  };

  const handleTeam2Decrement = () => {
    if (team2Score > 0) setTeam2Score(team2Score - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Game Name:", gameName);
    console.log("Team 1 Name:", team1Name, "Score:", team1Score);
    console.log("Team 2 Name:", team2Name, "Score:", team2Score);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Typography
        variant="h2"
        color="pink"
        className="font-bold text-4xl mb-8 text-center"
        style={{fontFamily:"Mooli"}}
      >
        Create Your Teams
      </Typography>

      <div className="w-full max-w-lg mx-auto">
        <Card
          color="transparent"
          shadow={true}
          className="p-8 border border-gray-300 rounded-lg"
        >
          <Typography
            variant="h4"
            color="pink"
            className="text-center mb-8 font-semibold"
            style={{fontFamily:"Mooli"}}
          >
            Register Your Game
          </Typography>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-8">
              <Input
                label="Game Name"
                color="pink"
                size="lg"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </div>
            <div className="flex gap-6 mb-8">
              <div className="flex-1">
                <Input
                  size="lg"
                  label="Team 1 Name"
                  color="pink"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                />
                <div className="flex items-center mt-4 border-t border-gray-200 pt-4">
                  <IconButton
                    onClick={handleTeam1Decrement}
                    size="small"
                    className="text-pink-500 hover:bg-pink-100 rounded-full"
                  >
                    <Remove className="h-5 w-5" />
                  </IconButton>
                  <Typography
                    variant="h6"
                    color="pink"
                    className="mx-4 font-semibold"
                    style={{fontFamily:"Mooli"}}
                  >
                    {team1Score}
                  </Typography>
                  <IconButton
                    onClick={handleTeam1Increment}
                    size="small"
                    className="text-pink-500 hover:bg-pink-100 rounded-full"
                  >
                    <Add className="h-5 w-5" />
                  </IconButton>
                </div>
              </div>
              <div className="flex-1">
                <Input
                  size="lg"
                  label="Team 2 Name"
                  color="pink"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                />
                <div className="flex items-center mt-4 border-t border-gray-200 pt-4">
                  <IconButton
                    onClick={handleTeam2Decrement}
                    size="small"
                    className="text-pink-500 hover:bg-pink-100 rounded-full"
                  >
                    <Remove className="h-5 w-5" />
                  </IconButton>
                  <Typography
                    variant="h6"
                    color="pink"
                    className="mx-4 font-semibold"
                    style={{fontFamily:"Mooli"}}
                  >
                    {team2Score}
                  </Typography>
                  <IconButton
                    onClick={handleTeam2Increment}
                    size="small"
                    className="text-pink-500 hover:bg-pink-100 rounded-full"
                    style={{fontFamily:"Mooli"}}
                  >
                    <Add className="h-5 w-5" />
                  </IconButton>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-6 w-full rounded-full"
              color="pink"
              style={{fontFamily:"Mooli"}}
            >
              Start Game
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeam;
