using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace mmria.server.model.year_of_death;

public sealed class YearOfDeathRequest
{
    public string StateDatabase { get; set; }
    public string RecordId { get; set; }
    public string Role { get; set; } = "jurisdiction_admin";
}

public sealed class YearOfDeathDetail
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

    public int? YearOfDeath { get; set; }
    public string StatusDisplay { get; set; }

    public string StateDatabase {get; set; }

    public string Role { get; set; }  = "jurisdiction_admin";
}

public sealed class YearOfDeathRequestResponse
{
    public YearOfDeathRequestResponse()
    {
        YearOfDeathDetail = new List<YearOfDeathDetail>();
    }
    public List<YearOfDeathDetail> YearOfDeathDetail { get; set; }

}

    public sealed class YearOfDeathResult
{
    public string _id { get; set; }
    public bool Ok { get; set; }
}
