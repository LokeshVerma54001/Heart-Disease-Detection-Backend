import Header from "./components/Header";
import PredictionForm from "./components/PredictionForm";


export default function Home() {
  return (
    <div className="text-white h-full inset-0 bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 opacity-100">
      <div className="flex w-full items-center justify-center flex-col">
        <Header/>
        <PredictionForm/>
      </div>
    </div>
  );
}
