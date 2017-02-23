
function loadData() {

    NYT_API_KEY = '';

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $imgWrapper = $('.img-wrapper');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $imgWrapper.text("");

    // load streetview
    street = $('#street').val() 
    city = $('#city').val();
    source='http://maps.googleapis.com/maps/api/streetview?size=600x300&location=';
    source+= street + ", " + city 

    $greeting.text('So, you want to live at ' + street + ", " + city + '?' )
    
    $imgWrapper.append($('<img>',{src:source}));

    // NYTimes AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ city +'&sort=newest&api-key=' + NYT_API_KEY

    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + city);

        articles = data.response.docs;

        for (var i=0; i < articles.length; i++){
            var article = articles[i];
            year = parseInt(article.pub_date.substring(0,4),10);
            if (year > 1990){
                $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">'+ article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
            };
        };
    }).fail(function(data){
        $nytElem.append("Sorry, we could not load articles from the New York Times.")
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    })

    // Wikipedia AJAX request
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&prop=revisions&rvprop=content&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.append("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];

            for (var i=0; i<articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + 
                    articleStr + '</a></li>');

            };

            clearTimeout(wikiRequestTimeout);
        }
    })

    return false;
};

$('#form-container').submit(loadData);
