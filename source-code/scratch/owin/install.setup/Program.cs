using System;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using System.Text;


namespace install.setup
{
	class MainClass
	{
		static System.Collections.Generic.Dictionary<string, string> name_hash_list;
		static string wix_directory_path;
		static string input_directory_path;
		static string output_directory_path;

		public static void Main(string[] args)
		{
			//"C:\Program Files\WiX Toolset v3.10\bin\candle" -ext "C:\Program Files\WiX Toolset v3.10\bin\WixNetFxExtension.dll" output.xml

			//"C:\Program Files\WiX Toolset v3.10\bin\light" -ext "C:\Program Files\WiX Toolset v3.10\bin\WixNetFxExtension.dll" output.wixobj

			if (args.Length > 1) 
			{
				for (var i = 1; i < args.Length; i++) 
				{
					string arg = args [i];
					int index = arg.IndexOf (':');
					string val = arg.Substring (index + 1, arg.Length - (index + 1)).Trim (new char [] { '\"' });

					if (arg.ToLower ().StartsWith ("wix_directory_path")) 
					{
						wix_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("input_directory_path")) 
					{
						input_directory_path = val;
					}
					else if (arg.ToLower ().StartsWith ("output_directory_path")) 
					{
						output_directory_path = val;
					}

				}
			}


			if(string.IsNullOrWhiteSpace(wix_directory_path)) wix_directory_path = System.Configuration.ConfigurationManager.AppSettings["wix_directory_path"];
			if(string.IsNullOrWhiteSpace (input_directory_path)) input_directory_path = System.Configuration.ConfigurationManager.AppSettings["input_directory_path"];
			if(string.IsNullOrWhiteSpace (output_directory_path)) output_directory_path = System.Configuration.ConfigurationManager.AppSettings["output_directory_path"];

			System.IO.Directory.Delete(output_directory_path, true);
			CopyFolder.CopyDirectory(input_directory_path, output_directory_path);

			//Console.WriteLine("Hello World!");
			string name_hash_file_name = "id.csv";
			string wix_file_name = "output.xml";


			name_hash_list = new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);


			if (System.IO.File.Exists(name_hash_file_name))
			{

				using (System.IO.TextReader reader = System.IO.File.OpenText(name_hash_file_name))
				{
					string file = reader.ReadToEnd();
					string[] line_list = file.Split('\n');
					for (int i = 0; i < line_list.Length; i++)
					{
						string[] name_hash = line_list[i].Split(',');
						if (name_hash.Length > 1)
						{
							name_hash_list.Add(name_hash[0].Trim(), name_hash[1].Trim());
						}

					}
				}
			}

			string xml = get_xml_template();


			var xmlReader = XmlReader.Create(new StringReader(xml));
			XDocument wix_doc  = XDocument.Load(xmlReader);
			var namespaceManager = new XmlNamespaceManager(xmlReader.NameTable);
			namespaceManager.AddNamespace("prefix", "http://schemas.microsoft.com/wix/2006/wi");


			XElement ProductElement = wix_doc.XPathSelectElement("prefix:Wix/prefix:Product", namespaceManager);

			ProductElement.Attribute("Id").SetValue(get_id("PRODUCT_ID"));
			ProductElement.Attribute("UpgradeCode").SetValue(get_id("PRODUCT_UPGRADECODE"));

			Console.WriteLine("Product");
			Console.WriteLine(ProductElement.Attribute("Name"));
			Console.WriteLine(ProductElement.Attribute("Id"));
			Console.WriteLine(ProductElement.Attribute("UpgradeCode"));
			Console.WriteLine(ProductElement.Attribute("Manufacturer"));
			Console.WriteLine(ProductElement.Attribute("Version"));



			XElement PackageElement = ProductElement.XPathSelectElement("./prefix:Package", namespaceManager);
			Console.WriteLine("Package");
			Console.WriteLine(PackageElement.Attribute("Description"));
			Console.WriteLine(PackageElement.Attribute("Comments"));
			Console.WriteLine(PackageElement.Attribute("Manufacturer"));
			//Console.WriteLine(PackageElement.Attribute("Manufacturer"));
			//Console.WriteLine(PackageElement.Attribute("Version"));

