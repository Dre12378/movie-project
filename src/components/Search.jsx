import React from 'react'
import searchLogo from '../assets/search.svg'

const Search = ({search, setSearch}) => {
    return (
        <div className="search">
            <div>
                <img src={searchLogo} alt="search" />
                <input type="text"
                       placeholder="Search through movies"
                       value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
        </div>
    )
}
export default Search
