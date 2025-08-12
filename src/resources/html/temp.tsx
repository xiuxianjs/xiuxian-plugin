import React from 'react'
import najieURL from '@src/resources/img/najie.jpg'
import HTML from './HTML'

const Temp = ({ temp }) => {
  return (
    <HTML>
      <div
        className=" bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-8"
        style={{
          backgroundImage: `url('${najieURL}')`,
          backgroundSize: 'cover'
        }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center">
            {temp &&
              temp.map((item, index) => (
                <div key={index} className="w-full mb-4">
                  <div className="text-base text-gray-800 font-medium mb-2">
                    {item}
                  </div>
                  <div className="w-full border-b border-dashed border-gray-400"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default Temp
