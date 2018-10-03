using System;

namespace mmria.common.model.couchdb
{
    public class get_sortable_view_reponse_object_key_header<T>
    {
        public int offset { get; set; } //": 0,
        public System.Collections.Generic.List<get_sortable_view_response_object_key_item<T>> rows { get; set; }
		public int total_rows { get; set; } 
        
        public get_sortable_view_reponse_object_key_header () 
        {
            this.rows = new System.Collections.Generic.List<get_sortable_view_response_object_key_item<T>> ();
        }

        public get_sortable_view_reponse_object_key_header
        (
            int p_offset,
            System.Collections.Generic.List<get_sortable_view_response_object_key_item<T>> p_rows,
            int p_total_rows 
        ) 
        {
            this.offset = p_offset;
            this.rows = p_rows;
            this.total_rows = p_total_rows;
        }

    }

    
    public class get_sortable_view_response_object_key_item<T>
	{
        public get_sortable_view_response_object_key_item(){}

		public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
		public System.Collections.Generic.List<string> key { get; set; } //": "16e458537602f5ef2a710089dffd9453",

        //public T value {  get; set; }
        public T value {  get; set; }

	
	}

}