import { Image } from 'jsxp';
import React from 'react';
import { PropsWithChildren } from 'react';

type MessageHeaderProps = {
  value: {
    Avatar: string;
    Id: string;
    Name: string;
  };
} & PropsWithChildren;

const MessageHeader = ({ value, children }: MessageHeaderProps) => {
  return (
    <section className='relative select-none flex flex-row justify-between items-center w-full shadow-md'>
      <div className='flex flex-row gap-3 px-2 py-1'>
        <div className='flex items-center'>
          {value.Avatar ? <Image className='w-10 h-10 rounded-full' src={value.Avatar} alt='Avatar' /> : <div className='w-10 h-10 rounded-full bg-white' />}
        </div>
        <div className='flex flex-col justify-center'>
          <div className='font-semibold '>{value.Name}</div>
          <div className='text-sm text-[var(--textPreformat-background)]'>{value.Id}</div>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default MessageHeader;
