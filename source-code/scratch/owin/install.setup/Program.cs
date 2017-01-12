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
		public static void Main(string[] args)
		{
			//Console.WriteLine("Hello World!");

			string xml = get_xml_template();


			var xmlReader = XmlReader.Create(new StringReader(xml));
			XDocument wix_doc  = XDocument.Load(xmlReader);
			var namespaceManager = new XmlNamespaceManager(xmlReader.NameTable);
			namespaceManager.AddNamespace("prefix", "http://schemas.microsoft.com/wix/2006/wi");


			XElement ProductElement = wix_doc.XPathSelectElement("prefix:Wix/prefix:Product", namespaceManager);
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


			XElement DirectoryElement = ProductElement.XPathSelectElement("./prefix:Directory", namespaceManager);
			Console.WriteLine("Directory");
			print_xattribute(DirectoryElement.Attribute("Id"), DirectoryElement.Attribute("Name"));


			XElement FeatureElement = ProductElement.XPathSelectElement("./prefix:Feature", namespaceManager);
			Console.WriteLine("Feature");
			print_xattribute(FeatureElement.Attribute("Id"), FeatureElement.Attribute("Level"));

			Console.WriteLine("Components");
			foreach (XElement ComponentElement in ProductElement.XPathSelectElements(".//prefix:Component", namespaceManager))
			{
				print_xattribute(ComponentElement.Attribute("Id"), ComponentElement.Attribute("Guid"));
				XElement FileElement = ComponentElement.XPathSelectElement("./prefix:File", namespaceManager);
				if (FileElement != null)
				{
					print_xattribute(FileElement.Attribute("Id"), FileElement.Attribute("Name"));
				}
			}
			Console.WriteLine("ComponentRefs");
			foreach (XElement ComponentRefElement in ProductElement.XPathSelectElements(".//prefix:ComponentRef", namespaceManager))
			{
				print_xattribute(ComponentRefElement.Attribute("Id"));
			}


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

		static private void print_xattribute(XAttribute value)
		{
			Console.WriteLine(string.Format("\t{0}", value));
		}

		static private void print_xattribute(XAttribute value_1, XAttribute value_2)
		{
			Console.WriteLine(string.Format("\t{0} {1}", value_1, value_2));
		}

		private void DeleteNonMaxRes(string ImageName, System.IO.DirectoryInfo directoryInfo)
		{
			if (!directoryInfo.FullName.Contains("MaxRes"))
			{
				FileInfo[] fileInfoSet = directoryInfo.GetFiles();
				foreach (FileInfo fileInfo in fileInfoSet)
				{
					string FileName = fileInfo.Name.Substring(0, fileInfo.Name.Length - fileInfo.Extension.Length);
					if (FileName != "NoImage" && FileName == ImageName)
					{

					}
				}

				foreach (System.IO.DirectoryInfo di in directoryInfo.GetDirectories())
				{
					string directoryName = di.FullName;

					System.Console.WriteLine(directoryName);

					DeleteNonMaxRes(ImageName, di);
				}
			}
			else
			{

			}

		}

		static public string get_xml_template()
		{
			Stream resourceStream = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream("install.setup.mmria.wxs");
			StreamReader reader = new StreamReader(resourceStream);
			string result = reader.ReadToEnd();




			return result;
		}
	}
}
