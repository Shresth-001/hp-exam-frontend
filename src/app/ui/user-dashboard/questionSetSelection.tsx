interface props{
    handleSet:(data:string)=>void
    closeModal:()=>void
}

export default function QuestionSet({closeModal,handleSet}:props) {
    return (
        <div>
             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className=" bg-gradient-to-r from-[#ff3c57] to-[#ff7861] text-white whitespace-nowrap
                         hover:from-[#ff5e7b] hover:to-[#ff9b7c] p-6 rounded-xl  w-96 shadow-lg">
            <h2 className="text-2xl  font-semibold mb-4">
              Select the question set
            </h2>
            <h3 className="text-lg font-medium mb-4">Please choose a set of question to begin</h3>
            <div className="grid grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((set) => (
                <button
                  key={set}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-red-300"
                  onClick={() => {
                    // console.log(`Selected ${set} for ${selectedStream}`);
                    handleSet(set);
                    closeModal();
                  }}
                >
                  {set}
                </button>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 block mx-auto px-4 py-2 rounded bg-gradient-to-r from-pink-700 to-red-700 text-white whitespace-nowrap hover:from-pink-600 hover:to-red-600 hover:shadow-lg hover:shadow-pink-400/50 "
            >
              Close
            </button>
          </div>
        </div>
        </div>
    )
}