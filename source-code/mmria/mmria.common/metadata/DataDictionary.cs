using System;
using System.Collections.Generic;

namespace mmria.common.metadata;

public sealed class DataDictionary
{
  public string FormName { get; set; }
  public List<FormMetadata> FormDataRows { get; set; }
}