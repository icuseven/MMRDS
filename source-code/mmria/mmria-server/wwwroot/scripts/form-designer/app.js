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

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // uncomment function below to get a real-time read out of new label properties 
    // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

    // set position: absolute to prevent effecting other objects
    target.style.position = 'absolute';
  });

$('#getStyle').click(function() {
  //console.log($(this.id).attr('style'));
  $(".resize-drag").each(function(e) {
    console.log(this.id, $(this).attr('style'));
  })
});

// Start metaData functionality
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
    var caseForm = result.find(x => x.name === this.id);
    
    var inHTML = "";
    
    $.each(caseForm.children, function(index, value) {
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