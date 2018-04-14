function updateJSONCon(){
  console.log("Started");
  $.getJSON( "http://localhost:8000/public/js/consumer.json", function( data ) {
    var json = JSON.stringify(data);
    var listItems = "";
    $.each( data, function( key, val ) {
      listItems = listItems + "<li id='" + key + "'>" + val + "</li></br>";
    });   
    $( ".consumerInfo" ).html("<ul class='consumerList'>" + listItems + "</ul>" );
  });
};
function updateJSONProd(){
  console.log("Started");
  $.getJSON( "http://localhost:8000/public/js/producer.json", function( data ) {
    var json = JSON.stringify(data);
    var listItems = "";
    $.each( data, function( key, val ) {
      listItems = listItems + "<li id='" + key + "'>" + val + "</li></br>";
    });   
    $( ".producerInfo" ).html("<ul class='producerList'>" + listItems + "</ul>" );
  });
};
function updateJSONBuild(){
  console.log("Started");
  $.getJSON( "http://localhost:8000/public/js/building.json", function( data ) {
    var json = JSON.stringify(data);
    var listItems = "";
    $.each( data, function( key, val ) {
      listItems = listItems + "<li id='" + key + "'>" + val + "</li></br>";
    });   
    $( ".buildingInfo" ).html("<ul class='buildingList'>" + listItems + "</ul>" );
  });
};
function updateJSONPhoto(){
  console.log("Started");
  $.getJSON( "http://localhost:8000/public/js/photo.json", function( data ) {
    var json = JSON.stringify(data);
    $.each( data, function( key, val ) {
      photo = val;
      if (photo == "bought"){
        $('#bought').show();
        $('#empty').hide();
      };
      if (photo == "built"){
        $('#bought').hide();
        $('#selling').show();
      };
      if (photo == "sold"){
        $('#selling').fadeTo("slow", 0.4);
      };
    }); 
});
};

setInterval(updateJSONProd, 300);
setInterval(updateJSONCon, 300);
setInterval(updateJSONPhoto, 300);
setInterval(updateJSONBuild, 300);