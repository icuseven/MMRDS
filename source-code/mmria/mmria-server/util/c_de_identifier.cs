using System;
using System.Collections.Generic;

namespace mmria.server.util
{
	public class c_de_identifier
	{
		string case_item_json;
		static HashSet<string> de_identified_set = new HashSet<string>();
		
		public c_de_identifier (string p_case_item_json)
		{
			this.case_item_json = p_case_item_json;
		}


		public static HashSet<string> De_Identified_Set 
		{
			 set{ de_identified_set = value;}
		}

		public string execute()
		{
			string result = null;

			System.Dynamic.ExpandoObject case_item_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(case_item_json);


			IDictionary<string, object> expando_object = case_item_object as IDictionary<string, object>;
			expando_object.Remove("_rev");

			foreach (string path in de_identified_set) 
			{
					set_de_identified_value (case_item_object, path);
			}


			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(case_item_object, settings);

			return result;
		}


		public void set_de_identified_value (dynamic p_object, string p_path)
		{

            /*
            if (p_path == "death_certificate/demographics/city_of_birth")
			{
				System.Console.Write("break");
			}*/

			try
			{
				///"death_certificate/place_of_last_residence/street",

				List<string> path_list = new List<string>(p_path.Split ('/'));

				if (path_list.Count == 1)
				{	
					if (p_object is IDictionary<string, object>)
					{
						
						IDictionary<string, object> dictionary_object = p_object as IDictionary<string, object>;

						object val = null;

						if (dictionary_object.ContainsKey (path_list [0]))
						{
							val = dictionary_object [path_list [0]]; 

							if (val != null)
							{
								// set the de-identified value
								if (val is IDictionary<string, object>)
								{
									//System.Console.WriteLine ("This should not happen. {0}", p_path);
								}
								else if (val is IList<object>)
								{
									//System.Console.WriteLine ("This should not happen. {0}", p_path);
								}
								else if (val is string)
								{
									//dictionary_object [path_list [0]] = "de-identified";
									if(
										path_list [0] == "first_name" ||
										path_list [0] == "last_name"
									)
									{
										dictionary_object [path_list [0]] = "de-identified";
									}
									else
									{
										dictionary_object [path_list [0]] = null;
									}
								}
								else if (val is System.DateTime)
								{
									dictionary_object [path_list [0]] = DateTime.MinValue;
								}
								else
								{
									dictionary_object [path_list [0]] = null;
								}
							}
						}
				
					}
					else if (p_object is IList<object>)
					{
						IList<object> Items = p_object as IList<object>;

						foreach(object item in Items)
						{
							set_de_identified_value (item, path_list [0]);

						}
					}	
					else
					{
						//System.Console.WriteLine ("This should not happen. {0}", p_path);
					}
					
				}
				else
				{
					List<string> new_path = new List<string>();
	
					for(int i = 1; i < path_list.Count; i++)
					{
						new_path.Add(path_list[i]);
					}
					// call set_de_identified_value with next item in path
					///"death_certificate/place_of_last_residence/street",
					//er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/day

					if (p_object is IDictionary<string, object>)
					{
						IDictionary<string, object> dictionary_object = p_object as IDictionary<string, object>;

						dynamic val = null;
	
						if (dictionary_object.ContainsKey (path_list [0]))
						{
							val = dictionary_object [path_list [0]]; 
						}
	
						if (val != null)
						{
	
							set_de_identified_value (val, string.Join("/", new_path));
						}
	
					}
					else if (p_object is IList<object>)
					{
						
						IList<object> Items = p_object as IList<object>;

						foreach(object item in Items)
						{
							set_de_identified_value (item, string.Join("/", path_list));

						}
					}
					else
					{
						//System.Console.WriteLine ("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine ("set_de_identified_value. {0}", ex);
			}
				
		}
	}
}

