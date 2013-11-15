_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

function topSports(map, dataSource, tones, domains, categories) {
    var shade;
    categories = ["Basketball", "Football"];
    var colors = _(tones).map(function(tone) {
      return chroma.scale(tone).domain(domains, 50, 'log');
    });
    map.addLayer('usa', {
      styles: {
        fill: function(d) {
          var state = _(dataSource).find(function(price) {
            return price["State Full"] == d.name;
          });
          if (state) {
            index = categories.indexOf("Basketball"); //indexOf(state["Category"])
            shade = colors[index](Number(state["Avg Price"].replace(/[\$,]/g, "")));
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
            index = categories.indexOf("Basketball"); //indexOf(state["Category"])
            shade = colors[index](Number(state["Avg Price"].replace(/[\$,]/g, ""))).darker();
            return shade;
          } else {
            return "#eee";
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
    }
  });
  $("path").on("mouseenter", function() {
    var color = $(this).css("fill");
    $(this).css("fill", chroma(color).brighten(9));
  });
  $("path").on("mouseleave", function() {
    $(this).css("fill", $(this).attr("fill"));
  });
}

$(function() {


 $.fn.qtip.defaults.position.adjust.x = 20;
 $.fn.qtip.defaults.position.adjust.y = 20;
 $.fn.qtip.defaults.position.at = "leftBottom";
 $.fn.qtip.defaults.position.my = "leftBottom";

  var map = $K.map('#usamap');
  map.loadMap("usa.svg")
  .done(function() {

  var domains = _(top_prices).map(function(price) {
    return Number(price["Avg Price"].replace(/[\$,]/g, ""));
  });

    topSports(map, top_prices, ["Reds"], domains);

    $(".panel-1").on("click", function() {
      topSports(map, top_prices, ["Reds"], domains);
    });
    $(".panel-2").on("click", function() {
      topSports(map, top_prices, ["Greens"], domains);
    });

  });
});

