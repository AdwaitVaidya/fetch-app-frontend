import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
} from "@mui/material";
import { Dog } from "../../types";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean,
  onFavorite : (id: string)=>void,
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 350px;
  margin: 20px;
`;

const StyledCardMedia = styled(CardMedia)`
  height: 0;
  padding-top: 99.25%; // 16:9 aspect ratio for the image
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  flex-grow: 1;
`;

const StyledTitle = styled(Typography)`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center; /* Center text */
`;

const StyledAge = styled(Typography)`
  font-size: 16px;
  color: #c45500;
  margin-bottom: 5px;
  text-align: center; /* Center text */
`;

const StyledDescription = styled(Typography)`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  text-align: center; /* Center text */
`;

const StyledButton = styled(Button)`
  background-color: #f0c14b;
  color: #111;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
`;

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onFavorite }) => {
  const [color, setColor] = useState<'red'|'blue'>('blue');
  const [favourite, setFavourite] = useState<"Add as favourite" | "Favourite">("Add as favourite");

  const handleClick = () => {
    const newColor = color === 'red' ? 'blue' : 'red';
    setColor(newColor);
    const newFavourite = favourite === "Add as favourite" ? "Favourite" : "Add as favourite";
    setFavourite(newFavourite)
    onFavorite(dog.id)
  };
  return (
    <div>
      <StyledCard>
        <StyledCardMedia image={dog.img} />
        <StyledCardContent>
          <StyledTitle variant="h6">{dog.name}</StyledTitle>
          <StyledAge>Age: {dog.age}</StyledAge>
          <StyledDescription>Breed: {dog.breed}</StyledDescription>
          <StyledDescription>Zip Code: {dog.zip_code}</StyledDescription>
          <StyledButton style={{ backgroundColor: color }} onClick={handleClick}>{favourite}</StyledButton>
        </StyledCardContent>
      </StyledCard>
    </div>
  );
};

export default DogCard;
