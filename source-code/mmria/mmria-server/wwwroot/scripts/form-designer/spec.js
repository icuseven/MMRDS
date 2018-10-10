// Get specification list
var urlList = location.protocol + '//' + location.host + '/api/ui_specification/list';
var dmWidth;
var specList = [];

// $.get(urlList, function(data, status){
//   console.log(data);
//   var inHTML = "";
//   $.each(data, function(index, value){
//     console.log(value._id);
//     console.log(value.dimension.width);
    
//     var newItem = "<li id=\""+value._id+"\"><a href=\"app.html\">"+ value._id + "</a></li>"
//     inHTML += newItem;
//   });
//   $("#repeatNavContainer").html(inHTML);
// });

function addNewSpec(name) {
  console.log(name);
  var newSpec = get_new_ui_specification(name);
  specList.push(newSpec);
  console.log(specList);

  var inHTML = "";
  $.each(specList, function (index, value) {
    console.log(value._id);
    console.log(value.dimension.width);

    var newItem = "<li id=\"" + value._id + "\"><a href=\"app.html\">" + value.name + "</a></li>"
    inHTML += newItem;
  });
  $("#repeatNavContainer").html(inHTML);
}