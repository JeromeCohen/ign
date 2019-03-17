var articles = '';
var videos = '';

$(function (){
  console.log('Hello world')

  $.ajax({
  url: 'https://ign-apis.herokuapp.com/content',
  type: 'GET',
  dataType: 'jsonp',
  crossdomain: true,
  success: data => {
    console.log(data)
    const feed = $('#feed')
    const imgurl = data.data[1].thumbnails[2].url;

    data.data.forEach(function(item) {
      createHTML(item)
    });

    feed.append(articles);
  },
  error: function(request, error) {
    console.log(error);
  }
  });

  $("#videos").click(function(event){
    const feed = $('#feed');
    feed.empty();
    feed.append(videos);
  });

  $("#articles").click(function(event){
    const feed = $('#feed');
    feed.empty();
    feed.append(articles); 
  });

});

function createHTML(data) {
  const imgurl = data.thumbnails[2].url;
  const title = data.metadata.headline;
  if (data.contentType == 'article') {
    articles +=
    `<div class="container">
     <div class="row align-items-center">
       <div class="col-12 col-md-6"><img width="100%" src="${imgurl}" sizes="(max-width: 660px) 100vw, 660px"></div>
        <div class="col-12 col-md-6">
          <h3>${title}</h3>
          <p>Copy</p>
        </div>
      </div>
    </div>`
  } else {
    videos +=
    `<div class="container">
     <div class="row align-items-center">
       <div class="col-12 col-md-6"><img width="100%" src="${imgurl}" sizes="(max-width: 660px) 100vw, 660px"></div>
        <div class="col-12 col-md-6">
          <h3>${title}</h3>
          <p>Copy</p>
        </div>
      </div>
    </div>`
  }

  return articles
}
