declare module 'react-katex' {
  import * as React from 'react';

  export interface MathComponentProps {
    math?: string;
    children?: string;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: any;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  }

  export const InlineMath: React.FC<MathComponentProps>;
  export const BlockMath: React.FC<MathComponentProps>;
}
