using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace mmria.common.ije
{
    public class Batch
    {

        public enum StatusEnum
        {
            Validating,
            InProcess,
            Finished
        }
        public StatusEnum Status { get; init;}
        public string id { get; init;}

        public string reporting_state { get; init;}
        public string mor_file_name { get; init;}
        public string fet_file_name { get; init;}
        public string nat_file_name { get; init;}
        public DateTime? ImportDate { get; init;}
        public List<BatchItem> record_result { get; init;}

        public string StatusInfo { get; init; }
    }

    public class BatchStatusMessage
    {
        public string id {get;init;}
        public Batch.StatusEnum status {get;init;}
    }

}
