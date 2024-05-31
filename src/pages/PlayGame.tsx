import { useParams } from "react-router-dom";
import Header from "../components/buyGamePageComponents/Header";

const PlayGame = () => {
  const { id } = useParams();
  return (
    <div className="bg-gray-900 w-full min-h-screen text-white">
      <Header />
      <iframe src="/game/index.html" height="92%" width="100%" />
    </div>
  );
};

export default PlayGame;
