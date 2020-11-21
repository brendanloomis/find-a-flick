const tasteApiKey = "391747-FindAFli-DCQCLNM5";
const tasteUrl = "https://tastedive.com/api/similar";
const omdbApiKey = "577a3068";
const omdbUrl = "https://www.omdbapi.com/"

function formatQuery(params) {
    const query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return query.join('&');
}

/* Gets recommendations from the TasteDive API for the movie that user input */
function getRecommendations(movie, maxResults) {
    const params = {
        q: movie,
        type: "movies",
        limit: maxResults,
        k: tasteApiKey,
        callback: "results"
    };

    $.ajax({
        method: 'GET',
        data: params,
        url: tasteUrl,
        dataType: 'jsonp',
        success: (response) => displayResults(response)
    });
}

function displayResults(responseJson) {
    $('#results-list').empty();
    $('#js-error-message').empty();
    $('.results').removeClass('hidden');
    $('#no-results').addClass('hidden');

    let recommendations = responseJson.Similar.Results;
    console.log(recommendations);

    if (recommendations.length === 0) {
        $('#no-results').removeClass('hidden');
        $('.results').addClass('hidden');
    } else {
        for (let i = 0; i < recommendations.length; i++) {
            $('#results-list').append(`
                <li>${recommendations[i].Name}</li>
            `);
        }
    };
}

/*function getMovieInfo(movie) {
    const params = {
        apikey: omdbApiKey,
        t: movie
    };

    const queryString = formatQuery(params);
    const url = omdbUrl + "?" + queryString;
    console.log(url);

    fetch (url)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => console.log(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    
}*/

/* Watches form and handles form submit */
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const inputMovie = $('#movie').val();
        const maxResults = $('#max-results').val();
        getRecommendations(inputMovie, maxResults);
    });
}

$(watchForm());