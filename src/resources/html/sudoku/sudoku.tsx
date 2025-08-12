import React from 'react'

const Sudoku = ({ sudokuData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 flex flex-col items-center py-8">
      <div className="w-full max-w-xl mx-auto">
        <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
          <div className="flex flex-row mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <div
                key={n}
                className="w-12 h-8 flex items-center justify-center text-blue-700 font-bold text-lg"
              >
                {n}
              </div>
            ))}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col mr-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <div
                  key={n}
                  className="w-8 h-12 flex items-center justify-center text-blue-700 font-bold text-lg"
                >
                  {n}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-9 grid-rows-9 gap-1">
              {sudokuData &&
                sudokuData.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="w-12 h-12 flex items-center justify-center border border-gray-300 text-xl font-semibold bg-gray-50"
                    >
                      {cell !== 0 ? cell : ''}
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sudoku