			XElement MediaElement = ProductElement.XPathSelectElement("./prefix:Media", namespaceManager);
			Console.WriteLine("Media");
			Console.WriteLine(MediaElement.Attribute("Cabinet"));


			XElement PropertyElement = ProductElement.XPathSelectElement("./prefix:Property", namespaceManager);
			Console.WriteLine("Property");
			Console.WriteLine(PropertyElement.Attribute("Id"));
			Console.WriteLine(PropertyElement.Attribute("Value"));

			XElement IconElement = ProductElement.XPathSelectElement("./prefix:Icon", namespaceManager);
			Console.WriteLine("Icon");
			print_xattribute(IconElement.Attribute("Id"), IconElement.Attribute("SourceFile"));


			XElement DirectoryElement = ProductElement.XPathSelectElement(".//prefix:Directory[@Id='INSTALLDIR']", namespaceManager);
			Console.WriteLine("Directory");
			print_xattribute(DirectoryElement.Attribute("Id"), DirectoryElement.Attribute("Name"));



			XElement FeatureElement = ProductElement.XPathSelectElement("./prefix:Feature", namespaceManager);
			Console.WriteLine("Feature");
			print_xattribute(FeatureElement.Attribute("Id"), FeatureElement.Attribute("Level"));

			// removed components and features
			foreach (XElement ComponentElement in ProductElement.XPathSelectElements(".//prefix:Component", namespaceManager).ToList())
			{
				if (ComponentElement.Attribute("Id").Value != "ProgramMenuDir")
				{
					ComponentElement.Remove();
				}
			}

			foreach (XElement ComponentRefElement in FeatureElement.XPathSelectElements(".//prefix:ComponentRef", namespaceManager).ToList())
			{
				if (ComponentRefElement.Attribute("Id").Value != "ProgramMenuDir")
				{
					ComponentRefElement.Remove();
				}
			}

			AddComponents(DirectoryElement, FeatureElement, new System.IO.DirectoryInfo(output_directory_path));

			Console.WriteLine("Components");
			foreach (XElement ComponentElement in ProductElement.XPathSelectElements(".//prefix:Component", namespaceManager))
			{
				ComponentElement.Attribute("Guid").SetValue(get_id(ComponentElement.Attribute("Id").Value));

				print_xattribute(ComponentElement.Attribute("Id"), ComponentElement.Attribute("Guid"));
				XElement FileElement = ComponentElement.XPathSelectElement("./prefix:File", namespaceManager);
				if (FileElement != null)
				{
					print_xattribute(FileElement.Attribute("Id"), FileElement.Attribute("Name"));
				}

				/*
				XElement new_node = new_file_node();
				new_node.Add(new_short_cut_node());
				ComponentElement.Add(new_node);
				*/
			}
			Console.WriteLine("ComponentRefs");
			foreach (XElement ComponentRefElement in ProductElement.XPathSelectElements(".//prefix:ComponentRef", namespaceManager))
			{
				print_xattribute(ComponentRefElement.Attribute("Id"));
			}


			wix_doc.Save(wix_file_name);

			string text = File.ReadAllText(wix_file_name);
			text = System.Text.RegularExpressions.Regex.Replace(text, "xmlns=\"\"", "");
			File.WriteAllText(output_directory_path + "\\" + wix_file_name, text);

			System.Text.StringBuilder name_hash_file_builder = new StringBuilder();
			foreach (System.Collections.Generic.KeyValuePair<string, string> kvp in name_hash_list)
			{
				name_hash_file_builder.Append(kvp.Key);
				name_hash_file_builder.Append(",");
				name_hash_file_builder.AppendLine(kvp.Value);
			}
			System.IO.File.WriteAllText(name_hash_file_name, name_hash_file_builder.ToString());

			//var FieldsTypeIDs = from _FieldTypeID in wix_doc.Descendants("Field") select _FieldTypeID;

			//double width, height;



			//string checkcode = ViewElement.Attribute("CheckCode").Value.ToString();

			/*
			
			StringBuilder JavaScript = new StringBuilder();
			StringBuilder VariableDefinitions = new StringBuilder();

			XDocument xdocResponse = XDocument.Parse("");

			XDocMetadata.RequiredFieldsList = xdocResponse.Root.Attribute("RequiredFieldsList").Value;
			XDocMetadata.HiddenFieldsList = xdocResponse.Root.Attribute("HiddenFieldsList").Value;
			XDocMetadata.HighlightedFieldsList = xdocResponse.Root.Attribute("HighlightedFieldsList").Value;
			XDocMetadata.DisabledFieldsList = xdocResponse.Root.Attribute("DisabledFieldsList").Value;

			*/

		}

