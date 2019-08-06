// offsetRelative (or, if you prefer, positionRelative)
(function ($) {
  $.fn.offsetRelative = function (top) {
    var $this = $(this);
    var $parent = $this.offsetParent();
    var offset = $this.position();
    if (!top) return offset; // Didn't pass a 'top' element 
    else if ($parent.get(0).tagName == "BODY") return offset; // Reached top of document
    else if ($(top, $parent).length) return offset; // Parent element contains the 'top' element we want the offset to be relative to 
    else if ($parent[0] == $(top)[0]) return offset; // Reached the 'top' element we want the offset to be relative to 
    else { // Get parent's relative offset
      var parent_offset = $parent.offsetRelative(top);
      offset.top += parent_offset.top;
      offset.left += parent_offset.left;
      return offset;
    }
  };
  $.fn.positionRelative = function (top) {
    return $(this).offsetRelative(top);
  };
}(jQuery));

let apiURL = location.protocol + "//" + location.host + "/api/";
let endpointMetaData = 'metadata/';
let endpointUISpecification = 'ui_specification/';

// Declare Http request objects (for global scope)
let jsonMetaData;
let jsonUISpecification;

// Declare Data objects (use when done with requests)
let metaData = {
  fullObject: {},
  forms: {},
  activeForm: '',
};
let uiSpecification = {
  list: '',
  currentID: '',
  currentObject: {},
  localRevision: {},
  localCount: 0,
};
let fdObject = {};

// Declare Drag Select object (assign after elements are in DOM)
let fdDragSelect;

// Global scope for items drag selected
let globalDSelected = [];

