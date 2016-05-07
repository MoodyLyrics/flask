var moods = ["admiring","adoring","affectionate","appreciative","approving","bemused","benevolent","blithe","calm","casual","celebratory","cheerful","comforting","comic","compassionate","complimentary","conciliatory","confident","contented","delightful","earnest","ebullient","ecstatic","effusive","elated","empathetic","encouraging","euphoric","excited","exhilarated","expectant","facetious","fervent","flippant","forthright","friendly","funny","gleeful","gushy","happy","hilarious","hopeful","humorous","interested","introspective","jovial","joyful","laudatory","light","lively","mirthful","modest","nostalgic","optimistic","passionate","placid","playful","poignant","proud","reassuring","reflective","relaxed","respectful","reverent","romantic","sanguine","scholarly","self-assured sentimental","serene","silly","sprightly","straightforward","sympathetic","tender","tranquil","whimsical","wistful","worshipful","zealous","commanding","direct","impartial","indirect","meditative","objective","questioning","speculative","unambiguous","unconcerned","understated","abhorring","acerbic","ambiguous","ambivalent","angry","annoyed","antagonistic","anxious","apathetic","apprehensive","belligerent","bewildered","biting","bitter","blunt","bossy","cold","conceited","condescending","confused","contemptuous","curt","cynical","demanding","depressed","derisive","derogatory","desolate","despairing","desperate","detached","diabolic","disappointed","disliking","disrespectful","doubtful","embarrassed","enraged","evasive","fatalistic","fearful","forceful","foreboding","frantic","frightened","frustrated","furious","gloomy","grave","greedy","grim","harsh","haughty","holier-than-thou","hopeless"];
var moodButtons = "";
var numberOfMoods = 20;
var relatedWords = [];
var relatedSongsElem = $("#related-songs");
var queryWordElem = $("#query-word");
var tableHtml = "";
var sliceBeep = 0;
var beeps = ["beep ", "boop ", "bop", ".", ".", "."];
var intervalBeep;

function initMoodButtons() {
  $("#mood-buttons").empty();
  moodButtons = "";
  _.sample(moods, numberOfMoods).forEach(function (mood) {
      moodButtons += '<button type="button" class="btn btn-default btn-lg btn-mood">' + mood + '</button>';
  });
  $("#mood-buttons").html(moodButtons);
  $(".btn-mood").on("click", function (event) {
    var buttonElem = $(event.target);
    searchRelatedWords(buttonElem.text());
  });
}



function searchRelatedWords(word) {
    clearInterval(intervalBeep);
    intervalBeep = setInterval( function() {
      sliceBeep++;
      if (sliceBeep > beeps.length) {
        sliceBeep = 0;
      }
      queryWordElem.html("<h3>" + beeps.slice(0, sliceBeep).join("") + "</h3>");
    }, 300);

    relatedWords = [];
    $.getJSON("api/synonyms/" + word, function (res) {
      $.each(res.data, function (key, val) {
        relatedWords.push(val);
      });
      $.getJSON("https://192.241.182.160:9200/songs/lyrics/_search?q=" + relatedWords.join(","),
       function (res) {
        clearInterval(intervalBeep);
        sliceBeep = 0;
        var trContainer;
        var tbodyContainer = "";
        if (res.length === 0) {
          queryWordElem.html("<h3>Oops, there are no results for the query <strong>" + word + "</strong>, try another word.</h3>");
        } else {
          $.each(res.hits.hits, function(key, val) {
            var song = val._source;
            trContainer = "<td>" + song.artist + "</td>" +
                          "<td>" + song.album  + "</td>" +
                          "<td>" + song.song   + "</td>" +
                          "<td>" + song.lyrics + "</td>" +
                          "<td><a target='_blank' href='https://www.youtube.com/results?search_query=" + song.artist + " " + song.song + "'>Source</a></td>";
            tbodyContainer += "<tr>" + trContainer + "</tr>";
          });
          queryWordElem.html('<h3>Results for <strong>' + word + "</strong>:</h3>");
          relatedSongsElem.html('<table class="table table-condensed">' +
                                  '<thead><tr>' + 
                                    '<th>Artist</th>' +
                                    '<th>Album</th>' +
                                    '<th>Song</th>' +
                                    '<th>Lyrics</th>' +
                                    '<th>YouTube Link</th></tr></thead>' +
                                  '<tbody>' + tbodyContainer + '</tbody>'
                                    )
        }
      });

    });
}

$("#search-button").on("click", function () {
    var queryWordVal = $("#input-word").val();
    if ( typeof queryWordVal === 'string' && queryWordVal.trim().length > 0){
      searchRelatedWords(queryWordVal);
    } else {
      alert("Please type in a word in the input field.");
    }
});

$("#refresh-mood").on("click", function () {
  initMoodButtons();
});

$('body').on('keypress', 'input', function(args) {
    if (args.keyCode == 13) {
        $("#search-button").click();
        return false;
    }
});

initMoodButtons();