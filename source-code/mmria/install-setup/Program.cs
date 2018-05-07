using System;
using System.IO;
using Microsoft.Extensions.Configuration;


namespace install_setup
{
/*

C:\work-space\MMRDS\source-code\mmria\mmria-server
dotnet publish -c Release -r win10-x64

C:\work-space\MMRDS\source-code\mmria\mmria-server\bin\Release\netcoreapp2.0\win10-x64\publish\

Compress-Archive -Path C:\work-space\MMRDS\source-code\mmria\mmria-server\bin\Release\netcoreapp2.0\win10-x64\publish\ C:\temp\mmria-server.zip

C:\work-space\MMRDS\source-code\mmria\mmria-console
dotnet publish -c Release -r win10-x64

C:\work-space\MMRDS\source-code\mmria\mmria-console\bin\Release\netcoreapp2.0\win10-x64\publish\



 */

    class Program
    {

		static string major_version = "18.02.22";
		static string minor_version = "3db277d";
		static string current_version = $"{major_version} v({minor_version})";

        static string build_directory_path;
		static string input_directory_path;
		static string output_directory_path;
		static string mmria_server_binary_directory_path;
		static string mmria_console_binary_directory_path;
		static string mmria_server_html_directory_path;

        static IConfiguration configuration = null;

        static void Main(string[] args)
        {



            configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(),"appsettings.json"), true, true)
            .Build();


			if (args.Length > 0) 
			{
				for (var i = 1; i < args.Length; i++) 
				{
					string arg = args [i];
					int index = arg.IndexOf (':');
					string val = arg.Substring (index + 1, arg.Length - (index + 1)).Trim (new char [] { '\"' });

					if (arg.ToLower ().StartsWith ("build_directory_path")) 
					{
						build_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("input_directory_path")) 
					{
						input_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("output_directory_path")) 
					{
						output_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("mmria_server_binary_directory_path")) 
					{
						mmria_server_binary_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("mmria_console_binary_directory_path")) 
					{
						mmria_console_binary_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("mmria_server_html_directory_path")) 
					{
						mmria_server_html_directory_path = val;
					}
				}
			}

			if(string.IsNullOrWhiteSpace (build_directory_path)) build_directory_path = configuration["mmria_settings:build_directory_path"];
			if(string.IsNullOrWhiteSpace (input_directory_path)) input_directory_path = configuration["mmria_settings:input_directory_path"];
			if(string.IsNullOrWhiteSpace (output_directory_path)) output_directory_path = configuration["mmria_settings:output_directory_path"];
			if(string.IsNullOrWhiteSpace (mmria_server_binary_directory_path)) mmria_server_binary_directory_path = configuration["mmria_settings:mmria_server_binary_directory_path"];
			if(string.IsNullOrWhiteSpace (mmria_console_binary_directory_path)) mmria_console_binary_directory_path = configuration["mmria_settings:mmria_console_binary_directory_path"];
			if(string.IsNullOrWhiteSpace (mmria_server_html_directory_path)) mmria_server_html_directory_path = configuration["mmria_settings:mmria_server_html_directory_path"];

			string[] publish_version_set = new string[]
			{
				//"win10-x64", 
				"ubuntu.16.10-x64"
			};
			
			string root_dir = Directory.GetCurrentDirectory().Replace("install-setup","");
			foreach(string publish_version in publish_version_set)
			{
				string mmria_server_project_file = Path.Combine(root_dir,"mmria-server","mmria-server.csproj");
				string output = RunShell("dotnet", $"publish {mmria_server_project_file} --framework netcoreapp2.0 -c Release -r {publish_version} -v d");
				var NoErrors = new System.Text.RegularExpressions.Regex("0 Error\\(s\\)");
				if(NoErrors.IsMatch(output))
				{
					Console.WriteLine($"go server {publish_version}");
					ProcessServerPublish(publish_version);

					//ubuntu.16.10-x64
				}
				else
				{
					Console.WriteLine($"no go {publish_version}");
					Console.WriteLine(output);
				}


				string mmria_console_project_file = Path.Combine(root_dir,"mmria-console","mmria-console.csproj");
				output = RunShell("dotnet", $"publish {mmria_console_project_file} --framework netcoreapp2.0 -c Release -r {publish_version} -v d");

				//Console.WriteLine($"{output}");

				if(NoErrors.IsMatch(output))
				{
					Console.WriteLine($"go console {publish_version}");
					ProcessConsolePublish(publish_version);
				}
				else
				{
					Console.WriteLine($"no go {publish_version}");
					Console.WriteLine(output);
				}
			}

