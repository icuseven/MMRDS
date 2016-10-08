using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace owin
{
	static class WatchFiles
	{
		//static string source_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
		static string source_folder = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"] + "/editor";
		static System.IO.DirectoryInfo sourceDirectoryInfo;
		public static string WatchedFolder;
		public static string ProcessedFolder;
		static System.Collections.Generic.HashSet<string> WatchedFiles;


		static FileSystemWatcher fs;

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

			WatchedFolder = sourceDirectoryInfo.FullName;// + "\\InputFileFolder";
			ProcessedFolder = sourceDirectoryInfo.FullName + "\\ProcessedFileFolder\\";
			WatchedFiles = new System.Collections.Generic.HashSet<string>(System.StringComparer.OrdinalIgnoreCase);

			WatchedFiles.Add ("editor.js");
			WatchedFiles.Add ("tree_node.js");
			WatchedFiles.Add ("app.js");
			WatchedFiles.Add ("navigation_renderer.js");
			WatchedFiles.Add ("page_renderer.js");


			// convert and move any existing files at start up
			//ImageConverter.convertDirectory(WatchedFolder, System.Configuration.ConfigurationManager.AppSettings["TargetFolder"], "tif");


			fs = new FileSystemWatcher
			{
				Path = WatchedFolder,
				Filter = "*.js"

			};

			fs.Created += fs_Changed;
			fs.Changed += fs_Changed;
			fs.EnableRaisingEvents = true;

		}
		static void fs_Changed(object sender, FileSystemEventArgs e)
		{
			FileInfo f = new FileInfo(e.FullPath);

			if (f.Extension.Equals (".js") && WatchedFiles.Contains(f.Name))
			{

				var worker = new MyTaskWorkerDelegate (MyTaskWorker);
				worker.BeginInvoke (e.FullPath, null, null);
			}
		}

		private delegate void MyTaskWorkerDelegate(string SourceFilePath);

		private static void MyTaskWorker(string SourceFilePath)
		{
			try
			{
				//ImageConverter.convertFile(SourceFilePath, System.Configuration.ConfigurationManager.AppSettings["TargetFolder"], "tif");
			}
			catch (Exception ex)
			{
				//if (bool.Parse(System.Configuration.ConfigurationManager.AppSettings["WriteErrorsToEventLog"]))
				//{
				System.Console.WriteLine("WatchFiles.MyTaskWorker SourceFilePath: {0}\n{1}", SourceFilePath, ex);
				//}

			}

		}


		public static string GetHash(string file_path)
		{
			String result;
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

		/*
		internal static void DisconnectDrives()
		{
			// *** Disconnect Networked Folder Connections
			if (sourceFolderIsNetworkedConnection)
			{
				//DriveSettings.DisconnectNetworkDrive(sourceDrive, true);
			}

			if (targetFolderIsNetworkedConnection)
			{
				//DriveSettings.DisconnectNetworkDrive(targetDrive, true);
			}
		}*/

	}
}

/*
		static string sourceDrive = System.Configuration.ConfigurationManager.AppSettings["SourceDriveName"];
		static bool sourceFolderIsNetworkedConnection = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["SourceFolderIsNetworkConnection"]);
		static string sourceFolderUserName = System.Configuration.ConfigurationManager.AppSettings["SourceFolderUserName"];
		static string sourceFolderPassword = System.Configuration.ConfigurationManager.AppSettings["SourceFolderPassword"];


		static string targetFolder = System.Configuration.ConfigurationManager.AppSettings["TargetFolder"];
		static string targetDrive = System.Configuration.ConfigurationManager.AppSettings["TargetDriveName"];
		static string targetUserName = System.Configuration.ConfigurationManager.AppSettings["TargetFolderUserName"];
		static string targetPassword = System.Configuration.ConfigurationManager.AppSettings["TargetFolderPassword"];
		static bool targetFolderIsNetworkedConnection = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["TargetFolderIsNetworkConnection"]);
		static bool testNetworkConnectionOnly = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["TestNetworkConnectionOnly"]);
		static bool DeleteUnUsedData = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["DeleteUnUsedData"]);
		//static System.IO.DirectoryInfo targetDirectoryInfo;
		*/