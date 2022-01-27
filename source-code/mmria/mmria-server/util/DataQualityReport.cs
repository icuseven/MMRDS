using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;
using mmria.server;

namespace mmria.server.utils
{

    public class Quarters
    {
		private string _selectedQuarter = "";

		public string SelectedQuarter
		{
			get
			{
				return _selectedQuarter;
			}
			set
			{
				_selectedQuarter = value.ToString();
			}
		}

		public static List<string> GetQuarters()
		{
			var retList = new List<string>();
			retList.Add("Q1 2022");
			retList.Add("Q4 2021");
			retList.Add("Q3 2021");
			retList.Add("Q2 2021");
			retList.Add("Q1 2021");
			retList.Add("Q4 2020");
			retList.Add("Q3 2020");
			retList.Add("Q2 2020");
			retList.Add("Q1 2020");
			return retList;
		}

	// 	public void UpdateSelectedQuarter( selectedQuarter )
	// 	{
	// 		return _selectedQuarter = selectedQuarter;
	// 	} 

		// public void SetSelectedQuarter( value )
		// {
		// 	SelectedQuarter = value.ToString();
		// }
    }

}