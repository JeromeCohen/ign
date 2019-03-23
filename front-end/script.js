var content;


$(function (){
  //pull content for IGN api
  $.ajax({
    url: 'https://ign-apis.herokuapp.com/content',
    type: 'GET',
    dataType: 'jsonp',
    crossdomain: true,
    success: data => {
      content = data.data;
      var contentIds = '';
      data.data.forEach((item) => {
        contentIds = contentIds + "," + item.contentId;
      });
      contentIds = contentIds.substring(1);

      //getComments also loadsFeed
      getComments(contentIds, loadFeed);
  },
  error: function(request, error) {
    console.log(error);
  }
});

  //Add sidebar functionality
  $(".list-group-item").each(function( index ) {
    $(this).click((event) => {
      //decide content type - latest is handled as a type so that re-ordering
      //can take place in helper function
      var type = '';
      switch (event.target.id) {
        case "articles":
          type = "article";
          break;
        case "videos":
          type = "video";
          break;
        case "latest":
          type = "latest";
          break;
      }

      //populate feed with articles
      const feed = $('#feed');
      feed.fadeOut("slow", function() {
        feed.empty();
        loadFeed(content, type);
      });
      feed.fadeIn("slow", function() {

      });


      //add active styling to sidebar link
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "")
      this.className += " active"
    });
  });
});

const loadFeed = (data, type) => {
  data.forEach((item) => {
    createHTMlHelper(item, type);
  });
}

//pulls appropriate data from JSON and creates container
const createHTMlHelper = (item, type) => {
  if (item.contentType == type || type === "latest") {
    if (type === "latest") {
      type = item.contentType;
    }

    const feed = $('#feed');
    const ago = postedAgo(item.metadata.publishDate);
    const time = `${ago.day} days, ${ago.hour} hours, ${ago.minute} minutes`
    const imgurl = item.thumbnails[2].url;
    const title = (type === "video") ? item.metadata.title : item.metadata.headline;
    const duration = (type === "video") ? secondsToMinutes(item.metadata.duration) : '';

    const count = item.metadata.comments;
    var comments = count;
    if (count === 0) {
      comments = "";
    }

    html = $(`<div class="item">
       <div class="row">
         <div class="col-md-6 img-container">
          <div class="thumb-img">
            <img class="thumbnail img-fluid" width="100%" src="${imgurl}">
          </div>
        </div>
        <div class="col-md-6 caption">
          <p class='metadata'><span>${time} - <i class="far fa-comment fa-sm"></i> ${comments}</span></p>
          <a class="title" href="#">${title}</a>
        </div>
      </div>`);

    feed.append(html);

    if (type === 'video') {
      const currentBlock = html.find(".thumb-img");
      currentBlock.append(`<div class='duration'><i class="fas fa-play-circle fa-lg"></i> ${duration}</div>`);
    }

  }
}

 //helper function to handle timestamps on posts
 function postedAgo(date) {
   date = new Date(date);
   var today = new Date();
   var difference = Math.abs(today - date);
   var ago = convertMS(difference);
   return ago
 }

 function secondsToMinutes(duration) {
   seconds = duration % 60;
   if (seconds < 10) {
     seconds = '0' + seconds;
   }
   return Math.floor(duration / 60) + ":" + seconds;
 }

 function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
  }

 const getComments = (contentIds, callback) => {
   $.ajax({
     url: 'https://ign-apis.herokuapp.com/comments',
     type: 'GET',
     data: "ids=" + contentIds,
     dataType: 'jsonp',
     crossdomain: true,
     success: data => {
       count = 0;
       data.content.forEach((item) => {
         content[count].metadata.comments = item.count;
         count++;
       });
       callback(content, "latest");


   },
   error: function(request, error) {
     console.log(error);
   }
 });
 }
