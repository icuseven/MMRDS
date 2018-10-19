/******************************************************
 * START properties
 *****************************************************/
var urlList = location.protocol + '//' + location.host + '/api/ui_specification/list';
var dmWidth;
var specList = [];


/******************************************************
 * START logic
 *****************************************************/
grapSpecList();


/******************************************************
 * START methods
 *****************************************************/

/**
 * Implements method to add new specification and post it to the database
 * @param {String} name 
 */
function addNewSpec(name) {
  var newSpec = get_new_ui_specification(name);
  
  $.ajax({
    url: location.protocol + '//' + location.host + '/api/ui_specification',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(newSpec),
    type: "POST"
  }).done(function (response) {
      var response_obj = eval(response);
      if (response_obj.ok) {
        grapSpecList();
      }
  });
}

/**
 * Implements method to get specification list stored in couch DB and build HTML structure for list
 */
function grapSpecList() {
  $.get(urlList, function(data, status) {
    var inHTML = "";
    console.log(data);
    $.each(data, function(index, value) {
      console.log(value._id);
      console.log(value.dimension.width);

      var newItem =
        '<li id="' +
        value._id +
        '"><a href="/form-designer/app.html?_id='+value._id+'">' +
        value.name +
        "</a></li>";
      inHTML += newItem;
    });
    $("#repeatNavContainer").html(inHTML);
  });
}