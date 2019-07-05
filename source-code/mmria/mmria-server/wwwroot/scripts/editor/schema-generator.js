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

function generate_schema(p_metadata, p_schema, p_version)
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
                    
                    object = p_schema[child.name.toLowerCase()] =  {
                        "type": "object",
                        "properties": {}
                    };
                    
                    generate_schema(child, object.properties);
                    
                    break;
                case "grid":
                        object = p_schema[child.name.toLowerCase()] =  {
                        "type": "array",
                        "properties": {}
                        };
                    
                    generate_schema(child, object.properties);

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
