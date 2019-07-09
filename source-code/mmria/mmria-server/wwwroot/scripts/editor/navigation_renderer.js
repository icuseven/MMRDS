function navigation_render(p_metadata, p_level, p_ui)
{
   var result = [];
   if(p_level > 1) return result;

   switch(p_metadata.type.toLowerCase())
   {
     case 'group':
       result.push('<li><div>');
       result.push('<a href="#/');
       result.push(p_metadata.name);
       result.push('">');
       result.push(p_metadata.prompt);
       result.push('</a><ul>');
       for(var i = 0; i < p_metadata.children.length; i++)
       {
         var child = p_metadata.children[i];
         if(child.type == "group")
         {
           result.push('<li>');
           Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));
           result.push('</li>');
        }
       }
       result.push('</ul>');
       result.push('</div></li>');
       break;

     case 'form':
        if(parseInt(p_ui.url_state.path_array[0]) >= 0) 
        {
          result.push('<li>');
          result.push('<a href="#/');
          if(parseInt(p_ui.url_state.path_array[0]) >= 0)
          {
            result.push(p_ui.url_state.path_array[0]);
          }
          else
          {
            result.push(p_ui.data_list[p_ui.selected_record_index]._id);
          }
          result.push("/");
          result.push(p_metadata.name);
          result.push('">');
          result.push(p_metadata.prompt);
          result.push('</a><ul>');
          for(var i = 0; i < p_metadata.children.length; i++)
          {
            var child = p_metadata.children[i];
            if(child.type == "group")
            {
              Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));
            }
          }
          result.push('</ul></li>');
        }
        break;

     case 'app':
        // result.push('<ul class="nav navbar-nav">'); // TFLee: Remove, creating ul statically and used as js hook
        // result.push('<li><a href="/Home">Home</a></li>'); // TFLee: Removed, want Home to be static as well
        result.push('<li class="list-group-item"><a href="#/summary">Summary</a></li>');

        // // New, like the demo, add search functionality
        // // TODO: Get with James to tie in this functionality
        // result.push('<li class="list-group-item">');
        //   result.push('<div class="form-group fake-list-group-anchor">');
        //     result.push('<label for="search_case_fields">Search for field(s)</label>');
        //     result.push('<div class="form-control-wrap">');
        //       result.push('<input id="search_case_fields" class="form-control" type="text" />');
        //       result.push('<span class="fancy-form-icon 24 fill-p cdc-icon-search-solid" aria-hidden="true"></span>');
        //     result.push('</div>');
        //   result.push('</div>');
        // result.push('</li>');

        // // New, like the demo, add case selection functionality
        // result.push('<li class="list-group-item">');
        //   result.push('<div class="form-group fake-list-group-anchor">');
        //     result.push('<label for="select_case">Select a case</label>');
        //     result.push('<div class="form-control-wrap">');
        //       result.push('<select id="select_case" class="form-control">');
        //         result.push('<option value="">Home Record</option>');
        //       result.push('</select>');
        //     result.push('</div>');
        //   result.push('</div>');
        // result.push('</li>');
            
        if(parseInt(p_ui.url_state.path_array[0]) >= 0)
        {
          // New, like the demo, add search functionality
          // TODO: Get with James to tie in this functionality
          result.push('<li class="list-group-item">');
            result.push('<div class="form-group fake-list-group-anchor">');
              result.push('<label for="search_case_fields">Search for field(s)</label>');
              result.push('<div class="form-control-wrap">');
                if(p_ui.url_state.selected_id == "field_search")
                {
                  result.push('<input id="search_case_fields" class="form-control" type="text" onchange="search_text_change(this);" value="' + p_ui.url_state.path_array[2].replace(/%20/g, " ") + '" />');
                }
                else
                {
                  result.push('<input id="search_case_fields" class="form-control" type="text" onchange="search_text_change(this);"/>');
                }
                


                result.push('<span class="fancy-form-icon 24 fill-p cdc-icon-search-solid" aria-hidden="true"></span>');
              result.push('</div>');
            result.push('</div>');
          result.push('</li>');

          // New, like the demo, add case selection functionality
          result.push('<li class="list-group-item">');
            result.push('<div class="form-group fake-list-group-anchor">');
              result.push('<label for="selected_form">Select case form</label>');
              result.push('<div class="form-control-wrap">');
                result.push('<select id="selected_form" class="form-control" onChange="updateUrlFromSelectValue(event,this.value);">');
                  result.push('<option value=""> </option>');
                  for(var i = 0; i < p_metadata.children.length; i++)
                  {
                    var child = p_metadata.children[i]; // Need to render new sub nav
                    var url = p_ui.url_state.path_array[0] + "/" + child.name;
                    // Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));  // Need to render new sub nav
                    if (child.type === 'form') {

                      if(p_ui.url_state.selected_id.toLowerCase() == child.name.toLowerCase())
                      {
                        result.push('<option value="' + url + '" selected>');
                      }
                      else
                      {
                        result.push('<option value="' + url + '">');
                      }
                      
                        result.push(child.prompt);
                      result.push('</option>');
                      // result.push('<option value="' + child.name);
                      // result.push('" data-url="'+ url +'">');
                      // result.push(child.prompt);
                      // result.push('</option>');
                    }
                  }
                result.push("</ul>");
                result.push('</select>');
              result.push('</div>');
            result.push('</div>');
          result.push('</li>');

          // // forms start
          // result.push('<li class="">');
          // result.push('<a href="#" id="case_form_list">Case Forms<span class="caret"></span></a>');
          //   result.push('<ul class="list-unstyled" aria-labelledby="case_form_list">');
          //     for(var i = 0; i < p_metadata.children.length; i++)
          //     {
          //       var child = p_metadata.children[i]; // Need to render new sub nav
          //       var url = p_ui.url_state.path_array[0] + "/" + child.name;
          //       // Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));  // Need to render new sub nav
          //       if (child.type === 'form') {
          //         result.push('<li>');
          //           result.push('<a href="#/' + url + '">');
          //             result.push(child.prompt);
          //           result.push('</a>');
          //         result.push('</li>');
          //       }
          //     }
          //   result.push("</ul>");
          // result.push('</li>');
          // forms end
          // forms start
          // result.push('<li class="dropdown">');
          // result.push('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="case_form_list">Case Forms<span class="caret"></span></a>');
          //   result.push('<ul class="dropdown-menu" aria-labelledby="case_form_list">');
          //     for(var i = 0; i < p_metadata.children.length; i++)
          //     {
          //       var child = p_metadata.children[i];
          //       Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));
          //     }
          //   result.push("</ul>");
          // result.push('</li>');
          // forms end
        }

        if(parseInt(p_ui.url_state.path_array[0]) >= 0)
        {        
        // // print version start
        result.push('<li class="list-group-item">');
          result.push('<div class="form-group fake-list-group-anchor">');
            result.push('<label for="print_case">Print case form</label>');
            result.push('<div class="form-control-wrap">');
              result.push('<select id="print_case_id" class="form-control" onChange="print_case_onchange()">');
                result.push('<option value="" selected>Select one</option>');  
                result.push('<option value="all">All</option>');  
                for(var i = 0; i < p_metadata.children.length; i++)
                {
                  var child = p_metadata.children[i];
                  if(child.type.toLowerCase() == 'form')
                  {
                    result.push('<option value="' + child.name + '">');
                      result.push(child.prompt)
                    result.push('</option>');
                  }
                }
                // result.push('<option value="' + child.name + '" selected>');
                //   result.push(child.prompt)
                // result.push('</option>');
              result.push('</select>');
            result.push('</div>');
          result.push('</div>');
        result.push('</li>');

        // result.push('<li class="dropdown">');
        //   result.push('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="print_blank">Print Version <span class="caret"></span></a>');
        //   result.push('<ul class="dropdown-menu" role="menu" aria-labelledby="print_blank">');
        //     result.push('<li><a onclick="open_core_summary(\'all\')">Core Elements Only</a></li>');
        //     result.push('<li><a tabindex="-1" onclick="open_print_version(\'all\')">All</a></li>');
        //     for(var i = 0; i < p_metadata.children.length; i++)
        //     {
        //       var child = p_metadata.children[i];
        //       if(child.type.toLowerCase() == 'form')
        //       {
        //         result.push('<li>');
        //           result.push('<a tabindex="-1" onclick="open_print_version(\'');
        //             result.push(child.name)
        //           result.push('\')">');
        //           result.push(child.prompt)
        //           result.push('</a>');
        //         result.push('</li>');
        //       }
        //     }
        //   result.push('</ul>'); 
        // result.push('</li>')
        // print version end
        }

        result.push('<li id="nav_status_area">&nbsp;</li>');
        // result.push('</ul>');
        break;

      default:
        break;
   }

   //Array.prototype.push.apply(result,b)
   //result.push("<div><fieldset><legend>navigation:</legend><div>root<ul><li>item1<li><li>item2</li></ul> - :: - hello this is a test</fieldset></div>");
   return result;
}


function updateUrlFromSelectValue(event, val) 
{
  var currLocation = window.location;
  var options = event.target.options;
  var selected = options.selectedIndex;
  
  currLocation.hash = "/" + val;
}
