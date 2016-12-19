using System;
using System.Data;


namespace importer
{
	class MainClass
	{
		public static void Main (string[] args)
		{

			var data = new cData ("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=Maternal_Mortlity.mdb;User ID=;Password=;");


			var rs = data.GetDataTable ("Select * from AutopsyReport");

			foreach (System.Data.DataRow row in rs.Rows) 
			{
				Console.WriteLine (row[1].ToString());
			}

			Console.WriteLine ("Hello World!");
		}
	}
}
