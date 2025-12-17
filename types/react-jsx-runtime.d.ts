import type * as React from 'react';

declare module 'react/jsx-runtime' {
  export { Fragment } from 'react';

  export namespace JSX {
    export import ElementType = React.JSX.ElementType;
    export import Element = React.JSX.Element;
    export import ElementClass = React.JSX.ElementClass;
    export import ElementAttributesProperty = React.JSX.ElementAttributesProperty;
    export import ElementChildrenAttribute = React.JSX.ElementChildrenAttribute;
    export import LibraryManagedAttributes = React.JSX.LibraryManagedAttributes;
    export import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    export import IntrinsicClassAttributes = React.JSX.IntrinsicClassAttributes;
    export import IntrinsicElements = React.JSX.IntrinsicElements;
  }

  export const jsx: typeof React.jsx;
  export const jsxs: typeof React.jsxs;
  export const jsxDEV: typeof React.jsxDEV;
}
