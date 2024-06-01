import { useParams } from "react-router-dom";
import Header from "../components/buyGamePageComponents/Header";
import GamePlayer from "../components/GamePlayerComponent/GamePlayer";

const PlayGame = () => {
  const { id } = useParams();
  return (
    <div className="bg-gray-900 w-full min-h-screen text-white overflow-hidden">
      <Header />
      <div className="w-full h-full">
        <GamePlayer id={id ?? ""} />
      </div>
    </div>
  );
};

export default PlayGame;
