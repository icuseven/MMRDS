using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria
{
	public class Case_Maker
	{
		public Case_Maker()
		{
		}


		public bool set_value(mmria.common.metadata.app p_metadata, IDictionary<string, object> p_object, string p_path, object p_value)
		{
			bool result = false;

			try
			{
				string[] path = p_path.Split('/');
				List<string> built_path = new List<string>();

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}


				for (int i = 0; i < path.Length; i++)
				{
					built_path.Add(path[i]);

					if (number_regex.IsMatch(path[i]))
					{
						IList<object> temp_list = index as IList<object>;
						if (!(temp_list.Count > int.Parse(path[i])))
						{
							var node = get_metadata_node(p_metadata, string.Join("/", built_path.ToArray()));
							Dictionary<string, object> temp = new Dictionary<string, object>();
							create_default_object(node, temp);
							((IList<object>)index).Add(((IList<object>)temp[path[i - 1]])[0]);
							/*
							if (node.type.ToLower() == "grid")
							{
								((IList<object>)index).Add(((IList<object>)temp[path[i - 1]])[0]);
							}
							else
							{
								((IList<object>)index).Add(temp[path[i - 1]]);
							}*/

						}

						index = index[int.Parse(path[i])] as IDictionary<string, object>;
					}
					else if (index[path[i]] is IList<object>)
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index[path[i]] is IDictionary<string, object> && !index.ContainsKey(path[i]))
					{
						System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}

					else if (index[path[i]] is IDictionary<string, object>)
					{
						index = index[path[i]] as IDictionary<string, object>;
					}
					else if (i == path.Length - 1)
					{
						//System.Console.WriteLine("Set Type: {0}", index[path[i]].GetType());
						if (index[path[i]] == null)
						{
							index[path[i]] = p_value;
							result = true;
						}
						else if (index[path[i]].GetType().ToString() == "System.Boolean")
						{
							//((IList<string>)index[path[i]]).Add(p_value.ToString());
							index[path[i]] = p_value;
							result = true;
						}
						else if (index[path[i]].GetType().ToString() == "System.Collections.Generic.IList`1[System.String]")
						{
							((IList<string>)index[path[i]]).Add(p_value.ToString());
							result = true;
						}
						else
						{
							index[path[i]] = p_value;
							result = true;
						}
					}
					else
					{
						System.Console.WriteLine("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}


		public string AppendFormIndexToPath(int p_index, string p_path)
		{
			string[] path_array = p_path.Split('/');
			List<string> path = new List<string>();

				for (int i = 0; i < path_array.Length; i++)
				{
					if (i == 1)
					{
						path.Add(p_index.ToString());
					}

					path.Add(path_array[i]);
				}

			return string.Join("/", path.ToArray());
		}


		public string AppendGridIndexToPath(int p_index, string p_path)
		{
			string[] path_array = p_path.Split('/');
			List<string> path = new List<string>();

			for (int i = 0; i < path_array.Length; i++)
			{
				if (i == path_array.Length - 1)
				{
					path.Add(p_index.ToString());
				}

				path.Add(path_array[i]);
			}

			return string.Join("/", path.ToArray());
		}

		public string get_form_path(string p_path)
		{
			string[] path = p_path.Split('/');
			return path[0];
		}

		public dynamic get_value(IDictionary<string, object> p_object, string p_path)
		{
			dynamic result = null;

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}


				for (int i = 0; i < path.Length; i++)
				{
					if (i == path.Length - 1)
					{
						result = index[path[i]];
					}
					else if (number_regex.IsMatch(path[i]))
					{
						IList<object> temp_list = index as IList<object>;
						if (!(temp_list.Count > int.Parse(path[i])))
						{

						}
						index = index[int.Parse(path[i])] as IDictionary<string, object>;
					}
					else if (index[path[i]] is IList<object>)
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index[path[i]] is IDictionary<string, object> && !index.ContainsKey(path[i]))
					{
						System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}
					else if (index[path[i]] is IDictionary<string, object>)
					{
						index = index[path[i]] as IDictionary<string, object>;
					}
					else
					{
						System.Console.WriteLine("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}


		public mmria.common.metadata.node get_metadata_node(mmria.common.metadata.app p_object, string p_path)
		{
			mmria.common.metadata.node result = null;
			System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");
			try
			{
				string[] path = p_path.Split('/');

				for (int i = 0; i < path.Length; i++)
				{
					if (i == 0)
					{
						result = p_object.children.Where(c => c.name.Equals(path[i], StringComparison.OrdinalIgnoreCase)).First();
					}
					else if (number_regex.IsMatch(path[i]))
					{
						continue;
					}
					else 
					{
						switch (result.type.ToLower())
						{
							case "form":
							case "grid":
							case "group":
								foreach (mmria.common.metadata.node child in result.children)
								{
									if (child.name.Equals(path[i], StringComparison.OrdinalIgnoreCase))
									{
										result = child;
										break;
									}
								}

								break;

							default:
								System.Console.WriteLine("get_metadata_object: {0} - {1} - {2}", path, result.type, path[i]);
								break;
						}

					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}

		public IDictionary<string, object> create_default_object(mmria.common.metadata.app p_metadata, IDictionary<string, object> p_parent)
		{
			p_parent.Add("_id", Guid.NewGuid().ToString());
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
						p_parent.Add(p_metadata.name, temp2);
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
						p_parent[p_metadata.name] = new Double?();
					}
					break;
				case "boolean":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = bool.Parse(p_metadata.default_value);
					}
					else
					{
						p_parent[p_metadata.name] = new Boolean?();
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
						p_parent[p_metadata.name] = new DateTime?();
					}
					break;
				case "time":
					if (!string.IsNullOrWhiteSpace(p_metadata.default_value) && p_metadata.default_value != "")
					{
						p_parent[p_metadata.name] = DateTime.Parse(p_metadata.default_value);
					}
					else
					{
						p_parent[p_metadata.name] = new DateTime?();
					}
					//p_parent[p_metadata.name] = DateTime.Parse("2016-01-01T00:00:00.000Z");
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
