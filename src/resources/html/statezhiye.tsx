import React from 'react'
import stateURL from '@src/resources/img/state.jpg'
import HTML from './HTML'

const Statezhiye = ({ Level_list }) => {
  return (
    <HTML>
      <div
        className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url(${stateURL})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white bg-opacity-70 p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">
              职业等级
            </div>
            <div className="w-full">
              {Level_list?.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4"
                >
                  <div className="font-bold text-blue-800 text-lg mb-2">
                    等级：{item.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    熟练度要求：{item.experience}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default Statezhiye
