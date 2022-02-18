using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.utils
{
	public class c_convert_to_dqr_detail
	{


		string source_json;

        string data_type = "overdose";

		private System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> List_Look_Up;

		private int blank_value = 9999;

		public c_convert_to_dqr_detail (string p_source_json, string p_type = "dqr-detail")
		{

			source_json = p_source_json;
            this.data_type = p_type;
		}

		public string execute ()
		{
			string result = null;

            var gs = new migrate.C_Get_Set_Value(new ());
			
			string metadata_url = Program.config_couchdb_url + $"/metadata/version_specification-{Program.metadata_release_version_name}/metadata";
			cURL metadata_curl = new cURL("GET", null, metadata_url, null, Program.config_timer_user_name, Program.config_timer_value);
			mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());


			List_Look_Up = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

			foreach(var child in metadata.children)
			{
				Get_List_Look_Up(List_Look_Up, metadata.lookup, child, "/" + child.name);
			}



            //migrate.C_Get_Set_Value.get_grid_value_result grid_value_result = null;
            migrate.C_Get_Set_Value.get_value_result value_result = null;
			var dqr_detail = new mmria.server.model.dqr.DQRDetail();

            dqr_detail.n01 = 0;
            dqr_detail.n02 = 0;
            dqr_detail.n03[0] = 0;
            dqr_detail.n03[1] = 0;
            dqr_detail.n03[2] = 0;
            dqr_detail.n03[3] = 0;
            dqr_detail.n03[4] = 0;
            dqr_detail.n03[5] = 0;
            dqr_detail.n03[6] = 0;
            dqr_detail.n03[7] = 0;

            dqr_detail.n04 = 0;
            dqr_detail.n05 = 0;
            dqr_detail.n06 = 0;
            dqr_detail.n07 = 0;
            dqr_detail.n08 = 0;
            dqr_detail.n09 = 0;

            dqr_detail.n10.m = 0;
            dqr_detail.n10.u = 0;

            dqr_detail.n11.m = 0;
            dqr_detail.n11.u = 0;

            dqr_detail.n12.m = 0;
            dqr_detail.n12.u = 0;
            dqr_detail.n13.m = 0;
            dqr_detail.n13.u = 0;
            dqr_detail.n14.m = 0;
            dqr_detail.n14.u = 0;
            dqr_detail.n15.m = 0;
            dqr_detail.n15.u = 0;
            dqr_detail.n16.m = 0;
            dqr_detail.n16.u = 0;
            dqr_detail.n17.m = 0;
            dqr_detail.n17.u = 0;
            dqr_detail.n18.m = 0;
            dqr_detail.n18.u = 0;
            dqr_detail.n19.m = 0;
            dqr_detail.n19.u = 0;
            
            dqr_detail.n20.m = 0;
            dqr_detail.n20.u = 0;
            dqr_detail.n21.m = 0;
            dqr_detail.n21.u = 0;
            dqr_detail.n22.m = 0;
            dqr_detail.n22.u = 0;
            dqr_detail.n23.m = 0;
            dqr_detail.n23.u = 0;
            dqr_detail.n24.m = 0;
            dqr_detail.n24.u = 0;
            dqr_detail.n25.m = 0;
            dqr_detail.n25.u = 0;
            dqr_detail.n26.m = 0;
            dqr_detail.n26.u = 0;
            dqr_detail.n27.m = 0;
            dqr_detail.n27.u = 0;
            dqr_detail.n28.m = 0;
            dqr_detail.n28.u = 0;
            dqr_detail.n29.m = 0;
            dqr_detail.n29.u = 0;
            
            dqr_detail.n30.m = 0;
            dqr_detail.n30.u = 0;
            dqr_detail.n31.m = 0;
            dqr_detail.n31.u = 0;
            dqr_detail.n32.m = 0;
            dqr_detail.n32.u = 0;
            dqr_detail.n33.m = 0;
            dqr_detail.n33.u = 0;
            dqr_detail.n34.m = 0;
            dqr_detail.n34.u = 0;
            dqr_detail.n35.m = 0;
            dqr_detail.n35.u = 0;
            dqr_detail.n36.m = 0;
            dqr_detail.n36.u = 0;
            dqr_detail.n37.m = 0;
            dqr_detail.n37.u = 0;
            dqr_detail.n38.m = 0;
            dqr_detail.n38.u = 0;
            dqr_detail.n39.m = 0;
            dqr_detail.n39.u = 0;
            
            dqr_detail.n40.m = 0;
            dqr_detail.n40.u = 0;
            dqr_detail.n41.m = 0;
            dqr_detail.n41.u = 0;
            dqr_detail.n42.m = 0;
            dqr_detail.n42.u = 0;
            dqr_detail.n43.m = 0;
            dqr_detail.n43.u = 0;

            bool cr_do_revie_is_date = false;
            bool cr_p_relat_is_1 = false;
            bool hrcpr_bcp_secti_is_2 = false;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (source_json);
            int means_of_fatal_injury = 9999;

            value_result = gs.get_value(source_object, "_id");
        
            dqr_detail._id  = ((object)value_result.result).ToString();

            value_result = gs.get_value(source_object, "addquarter");
            var obj = (object)value_result.result;

            if(obj != null)
            {
                dqr_detail.add_quarter_name  = ((object)value_result.result).ToString();

                if(! string.IsNullOrWhiteSpace(dqr_detail.add_quarter_name))
                {
                    var arr = dqr_detail.add_quarter_name.Split("-");
                    dqr_detail.add_quarter_number = double.Parse($"{arr[1]}.{((int.Parse(arr[0].Replace("Q","")) - 1) * .25D).ToString().Replace("0.","")}");
                }
            }



            value_result = gs.get_value(source_object, "cmpquarter");
            obj = (object)value_result.result;
            if(obj != null)
            {
                dqr_detail.cmp_quarter_name  = ((object)value_result.result).ToString();

                if(! string.IsNullOrWhiteSpace(dqr_detail.cmp_quarter_name))
                {
                    var arr = dqr_detail.cmp_quarter_name.Split("-");
                    dqr_detail.cmp_quarter_number = double.Parse($"{arr[1]}.{((int.Parse(arr[0].Replace("Q","")) - 1) * .25D).ToString().Replace("0.","")}");
                }
            }

            dqr_detail.n01 = 1;

            int test_int = -1;

            dqr_detail.n02 = 0;
            value_result = gs.get_value(source_object, "home_record/how_was_this_death_identified");
            if(value_result.is_error)
            {

            }
            else if
            (
                
                value_result.result != null &&
                value_result.result is IList<object>
      
            )
            {
                var list = value_result.result as IList<object>;
                if(list.Count == 0)
                {
                    dqr_detail.n02 = 1;
                }
                else
                {
                    foreach(var item in list)
                    {
                        int.TryParse(item.ToString(), out test_int);
                        if
                        (
                            test_int == 9999 ||
                            test_int == 7777
                        )
                        {
                            dqr_detail.n02 = 1;
                            break;
                        }
                        
                    }
                }

            }
            /*
            else
            {
                dqr_detail.n02 = 1;
            }*/




            value_result = gs.get_value(source_object, "home_record/case_status/overall_case_status");
            if
            (
                !value_result.is_error &&
                value_result.result != null                
            )
            {

                int.TryParse(value_result.result.ToString(), out test_int);
                switch(test_int)
                {
                    case 1:
                    dqr_detail.n03[0] = 1;
                    break;
                    case 2:
                    dqr_detail.n03[1] = 1;
                    break;
                    case 3:
                    dqr_detail.n03[2] = 1;
                    break;
                    case 4:
                    dqr_detail.n03[3] = 1;
                    break;
                    case 5:
                    dqr_detail.n03[4] = 1;
                    break;
                    case 6:
                    dqr_detail.n03[5] = 1;
                    break;
                    case 0:
                    dqr_detail.n03[6] = 1;
                    break;
                    case 9999:
                    dqr_detail.n03[7] = 1;
                    break;
                
                }
                
            }
            else
            {
                dqr_detail.n03[7] = 1;
            }



        //DS2. All Quarters. Limit to Selected quarter or before
    //Valid Review Date: IsDate([cr_do_revie]) = True
    


            value_result = gs.get_value(source_object, "committee_review/date_of_review");
            if
            (
                !value_result.is_error &&
                value_result.result != null
      
            )
            {
                DateTime test_time = DateTime.MinValue;
                var data_string = value_result.result.ToString();
                /*
                if
                (
                    !string.IsNullOrWhiteSpace(data_string) &&
                    data_string.IndexOf("-") < 0
                )
                {
                    System.Console.Write("here");
                }*/
                if
                (
                    DateTime.TryParse(data_string, out test_time)
                )
                {
                    dqr_detail.n04 = 1;
                    cr_do_revie_is_date = true;
                    
                }
            }
            else
            {
                dqr_detail.n04 = 0;
            }


            dqr_detail.n05 = 0;
            dqr_detail.n06 = 0;

            value_result = gs.get_value(source_object, "committee_review/pregnancy_relatedness");
            if
            (
                !value_result.is_error &&
                value_result.result != null
    
            )
            {
                if
                (
                    cr_do_revie_is_date == true &&
                    int.TryParse(value_result.result.ToString(), out test_int) &&
                    test_int == 1
                )
                {
                    dqr_detail.n05 = 1;
                    dqr_detail.n06 = 1;
                    cr_p_relat_is_1 = true;
                    
                }
                else
                {
                    dqr_detail.n05 = 0;
                    dqr_detail.n06 = 0;
                }
            }
            else
            {
                dqr_detail.n05 = 0;
                dqr_detail.n06 = 0;
            }


            value_result = gs.get_value(source_object, "home_record/case_progress_report/birth_certificate_parent_section");
            if
            (
                !value_result.is_error &&
                value_result.result != null
    
            )
            {
                if
                (
                    cr_p_relat_is_1 == true &&
                    int.TryParse(value_result.result.ToString(), out test_int) &&
                    test_int == 2
                )
                {
                    dqr_detail.n07 = 1;
                    dqr_detail.n09 = 1;
                    hrcpr_bcp_secti_is_2 = true;
                }
                else
                {
                    dqr_detail.n07 = 0;
                    dqr_detail.n09 = 0;
                }
            }
            else
            {
                dqr_detail.n07 = 0;
                dqr_detail.n09 = 0;
            }

            if(cr_do_revie_is_date && cr_p_relat_is_1)
            {
                dqr_detail.n08 = 1;
            }
            else
            {
                dqr_detail.n08 = 0;
            }


            if
            (
                cr_do_revie_is_date && 
                cr_p_relat_is_1 &&
                hrcpr_bcp_secti_is_2
            )
            {
                dqr_detail.n09 = 1;
            }
            else
            {
                dqr_detail.n08 = 0;
            }

            //n10
            dqr_detail.n10.m = 0;
            dqr_detail.n10.u = 0;
            //hr_abs_dth_timing: /home_record/overall_assessment_of_timing_of_death/abstrator_assigned_status
            value_result = gs.get_value(source_object, "home_record/overall_assessment_of_timing_of_death/abstrator_assigned_status");
            if
            (
                cr_p_relat_is_1 &&
                !value_result.is_error &&
                value_result.result != null
            )
            {
                if(int.TryParse(value_result.result.ToString(), out test_int))
                {
                    if(test_int == 9999)
                    {
                        dqr_detail.n10.m = 1;
                    }
                    else if(test_int == 88)
                    {
                        dqr_detail.n10.u = 1;
                    }
                }
            }


            
/*
            //n11
            dqr_detail.n11.m = 0;
            dqr_detail.n11.u = 0;
            //hr_abs_dth_timing: /home_record/overall_assessment_of_timing_of_death/abstrator_assigned_status
            value_result = gs.get_value(source_object, "home_record/overall_assessment_of_timing_of_death/abstrator_assigned_status");
            if
            (
                cr_p_relat_is_1 &&
                !value_result.is_error &&
                value_result.result != null
            )
            {
                if(int.TryParse(value_result.result.ToString(), out test_int))
                {
                    if(test_int == 9999)
                    {
                        dqr_detail.n11.m = 1;
                    }
                    else if(test_int == 88)
                    {
                        dqr_detail.n11.u = 1;
                    }
                }
            }*/

            int cr_cta_outco = -1;
            value_result = gs.get_value(source_object, "committee_review/chance_to_alter_outcome");
            if
            (
                !value_result.is_error &&
                value_result.result != null &&
                int.TryParse(value_result.result.ToString(), out test_int)
            
            )
            {
                cr_cta_outco = test_int;
            }


            //n44 44) Analyst Able to Assign Yes/No Preventability
            //cr_do_revie: /committee_review/date_of_review
            //cr_p_relat: /committee_review/pregnancy_relatedness


            int cr_wtd_preve = -1;
            value_result = gs.get_value(source_object, "committee_review/was_this_death_preventable");
            if
            (
                !value_result.is_error &&
                value_result.result != null && 
                 int.TryParse(value_result.result.ToString(), out test_int)
            )
            {
                cr_wtd_preve = test_int;
            }

            //(cr_wtd_preve IN ('1','0') OR cr_cta_outco IN ('0','1','2'))
            //cr_wtd_preve:  /committee_review/was_this_death_preventable
            dqr_detail.n44.t = 1;
            dqr_detail.n44.p = (cr_p_relat_is_1, cr_wtd_preve, cr_cta_outco) switch
            {
                (true, 0, _) => 1,
                (true, 1, _) => 1,
                (true, _, 0) => 1,
                (true, _, 1) => 1,
                (true, _, 2) => 1,
                _ => 0
            };


            /*
                ( 
                    (cr_wtd_preve='0' AND cr_cta_outco IN ('2', '3','9999')) OR 
                    (cr_wtd_preve = '1' AND cr_cta_outco IN ('0','1','3','9999')) OR
                    (cr_wtd_preve='9999' AND cr_cta_outco IN ('3', '9999')) 
                )

            */
            dqr_detail.n45.t = 1;
            dqr_detail.n45.p = (cr_p_relat_is_1, cr_wtd_preve, cr_cta_outco) switch
            {
                (true, 0, 2) => 1,
                (true, 0, 3) => 1,
                (true, 0, 9999) => 1,
                (true, 1, 0) => 1,
                (true, 1, 1) => 1,
                (true, 1, 3) => 1,
                (true, 1, 9999) => 1,
                (true, 9999, 3) => 1,
                (true, 9999, 9999) => 1,
                _ => 0
            };




            //n46
            dqr_detail.n46.p = 0;

            int cr_ddctt_death = -1;
            value_result = gs.get_value(source_object, "committee_review/did_discrimination_contribute_to_the_death");
            if
            (
                !value_result.is_error &&
                value_result.result != null && 
                 int.TryParse(value_result.result.ToString(), out test_int)
            )
            {
                cr_ddctt_death = test_int;
            }

            //cr_ddctt_death IN ('1', '2')
            /*
            (
                A3.cr_wtd_preve='1' OR 
                A3.cr_cta_outco='0' OR 
                A3.cr_cta_outco='1'
            ) 
            AND A2.cr_p_relat = '1'
            //cr_ddctt_death IN ('1', '2')
            //cr_ddctt_death:  /committee_review/did_discrimination_contribute_to_the_death

            */ 

            dqr_detail.n46.t = (cr_p_relat_is_1, cr_wtd_preve, cr_ddctt_death) switch
            {
                (true, 0, 1) => 1,
                (true, 0, 2) => 1,
                (true, 1, 1) => 1,
                (true, 1, 2) => 1,
                _ => 0
            };
            var grid_value_result = gs.get_grid_value(source_object, "committee_review/critical_factors_worksheet/class");
            if
            (
                !grid_value_result.is_error &&
                grid_value_result.result != null 
            )
            {
                foreach(var (index, cdf_class_dynamic) in grid_value_result.result)
                {
                    int cdf_class = -1;
                    if
                    (
                        cdf_class_dynamic != null &&
                        int.TryParse(cdf_class_dynamic.ToString(), out cdf_class)
                    )
                    {
                        if
                        (
                            cdf_class == 26 || 
                            cdf_class == 27 || 
                            cdf_class == 28 
                        )
                        {
                            dqr_detail.n46.t = (cr_p_relat_is_1, cr_wtd_preve, cr_ddctt_death) switch
                            {
                                (true, 0, 1) => 1,
                                (true, 0, 2) => 1,
                                (true, 1, 1) => 1,
                                (true, 1, 2) => 1,
                                _ => 0
                            };
                            break;
                        }
                    }
                }
                cr_ddctt_death = test_int;
            }

            dqr_detail.n47.t = 0;
            dqr_detail.n47.p = 0;
            dqr_detail.n48.t = 0;
            dqr_detail.n48.p = 0;
            dqr_detail.n49.t = 0;
            dqr_detail.n49.p = 0;


			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			//settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(dqr_detail, settings);

			return result;
		}

        private void Get_List_Look_Up
        (
            System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> p_result,
            mmria.common.metadata.node[] p_lookup,
            mmria.common.metadata.node p_metadata,
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
                    Get_List_Look_Up(p_result, p_lookup, node, p_path + "/" + node.name.ToLower());
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

                break;
                default:
                break;
            }
        }


	}
}