// Form Designer Object Handler
formDesigner = {
  dataHandler: {
    newBuild: function() {
      jsonMetaData = $.get(apiURL + endpointMetaData);
      jsonMetaData
        .done(function (data, status) {
          metaData.fullObject = data;
          metaData.forms = formDesigner.dataHandler.getForms(data);
          formDesigner.canvasHandler.displayFormList(metaData.forms);
        })
        .fail(function (xhr, status, error) {
          console.log(xhr);
        });
    },
    getForms: function (metaData) {
      return $.grep(metaData.children, function (n) {
        return n.type === 'form';
      });
    },
    getFormFields: function (formName) {
      let currentForm;
      $.grep(metaData.forms, function (n) {
        if (n.name === formName) { currentForm = n };
      });
      return currentForm.children;
    }
  },
  fdObjectHandler: {
    snapShot: function(undo = false, init = false, unwrap = false) {
      if(undo) { $('.fd-path-object').removeAttr('style'); return true }
      let elems = document.getElementsByClassName("fd-path-object");
      let newElems = [];
      let target;
      let parent;
      let promptVcontrol;
      let path;

      // Loop through all elements of current form and prep
      $.each
      (
        elems,
        function(index, value) 
        {
          parent = $(value).parent();
          parentID = parent[0].id;
          if (value.tagName === 'LABEL') 
          {
            targetID = $(value)[0].htmlFor;
            target = `label[for='${targetID}']`;
            promptVcontrol = 'prompt';
            path = targetID.replace(/--/g, '/');
          } 
          else 
          {
            target = `#${value.id}`;
            promptVcontrol = 'control';
            path = value.id.replace(/--/g, '/');
          }

          let elemPos = $(target).position();;

          if(parentID === 'temp-wrap' && unwrap) 
          {
            elemPos = $(target).offsetRelative('.form-designer-canvas');
          }

          let elemHeight = $(target).outerHeight();
          let elemWidth = $(target).outerWidth();
          let fontWeight = $(target).css('font-weight');
          let fontSize = $(target).css('font-size');
          let fontStyle = $(target).css('font-style');
          let fontColor = $(target).css('color');
          let cssSytle = {
              position: 'absolute',
              top: elemPos.top,
              left: elemPos.left,
              height: elemHeight,
              width: elemWidth,
              'font-weight': fontWeight,
              'font-size': fontSize,
              'font-style': fontStyle,
              color: fontColor
          };
          
          // Add current element/path to fdObject
          if(init === false) 
          {
            formDesigner.fdObjectHandler.addPath(path, cssSytle, promptVcontrol);
          }

          // Add current element/path to array for later inline style setting
          newElems.push({target: target, style: cssSytle, promptVcontrol: promptVcontrol, path: path});
        }
      );

      // Update specification info (includes writing to modal).
      formDesigner.fdObjectHandler.mapToSpec();

      // Take quicksnap for local revision

      // Set element positions via inline style
      $.each
      (
        newElems,
        function (index, value) 
        {
          if(uiSpecification.currentObject.form_design[value.path] !== undefined) 
          {
            $(value.target).css(JSON.parse(uiSpecification.currentObject.form_design[value.path][value.promptVcontrol].style));
          }

          $(value.target).css('transform','');
          $(value.target).removeAttr('data-x data-y');
        }
      );     
    },
    quickSnap: function() {
      uiSpecification.localCount++;
      uiSpecification.localRevision[uiSpecification.localCount] = JSON.parse(JSON.stringify(uiSpecification.currentObject));
      $('#local-rev-container').html(fdTemplates.uiSpecification.dashboard.localRev());
    },
    rollBackRevision: function() {
      console.log('first local', uiSpecification.localCount);
      let index = uiSpecification.localCount - 1;
      uiSpecification.localCount = index;
      $('#local-rev-container').html(fdTemplates.uiSpecification.dashboard.localRev());
      console.log('local count', uiSpecification.localCount);
      uiSpecification.currentObject = JSON.parse(JSON.stringify(uiSpecification.localRevision[uiSpecification.localCount]));
      formDesigner.canvasHandler.formFields.display(metaData.activeForm);
      
    },
    addPath: function(path, style, promptVcontrol) {
      if(path in fdObject) {
        fdObject[path][promptVcontrol] = {
          style: JSON.stringify(style),
          x: null,
          y: null,
          height: null,
          width: null,
        };
      } else {
        fdObject[path] = {};
        fdObject[path][promptVcontrol] = { 
          style: JSON.stringify(style),
          x: null,
          y: null,
          height: null,
          width: null,
        };
      };
      
    },
    mapToSpec: function(data = null) {
      formDesigner.uiSpecHandler.writeToModal();
    }
  },
  uiSpecHandler: {
    newBuild: function() {
      jsonUISpecification = $.get(apiURL + endpointUISpecification + "list");
      jsonUISpecification
        .done(function(data, status) {
          uiSpecification.list = data;
          formDesigner.uiSpecHandler.displayOptions(uiSpecification);
        })
        .fail(function(xhr, status, error) {
          console.log(xhr);
        });
    },
    newSpecObject: function(name) {
      return {
        "name": name,
        "_id": $mmria.get_new_guid(),
        "data_type": "ui-specification",
        "date_created": new Date().toISOString(),
        "created_by": g_uid,
        "date_last_updated": new Date().toISOString(),
        "last_updated_by": g_uid,
        "dimension": {
          "width": 8.5,
          "height": null
        },
        "form_design": {}
      };
    },
    writeToModal: function() {
      let modalSpecObject = JSON.stringify(uiSpecification.currentObject, undefined, 4);
      $("#fd-modal-specs-printed").html(modalSpecObject);
    },
    addSpecToDB: function(name) {
      let newSpec = formDesigner.uiSpecHandler.newSpecObject(name);

      // Clear the spec name field
      $("#ui-spec-name-field").val('');
      $.ajax
      (
        {
        url: apiURL + endpointUISpecification,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(newSpec),
        type: "POST"
        }
      ).done
      (
        function(response) 
        {
          let response_obj = eval(response);
          if (response_obj.ok) 
          {
            formDesigner.uiSpecHandler.newBuild();
          }
        }
      );
    },
    deleteSpec: function() {
      $.ajax({
        url: apiURL + endpointUISpecification + uiSpecification.currentID + '?rev=' + uiSpecification.currentObject._rev,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '',
        type: "DELETE"
      }).done(function (response) {
        let response_obj = eval(response);
        if (response_obj.ok) {
          formDesigner.uiSpecHandler.newBuild();
          let selector = { value: 'default_ui_specification' };
          formDesigner.uiSpecHandler.setCurrent(selector); // Reset current spec in case user deleted current (which is always)
        }
      });
    },
    modifySpec: function(name = null, height = null, width = null) 
    {
      var ma = document.getElementById("fd-messages");
      ma.innerHTML = "";

      if (name) 
      { 
        uiSpecification.currentObject.name = name; 
      }

      if (height) 
      {
        uiSpecification.currentObject.dimension.height = height;
      }

      if (width) 
      { 
        uiSpecification.currentObject.dimension.width = width;
      }

      $.ajax
      (
        {
          url: apiURL + endpointUISpecification + uiSpecification.currentID,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(uiSpecification.currentObject),
          type: "POST"
        }
      ).done
      (
        function(response) 
        {
          let response_obj = eval(response);
          if (response_obj.ok) 
          {
            formDesigner.uiSpecHandler.newBuild();
            let selector = { value: uiSpecification.currentID };
            formDesigner.uiSpecHandler.setCurrent(selector); // Reset current spec in case user deleted current
            formDesigner.uiSpecHandler.dashboard.infoDisplay(); // Rebuild infoDisplay to reflect changes
            formDesigner.canvasHandler.setDimensions();

            
            ma.innerHTML = "save completed SUCCESSFULLY @ " + new Date().toISOString();

          }
        }
      )
      .fail
      (
        function (xhr, status, error) 
        {
          
          var ma = document.getElementById("fd-messages");
          ma.innerHTML = "save ERROR " + status + " @ " + new Date().toISOString() + "\n" + error;
        }
      );
    },
    getSpec: function(currentID) {
      $.get(apiURL + endpointUISpecification + currentID)
        .done(function(data, status) {
          uiSpecification.currentObject = data;
          uiSpecification.localRevision[0] = JSON.parse(JSON.stringify(uiSpecification.currentObject));;
          fdObject = uiSpecification.currentObject.form_design;

          // Map fdObject to Spec
          formDesigner.fdObjectHandler.mapToSpec();

          // Hide delete / modify controls for null or default UI
          if(uiSpecification.currentObject._id === null || uiSpecification.currentObject._id === 'default_ui_specification') {
            $("#ui-spec-delete-modify-container").hide();
          } else {
            $("#ui-spec-delete-modify-container").show();
          }

          // Show form list and canvas heads up display
          $("#fd-canvas-heads-up-display-wrapper, #form-list-container").show();

          // Hide select spec alert and show select formtype alert
          $("#alert-select-spec").hide();
          $("#alert-select-formtype").show();

          // Update modal for printing specs
          let modalSpecObject = JSON.stringify(uiSpecification.currentObject, undefined, 4);
          $("#fd-modal-specs-printed").html(modalSpecObject);

          // Update uiSpecDashboard
          formDesigner.uiSpecHandler.dashboard.infoDisplay();

          // Update canvas wrapper dimensions
          formDesigner.canvasHandler.setDimensions();

          // Rebuild canvas from active form if applicable
          if(metaData.activeForm !== '') {
            formDesigner.canvasHandler.formFields.display(metaData.activeForm);
          }
          
        });
    },
    displayOptions: function (uiSpecification) {
      let tpl = `<option value="">Select a specification</option>`;
      $.each(uiSpecification.list, function(index, value) {
        tpl += fdTemplates.uiSpecification.options(value);
      });
      $('#ui-spec-selector').html(tpl);
    },
    dashboard: {
      infoDisplay: function() {
        let tpl = fdTemplates.uiSpecification.dashboard.info();
        $("#ui-spec-display-container").html(tpl);
      },
    },
    setCurrent: function(selector) {
      if(selector === undefined || selector.value === '') {
        // Sometimes a user may delete the current spec, so we should set to default when this happens
        formDesigner.uiSpecHandler.getSpec("default_ui_specification");
      } else {
        uiSpecification.currentID = selector.value;
        formDesigner.uiSpecHandler.getSpec(selector.value);
      }
    }
  },
  canvasHandler: {
    displayFormList: function (forms) {
      let tpl = '';
      $.each(forms, function(index, value) {
        tpl += fdTemplates.formListItem(value);
      });
      $('#form-list-container').html(tpl);
    },
    setDimensions() {

      $(".form-designer-wrapper").css("width", uiSpecification.currentObject.dimension.width + "px");

    },
    formFields: {
      widestInFormGroup: function() {
        let w;
        $(".form-group-wrapper").each(function(index, value) {
          w = Math.max.apply(null, $(value).find('label, input, select').map(function () {
            return $(this).outerWidth(true);
          }).get());
          $(value).css('width',w+'px');
        });        
      },
      setFormGroupPosition: function(targetID) {
        let fgp = {
          top: Math.min.apply(null, [$(`label[for= '${targetID}']`).offset().top, $(`#${targetID}`).offset().top]),
          left: Math.min.apply(null, [$(`label[for= '${targetID}']`).offset().left, $(`#${targetID}`).offset().left])
        };
        return fgp;
        
      },
      wrapLabelControl: function(stacked = true) {
        // Set dom back to static with undo snapshot
        formDesigner.fdObjectHandler.snapShot(true);

        let elems = document.getElementsByClassName("fd-path-object");
        $(".form-group-wrapper").contents().unwrap();
        $.each(elems, function(index, value) {
          if (value.tagName === 'LABEL') {
            targetID = $(value)[0].htmlFor;
            let fgp = formDesigner.canvasHandler.formFields.setFormGroupPosition(targetID);
            $(`label[for= '${targetID}'], #${targetID}`).removeAttr('style');
            $(`label[for= '${targetID}'], #${targetID}`).wrapAll(`<div class="form-group form-group-wrapper" />`);
          }
        });
        if (stacked) { formDesigner.canvasHandler.formFields.widestInFormGroup(); }
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
        $(".form-group-wrapper").contents().unwrap();

      },
      display: function (formName) {
        let fields = formDesigner.dataHandler.getFormFields(formName);
        let tpl = [];
        console.log(fields);
        $.each
        (
          fields,
          function(index, value) 
          {
            switch(value.type.toLowerCase())
            {
              case 'group':
              case 'grid':
                tpl.push(fdTemplates.formFields.controls.group(formName, value));
                break;

              case 'hidden':
                // do nothing
                return;
                break;
              // tpl += `<div class="form-group form-group-wrapper form-field-item resize-drag drag-drop yes-drop item">`;
              case 'label':
                  tpl.push(fdTemplates.formFields.prompt(formName, value));
                break;
              case 'list':
                  tpl.push(fdTemplates.formFields.prompt(formName, value));
                  tpl.push(fdTemplates.formFields.controls.list(formName, value));
                  break;
              case 'textarea': 
                tpl.push(fdTemplates.formFields.prompt(formName, value));
                tpl.push(fdTemplates.formFields.controls.textarea(formName, value));
                break;
              case 'button':
                tpl.push(fdTemplates.formFields.prompt(formName, value));
                tpl.push(fdTemplates.formFields.controls.button(formName, value));
                break;
              case 'chart':
                tpl.push(fdTemplates.formFields.controls.chart(formName, value));
                break;
              case 'date':
                    tpl.push(fdTemplates.formFields.prompt(formName, value));
                    tpl.push(fdTemplates.formFields.controls.date(formName, value));                
                    break;
              case 'string':
              default:
                  tpl.push(fdTemplates.formFields.prompt(formName, value));
                  tpl.push(fdTemplates.formFields.controls.string(formName, value));
                break;
            
            }
          }
        );
        $('#fd-canvas').html(tpl.join(""));

        // Must initialize Drag Select functionality for fields after they have been loaded to the DOM
        fdDragSelect = new DragSelect({
          selectables: document.querySelectorAll(".resize-drag"),
          area: document.getElementById("fd-canvas-wrapper")
        });

        // On display we should pass true as 2nd paramater for snapshot so that we can read what is already saved.
        formDesigner.fdObjectHandler.snapShot(false, true);

        // Initialize FD Object for form
        formDesigner.fdObjectHandler.mapToSpec();

        // Mark active form
        metaData.activeForm = formName;

        // Set form-list button active states
        $('.form-list-item').removeClass('active');
        $(`#${formName}`).addClass('active')
      },
    },
    wysiwyg: {
      checkHierarchy: function() {

      },
      wrap: function() {

        $('.ds-selected').each(function(index, obj) {
          $(this).parents().removeClass('ds-selected');
        })

        if (globalDSelected.length > 0) {
          $('#btn-multiDrag').removeClass('multiDrag');
          globalDSelected = [];
          $(".multiDrag").removeClass("multiDrag");
        } else {
          $("#btn-multiDrag").addClass('multiDrag');
          globalDSelected = [...$(".ds-selected")];
          $(".ds-selected").addClass("multiDrag");
        }
      },
      unwrap: function() {
        globalDSelected = [];
        $(".multiDrag").removeClass("multiDrag");
      },
      inline: function() {
        $(".ds-selected").removeAttr("style");
        $(".ds-selected").wrapAll(`<div id='temp-wrap' />`);
        $("#temp-wrap").contents().unwrap();
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      },
      bold: function() {
        let elems = fdDragSelect.getSelection();
        $.each(elems, function (index, value) {
          let fontWeight = $(value).css("font-weight");
          if(fontWeight === 'normal' || fontWeight <= 400) {
            $(value).css('font-weight', 'bold');
          } else {
            $(value).css("font-weight", "");
          }
        });
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      },
      italic: function() {
        let elems = fdDragSelect.getSelection();
        $.each(elems, function (index, value) {
          let fontStyle = $(value).css("font-style");
          if (fontStyle === 'italic') {
            $(value).css('font-style', '');
          } else {
            $(value).css("font-style", "italic");
          }
        });
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      },
      color: function() {
        let color = prompt("Enter your color in hex ex:#f1f233");
        $(".ds-selected").css('color', color);
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      },
      fontSize: function(control) {
        let elems = fdDragSelect.getSelection();
        $.each(elems, function(index, value) {
          let fontSize = parseInt($(value).css('font-size'));
          if(control === 'increase') {
            fontSize = fontSize + 1 + 'px';
          } else {
            fontSize = fontSize - 1 + 'px';
          }
          $(value).css({ 'font-size': fontSize });
        });
        formDesigner.fdObjectHandler.snapShot();
        formDesigner.fdObjectHandler.quickSnap();
      },
      stackLabelControl: function(stacked = true) {
        formDesigner.canvasHandler.formFields.wrapLabelControl(stacked);
      }
    }
  }
}

