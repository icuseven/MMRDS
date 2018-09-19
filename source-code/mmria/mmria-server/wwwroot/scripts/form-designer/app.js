// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      event.target.style.position = 'absolute';
        // uncomment function below to get a real-time read out of new label properties
        
        var textEl = event.target.querySelector('p');

        textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                        Math.pow(event.pageY - event.y0, 2) | 0))
                .toFixed(2) + 'px'); 
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // Output current metadata to specs
    writeFormSpecs(target.getAttribute('data-x'), target.getAttribute('data-y'), target.getAttribute('data-h'), target.getAttribute('data-w'), target.id);
  }

  // this is used later for resizing
  window.dragMoveListener = dragMoveListener;

interact('.resize-drag')
  .draggable({
    onmove: window.dragMoveListener,
    restrict: {
      restriction: 'parent',
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
  })
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    // keep the edges inside the parent
    restrictEdges: {
      outer: 'parent',
      endOnly: true,
    },

    // minimum size
    restrictSize: {
      min: { width: 100, height: 50 },
    },

    inertia: true,
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    target.setAttribute('data-w', event.rect.width);
    target.setAttribute('data-h', event.rect.height);

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // uncomment function below to get a real-time read out of new label properties 
    // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    
    // Output current metadata to specs
    writeFormSpecs(target.getAttribute('data-x'), target.getAttribute('data-y'), target.getAttribute('data-h'), target.getAttribute('data-w'), target.id);

    // set position: absolute to prevent effecting other objects
    target.style.position = 'absolute';
  });

// Start metaData functionality

// Global data
var activeRecord;
var activeRecordElements;
var fieldType = 'strings';

// Log new element styles
$('#getStyle').click(function() {
  var x;
  var y;
  var w;
  var h;
  var currentId;
  console.clear();
  //console.log($(this.id).attr('style'));

  // We are working with the current activeRecord group of elements
  console.log(activeRecord);
  $(".resize-drag").each(function(e) {
    console.log(this.id, $(this).attr('style'));
    console.log('x: ', $(this).attr('data-x'), 'y: ', $(this).attr('data-y'));
    x = $(this).attr('data-x');
    y = $(this).attr('data-y');
    h = $(this).attr('data-h');
    w = $(this).attr('data-w');
    currentId = this.id;
  });
  getFormSpecs(x,y,h,w,currentId);
});

// Get specification list
var urlList = location.protocol + '//' + location.host + '/api/ui_specification/list';
var dmWidth;
$.get(urlList, function(data, status){
  console.log(data);
  $.each(data, function(index, value){
    console.log(value._id);
    console.log(value.dimension.width);
    dmWidth = parseInt(value.dimension.width) * 125;
    $(".fd-grid-container").css("width", dmWidth+"px");
  });
});

// Get api data
var url = location.protocol + '//' + location.host + '/api/metadata';
$.get(url, function(data, status){
  var result = $.grep(data.children, function(e){ return e.type == 'form'; });
  console.log(result);




  var inHTML = "";

  $.each(result, function(index, value){
      var newItem = "<li class=\"clickTrigger\" id=\""+value.name+"\">"+ value.prompt + "</li>"
      inHTML += newItem;  
  });

  $("#repeatNavContainer").html(inHTML);

  $(".clickTrigger").click(function() {
    activeRecord = this.id;
    var caseForm = result.find(x => x.name === this.id);
    
    var inHTML = "";

    // Set what type of fields you would like
    activeRecordElements = getCaseFormElements(caseForm);
    
    // use $.each(caseForm.children, function(index, value) to revert back to all
    $.each(activeRecordElements[fieldType], function(index, value) {
      var newItem = `
        <div class="resize-drag" id="`+value.name+`">
        `+value.prompt+`
        </div>
      `;
      inHTML += newItem;
    });

    $("#repeatLabelContainer").html(inHTML);
  });

});

// Write form specs to screen
function writeFormSpecs(x,y,w,h,id) {
  var elementId = activeRecord+'/'+id;
  var formData = {
    "form_design": {
      [elementId]: {
        "prompt": {
          "x": x,
          "y": y,
          "height": h,
          "width": w
        },
      }
    }
  }
  var html = JSON.stringify(formData, undefined, 2)
  $("#specBlock").html(html)
}

var revId;
// Get Form Specifications
function getFormSpecs(x,y,w,h,currentElement) {
  var url = location.protocol + '//' + location.host +'/api/ui_specification/default-ui-specification';
  var elementId = activeRecord+'/'+currentElement;

  $.get(url, function(data, status) {
    console.log(data);
    revId = data._rev;

    var formData = {
      "_id": "default-ui-specification",
      "_rev": revId,
      "name": "default_ui_specification",
      "data_type": "ui-specification",
      "date_created": "2018-09-05T13:49:24.759Z",
      "created_by": "jhaines",
      "date_last_updated": "2018-09-05T13:49:24.759Z",
      "last_updated_by": "jhaines",
      "dimension": {
        "width": 8.5,
        "height": null
      },
      "form_design": {
        [elementId]: {
          "prompt": {
            "x": x,
            "y": y,
            "height": h,
            "width": w
          },
        }
      }
    }
  
    $.ajax({
      url: location.protocol + '//' + location.host + '/api/ui_specification/default-ui-specification',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(formData),
      type: "POST"
    }).done(function(response) 
    {
      console.log(response);
      console.log(revId);
      // var response_obj = eval(response);
      // if(response_obj.ok) {
      // }
    });

    $.get(url, function(data, status) {
      console.log('updated record', data);
    });

  });

  
};

// Grab caseFormElements fo certain type
function getCaseFormElements(caseForm) {
  var elements = {
    'labels': $.grep(caseForm.children, function(e){ return e.type == 'label'; }),
    'strings': $.grep(caseForm.children, function(e){ return e.type == 'string'; })
  }
  return elements;
}

// Grab fieldType for activeRecord
function grabNewType(arg) {
  fieldType = arg;
}