		static private string get_id(string p_key)
		{
			string result = null;

			if (name_hash_list.ContainsKey(p_key))
			{
				result = name_hash_list[p_key];
			}
			else
			{
				result = Guid.NewGuid().ToString();
				name_hash_list.Add(p_key, result);
			}

			return result;
		}



		static private void print_xattribute(XAttribute value)
		{
			Console.WriteLine(string.Format("\t{0}", value));
		}

		static private void print_xattribute(XAttribute value_1, XAttribute value_2)
		{
			Console.WriteLine(string.Format("\t{0} {1}", value_1, value_2));
		}

		static private void AddComponents(XElement DirectoryElement, XElement FeatureElement, System.IO.DirectoryInfo directoryInfo)
		{

			FileInfo[] fileInfoSet = directoryInfo.GetFiles();
			foreach (FileInfo fileInfo in fileInfoSet)
			{
				if (fileInfo.Name.Equals("mmria-server.exe", StringComparison.OrdinalIgnoreCase))
				{
					XElement MainComponent = get_main_component(fileInfo);
					DirectoryElement.Add(MainComponent);
					FeatureElement.Add(create_component_ref(MainComponent.Attribute("Id").Value));
				}
				else
				{
					string component_name = get_component_name(fileInfo.FullName.ToUpper().Replace(output_directory_path.ToUpper(), ""));
					DirectoryElement.Add(get_component(fileInfo));
					FeatureElement.Add(create_component_ref(component_name));
				}

			}

			foreach (System.IO.DirectoryInfo di in directoryInfo.GetDirectories())
			{
				string directoryName = di.FullName;

				System.Console.WriteLine(directoryName);

				XElement directory = create_directory(di);
				DirectoryElement.Add(directory);

				AddComponents(directory, FeatureElement, di);
			}


		}

		static private XElement create_directory(System.IO.DirectoryInfo p_directory_info)
		{
			string file_name = p_directory_info.Name;
			XElement result = new XElement
				(
					"Directory",
					new XAttribute("Id", get_component_name(p_directory_info.FullName.ToUpper().Replace(output_directory_path.ToUpper(), ""))),
					new XAttribute("Name", file_name)
				);
			/*
			            < Directory Id = "HTML" Name = "app" >
*/

			return result;
		}

		static private XElement create_component_ref(string p_name)
		{
			//< ComponentRef Id = "ProgramMenuDir" />
			XElement result = new XElement
				(
					"ComponentRef",
					new XAttribute("Id", p_name)
				);
			return result;

		}

		static string get_component_name(string p_file_name)
		{
			string result = System.Text.RegularExpressions.Regex.Replace(p_file_name.ToUpper(), "-", "_");
			result = System.Text.RegularExpressions.Regex.Replace(result, ":", "");
			result = System.Text.RegularExpressions.Regex.Replace(result, "\\\\", "");
			result = System.Text.RegularExpressions.Regex.Replace(result, "^(\\d)", delegate (System.Text.RegularExpressions.Match match)
		{
			string v = match.ToString();
			return "_" + v;
		});
			return result;
		}

		static private XElement get_component(System.IO.FileInfo p_file_info)
		{
			string file_name = get_component_name(p_file_info.FullName.ToUpper().Replace(output_directory_path.ToUpper(), ""));
			XElement result = new XElement
				(
					"Component",
					new XAttribute("Id", file_name),
					new XAttribute("Guid", get_id(p_file_info.FullName)),
					new_file_node(p_file_info)
				);
			/*
			            <Component Id="HelperLibrary" Guid="bc80dba1-5013-4bcb-9604-9cc9d4a30380">
              <File Id="HelperDLL" Name="Helper.dll" DiskId="1" Source="Helper.dll" KeyPath="yes" />
			
						</ Component >
*/

			return result;
		}


