function interactStop() {
  interact('.drag-drop').unset();
}

function interactStart() {
  function dragMoveListener(event) {
    if (globalDSelected === undefined || globalDSelected.length === 0) {
      // User should explicity select the move/drag tool in wysiwyg
      return;
    }

    globalDSelected.forEach(function (element) {
      var target = element,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    });

    // Take a quickSnap when done moving
    if (event.button == 0) {
      formDesigner.fdObjectHandler.snapShot();
      formDesigner.fdObjectHandler.quickSnap();
    }
  }

  // this is used later in the resizing
  window.dragMoveListener = dragMoveListener;

  interact('.drag-drop')
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      // dragMoveListener from the dragging demo above
      onmove: dragMoveListener,
    })
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent',
        }),
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],
      inertia: true,
    })
    .on('resizemove', function (event) {
      // Stop drag-n-select when using drag-n-drop (re-size)
      globalDSelected.forEach((target) => {
        (x = parseFloat(target.getAttribute('data-x')) || 0),
          (y = parseFloat(target.getAttribute('data-y')) || 0);
        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      });

      // Take a quickSnap when done re-sizing
      if (event.button == 0) {
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      }
    });
}
