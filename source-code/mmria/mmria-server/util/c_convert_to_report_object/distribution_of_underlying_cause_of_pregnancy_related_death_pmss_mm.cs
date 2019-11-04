using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.util
{
	public partial class c_convert_to_report_object
	{

/*
        committee_review/pregnancy_relatedness = Pregnancy Related; 
        AND 
        committee_review/pmss_mm 
            - display each value with count,
            - include zero values
 */
        private void popluate_distribution_of_underlying_cause_of_pregnancy_related_death_pmss_mm(ref mmria.server.model.c_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
        {
            if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1)
			{


                p_report_object.distribution_of_underlying_cause_of_pregnancy_related_death_pmss_mm = new System.Collections.Generic.Dictionary<string, int> (StringComparer.OrdinalIgnoreCase);
                try
                {	
                    string val = get_value(p_source_object, "committee_review/pmss_mm");
                    if(val != null && val.ToString() == "1")
                    {
                        //p_report_object.total_pregnancy_related_determined_to_be_preventable.value = 0;
                    }
                    else
                    {
                       // p_report_object.total_pregnancy_related_determined_to_be_preventable.value = 0;
                    }
                }
                catch(Exception ex)
                {
                    System.Console.WriteLine (ex);
                }
            }
        }
    }


}