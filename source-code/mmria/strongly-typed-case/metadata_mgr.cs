using System;
using System.Collections.Generic;
using System.Linq;

public class metadata_mgr
{
    public Dictionary<string,mmria.common.metadata.value_node[]> lookup;

	public Dictionary<string, Metadata_Node> dictionary_set;
	public List<Metadata_Node> all_list_set;

	public List<Metadata_Node> single_form_value_set;
	public List<Metadata_Node> single_form_multi_value_set;
	public List<Metadata_Node> single_form_grid_value_set;
	public List<Metadata_Node> single_form_grid_multi_value_list_set;
	public List<Metadata_Node> multiform_value_set;
	public List<Metadata_Node> multiform_multi_value_set;
	public List<Metadata_Node> multiform_grid_value_set;

	public List<Metadata_Node> multiform_grid_multi_value_set;

	public List<Metadata_Node> SingleformList = new();
	public List<Metadata_Node> MultifFormList = new();
	public List<Metadata_Node> GroupList = new();
	public List<Metadata_Node> GridList = new();

	public List<Metadata_Node> MultivaluedList = new();

	public Stack<System.Text.StringBuilder> source_code_builder_stack = new();

    public metadata_mgr(mmria.common.metadata.app metadata)
    {
        	this.lookup = get_look_up(metadata);

			all_list_set = new();

			dictionary_set = get_metadata_node(metadata);

			foreach(var kvp in dictionary_set)
			{
				all_list_set.Add(kvp.Value);
			}

			single_form_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == false && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			single_form_multi_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == false && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			single_form_grid_value_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == true && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			single_form_grid_multi_value_list_set = all_list_set.Where(o=> o.is_multiform == false && o.is_grid == true && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			multiform_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == false && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			multiform_multi_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == false && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			multiform_grid_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == true && o.Node.is_multiselect == null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();
			multiform_grid_multi_value_set = all_list_set.Where(o=> o.is_multiform == true && o.is_grid == true && o.Node.is_multiselect != null && (o.Node.control_style == null || !o.Node.control_style.Equals("editable",StringComparison.OrdinalIgnoreCase))).ToList();

			PassTwo(metadata);
    }

    public Dictionary<string,mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
	{
		var result = new Dictionary<string,mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

		foreach(var node in p_metadata.lookup)
		{
			result.Add("lookup/" + node.name, node.values);
		}
		return result;
	}	

    public sealed class Metadata_Node
	{
		public Metadata_Node(){}
		public bool is_multiform { get; set; }
		public bool is_grid { get; set; }

		public string path {get;set;}
		public string hash_value {get;set;}

		public string sass_export_name {get;set;}
		public mmria.common.metadata.node Node { get; set; }

		public Dictionary<string,string> display_to_value { get; set; }
		public Dictionary<string,string> value_to_display { get; set; }
	}
	

	public Dictionary<string, Metadata_Node> get_metadata_node(mmria.common.metadata.app p_metadata)
	{
		var result = new Dictionary<string, Metadata_Node>();
		foreach(var node in p_metadata.children)
		{
			var current_type = node.type.ToLowerInvariant();

			
			if(current_type == "form")
			{
				if
				(
					node.cardinality == "+" ||
					node.cardinality == "*"
				)
				{
					get_metadata_node(ref result, node, true, false, node.name);
				}
				else
				{
					get_metadata_node(ref result, node, false, false, node.name);
				}
			}
			else
			{
							
				result.Add(node.name, new Metadata_Node()
				{
					is_multiform = false,
					is_grid = false,
					path = node.name,
					hash_value = compute_hash(node.name),
					Node = node,
					sass_export_name = node.sass_export_name
				});


				if(node.children != null)
				{
					foreach(var n in node.children)
					{

						get_metadata_node(ref result, n, false, false, node.name + "/" + n.name);
					
					}
				}
			}
		}
		return result;
	}


	public void get_metadata_node(ref Dictionary<string, Metadata_Node> p_result, mmria.common.metadata.node p_node, bool p_is_multiform, bool p_is_grid, string p_path)
	{
		var current_type = p_node.type.ToLowerInvariant();
		var value_to_display = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
		var display_to_value = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

		if
		(
			current_type == "list"
		)
		{

			if(!string.IsNullOrWhiteSpace(p_node.path_reference))
			{
				//var key = "lookup/" + p_node.name;
				var key = p_node.path_reference;
				if(this.lookup.ContainsKey(key))
				{
					var values = this.lookup[key];

					p_node.values = values;
				}
			}

			foreach(var value_item in p_node.values)
			{
				var value = value_item.value;
				var display = value_item.display;

				if(!value_to_display.ContainsKey(value))
				{
					value_to_display.Add(value, display);
				}

				if(!display_to_value.ContainsKey(display))
				{
					display_to_value.Add(display, value);
				}
			}
		}

		//if(!p_result.ContainsKey(p_path))
		p_result.Add(p_path, new Metadata_Node()
		{
			is_multiform = p_is_multiform,
			is_grid = p_is_grid,
			path = p_path,
			hash_value = compute_hash(p_path),
			Node = p_node,
			value_to_display = value_to_display,
			display_to_value = display_to_value,
			sass_export_name = p_node.sass_export_name
		});
		
		if(p_node.children != null)
		{
			foreach(var node in p_node.children)
			{
				if(current_type == "grid")
				{
					get_metadata_node(ref p_result, node, p_is_multiform, true, p_path + "/" + node.name);
				}
				else
				{
					get_metadata_node(ref p_result, node, p_is_multiform, p_is_grid, p_path + "/" + node.name);
				}
			}
		}
	}

	public mmria.common.metadata.node get_metadata_node(mmria.common.metadata.app p_metadata, string p_path)
	{
		mmria.common.metadata.node result = null;

		mmria.common.metadata.node current = null;
		
		string[] path = p_path.Split("/");

		for(int i = 0; i < path.Length; i++)
		{
			string current_name = path[i];
			if(i == 0)
			{
				foreach(var child in p_metadata.children)
				{
					if(child.name.Equals(current_name, StringComparison.OrdinalIgnoreCase))
					{
						current = child;
						break;
					}
				}
			}

			else
			{

				if(current.children != null)
				{
					foreach(var child2 in current.children)
					{
						if(child2.name.Equals(current_name, StringComparison.OrdinalIgnoreCase))
						{
							current = child2;
							break;
						}
					}	
				}
				else
				{
					return result;
				}

				if(i == path.Length -1)
				{
					result = current;
				}
			}
		}

		return result;
	}

    string compute_hash(string value)
    {
        byte[] tmpSource;
        byte[] tmpHash;

        tmpSource = System.Text.ASCIIEncoding.ASCII.GetBytes(value);
        //tmpHash = new System.Security.Cryptography.MD5CryptoServiceProvider().ComputeHash(tmpSource);
        tmpHash = System.Security.Cryptography.MD5.Create().ComputeHash(tmpSource);

        var sOutput = new System.Text.StringBuilder(tmpHash.Length);
        for (int i=0; i < tmpHash.Length; i++)
        {
            sOutput.Append(tmpHash[i].ToString("X2"));
        }
        return sOutput.ToString();
    }

	HashSet<string> PassTwoHash = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
	public void PassTwo(mmria.common.metadata.app value)
	{

		var source_code_builder = new System.Text.StringBuilder();
		source_code_builder_stack.Push(source_code_builder);

		source_code_builder.AppendLine($@"public class mmria_case
{{
	
	public mmria_case(){{}}
	
	public string _id {{ get; set; }}
	public string _rev {{ get; set; }}");
			foreach(var child in value.children)
			{
				WriteAttribute(child, "", source_code_builder);	
			}
			source_code_builder.AppendLine("}");

					
		foreach(var child in value.children)
		{
			PassTwo(child, "");
		}
	}


	public void PassTwo(mmria.common.metadata.node value, string path)
	{
		// Singleform
		// MultifForm
		// group
		// grid
		/*

SingleformList
MultifFormList
GroupList
GridList

	*/

		System.Text.StringBuilder source_code_builder;

		var current_path = path + $"/{value.name}";
		if(string.IsNullOrWhiteSpace(path))
		{
			current_path = $"{value.name}";
		}

		switch(value.type.ToLower())
		{
			case "form":
				if
				(
					value.cardinality == "+" ||
					value.cardinality == "*"
				)
				{

					source_code_builder = new();
					source_code_builder_stack.Push(source_code_builder);
					source_code_builder.AppendLine($@"public class _{dictionary_set[current_path].hash_value}
{{
	public _{dictionary_set[current_path].hash_value}(){{}}");
					foreach(var child in value.children)
					{
						WriteAttribute(child, current_path, source_code_builder);	
					}
					source_code_builder.AppendLine("}");

					foreach(var child in value.children)
					{
						
						PassTwo(child, current_path);
					}
				}
				else
				{
					source_code_builder = new();
					source_code_builder_stack.Push(source_code_builder);
					source_code_builder.AppendLine($@"public class _{dictionary_set[current_path].hash_value}
{{

	public _{dictionary_set[current_path].hash_value}(){{}}");
					foreach(var child in value.children)
					{
						WriteAttribute(child, current_path, source_code_builder);	
					}
					source_code_builder.AppendLine("}");

					foreach(var child in value.children)
					{
						
						PassTwo(child, current_path);
					}
				}
			break;
			case "group":
					source_code_builder = new();
					source_code_builder_stack.Push(source_code_builder);
					source_code_builder.AppendLine($@"public class _{dictionary_set[current_path].hash_value}
{{
	public _{dictionary_set[current_path].hash_value}(){{}}");
					foreach(var child in value.children)
					{
						WriteAttribute(child, current_path, source_code_builder);	
					}
					source_code_builder.AppendLine("}");

					foreach(var child in value.children)
					{
						
						PassTwo(child, current_path);
					}
			break;
			case "grid":

					source_code_builder = new();
					source_code_builder_stack.Push(source_code_builder);
					source_code_builder.AppendLine($@"public class _{dictionary_set[current_path].hash_value}
{{
	public _{dictionary_set[current_path].hash_value}(){{}}");
					foreach(var child in value.children)
					{
						WriteAttribute(child, current_path, source_code_builder);	
					}
					source_code_builder.AppendLine("}");

					foreach(var child in value.children)
					{
						
						PassTwo(child, current_path);
					}
			break;
			case "list":
			/*
				if(value.is_multiselect != null && value.is_multiselect.Value)
				{

				}

			break;*/

			
			case "string":
			case "date":
			
			case "jurisdiction":
			case "number":
			case "textarea":
			case "hidden":
			case "time":
			case "datetime":
					//source_code_builder = source_code_builder_stack.Peek();
					//source_code_builder.AppendLine($@"		public string {dictionary_set[current_path].Node.name} {{ get; set; }}");
			break;
			case "label":
			case "always_enabled_button":
			case "button":
			case "chart":
			
			break;
			default:
				if(!PassTwoHash.Contains(value.type))
				{
					Console.WriteLine($"case \"{value.type}\":");
					PassTwoHash.Add(value.type);
				}
			break;
			
		}
	}

	public void WriteAttribute
	(
		mmria.common.metadata.node value, 
		string path, 
		System.Text.StringBuilder builder
	)
	{
		// Singleform
		// MultifForm
		// group
		// grid
		/*

SingleformList
MultifFormList
GroupList
GridList

	*/

		var current_path = path + $"/{value.name}";
		if(string.IsNullOrWhiteSpace(path))
		{
			current_path = $"{value.name}";
		}

		var name = Convert_To_C_Sharp_Attribute_Name(dictionary_set[current_path].Node.name);

		switch(value.type.ToLower())
		{
			
			case "form":
				if
				(
					value.cardinality == "+" ||
					value.cardinality == "*"
				)
				{
					builder.AppendLine($@"public List<_{dictionary_set[current_path].hash_value}> {name}{{ get;set;}}");
				}
				else
				{
					builder.AppendLine($@"public _{dictionary_set[current_path].hash_value} {name}{{ get;set;}}");
				}
			break;
			case "group":
					builder.AppendLine($@"public _{dictionary_set[current_path].hash_value} {name}{{ get;set;}}");
			break;
			case "grid":
				builder.AppendLine($@"public List<_{dictionary_set[current_path].hash_value}> {name}{{ get;set;}}");			
				break;
			case "list":
			
				if(value.is_multiselect != null && value.is_multiselect.Value)
				{
					builder.AppendLine($@"		public List<string> {name} {{ get; set; }}");
				}
				else
				{
					builder.AppendLine($@"		public string {name} {{ get; set; }}");
				}

			break;

			
			case "string":
			case "date":
			
			case "jurisdiction":
			case "number":
			case "textarea":
			case "hidden":
			case "time":
			case "datetime":

				
				builder.AppendLine($@"		public string {name} {{ get; set; }}");
			break;
			case "label":
			case "always_enabled_button":
			case "button":
			case "chart":
			
			break;
			default:
				if(!PassTwoHash.Contains(value.type))
				{
					Console.WriteLine($"case \"{value.type}\":");
					PassTwoHash.Add(value.type);
				}
			break;
			
		}
	}

	string Convert_To_C_Sharp_Attribute_Name(string value)
	{
		var result = value;
		if(value == "class")
		{
			result = "@class";
		}

		return result;
	}

}