import React from 'react';
import { LinkStyleSheet } from 'jsxp';
import cssURL from '@src/resources/styles/tw.scss';
import tttgbnumberURL from '@src/resources/font/tttgbnumber.ttf';
import classNames from 'classnames';

const HTML = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement> & {
    linkStyleSheets?: string[];
  }
) => {
  const { linkStyleSheets = [], dangerouslySetInnerHTML, children, className, ...reSet } = props;

  return (
    <html className='p-0 m-0'>
      <head>
        <LinkStyleSheet src={cssURL} />
        {linkStyleSheets.map((src, index) => (
          <LinkStyleSheet key={index} src={src} />
        ))}
        <meta httpEquiv='content-type' content='text/html;charset=utf-8' />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${tttgbnumberURL}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            `
          }}
        />
        {dangerouslySetInnerHTML && <style dangerouslySetInnerHTML={dangerouslySetInnerHTML} />}
      </head>
      <body className={classNames('p-0 m-0 w-full text-center', className)} {...reSet}>
        {children}
      </body>
    </html>
  );
};

export default HTML;
