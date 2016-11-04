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
        if(
            (parseInt(p_ui.url_state.path_array[0]) >= 0) || 
            window.location.href.indexOf('preview.html') > 0
            )
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
        result.push('<ul class="nav">');

        result.push('<li><a href="#/summary">Summary</a></li>');

        for(var i = 0; i < p_metadata.children.length; i++)
        {
          var child = p_metadata.children[i];
          Array.prototype.push.apply(result,navigation_render(child, p_level + 1, p_ui));
        }


        if(parseInt(p_ui.url_state.path_array[0]) >= 0)
        {
          result.push('<li><input type="button" onclick="show_print_version()" value="print version"></li>');
          result.push('<li><input type="button" onclick="show_print_version()" value="print core summary"></li>');
        }
        result.push('<li><input type="button" onclick="show_data_dictionary()" value="show data dictionary"></li>');
        result.push('</ul>');
        break;
      default:
        break;

   }


   //Array.prototype.push.apply(result,b)
   //result.push("<div><fieldset><legend>navigation:</legend><div>root<ul><li>item1<li><li>item2</li></ul> - :: - hello this is a test</fieldset></div>");
   return result;
}