// Application initializations without user prompting
formDesigner.dataHandler.newBuild();
formDesigner.uiSpecHandler.newBuild();

function execute_command_click()
{
  //
  var message_area = document.getElementById("fd-messages");
  var cmd_text = document.getElementById("custom-fd-commands").value.split(' ');

  var message = "execute command clicked\n\n" + cmd_text;

  
  switch(cmd_text[0].toLowerCase())
  {
      case "ls":
        message += "\n\nlist selection";

        message += list_selection();
        break;
      case "al":
          message += "\n\nalign left selection";

          formDesigner.fdObjectHandler.quickSnap(true);
          message += align_left_selection()

          break;
      case "at":
          message += "\n\nalign top selection";

          formDesigner.fdObjectHandler.quickSnap(true);
          message += align_top_selection()
          break;
      case "aw":
          message += "\n\nalign width selection";

          formDesigner.fdObjectHandler.quickSnap(true);
          message += align_width_selection()
          break;
      case "ah":
          message += "\n\nalign height selection";
          formDesigner.fdObjectHandler.quickSnap(true);
          message += align_height_selection()
          break;
      case "ahs":
          message += "\n\nalign height space of selection";
          formDesigner.fdObjectHandler.quickSnap(true);
          if(cmd_text.length > 1)
          {
            if(cmd_text.length > 2)
            {
              message += align_height_space_of_selection(cmd_text[1], cmd_text[2])
            }
            else
            {
              message += align_height_space_of_selection(cmd_text[1])
            }
          }
          else
          {
            message += align_height_space_of_selection(25);
          }
          
          break;
      case "aws":
          message += "\n\nalign height space of selection";
          formDesigner.fdObjectHandler.quickSnap(true);
          if(cmd_text.length > 1)
          {
            message += align_width_space_of_selection(cmd_text[1])
          }
          else
          {
            message += align_width_space_of_selection(25);
          }
          
          break;

          
  }

  message_area.innerHTML = message;

}

