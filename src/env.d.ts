/// <reference types="lvyjs/env" />
/// <reference types="alemonjs/env" />

// .yaml
declare module '*.yaml' {
  const content: string
  export default content
}

// .ttf
declare module '*.ttf' {
  const content: string
  export default content
}
