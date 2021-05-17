using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Linq;
using Microsoft.Extensions.Configuration;


namespace mmria.server.util
{
  public class mmrds_exporter
  {
    private string auth_token = null;
    private string user_name = null;

    private string juris_user_name = null;
    private string value_string = null;
    private string database_path = null;
    private string database_url = null;
    private string item_file_name = null;
    private string item_directory_name = null;
    private string item_id = null;
    private bool is_cdc_de_identified = false;

    private bool is_offline_mode;

    private HashSet<string> de_identified_set;

    private System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> List_Look_Up;
    System.Collections.Generic.Dictionary<string, string> path_to_field_name_map = new Dictionary<string, string>();

    mmria.common.metadata.app current_metadata;

    private System.IO.StreamWriter[] qualitativeStreamWriter = new System.IO.StreamWriter[3];
    private int[] qualitativeStreamCount = new int[] { 0, 0, 0 };
    private const int max_qualitative_length = 31000;

    private const string over_limit_message = "Over the qualitative limit. check the over-the-qualitative-limit.txt file for details.";

    private mmria.server.model.actor.ScheduleInfoMessage Configuration;

    public mmrds_exporter(mmria.server.model.actor.ScheduleInfoMessage configuration)
    {
      this.Configuration = configuration;
      //this.is_offline_mode = bool.Parse(Configuration["mmria_settings:is_offline_mode"]);

    }
    public bool Execute(mmria.server.export_queue_item queue_item)
    {

      try
      {
        this.database_path = this.Configuration.couch_db_url;
        this.juris_user_name = this.Configuration.jurisdiction_user_name;
        this.user_name = this.Configuration.user_name;
        this.value_string = this.Configuration.user_value;

        this.item_file_name = queue_item.file_name;
        this.item_directory_name = queue_item.file_name.Substring(0, queue_item.file_name.IndexOf("."));
        this.item_id = queue_item._id;


        if (string.IsNullOrWhiteSpace(this.database_url))
        {
          this.database_url = Configuration.couch_db_url;

          if (string.IsNullOrWhiteSpace(this.database_url))
          {
            System.Console.WriteLine("missing database_url");
            System.Console.WriteLine(" form database:[file path]");
            System.Console.WriteLine(" example database:http://localhost:5984");
            System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345 database_url:http://localhost:5984");

            return false;
          }
        }


        if (string.IsNullOrWhiteSpace(this.user_name))
        {
          System.Console.WriteLine("missing user_name");
          System.Console.WriteLine(" form user_name:[user_name]");
          System.Console.WriteLine(" example user_name:user1");
          System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");
          return false;
        }

        if (string.IsNullOrWhiteSpace(this.value_string))
        {
          System.Console.WriteLine("missing password");
          System.Console.WriteLine(" form password:[password]");
          System.Console.WriteLine(" example password:secret");
          System.Console.WriteLine(" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");
          return false;
        }

        string export_directory = System.IO.Path.Combine(Configuration.export_directory, this.item_directory_name);

        if (!System.IO.Directory.Exists(export_directory))
        {
          System.IO.Directory.CreateDirectory(export_directory);
        }


        export_directory = System.IO.Path.Combine(Configuration.export_directory, this.item_directory_name, "over-the-limit");

        if (!System.IO.Directory.Exists(export_directory))
        {
          System.IO.Directory.CreateDirectory(export_directory);
        }

        this.qualitativeStreamWriter[0] = new System.IO.StreamWriter(System.IO.Path.Combine(export_directory, "over-the-qualitative-limit.txt"), true);
        this.qualitativeStreamWriter[1] = new System.IO.StreamWriter(System.IO.Path.Combine(export_directory, "case-narrative.txt"), true);
        this.qualitativeStreamWriter[2] = new System.IO.StreamWriter(System.IO.Path.Combine(export_directory, "informant-interview.txt"), true);


        string URL = this.database_url + $"/{Program.db_prefix}mmrds/_all_docs";
        string urlParameters = "?include_docs=true";
        cURL document_curl = new cURL("GET", null, URL + urlParameters, null, this.user_name, this.value_string);
        dynamic all_cases = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(document_curl.execute());

        string metadata_url = this.database_url + $"/metadata/version_specification-{this.Configuration.version_number}/metadata";
        cURL metadata_curl = new cURL("GET", null, metadata_url, null, this.user_name, this.value_string);
        mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());
        this.current_metadata = metadata;


        /*
				foreach (KeyValuePair<string, object> kvp in all_cases)
				{
					System.Console.WriteLine(kvp.Key);
				}*/

        System.Collections.Generic.Dictionary<string, int> path_to_int_map = new Dictionary<string, int>();
        System.Collections.Generic.Dictionary<string, string> path_to_file_name_map = new Dictionary<string, string>();

        System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> path_to_node_map = new Dictionary<string, mmria.common.metadata.node>();
        System.Collections.Generic.Dictionary<string, string> path_to_grid_map = new Dictionary<string, string>();
        System.Collections.Generic.Dictionary<string, string> path_to_multi_form_map = new Dictionary<string, string>();
        System.Collections.Generic.Dictionary<string, string> grid_to_multi_form_map = new Dictionary<string, string>();

        System.Collections.Generic.HashSet<string> path_to_flat_map = new System.Collections.Generic.HashSet<string>();

        System.Collections.Generic.Dictionary<string, WriteCSV> path_to_csv_writer = new Dictionary<string, WriteCSV>();

        generate_path_map
        (metadata, "", "mmria_case_export.csv", "",
          path_to_int_map,
          path_to_file_name_map,
          path_to_node_map,
          path_to_grid_map,
          path_to_multi_form_map,
          false,
          grid_to_multi_form_map,
          false,
          path_to_flat_map
        );


        List_Look_Up = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

        foreach (var child in metadata.children)
        {
          Get_List_Look_Up(List_Look_Up, metadata.lookup, child, path_to_int_map, "/" + child.name);
        }

        System.Collections.Generic.HashSet<string> flat_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        System.Collections.Generic.HashSet<string> mutiform_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (KeyValuePair<string, string> kvp in path_to_grid_map)
        {
          if (grid_to_multi_form_map.ContainsKey(kvp.Key))
          {
            mutiform_grid_set.Add(kvp.Value);
          }
        }

        foreach (KeyValuePair<string, string> kvp in path_to_grid_map)
        {
          if (
            !mutiform_grid_set.Contains(kvp.Value) &&
            !flat_grid_set.Contains(kvp.Value)
          )
          {
            flat_grid_set.Add(kvp.Value);
          }
        }

        /*
				System.Collections.Generic.HashSet<string> mutiform_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
				foreach (KeyValuePair<string, string> kvp in path_to_multi_form_map)
				{
					if (!mutiform_set.Contains(kvp.Value))
					{
						mutiform_set.Add(kvp.Value);
					}
				}*/

        int stream_file_count = 0;
        foreach (string file_name in path_to_file_name_map.Select(kvp => kvp.Value).Distinct())
        {
          path_to_csv_writer.Add(file_name, new WriteCSV(file_name, this.item_directory_name, Configuration.export_directory));
          //Console.WriteLine(file_name);
          stream_file_count++;
        }
        //Console.WriteLine("stream_file_count: {0}", stream_file_count);



        create_header_row
        (
          path_to_int_map,
          path_to_flat_map,
          path_to_node_map,
          path_to_csv_writer["mmria_case_export.csv"].Table,
          true,
          false,
          false
        );

        var grantee_column = new System.Data.DataColumn("export_jurisdiction_name", typeof(string));

        grantee_column.DefaultValue = queue_item.grantee_name;
        path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Add(grantee_column);



        cURL de_identified_list_curl = new cURL("GET", null, this.database_url + "/metadata/de-identified-list", null, this.user_name, this.value_string);
        System.Dynamic.ExpandoObject de_identified_ExpandoObject = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(de_identified_list_curl.execute());
        de_identified_set = new HashSet<string>();

        if (queue_item.de_identified_field_set != null)
        {
          foreach (string path in queue_item.de_identified_field_set)
          {
            de_identified_set.Add(path.TrimStart('/'));
          }
        }


        HashSet<string> Custom_Case_Id_List = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var id in queue_item.case_set)
        {
          Custom_Case_Id_List.Add(id);
        }


