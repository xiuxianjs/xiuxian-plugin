import React from 'react'
import HTML from './HTML'

// 更新日志组件
export default ({ Record }) => {
  return (
    <HTML>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 flex flex-col items-center py-8">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            更新日志
          </h2>
          <ul>
            {Record.map((item, index) => (
              <li
                key={item.id || index}
                className="flex items-start gap-4 mb-6 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col items-center mr-2">
                  {item.user.avatar ? (
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold ">
                      {item.user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 mt-2">
                    {item.user.name}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-base text-gray-800 mb-2">{item.text}</p>
                  <time className="text-xs text-gray-500">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HTML>
  )
}
