import React from 'react';

export interface VirtualizedListProps<T> {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T, index: number) => string | number;
  className?: string;
}

// 简化的列表组件，移除虚拟化功能，适合服务器端渲染
export function VirtualizedList<T>({ items, render, itemKey, className }: VirtualizedListProps<T>) {
  return (
    <section className={className ?? 'overflow-auto relative'}>
      <div>
        {items.map((item, index) => (
          <div key={itemKey(item, index)}>{render(item, index)}</div>
        ))}
      </div>
    </section>
  );
}

export default VirtualizedList;