function list_selection()
{

  var result = "";

  var selected_item_list = document.getElementsByClassName("ds-selected");

  result += "\n number of items selected: " + selected_item_list.length;

  for(var i = 0; i < selected_item_list.length; i++)
  {
    var item = selected_item_list[i];

    if(item.localName)
    switch(item.localName.toLowerCase())
    {
      case "label":
      case "input":
        var rect = item.getBoundingClientRect();


        result += "\n\t" + item.localName;

        result += " left: " + item.offsetLeft
        result += " top: " + item.offsetTop
        result += " right: " + item.offsetRight
        result += " bottom: " + item.offsetBottom
        break;
    }
  }


  return result;
}



function align_left_selection()
{

  var result = "";

  var selected_item_list = document.getElementsByClassName("ds-selected");

  result += "\n number of items selected: " + selected_item_list.length;

  if(selected_item_list.length > 0)
  {

    var lowest_left = selected_item_list[0].offsetLeft;

    for(var i = 0; i < selected_item_list.length; i++)
    {
      if(selected_item_list[i].offsetLeft < lowest_left)
      {
        lowest_left = selected_item_list[i].offsetLeft;
      }
    }

    for(var i = 0; i < selected_item_list.length; i++)
    {
      selected_item_list[i].style.left = lowest_left + "px";
    }
  }
  
  return result;
}


