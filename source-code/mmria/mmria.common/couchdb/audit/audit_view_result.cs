using System;

namespace mmria.common.model.couchdb.audit;

public sealed class audit_detail_view_item
{
    public int? temp_index {get; set; }
    public string _id { get;set; } // ": "006b515c-8d43-4471-8f9e-72c4db60bc58",
    public string _rev { get;set; } // ": "7-dcb0eadbf8ea69a47cc1e25cde706ed8",
    public string user_name { get;set; } // ": "user9",
    public DateTime? date_created { get;set; } // ": "2021-11-16T16:01:22.385Z",
    public string object_path { get;set; } // ": "g_data.committee_review.date_of_review",
    public string metadata_path { get;set; } // ": "g_metadata.children[24].children[4]",
    public string old_value { get;set; } // ": "",
    public string new_value { get;set; } // ": "09/26/2021",
    public string dictionary_path { get;set; } // ": "/committee_review/date_of_review",
    public string prompt { get;set; } // ": "Review Date",
    public string metadata_type { get;set; } // ": "date"

    public Change_Stack_Item ToChangeStackItem()
    {
        var result = new Change_Stack_Item()
        {
            temp_index = temp_index,
            _id = _id,
            _rev = _rev,
            user_name = user_name, 
            date_created = date_created, 
            object_path = object_path,
            metadata_path = metadata_path,
            old_value = old_value,
            new_value = new_value,
            dictionary_path = dictionary_path,
            

            prompt = prompt, 
            metadata_type = metadata_type,
        };

        return result;
    }
}


public sealed class audit_detail_view
{
     
    public audit_detail_view()
    {
        this.items = new();
    }
  public string _id { get;set; } // ": "245800f9-9528-4777-89ff-1c1d27ddd05f",
  public string _rev { get;set; } // ": "1-aa412d69475e8e489049276758b6469a",
  public string case_id { get;set; } // ": "006b515c-8d43-4471-8f9e-72c4db60bc58",
  public string case_rev { get;set; } // ": "7-dcb0eadbf8ea69a47cc1e25cde706ed8",
  public string user_name { get;set; } // ": "user9",
  public string note { get;set; } // ": "save_and_finish_click",
  public string metadata_version { get;set; } // ": "21.10.01",
  public DateTime? date_created { get;set; } // ": "2021-11-16T16:01:24.731Z",
  public System.Collections.Generic.List<audit_detail_view_item> items { get;set; } // ": [

      public Change_Stack ToChangeStack()
      {
          var result = new Change_Stack()
          {
            _id = _id,
            _rev = _rev,
            case_id = case_id,
            case_rev = case_rev, 
            user_name = user_name, 
            note = note, 
            metadata_version = metadata_version,
            date_created = date_created, 
            items = new()
          };

          foreach(var item in items)
          {
              result.items.Add(item.ToChangeStackItem());
          }

          return result;
      }
}

