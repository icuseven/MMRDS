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
        static string build_directory_path;
		static string input_directory_path;
		static string output_directory_path;
		static string mmria_server_binary_directory_path;
		static string mmria_console_binary_directory_path;
		static string mmria_server_html_directory_path;

        static IConfiguration configuration = null;

        static void Main(string[] args)
        {
 			string major_version = "18.02.22";
			string minor_version = "3db277d";
			string current_version = $"{major_version} v({minor_version})";


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

			if (System.IO.Directory.Exists (input_directory_path)) 
			{
				System.IO.Directory.Delete(input_directory_path, true);	
			}

			if (System.IO.Directory.Exists (output_directory_path)) 
			{
				System.IO.Directory.Delete(output_directory_path, true);	
			}


			if (System.IO.File.Exists (build_directory_path + @"\output.wixobj")) 
			{
				System.IO.File.Delete(build_directory_path + @"\output.wixobj");	
			}

			if (System.IO.File.Exists (build_directory_path + @"\output.wixpdb")) 
			{
				System.IO.File.Delete(build_directory_path + @"\output.wixpdb");	
			}

			if (System.IO.File.Exists (build_directory_path + @"\output.msi")) 
			{
				System.IO.File.Delete(build_directory_path + @"\output.msi");	
			}

			CopyFolder.CopyDirectory(mmria_server_binary_directory_path, input_directory_path);
			CopyFolder.CopyDirectory(mmria_server_html_directory_path, input_directory_path + "/app");

			CopyFolder.CopyDirectory(mmria_console_binary_directory_path + "/mapping-file-set", input_directory_path + "/mapping-file-set");

			File.Copy(mmria_console_binary_directory_path + "/mmria.exe", input_directory_path + "/mmria.exe");
			File.Copy(mmria_console_binary_directory_path + "/mmria.pdb", input_directory_path + "/mmria.pdb");
			File.Copy(mmria_console_binary_directory_path + "/LumenWorks.Framework.IO.dll", input_directory_path + "/LumenWorks.Framework.IO.dll");

			File.Copy("./mmria.exe.config", input_directory_path + "/mmria.exe.config", true);
			File.Copy("./mmria-server.exe.config", input_directory_path + "/mmria-server.exe.config", true);


			// version number -- Start
			System.Text.RegularExpressions.Regex version_tag = new System.Text.RegularExpressions.Regex ("<\\%=version\\%>");

			string profile_text = System.IO.File.ReadAllText (input_directory_path + "/app/scripts/profile.js");
			System.IO.File.WriteAllText(input_directory_path + "/app/scripts/profile.js", version_tag.Replace(profile_text, current_version));

			string index_text = System.IO.File.ReadAllText (input_directory_path + "/app/index.html");
			System.IO.File.WriteAllText(input_directory_path + "/app/index.html", version_tag.Replace(index_text, current_version));
			// version number -- End

			// remove unneeded files -- start
			if (System.IO.Directory.Exists (input_directory_path + "/app/metadata")) 
			{
				System.IO.Directory.Delete(input_directory_path + "/app/metadata", true);	
			}

			if (File.Exists (input_directory_path + "/app/grid-test-1.html"))
			{
				File.Delete (input_directory_path + "/app/grid-test-1.html");
			}

			if (File.Exists (input_directory_path + "/app/grid-test-2.html"))
			{
				File.Delete (input_directory_path + "/app/grid-test-2.html");
			}

			if (File.Exists (input_directory_path + "/app/grid-test-3.html"))
			{
				File.Delete (input_directory_path + "/app/grid-test-3.html");
			}

			if (File.Exists (input_directory_path + "/app/socket-test.html"))
			{
				File.Delete (input_directory_path + "/app/socket-test.html");
			}
			                
			if (File.Exists (input_directory_path + "/app/socket-test2.html"))
			{
				File.Delete (input_directory_path + "/app/socket-test2.html");
			}
			// remove uneeded files -- end


			// version number.... 

			/*



cp "${source_code_directory}/owin/psk/app/scripts/profile.js" "$wix_root_directory/profile.js.bk" && \
cp "${source_code_directory}/owin/psk/app/index.html" "$wix_root_directory/index.html.bk" && \
sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' "${wix_root_directory}/profile.js.bk"  > "${wix_root_directory}/profile.js" && \
sed -e 's/<\%=version\%>/'$current_year'.'$current_month'.'$current_day' v('$current_build')/g' "${wix_root_directory}/index.html.bk"  > "${wix_root_directory}/index.html" && \
rm -f "$wix_input_directory/app/scripts/profile.js" && cp "$wix_root_directory/profile.js" "$wix_input_directory/app/scripts/profile.js" && \
rm -f "$wix_input_directory/app/index.html" && cp "$wix_root_directory/index.html" "$wix_input_directory/app/index.html"





			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");




			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			File.Copy(mmria_console_binary_directory_path + "/", input_directory_path + "/");
			*/

			CopyFolder.CopyDirectory(input_directory_path, output_directory_path);

        }
    }
}
