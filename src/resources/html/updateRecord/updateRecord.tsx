import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from './updateRecord.css'
import Mingzi from '../../data/avatar/Mingzi.jpg'
// 定义更新日志项的类型
interface ChangelogItem {
  //   id: number;
  user: {
    name: string
    avatar?: string
  }
  text: string
  time: Date
}

// 更新日志组件
export default ({ Record }) => {
  const avatarMap = { 
    'Mingzi.jpg': Mingzi
  }
  const getAvatarSrc = (avatar: string | undefined): string => {
    if (!avatar) return '';
    return avatarMap[avatar] || '';
  };

  return (
    <>
      <LinkStyleSheet src={cssURL} />
      <div className="changelog-container">
        <h2>更新日志</h2>
        <ul className="changelog-list">
          {Record.map((item, index) => (
            <li key={item.id || index} className="changelog-item">
              <div className="user-info">
                {item.user.avatar ? (
                  <img
                    src={getAvatarSrc(item.user.avatar)}
                    alt={item.user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {item.user.name.charAt(0)}
                  </div>
                )}
                <span className="user-name">{item.user.name}</span>
              </div>
              <div className="changelog-content">
                <p className="changelog-text">{item.text}</p>
                <time className="changelog-time">{item.time}</time>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
