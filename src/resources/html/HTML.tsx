import React from 'react'
import { LinkStyleSheet } from 'jsxp'
import cssURL from '@src/resources/styles/tw.scss'
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf'

const HTML = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLBodyElement>,
    HTMLBodyElement
  > & {
    linkStyleSheets?: string[]
  }
) => {
  const { linkStyleSheets = [], dangerouslySetInnerHTML, ...reSet } = props
  return (
    <html>
      <head>
        <LinkStyleSheet src={cssURL} />
        {linkStyleSheets.map((src, index) => (
          <LinkStyleSheet key={index} src={src} />
        ))}
        <meta httpEquiv="content-type" content="text/html;charset=utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${tttgbnumberURL}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
          }}
        />
        {dangerouslySetInnerHTML && (
          <style
            dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTML }}
          />
        )}
      </head>
      <body {...reSet} />
    </html>
  )
}

export default HTML
