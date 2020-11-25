const tasteApiKey = '391747-FindAFli-DCQCLNM5';
const tasteUrl = 'https://tastedive.com/api/similar';
const omdbApiKey = '577a3068';
const omdbUrl = 'https://www.omdbapi.com/';

/* Formats paramaters to be added into API url */
function formatQuery(params) {
    const query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return query.join('&');
}

/* Gets recommendations from the TasteDive API for the movie that user input */
function getRecommendations(movie, maxResults) {
    const params = {
        q: movie,
        type: 'movies',
        limit: maxResults,
        k: tasteApiKey,
        callback: 'results'
    };

    $.ajax({
        method: 'GET',
        data: params,
        url: tasteUrl,
        dataType: 'jsonp',
        success: (response) => displayResults(response),
        error: (jqXHR, status, error) => {
            $('#js-error-message').text(`Something went wrong: ${jqXHR.statusText}`);
        }
    });
}

/* Displays movie recommendations and information about the recommendations */
function displayResults(responseJson) {
    $('#results-list').empty();
    $('#js-error-message').empty();
    $('.results').removeClass('hidden');
    $('#no-results').addClass('hidden');

    const recommendations = responseJson.Similar.Results;

    if (recommendations.length === 0) {
        $('#no-results').removeClass('hidden');
        $('.results').addClass('hidden');
    } else {
        for (let i = 0; i < recommendations.length; i++) {
            getMovieInfo(recommendations[i].Name);
        }
    };
}

/* Gets information about a movie from the OMDb API then displays the information */
function getMovieInfo(movie) {
    const params = {
        apikey: omdbApiKey,
        t: movie.split(' ').join('+')
    };

    const queryString = formatQuery(params);
    const url = omdbUrl + '?' + queryString;

    fetch (url)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayMovieInfo(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    
}

/* Creates list item for movie and information about the movie */
function displayMovieInfo(responseJson) {
    $('#results-list').append(`
        <li class="list-wrapper">
            <h3>${responseJson.Title}</h3>
            <div class="movie-wrapper">
                <img src="${responseJson.Poster}" class="movie-poster" alt="${responseJson.Title} movie poster">
                <div class="info-wrapper">
                    <p>${responseJson.Year}</p>
                    <p>${responseJson.Rated}</p>
                    <p>${responseJson.Runtime}</p>
                    <p>${responseJson.Genre}</p>
                    <p>Director: ${responseJson.Director}</p>
                    <p>Cast: ${responseJson.Actors}</p>
                    <p>Ratings:</p>
                    <ul class="ratings">${displayRatings(responseJson)}</ul>
                    <p>${responseJson.Plot}</p>
                    <a href="https://www.imdb.com/title/${responseJson.imdbID}" target="_blank"><img src="images/imdb.png" class="imdb-logo" alt="IMDb link"></a>
                </div>
            </div>
        </li>
    `);
}

/* Creates list to display the Ratings of the movie */
function displayRatings(movie) {
    let ratings = ``;
    for (let i = 0; i < movie.Ratings.length; i++) {
        if (movie.Ratings[i].Source === 'Internet Movie Database') {
            ratings += `<li>IMDb: ${movie.Ratings[i].Value}</li>`;
        } else {
            ratings += `<li>${movie.Ratings[i].Source}: ${movie.Ratings[i].Value}</li>`;
        }
    }
    return ratings;
}

/* Watches form and handles form submit */
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('form').removeClass('not-started');
        const inputMovie = $('#movie').val();
        const maxResults = $('#max-results').val();
        getRecommendations(inputMovie, maxResults);
    });
}

$(watchForm());