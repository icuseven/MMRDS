using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_de_identifier
	{
		string source_json;
		static HashSet<string> de_identified_set = new HashSet<string>(){
				"home_record/first_name",
				"home_record/last_name",
				"home_record/middle_name"
		};

		public c_de_identifier (string p_source_json)
		{

			source_json = p_source_json;
		}



		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(source_json);



			foreach (string path in de_identified_set) 
			{
				get_value (source_object, path);
			}

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(source_object, settings);

			return result;
		}


		public dynamic get_value(System.Dynamic.ExpandoObject p_object, string p_path)
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
					
					if(i == 0)
					{
						index = ((IDictionary<string, object>)p_object)[path[i]];
					}
					else if (i == path.Length - 1)
					{
						if (index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
						{
							var val = ((IDictionary<string, object>)index)[path[i]]; 

							if(val.GetType() == typeof(string))
							{
								((IDictionary<string, object>)index)[path[i]] = "de-identified";	
							}
							else
							{
								((IDictionary<string, object>)index)[path[i]] = null;	
							}



							result = "de-identified";
						}
						else
						{
							System.Console.WriteLine("break");
						}
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
	}
}

