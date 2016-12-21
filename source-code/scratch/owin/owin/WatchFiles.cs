using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mmria.server
{
	static class WatchFiles
	{
		//static string source_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
		static string source_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"] + "/scripts";
		static string css_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"] + "/styles";
		static System.IO.DirectoryInfo sourceDirectoryInfo;
		static System.IO.DirectoryInfo cssDirectoryInfo;
		public static string WatchedFolder;
		public static string Css_Watched_Folder;
		public static string ProcessedFolder;
		static System.Collections.Generic.HashSet<string> WatchedFiles;
		static System.Collections.Generic.Dictionary<string,string> WatchDictionary;


		static FileSystemWatcher fs;
		static FileSystemWatcher css_fs;

		internal static void StartWatch()
		{
			/*
			try
			{
				if (string.IsNullOrWhiteSpace(sourceFolderUserName) || string.IsNullOrWhiteSpace(sourceFolderPassword))
				{
					sourceFolderPassword = null;
					sourceFolderUserName = null;
				}


				// *** Connect Networked Folder Connections
				if (string.IsNullOrWhiteSpace(targetUserName) || string.IsNullOrWhiteSpace(targetPassword))
				{
					targetPassword = null;
					targetUserName = null;
				}

				if (sourceFolderIsNetworkedConnection)
				{
					//DriveSettings.MapNetworkDrive(sourceDrive, sourceFolder, sourceFolderUserName, sourceFolderPassword);

				}

				if (targetFolderIsNetworkedConnection)
				{
					//DriveSettings.MapNetworkDrive(targetDrive, targetFolder, targetUserName, targetPassword);
				}

			}
			catch (Exception ex)
			{
				System.Console.WriteLine("Exception Encountered: {0}", ex);

			}
			*/

			sourceDirectoryInfo = new DirectoryInfo(source_folder);
			cssDirectoryInfo = new DirectoryInfo(css_folder);




			WatchedFolder = sourceDirectoryInfo.FullName;// + "\\InputFileFolder";
			ProcessedFolder = sourceDirectoryInfo.FullName + "\\ProcessedFileFolder\\";
			WatchedFiles = new System.Collections.Generic.HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
			WatchDictionary = new Dictionary<string, string>(System.StringComparer.OrdinalIgnoreCase);

			Css_Watched_Folder = cssDirectoryInfo.FullName;

			AddWatchFiles (sourceDirectoryInfo);
			AddWatchFiles (cssDirectoryInfo);

			/*
			WatchedFiles.Add ("editor.js");
			WatchedFiles.Add ("tree_node.js");
			WatchedFiles.Add ("app.js");
			WatchedFiles.Add ("navigation_renderer.js");
			WatchedFiles.Add ("page_renderer.js");
			*/

			HashDirectory(sourceDirectoryInfo);

			fs = new FileSystemWatcher
			{
				Path = WatchedFolder,
				NotifyFilter = NotifyFilters.LastWrite
					| NotifyFilters.FileName,
				IncludeSubdirectories = true

			};

			fs.Created += fs_Changed;
			fs.Changed += fs_Changed;
			fs.EnableRaisingEvents = true;


			HashDirectory(cssDirectoryInfo);

			css_fs = new FileSystemWatcher
			{
				Path = Css_Watched_Folder,
				NotifyFilter = NotifyFilters.LastWrite
					| NotifyFilters.FileName,
				IncludeSubdirectories = true

			};

			css_fs.Created += fs_Changed;
			css_fs.Changed += fs_Changed;
			css_fs.EnableRaisingEvents = true;

		}

		static void fs_Changed(object sender, FileSystemEventArgs e)
		{
			FileInfo f = new FileInfo(e.FullPath);

			if (WatchedFiles.Contains(f.Name))
			{
				string current_hash = GetHash (f.FullName);
				string key_name = GetKeyName (f);

				if (!WatchDictionary.ContainsKey (key_name)) 
				{
					WatchDictionary.Add (key_name, current_hash);

				} 

				if (current_hash != WatchDictionary [key_name]) 
				{
					var worker = new MyTaskWorkerDelegate (MyTaskWorker);
					worker.BeginInvoke (key_name, current_hash, null, null);
				}
				
			}
		}



		private delegate void MyTaskWorkerDelegate(string SourceFilePath, string key);

		private static void MyTaskWorker(string SourceFilePath, string key)
		{
			try
			{
				Current_Edit current_edit = new Current_Edit();
				current_edit.id = key;
				current_edit.metadata = SourceFilePath;
				current_edit.edit_type = "javascript";

				if(current_editController.current_edit_list.ContainsKey(SourceFilePath))
				{
					current_editController.current_edit_list[SourceFilePath] = current_edit;
				}
				else
				{
					current_editController.current_edit_list.Add(SourceFilePath, current_edit);
				}
			}
			catch (Exception ex)
			{
				//if (bool.Parse(System.Configuration.ConfigurationManager.AppSettings["WriteErrorsToEventLog"]))
				//{
				System.Console.WriteLine("WatchFiles.MyTaskWorker SourceFilePath: {0}\n{1}", SourceFilePath, ex);
				//}

			}

		}
		public static string GetKeyName(FileInfo fileinfo)
		{
			string temp = fileinfo.FullName.Replace(source_folder, "");
			string result = null;

			if (temp.Length == fileinfo.FullName.Length) 
			{
				result = "styles" + fileinfo.FullName.Replace(css_folder, "");
			}
			else
			{
				result = "scripts" + temp;
			}

			return result;
		}

		public static string GetHash(string file_path)
		{
			string result;
			StringBuilder sb = new StringBuilder();
			System.Security.Cryptography.MD5 md5Hasher = System.Security.Cryptography.MD5.Create();

			using (System.IO.FileStream fs = System.IO.File.OpenRead(file_path))
			{
				foreach (Byte b in md5Hasher.ComputeHash(fs))
					sb.Append(b.ToString("X2").ToLowerInvariant());
			}

			result = sb.ToString();

			return result;
		}

		public static KeyValuePair<string,string> CreateHashPairFromFilePath(string file_path)
		{
			string hash_value = GetHash(file_path);
			return new KeyValuePair<string, string>(file_path, hash_value);
		}

		static private void HashDirectory(System.IO.DirectoryInfo directoryInfo)
		{
			FileInfo[] fileInfoSet = directoryInfo.GetFiles();
			foreach (FileInfo fileInfo in fileInfoSet)
			{
				string current_hash = GetHash (fileInfo.FullName);
				string key_name = GetKeyName (fileInfo);
				if (!WatchDictionary.ContainsKey (key_name)) 
				{
					WatchDictionary.Add (key_name, current_hash);
				} 

				var worker = new MyTaskWorkerDelegate (MyTaskWorker);
				worker.BeginInvoke (key_name, current_hash, null, null);
			}

			foreach (System.IO.DirectoryInfo di in directoryInfo.GetDirectories())
			{
				string directoryName = di.FullName;

				System.Console.WriteLine(directoryName);

				HashDirectory(di);
			}
		}


		static private void AddWatchFiles(System.IO.DirectoryInfo directoryInfo)
		{
			FileInfo[] fileInfoSet = directoryInfo.GetFiles();
			foreach (FileInfo fileInfo in fileInfoSet)
			{

				WatchedFiles.Add (fileInfo.Name);


			}

			foreach (System.IO.DirectoryInfo di in directoryInfo.GetDirectories())
			{
				string directoryName = di.FullName;

				System.Console.WriteLine(directoryName);

				AddWatchFiles(di);
			}
		}



	}
}