function align_top_selection()
{

  var result = "";

  var selected_item_list = document.getElementsByClassName("ds-selected");

  result += "\n number of items selected: " + selected_item_list.length;

  if(selected_item_list.length > 0)
  {

    var lowest_top = selected_item_list[0].offsetTop;

    for(var i = 0; i < selected_item_list.length; i++)
    {
      if(selected_item_list[i].offseTop < lowest_top)
      {
        lowest_top = selected_item_list[i].offseTop;
      }
    }

    for(var i = 0; i < selected_item_list.length; i++)
    {
      selected_item_list[i].style.top = lowest_top + "px";
    }
  }

  return result;
}


function align_width_selection()
{

  var result = "";

  var selected_item_list = document.getElementsByClassName("ds-selected");

  result += "\n number of items selected: " + selected_item_list.length;

  if(selected_item_list.length > 0)
  {

    var lowest_width = selected_item_list[0].offsetWidth;

    for(var i = 0; i < selected_item_list.length; i++)
    {
      if(selected_item_list[i].offseWidth < lowest_width)
      {
        lowest_width = selected_item_list[i].offseWidth;
      }
    }

    for(var i = 0; i < selected_item_list.length; i++)
    {
      selected_item_list[i].style.width = lowest_width + "px";
    }
  }

  return result;
}


