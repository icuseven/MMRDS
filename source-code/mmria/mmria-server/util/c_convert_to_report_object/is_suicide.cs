using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.util
{
	public partial class c_convert_to_report_object
	{
        private void popluate_pregnancy_related_is_suicide (ref mmria.server.model.c_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
        {
            if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1)
			{
                try
                {	
                    string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
                    if(val != null && val.ToString() == "1")
                    {
                        p_report_object.total_pregnancy_related_is_suicide.value = 1;
                    }
                    else
                    {
                        p_report_object.total_pregnancy_related_is_suicide.value = 0;
                    }
                }
                catch(Exception ex)
                {
                    System.Console.WriteLine (ex);
                }
            }
        }
        private void popluate_pregnancy_associated_is_suicide (ref mmria.server.model.c_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
        {
            if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
			{
                try
                {	
                    string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
                    if(val != null && val.ToString() == "1")
                    {
                        p_report_object.total_pregnancy_associated_is_suicide.value = 1;
                    }
                    else
                    {
                        p_report_object.total_pregnancy_associated_is_suicide.value = 0;
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