        //mmria.server.util.c_de_identifier.De_Identified_Set = de_identified_set;

        List<System.Dynamic.ExpandoObject> all_cases_rows = new List<System.Dynamic.ExpandoObject>();


        var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(this.juris_user_name);


        if (queue_item.case_filter_type == "custom")
        {
          foreach (System.Dynamic.ExpandoObject case_row in all_cases.rows)
          {
            var check_item = ((IDictionary<string, object>)case_row)["doc"] as System.Dynamic.ExpandoObject;
            if (check_item != null)
            {
              var temp = check_item as IDictionary<string, object>;

              if
              (
                temp != null &&
                temp.ContainsKey("_id") &&

                temp["_id"] != null &&
                Custom_Case_Id_List.Contains(temp["_id"].ToString())
              )
              {
                all_cases_rows.Add(check_item);
              }

            }

          }
        }

        else
        {
          foreach (System.Dynamic.ExpandoObject case_row in all_cases.rows)
          {
            all_cases_rows.Add(((IDictionary<string, object>)case_row)["doc"] as System.Dynamic.ExpandoObject);
          }
        }



        foreach (System.Dynamic.ExpandoObject case_row in all_cases_rows)
        {
          IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;

          //IDictionary<string, object> case_doc = ((IDictionary<string, object>)case_row)["doc"] as IDictionary<string, object>;
          //IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;
          if
          (
            case_doc == null ||
            !case_doc.ContainsKey("_id") ||
            case_doc["_id"] == null ||
            case_doc["_id"].ToString().StartsWith("_design", StringComparison.InvariantCultureIgnoreCase)
          )
          {
            continue;
          }


          var is_jurisdiction_ok = false;

          var home_record = case_doc["home_record"] as IDictionary<string, object>;

          if (home_record != null)
          {
            if (!home_record.ContainsKey("jurisdiction_id"))
            {
              home_record.Add("jurisdiction_id", "/");
            }

            foreach (var jurisdiction_item in jurisdiction_hashset)
            {
              var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);


              if (regex.IsMatch(home_record["jurisdiction_id"].ToString()) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
              {
                is_jurisdiction_ok = true;
                break;
              }

            }
          }

          if (!is_jurisdiction_ok)
          {
            continue;
          }


          System.Data.DataRow row = path_to_csv_writer["mmria_case_export.csv"].Table.NewRow();
          string mmria_case_id = case_doc["_id"].ToString();
          row["_id"] = mmria_case_id;

          foreach (string path in path_to_flat_map)
          {
            if (
              path_to_node_map[path].type.ToLower() == "app" ||
              path_to_node_map[path].type.ToLower() == "form" ||
              path_to_node_map[path].type.ToLower() == "group" ||
              path_to_node_map[path].type.ToLower() == "button" ||
              path_to_node_map[path].type.ToLower() == "chart" ||
              path_to_node_map[path].type.ToLower() == "label" ||
              path_to_node_map[path].mirror_reference != null

            )
            {
              continue;
            }




            //System.Console.WriteLine("path {0}", path);

            if (
              path_to_node_map[path].type.ToLower() == "list" &&
              path_to_node_map[path].is_multiselect != null &&
                  path_to_node_map[path].is_multiselect == true
            )
            {
              //System.Console.WriteLine("break");
            }

            dynamic val = get_value(case_doc as IDictionary<string, object>, path);
            try
            {
              switch (path_to_node_map[path].type.ToLower())
              {

                case "number":
                  double try_double = 0;

                  if (val != null && (!string.IsNullOrWhiteSpace(val.ToString())) && double.TryParse(val.ToString(), out try_double))
                  {
                    string file_field_name = path_to_field_name_map[path];

                    row[file_field_name] = val;

                    /*
										if (path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Contains(file_field_name))
										{
											row[file_field_name] = val;
										}
										else
										{
											row[$"{file_field_name}_{path_to_int_map[path].ToString()}"] = val;
										}
										*/
                  }
                  break;
                case "list":

                  if
                  (
                    (
                      path_to_node_map[path].is_multiselect != null &&
                      path_to_node_map[path].is_multiselect == true
                    ) ||
                    val is List<object>
                  )
                  {

                    List<object> temp = val as List<object>;
                    if (temp != null && temp.Count > 0)
                    {
                      List<string> temp2 = new List<string>();
                      foreach (var item in temp)
                      {
                        var key = "/" + path;
                        var item_key = item.ToString();
                        if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                        {
                          temp2.Add(List_Look_Up["/" + path][item.ToString()]);
                        }
                        else
                        {
                          temp2.Add(item.ToString());
                        }
                      }


                      //Check if list can be sorted and list lookup has key
                      if(temp2?.Count > 1 && List_Look_Up.ContainsKey("/" + path))
                      {
                            //Get list lookup
                            var look_up_list = List_Look_Up["/" + path];

                            //Set sorted list back to the value to contiune regular flow
                            temp2 = SortListAgainstDictionary(temp2, look_up_list);
                      }

                      string file_field_name = path_to_field_name_map[path];
                      row[file_field_name] = string.Join("|", temp2);
                      /*
											if (path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Contains(file_field_name))
											{
												row[file_field_name] = string.Join("|", temp2);
											}
											else
											{
												row[$"{file_field_name}_{path_to_int_map[path].ToString()}"] = string.Join("|", temp2);
											}*/
                    }
                    else
                    {
                        string file_field_name = path_to_field_name_map[path];
                        row[file_field_name] = "(blank)";
                    }
                  }
                  else
                  {
                    string file_field_name = path_to_field_name_map[path];
                    if (val != null)
                    {
                      if (val is List<object>)
                      {
                        List<object> temp = val as List<object>;
                        if (temp != null && temp.Count > 0)
                        {
                          List<string> temp2 = new List<string>();
                          foreach (var item in temp)
                          {
                            var key = "/" + path;
                            var item_key = item.ToString();
                            if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                            {
                              temp2.Add(List_Look_Up["/" + path][item.ToString()]);
                            }
                            else
                            {
                              temp2.Add(item.ToString());
                            }
                          }


                          row[file_field_name] = string.Join("|", temp2);
                          /*
													if (path_to_csv_writer["mmria_case_export.csv"].Table.Columns.Contains(file_field_name))
													{
														row[file_field_name] = string.Join("|", temp2);
													}
													else
													{
														row[$"{file_field_name}_{path_to_int_map[path].ToString()}"] = string.Join("|", temp2);
													}*/
                        }
                        else
                        {
                            row[file_field_name] = "(blank)";
                        }

                      }
                      else
                      {
                        if
                        (
                          path_to_node_map[path].data_type != null &&
                          path_to_node_map[path].data_type.ToLower() == "string" &&
                          (
                            val.ToString() == "9999" ||
                            val.ToString() == "8888" ||
                            val.ToString() == "7777"
                          )
                        )
                        {

                          if (val.ToString() == "9999")
                          {
                            row[file_field_name] = "";
                          }

                          if (val.ToString() == "8888")
                          {
                            row[file_field_name] = "Not specified";
                          }

                          if (val.ToString() == "7777")
                          {
                            row[file_field_name] = "Unknown";
                          }

                        }
                        else
                        {
                          if (val.ToString() == "")
                          {
                            if
                            (
                              path_to_node_map[path].data_type != null &&
                              path_to_node_map[path].data_type.ToLower() == "string"
                            )
                            {
                              row[file_field_name] = "";
                            }
                            else
                            {
                              row[file_field_name] = "9999";
                            }

                          }
                          else
                          {
                            row[file_field_name] = val;
                          }

                        }

                      }
                    }
                    else
                    {
                      if
                      (
                        path_to_node_map[path].data_type != null &&
                        path_to_node_map[path].data_type.ToLower() == "string"

                      )
                      {
                        row[file_field_name] = "";
                      }
                      else
                      {
                        row[file_field_name] = "9999";
                      }
                    }
                  }

                  break;
                default:
                  if (val != null)
                  {
                    if
                    (
                      (
                        path_to_node_map[path].type.ToLower() == "textarea" ||
                        path_to_node_map[path].type.ToLower() == "string"
                      ) &&
                      val.ToString().Length > max_qualitative_length
                    )
                    {
                      WriteQualitativeData
                      (
                        mmria_case_id,
                        path,
                        val,
                        -1,
                        -1
                      );

                      val = over_limit_message;
                    }

                    string file_field_name = path_to_field_name_map[path];
                    row[file_field_name] = val;

                  }
                  break;

              }
            }
            catch (Exception ex)
            {
              System.Console.Write("bad export value: {0} - {1}", val, path);
            }

          }
          path_to_csv_writer["mmria_case_export.csv"].Table.Rows.Add(row);

          // flat grid - start
          foreach (KeyValuePair<string, mmria.common.metadata.node> ptn in path_to_node_map.Where(x => x.Value.type.ToLower() == "grid"))
          {
            string path = ptn.Key;
            if (flat_grid_set.Contains(path_to_grid_map[path]))
            {
              string grid_name = path_to_grid_map[path];

              HashSet<string> grid_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

              foreach (KeyValuePair<string, mmria.common.metadata.node> ptgm in path_to_node_map.Where(x => x.Key.StartsWith(path) && x.Key != path))
              {
                grid_field_set.Add(ptgm.Key);
              }

              create_header_row
              (
                path_to_int_map,
                grid_field_set,
                path_to_node_map,
                path_to_csv_writer[grid_name].Table,
                true,
                true,
                false
              );

              dynamic raw_data = get_value(case_doc as IDictionary<string, object>, path);
              List<object> object_data = raw_data as List<object>;

              if (object_data != null)
                for (int i = 0; i < object_data.Count; i++)
                {
                  IDictionary<string, object> grid_item_row = object_data[i] as IDictionary<string, object>;

                  if (grid_item_row == null)
                  {
                    continue;
                  }

                  System.Data.DataRow grid_row = path_to_csv_writer[grid_name].Table.NewRow();
                  grid_row["_id"] = mmria_case_id;
                  grid_row["_record_index"] = i;
                  foreach (KeyValuePair<string, string> kvp in path_to_grid_map.Where(k => k.Value == grid_name))
                  {
                    foreach (string node in grid_field_set)
                    {
                      try
                      {
                        var test_key = path_to_node_map[node].name;
                        if (!grid_item_row.ContainsKey(test_key))
                        {
                          //test_key =  node;
                          continue;
                        }
                        dynamic val = grid_item_row[test_key];

                        if (de_identified_set.Contains(node))
                        {
                          val = null;
                        }

                        string file_field_name = path_to_field_name_map[node];
                        if (val != null)
                        {



                          switch (path_to_node_map[node].type.ToLower())
                          {
                            case "number":
                              if (!string.IsNullOrWhiteSpace(val.ToString()))
                              {
                                double test_double = 0.0;
                                if (double.TryParse(val.ToString(), out test_double))
                                {

                                  grid_row[file_field_name] = val;
                                }
                                else
                                {

                                }

                              }
                              break;
                            case "list":
                              if
                              (
                                (
                                  path_to_node_map[node].is_multiselect != null &&
                                  path_to_node_map[node].is_multiselect == true
                                ) ||
                                val is List<object>
                              )
                              {

                                List<object> temp = val as List<object>;
                                if (temp != null && temp.Count > 0)
                                {
                                  List<string> temp2 = new List<string>();
                                  foreach (var item in temp)
                                  {
                                    var key = "/" + node;
                                    var item_key = item.ToString();
                                    if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                                    {
                                      temp2.Add(List_Look_Up["/" + node][item.ToString()]);
                                    }
                                    else
                                    {
                                      temp2.Add(item.ToString());
                                    }
                                  }

                                  grid_row[file_field_name] = string.Join("|", temp2);

                                }
                                else
                                {
                                    grid_row[file_field_name] = "(blank)";
                                }
                              }
                              else
                              {
                                if (val != null)
                                {


                                  if (val is List<object>)
                                  {
                                    List<object> temp = val as List<object>;
                                    if (temp != null && temp.Count > 0)
                                    {
                                      List<string> temp2 = new List<string>();
                                      foreach (var item in temp)
                                      {
                                        var key = "/" + node;
                                        var item_key = item.ToString();
                                        if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                                        {
                                          temp2.Add(List_Look_Up["/" + node][item.ToString()]);
                                        }
                                        else
                                        {
                                          temp2.Add(item.ToString());
                                        }
                                      }


                                      grid_row[file_field_name] = string.Join("|", temp2);

                                    }
                                    else
                                    {
                                        grid_row[file_field_name] = "(blank)";
                                    }
                                  }
                                  else
                                  {
                                    if
                                    (
                                      path_to_node_map[node].data_type != null &&
                                      path_to_node_map[node].data_type.ToLower() == "string" &&
                                      (
                                        val.ToString() == "9999" ||
                                        val.ToString() == "8888" ||
                                        val.ToString() == "7777"
                                      )
                                    )
                                    {

                                      if (val.ToString() == "9999")
                                      {
                                        grid_row[file_field_name] = "";
                                      }

                                      if (val.ToString() == "8888")
                                      {
                                        grid_row[file_field_name] = "Not specified";
                                      }

                                      if (val.ToString() == "7777")
                                      {
                                        grid_row[file_field_name] = "Unknown";
                                      }

                                    }
                                    else
                                    {
                                      if (val.ToString() == "" || val.ToString() == "9999")
                                      {

                                        if
                                        (
                                          path_to_node_map[node].data_type != null &&
                                          path_to_node_map[node].data_type.ToLower() == "string"
                                        )
                                        {
                                          grid_row[file_field_name] = "";
                                        }
                                        else
                                        {
                                          grid_row[file_field_name] = "9999";
                                        }

                                        //grid_row[file_field_name] = "9999";
                                      }
                                      else
                                      {
                                        grid_row[file_field_name] = val;
                                      }

                                    }
                                  }
                                }
                                else
                                {
                                  if
                                  (
                                    path_to_node_map[node].data_type != null &&
                                    path_to_node_map[node].data_type.ToLower() == "string"

                                  )
                                  {
                                    grid_row[file_field_name] = "";
                                  }
                                  else
                                  {
                                    grid_row[file_field_name] = "9999";
                                  }

                                }
                              }

                              break;
                            default:
                              if
                              (
                                (
                                  path_to_node_map[node].type.ToLower() == "textarea" ||
                                  path_to_node_map[node].type.ToLower() == "string"
                                )
                                &&
                                val.ToString().Length > max_qualitative_length
                              )
                              {
                                WriteQualitativeData
                                (
                                  mmria_case_id,
                                  node,
                                  val,
                                  i,
                                  -1
                                );
                                val = over_limit_message;
                              }




                              grid_row[file_field_name] = val;
                              break;
                          }
                        }
                        else
                        {

                          if (path_to_node_map[node].type.ToLower() == "list")
                          {
                            if
                            (
                              path_to_node_map[node].data_type != null &&
                              path_to_node_map[node].data_type.ToLower() == "string"

                            )
                            {
                              grid_row[file_field_name] = "";
                            }
                            else
                            {
                              grid_row[file_field_name] = "9999";
                            }
                          }
                        }
                      }
                      catch (Exception ex)
                      {

                      }
                    }
                  }
                  path_to_csv_writer[grid_name].Table.Rows.Add(grid_row);
                }
            }
          }
          // flat grid - end


          // multiform - start
          foreach (KeyValuePair<string, string> kvp in path_to_multi_form_map)
          {
            HashSet<string> form_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (KeyValuePair<string, mmria.common.metadata.node> ptgm in path_to_node_map.Where(x => x.Key.StartsWith(kvp.Key) && x.Key != kvp.Key))
            {
              form_field_set.Add(ptgm.Key);
            }


            foreach (KeyValuePair<string, string> ptgm in path_to_grid_map)
            {
              form_field_set.RemoveWhere(x => x.StartsWith(ptgm.Key, StringComparison.InvariantCultureIgnoreCase));

            }



            create_header_row
            (
              path_to_int_map,
              form_field_set,
              path_to_node_map,
              path_to_csv_writer[kvp.Value].Table,
              true,
              true,
              false
            );

            dynamic form_raw_data = get_value(case_doc as IDictionary<string, object>, kvp.Key);
            List<object> form_object_data = form_raw_data as List<object>;

            if (form_object_data != null)
              for (int i = 0; i < form_object_data.Count; i++)
              {
                //IDictionary<string, object> form_item_row = form_object_data[i] as IDictionary<string, object>;

                System.Data.DataRow form_row = path_to_csv_writer[kvp.Value].Table.NewRow();
                form_row["_id"] = mmria_case_id;
                form_row["_record_index"] = i;

                foreach (string path in form_field_set)
                {
                  if (
                    path_to_node_map[path].type.ToLower() == "app" ||
                    path_to_node_map[path].type.ToLower() == "form" ||
                    path_to_node_map[path].type.ToLower() == "group" ||
                    path_to_node_map[path].type.ToLower() == "grid" ||
                    path_to_node_map[path].type.ToLower() == "button" ||
                    path_to_node_map[path].type.ToLower() == "chart" ||
                    path_to_node_map[path].type.ToLower() == "label" ||
                    path_to_node_map[path].mirror_reference != null

                  )
                  {
                    continue;
                  }

                  string[] temp_path = path.Split('/');
                  List<string> form_path_list = new List<string>();
                  for (int temp_path_index = 0; temp_path_index < temp_path.Length; temp_path_index++)
                  {
                    form_path_list.Add(temp_path[temp_path_index]);
                    if (temp_path_index == 0)
                    {
                      form_path_list.Add(i.ToString());
                    }

                  }

                  dynamic val = get_value(case_doc as IDictionary<string, object>, string.Join("/", form_path_list));

                  switch (path_to_node_map[path].type.ToLower())
                  {

                    case "number":
                      if (val != null)
                      {
                        var test_value_string = val.ToString();
                        if (!string.IsNullOrWhiteSpace(test_value_string))
                        {
                          double test_double = 0.0;
                          if (double.TryParse(test_value_string, out test_double))
                          {
                            string file_field_name = path_to_field_name_map[path];
                            form_row[file_field_name] = test_double;
                          }
                          else
                          {

                          }
                        }
                        else
                        {

                        }
                      }
                      break;
                    case "list":

                      if
                        (path_to_node_map[path].is_multiselect != null &&
                      path_to_node_map[path].is_multiselect == true

                      )
                      {

                        IList<object> temp = val as IList<object>;
                        if (temp != null && temp.Count > 0)
                        {
                          List<string> temp2 = new List<string>();
                          foreach (var item in temp)
                          {
                            var key = "/" + path;
                            var item_key = item.ToString();
                            if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                            {
                              temp2.Add(List_Look_Up["/" + path][item.ToString()]);
                            }
                            else
                            {
                              temp2.Add(item.ToString());
                            }
                          }

                          //Check if list can be sorted and list lookup has key
                          if (temp2?.Count > 1 && List_Look_Up.ContainsKey("/" + path))
                          {
                              //Get list lookup
                              var look_up_list = List_Look_Up["/" + path];
                          
                              //Set sorted list back to the value to contiune regular flow
                              temp2 = SortListAgainstDictionary(temp2, look_up_list);
                          }
                          
                          string file_field_name = path_to_field_name_map[path];
                          form_row[file_field_name] = string.Join("|", temp2);

                        }
                        else
                        {
                            string file_field_name = path_to_field_name_map[path];
                            form_row[file_field_name] = "(blank)";
                        }
                      }
                      else
                      {
                        string file_field_name = path_to_field_name_map[path];
                        if (val != null)
                        {
                          if
                          (
                            (
                              path_to_node_map[path].data_type != null &&
                              path_to_node_map[path].data_type.ToLower() == "number"

                            )
                          )
                          {
                            if (val.ToString() == "")
                            {
                              form_row[file_field_name] = "9999";
                            }
                            else
                            {
                              form_row[file_field_name] = val;
                            }

                          }
                          else if
                          (
                            path_to_node_map[path].data_type != null &&
                            path_to_node_map[path].data_type.ToLower() == "string" &&
                            (
                              val.ToString() == "9999" ||
                              val.ToString() == "8888" ||
                              val.ToString() == "7777"
                            )
                          )
                          {

                            if (val == "9999")
                            {
                              form_row[file_field_name] = "";
                            }

                            if (val == "8888")
                            {
                              form_row[file_field_name] = "Not specified";
                            }

                            if (val == "7777")
                            {
                              form_row[file_field_name] = "Unknown";
                            }

                          }
                          else
                          {
                            if (val.ToString() == "" || val.ToString() == "9999")
                            {
                              if
                              (
                                path_to_node_map[path].data_type != null &&
                                path_to_node_map[path].data_type.ToLower() == "string"
                              )
                              {
                                form_row[file_field_name] = "";
                              }
                              else
                              {
                                form_row[file_field_name] = "9999";
                              }

                              //form_row[file_field_name]  = "9999";
                            }
                            else
                            {
                              form_row[file_field_name] = val;
                            }

                          }

                        }
                        else
                        {
                          if
                          (
                            path_to_node_map[path].data_type != null &&
                            path_to_node_map[path].data_type.ToLower() == "string"

                          )
                          {
                            form_row[file_field_name] = "";
                          }
                          else
                          {
                            form_row[file_field_name] = "9999";
                          }
                        }
                      }

                      break;
                    default:
                      if (val != null)
                      {
                        string file_field_name = path_to_field_name_map[path];

                        if
                        (
                          (
                            path_to_node_map[path].type.ToLower() == "textarea" ||
                            path_to_node_map[path].type.ToLower() == "string"
                          ) &&
                          val.ToString().Length > max_qualitative_length
                        )
                        {
                          WriteQualitativeData
                          (
                            mmria_case_id,
                            path,
                            val,
                            i,
                            -1
                          );

                          val = over_limit_message;
                        }

                        form_row[file_field_name] = val;

                      }
                      break;

                  }

                }

                HashSet<string> multifom_grid_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (KeyValuePair<string, string> gtmfm in grid_to_multi_form_map)
                {
                  if (gtmfm.Value == kvp.Key)
                  {
                    multifom_grid_set.Add(gtmfm.Key);
                  }
                }

                process_multiform_grid
                (
                  case_doc,
                  mmria_case_id,
                  i,
                  path_to_int_map,
                  path_to_node_map,
                  path_to_grid_map,
                  path_to_csv_writer,
                  multifom_grid_set
              );


                path_to_csv_writer[kvp.Value].Table.Rows.Add(form_row);
              }
          }

          // multiform - end

        }


