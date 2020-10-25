// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react" />
import * as React from 'react';

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'progressive-image': ProgressiveImageElementAttributes;
    }

    interface ProgressiveImageElementAttributes {
      src: string;
      thumbnail: string;
      blur?: number | string;
    }
  }
}
