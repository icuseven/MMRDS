function get_initial_schema()
{
    return {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "mmria_case",
    "type": "object",
    "description": "Here is a case for your ...!",
    "properties": {},
    "definitions": {},
    "required": ["_id", "version"]
  };
}

function generate_schema(p_metadata, p_schema, p_version, p_path)
{
    switch(p_metadata.type.toLowerCase())
    {
        case "app":
            p_schema._id = {
                    "type": "string"
            };

            p_schema.version = {
                    "type": "string",
                    "enum": [ p_version ],
                    "default" : p_version
            };

        break;
        case "number":
                p_schema[p_metadata.name.toLowerCase()] = { "type" : "number"}
                break;                    
        case "string":
            p_schema[p_metadata.name.toLowerCase()] = { "type" : "string"}
            break;
        case "date":
            p_schema[p_metadata.name.toLowerCase()] = { "type" : "string", "format": "date-time" }
            break;
        case "list":
            object = p_schema[p_metadata.name.toLowerCase()] = { "type": "string", "x-enumNames": [] }
            for(var j in p_metadata.values)
            {
                object["x-enumNames"].push(p_metadata.values[j].value);
            }
        break;
    }

    if(p_metadata.children)
    {
        for(var i = 0; i < p_metadata.children.length; i++)
        {
            let object = null;

            var child = p_metadata.children[i];
            switch(child.type.toLowerCase())
            {
                case "group":
                
                case "form":
                    
                    /*
                    if(p_node.type.ToLower() == "form" && p_node.cardinality == "*")
                    {
                        property = new NJsonSchema.JsonSchemaProperty(){ Type = NJsonSchema.JsonObjectType.Object};
                        foreach(var child in p_node.children)
                        {
                                await GetSchema(p_lookup, property, child);
                        }
                        p_lookup.Add(p_node.name + "_type", property);
                        property_list = new NJsonSchema.JsonSchemaProperty(){ Type = NJsonSchema.JsonObjectType.Array, Item = p_lookup[p_node.name + "_type"] };
                        //property_list.Properties..Items.Allof(property);
                        p_parent.Properties.Add(p_node.name + "_form", property_list);
                    }
                    else
                    {*/

                        object = p_schema[child.name.toLowerCase()] =  {
                            "type": "object",
                            "properties": {}
                        };
                        
                        generate_schema(child, object.properties, "", "/" + child.name.toLowerCase());
                    //}
                    break;
                case "grid":
                    var grid_type_name = child.name.toLowerCase() + "_row";
                    object = p_schema[child.name.toLowerCase()] =  get_grid(child,  "/" + child.name.toLowerCase());
                    
                    //generate_schema(child, object.properties);

                    break;
                case "number":
                    p_schema[child.name.toLowerCase()] = { "type" : "number"}
                    break;                    
                case "string":
                    p_schema[child.name.toLowerCase()] = { "type" : "string"}
                    break;
                case "date":
                    p_schema[child.name.toLowerCase()] = { "type" : "string", "format": "date-time" }
                    break;
                case "list":
                    object = p_schema[child.name.toLowerCase()] = { "type": "string", "x-enumNames": [] }
                    for(var j in child.values)
                    {
                        object["x-enumNames"].push(child.values[j].value);
                    }
                break;
            }
        }
    }
}

function set_lookUp(p_parent, p_node)
{
//https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Schema_JsonSchema.htm

    /*
    var schema = new NJsonSchema.JsonSchema();
    
    schema.Type =  NJsonSchema.JsonObjectType.Object;
    schema.Title = "mmria_case";
    schema.Description = "Here is a case for your ...!";
    
    schema.SchemaVersion = "http://json-schema.org/draft-06/schema#";
    */			


    var property = null;
    //schema.Properties.Add("name", new NJsonSchema.JsonSchemaProperty(){ Type = NJsonSchema.JsonObjectType.String});
    //schema.Properties.Add("prompt", new NJsonSchema.JsonSchemaProperty(){ Type = NJsonSchema.JsonObjectType.String});

    try
    {
        switch(p_node.type.toLowerCase())
        {						
            case "list":
                if(p_node.is_multiselect && p_node.is_multiselect == true)
                {

                    property = p_parent[p_node.name.toLowerCase()] = { "type": "array", "x-enumNames": [] }
                    for(var j in p_node.values)
                    {
                        property["x-enumNames"].push(p_node.values[j].value);
                    }
                }
                else
                {

                    property = p_parent[p_node.name.toLowerCase()] = { "type": "string", "x-enumNames": [] }
                    for(var j in p_node.values)
                    {
                        property["x-enumNames"].push(p_node.values[j].value);
                    }
                }
                break;
        }
    }
    catch(ex)
    {
        console.log("GetSchemaGetSchema(p_parent, p_node) Exception: {ex}");
    }
    //return p_parent;
}


function get_grid(p_metadata,p_path)
{
    var definitions_node = {};


    for(var child_index in p_metadata.children)
    {
        var child = p_metadata.children[child_index];
        generate_schema(child, definitions_node, "",  "/" + p_metadata);
    }

    var result = {
        "$schema": "http://json-schema.org/draft-06/schema#",
      
        "definitions": definitions_node,
        "type": "object",
        "title": p_metadata.prompt,
        "properties": {}
    };


    if(p_metadata.description && p_metadata.description.length > 0)
    {
        result.description = p_metadata.description;
    }

    result.properties[p_metadata.name.toLowerCase()] = { 
        "type": "array",
        "items": {
            "allOf": [
              {
                "$ref": "#/" + p_metadata.name.toLowerCase() + "/definitions/" + p_metadata.name.toLowerCase() 
              }
            ]
        }
    };

    return result;
}