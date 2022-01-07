using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.utils
{
  public partial class exporter
  {
        private Dictionary<string,mmria.common.metadata.value_node[]> lookup;

        List<Metadata_Node> all_list_set;

		List<Metadata_Node> single_form_value_set;
		List<Metadata_Node> single_form_multi_value_set;
		List<Metadata_Node> single_form_grid_value_set;
		List<Metadata_Node> single_form_grid_multi_value_list_set;
		List<Metadata_Node> multiform_value_set;
		List<Metadata_Node> multiform_multi_value_set;
		List<Metadata_Node> multiform_grid_value_set;

		List<Metadata_Node> multiform_grid_multi_value_set;


        public class Metadata_Node
		{
			public Metadata_Node(){}
			public bool is_multiform { get; set; }
			public bool is_grid { get; set; }

			public string path {get;set;}

			public string sass_export_name {get;set;}
			public mmria.common.metadata.node Node { get; set; }

			public Dictionary<string,string> display_to_value { get; set; }
			public Dictionary<string,string> value_to_display { get; set; }
		}
		

        private Dictionary<string,mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
        {
			var result = new Dictionary<string,mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

			foreach(var node in p_metadata.lookup)
			{
				result.Add("lookup/" + node.name, node.values);
			}
			return result;
		}	

		private List<Metadata_Node> get_metadata_node_by_type(mmria.common.metadata.app p_metadata, string p_type)
		{
			var result = new List<Metadata_Node>();
			foreach(var node in p_metadata.children)
			{
				var current_type = node.type.ToLowerInvariant();
				if(current_type == p_type)
				{
					result.Add(new Metadata_Node()
					{
						is_multiform = false,
						is_grid = false,
						path = node.name,
						Node = node,
						sass_export_name = node.sass_export_name
					});
				}
				else if(current_type == "form")
				{
					if
					(
						node.cardinality == "+" ||
						node.cardinality == "*"
					)
					{
						get_metadata_node_by_type(ref result, node, p_type, true, false, node.name);
					}
					else
					{
						get_metadata_node_by_type(ref result, node, p_type, false, false, node.name);
					}
				}
			}
			return result;
		}

		private void get_metadata_node_by_type(ref List<Metadata_Node> p_result, mmria.common.metadata.node p_node, string p_type, bool p_is_multiform, bool p_is_grid, string p_path)
		{
			var current_type = p_node.type.ToLowerInvariant();
			if(current_type == p_type)
			{
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

				p_result.Add(new Metadata_Node()
				{
					is_multiform = p_is_multiform,
					is_grid = p_is_grid,
					path = p_path,
					Node = p_node,
					value_to_display = value_to_display,
					display_to_value = display_to_value,
					sass_export_name = p_node.sass_export_name
				});
			}
			else if(p_node.children != null)
			{
				foreach(var node in p_node.children)
				{
					if(current_type == "grid")
					{
						get_metadata_node_by_type(ref p_result, node, p_type, p_is_multiform, true, p_path + "/" + node.name);
					}
					else
					{
						get_metadata_node_by_type(ref p_result, node, p_type, p_is_multiform, p_is_grid, p_path + "/" + node.name);
					}
				}
			}
		}
  }
}