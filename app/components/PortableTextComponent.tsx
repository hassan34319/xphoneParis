import { PortableText } from '@portabletext/react'

const components = {
  block: {
    h1: ({children}) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
    normal: ({children}) => <p className="my-2">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4">{children}</blockquote>,
  }
}

export default function PortableTextComponent({ content }) {
  return (
    <div className="prose max-w-none">
      <PortableText value={content} components={components} />
    </div>
  )
}
