import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../socket/socket";

interface Histo {
  score: string;
  opponent: string;
  result: string;
  exp: string;
}

interface historyProps {
  history: string[];
}

const History: React.FC<historyProps> = ({ history }) => {
  const [matchHistory, setMatchHistory] = useState<Histo[]>([]);

  const formatHisto = () => {
    let histoFormated: Histo[] = [];
    history.map((match) => {
      let parts = match.split(" ");
      let score = parts[0];
      let opponent = parts.slice(1, -2).join(" ");
      let result = parts[parts.length - 2];
      let exp = parts[parts.length - 1];
      histoFormated.push({ score, opponent, result, exp });
    });
    setMatchHistory(histoFormated);
  };

  return (
    <div className="flex mx-2 flex-row gap-4 md:gap-6">
      <div className="w-full relative">
        <p>
          <span className="text-2xl pl-4 font-audiowide absolute text-lilac">
            Match history
          </span>
        </p>
        <div className="bg-violet-black text-sm h-60 rounded-md m-2 mt-5 mb-2 px-4 py-2 pt-4">
          <div className="flex flex-col">
            {/* MATCH RESUME */}
            <div className="w-full">
              <table className="w-full">
                <tbody className="text-lilac scrollbar-thin scrollbar-thumb-black">
                  <tr className="text-purple">
                    <th className="w-1/6 font-thin">Score</th>
                    <th className="w-1/3 font-thin">Opponent</th>
                    <th className="w-1/3 font-thin">Result</th>
                    <th className="w-1/6 font-thin">Exp</th>
                    <td className="w-10px text-violet-black font-thin">iil</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-black">
              {matchHistory.length !== 0 && (
                <>
                  <table className="w-full">
                    <tbody className="text-lilac scrollbar-thin scrollbar-thumb-black">
                      {matchHistory.map((match, index) => (
                        <tr key={index}>
                          <td className="w-1/6 text-center">{match.score}</td>
                          <td className="w-1/3 text-center">
                            {match.opponent}
                          </td>
                          <td className="w-1/3 text-center">{match.result}</td>
                          <td className="w-1/6 text-center">{match.exp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
