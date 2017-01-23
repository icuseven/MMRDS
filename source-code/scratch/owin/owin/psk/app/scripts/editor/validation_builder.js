

var metadata_list = [];
var object_list = [];

var path_to_node_map = [];
var path_to_int_map = [];
var path_to_onblur_map = [];
var path_to_onclick_map = [];
var path_to_onfocus_map = [];
var path_to_onchange_map = [];
var path_to_source_validation = [];
var path_to_derived_validation = [];
var path_to_validation_description = [];
var object_path_to_metadata_path_map = [];

//generate_validation(output_json, g_metadata, metadata_list, "", object_list, "", path_to_node_map, path_to_int_map, path_to_onblur_map, path_to_onclick_map, path_to_onfocus_map, path_to_onchange_map, path_to_source_validation, path_to_derived_validation, path_to_validation_description, object_path_to_metadata_path_map);
var output_json = [] 


output_json.push("var path_to_int_map = [];\n");
output_json.push("var path_to_onblur_map = [];\n");
output_json.push("var path_to_onclick_map = [];\n");
output_json.push("var path_to_onfocus_map = [];\n");
output_json.push("var path_to_onchange_map = [];\n");
output_json.push("var path_to_source_validation = [];\n");
output_json.push("var path_to_derived_validation = [];\n");
output_json.push("var path_to_validation_description = [];\n");


