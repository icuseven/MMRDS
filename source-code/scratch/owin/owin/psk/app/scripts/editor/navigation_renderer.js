function navigation_render(p_metadata, p_level)
{
   var result = [];

   if(p_level > 3) return result;

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
           Array.prototype.push.apply(result,navigation_render(child, p_level + 1));
           result.push('</li>');
        }
       }
       result.push('</ul>');
       result.push('</div></li>');
       break;
     case 'form':
        result.push('<div style="float:left;border:1px;margin:5px;padding:10px;border-style: solid;">');
        result.push('<a href="#/');
        result.push(p_metadata.url_route);
        result.push('">');
        result.push(p_metadata.prompt);
        result.push('</a><ul>');
        for(var i = 0; i < p_metadata.children.length; i++)
        {
          var child = p_metadata.children[i];
          if(child.type == "group")
          {
            Array.prototype.push.apply(result,navigation_render(child, p_level + 1));
          }
        }
        result.push('</ul>');
        result.push('</div>');
        break;
     case 'app':
        result.push('<div><fieldset><legend>navigation:</legend>');
        for(var i = 0; i < p_metadata.children.length; i++)
        {
          var child = p_metadata.children[i];
          Array.prototype.push.apply(result,navigation_render(child, p_level + 1));
        }
        result.push('</fieldset></div>');
        break;
      default:
        break;

   }


   //Array.prototype.push.apply(result,b)
   //result.push("<div><fieldset><legend>navigation:</legend><div>root<ul><li>item1<li><li>item2</li></ul> - :: - hello this is a test</fieldset></div>");
   return result;
}
