_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var player;

//There must be at least as many tones as categories!
function topSports(map, dataSource, tones, categories) {
    var min_price, max_price;
    var shade;
    var domains = _(dataSource).pluck("Avg Price");

    //Acquire max and min prices
    min_price = Math.min.apply(null, domains);
    max_price = Math.max.apply(null, domains);

    $(".range-slider").attr("min", min_price)
                      .attr("max", max_price)
                      .val(max_price);

    // var color = chroma.scale(tone).domain(domains, 50, 'log');
    var colors = _(tones).map(function(tone) {
      return chroma.scale(tone).domain(domains, 50, 'log');
    });

    categories = ["Basketball", "Baseball"];
    map.addLayer('usa', {
    click: function(d, path, event) {
      var state = _(dataSource).find(function(price) {
          return price["State Full"] == d.name;
        });
      var youtube = state["Youtube"];
      if (youtube !== "") {
        video_id = youtube.match(/watch\?v=(.*)/)[1];

        if (player === undefined) {
          player = new YT.Player('youtube-video', {
            height: '50%',
            width: '50%',
            videoId: video_id,
            events: {
              'onReady': onPlayerReady
            }
          });
        } else {
          player.loadVideoById({
            videoId: video_id
          });
          $("#youtube-video").show();
        }

        function onPlayerReady(e) {
          e.target.playVideo();
        }

        $(".youtube-lightbox").css({"z-index": "18000",
                                    "visibility": "1"});
      }
    },
    styles: {
      fill: function(d) {
        var state = _(dataSource).find(function(price) {
          return price["State Full"] == d.name;
        });
        if (state) {
          index = categories.indexOf("Basketball"); //indexOf(d.sport_name)
          shade = colors[index](state["Avg Price"]);
          return shade;
        } else {
          return "#eee";
        }
      },
      stroke: function(d) {
        var state = _(dataSource).find(function(price) {
          return price["State Full"] == d.name;
        });
        if (state) {
          index = categories.indexOf("Basketball"); //indexOf(d.sport_name)
          shade = colors[index](state["Avg Price"]).darker();
          return shade;
        } else {
          return "#aaa";
        }
      }
    },
    tooltips: function(d) {
      var template;
      var state = _(dataSource).find(function(price) {
        return price["State Full"] == d.name;
      });
      if (state) {
        template = _.template($("#top-price-template").html(), {state: state});
      } else {
        template = _.template($("#no-data-template").html());
      }
      return [d.name, template];
    }
  });


  $("path").mouseenter(function() {
    $(this).css("fill", chroma($(this).attr("fill")).brighten(8));
         }).mouseleave(function() {
    $(this).css("fill", $(this).attr("fill"));
         }).mousedown(function() {
    $(this).css("fill", chroma($(this).attr("fill")).brighten(16));
         }).mouseup(function() {
    $(this).css("fill", chroma($(this).attr("fill")).brighten(8));
         });

  return map;
}

$(function() {


 $.fn.qtip.defaults.position.adjust.x = 20;
 $.fn.qtip.defaults.position.adjust.y = 20;
 $.fn.qtip.defaults.position.at = "leftBottom";
 $.fn.qtip.defaults.position.my = "leftBottom";

  var map = $K.map('#usamap');
  map.loadMap("usa.svg")
  .done(function() {

    //Extract number from price
    top_prices = _(top_prices).map(function(datum) {
      datum["Avg Price"] = Number(datum["Avg Price"].replace(/[\$,]/g, ""));
      return datum;
    });

    var mapData = topSports(map, top_prices, ["Reds"]);

    $(".panel-1").on("click", function() {
      topSports(map, top_prices, ["Reds"]);
    });
    $(".panel-2").on("click", function() {
      topSports(map, top_prices, ["Greens"]);
    });

    $(".range-slider").on("change", function() {

      $(".range-value").text($(this).val());
    });

    $(".youtube-lightbox").click(function() {
      $("#youtube-video").hide();
      player.stopVideo();
      $(this).css({"visibility": 0, "z-index": -1});
    });



  });

});

