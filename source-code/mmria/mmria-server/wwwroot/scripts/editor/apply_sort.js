
function g_apply_sort(p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{

    function compareStringAsc(a, b) 
    {
        return a.compareTo(b);
    }

    function compareStringDesc(a, b) 
    {
        return a.compareTo(b) * -1;
    }

    function compareNumbersAsc(a, b) 
    {
        return a - b;
    }

    function compareNumbersDesc(a, b) 
    {
        return (a - b) *-1;
    }

    switch(p_metadata.type.toLowerCase())
	{
		case 'grid':

            if
            (
                p_metadata.sort_order != null &&
                p_metadata.sort_order.length !=0
            )
            {
                let metadata_path_list = [];
                let metadata_node_list = [];
                let sort_direction_list = [];
                let sort_item_list = p_metadata.sort_order.split(",");
                for(let i = 0; i < sort_item_list.length; i++)
                {
                    let item_array = sort_item_list[i].split(' ');
                    metadata_path_list.push(`${p_dictionary_path}/${item_array[0].trim()}`);
                    let node = g_find_metadata_node_by_path(p_metadata, p_dictionary_path, metadata_path_list[i]);
                    metadata_node_list.push(node);
                    if(item_array.length > 1)
                    {
                        let sort = item_array[1].toLowerCase().trim();
                        switch(sort)
                        {
                            case "display":
                            case "asc":
                            case "desc":
                                sort_direction_list.push(sort);
                                break;
                            default:
                                sort_direction_list.push("asc");
                                break;
                        }
                        
                    }
                    else
                    {
                        sort_direction_list.push("asc");
                    }
                }
                console.log("here");
            }

			for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];
                if (p_data[child.name] != null) 
                {
                    g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                }
            }
			break;

		case 'group':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];
                if (p_data[child.name] != null) 
                {
                    g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                }
            }
			break;

		case 'form':
            if (p_metadata.cardinality == "+" || p_metadata.cardinality == "*") 
            {
                for (let i = 0; i < p_data.length; i++) 
                {
                    let item = p_data[i];

                    for (let i = 0; i < p_metadata.children.length; i++) 
                    {
                        let child = p_metadata.children[i];
                        if (p_data[child.name] != null) 
                        {
                            g_apply_sort(child, item[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                        }
                    }
                }
            }
            else
            {
                for (let i = 0; i < p_metadata.children.length; i++) 
                {
                    let child = p_metadata.children[i];
                    if (p_data[child.name] != null) 
                    {
                        g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                    }
                }
            }
			break;

		case 'app':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];

                if (child.type.toLowerCase() == 'form') 
                {
                    if (p_data[child.name] != null) 
                    {
                        g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                    }
                }
            }
			break;

		case 'label':
		case 'button':
		case 'string':
		case 'address':
		case 'textarea':
		case 'number':
		case 'boolean':
		case 'list':
		case 'date':
		case 'datetime':
		case 'time':
		case 'chart':
		case 'hidden':
		case 'jurisdiction':
            break;

		default:
			console.log("page_render not processed", p_metadata);
			break;
	}

}


function g_find_metadata_node_by_path(p_metadata, p_dictionary_path, p_find_path)
{
    let result = null;

    switch(p_metadata.type.toLowerCase())
	{
		case 'grid':
			for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];

                result = g_find_metadata_node_by_path(child, p_dictionary_path + "/" + child.name, p_find_path);
                
                if(result != null) break;
            }
			break;

		case 'group':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];
                if (p_data[child.name] != null) 
                {
                    result = g_find_metadata_node_by_path(child, p_dictionary_path + "/" + child.name, p_find_path);
                }
                if(result != null) break;
            }
			break;

		case 'form':

            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];
                if (p_data[child.name] != null) 
                {
                    result = g_find_metadata_node_by_path(child, p_dictionary_path + "/" + child.name, p_find_path);
                }
                if(result != null) break;
            }
            
			break;

		case 'app':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];

                if (child.type.toLowerCase() == 'form') 
                {
                    if (p_data[child.name] != null) 
                    {
                        result = g_find_metadata_node_by_path(child, p_dictionary_path + "/" + child.name, p_find_path);
                    }
                    if(result != null) break;
                }
            }
			break;

		case 'label':
		case 'button':
		case 'string':
		case 'address':
		case 'textarea':
		case 'number':
		case 'boolean':
		case 'list':
		case 'date':
		case 'datetime':
		case 'time':
		case 'chart':
		case 'hidden':
		case 'jurisdiction':
            if(p_dictionary_path == p_find_path)
            {
                result = p_metadata;
            }
            break;

		default:
			console.log("page_render not processed", p_metadata);
			break;
    }
    
    return result;

}

