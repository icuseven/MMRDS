using System;
using System.Collections.Generic;

namespace mmria.server.model.SummaryReport;


public class Detail
{
    public Detail(){}
    public string value { get; set; }
    public int count { get; set; }


}


public class FrequencySummaryDocument
{
    public FrequencySummaryDocument()
    {
         path_to_detail = new ();
    }
    public string _id { get; set; }
    public string _rev { get; set; }

    public Dictionary<string, Detail> path_to_detail { get; set; }
    public DateTime? date_created { get; set; } 
    public string created_by { get; set; } 
    public DateTime? date_last_updated { get; set; } 
    public string last_updated_by { get; set; } 


	public string data_type { get; } = "FrequencySummaryDocument";


}