		static private XElement get_main_component(System.IO.FileInfo p_file_info)
		{
			string file_name = p_file_info.Name;
			XElement result = new XElement
				(
					"Component",
					new XAttribute("Id", "MainExecutable"),
					new XAttribute("Guid", get_id(p_file_info.FullName)),
					new_file_node(p_file_info),
					get_shortcut("startmenummria1.2.0", "ProgramMenuDir", "MMRIA 1.2.0", "mmria_server.exe"),
					get_shortcut("desktopmmria1.2.0", "DesktopFolder", "MMRIA 1.2.0", "mmria_server.exe")
				);
			/*
		            <Component Id = 'MainExecutable' Guid='YOURGUID-83F1-4F22-985B-FDB3C8ABD471'>
              <File Id = 'FoobarEXE' Name='FoobarAppl10.exe' DiskId='1' Source='FoobarAppl10.exe' KeyPath='yes'>
                <Shortcut Id = "startmenuFoobar10" Directory="ProgramMenuDir" Name="Foobar 1.0" WorkingDirectory='INSTALLDIR' Icon="Foobar10.exe" IconIndex="0" Advertise="yes" />
                <Shortcut Id = "desktopFoobar10" Directory="DesktopFolder" Name="Foobar 1.0" WorkingDirectory='INSTALLDIR' Icon="Foobar10.exe" IconIndex="0" Advertise="yes" />
              </File>
            </Component>
*/

			return result;
		}


		static private XElement get_shortcut(string p_id, string p_directory, string p_name, string p_icon)
		{

			XElement result = new XElement
				(
					"Shortcut",
					new XAttribute("Id", p_id),
					new XAttribute("Directory", p_directory),
					new XAttribute("Name", p_name),
					new XAttribute("WorkingDirectory", "INSTALLDIR"),
					new XAttribute("Icon", p_icon),
					new XAttribute("IconIndex", "0"),
					new XAttribute("Advertise", "yes")
				);
			/*
		        <Shortcut Id = "startmenuFoobar10" Directory="ProgramMenuDir" Name="Foobar 1.0" WorkingDirectory='INSTALLDIR' Icon="Foobar10.exe" IconIndex="0" Advertise="yes" />
                <Shortcut Id = "desktopFoobar10" Directory="DesktopFolder" Name="Foobar 1.0" WorkingDirectory='INSTALLDIR' Icon="Foobar10.exe" IconIndex="0" Advertise="yes" />

*/

			return result;
		}

		static public XElement new_file_node(System.IO.FileInfo p_file_info)
		{
			/*
			  <File 
				Id = 'FoobarEXE'
				Name = 'FoobarAppl10.exe' 
				DiskId = '1' 
				Source = 'FoobarAppl10.exe' 
				KeyPath = 'yes' >	
			*/
			//XNamespace ns = "http://schemas.microsoft.com/wix/2006/wi";

			string file_name = get_component_name(p_file_info.FullName.ToUpper().Replace(output_directory_path.ToUpper(),""));

			XElement result = new XElement
				(
				"File",
				new XAttribute("Id", file_name),
				new XAttribute("Name", p_file_info.Name),
				new XAttribute("DiskId", "1"),
					new XAttribute("Source", p_file_info.FullName),
				new XAttribute("KeyPath", "yes")
				);


				return result;
		}


		static public XElement new_short_cut_node()
		{
			/*
			  <Shortcut
			  	Id="desktopFoobar10"
			  	Directory="DesktopFolder"
			  	Name="Foobar 1.0"
			  	WorkingDirectory="INSTALLDIR"
			  	Icon="Foobar10.exe"
			  	IconIndex="0"
			  	Advertise="yes"
			  	/>	
			*/

			XElement result = new XElement
				(
				"File",
				new XAttribute("Id", "desktopFoobar10"),
				new XAttribute("Directory", "DesktopFolder"),
				new XAttribute("Name", "Foobar 1.0"),
				new XAttribute("WorkingDirectory", "INSTALLDIR"),
				new XAttribute("Icon", "Foobar10.exe"),
				new XAttribute("IconIndex", "0"),
				new XAttribute("Advertise", "yes")
				);

			return result;
		}

		static public string get_xml_template()
		{
			Stream resourceStream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream("install.setup.mmria.wxs");
			StreamReader reader = new StreamReader(resourceStream);
			string result = reader.ReadToEnd();




			return result;
		}


		static public string GetHash(string file_path)
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

	}
}