function generate_validation(p_output_json, p_metadata, p_metadata_list, p_path, p_object_list, p_object_path, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_source_validation, p_path_to_derived_validation, p_path_to_validation_description, p_object_path_to_metadata_path_map)
{
    p_path_to_node_map[p_path] = p_metadata;


    p_path_to_int_map[p_path] = p_metadata_list.length;
			p_output_json.push("path_to_int_map['");
			p_output_json.push(get_eval_string(p_path));
			p_output_json.push("']= ");
			p_output_json.push(p_path_to_int_map[p_path]);
			p_output_json.push(";\n");

	p_metadata_list.push(p_path);
	p_object_list.push(p_object_path);

    p_object_path_to_metadata_path_map[p_object_path] = p_path;

    if(p_metadata.onblur && p_metadata.onblur != "")
    {
		var f_name = "x" + p_path_to_int_map[p_path].toString(16) + "_ob";
		p_metadata.onblur.body[0].id.name = f_name;
		var test = get_code(p_metadata.onblur);
		if(test)
		{
        	p_path_to_onblur_map[p_path] = test;
			p_output_json.push(test);
			p_output_json.push("\n");

			p_output_json.push("path_to_onblur_map['");
			p_output_json.push(p_path);
			p_output_json.push("']='");
			p_output_json.push(f_name);
			p_output_json.push("';\n");
		}
    }

    if(p_metadata.onclick && p_metadata.onclick != "")
    {
		p_metadata.onclick.body[0].id.name = "x" + p_path_to_int_map[p_path].toString(16) + "_ocl";
		var test = get_code(p_metadata.onclick);
		if(test)
		{
        	p_path_to_onclick_map[p_path] = test;
			p_output_json.push(test);
			p_output_json.push("\n");
			
			p_output_json.push("path_to_onclick_map['");
			p_output_json.push(p_path);
			p_output_json.push("']='");
			p_output_json.push("x" + p_path_to_int_map[p_path].toString(16) + "_ocl");
			p_output_json.push("';\n");
		}
    }

    if(p_metadata.onfocus && p_metadata.onfocus != "")
    {
		p_metadata.onfocus.body[0].id.name = "x" + p_path_to_int_map[p_path].toString(16) + "_of";
		var test = get_code(p_metadata.onfocus);
		if(test)
		{
        	p_path_to_onfocus_map[p_path] = test;
			p_output_json.push(test);
			p_output_json.push("\n");
			
			p_output_json.push("path_to_onfocus_map['");
			p_output_json.push(p_path);
			p_output_json.push("']='");
			p_output_json.push("x" + p_path_to_int_map[p_path].toString(16) + "_of");
			p_output_json.push("';\n");
		}
    }

    if(p_metadata.onchange && p_metadata.onchange != "")
    {
		p_metadata.onchange.body[0].id.name = "x" + p_path_to_int_map[p_path].toString(16) + "_och";
		var test = get_code(p_metadata.onchange);
		if(test)
		{
        	p_path_to_onchange_map[p_path] = test;
			p_output_json.push(test);
			p_output_json.push("\n");
			
			p_output_json.push("path_to_onchange_map['");
			p_output_json.push(p_path);
			p_output_json.push("']='");
			p_output_json.push("x" + p_path_to_int_map[p_path].toString(16) + "_och");
			p_output_json.push("';\n");
		}
    }
 
    if(p_metadata.validation && p_metadata.validation != "")
    {
			p_metadata.validation.body[0].id.name = "x" + p_path_to_int_map[p_path].toString(16) + "_sv";
			var test = get_code(p_metadata.validation);
			if(test)
			{
				p_path_to_source_validation[p_path] = test;
				p_output_json.push(test);
				p_output_json.push("\n");

				p_output_json.push("path_to_source_validation['");
				p_output_json.push(p_path);
				p_output_json.push("']='");
				p_output_json.push("x" + p_path_to_int_map[p_path].toString(16) + "_sv");
				p_output_json.push("';\n");

				test = create_derived_validator_function(p_path_to_int_map, p_metadata, p_path);
				if(test != "")
				{
					path_to_derived_validation[p_path] = test;
					p_output_json.push(test);
					p_output_json.push("\n");
					
					p_output_json.push("path_to_derived_validation['");
					p_output_json.push(p_path);
					p_output_json.push("']='");
					p_output_json.push("x" + p_path_to_int_map[p_path].toString(16) + "_dv");
					p_output_json.push("';\n");
				}
			}
    }

	if(p_metadata.validation_description && p_metadata.validation_description != '')
	{
			p_path_to_validation_description[p_path] = p_metadata.validation_description;

			p_output_json.push("path_to_validation_description['");
			p_output_json.push(p_path);
			p_output_json.push("']='");
			p_output_json.push(p_metadata.validation_description);
			p_output_json.push("';\n");
	}

	if(p_metadata.children && p_metadata.children.length > 0)
	{		
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];

 			generate_validation(p_output_json, child, p_metadata_list, p_path + "/children/" + i, p_object_list, p_object_path + "/" + child.name, p_path_to_node_map, p_path_to_int_map, p_path_to_onblur_map, p_path_to_onclick_map, p_path_to_onfocus_map, p_path_to_onchange_map, p_path_to_source_validation, p_path_to_derived_validation, p_path_to_validation_description, p_object_path_to_metadata_path_map);
		}
	}

}


