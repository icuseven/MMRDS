using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;


namespace migrate.set
{


    public class v2_3_Migration
    {

        public string host_db_url;
		public string db_name;
        public string config_timer_user_name;
        public string config_timer_value;

		public bool is_report_only_mode;

		public System.Text.StringBuilder output_builder;

		public Dictionary<string, HashSet<string>> summary_value_dictionary = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
        public v2_3_Migration
        (
            string p_host_db_url, 
			string p_db_name, 
            string p_config_timer_user_name, 
            string p_config_timer_value,
			System.Text.StringBuilder p_output_builder,
			Dictionary<string, HashSet<string>> p_summary_value_dictionary,
			bool p_is_report_only_mode
        ) 
        {

            host_db_url = p_host_db_url;
			db_name = p_db_name;
            config_timer_user_name = p_config_timer_user_name;
            config_timer_value = p_config_timer_value;
			output_builder = p_output_builder;
			summary_value_dictionary = p_summary_value_dictionary;
			is_report_only_mode = p_is_report_only_mode;
        }


        public async Task execute()
        {
			this.output_builder.AppendLine($"v2.3 Data Migration started at: {DateTime.Now.ToString("o")}");

/*
new fields

1.	/home_record/case_status/overall_case_status - case_status

2.	home_record/case_status/abstraction_begin_date -abstrn_bgn_date

3.	home_record/case_status/abstraction_complete_date - abstrn_cmp_date

4.	home_record/case_status/projected_review_date - prjtd_rvw_date

5.	home_record/case_status/case_locked_date - case_lck_date

6.	committee_review/critical_factors_worksheet/recommendation_level -crcfw_categ_rec




*/


        }

    }



}