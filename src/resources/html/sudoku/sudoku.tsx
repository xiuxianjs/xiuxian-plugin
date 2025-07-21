import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import cssURL from './sudoku.css'

const Sudoku = ({ sudokuData }) => {
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
      </head>
      <body>
        <div id="sudoku_box">
          <div className="font">123456789</div>
          <div className="left_font">123456789</div>
          <ul className="wrap">
            <div
              style={{
                left: '5px',
                top: '165px',
                width: '490px',
                height: '5px',
                position: 'absolute',
                background: 'red'
              }}
            ></div>
            {/* Sudoku grid would be rendered here based on sudokuData */}
            {sudokuData &&
              sudokuData.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <li
                    key={`${rowIndex}-${colIndex}`}
                    className="grid"
                    style={{
                      left: `${5 + colIndex * 54}px`,
                      top: `${5 + rowIndex * 54}px`
                    }}
                  >
                    {cell !== 0 ? cell : ''}
                  </li>
                ))
              )}
          </ul>
        </div>
      </body>
    </html>
  )
}

export default Sudoku
