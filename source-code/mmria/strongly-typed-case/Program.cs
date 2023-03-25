using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace strongcase;

internal class Program
{
    static public async Task Main(string[] args)
    {
        Console.WriteLine("Hello, World!");

/*

using System.Net.Http.Json;

//Get JSON
var stock = await httpClient.GetFromJsonAsync<Stock>($"https://localhost:12345/stocks/{symbol}");

stock.Price = 121.10m;

//Send JSON
await httpClient.PostAsJsonAsync<Stock>("https://localhost:12345/stocks/", stock);

*/


        //string metadata_url = $"http://localhost:5984/metadata/version_specification-20.12.01/metadata";
;
        //string metadata_url = $"{host_db_url}/metadata/version_specification-20.12.01/metadata";
        //var metadata_client = new HttpClient { BaseAddress = new Uri(metadata_url) };
        
        
        //var metadata_url = "http://localhost:5984/metadata/mmria-pmss-builder";
        mmria.common.metadata.app metadata = null;


        var metadata_url = $"http://localhost:5984/metadata/version_specification-23.01.03/metadata";
        using(var metadata_client = new HttpClient ())
        {
            metadata = await metadata_client.GetFromJsonAsync<mmria.common.metadata.app>(metadata_url);

            Console.WriteLine($"node name: {metadata.name} prompt: {metadata.prompt} type: {metadata.type}");
        }

        var metadata_mgr = new metadata_mgr(metadata);
        var total_count = metadata_mgr.single_form_value_set.Count + 
            metadata_mgr.single_form_grid_value_set.Count + 
            metadata_mgr.multiform_value_set.Count + 
            metadata_mgr.multiform_grid_value_set.Count + 
            metadata_mgr.single_form_multi_value_set.Count + 
            metadata_mgr.single_form_grid_multi_value_list_set.Count + 
            metadata_mgr.multiform_multi_value_set.Count + 
            metadata_mgr.multiform_grid_multi_value_set.Count;
        
        var is_count_same = metadata_mgr.all_list_set.Count == metadata_mgr.single_form_value_set.Count + 
            metadata_mgr.single_form_grid_value_set.Count + 
            metadata_mgr.multiform_value_set.Count + 
            metadata_mgr.multiform_grid_value_set.Count + 
            metadata_mgr.single_form_multi_value_set.Count + 
            metadata_mgr.single_form_grid_multi_value_list_set.Count + 
            metadata_mgr.multiform_multi_value_set.Count + 
            metadata_mgr.multiform_grid_multi_value_set.Count;

        System.Console.WriteLine($"all_list_set.Count: {metadata_mgr.all_list_set.Count} total_count: {total_count}");
        System.Console.WriteLine($"is count the same: {is_count_same}");



        System.Console.WriteLine($"Single Form Count: {metadata_mgr.SingleformList.Count}");
        System.Console.WriteLine($"Multi Form Count: {metadata_mgr.MultifFormList.Count}");
        System.Console.WriteLine($"Grid Count: {metadata_mgr.GridList.Count}");
        System.Console.WriteLine($"Group Count: {metadata_mgr.GroupList.Count}");
        System.Console.WriteLine($"MultivaluedList Count: {metadata_mgr.MultivaluedList.Count}");



        System.Text.StringBuilder builder = new System.Text.StringBuilder();
        builder.AppendLine(@"
using System;
using System.Collections.Generic;

namespace mmria.case_version.v1;");
		while(metadata_mgr.source_code_builder_stack.Count > 0)
        {
            var current = metadata_mgr.source_code_builder_stack.Pop();

            builder.AppendLine(current.ToString());

        }
        
        System.Console.WriteLine($"source code: {builder.ToString()}");

        System.IO.File.WriteAllText("output.cs", builder.ToString());


        /*
            print("Single Form", metadata_mgr.SingleformList);
            print("Multi Form", metadata_mgr.MultifFormList);
            print("Grid", metadata_mgr.GridList);
            print("Group", metadata_mgr.GroupList);
        */


    }

    static void print(string list_name, List<metadata_mgr.Metadata_Node> list)
    {
        System.Console.WriteLine($"List: {list_name} Count: {list.Count}");
        foreach(var item in list)
        {
            System.Console.WriteLine($"\n: {item.Node.name}");
        }
    }



    public void gather_info
    (
        mmria.common.metadata.app p_metadata,
        string p_path
    )
	{

		foreach(var node in p_metadata.children)
		{
			switch (node.type.ToLowerInvariant())


			{
                case "form":
				if
				(
					node.cardinality == "+" ||
					node.cardinality == "*"
				)
				{
					
				}
				else
				{
					
				}
                break;
			}
		}
		
	}


    public void write_class
    (
        mmria.common.metadata.app p_metadata,
        string p_path
    )
	{

		foreach(var node in p_metadata.children)
		{
			switch (node.type.ToLowerInvariant())


			{
                case "form":
				if
				(
					node.cardinality == "+" ||
					node.cardinality == "*"
				)
				{
					
				}
				else
				{
					
				}
                break;
			}
		}
		
	}
	
}