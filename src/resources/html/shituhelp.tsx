import React from 'react'
import bgURL from '@src/resources/img/shituhelp.jpg'
import iconURL from '@src/resources/img/icon.png'
import HTML from './HTML'

const ShituHelp = ({ version, helpData = [] }) => {
  return (
    <HTML>
      <div
        className=" bg-cover bg-center flex flex-col items-center py-8"
        style={{ backgroundImage: `url('${bgURL}')` }}
      >
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <span className="flex w-10 h-10 rounded bg-blue-200 items-center justify-center">
                <img src={iconURL} alt="icon" className="w-8 h-8" />
              </span>
              #师徒帮助
              <span className="ml-2 text-base text-gray-500">{version}</span>
            </div>
          </div>
          {helpData.map((val, idx) => (
            <div className="rounded-xl shadow bg-white/70 p-4 mb-6" key={idx}>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {val.group}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {val.list.map((item, i) => (
                  <div
                    className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                    key={i}
                  >
                    <span
                      className={`flex w-10 h-10 rounded bg-blue-100 items-center justify-center ${item.icon}`}
                    >
                      <img src={iconURL} alt="icon" className="w-8 h-8" />
                    </span>
                    <div>
                      <strong className="block text-base text-blue-800 mb-1">
                        {item.title}
                      </strong>
                      <span className="block text-sm text-gray-700">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center text-gray-500 mt-8">
            Created By xiuxian
            <span className="ml-2 text-base text-blue-400">@1.3.0</span>
          </div>
        </div>
      </div>
    </HTML>
  )
}

export default ShituHelp
