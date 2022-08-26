using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Linq;
using System.Threading.Tasks;

namespace mmria.services.backup;

public class Backup
{
	public class BackupResultMessage
	{
		public BackupResultMessage() {}

		public string Status { get; set;}

		public string Detail {get;set;}

		public int Doc_ID_Count { get; set;}
		public int SuccessCount { get; set;}
		public int ErrorCount { get; set; }
	}

	List<(string, int)> document_counts = null;

	private HashSet<string> id_list = null;
	private string auth_token = null;
	private string user_name = null;
	private string password = null;
	private string backup_file_path = null;
	private string database_url = null;
	private string mmria_url = null;

	public Backup(List<(string, int)> p_document_counts)
	{
		document_counts = p_document_counts;
	}
	public async Task<BackupResultMessage> Execute (string [] args)
	{
		var result = new BackupResultMessage();
		string export_directory = null;


		if (args.Length > 1) 
		{
			for (var i = 1; i < args.Length; i++) 
			{
				string arg = args [i];
				int index = arg.IndexOf (':');
				string val = arg.Substring (index + 1, arg.Length - (index + 1)).Trim (new char [] { '\"' });

				if (arg.ToLower ().StartsWith ("auth_token")) 
				{
					this.auth_token = val;
				} 
				else if (arg.ToLower ().StartsWith ("user_name"))
				{
					this.user_name = val;
				}
				else if (arg.ToLower ().StartsWith ("password")) 
				{
					this.password = val;
				}
				else if (arg.ToLower ().StartsWith ("database_url"))
				{
					this.database_url = val;
				}
				else if (arg.ToLower ().StartsWith ("backup_file_path"))
				{
					this.backup_file_path = val;
				}
				else if (arg.ToLower ().StartsWith ("url"))
				{
					this.mmria_url = val;
				}
				else if(arg.ToLower().StartsWith("export_directory"))
				{
					export_directory = val;
				}
			}
		}

		if (string.IsNullOrWhiteSpace (this.database_url)) 
		{
			System.Console.WriteLine ("missing database_url");
			System.Console.WriteLine (" form backup_file_path:[file path]");
			System.Console.WriteLine (" example database:http://localhost:5984/metadata");
			System.Console.WriteLine (" mmria.exe backup user_name:user1 password:secret url:http://localhost:12345 database_url:http://localhost:5984/database_name");


			result.Status = "Validation Error";
			result.Detail = "missing database_url";
			return result;
		}

		if (string.IsNullOrWhiteSpace (this.user_name)) 
		{
			System.Console.WriteLine ("missing user_name");
			System.Console.WriteLine (" form user_name:[user_name]");
			System.Console.WriteLine (" example user_name:user1");
			System.Console.WriteLine (" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");

			result.Status = "Validation Error";
			result.Detail = "missing user_name";
			return result;
		}

		if (string.IsNullOrWhiteSpace (this.password)) 
		{
			System.Console.WriteLine ("missing password");
			System.Console.WriteLine (" form password:[password]");
			System.Console.WriteLine (" example password:secret");
			System.Console.WriteLine (" mmria.exe export user_name:user1 password:secret url:http://localhost:12345");

			result.Status = "Validation Error";
			result.Detail = "missing password";
			return result;
		}


		try 
		{
	        

			DateTime TimerStart = DateTime.Now;
            DateTime TimerEnd = DateTime.Now;



			id_list = await GetIdList();


			TimerEnd = DateTime.Now;

            TimeSpan  TimerDuration = TimerEnd - TimerStart;
            document_counts.Add(($"{database_url} GetIdList duration {TimerDuration.TotalMinutes:0#.##}", 0));


			result.Doc_ID_Count = id_list.Count;

			TimerStart = DateTime.Now;


			var (SuccessCount, ErrorCount) = await GetDocumentList ();

			TimerEnd = DateTime.Now;

            TimerDuration = TimerEnd - TimerStart;
            document_counts.Add(($"{database_url} GetDocumentList duration {TimerDuration.TotalMinutes:0#.##}", 0));


			Console.WriteLine ("Backup Finished.");

			result.Status = "Success";
			result.SuccessCount = SuccessCount;
			result.ErrorCount = ErrorCount;
			return result;

		}
		catch (Exception ex) 
		{
			Console.WriteLine ("Error in backing up: " + this.database_url);
			Console.WriteLine (ex);



			result.Status = $"Error";
			result.Detail = $"{ex}";

			return result;
		}




	}


