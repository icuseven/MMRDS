function create_default_object(p_metadata, p_parent)
{

  switch(p_metadata.type.toLowerCase())
  {
    case 'group':
    case 'form':
    case 'address':
    case 'grid':
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
          p_parent[p_metadata.name] = new String();
           break;
     case 'number':
            p_parent[p_metadata.name] = new Number();
           break;
     case 'boolean':
            p_parent[p_metadata.name] = new Boolean();
            break;
    case 'list':
    case 'yes_no':
           p_parent[p_metadata.name] = "";
           break;
     case 'date':
            p_parent[p_metadata.name] = new Date();
            break;
    case 'time':
           p_parent[p_metadata.name] = "";
           break;
     default:
          console.log("create_default_object not processed", p_metadata);
       break;
  }



  return p_parent;
}
