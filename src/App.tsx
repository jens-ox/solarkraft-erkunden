import { useState } from "react";
import { getSolarSystems } from "./api";
import MetricCard from "./MetricCard";
import { System } from "./types";


// TODO: Add loading indicator
// TODO: Add linechart to show the time distribution of the systems
function App() {
  const [city, setCity] = useState('')
  const [systems, setSystems] = useState<System[]>([])
  const [sumPower, setSumPower] = useState(0)
  const [newSystems, setNewSystems] = useState(0)

  async function handleClick(){
    await getSolarSystems(city)
    .then((data) => {
      // The props "InbetriebnahmeDatum" is formated like this: "/Date(1664409600000)/"
      // To leverage this prop as JS date, we create a cleaned version of the array 
      const cleanedData : System[] = data.Data.map((entry)=> {
        return {
          ...entry,
          CleanedDate: new Date(parseInt(entry.InbetriebnahmeDatum.split("(")[1].split(")")[0]))
        }
      })
      setSystems(cleanedData)
      setSumPower(Math.floor(data.Data.reduce((sum,item) => sum + item.Nettonennleistung, 0)));

      const beginningYear = new Date()
      beginningYear.setMonth(0)
      beginningYear.setDate(0)
      setNewSystems(cleanedData.filter((entry) => entry.CleanedDate > beginningYear).length)
    })
  }

  return (
    <div className="h-screen flex items-center bg-gradient-to-b from-yellow-300 via-blue-300 to-indigo-300">
      <div className="max-w-5xl mx-auto px-4 xs:px-6 flex flex-col items-center">
        <div className="text-center pb-8 lg:pb-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
            Erkunde die Solarkraft deiner Stadt! ☀️
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">Anwendbar innerhalb von Deutschland.</p>
        </div>
        <input onChange={(event) => setCity(event.target.value)} value={city} className="rounded-lg p-3 w-96 text-xl" placeholder="z.B. München"></input>
        <button className="bg-yellow-300 rounded-lg hover:bg-yellow-100 justify-center w-36 mt-4 h-12 flex items-center" type='submit' onClick={() => handleClick()}>Suchen</button>
        <div className="w-11/12 flex flex-col lg:flex-row mt-10 items-center lg:items-start">
          <div className="flex flex-row lg:flex-col">
            <MetricCard description="Neue Systeme dieses Jahr" value={newSystems} icon={null} />
            <MetricCard description="Anzahl angemeldeter PV Anlagen" value={systems.length} icon={null} />
            <MetricCard description="Gesamt Nettonennleistung" value={sumPower + " kW"} icon={null} />
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
