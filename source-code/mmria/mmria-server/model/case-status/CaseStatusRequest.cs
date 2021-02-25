using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace mmria.server.model.casestatus
{
    public class CaseStatusRequest
    {
        public string StateDatabase { get; set; }
        public string RecordId { get; set; }
    }

    public class CaseStatusDetail
    {
        public string _id { get; set; }
        public string RecordId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }

        public string DateOfDeath { get; set; }
        public string StateOfDeath { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime? DateLastUpdated { get; set; }

        public string CaseStatus { get; set; }

        public string StateDatabase {get; set; }
    }

    public class CaseStatusRequestResponse
    {
        public CaseStatusRequestResponse()
        {
            CaseStatusDetail = new List<CaseStatusDetail>();
        }
        public List<CaseStatusDetail> CaseStatusDetail { get; set; }

    }

     public class CaseStatusResult
    {
        public string _id { get; set; }
        public bool Ok { get; set; }
    }
}