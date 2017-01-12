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
			Console.WriteLine("Hello World!");

			string xml = get_xml_template();


			var xmlReader = XmlReader.Create(new StringReader(xml));
			XDocument wix_doc  = XDocument.Load(xmlReader);
			var namespaceManager = new XmlNamespaceManager(xmlReader.NameTable);
			namespaceManager.AddNamespace("prefix", "http://schemas.microsoft.com/wix/2006/wi");


			XElement ViewElement = wix_doc.XPathSelectElement("prefix:Wix/prefix:Product", namespaceManager);


			Console.WriteLine(ViewElement.Attribute("Name"));
			Console.WriteLine(ViewElement.Attribute("Id"));

			var FieldsTypeIDs = from _FieldTypeID in wix_doc.Descendants("Field") select _FieldTypeID;

			double width, height;



			string checkcode = ViewElement.Attribute("CheckCode").Value.ToString();
			StringBuilder JavaScript = new StringBuilder();
			StringBuilder VariableDefinitions = new StringBuilder();

			XDocument xdocResponse = XDocument.Parse("");

			/*
			XDocMetadata.RequiredFieldsList = xdocResponse.Root.Attribute("RequiredFieldsList").Value;
			XDocMetadata.HiddenFieldsList = xdocResponse.Root.Attribute("HiddenFieldsList").Value;
			XDocMetadata.HighlightedFieldsList = xdocResponse.Root.Attribute("HighlightedFieldsList").Value;
			XDocMetadata.DisabledFieldsList = xdocResponse.Root.Attribute("DisabledFieldsList").Value;

			*/

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
