using System;
using System.Collections.Generic;

namespace mmria.common.ije
{
    public class StartBatchItemMessage
    {
        public string cdc_unique_id { get; init;}

        public string host_state { get; init; }
        public string mor { get; init; }


        public DateTime ImportDate { get; init; }
        public string ImportFileName { get; init; }
        public List<string> nat { get; init; }

        public List<string> fet { get; init; }

    }
}