	private async Task<HashSet<string>> GetIdList ()
	{

		var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

		try
		{
			string URL = string.Format("{0}/_all_docs", this.database_url);
			var document_curl = new mmria.getset.cURL ("GET", null, URL, null, this.user_name, this.password);
			var curl_result = await document_curl.executeAsync();

			dynamic all_cases = System.Text.Json.JsonSerializer.Deserialize<mmria.common.model.couchdb.alldocs_response<System.Dynamic.ExpandoObject>> (curl_result);
			dynamic all_cases_rows = all_cases.rows;

			foreach (var row in all_cases_rows) 
			{
				result.Add(row.id);
			}
		}
		catch(Exception)
		{

		}
		return result;
	}

	


	private async Task<(int SuccessCount, int ErrorCount)> GetDocumentList ()
	{
		int SuccessCount = 0;
		int ErrorCount = 0;

		double number_of_observations = 0.0F;
		double total_duration = 0.0;
		double max = double.MinValue;
		double min = double.MaxValue;

		foreach(var id in id_list)
		{
			DateTime TimerStart = DateTime.Now;
            DateTime TimerEnd = DateTime.Now;
			number_of_observations +=1;
			try
			{
				string URL = $"{this.database_url}/{id}";
				var document_curl = new mmria.getset.cURL ("GET", null, URL, null, this.user_name, this.password);
				var curl_result = await document_curl.executeAsync();

				dynamic case_row = System.Text.Json.JsonSerializer.Deserialize<System.Dynamic.ExpandoObject> (curl_result);

				IDictionary<string, object> case_doc = case_row as IDictionary<string, object>;
				case_doc.Remove("_rev");

				var case_json = System.Text.Json.JsonSerializer.Serialize(case_doc);

				var backup_file_path = this.backup_file_path;

				

				if(this.database_url.EndsWith("/metadata"))
				{
					
					var new_id = id.Replace(":","-").Replace(".","-");
					var file_path = System.IO.Path.Combine(backup_file_path, new_id);
					System.IO.Directory.CreateDirectory($"{file_path}/_attachments");

					file_path = System.IO.Path.Combine(file_path, $"{id.Replace(":","-").Replace(".","-")}.json");
					if (!System.IO.File.Exists (file_path)) 
					{
						await System.IO.File.WriteAllTextAsync (file_path, case_json);
					}
				}
				else
				{

					var file_path = System.IO.Path.Combine(backup_file_path, $"{id}.json");
					if (!System.IO.File.Exists (file_path)) 
					{
						await System.IO.File.WriteAllTextAsync (file_path, case_json);
					}
				}

				if(this.database_url.EndsWith("/metadata"))
				{
					if(case_doc.ContainsKey("_attachments"))
					{
						var attachment_set = case_doc["_attachments"] as IDictionary<string,object>;
						if(attachment_set != null)
						{
							var new_id = id.Replace(":","-").Replace(".","-");
							var attachment_path = System.IO.Path.Combine(backup_file_path, new_id, "_attachments");
							

							foreach(var kvp in attachment_set)
							{
								var attachment_url = $"{URL}/{kvp.Key}";
								var attachment_curl = new mmria.getset.cURL ("GET", null, URL, null, this.user_name, this.password);
								var attachment_doc_json = await attachment_curl.executeAsync();



								var attachment_file_path = System.IO.Path.Combine(attachment_path, kvp.Key);
								if (!System.IO.File.Exists (attachment_file_path)) 
								{
									await System.IO.File.WriteAllTextAsync (attachment_file_path, attachment_doc_json);
								}
							}
						}
					}
				}

				TimerEnd = DateTime.Now;

				TimeSpan  TimerDuration = TimerEnd - TimerStart;

				if(TimerDuration.TotalMinutes > max)
				{
					max = TimerDuration.TotalMinutes;
				}

				if(TimerDuration.TotalMinutes < min)
				{
					min = TimerDuration.TotalMinutes;
				}

				total_duration += TimerDuration.TotalMinutes;
				
				//document_counts.Add(($"{database_url} GetIdList duration {TimerDuration.TotalMinutes:0#.##}", 0));


				SuccessCount+= 1;
			}
			catch(Exception)
			{
				ErrorCount += 1;
			}

			document_counts.Add(($"{database_url} min: {min:0#.##} max: {max:0#.##} avg:{total_duration / number_of_observations:0#.##}", 0));

			
		}

		return (SuccessCount, ErrorCount);
	}

}

