import React from 'react'

const Breadcrumb = ({firstLayer, firstLayerLink, secondLayer, secondLayerLink}) => {
  
  return (
    <div>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href={firstLayerLink} className="inline-flex items-center text-[#74677B] text-sm font-medium hover:text-gray-900">
              {firstLayer}
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              <a href= {secondLayerLink} className="ml-1 text-sm font-medium text-purple-primary">{secondLayer}</a>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  )
}

export default Breadcrumb