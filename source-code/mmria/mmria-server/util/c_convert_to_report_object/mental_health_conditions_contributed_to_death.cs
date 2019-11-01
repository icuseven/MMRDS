using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.util
{
	public partial class c_convert_to_report_object
	{
        private void popluate_pregnancy_related_mental_health_conditions_contributed_to_death (ref mmria.server.model.c_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
        {
            if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1)
			{
                try
                {	
                    string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
                    if(val != null && val.ToString() == "1")
                    {
                        p_report_object.total_pregnancy_related_mental_health_conditions_contributed_to_death.value = 1;
                    }
                    else
                    {
                        p_report_object.total_pregnancy_related_mental_health_conditions_contributed_to_death.value = 0;
                    }
                }
                catch(Exception ex)
                {
                    System.Console.WriteLine (ex);
                }
            }
        }
        private void popluate_pregnancy_associated_mental_health_conditions_contributed_to_death (ref mmria.server.model.c_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
        {
            if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
			{
                try
                {	
                    string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
                    if(val != null && val.ToString() == "1")
                    {
                        p_report_object.total_pregnancy_associated_mental_health_conditions_contributed_to_death.value = 1;
                    }
                    else
                    {
                        p_report_object.total_pregnancy_associated_mental_health_conditions_contributed_to_death.value = 0;
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