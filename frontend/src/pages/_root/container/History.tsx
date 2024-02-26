import { useEffect, useState } from "react";
import axios from "../../../axios/api";

interface Histo {
  score: string;
  opponent: string;
  result: string;
  exp: string;
}

const History = () => {
  const [matchHistory, setMatchHistory] = useState<Histo[]>([]);

  useEffect(() => {
    const fetchHisto = async () => {
      try {
        const response = await axios.get("/users/histo");
        formatHisto(response.data);
      } catch (error) {
        console.error("Error fetching blocked users:", error);
      }
    };

    fetchHisto();
  }, []);

  const formatHisto = (histo: string[]) => {
    let histoFormated: Histo[] = [];
    let prevOpp = "";
    let prevresult = "";
	let revenge = false;
    histo.reverse().map((match) => {
      let parts = match.split(" ");
      let score = parts[0];
      let opponent = parts.slice(1, -2).join(" ");
      let result = parts[parts.length - 2];
      let exp = parts[parts.length - 1];
      if (
        prevOpp === opponent &&
        prevresult === "Victory" &&
        result === "Defeat" &&
		revenge === false
      ) {
		revenge = true;
		console.log("REVENGEEEEEEEEEE");
        axios.post(`achievements/add/${4}`);
      }
	  console.log("revenge :", revenge);	
	  console.log("prevOpp :", prevOpp, "opponent :", opponent);
      prevOpp = opponent;
	  console.log("prevresult :", prevresult, "result :", result);
      prevresult = result;
      histoFormated.push({ score, opponent, result, exp });
    });
    setMatchHistory(histoFormated);
  };

  const score = "Score";
  const opponent = "Opponent";
  const result = "Result";
  const exp = "Exp";

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
            <div>
              <table className="w-full">
                <tbody>
                  <tr className="text-purple">
                    <th className="w-1/6 text-center">{score}</th>
                    <th className="w-1/3 text-center">{opponent}</th>
                    <th className="w-1/3 text-center">{result}</th>
                    <th className="w-1/6 text-center">{exp}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-black">
              {matchHistory.length !== 0 && (
                <table className="w-full">
                  <tbody className="text-lilac scrollbar-thin scrollbar-thumb-black">
                    {matchHistory.map((match, index) => (
                      <tr key={index}>
                        <td className="w-1/6 text-center">{match.score}</td>
                        <td className="w-1/3 text-center">{match.opponent}</td>
                        <td className="w-1/3 text-center">{match.result}</td>
                        <td className="w-1/6 text-center">{match.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
