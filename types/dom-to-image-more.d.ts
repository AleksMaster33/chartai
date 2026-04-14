declare module 'dom-to-image-more' {
  interface Options {
    bgcolor?: string
    scale?: number
    width?: number
    height?: number
    quality?: number
    style?: Partial<CSSStyleDeclaration>
  }
  const domtoimage: {
    toPng(node: Node, options?: Options): Promise<string>
    toJpeg(node: Node, options?: Options): Promise<string>
    toSvg(node: Node, options?: Options): Promise<string>
    toBlob(node: Node, options?: Options): Promise<Blob>
    toCanvas(node: Node, options?: Options): Promise<HTMLCanvasElement>
  }
  export default domtoimage
}