			CopyFolder.CopyDirectory(input_directory_path, output_directory_path);
        }


		static void ProcessServerPublish(string p_publish_version)
		{
			string root_dir = Directory.GetCurrentDirectory().Replace("install-setup","");
							// version number -- Start
			System.Text.RegularExpressions.Regex version_tag = new System.Text.RegularExpressions.Regex ("<\\%=version\\%>");
			string mmria_server_publish_directory = Path.Combine(root_dir,"mmria-server","bin","Release","netcoreapp2.0", p_publish_version,"publish");
			string profile_text = System.IO.File.ReadAllText (mmria_server_publish_directory + "/wwwroot/scripts/profile.js");
			System.IO.File.WriteAllText(mmria_server_publish_directory + "/wwwroot/scripts/profile.js", version_tag.Replace(profile_text, current_version));

			string index_text = System.IO.File.ReadAllText (mmria_server_publish_directory + "/wwwroot/index.html");
			System.IO.File.WriteAllText(mmria_server_publish_directory + "/wwwroot/index.html", version_tag.Replace(index_text, current_version));
			// version number -- End


			// remove unneeded files -- start
			if (System.IO.Directory.Exists (mmria_server_publish_directory + "/wwwroot/metadata")) 
			{
				System.IO.Directory.Delete(mmria_server_publish_directory + "/wwwroot/metadata", true);	
			}

			if (File.Exists (mmria_server_publish_directory + "/wwwroot/grid-test-1.html"))
			{
				File.Delete (mmria_server_publish_directory + "/wwwroot/grid-test-1.html");
			}

			if (File.Exists (mmria_server_publish_directory + "/wwwroot/grid-test-2.html"))
			{
				File.Delete (mmria_server_publish_directory + "/wwwroot/grid-test-2.html");
			}

			if (File.Exists (mmria_server_publish_directory + "/wwwroot/grid-test-3.html"))
			{
				File.Delete (mmria_server_publish_directory + "/wwwroot/grid-test-3.html");
			}

			if (File.Exists (mmria_server_publish_directory + "/wwwroot/socket-test.html"))
			{
				File.Delete (mmria_server_publish_directory + "/wwwroot/socket-test.html");
			}
							
			if (File.Exists (mmria_server_publish_directory + "/wwwroot/socket-test2.html"))
			{
				File.Delete (mmria_server_publish_directory + "/wwwroot/socket-test2.html");
			}
			// remove uneeded files -- end


			string mmria_server_zip_file_name = Path.Combine(root_dir,"mmria-server","bin", $"MMRIA-server-{p_publish_version}-{current_version}.zip");
			cFolderCompressor folder_compressor = new cFolderCompressor ();

			if(File.Exists(mmria_server_zip_file_name))
			{
				File.Delete(mmria_server_zip_file_name);
			}

			folder_compressor.Compress
			(
				System.IO.Path.Combine (mmria_server_zip_file_name),
				null,// string password 
				System.IO.Path.Combine (mmria_server_publish_directory)
			);

		}

		static void ProcessConsolePublish(string p_publish_version)
		{
			string root_dir = Directory.GetCurrentDirectory().Replace("install-setup","");

			string mmria_console_zip_file_name = Path.Combine(root_dir,"mmria-console","bin", $"MMRIA-console-{p_publish_version}-{current_version}.zip");
			string mmria_console_publish_folder = Path.Combine(root_dir,"mmria-console","bin","Release","netcoreapp2.0",p_publish_version,"publish");
			cFolderCompressor folder_compressor = new cFolderCompressor ();

			if(File.Exists(mmria_console_zip_file_name))
			{
				File.Delete(mmria_console_zip_file_name);
			}

			folder_compressor.Compress
			(
				System.IO.Path.Combine (mmria_console_zip_file_name),
				null,// string password 
				System.IO.Path.Combine (mmria_console_publish_folder)
			);
		}

		static string RunShell(string p_file_path, string p_arguments = null)
		{
			System.Text.StringBuilder result = new System.Text.StringBuilder();
			
			System.Diagnostics.Process proc = new System.Diagnostics.Process 
			{
				StartInfo = new System.Diagnostics.ProcessStartInfo 
				{
					FileName = p_file_path,
					Arguments = p_arguments,
					UseShellExecute = false,
					RedirectStandardOutput = true,
					CreateNoWindow = true
				}
			};


			proc.Start();
			while (!proc.StandardOutput.EndOfStream) 
			{
				result.AppendLine(proc.StandardOutput.ReadLine());
				// do something with line
			}

			return result.ToString();
		}
    }
}
