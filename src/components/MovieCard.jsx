import React from 'react'

const MovieCard = ({movie: {title, release_date, poster_path, vote_average, original_language }}) => {
    return (
        <div className="movie-card">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'src/assets/no-movie.png'} alt={title} />
            <div className="mt-4">
                <h3>{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="src/assets/star.svg" alt="star" />
                        <p>
                            {vote_average ? vote_average.toFixed(1): 'NA'}
                        </p>
                    </div>
                    <span>
                        &#9679;
                    </span>
                    <p className="lang">{original_language}</p>
                    <span>
                        &#9679;
                    </span>
                    <p class="year">
                        {release_date? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default MovieCard