function align_height_selection()
{

  var result = "";

  var selected_item_list = document.getElementsByClassName("ds-selected");

  result += "\n number of items selected: " + selected_item_list.length;

  if(selected_item_list.length > 0)
  {

    var lowest_height = selected_item_list[0].offsetHeight;

    for(var i = 0; i < selected_item_list.length; i++)
    {
      if(selected_item_list[i].offseHeight < lowest_height)
      {
        lowest_height = selected_item_list[i].offseHeight;
      }
    }

    for(var i = 0; i < selected_item_list.length; i++)
    {
      selected_item_list[i].style.height = lowest_height + "px";
    }
  }

  return result;
}


function align_height_space_of_selection(p_pixels, p_field_pixels)
{

  var result = "";

  var html_list = document.getElementsByClassName("ds-selected");

  var selected_item_list = [];

  for(var i = 0; i < html_list.length; i++)
  {
    selected_item_list.push(html_list[i]);
  }
  
  

  result += "\n number of items selected: " + selected_item_list.length;

  
  if(selected_item_list.length > 1)
  {
    selected_item_list.sort(align_top_compare);

    for(var i = 1; i < selected_item_list.length; i++)
    {
      var previous_item = selected_item_list[i - 1];
      if
      (
        previous_item.localName && 
        previous_item.localName == "label" && 
        p_field_pixels

      )
      {
        selected_item_list[i].style.top = (previous_item.offsetTop + previous_item.offsetHeight + new Number(p_field_pixels))  + "px";
      }
      else
      {
        selected_item_list[i].style.top = (previous_item.offsetTop + previous_item.offsetHeight + new Number(p_pixels))  + "px";
      }
      
    }
  }

  return result;
}


function align_width_space_of_selection(p_pixels)
{

  var result = "";

  var html_list = document.getElementsByClassName("ds-selected");

  var selected_item_list = [];

  for(var i = 0; i < html_list.length; i++)
  {
    selected_item_list.push(html_list[i]);
  }
  
  

  result += "\n number of items selected: " + selected_item_list.length;

  
  if(selected_item_list.length > 1)
  {
    selected_item_list.sort(align_left_compare);

    for(var i = 1; i < selected_item_list.length; i++)
    {
      var previous_item = selected_item_list[i - 1];

      selected_item_list[i].style.left = (previous_item.offsetLeft + previous_item.offsetWidth + new Number(p_pixels))  + "px";
    }
  }

  return result;
}

function align_left_compare(a, b)
{
  if (a.offsetLeft > b.offsetLeft) return 1;
  if (b.offsetLeft > a.offsetLeft) return -1;

  return 0;
}

function align_top_compare(a, b)
{
  if (a.offsetTop > b.offsetTop) return 1;
  if (b.offsetTop > a.offsetTop) return -1;

  return 0;
}