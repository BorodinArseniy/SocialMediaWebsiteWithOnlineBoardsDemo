import React from 'react'


export default function ContentBlock({ item }){
    const { type, textContent, urlContent } = item
    if (type === 'TEXT' || type === 'QUOTE' || type === 'GOAL') return <p className="p-3 bg-gray-50 rounded">{textContent}</p>
    if (type === 'IMAGE') return <img className="rounded" src={urlContent} alt="img" />
    if (type === 'LINK') return <a className="text-blue-600" href={urlContent} target="_blank" rel="noreferrer">{urlContent}</a>
    if (type === 'VIDEO') return <iframe className="w-full aspect-video" src={urlContent} title="video" allowFullScreen />
    if (type === 'MUSIC') return <audio controls src={urlContent} className="w-full" />
    return null
}