        Dictionary<string, string> int_to_path_map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);


        foreach (KeyValuePair<string, int> ptn in path_to_int_map)
        {
          if (path_to_field_name_map.ContainsKey(ptn.Key))
          {
            string key = path_to_field_name_map[ptn.Key];
            if (int_to_path_map.ContainsKey(key))
            {
              int_to_path_map.Add("_" + ptn.Value.ToString("X"), ptn.Key);
            }
            else
            {
              int_to_path_map.Add(key, ptn.Key);
            }
          }
        }


        WriteCSV mapping_document = new WriteCSV("data-dictionary.csv", this.item_directory_name, Configuration.export_directory);
        System.Data.DataColumn column = null;


        column = new System.Data.DataColumn("metadata_version", typeof(string));
        column.DefaultValue = metadata.version;
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("file_name", typeof(string));
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("deidentified", typeof(string));
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("column_name", typeof(string));
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("mmria_path", typeof(string));
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("mmria_prompt", typeof(string));
        mapping_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("field_description", typeof(string));
        mapping_document.Table.Columns.Add(column);


        foreach (KeyValuePair<string, WriteCSV> kvp in path_to_csv_writer)
        {


          foreach (System.Data.DataColumn table_column in kvp.Value.Table.Columns)
          {
            System.Data.DataRow mapping_row = mapping_document.Table.NewRow();
            mapping_row["file_name"] = kvp.Key;

            if (int_to_path_map.ContainsKey(table_column.ColumnName))
            {
              string deidentified = "no";
              string path = int_to_path_map[table_column.ColumnName];
              string selection = queue_item.de_identified_selection_type;
              if (selection == "custom" || selection == "standard")
              {
                if (de_identified_set.Contains(path))
                {
                  deidentified = "yes";
                }
              }
              mapping_row["deidentified"] = deidentified;
              mapping_row["mmria_path"] = path;
              mapping_row["mmria_prompt"] = path_to_node_map[path].prompt;
              mapping_row["field_description"] = path_to_node_map[path].description;
            }
            else
            {
              mapping_row["deidentified"] = "no";
              switch (table_column.ColumnName)
              {
                case "_record_index":
                case "_parent_index":
                default:
                  mapping_row["mmria_path"] = table_column.ColumnName;
                  break;
              }
            }

            mapping_row["column_name"] = table_column.ColumnName;


            mapping_document.Table.Rows.Add(mapping_row);
          }



          kvp.Value.WriteToStream();
        }