function create_derived_validator_function(p_path_to_int_map, p_metadata, p_path)
{

	var result = [];
	result.push("\n function x");
	result.push(p_path_to_int_map[p_path].toString(16));
	result.push("_dv (value)\n{\n ");
	var validation_added = false;
 
	// is required
	// max_value
	// min_value
	// regex_pattern
	// validator
	// is_read_only


	if(p_metadata.is_read_only && p_metadata.is_read_only == true)
	{
			result.push("\nreturn false;\n");
			validation_added = true;
	}

	switch(p_metadata.type.toLowerCase())
	{
		case "number":
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
					result.push("if(value == null || value == '') return false;\n");
					validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value > new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value < new Number(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			break;
		case "date":
		case "datetime":
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
					result.push("if(value == null || value == '') return false;\n");
					validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value > new Date(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value < new Date(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			break;
		case "string":
		default:
			if(p_metadata.is_required && p_metadata.is_required == true)
			{
				result.push("if(value == null || value == '') return false;\n");
				validation_added = true;
			}

			if(p_metadata.max_value && p_metadata.max_value == true)
			{
					result.push("if(value.length > new Number(");
					result.push(p_metadata.max_value);
					result.push(")) return false;\n");
					validation_added = true;
			}
			
			if(p_metadata.min_value && p_metadata.min_value == true)
			{
					result.push("if(value.length < new Number(");
					result.push(p_metadata.min_value);
					result.push(")) return false;\n");
					validation_added = true;
			}			
			break;
	}

	if(p_metadata.regex_pattern && p_metadata.regex_pattern.length > 0)
	{
		try
		{
			var reg_exp = new RegExp(p_metadata.regex_pattern);
		
			result.push("var regexp = /");
			result.push(p_metadata.regex_pattern);
			result.push("/;\nvar matches_array = value.match(regexp);");
			result.push("\nif(matches_array)\n{\t if(matches_array.length < 1) return false;\n\t}\n else return false;\n\n");
			validation_added = true;
		}
		catch(err)
		{

		}
	}


	if
	(
		p_metadata.validation && 
		p_metadata.validation != ""
	)
	{
		try
		{

			result.push("\n return x");
			result.push(p_path_to_int_map[p_path].toString(16));
			result.push("_sv(value);\n");
			validation_added = true;

			//[var].body[0].id.name
			//p_metadata.validataion.body[0].id.name = "x" + p_path_to_int_map[p_path].toString(16) + "_sv";
			/*
			var source_code = escodegen.generate(p_metadata.validation);
			var code_array = [];
			code_array.push("return ");
			code_array.push(source_code);
			code_array.push("(value);\n");
			validation_added = true;
			Array.prototype.push.apply(result,code_array);
			*/
			
			
		}
		catch(err)
		{
			/*
			try
			{
				var code_array = [];
				code_array.push("return ");
				code_array.push(p_metadata.validation);
				code_array.push("(value);\n")
				validation_added = true;
				Array.prototype.push.apply(result,code_array);
			}
			catch(err2)
			{

			}*/
			
		}
		
	}

	result.push("\n}");

	//result.push(" return true;\n})");

	if(validation_added)
	{
		return result.join("");
	}
	else
	{
		return "";
	}

}


function get_code(p_value)
{
	var result = null;

	try
	{
		result = escodegen.generate(p_value);
	}
	catch(e)
	{
		console.log(e);
	}

	return result;
}

//[var].body[0].id.name

var test_exp = {
            "type": "Program",
            "body": [
              {
                "type": "FunctionDeclaration",
                "id": {
                  "type": "Identifier",
                  "name": "f"
                },
                "params": [
                  {
                    "type": "Identifier",
                    "name": "p_control"
                  }
                ],
                "body": {
                  "type": "BlockStatement",
                  "body": [
                    {
                      "type": "IfStatement",
                      "test": {
                        "type": "BinaryExpression",
                        "operator": "==",
                        "left": {
                          "type": "MemberExpression",
                          "computed": false,
                          "object": {
                            "type": "Identifier",
                            "name": "p_control"
                          },
                          "property": {
                            "type": "Identifier",
                            "name": "value"
                          }
                        },
                        "right": {
                          "type": "Literal",
                          "value": "",
                          "raw": "\"\""
                        }
                      },
                      "consequent": {
                        "type": "BlockStatement",
                        "body": [
                          {
                            "type": "ExpressionStatement",
                            "expression": {
                              "type": "AssignmentExpression",
                              "operator": "=",
                              "left": {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                  "type": "ThisExpression"
                                },
                                "property": {
                                  "type": "Identifier",
                                  "name": "first_name"
                                }
                              },
                              "right": {
                                "type": "Literal",
                                "value": "bubba",
                                "raw": "\"bubba\""
                              }
                            }
                          }
                        ]
                      },
                      "alternate": null
                    }
                  ]
                },
                "generator": false,
                "expression": false
              }
            ],
            "sourceType": "script"
          }