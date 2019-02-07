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
};
let fdObject = {};

// Declare Drag Select object (assign after elements are in DOM)
let fdDragSelect;

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
    snapShot: function(undo = false) {
      if(undo) { $('.fd-path-object').removeAttr('style'); return true }
      let elems = document.getElementsByClassName("fd-path-object");
      let newElems = [];
      let target;
      let parent;
      let promptVcontrol;
      let path;

      // Loop through all elements of current form and prep
      $.each(elems, function(index, value) {
        parent = $(value).parent();
        parentID = parent[0].id;
        if (value.tagName === 'LABEL') {
          targetID = $(value)[0].htmlFor;
          target = `label[for='${targetID}']`;
          promptVcontrol = 'prompt';
          path = targetID.replace(/--/g, '/');
        } else {
          target = `#${value.id}`;
          promptVcontrol = 'control';
          path = value.id.replace(/--/g, '/');
        }

        let elemPos = $(target).position();
        let elemHeight = $(target).outerHeight();
        let elemWidth = $(target).outerWidth();
        let cssSytle = {
            position: 'absolute',
            top: elemPos.top,
            left: elemPos.left,
            height: elemHeight,
            width: elemWidth,
        };
        

        // Add current element/path to fdObject
        formDesigner.fdObjectHandler.addPath(path, cssSytle, promptVcontrol);

        // Add current element/path to array for later inline style setting
        newElems.push({target: target, style: cssSytle, promptVcontrol: promptVcontrol, path: path});
      });

      // Set element positions via inline style
      $.each(newElems, function (index, value) {
        $(value.target).css(JSON.parse(uiSpecification.currentObject.form_design[value.path][value.promptVcontrol].style));
        $(value.target).css('transform','');
        $(value.target).removeAttr('data-x data-y');
      });

      // Update specification info (includes writing to modal).
      formDesigner.fdObjectHandler.mapToSpec();     
    },
    quickSnap: function(elem) {
      console.log('quick snap', $(elem)[0].tagName);
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
      if(data !== null) {
        uiSpecification.currentObject.form_design = data.form_design;
      } else {
        uiSpecification.currentObject.form_design = fdObject;
      }
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
      $.ajax({
        url: apiURL + endpointUISpecification,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(newSpec),
        type: "POST"
      }).done(function(response) {
        let response_obj = eval(response);
        if (response_obj.ok) {
          formDesigner.uiSpecHandler.newBuild();
        }
      });
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
    modifySpec: function(name = null, height = null, width = null) {
      if (name) { uiSpecification.currentObject.name = name; }
      if (height) { uiSpecification.currentObject.dimension.height = height; }
      if (width) { uiSpecification.currentObject.dimension.width = width; }
      formDesigner.fdObjectHandler.snapShot();
      $.ajax({
        url: apiURL + endpointUISpecification + uiSpecification.currentID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(uiSpecification.currentObject),
        type: "POST"
      }).done(function(response) {
        let response_obj = eval(response);
        console.log(response_obj);
        if (response_obj.ok) {
          formDesigner.uiSpecHandler.newBuild();
          let selector = { value: uiSpecification.currentID };
          formDesigner.uiSpecHandler.setCurrent(selector); // Reset current spec in case user deleted current
          formDesigner.uiSpecHandler.dashboard.infoDisplay(); // Rebuild infoDisplay to reflect changes
          formDesigner.canvasHandler.setDimensions();
        }
      });
    },
    getSpec: function(currentID) {
      $.get(apiURL + endpointUISpecification + currentID)
        .done(function(data, status) {
          uiSpecification.currentObject = data;

          // Map fdObject to Spec
          formDesigner.fdObjectHandler.mapToSpec(data);

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
      let nw = uiSpecification.currentObject.dimension.width * 96;
      if(nw >= 816) {
        $(".form-designer-wrapper").css("width", '100%');
      } else {
        $(".form-designer-wrapper").css("width", nw + "px");
      }
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
        $(".form-group-wrapper").contents().unwrap();

      },
      display: function (formName) {
        let fields = formDesigner.dataHandler.getFormFields(formName);
        let tpl = '';
        $.each(fields, function(index, value) {
          if(value.type === 'group' || value.type === 'grid') {
            tpl += fdTemplates.formFields.controls.group(formName, value);
          } else {
            // tpl += `<div class="form-group form-group-wrapper form-field-item resize-drag drag-drop yes-drop item">`;
            tpl += fdTemplates.formFields.prompt(formName, value);
            if(value.type === 'list') {
              tpl += fdTemplates.formFields.controls.list(formName, value);
            } else if (value.type === 'textarea') {
              tpl += fdTemplates.formFields.controls.textarea(formName, value);
            } else {
              tpl += fdTemplates.formFields.controls.string(formName, value);
            }
            // tpl += `</div>`;
          }
        });
        $('#fd-canvas').html(tpl);

        // Must initialize Drag Select functionality for fields after they have been loaded to the DOM
        fdDragSelect = new DragSelect({
          selectables: document.querySelectorAll(".resize-drag"),
          area: document.getElementById("fd-canvas-wrapper")
        });

        formDesigner.fdObjectHandler.snapShot();

        // Initialize FD Object for form
        formDesigner.fdObjectHandler.mapToSpec();

        // Mark active form
        metaData.activeForm = formName;
      },
    },
    wysiwyg: {
      wrap: function() {
        $('.ds-selected').removeAttr('style');
        $(".ds-selected").wrapAll(`<fieldset id='temp-wrap' class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" />`);
        $('#temp-wrap').append(`<legend style="width:auto; padding: 8px">Temporary Wrapper</legend>`);
      },
      unwrap: function() {
        formDesigner.fdObjectHandler.snapShot();
        $('#temp-wrap > legend').remove();
        $("#temp-wrap").contents().unwrap();
        formDesigner.fdObjectHandler.snapShot();
      },
      inline: function() {
        $(".ds-selected").removeAttr("style");
        $(".ds-selected").wrapAll(`<div id='temp-wrap' />`);
        $("#temp-wrap").contents().unwrap();
        formDesigner.fdObjectHandler.snapShot();
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
        })
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
        })
      },
      color: function() {
        let color = prompt("Enter your color in hex ex:#f1f233");
        $(".ds-selected").css('color', color);
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
        })
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

