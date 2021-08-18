using System;

namespace mmria.common.model.couchdb
{
    public class AuditViewResponseItem
    {
        public string id {get;set;}
        public string rev {get;set;}
        public string user_name {get;set;}
        public DateTime? date_created {get;set;}
        public string note {get;set;}
        public int? change_count {get;set;}
    }


        public class Change_Stack_Item
        {
            public Change_Stack_Item(){}

            public string _id {get;set;}
            public string _rev {get;set;}

            public string user_name {get;set;}

            public int? temp_index {get; set; }
            public DateTime? date_created {get;set;}
            public string object_path {get;set;}
            public string metadata_path {get;set;}
            public string old_value {get;set;}
            public string new_value {get;set;}
            public string dictionary_path {get;set;}
            public string prompt {get;set;}
            
            
            public string metadata_type {get;set;}
        }
        public class Change_Stack
        {
            public Change_Stack(){}
            public string _id {get;set;}
            public string _rev {get;set;}

            public string case_id {get;set;}
            public string case_rev {get;set;}

            public string user_name {get;set;}

            public string note {get;set;}

            public string metadata_version {get;set;}

            public DateTime? date_created {get;set;}

            public System.Collections.Generic.List<Change_Stack_Item> items {get;set;} = new();
        }

        public class Save_Case_Request
        {
            public Change_Stack Change_Stack {get;set;} = new();

            public System.Dynamic.ExpandoObject Case_Data {get;set;}
            public Save_Case_Request()
            {
    
            }
        }
}