function create_default_object(p_metadata, p_parent)
{

  switch(p_metadata.type.toLowerCase())
  {
    case 'grid':
      p_parent[p_metadata.name] = [];
      var sample_grid_item = {};
      for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        create_default_object(child, sample_grid_item);
      }
      p_parent[p_metadata.name].push(sample_grid_item);

      break;
    case 'form':
      if
      (
        p_metadata.cardinality && 
        (
          p_metadata.cardinality == "+" ||
          p_metadata.cardinality == "*"
        )
      )
      {
        p_parent[p_metadata.name] = [];
      }
      else
      {
        p_parent[p_metadata.name] = {};
      }
      
      for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        create_default_object(child, p_parent[p_metadata.name]);
      }
      break;

    case 'group':
    case 'form':
      p_parent[p_metadata.name] = {};
      for(var i = 0; i < p_metadata.children.length; i++)
      {
        var child = p_metadata.children[i];
        create_default_object(child, p_parent[p_metadata.name]);
      }
      break;
    case 'app':
        p_parent["_id"] = new Date().toISOString();
       for(var i = 0; i < p_metadata.children.length; i++)
       {
         var child = p_metadata.children[i];
         create_default_object(child, p_parent);
       }
       break;
    case 'string':
    case 'textarea':
    case 'address':
          if(p_metadata.default_value && p_metadata.default_value != "")
          {
            p_parent[p_metadata.name] = new String(p_metadata.default_value);
          }
          else if(p_metadata.pre_fill && p_metadata.pre_fill != "")
          {
            p_parent[p_metadata.name] = new String(p_metadata.pre_fill);
          }
          else
          {
            p_parent[p_metadata.name] = new String();
          }
           break;
     case 'number':
            if(p_metadata.default_value && p_metadata.default_value != "")
            {
              p_parent[p_metadata.name] = new Number(p_metadata.default_value);
            }
            else
            {
              p_parent[p_metadata.name] = new Number();
            }
           break;
     case 'boolean':
            if(p_metadata.default_value && p_metadata.default_value != "")
            {
              p_parent[p_metadata.name] = new Boolean(p_metadata.default_value);
            }
            else
            {
              p_parent[p_metadata.name] = new Boolean();
            }
            break;
    case 'list':
    case 'yes_no':
        if(p_metadata['is_multiselect'] && p_metadata.is_multiselect == true)
        {
          p_parent[p_metadata.name] = [];
        }
        else
        {
          p_parent[p_metadata.name] = "";
        }
            
        break;
     case 'date':
     case 'datetime':
            if(p_metadata.default_value && p_metadata.default_value != "")
            {
              p_parent[p_metadata.name] = new Date(p_metadata.default_value);
            }
            else
            {
              p_parent[p_metadata.name] = new Date();
            }
            break;
    case 'time':
           p_parent[p_metadata.name] = new Date("2016-01-01T00:00:00.000Z");
           break;
    case 'label':
    case 'button':
          break;
     default:
          console.log("create_default_object not processed", p_metadata);
       break;
  }



  return p_parent;
}