        mapping_document.WriteToStream();

        for (int i_index = 0; i_index < this.qualitativeStreamWriter.Length; i_index++)
        {
          this.qualitativeStreamWriter[i_index].Flush();
          this.qualitativeStreamWriter[i_index].Close();
          this.qualitativeStreamWriter[i_index] = null;
        }


        WriteCSV mapping_look_up_document = new WriteCSV("data-dictionary-lookup.csv", this.item_directory_name, Configuration.export_directory);
        column = null;


        column = new System.Data.DataColumn("metadata_version", typeof(string));
        column.DefaultValue = metadata.version;
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("file_name", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("column_name", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("mmria_path", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("mmria_prompt", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("field_description", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("item_value", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);


        column = new System.Data.DataColumn("item_display", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);

        column = new System.Data.DataColumn("item_description", typeof(string));
        mapping_look_up_document.Table.Columns.Add(column);




        foreach (KeyValuePair<string, mmria.common.metadata.node> kvp in path_to_node_map)
        {
          var node = kvp.Value;


          if (node.type.ToLower() == "list")
          {

            try
            {



              //List_Look_Up
              var value_list = node.values;

              if (!string.IsNullOrWhiteSpace(node.path_reference))
              {
                //var key = node.path_reference.Replace("lookup/", "");
                var key = "/" + kvp.Key;

                if (List_Look_Up.ContainsKey(key))
                {
                  foreach (var item in List_Look_Up[key])
                  {
                    System.Data.DataRow row = mapping_look_up_document.Table.NewRow();

                    if (path_to_file_name_map.ContainsKey(kvp.Key))
                    {
                      row["file_name"] = path_to_file_name_map[kvp.Key];
                    }

                    if (path_to_field_name_map.ContainsKey(kvp.Key))
                    {
                      row["column_name"] = path_to_field_name_map[kvp.Key];
                    }

                    row["mmria_path"] = kvp.Key;
                    row["mmria_prompt"] = node.prompt;
                    row["field_description"] = node.description;
                    row["item_value"] = item.Key;
                    row["item_display"] = item.Value;
                    //row["item_description"] = item.description;
                    mapping_look_up_document.Table.Rows.Add(row);
                  }
                }

              }
              else
              {
                foreach (var item in value_list)
                {
                  System.Data.DataRow row = mapping_look_up_document.Table.NewRow();

                  if (path_to_file_name_map.ContainsKey(kvp.Key))
                  {
                    row["file_name"] = path_to_file_name_map[kvp.Key];
                  }

                  if (path_to_field_name_map.ContainsKey(kvp.Key))
                  {
                    row["column_name"] = path_to_field_name_map[kvp.Key];
                  }
                  row["mmria_path"] = kvp.Key;
                  row["mmria_prompt"] = node.prompt;
                  row["field_description"] = node.description;
                  row["item_value"] = item.value;
                  row["item_display"] = item.display;
                  row["item_description"] = item.description;


                  mapping_look_up_document.Table.Rows.Add(row);
                }
              }


            }
            catch (Exception ex)
            {
              System.Console.WriteLine(ex);
            }
          }
        }

        mapping_look_up_document.WriteToStream();


        mmria.server.util.cFolderCompressor folder_compressor = new mmria.server.util.cFolderCompressor();


        string encryption_key = null;

        if (!string.IsNullOrWhiteSpace(queue_item.zip_key))
        {
          encryption_key = queue_item.zip_key;
        }

        folder_compressor.Compress
        (
          System.IO.Path.Combine(Configuration.export_directory, this.item_file_name),
          encryption_key,// string password 
          System.IO.Path.Combine(Configuration.export_directory, this.item_directory_name)
        );


        var get_item_curl = new cURL("GET", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/" + this.item_id, null, this.user_name, this.value_string);
        string responseFromServer = get_item_curl.execute();
        export_queue_item export_queue_item = Newtonsoft.Json.JsonConvert.DeserializeObject<export_queue_item>(responseFromServer);

        export_queue_item.status = "Download";


        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(export_queue_item, settings);
        var set_item_curl = new cURL("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/" + export_queue_item._id, object_string, this.user_name, this.value_string);
        responseFromServer = set_item_curl.execute();


        Console.WriteLine("{0} Export Finished", System.DateTime.Now);



        return true;

      }
      catch (Exception ex)
      {

        var get_item_curl = new cURL("GET", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/" + this.item_id, null, this.user_name, this.value_string);
        string responseFromServer = get_item_curl.execute();
        export_queue_item export_queue_item = Newtonsoft.Json.JsonConvert.DeserializeObject<export_queue_item>(responseFromServer);

        export_queue_item.status = "Queue Failed:" + ex.ToString();

        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        string object_string = Newtonsoft.Json.JsonConvert.SerializeObject(export_queue_item, settings);
        var set_item_curl = new cURL("PUT", null, Program.config_couchdb_url + $"/{Program.db_prefix}export_queue/" + export_queue_item._id, object_string, this.user_name, this.value_string);
        responseFromServer = set_item_curl.execute();


        return false;
      }
    }

        private List<string> SortListAgainstDictionary(List<string> temp2, Dictionary<string, string> look_up_list)
        {
            var result = new List<string>();
            var itemsNotInDictionary = new List<string>();

            if (temp2 != null)
            {
                foreach (var item in look_up_list)
                {
                    if (temp2.Contains(item.Value))
                    {
                        if(item.Key == "9999")
                        {
                            if (look_up_list.Count == 1) result.Add(item.Value);
                        }
                        else
                        {
                            result.Add(item.Value);
                        }

                        
                    }
                }

                itemsNotInDictionary = temp2?.Except(result)?.ToList();

                if (itemsNotInDictionary != null && itemsNotInDictionary.Count > 0)
                    result.AddRange(itemsNotInDictionary);

            }
            return result;
        }

        private void Get_List_Look_Up
    (
      System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> p_result,
      mmria.common.metadata.node[] p_lookup,
      mmria.common.metadata.node p_metadata,
      Dictionary<string, int> p_path_to_int_map,
      string p_path
    )
    {
      switch (p_metadata.type.ToLower())
      {
        case "form":
        case "group":
        case "grid":
          foreach (mmria.common.metadata.node node in p_metadata.children)
          {
            Get_List_Look_Up(p_result, p_lookup, node, p_path_to_int_map, p_path + "/" + node.name.ToLower());
          }
          break;
        case "list":
          if
          (
            p_metadata.control_style != null &&
            p_metadata.control_style.ToLower() == "editable"
          )
          {
            break;
          }

          p_result.Add(p_path, new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));

          var value_node_list = p_metadata.values;
          if
          (
            !string.IsNullOrWhiteSpace(p_metadata.path_reference)
          )
          {
            var name = p_metadata.path_reference.Replace("lookup/", "");
            foreach (var item in p_lookup)
            {
              if (item.name.ToLower() == name.ToLower())
              {
                value_node_list = item.values;
                break;
              }
            }
          }

          foreach (var value in value_node_list)
          {
            p_result[p_path].Add(value.value, value.display);
          }

          //p_result[file_name].Add(p_path, field_name);

          break;
        default:
          break;
      }
    }


    private void process_multiform_grid
    (
       IDictionary<string, object> case_doc,
      string mmria_case_id,
      int parent_record_index,
      Dictionary<string, int> path_to_int_map,
      Dictionary<string, mmria.common.metadata.node> path_to_node_map,
      Dictionary<string, string> path_to_grid_map,
      Dictionary<string, WriteCSV> path_to_csv_writer,
      HashSet<string> flat_grid_set
    )
    {

      foreach (KeyValuePair<string, string> ptn in path_to_grid_map)
      {
        string path = ptn.Key;
        if (flat_grid_set.Contains(path))
        {
            string grid_name = path_to_grid_map[path];

            HashSet<string> grid_field_set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (KeyValuePair<string, mmria.common.metadata.node> ptgm in path_to_node_map.Where(x => x.Key.StartsWith(path) && x.Key != path))
            {
            grid_field_set.Add(ptgm.Key);
            }

            create_header_row
            (
            path_to_int_map,
            grid_field_set,
            path_to_node_map,
            path_to_csv_writer[grid_name].Table,
            true,
            true,
            true
            );


            dynamic raw_data = get_multiform_grid(case_doc as IDictionary<string, object>, string.Join("/", path), true);
            List<object> raw_data_list = raw_data as List<object>;
            if(raw_data_list== null) return;
            if(parent_record_index > raw_data_list.Count) return;

            List<object> grid_raw_data = raw_data[parent_record_index] as List<object>;

            if (grid_raw_data == null) return;

            for (int i = 0; i < grid_raw_data.Count; i++)
            {
              IDictionary<string, object> grid_item_row = grid_raw_data[i] as IDictionary<string, object>;

              if (grid_item_row == null)
              {
                continue;
              }

              System.Data.DataRow grid_row = path_to_csv_writer[grid_name].Table.NewRow();
              grid_row["_id"] = mmria_case_id;
              grid_row["_record_index"] = i;
              grid_row["_parent_record_index"] = parent_record_index;
              foreach (KeyValuePair<string, string> kvp in path_to_grid_map.Where(k => k.Value == grid_name))
              {
                foreach (string field_node in grid_field_set)
                {
                  try
                  {

                    var key_name = field_node.Substring(field_node.LastIndexOf("/") + 1, field_node.Length - field_node.LastIndexOf("/") - 1);

                    //dynamic value_list = grid_item_row[path_to_node_map[kvp.Key].name];
                    object grid_item_value = grid_item_row[key_name];



                    if (de_identified_set.Contains(field_node))
                    {
                      grid_item_value = null;
                    }

                    string file_field_name = path_to_field_name_map[field_node];
                    if (grid_item_value != null)
                    {


                      if (path_to_node_map[field_node].type.ToLower() == "number" && !string.IsNullOrWhiteSpace(grid_item_value.ToString()))
                      {
                        grid_row[file_field_name] = grid_item_value;
                      }
                      else if (path_to_node_map[field_node].type.ToLower() == "list")
                      {
                        if
                        (
                          (
                            path_to_node_map[field_node].is_multiselect != null &&
                            path_to_node_map[field_node].is_multiselect == true
                          ) ||
                          grid_item_value is List<object>
                        )
                        {
                          List<object> temp = grid_item_value as List<object>;
                          if (temp != null && temp.Count > i)
                          {
                            var temp_grid_row = temp[i];
                            var item_dictionary_key = path_to_field_name_map[field_node];
                            IDictionary<string, object> item_dictionary = temp[i] as IDictionary<string, object>;
                            if (item_dictionary != null && item_dictionary.ContainsKey(item_dictionary_key))
                            {
                              var temp2 = item_dictionary[item_dictionary_key] as List<object>;
                              grid_row[file_field_name] = string.Join("|", temp2);
                            }
                          }
                          if
                            (
                              path_to_node_map[field_node].data_type != null &&
                              path_to_node_map[field_node].data_type.ToLower() == "string" &&
                              (
                                grid_item_value == "9999" ||
                                grid_item_value == "8888" ||
                                grid_item_value == "7777"
                              )
                            )
                          {

                            if (grid_item_value == "9999")
                            {
                              grid_row[file_field_name] = "";
                            }

                            if (grid_item_value == "8888")
                            {
                              grid_row[file_field_name] = "Not specified";
                            }

                            if (grid_item_value == "7777")
                            {
                              grid_row[file_field_name] = "Unknown";
                            }

                          }
                          else
                          {
                            if (grid_item_value == "")
                            {

                              if
                              (
                                path_to_node_map[field_node].data_type != null &&
                                path_to_node_map[field_node].data_type.ToLower() == "string"
                              )
                              {
                                grid_row[file_field_name] = "";
                              }
                              else
                              {
                                grid_row[file_field_name] = "9999";
                              }
                              grid_row[file_field_name] = "9999";
                            }
                            else
                            {
                              grid_row[file_field_name] = grid_item_value;
                            }

                          }
                        }
                        else
                        {

                          if (grid_item_value != null)
                          {
                            if (grid_item_value is List<object>)
                            {
                              List<object> temp = grid_item_value as List<object>;
                              if (temp != null && temp.Count > 0)
                              {
                                List<string> temp2 = new List<string>();
                                foreach (var item in temp)
                                {
                                  var key = "/" + field_node;
                                  var item_key = item.ToString();
                                  if (List_Look_Up.ContainsKey(key) && List_Look_Up[key].ContainsKey(item_key))
                                  {
                                    temp2.Add(List_Look_Up["/" + field_node][item.ToString()]);
                                  }
                                  else
                                  {
                                    temp2.Add(item.ToString());
                                  }
                                }


                                grid_row[file_field_name] = string.Join("|", temp2);

                              }
                              else
                              {
                                  grid_row[file_field_name] = "(blank)";
                              }
                            }
                            else
                            {
                              if (grid_item_value == "")
                              {

                                if
                                (
                                  path_to_node_map[field_node].data_type != null &&
                                  path_to_node_map[field_node].data_type.ToLower() == "string"
                                )
                                {
                                  grid_row[file_field_name] = "";
                                }
                                else
                                {
                                  grid_row[file_field_name] = "9999";
                                }
                                grid_row[file_field_name] = "9999";
                              }
                              else
                              {
                                grid_row[file_field_name] = grid_item_value;
                              }

                            }
                          }
                          else
                          {
                            if
                            (
                              path_to_node_map[field_node].data_type != null &&
                              path_to_node_map[field_node].data_type.ToLower() == "string"

                            )
                            {
                              grid_row[file_field_name] = "";
                            }
                            else
                            {
                              grid_row[file_field_name] = "9999";
                            }
                          }
                        }

                      }
                      else
                      {
                        if
                        (
                          (
                            path_to_node_map[field_node].type.ToLower() == "textarea" ||
                            path_to_node_map[field_node].type.ToLower() == "string"
                          ) &&
                          grid_item_value.ToString().Length > max_qualitative_length
                        )
                        {
                          WriteQualitativeData
                          (
                            mmria_case_id,
                            field_node,
                            grid_item_value?.ToString(),
                            i,
                            parent_record_index
                          );
                          grid_item_value = over_limit_message;
                        }


                        switch (grid_item_value)
                        {

                          case System.DateTime val:
                            grid_row[file_field_name] = val.ToString("o");
                            break;
                          case System.String val:
                            if (!string.IsNullOrWhiteSpace(val))
                            {
                              grid_row[file_field_name] = val;
                            }
                            break;
                          case System.Double val:
                          default:
                            if (!string.IsNullOrWhiteSpace(grid_item_value?.ToString()))
                            {
                              grid_row[file_field_name] = grid_item_value;
                            }
                            break;
                        }
                      }
                    }
                    else
                    {
                      if (path_to_node_map[field_node].type.ToLower() == "list")
                      {
                        if
                        (
                          path_to_node_map[field_node].data_type != null &&
                          path_to_node_map[field_node].data_type.ToLower() == "string"

                        )
                        {
                          grid_row[file_field_name] = "";
                        }
                        else
                        {
                          grid_row[file_field_name] = "9999";
                        }
                      }
                    }
                  }
                  catch (Exception ex)
                  {

                  }
                }
              }
              path_to_csv_writer[grid_name].Table.Rows.Add(grid_row);
            }
        }
      }

    }


    private void create_header_row
    (
      System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
      System.Collections.Generic.HashSet<string> p_path_to_csv_set,
      System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
      System.Data.DataTable p_Table,
      bool p_add_id,
      bool p_add_record_index,
      bool p_add_parent_record_index
    )
    {
      if (p_Table.Columns.Count > 0)
      {
        return;
      }

      System.Data.DataColumn column = null;
      // create header row
      if (p_add_id)
      {
        column = new System.Data.DataColumn("_id", typeof(string));
        p_Table.Columns.Add(column);
      }

      if (p_add_record_index)
      {
        column = new System.Data.DataColumn("_record_index", typeof(long));
        p_Table.Columns.Add(column);
      }

      if (p_add_parent_record_index)
      {
        column = new System.Data.DataColumn("_parent_record_index", typeof(long));
        p_Table.Columns.Add(column);
      }


      foreach (string path in p_path_to_csv_set)
      {
        string file_field_name = convert_path_to_field_name(path, p_path_to_int_map);

        switch (p_path_to_node_map[path].type.ToLower())
        {
          case "app":
          case "form":
          case "group":
          case "grid":
          case "button":
          case "chart":
          case "label":
            continue;
          case "number":

            if (p_path_to_node_map[path].mirror_reference == null)
            {
              column = new System.Data.DataColumn(file_field_name, typeof(double));
            }
            else
            {
              continue;
            }
            break;
          default:
            if (p_path_to_node_map[path].mirror_reference == null)
            {
              column = new System.Data.DataColumn(file_field_name, typeof(string));
            }
            else
            {
              continue;
            }
            break;

        }

        try
        {
          p_Table.Columns.Add(column);
        }
        catch (Exception ex)
        {
          column.ColumnName = $"{file_field_name}_{p_path_to_int_map[path].ToString()}";
          p_Table.Columns.Add(column);
        }

      }
    }


    private void generate_path_map
    (

      mmria.common.metadata.app p_metadata, string p_path,
      string p_file_name,
      string p_form_path,
      System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
      System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_grid_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_multi_form_map,
      bool p_is_multiform_context,
      System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
      bool p_is_grid_context,
      System.Collections.Generic.HashSet<string> p_path_to_flat_map

    )
    {
      p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);



      if (p_metadata.children != null)
      {
        IList<mmria.common.metadata.node> children = p_metadata.children as IList<mmria.common.metadata.node>;

        if (children != null)
          for (var i = 0; i < children.Count; i++)
          {
            var child = children[i];

            generate_path_map(child, child.name, p_file_name, p_form_path, p_path_to_int_map, p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, false, p_multi_form_to_grid_map, false, p_path_to_flat_map);
          }
      }
    }


    private string create_field_name_from_path(string p_path, System.Data.DataTable p_DT)
    {

      return null;
    }

    private string convert_path_to_field_name(string p_path, Dictionary<string, int> p_path_to_int_map)
    {
      string result_value = null;
      //		/birth_certificate_infant_fetal_section / causes_of_death
      // /birth_certificate_infant_fetal_section
      bool is_added_item = false;
      int form_prefix = 0;
      int field_prefix = 0;

      System.Text.StringBuilder result = new System.Text.StringBuilder();
      string[] temp = p_path.Split('/');

      for (int i = 0; i < temp.Length; i++)
      {
        string[] temp2 = temp[i].Split('_');
        for (int j = 0; j < temp2.Length; j++)
        {
          if (i == 0 && form_prefix < 3 && i != temp.Length - 1)
          {
            if (!string.IsNullOrWhiteSpace(temp2[j]))
            {
              result.Append(temp2[j][0]);
              is_added_item = true;
            }
            form_prefix++;
          }
          else if (i == temp.Length - 1)
          {
            if (j == 0 && result.Length != 0 && j < temp2.Length - 1)
            {
              result.Append("_");
              if (!string.IsNullOrWhiteSpace(temp2[j]))
              {
                result.Append(temp2[j][0]);
                is_added_item = true;
              }
            }
            else if (j < temp2.Length - 1)
            {
              if (!string.IsNullOrWhiteSpace(temp2[j]))
              {
                result.Append(temp2[j][0]);
                is_added_item = true;
              }
            }
            else
            {
              result.Append("_");
              if (temp2[j].Length > 5)
              {
                result.Append(temp2[j].Substring(0, 5));
              }
              else
              {
                result.Append(temp2[j]);
              }

              /*
							result_value = result.ToString();
							if(path_to_field_name_map.ContainsKey(p_path))
							{
								path_to_field_name_map.Add(p_path, result_value + "_" + p_path_to_int_map[p_path]);
								//path_to_field_name_map[p_path] = result_value;
							}
							else
							{
								path_to_field_name_map.Add(p_path, result_value);
							}
							*/
            }



          }
          else if (!string.IsNullOrWhiteSpace(temp2[j]))
          {
            result.Append(temp2[j][0]);
            is_added_item = true;
          }
        }
      }

      result_value = result.ToString();
      var test_result = get_sass_name(this.current_metadata, "/" + p_path, "");
      if (test_result != null)
      {
        result_value = test_result;
      }

      if (path_to_field_name_map.ContainsValue(result_value))
      {
        //path_to_field_name_map[p_path] = result_value;
        result_value = result_value + "_" + p_path_to_int_map[p_path];
        //path_to_field_name_map.Add(p_path, result_value + "_" + p_path_to_int_map[p_path]);
      }

      path_to_field_name_map.Add(p_path, result_value);
      return result_value;
    }


    private string get_sass_name(mmria.common.metadata.app p_metadata, string p_search_path, string p_path)
    {
      string result = null;
      for (var i = 0; i < p_metadata.children.Length; i++)
      {
        var child = p_metadata.children[i];
        result = get_sass_name(child, p_search_path, p_path + "/" + child.name);
        if (result != null)
        {
          break;
        }
      }

      return result;
    }
    private string get_sass_name(mmria.common.metadata.node p_metadata, string p_search_path, string p_path)
    {
      string result = null;
      switch (p_metadata.type.ToLower())
      {
        case "app":
        case "form":
        case "group":
        case "grid":
          for (var i = 0; i < p_metadata.children.Length; i++)
          {
            var child = p_metadata.children[i];
            result = get_sass_name(child, p_search_path, p_path + "/" + child.name);
            if (result != null)
            {
              break;
            }
          }
          break;
        default:
          if
          (
            p_metadata.sass_export_name != null &&
            p_metadata.sass_export_name != "" &&
            p_search_path == p_path
          )
          {
            result = p_metadata.sass_export_name;
          }
          break;
      }
      return result;

    }

    private void generate_path_map
    (
      mmria.common.metadata.node p_metadata,
      string p_path,
      string p_file_name,
      string p_form_path,
      System.Collections.Generic.Dictionary<string, int> p_path_to_int_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
      System.Collections.Generic.Dictionary<string, mmria.common.metadata.node> p_path_to_node_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_grid_map,
      System.Collections.Generic.Dictionary<string, string> p_path_to_multi_form_map,
      bool p_is_multiform_context,
      System.Collections.Generic.Dictionary<string, string> p_multi_form_to_grid_map,
      bool p_is_grid_context,
      System.Collections.Generic.HashSet<string> p_path_to_flat_map
    )
    {

      /*
			if (p_path == "death_certificate/causes_of_death")
			{
				System.Console.Write("break");
			}*/

      bool is_flat_map = true;
      bool is_grid = false;
      bool is_multiform = false;

      string file_name = p_file_name;
      string form_path = p_form_path;

      p_path_to_int_map.Add(p_path, p_path_to_int_map.Count);
      p_path_to_node_map.Add(p_path, p_metadata);



      if (p_metadata.type.ToLower() == "grid")
      {
        is_flat_map = false;
        is_grid = true;
        /*
				if (p_is_multiform_context)
				{
				}
				else
				{*/

        file_name = this.convert_path_to_file_name(p_path);

        p_path_to_grid_map.Add(p_path, file_name);

        if (p_is_multiform_context)
        {
          p_multi_form_to_grid_map.Add(p_path, form_path);
        }
        //}

      }
      else
      {
        is_grid = p_is_grid_context;
      }

      if (p_metadata.type.ToLower() == "form" && (p_metadata.cardinality == "*" || p_metadata.cardinality == "+"))
      {

        is_flat_map = false;
        file_name = this.convert_path_to_file_name(p_path);
        form_path = p_path;
        is_multiform = true;
        p_path_to_multi_form_map.Add(p_path, file_name);
      }
      else
      {
        is_multiform = p_is_multiform_context;
      }

      if (is_flat_map && !(is_multiform || is_grid || p_is_grid_context || p_is_multiform_context))
      {
        p_path_to_flat_map.Add(p_path);
      }

      p_path_to_file_name_map.Add(p_path, file_name);

      if (p_metadata.children != null)
      {
        IList<mmria.common.metadata.node> children = p_metadata.children as IList<mmria.common.metadata.node>;
        if (children != null)
          for (var i = 0; i < children.Count; i++)
          {
            var child = children[i];

            generate_path_map(child, p_path + "/" + child.name, file_name, form_path, p_path_to_int_map, p_path_to_file_name_map, p_path_to_node_map, p_path_to_grid_map, p_path_to_multi_form_map, is_multiform, p_multi_form_to_grid_map, is_grid, p_path_to_flat_map);
          }
      }
    }

    private string convert_path_to_file_name(string p_path)
    {
      //		/birth_certificate_infant_fetal_section / causes_of_death
      // /birth_certificate_infant_fetal_section
      bool is_added_item = false;

      System.Text.StringBuilder result = new System.Text.StringBuilder();
      string[] temp = p_path.Split('/');
      for (int i = 0; i < temp.Length - 1; i++)
      {
        string[] temp2 = temp[i].Split('_');
        for (int j = 0; j < temp2.Length; j++)
        {
          if (!string.IsNullOrWhiteSpace(temp2[j]))
          {
            result.Append(temp2[j][0]);
            is_added_item = true;
          }
        }
      }

      if (is_added_item)
      {
        result.Append("_");
      }
      result.Append(temp[temp.Length - 1]);
      //result.Append(".csv");

      string value = result.ToString();
      if (value.Length > 32)
      {
        value = value.Substring(value.Length - 32, 32);
      }

      return value + ".csv";
    }


    private void process_case_row
    (
      System.Collections.Generic.Dictionary<string, string> p_path_to_file_name_map,
      System.Collections.Generic.Dictionary<string, WriteCSV> p_path_to_csv_writer,
      System.Dynamic.ExpandoObject case_row, string p_path)
    {
      foreach (KeyValuePair<string, object> kvp in case_row)
      {
        if (kvp.Value is IList<object>)
        {
        }
        else if (kvp.Value is IDictionary<string, object>)
        {

        }
        else
        {
          //string val = this.get_value(
        }
      }
    }

    public dynamic get_value(IDictionary<string, object> p_object, string p_path, bool p_is_grid = false)
    {
      dynamic result = null;
      /*
			foreach (KeyValuePair<string, object> kvp in p_object)
			{
				System.Console.WriteLine(kvp.Key);
			}


			if(p_path == "death_certificate/address_of_death/estimated_death_distance_from_residence")
			{
				System.Console.WriteLine(p_path);
			}
			*/
      if (de_identified_set.Contains(p_path))
      {
        return result;
      }

      try
      {
        string[] path = p_path.Split('/');

        System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

        //IDictionary<string, object> index = p_object;
        dynamic index = p_object;


        for (int i = 0; i < path.Length; i++)
        {
          if (i == path.Length - 1)
          {
            if (index != null && index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
            {
              result = ((IDictionary<string, object>)index)[path[i]];
            }
            else if (p_is_grid)
            {
              result = index;
            }
            else
            {
              //result = index;
            }

          }
          else if (number_regex.IsMatch(path[i]))
          {
            int temp_index = int.Parse(path[i]);
            IList<object> temp_list = index as IList<object>;

            if
            (
              temp_list != null &&
              (temp_list.Count > temp_index)
            )
            {
              index = temp_list[temp_index] as IDictionary<string, object>;
            }

          }
          else if (index != null && index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
          {

            switch (((IDictionary<string, object>)index)[path[i]])
            {
              case IList<object> val:
                index = val;
                break;
              case IDictionary<string, object> val:
                index = val;
                break;
              default:
                System.Console.WriteLine("check this");
                //index = value_string;
                break;
            }
            /*
                        if (((IDictionary<string, object>)index)[path[i]] is IList<object>)
                        {
                          index = ((IDictionary<string, object>)index)[path[i]] as IList<object>;
                        }
                        else if (((IDictionary<string, object>)index)[path[i]]is IDictionary<string, object>)
                        {
                          index = ((IDictionary<string, object>)index)[path[i]] as IDictionary<string, object>;
                        }
             */
          }
          else
          {
            //System.Console.WriteLine("This should not happen. {0}", p_path);
          }
        }
      }
      catch (Exception ex)
      {
        //System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
      }

      return result;

    }


    public List<object> get_multiform_grid(IDictionary<string, object> p_object, string p_path, bool p_is_grid = false)
    {
      List<object> result = new List<object>();

      if (de_identified_set.Contains(p_path))
      {
        return result;
      }

      try
      {
        string[] path = p_path.Split('/');

        System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

        //IDictionary<string, object> index = p_object;


        List<object> multiform = p_object[path[0]] as List<object>;

        if (multiform != null)
        {
          for (int form_index = 0; form_index < multiform.Count; form_index++)
          {
            dynamic index = multiform[form_index];

            for (int i = 1; i < path.Length; i++)
            {
              if (i == path.Length - 1)
              {
                if (index != null && index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
                {
                  result.Add(((IDictionary<string, object>)index)[path[i]]);
                }
                else if (p_is_grid)
                {
                  result.Add(index);
                }
                else
                {
                  //result = index;
                }

              }
              else if (number_regex.IsMatch(path[i]))
              {
                int temp_index = int.Parse(path[i]);
                IList<object> temp_list = index as IList<object>;

                if
                (
                  temp_list != null &&
                  (temp_list.Count > temp_index)
                )
                {
                  index = temp_list[temp_index] as IDictionary<string, object>;
                }

              }
              else if (index != null && index is IDictionary<string, object> && ((IDictionary<string, object>)index).ContainsKey(path[i]))
              {

                switch (((IDictionary<string, object>)index)[path[i]])
                {
                  case IList<object> val:
                    index = val;
                    break;
                  case IDictionary<string, object> val:
                    index = val;
                    break;
                  default:
                    index = value_string;
                    break;
                }
                /*
                            if (((IDictionary<string, object>)index)[path[i]] is IList<object>)
                            {
                              index = ((IDictionary<string, object>)index)[path[i]] as IList<object>;
                            }
                            else if (((IDictionary<string, object>)index)[path[i]]is IDictionary<string, object>)
                            {
                              index = ((IDictionary<string, object>)index)[path[i]] as IDictionary<string, object>;
                            }
                */
              }
              else
              {
                //System.Console.WriteLine("This should not happen. {0}", p_path);
              }
            }
          }
        }
      }
      catch (Exception ex)
      {
        //System.Console.WriteLine("case_maker.set_value bad mapping {0}\n {1}", p_path, ex);
      }

      return result;

    }


    private void WriteQualitativeData(string p_record_id, string p_mmria_path, string p_data, int p_index, int p_parent_index)
    {
      const string record_split = "************************************************************";
      const string header_split = "\n\n";

      int index = 0;

      switch (p_mmria_path.Trim().ToLower())
      {
        case "case_narrative/case_opening_overview":
          index = 1;
          break;
        case "informant_interviews/interview_narrative":
          index = 2;
          break;
        default:
          index = 0;
          break;
      }


      if (this.qualitativeStreamCount[index] == 0)
      {
        this.qualitativeStreamWriter[index].WriteLine($"{record_split}\nid={p_record_id}\npath={p_mmria_path}\nrecord_index={p_index}\nparent_index={p_parent_index}{header_split}\n\n{p_data}");
      }
      else
      {
        this.qualitativeStreamWriter[index].WriteLine($"\n{record_split}id={p_record_id}\npath={p_mmria_path}\nrecord_index={p_index}\nparent_index={p_parent_index}{header_split}\n\n{p_data}");
      }
      this.qualitativeStreamCount[index] += 1;
    }




  }
}
