using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using System.Threading.Tasks;

namespace mmria.console
{
	public class convert
	{
		private string auth_token = null;
		private string user_name = null;
		private string password = null;
		private string source_file_path = null;
		private string mmria_url = null;

		//import user_name:user1 password:password database_file_path:mapping-file-set/Maternal_Mortality.mdb url:http://localhost:12345

		public convert()
		{
			

		}
		public async void Execute(string[] args)
		{

			if (args.Length > 1)
			{
				for (var i = 1; i < args.Length; i++)
				{
					string arg = args[i];
					int index = arg.IndexOf(':');
					string val = arg.Substring(index + 1, arg.Length - (index + 1)).Trim(new char[] { '\"' });

					if (arg.ToLower().StartsWith("auth_token"))
					{
						this.auth_token = val;
					}
					else if (arg.ToLower().StartsWith("user_name"))
					{
						this.user_name = val;
					}
					else if (arg.ToLower().StartsWith("password"))
					{
						this.password = val;
					}
					else if (arg.ToLower().StartsWith("source_file_path"))
					{
						
						this.source_file_path = val;
					}
					else if (arg.ToLower().StartsWith("url"))
					{
						this.mmria_url = val;
					}
				}
			}

			if (string.IsNullOrWhiteSpace(this.source_file_path))
			{
				System.Console.WriteLine("missing source_file_path");
				System.Console.WriteLine(" form source_file_path:[file path]");
				System.Console.WriteLine(" example 1 source_file_path:c:/temp/");
				System.Console.WriteLine(" example 2 source_file_path:\"c:/temp folder/\"");
				System.Console.WriteLine(" example 3 source_file_path:mapping-file-set\\\"");
				System.Console.WriteLine(" mmria-console.exe export user_name:user1 password:secret url:http://localhost:12345 source_file_path:\"c:\\temp folder\\\"");

				return;
			}

			if (string.IsNullOrWhiteSpace(this.mmria_url))
			{
				System.Console.WriteLine("missing url");
				System.Console.WriteLine(" form url:[website_url]");
				System.Console.WriteLine(" example url:http://localhost:12345");

				return;
			}

			if (string.IsNullOrWhiteSpace(this.user_name))
			{
				System.Console.WriteLine("missing user_name");
				System.Console.WriteLine(" form user_name:[user_name]");
				System.Console.WriteLine(" example user_name:user1");
				return;
			}

			if (string.IsNullOrWhiteSpace(this.password))
			{
				System.Console.WriteLine("missing password");
				System.Console.WriteLine(" form password:[password]");
				System.Console.WriteLine(" example password:secret");
				return;
			}



			if (!Directory.Exists(this.source_file_path))
			{
				System.Console.WriteLine($"source_file_path does NOT exist: {this.source_file_path}");
				return;
			}



			var responseFromServer = await ReadMetadataAsync();
			Console.Write(responseFromServer);

			var metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(responseFromServer);

			var new_schema = GetSchema(metadata);


			var location = Directory.GetCurrentDirectory();
			var output_schema_path = Path.Combine(location, @"GeneratedSchema");
			File.WriteAllText($"{output_schema_path}/generated_schema.json", new_schema.ToJson());


			//var filename = "address";
			//var filename = "multivalue-list-example";
			var filename = "multilist-item-predefined";
			var path = Path.Combine(location, @"schema/template");
			var output_path = Path.Combine(location, @"schema/GeneratedCode");
			var schemaJson = File.ReadAllText($"{path}/{filename}.json");
			var generatedFile = await GenerateFileAsync(filename, schemaJson);

			File.WriteAllText($"{output_path}/{filename}.cs", generatedFile);
			



			Console.WriteLine("Convert Finished");

		}

		static async Task<string> ReadMetadataAsync()
		{
				// ... Target page.
				string page = "http://demo.mmria.org/api/metadata";

				// ... Use HttpClient.
				using (HttpClient client = new HttpClient())
				using (HttpResponseMessage response = await client.GetAsync(page))
				using (HttpContent content = response.Content)
				{
						// ... Read the string.
						string result = await content.ReadAsStringAsync();

						return result;
				}
		}





		static async Task<string> GenerateFileAsync(string filename, string schemaJson)
		{
				string result = null;

				var schema = await NJsonSchema.JsonSchema4.FromJsonAsync(schemaJson);
				var settings = new NJsonSchema.CodeGeneration.CSharp.CSharpGeneratorSettings()
				{
					Namespace = "AwesomeSauce.v1",
					//ClassStyle = NJsonSchema.CodeGeneration.CSharp.CSharpClassStyle.Inpc 
					ClassStyle = NJsonSchema.CodeGeneration.CSharp.CSharpClassStyle.Poco
				};

				var generator = new NJsonSchema.CodeGeneration.CSharp.CSharpGenerator(schema, settings);
				result = generator.GenerateFile();

				return result;
		}

        static NJsonSchema.JsonSchema4 GetSchema(mmria.common.metadata.app p_app)
        {
            //https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Schema_JsonSchema.htm
                
			var schema = new NJsonSchema.JsonSchema4();
			
			schema.Type =  NJsonSchema.JsonObjectType.Object;
			schema.Title = "mmria_case";
			schema.Description = "Here is a case for your ...!";
			
			schema.SchemaVersion = "http://json-schema.org/draft-06/schema#";

			schema.Properties.Add("_id", new NJsonSchema.JsonProperty(){ Type = NJsonSchema.JsonObjectType.String});

			return schema;
        }
	}
}
