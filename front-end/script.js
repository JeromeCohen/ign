var articles = '';
var videos = '';
var latest = '';

$(function (){
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
    //populate feed with videos
    const feed = $('#feed');
    feed.fadeOut("slow", function() {
      feed.empty();
      feed.append(videos);
    });
    feed.fadeIn("slow", function() {
      console.log('animation complete');
    });


    //add active styling to video link
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "")
    this.className += " active"
  });

  $("#articles").click(function(event){
    //populate feed with articles
    const feed = $('#feed');
    feed.fadeOut("slow", function() {
      feed.empty();
      feed.append(articles);
    });
    feed.fadeIn("slow", function() {
      console.log('animation complete');
    });

    //add active styling to articles link
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "")
    this.className += " active"
  });

});

function createHTML(data) {
  const time = postedAgo(data.metadata.publishDate) + "hr";
  const imgurl = data.thumbnails[2].url;
  const title = data.metadata.headline;
  if (data.contentType == 'article') {
    articles +=
    `<div class="container">
     <div class="row align-items-center">
       <div class="col-12 col-md-6"><img class="thumbnail" width="100%" src="${imgurl}" sizes="(max-width: 660px) 100vw, 660px"></div>
        <div class="col-12 col-md-6">
          <p>${time}</p>
          <a href="#">${title}</a>
        </div>
      </div>
    </div>`
  } else {
    const title = data.metadata.title;
    videos +=
    `<div class="container">
     <div class="row align-items-center">
       <div class="col-12 col-md-6"><img class="thumbnail" width="100%" src="${imgurl}" sizes="(max-width: 660px) 100vw, 660px"></div>
        <div class="col-12 col-md-6">
          <p>${time}</p>
          <a href="#">${title}</a>
        </div>
      </div>
    </div>`
  }

  return articles

 function postedAgo(date) {
   console.log(date);
   date = new Date(date);
   var today = new Date();
   var difference = Math.abs(today - date);
   var totalHours = Math.ceil((difference / (1000 * 3600)));
   return totalHours
 }
}
