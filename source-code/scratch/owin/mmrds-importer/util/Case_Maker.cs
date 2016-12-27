using System;
using System.Collections.Generic;

namespace mmria
{
	public class Case_Maker
	{
		public Case_Maker()
		{
		}


		public IDictionary<string, object> create_default_object(mmria.common.metadata.app p_metadata, IDictionary<string, object> p_parent)
		{
			p_parent.Add("_id", new DateTime().ToString("s"));
			for (var i = 0; i < p_metadata.children.Length; i++)
			{
				mmria.common.metadata.node child = p_metadata.children[i];
				create_default_object(child, p_parent);
			}

			return p_parent;
		}

		public IDictionary<string, object> create_default_object(mmria.common.metadata.node p_metadata, IDictionary<string, object> p_parent)
		{

			switch (p_metadata.type.ToLower())
			{
				case "grid":
					//p_parent.Add(p_metadata.name, new List<object>());
					var temp = new List<object>();
					var sample_grid_item = new Dictionary<string, object>{ };
					for (var i = 0; i < p_metadata.children.Length; i++)
					{
						mmria.common.metadata.node child  = p_metadata.children[i];
						create_default_object(child, sample_grid_item);
					}
					temp.Add(sample_grid_item);
					p_parent.Add(p_metadata.name, temp);

					break;
				case "form":

					var temp_object = new Dictionary<string, object>();
					for (var i = 0; i < p_metadata.children.Length; i++)
					{
						mmria.common.metadata.node child  = p_metadata.children[i];
						create_default_object(child, temp_object);
					}

					if
					(
							!string.IsNullOrWhiteSpace(p_metadata.cardinality) &&
					  (
						p_metadata.cardinality == "+" ||
						p_metadata.cardinality == "*"
					  )
					)
					{
						var temp2 = new List<object>();
						temp2.Add(temp_object);
						p_parent.Add(p_metadata.name, temp_object);
					}
					else
					{
						p_parent[p_metadata.name] = temp_object;
					}

					break;

				case "group":
					var temp3 = new Dictionary<string, object>();
					for (var i = 0; i < p_metadata.children.Length; i++)
					{
						mmria.common.metadata.node child  = p_metadata.children[i];
						create_default_object(child, temp3);
						if (!p_parent.ContainsKey(p_metadata.name))
						{
							p_parent.Add(p_metadata.name, temp3);
						}
					}
					break;/*
				case "app":
					p_parent["_id"] = new Date().toISOString();
					for (var i = 0; i < p_metadata.children.Length; i++)
					{
						mmria.common.metadata.node child  = p_metadata.children[i];
						create_default_object(child, p_parent);
					}
					break;*/
				case "string":
				case "textarea":
				case "address":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = p_metadata.default_value;
					}
					else if (!string.IsNullOrWhiteSpace(p_metadata.pre_fill) && p_metadata.pre_fill != "")
					{
						p_parent[p_metadata.name] = p_metadata.pre_fill;
					}
					else
					{
						p_parent[p_metadata.name] = "";
					}
					break;
				case "number":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = double.Parse(p_metadata.default_value);
					}
					else
					{
						p_parent[p_metadata.name] = new Double();
					}
					break;
				case "boolean":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = bool.Parse(p_metadata.default_value);
					}
					else
					{
						p_parent[p_metadata.name] = new Boolean();
					}
					break;
				case "list":
				case "yes_no":
					if(p_metadata.is_multiselect.HasValue && p_metadata.is_multiselect == true)
					{
						p_parent[p_metadata.name] = new List<string>();
					}
					else
					{
						p_parent[p_metadata.name] = "";
					}

					break;
				case "date":
				case "datetime":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = DateTime.Parse(p_metadata.default_value);
					}
					else
					{
						p_parent[p_metadata.name] = new DateTime();
					}
					break;
				case "time":
					p_parent[p_metadata.name] = DateTime.Parse("2016-01-01T00:00:00.000Z");
					break;
				case "label":
				case "button":
					break;
				default:
					System.Console.WriteLine("create_default_object not processed {0}", p_metadata);
					break;
			}

			return p_parent;
		}


	}


}
